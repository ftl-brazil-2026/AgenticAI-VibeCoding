#!/usr/bin/env python3
"""Fail when rendered HTML contains an empty or missing local reference.

Checks local file targets and static HTML fragments. A line containing the
comment ``<!-- link-check-ignore-fragment -->`` skips fragment validation for
references on that line; ``<!-- link-check-ignore -->`` skips them entirely.
Use the fragment marker only for anchors implemented in JavaScript.
"""

import sys
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

REFERENCE_ATTRIBUTES = {
    "a": {"href"},
    "area": {"href"},
    "audio": {"src"},
    "embed": {"src"},
    "iframe": {"src"},
    "img": {"src"},
    "input": {"src"},
    "link": {"href"},
    "script": {"src"},
    "source": {"src"},
    "track": {"src"},
    "video": {"poster", "src"},
}


@dataclass(frozen=True)
class Reference:
    source: Path
    line: int
    tag: str
    attribute: str
    value: str | None


IGNORE_REFERENCE = "link-check-ignore"
IGNORE_FRAGMENT = "link-check-ignore-fragment"


class PageParser(HTMLParser):
    def __init__(self, source: Path):
        super().__init__(convert_charrefs=True)
        self.source = source
        self.references: list[Reference] = []
        self.anchors: set[str] = set()
        self.lines: list[str] = []

    def handle_starttag(self, tag, attrs):
        self._record(tag, attrs)

    def handle_startendtag(self, tag, attrs):
        self._record(tag, attrs)

    def _record(self, tag, attrs):
        line, _ = self.getpos()
        wanted = REFERENCE_ATTRIBUTES.get(tag, set())
        for attribute, value in attrs:
            if attribute in {"id", "name"} and value:
                self.anchors.add(value)
            if attribute in wanted:
                self.references.append(
                    Reference(self.source, line, tag, attribute, value)
                )

    def suppression_on(self, line: int) -> str | None:
        """Return the suppression marker found on a 1-based line, if any."""
        if not 1 <= line <= len(self.lines):
            return None
        text = self.lines[line - 1]
        if IGNORE_FRAGMENT in text:
            return IGNORE_FRAGMENT
        if IGNORE_REFERENCE in text:
            return IGNORE_REFERENCE
        return None


def parse_page(path: Path) -> PageParser:
    parser = PageParser(path)
    text = path.read_text(encoding="utf-8", errors="replace")
    parser.lines = text.splitlines()
    parser.feed(text)
    return parser


def display_path(path: Path) -> str:
    try:
        return str(path.relative_to(Path.cwd()))
    except ValueError:
        return str(path)


def check_site(output_dir: Path) -> list[str]:
    root = output_dir.resolve()
    if not root.is_dir():
        return [f"{display_path(output_dir)}: output directory does not exist"]

    pages = sorted(root.rglob("*.html"))
    parsed_pages = {page: parse_page(page) for page in pages}
    errors: list[str] = []

    for page, parser in list(parsed_pages.items()):
        for reference in parser.references:
            location = f"{display_path(page)}:{reference.line}"
            value = reference.value
            if parser.suppression_on(reference.line) == IGNORE_REFERENCE:
                continue
            if value is None or not value.strip():
                errors.append(
                    f'{location}: empty {reference.attribute} on <{reference.tag}>'
                )
                continue

            parts = urlsplit(value)
            if parts.scheme or parts.netloc:
                continue

            decoded_path = unquote(parts.path)
            if decoded_path.startswith("/"):
                target = root / decoded_path.lstrip("/")
            elif decoded_path:
                target = page.parent / decoded_path
            else:
                target = page
            target = target.resolve()

            try:
                target.relative_to(root)
            except ValueError:
                errors.append(
                    f'{location}: {reference.attribute}="{value}" escapes the site output'
                )
                continue

            if decoded_path.endswith("/") or target.is_dir():
                target = target / "index.html"

            if not target.is_file():
                errors.append(
                    f'{location}: {reference.attribute}="{value}" has no local target'
                )
                continue

            fragment = unquote(parts.fragment)
            if (
                not fragment
                or fragment.startswith(":~:text=")
                or target.suffix.lower() not in {".htm", ".html"}
                or parser.suppression_on(reference.line) == IGNORE_FRAGMENT
            ):
                continue

            target_parser = parsed_pages.get(target)
            if target_parser is None:
                target_parser = parse_page(target)
                parsed_pages[target] = target_parser
            if fragment not in target_parser.anchors:
                errors.append(
                    f'{location}: {reference.attribute}="{value}" has no matching anchor'
                )

    if not errors:
        reference_count = sum(len(page.references) for page in parsed_pages.values())
        print(
            f"checked {len(pages)} HTML files and {reference_count} references: "
            "no empty or missing internal references"
        )
    return errors


def main() -> int:
    output_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("docs")
    errors = check_site(output_dir)
    for error in errors:
        print(error, file=sys.stderr)
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
