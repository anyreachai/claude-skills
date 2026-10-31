# Design system

The Anyreach deck language as a web page. Tokens, type, components and chart arithmetic. All of this is already in `assets/template.html`; this file explains what each piece is for.

## Tokens

Bands alternate. Each band sets its own variables, so components are written once against `var(--…)` and work on both.

```css
.band.dark{--bg:#0C0C12;--fg:#F4F4F5;--muted:#A1A1AA;--faint:#71717A;--card:#18181F;--line:#2A2A33;
  --acc:#818CF8;--acc2:#6366F1;--acc-soft:#1E1B4B;--acc-ink:#C7D2FE;--track:#2A2A33;--grey:#52525B;--grey2:#3F3F46;
  --fail:#F87171;--fail-soft:#3A1416;--warn:#FBBF24;--warn-soft:#3A2B07;--ok:#4ADE80;--ok-soft:#0F2F1A}
.band.light{--bg:#F7F7F4;--fg:#111114;--muted:#52525B;--faint:#71717A;--card:#FFFFFE;--line:#E4E4E7;
  --acc:#4F46E5;--acc2:#6366F1;--acc-soft:#EEF0FF;--acc-ink:#3730A3;--track:#E9E9EC;--grey:#D4D4D8;--grey2:#A1A1AA;
  --fail:#DC2626;--fail-soft:#FEE2E2;--warn:#D97706;--warn-soft:#FEF3C7;--ok:#16A34A;--ok-soft:#DCFCE7}
```

The page commits to this look (body background `#0C0C12`, `:root{color-scheme:dark}`); it does not switch with the viewer's theme. Fixed indigo blocks (`#1E1B4B` with `#E0E7FF` text) are used for the "deliverable" box, the highlighted lane and the footer CTA on either band.

Another brand: swap the two token blocks and the two fonts; keep the component CSS. The `brand-style-extractor` skill produces the tokens from a site.

## Type

- Headlines and big numerals: **Literata** 500, `letter-spacing:-.01em` (numerals `-.02em`), `text-wrap:balance`.
  - h1 `clamp(34px,5.2vw,60px)` line-height 1.06, max 22ch
  - h2 `clamp(26px,3.4vw,42px)` line-height 1.12, max 26ch; sub-heads inside a band `clamp(22px,2.6vw,30px)`
  - stat numerals `clamp(30px,4vw,46px)`; card figures `clamp(30px,3.4vw,42px)`; section numeral `clamp(140px,22vw,280px)` at 11% opacity
- Body: **Inter**, 15px / 1.55; captions 12.5–13.5px; eyebrows 12px, 600, `letter-spacing:.16em`, uppercase, accent color.
- `font-variant-numeric: tabular-nums` on anything with digits in a column.

Google Fonts link: `https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,500;7..72,600&family=Inter:wght@400;500;600;700&display=swap` with Georgia / system-ui fallbacks declared.

## Layout

- `.band` full-bleed, `padding-block:72px`, `position:relative; overflow:hidden` (the numeral bleeds off the corner).
- `.inner` max 1120px, gutters `max(16px, env(safe-area-inset-left/right, 0px))`, `display:grid; gap:36px`.
- `.head` = eyebrow + h2 + optional lede, `gap:14px`.
- Two-up grids (`.split`, `.charts2`, `.econ`) collapse to one column at 760–860px. Five-up card rows collapse to one column at 1000px and re-grid each card internally (number | copy | copy | tag) so a stack of five still reads.
- Phone at 400px must not scroll sideways: wide SVGs scale (`width:100%; height:auto`), long labels get a `short` variant in compact mode.

## Components (what each is for)

