# status-deck

A self contained tool and Claude skill that builds MBB style status and agenda decks as a native
PPTX file, in the Anyreach brand, from a brief. The brief can be supplied directly, or built
through a short question and answer discovery flow. See `SKILL.md` for the full workflow and the
brief schema, and `DESIGN.md` for the design spec behind the build.

For steering committee and CXO decks, `CXO_GUIDELINES.md` sets the rules the assistant follows
from brief to read-back.

## Install

From the folder:

```
pip install -r requirements.txt
```

Or with a virtual environment:

```
python -m venv .venv
./.venv/bin/pip install -r requirements.txt
```

The only required dependency is `python-pptx`, plus `PyYAML` for loading a brief from a YAML
file. LibreOffice is optional. If it is installed on the machine, the build can render the deck
to PDF for a numbers read back. If it is not installed, open the PPTX file directly instead.

## Quick start

```
python examples/make_example.py
```

This loads `examples/example_brief.yaml` and writes `examples/example.pptx`, a full worked
example covering every slide type: KPI tiles, a schedule, progress bars, a decisions log, a
table, and a progress donut, plus an appendix with a table and a bar chart.

To build your own deck:

```python
from status_deck.brief import load_brief
from status_deck.build import build_deck

brief = load_brief("path/to/brief.yaml")
build_deck(brief, "out.pptx")
```

A brief is a plain dict, or a YAML file that loads to the same shape. It has three parts: `meta`
(title, parties, date, status, footer, confidential), `executive_summary` (headline, status,
up to five points, an optional visual), and the slide lists `slides` and `appendix`. See
`SKILL.md` for the full schema of every slide type and its fields. The embedded executive summary
`visual` is experimental and can overlap the headline and points; prefer `visual: none` and put
the plan and progress on their own slides.

## Discovery flow, in brief

If no brief exists yet, the skill asks one plain question at a time for: purpose and audience,
the three to five headline messages, the plan, the progress items, the decisions, the pending
asks, and what belongs in the appendix. It then assembles a brief, confirms it, and only then
builds the deck. Full detail is in `SKILL.md`.

## Discipline

Every brief is run through a linter before the deck is built. The linter blocks em dashes, en
dashes, arrow characters, and decorative glyphs, and warns on long sentences and filler wording. A
blocking issue stops the build.

## How to share

This folder is portable and has no machine specific paths and no client names in it.

- Zip the folder and share it, or copy it as is.
- To install it as a Claude skill, unzip it into `~/.claude/skills/`.
- To use it standalone, install the requirements and call `build_deck` as shown above, or run
  `python examples/make_example.py` to see a full example.
