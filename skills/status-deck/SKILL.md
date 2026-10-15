---
name: status-deck
description: "Build MBB-style status, progress, programme update, standup agenda and steering committee (JSC, CXO) decks as native editable PowerPoint (.pptx) in the Anyreach brand, from a brief or a short discovery flow. Infographic led: KPI tiles, schedule with a we-are-here marker, milestone path, progress bars, bar and pie charts, RAG heatmap, decisions log, tables, with an appendix for detail. Enforces action titles, numbers that show their base and add up, no trend across a change of basis, a text linter, and a render and read-back loop. Trigger on 'status deck', 'progress deck', 'steering committee deck', 'JSC deck', 'CXO deck', 'programme update', 'standup agenda deck', or any request for an executive status update as an editable PowerPoint."
---

# status-deck

Builds MBB style status and agenda presentations as a PPTX file, in the Anyreach brand, from a
brief you supply or one built through a short question and answer flow.

## When to use

Use this skill when someone asks for a status deck, a progress deck, a programme update deck, or
a standup agenda deck, and wants it as an editable PowerPoint file.

## Workflow

There are two starting points.

1. A brief is given. Validate it against the schema below, run the linter, fix or flag any
   blocking issues, then build.
2. No brief is given. Run discovery first. Ask one plain question at a time, in this order:
   - Purpose and audience. Who reads this and what decision or update does it serve.
   - The three to five headline messages. This becomes the executive summary.
   - The plan. Phases, dates, and how it should show on a slide: a schedule, a set of milestones,
     or a progress view.
   - The progress items. What is built, what is tested, what is still open.
   - The decisions. What was decided, when, and what is still pending.
   - The pending asks. What is needed from someone else, and by when.
   - What goes in the appendix. Any table, chart, or supporting detail that is not part of the
     headline story.

   Assemble the answers into a brief and read it back for confirmation before building anything.

Do not skip the confirmation step. A deck built on an unconfirmed brief is a wasted build.

## CXO and steering committee decks

Before building a deck for a steering committee or CXO audience, read `CXO_GUIDELINES.md` and
follow it. It covers agreeing the story and the numbers first, action titles, the numbers
discipline (one script owns every figure, every share shows its base, add-up checks, no trend
across a change of basis), the infographic rules, the type scale, and the render and read-back
loop. Where it is stricter than this file, it wins.

## MBB rules

- Lead with the answer. The executive summary states the status and the headline messages first,
  before any supporting slide.
- Show the plan and the progress visually. Use a schedule, a milestone path, or progress bars
  instead of a paragraph of prose.
- Move all detail, proof, and back up data to the appendix. The body slides carry the story; the
  appendix carries the evidence.

## Discipline

- Write in simple, short sentences.
- Every number and every claim carries a source. If there is no source, drop the claim rather
  than guess at it.
- An item that has not been verified is labelled as unverified. Never state it as settled fact.
- The linter blocks em dashes, en dashes, arrow characters, and decorative glyphs such as bullet
  marks, ellipsis characters, tick marks, and cross marks. It also warns on long or complex
  sentences and on filler wording. A blocking issue stops the build; a warning is a judgement call.
- After building, render the deck to PDF with LibreOffice if it is installed on the machine, and
  read the numbers back against the brief before calling the deck done. If LibreOffice is not
  installed, open the PPTX file directly and read it back instead. Either way, do not skip the
  read back.

## How to build

```python
from status_deck.build import build_deck

build_deck(brief, "out.pptx")
```

`brief` is either a Python dict with the shape below, or a YAML file path loaded first with
`status_deck.brief.load_brief`:

```python
from status_deck.brief import load_brief
from status_deck.build import build_deck

brief = load_brief("path/to/brief.yaml")
build_deck(brief, "out.pptx")
```

The theme is the fixed Anyreach brand. Only the `meta` fields and the content change from one
deck to the next.

### Brief schema

```
meta:
  title: string, required
  parties: list of strings, the engagement parties, used in the footer
  date: string
  footer: string
  status: one of red, amber, green
  confidential: true or false

executive_summary:
  headline: string
  status: one of red, amber, green
  points: list of short strings, up to five
  visual: one of gantt, progress, milestone, none
  visual_content: the content for the chosen visual, same fields as the matching slide type below

The embedded `visual` on the executive summary slide is experimental: it reuses the same
full-slide generator as the standalone slide types, so it can overlap the headline and points.
Prefer `visual: none` and show the plan and progress on their own slides (`gantt`,
`milestone_path`, `progress_bars`) instead.

slides: a list of slide objects, rendered in order
appendix: a list of slide objects, rendered after an appendix divider slide
```

Every slide object needs a `type` and a `title`. The remaining fields depend on the type.

- `gantt`: a schedule.
  - `week_axis`: `labels`, a list of week labels shown along the bottom axis.
  - `phases`: a list of rows. Each has `name`, an optional `note`, and `bars`, a list of
    `{start_week, span, kind, label}`. `kind` is one of `dev`, `test`, `live`.
  - `here_week`: optional, the week number to mark as the current point.
  - `gates`: optional, a list of `{week, label}` markers.

- `milestone_path`: a horizontal line of milestones.
  - `milestones`: a list of `{date, label, done}`. `done` is true or false.

- `progress_bars`: build and test progress per item.
  - `items`: a list of `{label, build, tested, note}`. `build` and `tested` are percent numbers.
    `note` is optional.

- `bar`: a simple, grouped, or stacked bar chart.
  - `categories`: a list of category labels.
  - `series`: a list of `{name, values}`.
  - `mode`: optional, `stacked` or `grouped`. Defaults to a clustered chart.

- `pie`: a pie chart.
  - `series`: a list of `{label, value}`.

- `progress_pie`: a single value shown as a donut.
  - `percent`: a number from 0 to 100.
  - `label`: optional, a short caption below the number.

- `kpi_tiles`: a row of headline number tiles.
  - `tiles`: a list of `{value, label, sub}`. `sub` is optional.

- `heatmap`: a grid of red, amber, green cells.
  - `row_labels`: a list of row names.
  - `col_labels`: a list of column names.
  - `cells`: a grid, one list of statuses per row, values are `red`, `amber`, `green`, or empty.

- `decisions`: a decisions log.
  - `rows`: a list of `{item, decision, recorded, status}`. `status` is coloured automatically;
    values like `recorded`, `pending`, `in progress`, `on track`, `at risk` map to a colour.

- `table`: a general table.
  - `columns`: a list of column headers.
  - `rows`: a list of rows, each a list of values in column order.
  - `zebra`: optional, true or false, alternating row shading. Defaults to true.
  - `blocker_rows`: optional, a list of row indexes to highlight as blockers.

- `exec_summary`: the executive summary type. Normally placed automatically from the
  `executive_summary` section of the brief, but available as a slide type if needed directly.

Validation rejects an unknown slide type and a missing required field (a slide `title`, or the
executive summary `headline`) at validation time with a clear message, so those errors are caught
before it renders wrong.

See `examples/example_brief.yaml` for a complete worked brief covering every slide type, and
`examples/make_example.py` for the build call.
