# Anyreach Deck (PPTX) — Build Pipeline

This document covers the python-pptx build pipeline: how slides are
constructed, how the visual-QA loop works, and the specific gotchas
that bit us during construction. Read it once before building a real
deck.

---

## 1. Architecture

```
slide_fns: list[Callable[[Slide], None]]
    │
    ▼
build_deck()
    ├── prs = Presentation()
    ├── prs.slide_width  = 14.583 inches  (= 1400 px @ 96dpi)
    ├── prs.slide_height = 9.375 inches   (= 900 px @ 96dpi)
    ├── for fn in slide_fns:
    │     slide = prs.slides.add_slide(blank_layout)
    │     fn(slide)
    └── prs.save(output_path)
```

Every component is a function that takes a `slide` object and adds
shapes/textboxes to it at pixel coordinates from the 1400×900 design
space. Pixel→EMU conversion happens inside the helpers
(`px_to_emu()` in `tokens.py`; 1px = 9525 EMU).

There is **no automatic layout engine**. Every position is explicit.
Components like `section_header()` and `qa_row()` return the next y
coordinate so you can chain them, but you still pass x/y/w to every
component.

---

## 2. The Build + Visual-QA Loop

PowerPoint's lack of a real layout engine plus the absence of font
fallback means **you must visually inspect every slide after every
build**. Layout overflow, font substitution, and clipping are all
silent.

### Standard loop:

```bash
cd /your/output/dir
python -m examples.example_deck                          # builds the .pptx
rm -f slide-*.png example_deck.pdf
soffice --headless --convert-to pdf example_deck.pptx    # rasterize via LibreOffice
pdftoppm -png -r 100 example_deck.pdf slide              # one PNG per slide
# now use the view tool on slide-1.png, slide-2.png, ... and inspect
```

There's a `render_previews()` helper in `lib/render.py` that automates
this.

### What to look for in each preview:

- **Text overflow.** Especially in `detail_tile` bullets and `callout`
  body — content past the slide edge gets clipped silently.
- **Font substitution.** If headlines look like Times instead of
  Fraunces, the recipient will see what your previewer renders. Open
  the .pptx in real PowerPoint to verify the substitution is acceptable.
- **Donut center label clipping.** LibreOffice renders the donut hole
  smaller than PowerPoint does. If the center label clips in the
  LibreOffice preview but the rest of the slide is fine, open in real
  PowerPoint before chasing the bug — it usually renders cleanly there.
- **Tile grid hairlines.** Should be visible as a 2px line in the line
  color between cards. If you see double borders or no border, check
  that you used `tile_grid()` and didn't draw individual tiles.
- **Letter-spacing on labels.** Eyebrow labels should have visible
  tracking. If they look cramped, the raw-XML letter-spacing didn't
  apply — check that you used `label()` and not a manual textbox.

### Stop after one fix cycle

Per the public pptx skill guidance: after applying a round of fixes and
re-rendering, **stop**. If new defects appear, fix only those. Don't
get stuck in a polish loop chasing pixel-perfect parity with the PDF
system — that's not what PPTX is for.

---

## 3. Coordinate System and Units

| Quantity | Unit in code | Conversion |
|---|---|---|
| Position (x, y) | px | × 9525 = EMU |
| Size (w, h) | px | × 9525 = EMU |
| Type sizes | pt | direct (set as `Pt(size)`) |
| Letter spacing | 1/100 pt | raw XML attribute `spc` |
| Line widths | pt | direct |

**Helpers** in `tokens.py`:

```python
px_to_emu(px)         # → EMU value
px_to_pt(px)          # → points (× 0.75)
slide_width_emu()     # → 13888100  (1400 × 9525, but EMU = px × 9525)
slide_height_emu()    # → 8572500   (900 × 9525)
rgb(token_or_hex)     # → RGBColor instance, accepts 'indigo' or 'AABBCC'
```

**Why pixels for everything** instead of inches/EMU directly: the PDF
skill uses 1400×900 px design space, and being able to copy coordinates
1:1 between the two skills is valuable. The conversion is hidden inside
the helpers.

---

## 4. python-pptx Gotchas (in priority order)

These are the things that bit us during construction. Read all of them.

### 4.1. Text-frame margins default to ~7px

Every `slide.shapes.add_textbox()` creates a text frame with non-zero
margins (`left`, `right`, `top`, `bottom`). This shifts content
visibly relative to the box bounds.

**Fix (already applied in our `add_textbox()` helper):**
```python
tf.margin_left = tf.margin_right = 0
tf.margin_top = tf.margin_bottom = 0
```

Always use the `add_textbox()` helper from `components.py`, not the
raw `slide.shapes.add_textbox()`.

### 4.2. Default theme adds drop shadows to every shape

PowerPoint's default theme inherits a soft drop shadow on every shape.
On the editorial cream/ink palette this looks wrong (the system is flat).

**Fix (already applied in every component):**
```python
shape.shadow.inherit = False
```

If you draw a shape directly, do this every time.

### 4.3. Letter-spacing requires raw XML

python-pptx doesn't expose CSS-style letter-spacing as a property. It
must be set via the `spc` attribute on the run's `rPr` element, in
1/100 pt units.

