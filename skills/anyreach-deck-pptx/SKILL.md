---
name: anyreach-deck-pptx
description: "Create polished editorial-style native PowerPoint (.pptx) decks using the Anyreach editorial design system (Fraunces serif, cream + ink alternation, indigo + lime accents, hairline-divider tile grids). Use whenever Richard asks for an editable PPTX deck, PowerPoint deck, or any deliverable that needs to be a .pptx file with the editorial Anyreach look. Trigger on phrases like 'build a pptx deck', 'editable PowerPoint', 'editorial pptx', 'make this a pptx', 'investor deck in PowerPoint', 'turn this into editable slides', or whenever Richard provides analytical content (math, scenarios, headcount plans, Q&A) and explicitly wants a PowerPoint output rather than a PDF. Produces native editable PPTX via python-pptx — real text boxes, real shapes, native charts. Use anyreach-deck (PDF) when the deliverable is a shareable PDF brief; use anyreach-startek-deck for the dark-navy + pink top-bar partnership-deck visual system."
---

# Anyreach Deck (PPTX)

Create polished editorial-style **native PowerPoint** decks using the
Anyreach design system. Same visual vocabulary as the PDF skill —
Fraunces serif, cream + ink page alternation, indigo + lime accents,
hairline tile grids — but every shape, text box, and chart is a real
editable PowerPoint object that the recipient can hand-tune.

## When To Use This Skill

Use anyreach-deck-pptx when the deliverable must be a **.pptx file** that
the recipient will open in PowerPoint and potentially edit:

- Investor decks where the partner wants to remix slides for the IC
- Board decks that an investor or board member will annotate or extract from
- Any artifact where Richard or a stakeholder needs to swap numbers,
  copy-paste slides into another deck, or restyle by hand
