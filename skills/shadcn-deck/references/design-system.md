# shadcn-Deck Design System Reference

Complete specification for creating polished, client-branded presentations using shadcn-inspired theming.

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Core Components](#core-components)
5. [Slide Templates](#slide-templates)
6. [Table Styling](#table-styling)
7. [Full Palette Derivation](#full-palette-derivation)

---

## Color System

### The Color Constant Pattern

Define all colors at the top of your script. Every slide references these constants — never hardcode hex values inline.

```javascript
const COLORS = {
  // Backgrounds
  darkBg:     '2C2418',   // Title/closing slides
  lightBg:    'FBF7F0',   // Content slides
  calloutBg:  'F0E8DA',   // Callout/explanatory boxes (light BG darkened ~5%)

  // Brand accents
  primary:    'C8963E',   // Top bar, icons, stat emphasis, numbered circles
  secondary:  'E8B84B',   // Lighter accent variant, secondary emphasis

  // Neutral scale (for cards, text hierarchy)
  neutral900: '2C2418',   // Same as darkBg — card fills on light slides (darkest)
  neutral700: '4A3728',   // Card fills (dark variant)
  neutral600: '6B5344',   // Card fills (medium variant)
  neutral500: '8C7A6B',   // Body text on light BG, muted labels
  neutral400: 'B5A595',   // Muted text on dark BG, secondary labels
  neutral200: 'F5EDE0',   // Subtle card tint on light BG
  neutral100: 'FBF7F0',   // Same as lightBg

  // Semantic
  white:      'FFFFFF',
  alert:      'C0392B',   // Red for negative callouts, drop-off, warnings
  positive:   '7A8E72',   // Muted green for positive indicators (optional)

  // Text
  titleDark:  '2C2418',   // Slide titles on light BG
  bodyDark:   '8C7A6B',   // Body text on light BG
  bodyLight:  'B5A595',   // Body text on dark BG
  titleLight: 'FFFFFF',   // Slide titles on dark BG
};
```

### Adapting to a New Client

To theme for a different client, change ONLY these values:

```javascript
// Example: Cool tech brand (indigo accents)
const COLORS = {
  darkBg:     '1A1A2E',
  lightBg:    'F5F6FA',
  calloutBg:  'E8EAF0',
  primary:    '5B5FC7',
  secondary:  '818CF8',
  neutral900: '1A1A2E',
  neutral700: '2D2D5E',
  neutral600: '4A4A7A',
  neutral500: '6B7280',
  neutral400: 'B8BCD0',
  neutral200: 'EEEEF5',
  neutral100: 'F5F6FA',
  white:      'FFFFFF',
  alert:      'EF4444',
  positive:   '10B981',
  titleDark:  '1E1E3F',
  bodyDark:   '6B7280',
  bodyLight:  'B8BCD0',
  titleLight: 'FFFFFF',
};
```

### Card Fill Cycling

When multiple cards appear on a slide, cycle through the neutral scale to create visual depth. Never give all cards the same fill.

**For dark BG slides (3 cards across):**
```javascript
const darkCardFills = [COLORS.neutral700, COLORS.neutral600, COLORS.neutral900];
// Or for 2×3 grid, alternate:
const gridFills = [
  COLORS.primary, COLORS.neutral600, COLORS.neutral900,  // row 1
  COLORS.neutral700, COLORS.neutral900, COLORS.neutral600  // row 2
];
```

**For light BG slides:**
Cards should be white (`FFFFFF`) with subtle shadow effect (or no border), OR use the neutral200/calloutBg fill for callout-style cards.

---

## Typography

### Font Pairing

| Element | Font | Size | Weight | Color (Light BG) | Color (Dark BG) |
|---------|------|------|--------|------------------|-----------------|
| Slide title | Georgia | 40-48pt | Bold | `titleDark` | `titleLight` |
| Subtitle / tagline | Georgia | 20-24pt | Italic | `primary` | `primary` |
| Section header | Calibri | 22-26pt | Bold | `titleDark` | `titleLight` |
| Card title | Calibri | 16-18pt | Bold | `titleDark` or `white` | `white` |
| Body text | Calibri | 13-15pt | Regular | `bodyDark` | `bodyLight` |
| Stat number | Calibri | 48-72pt | Bold | `primary` or `white` | `white` or `primary` |
| Stat label | Calibri | 13-14pt | Regular | `white` (on card) | `white` |
| Caption / footer | Calibri | 10-11pt | Regular | `neutral400` | `neutral400` |
| Italic accent text | Calibri | 14-16pt | Italic | `primary` | `primary` |

### Title Styling Rules

- **Georgia titles are the signature** — they give the deck a premium, editorial feel vs. generic sans-serif
- Titles are always **left-aligned** (except on centered closing slides)
- Never ALL CAPS for titles — use sentence case or title case
- Subtitles/taglines in the primary accent color, often italic
- Stat numbers can be the ONLY centered text (inside cards/callouts)

---

## Spacing & Layout

### Slide Dimensions
```javascript
pres.defineLayout({ name: 'BRANDED', width: 10, height: 5.625 });
```

### Margins
- **Left/right**: 0.6" minimum
- **Top**: 0.15" (below accent bar at 0.06")
- **Bottom**: 0.4" (footer area)
- **Content area**: x: 0.6, y: 0.15, w: 8.8, h: ~4.9 (5.625 - 0.15 top - 0.4 bottom - 0.06 bar)

### Card Spacing
- Gap between cards: 0.25-0.35"
- Internal card padding: 0.2-0.3"
- Card corner radius: 0.12-0.18" (`rectRadius`)

### Content Zone Calculation (3-column cards)
```javascript
const margins = { left: 0.6, right: 0.6 };
const gap = 0.3;
const totalW = 10 - margins.left - margins.right; // 8.8
const cardW = (totalW - (2 * gap)) / 3;            // ~2.73
const cardPositions = [
  margins.left,
  margins.left + cardW + gap,
  margins.left + 2 * (cardW + gap)
];
```

### Content Zone Calculation (2-column cards)
```javascript
const cardW = (8.8 - gap) / 2;  // ~4.25
const cardPositions = [0.6, 0.6 + cardW + gap];
```

---

## Core Components

### 1. Accent Top Bar

Every slide starts with this. It's the brand anchor.

```javascript
function addTopBar(slide) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: COLORS.primary }
  });
}
```

### 2. Slide Background

```javascript
function setBackground(slide, type) {
  slide.background = { fill: type === 'dark' ? COLORS.darkBg : COLORS.lightBg };
}
```

### 3. Rounded Card

The fundamental building block. All content goes inside cards, never floating.

```javascript
function addCard(slide, { x, y, w, h, fill, radius = 0.15 }) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h,
    fill: { color: fill || COLORS.white },
    rectRadius: radius
  });
}
```

### 4. Card with Accent Top Border

Used on dark BG slides for insight/feature cards.

```javascript
function addAccentCard(slide, { x, y, w, h, fill, accentColor }) {
  // Card body
  addCard(slide, { x, y, w, h, fill: fill || COLORS.neutral700 });
  // Accent strip at top (inside the card, just below the rounded top)
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: x + 0.15, y: y + 0.12, w: 0.5, h: 0.05,
    fill: { color: accentColor || COLORS.primary },
    rectRadius: 0.02
  });
}
```

### 5. Icon Circle

For KPI cards — a filled circle with a white icon/emoji centered inside.

```javascript
function addIconCircle(slide, { x, y, color, size = 0.5 }) {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: size, h: size,
    fill: { color: color || COLORS.primary }
  });
}
```

When real icons aren't available, use a contrasting smaller circle or skip the icon — never use emoji text as icon substitutes in production decks. If icon PNGs are available, center them inside the circle.

### 6. Numbered Step Circle

For action plan / process slides.

```javascript
function addStepCircle(slide, { x, y, number, color }) {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: 0.5, h: 0.5,
    fill: { color: color || COLORS.primary }
  });
  slide.addText(String(number), {
    x, y, w: 0.5, h: 0.5,
    fontSize: 22, fontFace: 'Georgia', color: COLORS.white,
    bold: true, align: 'center', valign: 'middle', margin: 0
  });
}
```

### 7. Stat Callout (Big Number + Label)

```javascript
function addStatCallout(slide, { x, y, w, h, value, label, fill, valueColor }) {
  addCard(slide, { x, y, w, h, fill: fill || COLORS.neutral700 });
  slide.addText(value, {
    x: x + 0.15, y: y + 0.15, w: w - 0.3, h: h * 0.55,
    fontSize: 56, fontFace: 'Calibri', color: valueColor || COLORS.white,
    bold: true, align: 'center', valign: 'middle', margin: 0
  });
  slide.addText(label, {
    x: x + 0.15, y: y + h * 0.6, w: w - 0.3, h: h * 0.3,
    fontSize: 13, fontFace: 'Calibri', color: COLORS.bodyLight,
    align: 'center', valign: 'top', margin: 0
  });
}
```

### 8. Callout Box (Explanatory Text)

Light-tinted rounded box for narrative/explanatory paragraphs.

```javascript
function addCalloutBox(slide, { x, y, w, h, text }) {
  addCard(slide, { x, y, w, h, fill: COLORS.calloutBg, radius: 0.12 });
  slide.addText(text, {
    x: x + 0.25, y: y + 0.15, w: w - 0.5, h: h - 0.3,
    fontSize: 13, fontFace: 'Calibri', color: COLORS.titleDark,
    valign: 'top', margin: 0
  });
}
```

### 9. Footer

```javascript
function addFooter(slide, { company = 'Anyreach, Inc.', date } = {}) {
  slide.addText(`Prepared by ${company}`, {
    x: 0.6, y: 5.2, w: 4, h: 0.3,
    fontSize: 10, fontFace: 'Calibri', color: COLORS.neutral400, margin: 0
  });
  if (date) {
    slide.addText(date, {
      x: 5.4, y: 5.2, w: 4, h: 0.3,
      fontSize: 10, fontFace: 'Calibri', color: COLORS.neutral400,
      align: 'right', margin: 0
    });
  }
}
```

### 10. Logo in Rounded Container

For title slides — client logo inside a rounded card, typically bottom-right.

```javascript
function addLogoCard(slide, { x, y, w, h, logoPath, bgColor }) {
  // Outer shadow/depth card
  addCard(slide, { x: x + 0.08, y: y + 0.08, w, h, fill: COLORS.neutral600, radius: 0.2 });
  // Inner card
  addCard(slide, { x, y, w, h, fill: bgColor || COLORS.neutral700, radius: 0.2 });
  // Logo image centered
  if (logoPath) {
    const pad = 0.25;
    slide.addImage({
      path: logoPath,
      x: x + pad, y: y + pad, w: w - 2*pad, h: h - 2*pad,
      sizing: { type: 'contain' }
    });
  }
}
```

---

## Slide Templates

### Template 1: Title Slide (Dark BG)

The opening slide. Dark background, serif title, accent subtitle, logo card bottom-right.

```
┌─────────────────────────────────┐
│ ████████████ accent bar ████████│  0.06"
│                                 │
│  Client Name                    │  Georgia 48pt white bold
│  Subtitle / Report Title        │  Georgia 22pt primary italic
│                                 │
│  Date / Context Line            │  Calibri 14pt neutral400
│                                 │
│                          ┌────┐ │
│  Prepared by Anyreach    │LOGO│ │  Logo in rounded card
│                          └────┘ │
└─────────────────────────────────┘
```

### Template 2: Stats Grid (Light BG)

For KPI dashboards. 2×3 or 1×3 grid of rounded cards with icon circles + big numbers.

```
┌─────────────────────────────────┐
│ ████████████ accent bar ████████│
│  Slide Title                    │  Georgia 44pt
│  Brief context sentence         │  Calibri 14pt bodyDark
│                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐  │  Row of 3 rounded cards
│  │⬤ 182K│  │⬤ 26K │  │⬤ 666 │  │  Icon circle + stat + label
│  │Reach  │  │Visits│  │Forms │  │
│  └──────┘  └──────┘  └──────┘  │
│  ┌──────┐  ┌──────┐  ┌──────┐  │  Optional second row
│  │⬤ 65  │  │⬤ 600+│  │⬤ $36 │  │
│  │Calls  │  │Leads │  │CPL   │  │
│  └──────┘  └──────┘  └──────┘  │
│  footnote text italic           │
└─────────────────────────────────┘
```

Card fill cycling for 2×3 grid: primary, neutral600, neutral900, neutral700, neutral900, neutral600.

### Template 3: Comparison Cards (Light BG)

Three side-by-side cards with large stat callouts for comparison.

```
┌─────────────────────────────────┐
│ ████████████ accent bar ████████│
│  Slide Title                    │
│                                 │
│  ┌────────┐ ┌────────┐ ┌──────┐│
│  │  $36   │ │  $64   │ │ $79  ││  Big stat numbers
│  │per cont│ │per cont│ │per co││
│  │────────│ │────────│ │──────││  Thin divider line
│  │610 lead│ │345 lead│ │280 le││  Secondary stat
│  │All Hub │ │Form+Ph │ │Form  ││  Label
│  └────────┘ └────────┘ └──────┘│
│                                 │
│  ┌─ callout box ──────────────┐ │  Explanatory text
│  │ Contextual narrative...    │ │
│  └────────────────────────────┘ │
└─────────────────────────────────┘
```

### Template 4: Hero Stat + Insight Cards (Dark BG)

One large stat on the left, narrative below, 3 insight cards across the bottom.

```
┌─────────────────────────────────┐
│ ████████████ accent bar ████████│
│  Slide Title                    │  Georgia 44pt white
│                                 │
│  3×  more leads in Feb          │  Oversized stat (primary) + description
│      vs. following months       │
│                                 │
│  Context paragraph...           │  Calibri 14pt bodyLight
│                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐  │  3 insight cards (neutral fills)
│  │─acc─ │  │─acc─ │  │─acc─ │  │  Each with short accent bar at top
│  │Title │  │Title │  │Title │  │
│  │Body  │  │Body  │  │Body  │  │
│  └──────┘  └──────┘  └──────┘  │
│                                 │
│  Italic CTA / key takeaway      │  primary color italic
└─────────────────────────────────┘
```

### Template 5: Funnel Bars (Light BG)

Decreasing-width rounded bars to show drop-off/conversion funnel.

```
┌─────────────────────────────────┐
│ ████████████ accent bar ████████│
│  Slide Title                    │
│                                 │
│  ┌══════════════════════════┐   │  Full-width bar (primary fill)
│  │  Stage 1 — 26.7K        │   │
│  └══════════════════════════┘   │
│                                 │
│      ┌════════════════┐         │  Narrower bar (neutral600 fill)
│      │ Stage 2 — 667  │         │
│      └════════════════┘         │
│                                 │
│         ┌═══════════┐  ┌─────┐  │  Narrowest bar + alert badge
│         │Stage3 ~7% │  │93%  │  │
│         └═══════════┘  │drop │  │
│                        └─────┘  │
│  ┌─ callout box ──────────────┐ │
│  │ Key insight paragraph...   │ │
│  └────────────────────────────┘ │
└─────────────────────────────────┘
```

### Template 6: Numbered Steps Grid (Light BG)

2×2 grid of white cards, each with a numbered circle + title + description.

```
┌─────────────────────────────────┐
│ ████████████ accent bar ████████│
│  Slide Title                    │
│                                 │
│  ┌─────────────┐ ┌────────────┐│
│  │ ① Title     │ │ ② Title    ││  Numbered circle + bold title
│  │              │ │             ││
│  │ Description  │ │ Description ││  Body text below
│  │              │ │             ││
│  └─────────────┘ └────────────┘│
│  ┌─────────────┐ ┌────────────┐│
│  │ ③ Title     │ │ ④ Title    ││
│  │              │ │             ││
│  │ Description  │ │ Description ││
│  └─────────────┘ └────────────┘│
│                                 │
└─────────────────────────────────┘
```

Cards are white fill on light BG. Numbered circles use primary accent color.

### Template 7: Closing Slide (Dark BG)

Bookend to the title slide. Large serif title, accent subtitle, optional stat recap.

```
┌─────────────────────────────────┐
│ ████████████ accent bar ████████│
│                                 │
│  The Biggest Unlock             │  Georgia 44pt white
│  Isn't More Traffic             │
│                                 │
│  It's converting what we have.  │  Georgia 20pt primary italic
│                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐  │  Optional 3 stat recap cards
│  │182K+ │  │26.7K │  │ 600+ │  │  (neutral card fills)
│  │reach │  │visits│  │leads │  │
│  └──────┘  └──────┘  └──────┘  │
│                                 │
│  Closing paragraph...           │  Calibri 14pt bodyLight
│                                 │
│  Prepared by X  •  Date         │  Footer
└─────────────────────────────────┘
```

### Template 8: Data Table (Light BG)

For appendix / detailed data. Styled table with accent-colored header row.

See [Table Styling](#table-styling) section below.

---

## Table Styling

Tables use the neutral scale for visual rhythm:

```javascript
const tableOpts = {
  x: 0.6, y: yStart, w: 8.8,
  fontSize: 12,
  fontFace: 'Calibri',
  color: COLORS.titleDark,
  border: { type: 'solid', pt: 0.5, color: COLORS.neutral200 },
  rowH: [0.4, ...Array(dataRows).fill(0.35)],  // header taller
  colW: [...],  // distribute proportionally
  autoPage: false,
};

// Header row styling
const headerRow = columns.map(col => ({
  text: col, options: {
    fill: { color: COLORS.neutral700 },
    color: COLORS.white,
    bold: true,
    fontSize: 12,
    fontFace: 'Calibri',
    align: 'center',
    valign: 'middle',
  }
}));

// Data rows with alternating fills
const dataRowStyles = (rowIndex) => ({
  fill: { color: rowIndex % 2 === 0 ? COLORS.white : COLORS.neutral200 },
  color: COLORS.titleDark,
  fontSize: 12,
  fontFace: 'Calibri',
  align: 'center',
  valign: 'middle',
});

// Highlight specific cells with accent colors
// e.g., positive values in green, negative in red
```

---

## Full Palette Derivation

When given a brand color (e.g., `#2563EB` blue), derive the full palette:

### Step-by-Step

1. **primary** = the brand color as-is: `2563EB`
2. **secondary** = lighten 20-30%: `60A5FA`
3. **darkBg** = desaturate + darken to ~10% lightness, shift hue toward brand: `1A1A2E`
4. **lightBg** = 5% tint of primary over white: `F5F7FF`
5. **calloutBg** = 10% tint of primary over white: `E8EDFA`
6. **neutral900** = same as darkBg: `1A1A2E`
7. **neutral700** = midpoint dark: `2D2D5E`
8. **neutral600** = midpoint: `4A4A7A`
9. **neutral500** = body text: `6B7280`
10. **neutral400** = muted: `9CA3AF`
11. **neutral200** = very light: `EEEEF5`
12. **neutral100** = same as lightBg: `F5F7FF`

### Warm vs Cool Neutrals

- **Warm brands** (gold, orange, red, brown): use warm neutrals with slight yellow/brown undertone
- **Cool brands** (blue, indigo, purple, teal): use cool neutrals with slight blue/gray undertone
- **Green brands**: can go either way — lean warm for earthy, cool for techy

The warmth/coolness of the neutral scale is what makes the deck feel cohesive. Don't mix warm accents with cool neutrals.

---

## Anti-Patterns (Never Do These)

1. **Sharp rectangles for cards** — always rounded. Sharp rect only for slide backgrounds and the accent top bar.
2. **Bullet point lists** — encapsulate in cards or use icon+text rows.
3. **Full-saturation accent backgrounds** — primary color should tint, not dominate. Use it for small elements (bars, circles, text highlights).
4. **Multiple fonts beyond Georgia + Calibri** — the pairing is the system. Adding a third font breaks it.
5. **Centered body text** — left-align everything except stat numbers and footer text.
6. **Missing accent top bar** — it's on every slide, no exceptions.
7. **Uniform card fills** — cycle through the neutral scale for visual depth.
8. **Cramming content** — if a slide has more than ~6 cards or ~120 words of body text, split it into two slides.
9. **Decorative full-width colored bars** beyond the accent top bar — they read as AI slop.
10. **Using serif font (Georgia) for body text** — Georgia is only for slide titles and large stat callouts. Calibri handles everything else.