`LABEL_SPACING_HUNDREDTHS = 165` (= 1.65pt ≈ 0.22em at 7.5pt) — this
matches the editorial label tracking from the PDF system.

The `_set_letter_spacing(run, hundredths)` helper in `components.py`
handles this. The `label()` component applies it automatically.

### 4.4. Single fontFace per run — no fallback chain

CSS `font-family: 'Fraunces', 'Times New Roman', serif` works in HTML.
In PPTX, each run has exactly one `fontFace`. We use the primary name
(`Fraunces`, `DM Sans`, `JetBrains Mono`); PowerPoint falls back to its
generic substitution behavior if the recipient doesn't have the font
installed.

This is **acceptable for editorial work** — Times-as-headline degrades
gracefully. But mention it when delivering: "If the deck renders with
Times instead of Fraunces, install Fraunces locally for the intended
look."

### 4.5. Native donut chart center text clipping in LibreOffice

LibreOffice renders the donut hole smaller than PowerPoint does, so
the center label/value can clip in pdftoppm previews. The fix is to
verify in real PowerPoint, not to keep shrinking the text.

`charts.donut()` puts the center label/value as overlaid textboxes
positioned at the chart center. If you need to nudge them, the
positioning math is in the function — adjust `text_w` (default 48% of
size) or the y-offset. But before doing that, open the file in real
PowerPoint to see how it actually looks.

### 4.6. Native chart styling is limited

PPTX native charts (donut, area) support category colors, axis
formatting, and legend styling — but not arbitrary per-segment text or
mid-bar labels. That's why `bridge_bars` and `comparison_bars` are
**shape compositions**, not native charts: they need inline notes
inside bars and per-row coloring tied to win/loss state, which native
charts don't support.

### 4.7. Slide-size custom dimensions

`prs.slide_width` and `prs.slide_height` accept `Emu(...)` values.
Setting them to non-standard values (our 14.583" × 9.375") works — but
the slide layouts that python-pptx auto-creates assume 16:9 or 4:3
proportions, so we use only the **blank layout** (`slide_layouts[6]`)
and ignore placeholders.

---

## 5. Rich Text and Inline Runs

The `rich_text()` helper takes either a string or a list of run-dicts
and adds them as a single paragraph with styled runs:

```python
# String form (single run, single style):
rich_text(slide, x, y, w, h,
    text='Total 24-month spend is $28.4M.',
    font=FONT_BODY, size=TYPE['body'], color=C['mutedOnCream'])

# List form (mixed styles within one paragraph):
rich_text(slide, x, y, w, h,
    text=['Total spend is ', mono('$28.4M'), ' over ', italic('24 months'), '.'],
    font=FONT_BODY, size=TYPE['body'], color=C['mutedOnCream'])
```

Run-dict shape:
```python
{
    'text': 'string',
    'italic': True | False,
    'bold': True | False,
    'font': 'Fraunces' | 'DM Sans' | 'JetBrains Mono',
    'size': pt_value,
    'color': hex_string,
}
```

Helpers `italic()`, `mono()`, and `label_run()` produce these dicts.
Plain strings in the list become roman runs in the paragraph's default
style.

---

## 6. Build a New Deck — End-to-End

1. **Start from `examples/example_deck.py`.** Copy it, rename it,
   delete the slide functions you don't need.

2. **Define one slide function per slide.** Each one should:
   - Call `blank_slide(slide, background=C['cream'])` (or `C['ink']`)
     first.
   - Add a `section_header()` (or `hero_block()` for slide 1).
   - Add the main content (tile grid, chart, Q&A rows).
   - Optionally add a `metric_tile_row()` rollup at the bottom.

3. **Call `build_deck()`** with the list of slide functions and an
   output path:
   ```python
   from lib.render import build_deck
   build_deck(
       slide_fns=[make_hero_slide, make_funds_slide, ...],
       output_path='/tmp/my_deck.pptx',
       title='My Deck',
       subject='Series A · Q4 2026',
       author='Richard Lin',
   )
   ```

4. **Run the visual-QA loop** (Section 2). Inspect every slide PNG.

5. **If layout issues:** the most common ones are
   - Detail-tile content overflowing tile height → reduce bullets or
     increase tile height.
   - Callout body wrapping past the bottom → increase callout height.
   - Section header overlapping content below it → use the returned
     `next_y` value, don't hardcode.

6. **Stop after one fix cycle** unless new visible defects appear.

---

## 7. Known Acceptable Tradeoffs

These are documented as part of the system, not bugs to fix:

- **Hairlines on cream are visually subtle.** True 1px hairlines exist
  in the PDF system but PPTX rendering varies — 2px gaps on a parent
  rect is the closest approximation. Acceptable for editorial work.
- **Donut center text positioning.** Native PPTX donut hole defaults
  to ~50% of radius, with minor LibreOffice rendering offset. Open in
  real PowerPoint to see the actual rendering before adjusting.
- **No drop shadows or 3D effects.** This is a feature, not a bug —
  the system is flat. We disable PowerPoint's defaults explicitly.
- **No CSS layout flow.** All coordinates are absolute. This means
  responsive behavior (content reflowing into available space) does
  not exist. Choose your tile sizes deliberately.
