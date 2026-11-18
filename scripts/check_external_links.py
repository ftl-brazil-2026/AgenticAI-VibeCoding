#!/usr/bin/env python3
"""Check external links in rendered HTML and write a machine-readable report."""

import argparse
import concurrent.futures
import ipaddress
import json
import socket
import ssl
import time
from collections import Counter, defaultdict
from dataclasses import asdict, dataclass
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urldefrag, urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener

USER_AGENT = "AgenticAI-VibeCoding-link-check/1.0"
UNVERIFIED_STATUSES = {401, 403, 405, 429}
TRANSIENT_STATUSES = {408, 425, 500, 502, 503, 504}


class ExternalLinkParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links: list[tuple[int, str]] = []

    def handle_starttag(self, tag, attrs):
        if tag not in {"a", "area", "audio", "embed", "iframe", "img", "link", "script", "source", "track", "video"}:
            return
        line, _ = self.getpos()
        for attribute, value in attrs:
            if attribute in {"href", "src", "poster"} and value:
                scheme = urlsplit(value).scheme.lower()
                if scheme in {"http", "https"}:
                    self.links.append((line, urldefrag(value).url))


@dataclass(frozen=True)
class LinkResult:
    url: str
    status: str
    http_status: int | None
    final_url: str | None
    attempts: int
    detail: str
    sources: tuple[str, ...]


class PublicOnlyRedirectHandler(HTTPRedirectHandler):
    def redirect_request(self, request, file_pointer, code, message, headers, new_url):
        ensure_public_url(new_url)
        return super().redirect_request(
            request, file_pointer, code, message, headers, new_url
        )


def ensure_public_url(url: str) -> None:
    parsed = urlsplit(url)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise ValueError("URL is not public HTTP(S)")
    if parsed.username is not None or parsed.password is not None:
        raise ValueError("URL contains credential userinfo")

    port = parsed.port or (443 if parsed.scheme == "https" else 80)
    if port not in {80, 443}:
        raise ValueError(f"URL uses non-standard port {port}")

    addresses = {
        result[4][0]
        for result in socket.getaddrinfo(parsed.hostname, port, type=socket.SOCK_STREAM)
    }
    if not addresses:
        raise ValueError("hostname resolved to no addresses")
    for address in addresses:
        if not ipaddress.ip_address(address).is_global:
            raise ValueError(f"hostname resolves to non-public address {address}")


def request_url(url: str, timeout: float) -> tuple[int, str]:
    ensure_public_url(url)
    opener = build_opener(PublicOnlyRedirectHandler())
    headers = {"User-Agent": USER_AGENT, "Accept": "text/html,*/*;q=0.8"}

    try:
        with opener.open(
            Request(url, headers=headers, method="HEAD"), timeout=timeout
        ) as response:
            return response.status, response.geturl()
    except HTTPError:
        # Some valid sites return 4xx for HEAD while serving GET normally.
        pass

    with opener.open(
        Request(url, headers=headers, method="GET"), timeout=timeout
    ) as response:
        return response.status, response.geturl()


def classify_http_status(status: int) -> str:
    if 200 <= status < 400:
        return "ok"
    if status in UNVERIFIED_STATUSES:
        return "unverified"
    if status in TRANSIENT_STATUSES:
        return "transient"
    return "broken"


def check_url(
    url: str,
    sources: tuple[str, ...],
    *,
    timeout: float,
    retries: int,
) -> LinkResult:
    attempts = 0
    last_detail = ""
    last_status: int | None = None

    for attempt in range(retries + 1):
        attempts = attempt + 1
        try:
            status, final_url = request_url(url, timeout)
            classification = classify_http_status(status)
            if classification == "transient" and attempt < retries:
                time.sleep(2**attempt)
                continue
            if classification == "transient":
                classification = "unverified"
            return LinkResult(
                url,
                classification,
                status,
                final_url,
                attempts,
                f"HTTP {status}",
                sources,
            )
        except HTTPError as error:
            last_status = error.code
            classification = classify_http_status(error.code)
            last_detail = f"HTTP {error.code}"
            if classification == "transient" and attempt < retries:
                time.sleep(2**attempt)
                continue
            if classification == "transient":
                classification = "unverified"
            return LinkResult(
                url,
                classification,
                error.code,
                error.geturl(),
                attempts,
                last_detail,
                sources,
            )
        except (OSError, URLError, ValueError, ssl.SSLError) as error:
            last_detail = f"{type(error).__name__}: {error}"
            if attempt < retries:
                time.sleep(2**attempt)
                continue

    return LinkResult(
        url,
        "unverified",
        last_status,
        None,
        attempts,
        last_detail,
        sources,
    )


def collect_links(output_dir: Path) -> dict[str, tuple[str, ...]]:
    root = output_dir.resolve()
    links: dict[str, list[str]] = defaultdict(list)
    for page in sorted(root.rglob("*.html")):
        parser = ExternalLinkParser()
        parser.feed(page.read_text(encoding="utf-8", errors="replace"))
        for line, url in parser.links:
            source = f"{page.relative_to(root)}:{line}"
            if source not in links[url]:
                links[url].append(source)
    return {url: tuple(sources) for url, sources in links.items()}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("output_dir", nargs="?", default="docs")
    parser.add_argument("--report", default="external-links.json")
    parser.add_argument("--timeout", type=float, default=12.0)
    parser.add_argument("--retries", type=int, default=2)
    parser.add_argument("--workers", type=int, default=8)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    output_dir = Path(args.output_dir)
    links = collect_links(output_dir)
    results: list[LinkResult] = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as executor:
        futures = {
            executor.submit(
                check_url,
                url,
                sources,
                timeout=args.timeout,
                retries=args.retries,
            ): url
            for url, sources in links.items()
        }
        for future in concurrent.futures.as_completed(futures):
            results.append(future.result())

    results.sort(key=lambda result: (result.status, result.url))
    counts = Counter(result.status for result in results)
    report = {
        "summary": {status: counts.get(status, 0) for status in ("ok", "unverified", "broken")},
        "results": [asdict(result) for result in results],
    }
    Path(args.report).write_text(
        json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8"
    )

    print(
        f"checked {len(results)} external URLs: "
        f"{counts.get('ok', 0)} ok, "
        f"{counts.get('unverified', 0)} unverified, "
        f"{counts.get('broken', 0)} broken"
    )
    for result in results:
        if result.status != "ok":
            print(f"{result.status}: {result.url} ({result.detail})")

    return 1 if counts.get("broken", 0) else 0


if __name__ == "__main__":
    raise SystemExit(main())
