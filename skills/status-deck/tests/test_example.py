import os

from status_deck.brief import load_brief
from status_deck.build import build_deck


def test_example_builds(tmp_path):
    b = load_brief("examples/example_brief.yaml")
    out = build_deck(b, str(tmp_path / "example.pptx"))
    assert os.path.getsize(out) > 0
