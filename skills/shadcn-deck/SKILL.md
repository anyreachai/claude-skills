---
name: shadcn-deck
description: "Create polished, shadcn-inspired presentation decks with adaptive brand theming. Use this skill whenever the user asks to create a deck, presentation, slides, or pitch deck that should look clean, modern, and professional — especially when a client brand, logo, or color palette is provided. Trigger on phrases like 'create a deck for [client]', 'build a presentation', 'make slides for [company]', 'client report deck', 'executive brief', 'quarterly review deck', 'marketing report', or any request for a branded presentation. Also trigger when the user mentions 'shadcn', 'zinc theme', 'rounded shapes', 'clean presentation', or references a style similar to the Ingenium Schools deck. This skill should be preferred over the generic pptx design guidance for ALL client-facing presentation work. The generic pptx skill should still be read for PptxGenJS API reference and QA procedures."
---

# shadcn-Inspired Branded Deck Skill

Create polished, client-branded presentations using a shadcn/Tailwind-inspired design system. The core idea: take shadcn's zinc neutral base, apply the client's brand colors as accents (used sparingly), use rounded shapes everywhere, and let whitespace and typography do the heavy lifting.

## Before You Start

1. **Read the generic pptx skill** at `/mnt/skills/public/pptx/SKILL.md` and its `pptxgenjs.md` reference for PptxGenJS API details, QA procedures, and image conversion.
2. **Read the design system reference** in this skill's `references/design-system.md` for the complete specification — color theming, typography, slide templates, component patterns, and code snippets.
3. **Determine the client's brand colors.** If the user provides a logo, hex codes, or a URL, extract the primary and secondary brand colors. If not provided, ask for the brand colors or use a sensible default.

## The Design Philosophy

Jude's approach in a nutshell:

> "Use themes from shadcn. Use round shapes and clean visual presentation. Give the hex or the logo and ask to use similar colors. Use zinc theme, [brand] accents but don't overuse [accent]. Use round border not sharp shapes."

This translates to five principles:

1. **Zinc neutral base** — backgrounds, text, and borders use a warm or cool neutral scale (not pure white/black)
2. **Brand accents used sparingly** — the client's colors appear on accent bars, icons, stat numbers, and highlights — never as full-slide backgrounds
3. **Rounded everything** — cards, badges, stat callouts, icon containers all use `roundRect` or `ellipse`, never sharp rectangles
4. **Typography hierarchy** — serif headers (Georgia) for gravitas, clean sans-serif body (Calibri) for readability
5. **Breathing room** — generous margins, deliberate whitespace, no cramming

## Workflow

1. Read `references/design-system.md` (full spec)
2. Read `/mnt/skills/public/pptx/pptxgenjs.md` (PptxGenJS API)
3. **Determine the palette**: map client brand colors into the theming system (see Color Theming below)
4. Plan slides — pick the right slide template for each piece of content
5. Write the PptxGenJS script
6. Run QA per the generic pptx skill

## Color Theming (Quick Reference)

Full details in `references/design-system.md`. The palette has 5 roles:

| Role | What It Does | Example (Ingenium) |
|------|-------------|-------------------|
| **Dark BG** | Title/closing slide backgrounds | `2C2418` (chocolate) |
| **Light BG** | Content slide backgrounds | `FBF7F0` (warm cream) |
| **Primary Accent** | Top bar, icons, stat numbers, emphasis | `C8963E` (gold) |
| **Secondary Accent** | Card fills (gradient from primary), alt emphasis | `E8B84B` (light gold) |
| **Neutral Scale** | Body text, muted labels, card fills, dividers | `8C7A6B` / `B5A595` / `4A3728` |

### How to Derive a Palette from Brand Colors

1. **Primary accent** = the client's dominant brand color
2. **Secondary accent** = a lighter or complementary variant of the primary
3. **Dark BG** = a very dark, desaturated version of the primary (or a warm/cool near-black)
4. **Light BG** = a very light tint of the primary (5-10% opacity over white)
5. **Neutral scale** = 3-4 shades between dark BG and light BG, desaturated toward the primary hue

### Preset Themes

