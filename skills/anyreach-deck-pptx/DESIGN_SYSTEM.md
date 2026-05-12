# Anyreach Deck (PPTX) — Design System

The complete visual contract for the PowerPoint variant. This is the
document to consult when you're about to make a design choice. It
mirrors the PDF skill's design system but documents the small set of
PPTX-specific tradeoffs.

The system favors restraint over variety. The editorial feel comes from
disciplined reuse of a small palette and type scale, not from inventing
new tokens for new situations.

---

## 1. Color Palette

All hex values are defined in `lib/tokens.py` as the `C` dictionary
(without the `#` prefix, since python-pptx wants raw hex). **Never
introduce new hex values.** If you think you need one, the answer is
almost always to reuse an existing token.

### Ink family (dark)

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0B0B1C` | Primary dark slide background. Primary text on cream. |
| `inkSoft` | `#161630` | Raised cards on dark (slightly lighter than ink). |
| `inkLine` | `#262642` | Hairline dividers on dark backgrounds. |
| `mutedOnInk` | `#9A95B0` | Secondary text/labels on dark backgrounds. |

### Cream family (light)

| Token | Hex | Use |
|---|---|---|
| `cream` | `#F1ECDF` | Primary light slide background. |
| `creamSoft` | `#E8E2D2` | Callouts / raised cards on cream. |
| `creamLine` | `#D8D2C0` | Hairline dividers on cream backgrounds. |
| `mutedOnCream` | `#6E6A5C` | Secondary text/labels on cream backgrounds. |

### Brand accents

| Token | Hex | Use |
|---|---|---|
| `indigo` | `#5B5FC7` | Primary brand color. Default accent for emphasis. |
| `indigoLight` | `#8B8FE0` | Softer indigo for secondary fills, highlight cards. |
| `indigoDeep` | `#3D40A0` | Darker indigo for the bottom of stacked charts. |

### Lime — the spotlight color
`#DCFA45` — neon yellow-green. **Reserved for the single most-emphasized
element on a slide.** A hero metric, a target value, the final word of a
key headline, the highlighted scenario. If you find yourself using
`lime` on more than one element per slide, you are probably overusing it.

### Secondary accents

| Token | Hex | Use |
|---|---|---|
| `amber` | `#E8B048` | Warm secondary (third-tier categories in charts). |
| `crimson` | `#B84A56` | Sensitivity flag, callout border for warnings. |
| `rose` | `#D86878` | Soft warm — bear scenario, "losing" comparison row. |

### Color rules of thumb

- A slide should have **at most one lime element** as its focal moment.
- Indigo carries the structural emphasis.
- Crimson is for warnings and sensitivities only.
- Amber + rose are for chart category differentiation, not emphasis.
- White is not in the palette — use `cream` for "white-ish" surfaces.

---

## 2. Typography

Three font families, each with a specific role.

### Font names (defined in `tokens.py`)

```python
FONT_DISPLAY = 'Fraunces'         # all headlines
FONT_BODY    = 'DM Sans'          # body, labels
FONT_MONO    = 'JetBrains Mono'   # all numerics
```

**PPTX-specific tradeoff:** PowerPoint runs use a single `fontFace` per
run — there is no CSS-style fallback chain. If the recipient doesn't
have the font installed, PowerPoint substitutes the generic family
(Times for serif, the system sans for body, Consolas for mono). This is
acceptable for editorial work — Times-as-headline degrades gracefully.

### When to use each

| Font | Use for | Don't use for |
|---|---|---|
| **Fraunces (display)** | Headlines, big numbers, hero metrics, card titles, tagline | Body copy, captions, labels |
| **DM Sans (body)** | Body paragraphs, descriptions, eyebrow labels, captions | Numbers in data, headlines |
| **JetBrains Mono** | Any standalone number that represents data | Headlines, body copy |

### Type scale (in points)

All sizes in `tokens.py` as the `TYPE` dict. Sizes are tuned for
PowerPoint viewed at fit-to-window on a typical laptop — bumped
~25-30% over equivalent PDF sizes since PowerPoint shrinks the slide
relative to a 1:1 PDF view.