- Presentations meant to be presented live (PowerPoint is universally
  installed, PDFs aren't always usable in conference rooms)

Use the existing **anyreach-deck** skill instead when the deliverable is
a polished PDF that nobody needs to edit (briefs, memos, dashboards
shared as files).

Use the existing **anyreach-startek-deck** skill instead when the
deliverable should follow the dark-navy + pink-top-bar partnership-deck
visual system (a different design language, not the editorial cream/ink
vocabulary).

## Workflow

1. **Read DESIGN_SYSTEM.md** for the visual contract — colors, type
   scale (in pt, not px), component catalog, and the small set of
   PPTX-specific tradeoffs vs. the PDF system.

2. **Read PIPELINE.md** for the build pipeline — python-pptx specifics,
   visual-QA loop via LibreOffice + pdftoppm, and the gotchas that bit
   us during construction (zero-margin text frames, `shadow.inherit=False`,
   letter-spacing via raw XML, single fontFace per run, etc.).

3. **Look at examples/example_deck.py** for a working reference — every
   major component is demonstrated there. When in doubt, copy the
   patterns from the example.

4. **Build your deck** as a Python module that:
   - Imports tokens, components, charts from `lib/`
   - Defines one function per slide that takes a `slide` object and
     adds shapes/text to it
   - Calls `build_deck(slide_fns, output_path=...)` to render the .pptx

5. **Render and visually verify** — run the build, then convert to PDF
   via LibreOffice and rasterize each page with pdftoppm. Inspect every
   slide PNG before declaring the work done. Editorial layouts in PPTX
   are particularly prone to silent overflow because there is no real
   layout engine, just absolute coordinates.

## Quick Start

```python
from lib.tokens import C, TYPE
from lib.components import (
    blank_slide, hero_block, section_header, tile_grid, metric_tile,
    metric_tile_row, detail_tile, qa_row, scenario_card, callout,
    closing_tagline, italic, mono, label,
)
from lib.charts import donut, donut_legend, stacked_area, bridge_bars, comparison_bars
from lib.render import build_deck

# Each slide is a function that mutates a slide object
def make_hero_slide(slide):
    blank_slide(slide, background=C['cream'])
    hero_block(
        slide,
        eyebrow='Series A · April 2026',
        headline=['Why ', italic('$15M'), '.'],
        subhead='The number is not aspirational.',
        ink_on_cream=True,
    )
    metric_tile_row(
        slide,
        x=80, y=720, w=1240, h=140,
        tiles=[
            metric_tile(label='RAISE',     value='$15M',  caption='Series A · Q4 2026'),
            metric_tile(label='RUNWAY',    value='24 mo', caption='Base case'),
            metric_tile(label='ARR TARGET', value='$50M', caption='44× from $1.13M today'),
            metric_tile(label='BURN MULT.', value='0.31x', caption='vs. 1.6x cloud median'),
        ],
        background=C['cream'],
    )

# Render to .pptx
build_deck(
    slide_fns=[make_hero_slide, ...],
    output_path='/path/to/output.pptx',
    title='My Deck',
)
```

## File Layout

```
anyreach-deck-pptx/
├── SKILL.md            ← this file
├── DESIGN_SYSTEM.md    ← visual contract: colors, type, components, PPTX tradeoffs
├── PIPELINE.md         ← python-pptx build details + gotchas + visual-QA loop
├── lib/
│   ├── tokens.py       ← color/font/type-scale constants (single source of truth)
│   ├── components.py   ← shape+textbox helpers for every component pattern
│   ├── charts.py       ← native PPTX charts + shape-composition charts
│   └── render.py       ← build_deck() + render_previews() helpers
└── examples/
    ├── example_deck.py ← reference deck demonstrating every component
    └── example_deck.pptx
```

## Design Philosophy (Same as PDF skill)

The system has **discipline** as its core principle. The editorial feel
comes from restraint, not from variety:

- **Use the same six or seven colors everywhere.** Don't introduce new
  hex values. If you need a new accent, the answer is almost always to
  reuse `lime` (single most-emphasized thing per slide) or `indigo`
  (general structural emphasis).

- **Italics are the rhetorical device.** Inside otherwise-roman headlines,
  italicize the emotional or conceptual words. Use `italic('word')` to
  produce an inline italic run, then pass the list of runs as the
  `headline` argument. Examples:
  - `['The math is ', italic('not just defensible'), '. It\'s ', italic('top decile'), '.']`
  - `['Why ', italic('not less'), '. Why ', italic('not more'), '.']`

- **Mono digits, serif headlines, sans body.** Never use the body font
  for numbers in metric tiles or charts (mono ensures alignment). Never
  use body for headlines (serif gives the editorial weight).

- **The hairline tile grid is the workhorse.** Most layouts that look
  like a card grid should use `tile_grid()`. It uses a parent rect in
  the line color with 2px gaps between child tiles to fake the 1px
  hairlines from the PDF system. Don't reinvent it.

- **Each slide should have one focal moment.** A massive number, a
  dramatic headline, a punchy callout. Don't crowd a slide with three
  competing focal points.

## Slide Sizing

- Default slide is **14.583" × 9.375"** (= 1400×900 px @ 96dpi, the same
  design space as the PDF skill). This is a **custom non-standard size**
  set by `build_deck()`. Don't change it casually — it preserves the
  14:9 editorial aspect ratio and lets you reuse coordinate math from
  the PDF system 1:1.
- All component coordinates are specified in **pixels** (1400×900 design
  space). The library converts to EMU (1px = 9525 EMU) internally.
- Type sizes are specified in **points** in `TYPE` (1px = 0.75pt).

## After Rendering — ALWAYS Visually Inspect

PowerPoint's lack of a real layout engine means overflow, clipping, and
font-fallback issues are silent. Run the visual-QA loop after every
build:

```bash
cd /path/to/your/deck/output/dir
soffice --headless --convert-to pdf my_deck.pptx
pdftoppm -png -r 100 my_deck.pdf slide
# now inspect slide-1.png, slide-2.png, ... with the view tool
```

The `render_previews()` helper in `lib/render.py` automates this. Look
at every PNG before declaring the work done.

## Common Pitfalls

- **Font fallback chains don't exist in PPTX.** Each text run has a
  single `fontFace`. We use Fraunces / DM Sans / JetBrains Mono — if the
  recipient doesn't have these installed, PowerPoint substitutes the
  generic family (Times for serif, the system sans for body, Consolas
  for mono). Document this when delivering.

- **Default text-frame margins are ~7px on all sides.** All component
  helpers use `add_textbox()` which zeroes margins. If you call
  `slide.shapes.add_textbox()` directly, set
  `tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0`
  manually.

- **Default shape shadow.** PowerPoint's default theme adds a soft
  shadow to every shape. We disable via `shape.shadow.inherit = False`
  in every component. Do the same if you add a shape directly.

- **Letter-spacing is not a Python-PPTX property.** It's done via raw
  XML on the run's `rPr`, in 1/100 pt units. See
  `_set_letter_spacing()` in `components.py`.

- **Native donut chart center text positioning is fragile.** LibreOffice
  renders the donut hole slightly smaller than PowerPoint does, so
  center labels can clip in the LibreOffice preview but render cleanly
  in real PowerPoint. Test in real PowerPoint if center text looks off.

- **Slide overflow is silent.** Coordinates that exceed 1400×900 just
  render outside the slide and get clipped. Always sanity-check
  `y + height ≤ 900`.

## When To Read Each Reference File

| If you're... | Read |
|---|---|
| Picking colors / fonts / sizes | `DESIGN_SYSTEM.md` |
| Choosing which component fits | `DESIGN_SYSTEM.md` (component catalog) |
| Debugging the PPTX build pipeline | `PIPELINE.md` |
| Looking for a working code reference | `examples/example_deck.py` |

## What This Skill Does NOT Cover

- **PDF generation** — use `anyreach-deck` instead (HTML+Playwright pipeline).
- **The dark-navy / pink-top-bar partnership deck system** — use
  `anyreach-startek-deck` instead.
- **Spreadsheets** — use `xlsx`.
- **Word documents** — use `docx`.
- **Interactive web dashboards** — build them as JSX artifacts directly.