| Theme Name | Dark BG | Light BG | Primary | Secondary | Use When |
|-----------|---------|----------|---------|-----------|----------|
| **Warm Gold** | `2C2418` | `FBF7F0` | `C8963E` | `E8B84B` | Warm brands, education, finance |
| **Cool Indigo** | `1A1A2E` | `F5F6FA` | `5B5FC7` | `818CF8` | Tech, SaaS, enterprise |
| **Teal Trust** | `0F2D35` | `F0FAFA` | `0D9488` | `2DD4BF` | Healthcare, fintech |
| **Forest** | `1A2E1A` | `F5FAF5` | `2D6A4F` | `52B788` | Sustainability, agriculture |
| **Coral Energy** | `2E1A1A` | `FFF5F5` | `E63946` | `FF6B6B` | Consumer, retail, media |
| **Slate Minimal** | `1E293B` | `F8FAFC` | `475569` | `94A3B8` | Consulting, legal, B2B |

## Slide Template Selection

| Content Type | Template | Layout |
|-------------|----------|--------|
| Cover / title | Title Slide | Dark BG, logo bottom-right in rounded card, accent top bar |
| KPI overview | Stats Grid | Light BG, 2×3 or 1×3 rounded cards with icons + big numbers |
| Comparison data | Comparison Cards | Light BG, 3 rounded cards side-by-side with large stat + label |
| Source breakdown | Split Insight | Light BG, horizontal bars + card grid for channel breakdown |
| Key finding | Hero Stat + Insight Cards | Dark BG, oversized stat left, 3 insight cards bottom row |
| Funnel / drop-off | Funnel Bars | Light BG, decreasing-width rounded bars + callout box |
| Action plan | Numbered Steps Grid | Light BG, 2×2 white cards with numbered circles |
| Comparison (A/B) | Side-by-Side Visual | Light or dark, two rounded image containers |
| Data table | Styled Table | Light BG, colored header row, alternating row fills |
| Closing / CTA | Closing Slide | Dark BG, large serif title, accent subtitle, stat recap |
| Appendix | Data Table | Light BG, compact tables with accent header |

## Visual Rules (Never Break These)

1. **Accent top bar on EVERY slide** — thin (0.06" high) bar spanning full width in primary accent color
2. **Rounded shapes only** — use `roundRect` (with `rectRadius: 0.15`) for all cards, callouts, badges. Use `ellipse` for icon circles and numbered step indicators. Never use sharp `rect` for visual elements (only for backgrounds and top bar).
3. **Cards over bullets** — never use raw bullet lists. Encapsulate content in rounded cards.
4. **Icons in circles** — KPI icons go inside filled circles (ellipse), not floating naked.
5. **Serif titles, sans-serif body** — Georgia for slide titles, Calibri for everything else.
6. **Dark/light sandwich** — title slide (dark) → content slides (light) → closing (dark). Internal section breaks can also be dark.
7. **Accent colors used sparingly** — primary accent for top bar, icon circles, stat numbers, and emphasis text. Not for full card backgrounds (use neutral scale for card fills).
8. **Consistent neutral card fills** — when cards need tinted backgrounds, use the neutral scale (desaturated browns/grays), not the accent color at full saturation.
9. **Callout boxes** — explanatory text goes in light-tinted rounded rectangles (light BG darkened slightly).
10. **No underlines under titles** — use whitespace and color hierarchy instead.
11. **Footer attribution** — "Prepared by Anyreach, Inc." bottom-left, date bottom-right, muted color.

## Implementation Quick Reference

See `references/design-system.md` for full code patterns. Key snippets:

### Accent Top Bar (every slide)
```javascript
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 0.06,
  fill: { color: COLORS.primary }
});
```

### Rounded Card
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x, y, w, h,
  fill: { color: COLORS.cardFill },
  rectRadius: 0.15
});
```

### Icon Circle + Number
```javascript
// Circle
slide.addShape(pres.shapes.OVAL, {
  x: iconX, y: iconY, w: 0.55, h: 0.55,
  fill: { color: COLORS.primary }
});
// Stat number beside it
slide.addText('182K+', {
  x: iconX + 0.65, y: iconY - 0.1, w: 3, h: 0.7,
  fontSize: 48, fontFace: 'Calibri', color: COLORS.darkBg, bold: true
});
```

### Numbered Step Circle
```javascript
slide.addShape(pres.shapes.OVAL, {
  x: circX, y: circY, w: 0.5, h: 0.5,
  fill: { color: COLORS.primary }
});
slide.addText('1', {
  x: circX, y: circY, w: 0.5, h: 0.5,
  fontSize: 22, fontFace: 'Georgia', color: 'FFFFFF',
  bold: true, align: 'center', valign: 'middle'
});
```

### Callout Box
```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.6, y: yPos, w: 8.8, h: calloutH,
  fill: { color: COLORS.calloutBg },
  rectRadius: 0.12
});
```