| Token | Size | Use |
|---|---|---|
| `hero` | 135pt | The single biggest moment of a deck (e.g. "Why $15M.") |
| `section_xl` | 60pt | Largest section headlines |
| `section_lg` | 54pt | Default section headline (most common) |
| `section_md` | 48pt | Smaller section headline (fits more text) |
| `section_sm` | 42pt | Subheadings |
| `card_title` | 22pt | Card-level serif titles (sized to fit one line in standard tile width) |
| `metric_xl` | 60pt | Largest metric numbers |
| `metric_lg` | 48pt | Hero metric tile values |
| `metric_md` | 36pt | Rollup metric tile values |
| `metric_sm` | 28pt | Smaller stat tiles |
| `body_lg` | 17pt | Hero subhead |
| `body` | 13.5pt | Default body copy |
| `body_sm` | 12pt | Card-level body, secondary text |
| `body_xs` | 11pt | Tertiary body, byline |
| `caption` | 10.5pt | Small captions, footnotes, bullets in detail tiles |
| `micro` | 9.5pt | Uppercase tracked labels (eyebrow labels) |
| `micro_xs` | 8.5pt | Smallest uppercase labels (inside cards) |

### Italic emphasis — the rhetorical device

The single most important typography pattern. **Inside otherwise-roman
headlines, italicize the emotional or conceptual word.**

In the PPTX system, headlines are passed as a **list of runs** so each
piece can be styled independently:

```python
hero_block(slide,
    headline=['Why ', italic('$15M'), '.'],
    ...
)

section_header(slide,
    headline=['The math is ', italic('not just defensible'), '. It\'s ',
             italic('top decile'), '.'],
    ...
)
```

`italic('word')` returns a run-dict `{'text':'word', 'italic':True}` that
the `rich_text()` helper consumes. Plain strings in the list become
roman runs.

Rules:
- The italic word should carry the argument or emotion.
- Sometimes the italic word should also be in `lime` for additional
  emphasis — but only on the slide's single focal moment. Use
  `{'text':'$15M', 'italic':True, 'color':C['lime']}` directly.
- Never italicize the entire headline.

### Mini labels — the omnipresent uppercase tracked style

Every section, every card has a small uppercase tracked-out label.
Always use `label()` from components.py.

Properties: 9.5pt / 2.1pt letter-spacing (`LABEL_SPACING_HUNDREDTHS=210`)
/ UPPERCASE / bold / muted color (varies by background).

Examples: `01 · USE OF FUNDS`, `TIER 1 · CENTENE-CLASS`, `SENSITIVITY`.

**PPTX-specific:** letter-spacing is set via raw XML on the run's `rPr`
because python-pptx doesn't expose it as a property. The `label()`
helper handles this for you. If you need to apply spacing manually, see
`_set_letter_spacing()` in `components.py`.

---

## 3. Slide Structure

Default slide is **14.583" × 9.375"** (= 1400 × 900 px @ 96dpi). This
is a **custom non-standard size** set by `build_deck()` and is fixed
because the design system's component proportions assume it.

All component coordinates are specified in **pixels** in the 1400×900
design space. The library converts to EMU internally (1px = 9525 EMU).

Standard slide composition:

```
┌─────────────────────────────────────────────────┐
│  [eyebrow label · 9.5pt tracked uppercase]      │
│  [Section headline — Fraunces, large, italic]   │
│  [body paragraph, max-width ~720px, muted]      │
│                                                 │
│  [main content — chart, tile grid, etc.]        │
│                                                 │
│  [optional rollup metrics row at bottom]        │
└─────────────────────────────────────────────────┘
```

The hero slide is the exception — title at top, metrics row pinned to
the bottom.

### Cream / Ink alternation

Slides should alternate between cream and ink backgrounds. This creates
a visual rhythm. A typical 10-slide deck cadence:

`cream / ink / cream / ink / cream / cream / cream / ink / cream / ink`

