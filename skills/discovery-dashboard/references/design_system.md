# Design System — Discovery Dashboard

The visual contract for the JSX dashboard. Same editorial language as
the rest of the Anyreach artifact family.

---

## Colors

Define these as a `C` constant at the top of the file. Only these
hex values. No improvisation.

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

  indigo:       '#5B5FC7',  // primary brand, structural emphasis
  indigoLight:  '#8B8FE0',  // softer indigo, secondary fills
  indigoDeep:   '#3D40A0',

  lime:         '#DCFA45',  // SPOTLIGHT — at most one per view
  amber:        '#E8B048',  // risk:medium, sentiment:neutral-positive
  crimson:      '#B84A56',  // risk:high, sentiment:blocker
  rose:         '#D86878',  // chart third-row only

  // Sentiment-specific helpers
  sentPositive: '#7FB069',  // green-ish, sentiment dot for champions
  sentNeutral:  '#9A95B0',  // muted, sentiment dot for neutral
  sentSkeptic:  '#E8B048',  // amber, sentiment dot for skeptical
  sentBlocker:  '#B84A56',  // crimson, sentiment dot for blockers
};
```

### Color rules

- **Lime is the spotlight.** One element per view. Reserve it for the
  dashboard's single focal moment — usually the deal-size estimate on
  the hero strip, the timeline ultimatum on the next-steps tab, or the
  italicized operative word in the hero headline.
- **Crimson is for `risk:high` and blocker stakeholders only.** Never
  decorative.
- **Indigo carries structural emphasis.** Default accent for tab
  navigation underline, "drill into tactic" buttons, and the bordered
  callout panels.
- **Amber = `risk:medium`, sentiment-skeptical, scope:partial.**
  Don't overload it.
- **Sentiment dots** use their own palette (`sentPositive`,
  `sentNeutral`, `sentSkeptic`, `sentBlocker`) — these are the only
  places where green appears. No green elsewhere.
- **Use cream for "white".** White is not in the palette.

---

## Typography

Three font families. Each has one job.

```javascript
const FONT_DISPLAY = "'Fraunces', 'Times New Roman', serif";   // headlines
const FONT_BODY    = "'DM Sans', system-ui, sans-serif";       // body, labels
const FONT_MONO    = "'JetBrains Mono', ui-monospace, monospace"; // numbers
```

Embed the Google Fonts inside the top-level component's return JSX:

```jsx
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
/>
```

Without this, Fraunces falls back to Times New Roman and the editorial
feel collapses.

### When to use each

| Font | Use for | Don't use for |
|---|---|---|
| Fraunces | Headlines, hero metrics, card titles, stakeholder names | Body copy, captions |
| DM Sans | Body, eyebrow labels, captions, button text | Numbers, headlines |
| JetBrains Mono | Any standalone number — count, $, %, dates as digits, scores | Headlines, body |

### Type scale

| Use | Size | Font |
|---|---|---|
| Hero headline | 56–60px | Fraunces 500 |
| Section headline | 28–36px | Fraunces 500 |
| Card title | 16–20px | Fraunces 500 |
| Big metric | 40–52px | Fraunces 500 (numbers wrapped in Mono) |
| Body | 13–14px | DM Sans 400 |
| Small body | 11–12px | DM Sans 400 |
| Eyebrow / label | 10px, letter-spacing 0.22em, UPPERCASE | DM Sans 500 |
| Caption | 11px | DM Sans 400 |
| Pull quote | 15–17px italic | Fraunces 400 italic |

### Italic emphasis

Inside otherwise-roman headlines, italicize the conceptual word.
That's the trick that makes headlines feel editorial rather than
generic SaaS.

```jsx
<Italic>{children}</Italic>
// equivalent to:
<span style={{ fontStyle: 'italic' }}>{children}</span>
```

Examples appropriate for a discovery dashboard:
- `Two systems, one *mandate*.`
- `The pain is *measured*, not vague.`
- `Decide by *Friday*.`
- `Six channels, *one* roadmap.`
- `Procurement is *the* clock.`

Rules:
- The italic word should be the part that carries argument or emotion.
- Sometimes pair italic with `lime` color for the page's single focal
  moment — but only on the hero headline, not elsewhere.
- Never italicize the entire headline. The contrast is the point.

### Pull quotes

Stakeholder quotes get special treatment — italic Fraunces, 15–17px,
with a left-border accent in `creamLine` (on cream) or `inkLine` (on
ink). Always attributed: `— First Last, Title`.

```jsx
<blockquote style={{
  fontFamily: FONT_DISPLAY,
  fontStyle: 'italic',
  fontSize: 16,
  lineHeight: 1.4,
  borderLeft: `2px solid ${C.creamLine}`,
  paddingLeft: 14,
  margin: 0,
  color: C.ink,
}}>
  "We're hemorrhaging on after-hours volume."
  <footer style={{
    fontFamily: FONT_BODY, fontStyle: 'normal',
    fontSize: 11, color: C.mutedOnCream, marginTop: 6,
  }}>
    — Dee Kohler, Sr. Director, Operations
  </footer>
</blockquote>
```

---

## Sentiment & Status Visualization

The dashboard quantifies subjective signals (sentiment, influence,
risk) on small consistent scales:

| Signal | Scale | Visual |
|---|---|---|
| Stakeholder sentiment | positive / neutral / skeptical / blocker | colored dot (50% radius), 8px |
| Stakeholder influence | 1–5 | horizontal bar, indigo fill |
| Risk impact | high / medium / low | severity chip (crimson / amber / muted) |
| Risk likelihood | high / medium / low | same chip palette, second dimension on heatmap |
| Scope item status | committed / probable / exploratory | colored chip outline |

The 2D plots (Influence × Sentiment, Impact × Likelihood) are simple
CSS grids — 4 quadrants on a 220×220 area with axis labels in
`mutedOnCream`. Dots positioned via `position: absolute` with `left`
and `top` percentages.

---

## Anti-patterns

Don't:
- ❌ Rounded corners (except 50% radius on dots)
- ❌ Drop shadows or 3D effects
- ❌ White backgrounds — use cream
- ❌ Center-aligned body text — always left-align
- ❌ Body font for a number
- ❌ Display font for a label
- ❌ Lime more than once per view
- ❌ Crimson decoratively
- ❌ Italicize an entire headline
- ❌ Emoji as decoration
- ❌ Stock-photo-style stakeholder avatars (use initials in monogram circles)

Do:
- ✅ Cream/ink alternation across views for visual rhythm
- ✅ Sharp corners, hairline dividers, flat surfaces
- ✅ Wrap every number in `<Mono>`
- ✅ Wrap the emotional word in headlines in `<Italic>`
- ✅ Pair every pain with a value prop (or explicit no-answer marker)
- ✅ Quote stakeholders verbatim when possible
