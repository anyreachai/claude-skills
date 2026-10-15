from status_deck.verify import lint_brief, has_blocking, render_to_pdf
import tempfile
import os

def test_em_dash_blocks():
    issues=lint_brief({"meta":{"title":"a — b"}})
    assert has_blocking(issues)

def test_arrow_blocks():
    assert has_blocking(lint_brief({"meta":{"title":"x → y"}}))

def test_clean_passes():
    assert not has_blocking(lint_brief({"meta":{"title":"All clear, plain words."}}))

def test_long_sentence_warns():
    long=" ".join(["word"]*45)+"."
    issues=lint_brief({"meta":{"title":long}})
    assert any(i.level=="warn" for i in issues) and not has_blocking(issues)

def test_render_to_pdf_absent_libreoffice(monkeypatch):
    """render_to_pdf returns None when LibreOffice is absent (hermetic test)."""
    import status_deck.verify as verify
    monkeypatch.setattr(verify.shutil, "which", lambda name: None)
    with tempfile.TemporaryDirectory() as tmpdir:
        fake_path = os.path.join(tmpdir, "nonexistent.pptx")
        result = render_to_pdf(fake_path, tmpdir)
        assert result is None

def test_multiple_banned_chars():
    """Test that multiple banned characters each produce a blocking issue."""
    issues=lint_brief({"meta":{"title":"a — b • c"}})
    assert has_blocking(issues)
    blocks=[i for i in issues if i.level=="block"]
    assert len(blocks)>=2  # em dash and bullet

def test_nested_dict():
    """Test that linting walks nested structures."""
    issues=lint_brief({"meta":{"title":"ok"},"content":{"slides":[{"text":"x → y"}]}})
    assert has_blocking(issues)

def test_hedge_words_warn():
    """Test that hedge words produce warnings, not blocks."""
    issues=lint_brief({"meta":{"title":"simply put, it is done"}})
    warns=[i for i in issues if i.level=="warn" and "hedge" in i.reason]
    assert len(warns)>0 and not has_blocking(issues)
