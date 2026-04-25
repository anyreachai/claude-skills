---
name: brand-style-extractor
description: >
  Extract a comprehensive brand style guide from any company website URL and generate a structured .md file covering brand voice, typography, colors, logo usage, imagery, and design patterns. Use this skill whenever the user provides a company URL and asks to extract, document, or reverse-engineer their brand guidelines, style guide, visual identity, brand voice, or design system. Also trigger when the user says things like "pull brand info from this site", "what's their brand style?", "generate a brand guide for [company]", "extract the design language from [URL]", "document their visual identity", or "create a style guide from their website". Trigger even for partial requests like "what fonts do they use?" or "what's their brand color?" since the full extraction produces a complete, reusable document.
---

# Brand Style Extractor

Extract a company's complete brand identity from their website and produce a clean, structured `.md` style guide file.

---

## Workflow

### Step 1 — Fetch and Analyze the Website

Fetch the root URL the user provided. Also fetch 1–2 additional pages that typically carry richer brand signals:
- `/about` or `/about-us`
- A product or marketing landing page
- The blog or press page (often uses editorial typography)

Use `web_fetch` for each. Capture raw HTML so you can inspect inline styles, `<link>` tags, CSS custom properties, and meta tags.

**What to look for in HTML/CSS:**
- `<link rel="stylesheet">` — external font imports (Google Fonts, Adobe Fonts, etc.)
- `@font-face` declarations or `font-family` CSS properties
- CSS custom properties (`:root { --color-primary: ... }`)
- Tailwind / design token class names (`bg-indigo-600`, `text-gray-900`)
- Inline `style=""` attributes on hero sections, buttons, navbars
- `<meta name="theme-color">` and `<meta property="og:image">`
- SVG logos embedded inline (can reveal exact brand colors)
- Button, link, and CTA styles

If CSS files are referenced, fetch 1–2 of the most likely candidates (e.g., `main.css`, `app.css`, `styles.css`) to extract design tokens directly.

---

### Step 2 — Web Search for Public Brand Assets

Run targeted searches to supplement what you found on the site:

```
"[Company Name]" brand guidelines
"[Company Name]" style guide
"[Company Name]" design system
"[Company Name]" fonts colors logo
site:[domain] brand OR press OR media-kit
```

Also check:
- `/brand`, `/press`, `/media-kit`, `/assets` paths on the domain
- Behance, Dribbble, or Notion pages if the company has published a public design system

---

### Step 3 — Extract Brand Attributes

Compile findings across these categories:

#### 🎨 Colors
- List every distinct color found, with hex codes
- Classify each: Primary / Secondary / Accent / Neutral / Background / Text
- Note dark mode variants if present
- Flag if a color appears in the logo SVG

#### 🔤 Typography
- Font families used (display, heading, body, mono/code)
- Font weights observed (300, 400, 600, 700, etc.)
- Approximate type scale (hero size, H1–H4, body, caption)
- Line height and letter spacing if discernible
- Source (Google Fonts link, Adobe Fonts, custom/proprietary)

#### 🗣️ Brand Voice
- Tone adjectives: formal vs. casual, playful vs. serious, technical vs. accessible
- Vocabulary patterns: do they use jargon, superlatives, first person?
- CTA language: action verbs they favor ("Start free", "Get started", "Book a demo")
- Tagline or mission statement if present
- Any "we believe" or manifesto language

#### 🖼️ Imagery & Iconography
- Photography style: lifestyle, product, abstract, illustration
- Illustration style if present: flat, 3D, hand-drawn, data-viz
- Icon style: outline, filled, rounded, sharp
- Observed patterns: people/faces, gradients, geometric shapes

#### 📐 Layout & Spacing
- Layout style: tight/dense vs. airy/spacious
- Grid: card-heavy, full-bleed sections, sidebar layouts
- Border radius preferences: sharp, slightly rounded, pill-shaped
- Shadow usage: none, subtle, dramatic

#### 🔲 Logo & Brand Mark
- Primary logo description (wordmark, icon + wordmark, monogram)
- Observed color variants (light bg, dark bg, monochrome)
- Any tagline lockup?

---

### Step 4 — Produce the Style Guide `.md`

Write a clean, well-structured Markdown file. Use the template below. Fill in every section with what you found; mark anything uncertain with `*inferred*` and anything not found with `— not detected`.