| Component | Use | Notes |
|---|---|---|
| `.hstats` / `.hstat` | 3–4 headline numbers under the hero | Hairline top border, numeral + one-line label. Color the numeral only when the color means something. |
| `.quote` | the source's own verdict | Left indigo rule, Literata 400, accent on the operative clause. |
| `.cards3` / `.card` + `.pict` | context: what the thing is | Flat SVG pictogram on `--acc-soft`, 5:2, then h3, two lines, chips. |
| `.chips` / `.chip` | unordered categories | Pill, hairline border, no fill. |
| `.deliver` | the one thing that gets paid for | Fixed deep-indigo box. |
| `#waffle` + `.legend` | part of a huge whole | 40 × 25 cells, 14px cells, 3px gap, viewBox `677 × 422`. Built by JS. |
| `.chart` + inline SVG | bars, slopes, ranges | `.chart text` 12px muted; `.v` values 13px 600; `.d` delta red; `.lab` row labels. Add a class to shrink text when the SVG scales up. |
| `.meters` / `.meter` / `.track` | rates 0–100% | `i.fail` for losses; `.grow` class added on intersection. |
| `.callout` | one observation outside the source | Left rule in `--warn`, eyebrow in warn, body muted. |
| `.method` / `.mp` / `.mp-fig` | the animated three-panel strip | Each panel: SVG figure card, numbered h3 (Literata numeral in accent), two lines, dashed stat line. Arrow between panels on desktop only. |
| `.fields` / `.field` | a schema or checklist | Index in accent, hairline border. |
| `.asks` / `.ask` | the counterparty's requests, or options | Same slots per card: numeral, title, Today, Ask, data tag (`.tag.acc` when it needs only data we already have). |
| `.ab` / `.lane` / `.vs` | control vs test, option A vs B | `.lane.ai` is the deep-indigo highlighted lane. |
| `.measure` | 3–4 metrics | Accent top rule, bold name, one line. |
| `.not` | what is explicitly not the goal | Struck through in red. |
| `.intpill` | marks an internal band | Amber pill with a dot, first thing in the band head. |
| `.steps3` / `.step` | a back-solve or a three-step derivation | Big figure, two lines, arrows between. |
| `.cascade` / `.cas` | a cost or conversion cascade | Four numerals with top rules; `.acc` and `.red` for the ones that matter. |
| `.sim` + range input | a what-if slider | One input, Literata value, four outputs; keep the arithmetic in one `upd()` function. |
| `.costs` / `.cost` | ranges on one axis | `left:%` + `width:%` of the axis max; `.dash` for unsized items. |
| `.gets` / `.get` | what the counterparty gets | Big figure, title, two lines with one bold clause. |
| `.tline` / `.tn` | a dated plan | Nodes on a hairline; `.live` filled. |
| `.scope` / `.sc` and `.gate` / `.gv` | scope items and gates side by side | Gate value in Literata 24px accent, arrow before it. |
| `.ongo` / `.og` | recurring structure | Description first, price in `.pr` grey under it. |
| `.terms` | the numbers, in one place | Dashed border, three columns, one-line total in Literata. |
| `.next` | footer CTA | Deep indigo, sentence left, pill right. |

## Chart arithmetic

Draw to scale or do not draw. Work it out before writing the SVG.

**Vertical bars.** Chart area `y 20→180` (160px) on a `360 × 224` viewBox. For a 0–8% axis: `y = 180 − v/8 × 160`. 6.5% → 130px tall, top at 50; 1.9% → 38px, top at 142. Gridlines at 0/4/8 → y 180/100/20. Delta label sits beside the dashed line, not on it.

**Horizontal bars.** Track `x 110→340` (230px) for a 0–5 axis: `w = v/5 × 230`. 4.24 → 195px, 1.61 → 74px. Value label 8px past the bar end; check it stays inside the viewBox.

**Range bars.** One axis for all rows. `left = low/max × 100%`, `width = (high − low)/max × 100%`, in CSS on `.cost .bar i`. In SVG for a $0–30K axis over `x 20→340`: `x = 20 + v × 10.67`. A point (a $2K price) is an 11px block, not a 1px line.

**Waffle.** 1,000 cells, `cols=40`, cell `s=14`, gap `g=3`, `x = c·17`, `y = r·17`. Rarest class first in fill order. 2.6 per 1,000 is drawn as 3 and the legend says so.

**Meters.** Width is the percentage; `transform-origin:left center`; `.grow` runs `scaleX(0→1)` 0.9s once.

**Text in scaled SVGs.** A 360-wide viewBox rendered at 520px scales 12px text to 17px. Give the SVG a class (`.rng`) and set 10.5–11px inside it.

## Pictograms

Flat, two-tone, on `--acc-soft` rounded rects: `#4F46E5` for the subject, `#A5B4FC` / `#C7D2FE` for the surround, one `#22C55E` or `#EF4444` mark if the picture needs a verdict. Wifi arcs, a row of buildings with one lit window, a calendar with one green slot. Simple enough to draw as 8–15 SVG elements; never clip art.
