import pytest
from status_deck.brief import validate_brief, BriefError, KNOWN_TYPES


def _ok():
    return {
        "meta": {
            "title": "T",
            "parties": ["Anyreach"],
            "date": "19 Aug 2026",
            "status": "amber",
        },
        "executive_summary": {
            "headline": "H",
            "status": "amber",
            "points": ["a"],
            "visual": "none",
        },
        "slides": [{"type": "table", "title": "X", "columns": ["A"], "rows": [["1"]]}],
        "appendix": [],
    }


def test_valid_passes():
    validate_brief(_ok())


def test_unknown_type_rejected():
    b = _ok()
    b["slides"][0]["type"] = "donut3d"
    with pytest.raises(BriefError):
        validate_brief(b)


def test_missing_meta_title_rejected():
    b = _ok()
    del b["meta"]["title"]
    with pytest.raises(BriefError):
        validate_brief(b)


def test_bad_status_rejected():
    b = _ok()
    b["meta"]["status"] = "blue"
    with pytest.raises(BriefError):
        validate_brief(b)