```markdown
# [Company Name] Brand Style Guide
> Extracted from [domain] on [date]
> *This guide is reverse-engineered from the public website. Treat inferred values as approximations.*

---

## Brand Overview
**Tagline / Mission:** ...
**Industry:** ...
**Positioning:** ...

---

## Brand Voice & Tone

| Attribute | Description |
|-----------|-------------|
| Tone | e.g. Confident, approachable, direct |
| Formality | e.g. Semi-formal — uses contractions, avoids jargon |
| Personality | e.g. Optimistic, expert, human-centered |
| Key phrases / CTAs | "Get started free", "See it in action" |
| Avoid | e.g. Passive voice, overly technical language |

**Sample copy observed:**
> "[Quote from hero or about page]"

---

## Colors

### Primary Palette
| Name | Hex | Usage |
|------|-----|-------|
| Brand Blue | `#1A56DB` | Primary CTA, links, active states |
| ... | | |

### Secondary / Accent
| Name | Hex | Usage |
|------|-----|-------|
| ... | | |

### Neutrals
| Name | Hex | Usage |
|------|-----|-------|
| Background | `#F9FAFB` | Page background |
| ... | | |

---

## Typography

### Font Stack
| Role | Family | Weight(s) | Source |
|------|--------|-----------|--------|
| Display / Hero | Inter | 700, 800 | Google Fonts |
| Body | Inter | 400, 500 | Google Fonts |
| Mono / Code | JetBrains Mono | 400 | Google Fonts |

### Type Scale (approximate)
| Level | Size | Weight | Notes |
|-------|------|--------|-------|
| Hero | 56–72px | 800 | |
| H1 | 40px | 700 | |
| H2 | 32px | 700 | |
| H3 | 24px | 600 | |
| Body | 16px | 400 | |
| Caption | 14px | 400 | Muted color |

---

## Logo & Brand Mark

- **Type:** Wordmark / Icon + Wordmark / Monogram
- **Primary version:** [description]
- **Color variants:** Full color (light bg), White (dark bg), Monochrome
- **Clear space:** *not detected*
- **Min size:** *not detected*

---

## Imagery Style

- **Photography:** [e.g. Clean product shots on white, lifestyle team photos]
- **Illustration:** [e.g. Flat geometric, abstract gradient blobs]
- **Iconography:** [e.g. 24px outline icons, 2px stroke, rounded caps]
- **Patterns / textures:** [e.g. Subtle dot grid background on hero]

---

## Layout & Components

- **Spacing:** [e.g. Generous whitespace, 80–120px section padding]
- **Border radius:** [e.g. 8px cards, 4px inputs, pill buttons]
- **Shadows:** [e.g. Soft drop shadows on cards: `0 4px 24px rgba(0,0,0,0.08)`]
- **Grid:** [e.g. 12-column, max-width 1200px, centered]
- **Card style:** [e.g. White bg, 1px `#E5E7EB` border, 16px radius]

---

## Component Patterns

### Buttons
- Primary: `[bg color]` bg, white text, `[radius]` radius
- Secondary: Outlined, `[color]` border
- CTA language: `[examples]`

### Navigation
- [e.g. Top sticky nav, white bg, logo left, links center, CTA right]

### Hero Sections
- [e.g. Left-aligned headline, subhead, dual CTA, right-side product screenshot]

---

## Design Principles (inferred)
1. [e.g. Clarity over cleverness]
2. [e.g. Product-led — show don't tell]
3. [e.g. Human warmth in a technical space]

---

*Last updated: [date] | Source: [URL]*
```

---

### Step 5 — Save and Return the File

Save the completed style guide as:
```
[company-name]-brand-style-guide.md
```

Copy to `/mnt/user-data/outputs/` and present the file to the user via `present_files`.

Briefly summarize the 3–4 most distinctive brand characteristics you found (e.g. "Lato + Inter, heavy use of electric blue `#2563EB`, very conversational tone with short punchy CTAs").

---

## Tips & Edge Cases

- **Heavily JS-rendered sites (React/Next/Vue):** The raw HTML fetch may be sparse. In this case, rely more on web search for brand assets and CSS file analysis. Look for `_next/static/css/` or `assets/` paths.
- **Dark-mode-first sites:** Note both dark and light palette; label which is primary.
- **Design systems (e.g. Stripe, Linear):** These companies often have public docs sites — fetch those too (`stripe.com/docs`, `linear.app/docs`).
- **Enterprise / B2B sites:** Often conservative — note if the design is deliberately understated.
- **If a press/media kit page exists:** Always fetch it — it usually has the most reliable color and logo information.
- **Conflicting signals:** If the site uses many colors, identify the 2–3 that appear in hero sections and CTAs as primary; the rest are likely secondary or UI utility colors.
