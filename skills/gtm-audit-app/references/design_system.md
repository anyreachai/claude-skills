# Design System — GTM Audit App

The visual contract for the JSX prototype. The system favors restraint
over variety: the editorial feel comes from disciplined reuse of a small
palette and type scale.

---

## Colors

Define these as a `C` constant at the top of the file. Use only these
hex values. Don't invent new ones.

```javascript
const C = {
  cream:        '#F1ECDF',  // primary light page background
  creamSoft:    '#E8E2D2',  // raised cards / callouts on cream
  creamLine:    '#D8D2C0',  // hairline dividers on cream
  mutedOnCream: '#6E6A5C',  // secondary text on cream

  ink:          '#0B0B1C',  // primary dark page background
  inkSoft:      '#161630',  // raised cards on ink
  inkLine:      '#262642',  // hairline dividers on ink
  mutedOnInk:   '#9A95B0',  // secondary text on ink

  indigo:       '#5B5FC7',  // primary brand color, structural emphasis
  indigoLight:  '#8B8FE0',  // softer indigo, secondary fills
  indigoDeep:   '#3D40A0',

  lime:         '#DCFA45',  // SPOTLIGHT — at most one per view
  amber:        '#E8B048',  // severity:high chip
  crimson:      '#B84A56',  // severity:critical chip + risk callouts
  rose:         '#D86878',  // chart-third-row only
};
```

### Color rules

- **Lime is the spotlight.** At most one lime element per view. Use it
  for the audit's most-emphasized phrase ("decide in *30 days*", "the
  machinery is mostly *off*"), or for the export-PDF CTA in the top bar.
  If you find yourself using lime twice on the same view, you're
  overusing it.
- **Crimson is for severity:critical chips and risk callouts only.**
  Never decorative. Never on neutral content.
- **Indigo carries structural emphasis.** Default accent for "view
  linked tactic" buttons, the indigo-bordered evidence panel, and the
  numbers next to a critical eyebrow.
- **Amber = severity:high.** Don't use it for anything else.
- **Use cream for "white".** White is not in the palette.

---

## Typography

Three font families. Each has one job.

```javascript
const FONT_DISPLAY = "'Fraunces', 'Times New Roman', serif";   // headlines
const FONT_BODY    = "'DM Sans', system-ui, sans-serif";       // body, labels
const FONT_MONO    = "'JetBrains Mono', ui-monospace, monospace"; // numbers
```

Embed the Google Fonts at the top of the rendered component:

```jsx
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
/>
```

Without this, Fraunces falls back to Times New Roman and the design
collapses to "generic office doc".

### When to use each

| Font | Use for | Don't use for |
|---|---|---|
| Fraunces (display) | Headlines, hero metrics, card titles, severity counts | Body copy, captions, labels |
| DM Sans (body) | Body, eyebrow labels, captions, button text | Numbers in data, headlines |
| JetBrains Mono | Any standalone number — finding ID, ARR, %, count, priority score | Headlines, body copy |

### Type scale (approximate sizes)

| Use | Size | Font |
|---|---|---|
| Hero headline (overview) | 60px | Fraunces 500 |
| Section headline | 28–40px | Fraunces 500 |
| Card title | 18–22px | Fraunces 500 |
| Big metric | 42–56px | Fraunces 500 (number wrapped in Mono) |
| Body | 13–14px | DM Sans 400 |
| Small body | 11–12px | DM Sans 400 |
| Eyebrow / label | 10px, letter-spacing 0.22em, UPPERCASE | DM Sans 500 |
| Caption | 11px | DM Sans 400 |

### Italic emphasis — the rhetorical device

Inside otherwise-roman headlines, italicize the emotional or conceptual
word. This is what makes headlines feel editorial rather than corporate.

```jsx
<Italic>{children}</Italic>
// equivalent to:
<span style={{ fontStyle: 'italic' }}>{children}</span>
```

Examples (all from the Anyreach reference):

- `The machinery is mostly *off*.`
- `Two systems, *one functioning*.`
- `Pitch versus *data*.`
- `Decide in *30 days*.`

Rules:
- The italic word should be the part that carries argument or emotion.
- Sometimes the italic word should also be in `lime` for additional
  emphasis — but only on the page's single focal moment.
- Never italicize the entire headline. The contrast is the point.

---

## Anti-patterns

Don't:

- ❌ Use rounded corners (except 50% radius on tiny status dots)
- ❌ Add drop shadows or 3D effects (the system is flat)
- ❌ Use white as a background — use cream
- ❌ Center-align body text (left-align always)
- ❌ Use the body font for a number — always Mono
- ❌ Use the body font for a headline — always Display
- ❌ Use lime more than once per view
- ❌ Use crimson decoratively
- ❌ Italicize an entire headline — italic is for emphasis only
- ❌ Use emoji as decorative elements

Do:

- ✅ Cream/ink/indigo/lime palette only
- ✅ Sharp corners, hairline dividers, flat surfaces
- ✅ Left-align body text
- ✅ Wrap every number in `<Mono>`
- ✅ Wrap the emotional word in headlines in `<Italic>`
- ✅ Use the cream/ink alternation for visual rhythm (Overview is cream,
  Strategy hero is ink, etc.)