The exact cadence isn't sacred — but alternation is.

### Padding

Default slide padding is `64px vertical / 80px horizontal`
(`SPACE['page_pad_y']` and `SPACE['page_pad_x']`). Increase if the slide
feels cramped, decrease if it's dense.

### Slide overflow is silent

Unlike the HTML+CSS PDF pipeline, PPTX has no flow layout. Coordinates
that exceed 1400×900 just render outside the slide and get clipped.
**Always sanity-check `y + height ≤ 900`** when laying out content.

---

## 4. Component Catalog

Every reusable pattern. Read the docstring of each component in
`components.py` for full parameter details.

### `blank_slide(slide, background)`
Sets the slide background to a solid fill. Always call first in every
slide function before adding content.

### `hero_block(slide, eyebrow, headline, subhead, byline, ink_on_cream)`
The deck's opening title block. **Slide 1 only.** Massive serif headline
(135pt), supporting paragraph, byline. Almost always paired with a
`metric_tile_row` pinned to the bottom of the same slide.

### `section_header(slide, x, y, w, label, headline, body, on_cream) → next_y`
The standard section opener. Three stacked elements (eyebrow + headline
+ optional body). Returns the next `y` coordinate so you can place
content below it without manual math. Use this on every non-hero slide.

### `tile_grid(slide, x, y, w, h, columns, tiles, gap, background)`
The signature tile pattern — a parent rect in the line color, with
child tiles laid out on top with a 2px gap. The 2px gap on a
hairline-colored background creates the editorial card-grid look.
Each `tile` arg is a callable produced by component spec functions like
`metric_tile()` or `detail_tile()`.

### `metric_tile(label, value, caption, on_cream, value_color)` → callable
Returns a spec callable for a single metric tile (label/value/caption).
Pass to `tile_grid()` or use the `metric_tile_row()` convenience wrapper.

### `metric_tile_row(slide, x, y, w, h, tiles, background)`
Convenience wrapper for the common case of a horizontal row of metrics.

### `detail_tile(eyebrow, eyebrow_aux, title, value, value_caption, ratio, bullets, accent)` → callable
A more elaborate tile spec with eyebrow row, serif title, big metric,
caption, italic ratio line, hairline divider, and em-dash bullet list.
Used for "Four Layers" / "Tier Mix" sections. Vertical layout uses an
explicit cursor so each element stacks cleanly without overlap.

### `qa_row(slide, x, y, w, number, question, answer, on_cream) → next_y`
Newspaper-interview-style Q&A row. Big serif Q-number on the left, then
question + answer on the right. Returns the next `y` for chaining
multiple rows. Use on any "frequently-asked / objection-handling" section.

### `scenario_card(eyebrow, headline_value, headline_unit, metric_a_label, metric_a_value, metric_b_label, metric_b_value, body, implication, accent, is_highlight)` → callable
A spec callable for one scenario in a multi-scenario comparison
(bull/base/bear). The highlighted scenario gets a lime top-bar.

### `callout(slide, x, y, w, h, eyebrow, body, accent, on_cream)`
A visual callout — colored 4px left border, soft fill, eyebrow label,
body text, padded interior. Use for sensitivities, key caveats. Always
accent in `crimson` for warnings.

### `closing_tagline(slide, x, y, w, headline, lines, on_cream)`
The closing block — large centered serif tagline followed by small
uppercase metadata lines. Used on the final slide.

---

## 5. Chart Catalog

See `lib/charts.py` for full docstrings.

### `donut(slide, x, y, size, data, hole, center_label, center_value)`
A **native PPTX doughnut chart** — fully editable in PowerPoint. Center
label and value are added as overlaid textboxes in the hole. Categories
get colored from a default palette (indigo / lime / amber / crimson /
rose / indigoDeep) which you can override via `colors=`. Pair with
`donut_legend()` for the legend.

**Tradeoff:** PowerPoint's default donut hole is ~50% of radius, but
LibreOffice renders it slightly smaller — center text can clip in
LibreOffice previews but renders cleanly in real PowerPoint. If a
preview looks tight, open in real PowerPoint to verify before chasing
the bug.

