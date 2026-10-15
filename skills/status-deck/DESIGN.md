# status-deck: design spec

A shareable Claude skill that builds MBB-style status and agenda presentations as PPTX, in the
Anyreach brand, from either a supplied brief or an interactive discovery flow. Self-contained folder,
zippable, no dependency on any one machine or repo, no client names inside it.

## Purpose

Produce a presenting deck where the executive summary carries the message and all detail sits in an
appendix. Plan and progress are shown visually, not as prose. One design suite of reusable slide
generators, one brand theme, plain fact-checked English.

## Output and dependencies

- Output: a `.pptx` file, 16:9, built with `python-pptx`.
- Dependencies: `python-pptx` and `PyYAML` (for loading a brief from a YAML file). Recorded in
  `requirements.txt`.
- Optional at verify time: LibreOffice headless, used only to render the deck to PDF for read-back. If
  absent, the skill tells the user to open the file; it never blocks the build.

## Folder layout (what gets zipped)

```
status-deck/
  SKILL.md              instructions: when to use, workflow, MBB rules, discipline, how to build
  README.md             install (pip install python-pptx), usage, how to share
  requirements.txt      python-pptx
  DESIGN.md             this spec
  CXO_GUIDELINES.md     rules for steering committee and CXO decks: story, numbers, infographics, read-back
  status_deck/          the package
    __init__.py
    theme.py            Theme dataclass, Anyreach default tokens, neutral fallbacks
    deck.py             Deck: new 16:9 presentation, add slide, title/footer/confidential, appendix divider, save
    blocks.py           shared primitives: header band, section header, text box, table cell, RAG chip, footnote
    brief.py            brief schema, load from dict or YAML, validation
    build.py            orchestrates a brief into a deck, enforces MBB ordering
    verify.py           text discipline linter + optional LibreOffice render-to-PDF
    slides/
      exec_summary.py
      gantt.py
      milestone_path.py
      progress_bars.py
      bar.py            simple and stacked or grouped bar
      pie.py            pie and progress pie (donut)
      kpi_tiles.py
      heatmap.py        RAG heatmap grid
      decisions.py      decision or points table
      table.py          general styled table
  examples/
    example_brief.yaml  a generic placeholder org, no client names
    example.pptx        generated sample
```

## Theme (settled)

`theme.py` holds the Anyreach brand tokens, kept exactly as used today, with neutral fallbacks:

- Palette: ink or title navy, indigo for subtitles and table headers, purple for eyebrow and section
  numbers, body grey, muted grey, gold intro, and the RAG set (red risk, amber, green live). Zebra row
  fill and blocker row fill.
- Fonts: heading and body (Arial family), and the type scale (title, subtitle, section header, table
  header, body, sub-text, labels, footer, confidential line).
- Band and shape styles: the navy header band, section bands, chip fills.

The only per-deck inputs are in `meta`: the engagement parties for title and footer, the date, the
overall RAG status, and content. Generators read the theme, never hardcode a colour or font. A caller
may pass overrides, but the default and expected look is the Anyreach brand.

## Content model: the brief

A dict, or YAML that loads to the same dict. This is the single interface between content and rendering.

```
brief:
  meta:
    title, subtitle, parties (list), date, footer, status (red|amber|green), confidential (bool)
  executive_summary:
    headline, status, points (list of short lines), visual (gantt|progress|milestone|none)
  slides: [ {type, title, ...type-specific fields}, ... ]     # body, in order
  appendix: [ {type, title, ...}, ... ]                        # rendered after an appendix divider
```

Slide `type` values and their content contracts:

- `gantt`: phases (rows), a week axis (start, count), bars per phase (label, kind dev|test|live,
  start_week, span), milestones (week or date, label), a "we are here" marker, gate markers.
- `milestone_path`: milestones (date, label, done).
- `progress_bars`: items (label, build percent, tested percent, note).
- `bar`: categories, series (name, values), mode simple|grouped|stacked.
- `pie`: series (label, value).
- `progress_pie`: percent, label. A single-value donut.
- `kpi_tiles`: tiles (value, label, sub).
- `heatmap`: row labels, column labels, cells as a grid of RAG values.
- `decisions`: rows (item, decision, recorded, status), status coloured RAG.
- `table`: columns, rows, options for zebra and a highlighted (blocker) row.
- `exec_summary`: usually auto-placed from `executive_summary`, but available as a type.

Validation rejects an unknown slide type and a missing required field (a slide `title`, or the
executive summary `headline`), with a clear message, so those errors are caught before the deck
renders wrong.

## Two ways to get the brief

1. Supplied: the user gives a brief (dict or YAML), the skill validates and builds.
2. Discovery: no brief given, so `SKILL.md` has the assistant ask, one plain question at a time, for the
   purpose and audience, the three to five headline messages (the executive summary), the plan, the
   progress items, the decisions, the pending asks, and which detail belongs in the appendix. It then
   assembles the brief and confirms it before building.

## MBB structure, enforced

- `build.py` always places the executive summary as the first content slide, and inserts an appendix
  divider before any appendix slides.
- `SKILL.md` instructs: lead with the answer, show plan and progress visually on the summary, and move
  every detailed analysis, data table, and proof to the appendix.

## Discipline, enforced

- `verify.py` runs a text linter over all strings in the brief before building: block em dashes, en
  dashes, arrow glyphs and decorative glyphs; warn on long or complex sentences and on hedge words.
  Blocking issues stop the build.
- Plain English and short sentences are a stated rule in `SKILL.md`, checked by the linter's warnings.
- Nothing assumed: `SKILL.md` requires every number and claim in the brief to carry a source or be
  dropped, and unverified items to be labelled, never presented as fact.
- Read-back: `verify.py` renders the deck to PDF where LibreOffice exists so the assistant reads the
  numbers back before calling the deck done.

## Sharing

The folder is portable. A teammate unzips it into `~/.claude/skills/`, or anywhere, runs
`pip install python-pptx`, and invokes it. `README.md` covers install, a minimal brief, and the
discovery flow. No machine paths, no account or client names inside.

## Not included in v1

- The DOCX standup agenda lineage (Calibri, 8.5 by 11). This suite is the 16:9 deck only.
- Google Slides output. PPTX only.
- Live data pulls. The brief is the input; sourcing the numbers is the assistant's job upstream.
