import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

from check_internal_links import check_site


def write(root: Path, name: str, content: str) -> Path:
    path = root / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return path


def build_site(tmp_path):
    root = tmp_path / "docs"
    write(
        root,
        "index.html",
        """
<h1 id="top">Home</h1>
<a href="ok.html#section">valid fragment</a>
<a href="#top">valid self fragment</a>
""",
    )
    write(
        root,
        "ok.html",
        '<section id="section"><p>Target</p></section>',
    )
    return root


def messages(errors):
    return "\n".join(errors)


def test_valid_site_passes(tmp_path):
    root = build_site(tmp_path)
    assert check_site(root) == []


def test_broken_fragment_fails(tmp_path):
    root = build_site(tmp_path)
    write(root, "bad.html", '<a href="ok.html#missing">broken</a>')
    errors = check_site(root)
    assert len(errors) == 1
    assert "no matching anchor" in messages(errors)


def test_broken_self_fragment_fails(tmp_path):
    root = build_site(tmp_path)
    write(root, "bad.html", '<a href="#missing">broken</a>')
    errors = check_site(root)
    assert len(errors) == 1
    assert "no matching anchor" in messages(errors)


def test_fragment_suppression_marker_skips_anchor_check(tmp_path):
    root = build_site(tmp_path)
    write(
        root,
        "js.html",
        '<a href="#js-card">card</a> <!-- link-check-ignore-fragment -->',
    )
    assert check_site(root) == []


def test_reference_suppression_marker_skips_everything(tmp_path):
    root = build_site(tmp_path)
    write(
        root,
        "raw.html",
        '<a href="missing.html">x</a> <!-- link-check-ignore -->',
    )
    assert check_site(root) == []


def test_empty_and_missing_and_escaping_references_fail(tmp_path):
    root = build_site(tmp_path)
    write(
        root,
        "bad.html",
        '<a href="">empty</a>\n'
        '<img src="missing.png">\n'
        '<a href="../outside.html">escape</a>',
    )
    errors = check_site(root)
    assert len(errors) == 3
    text = messages(errors)
    assert "empty href" in text
    assert "no local target" in text
    assert "escapes the site output" in text


def test_text_fragments_are_skipped(tmp_path):
    root = build_site(tmp_path)
    write(root, "text.html", '<a href="ok.html#:~:text=Target">text</a>')
    assert check_site(root) == []


def test_non_html_fragment_target_is_skipped(tmp_path):
    root = build_site(tmp_path)
    write(root, "doc.pdf", "%PDF")
    write(root, "p.html", '<a href="doc.pdf#page=2">pdf</a>')
    assert check_site(root) == []