### `donut_legend(slide, x, y, w, items, on_cream)`
Companion to `donut()` — vertical list with colored swatch + label +
right-aligned value/percent. Built as shapes (not the chart legend)
so each row is independently styleable.

### `stacked_area(slide, x, y, w, h, data, series, on_cream)`
A **native PPTX area chart** (stacked) — fully editable. Use for
headcount ramps, revenue projections, cumulative growth. Series colors
default to indigo / indigoLight / amber / lime; the deepest layer uses
`indigoDeep`.

### `bridge_bars(slide, x, y, w, h, rows, max_value, on_cream)`
Horizontal bars showing additive bridge / waterfall, **drawn as shape
compositions** (no native PPTX equivalent supports per-row color
control + inline note text inside the bar). Each row has a label, a
colored bar with note text inside, and a right-aligned value.

### `comparison_bars(slide, x, y, w, h, benchmarks, on_cream)`
Two-row bar chart per metric showing "you vs industry" — drawn as shape
compositions for the same reason. Auto color-codes: winning rows get
indigo, losing rows get rose.

### When to use what

| Want to show | Chart |
|---|---|
| How a total is divided | `donut` + `donut_legend` |
| Growth over time, multi-series | `stacked_area` |
| Sources of a final number | `bridge_bars` |
| You vs benchmark | `comparison_bars` |
| Single comparison, no benchmark | A `tile_grid` of `metric_tile`s |

---

## 6. Doing It Wrong (Anti-patterns)

### Don't do this:
- ❌ Inventing a new hex color for a one-off accent
- ❌ Using emoji as decorative elements
- ❌ Adding drop shadows (PowerPoint adds them by default — every
  component disables via `shape.shadow.inherit = False`)
- ❌ Center-aligning body text (left-align always, except for the
  closing tagline)
- ❌ Using rounded corners (the system is flat — don't pass a
  `corner_radius`)
- ❌ Putting the body font on a number — always `mono`
- ❌ Putting the body font on a headline — always `display`
- ❌ Two `lime`-colored elements on the same slide
- ❌ Italicizing an entire headline — italic is for emphasis only
- ❌ Calling `slide.shapes.add_textbox()` directly without zeroing the
  text-frame margins (PowerPoint default ~7px shifts content visibly)

### Do this instead:
- ✅ Reuse an existing color from `C`
- ✅ Use simple geometric shapes if you need a glyph
- ✅ Flat color blocks with hairline dividers (via `tile_grid`)
- ✅ Left-align body text always
- ✅ Sharp corners on every shape
- ✅ Wrap every standalone number in `mono(...)` for chart/tile values
- ✅ Wrap the emotional word in `italic(...)` inside a headline list
- ✅ `tile_grid()` for any row of related cards
- ✅ Use the provided `add_textbox()` helper from `components.py` (zeros
  margins automatically)

---

## 7. PPTX-vs-PDF Tradeoffs (read once, internalize)

Things that work differently in this skill vs. the PDF anyreach-deck:

| Aspect | PDF (anyreach-deck) | PPTX (this skill) |
|---|---|---|
| Font fallback | CSS stack (Fraunces, Times, serif) | Single fontFace per run; PowerPoint substitutes |
| Hairlines | Real 1px gaps via flex+gap | Best-effort via 2px gaps on parent rect |
| Chart fidelity | Hand-drawn SVG (full control) | Native chart (donut/area) or shape composition |
| Layout engine | CSS flow layout | Absolute coordinates only |
| Editability | None (PDF is static) | Full — every shape is a real PowerPoint object |
| Letter-spacing | CSS `letter-spacing` | Raw XML on `rPr` (1/100 pt) |
| Shadows | None by default | PowerPoint default — disable via `shadow.inherit=False` |

The PPTX system trades some visual finesse (hairline crispness, font
fallback, layout flow) for full editability. Choose the skill that
matches the deliverable.
