"""Build the example deck from examples/example_brief.yaml.

Run from the repo root:
    ./.venv/bin/python examples/make_example.py

Writes examples/example.pptx.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # run without installing the package

from status_deck.brief import load_brief
from status_deck.build import build_deck

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    brief_path = os.path.join(HERE, "example_brief.yaml")
    out_path = os.path.join(HERE, "example.pptx")
    brief = load_brief(brief_path)
    out = build_deck(brief, out_path)
    print(f"wrote {out}")


if __name__ == "__main__":
    main()
