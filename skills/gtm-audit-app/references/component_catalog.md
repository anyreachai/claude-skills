# Component Catalog — GTM Audit App

The reusable UI patterns the JSX prototype needs. Each pattern below
is exercised in `examples/anyreach_example.jsx`. Copy them; don't
reinvent.

---

## Inline text helpers

### `<Mono>` — wraps any standalone number

```jsx
const Mono = ({ children, color }) => (
  <span style={{
    fontFamily: FONT_MONO,
    fontVariantNumeric: 'tabular-nums',
    color,
  }}>{children}</span>
);
```

Wrap every standalone number in this — finding IDs (`F-001`), priority
scores (`9.5`), percentages (`6.8%`), counts (`46,191`). The
`tabular-nums` setting makes digits align in a column, which matters
when stacking metric tiles.

### `<Italic>` — the rhetorical emphasis

```jsx
const Italic = ({ children, color }) => (
  <span style={{ fontStyle: 'italic', color }}>{children}</span>
);
```

Use inside roman headlines to italicize the emotional/conceptual word.

### `<Eyebrow>` — uppercase tracked label

```jsx
const Eyebrow = ({ children, color = C.mutedOnCream }) => (
  <div style={{
    fontFamily: FONT_BODY, fontSize: 10, letterSpacing: '0.22em',
    textTransform: 'uppercase', fontWeight: 500, color,
  }}>{children}</div>
);
```

Every section, every card, every panel has one. Pass `color={C.mutedOnInk}`
on dark backgrounds, `color={C.indigo}` for "Recommended action" labels,
`color={C.crimson}` for risk callouts.

---

## Severity & effort chips

### `<SeverityChip level={...} />`

Used in the findings list, the top-5 preview, and the findings ledger.

```jsx
const SeverityChip = ({ level }) => {
  const styles = {
    critical: { bg: C.crimson, fg: C.cream, label: 'Critical' },
    high:     { bg: C.amber,   fg: C.ink,   label: 'High' },
    medium:   { bg: C.creamLine, fg: C.ink, label: 'Medium' },
    low:      { bg: C.creamSoft, fg: C.mutedOnCream, label: 'Low' },
  }[level];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 9px', background: styles.bg, color: styles.fg,
      fontFamily: FONT_BODY, fontSize: 10, letterSpacing: '0.16em',
      textTransform: 'uppercase', fontWeight: 600,
    }}>
      <span style={{ width: 6, height: 6, background: styles.fg,
                     borderRadius: '50%', opacity: 0.8 }} />
      {styles.label}
    </span>
  );
};
```

### `<EffortChip effort="S" />`

Used in the tactics list. Renders as 4 small bars (filled to indicate
relative effort) plus the letter code.

```jsx
const EffortChip = ({ effort }) => {
  const fill = { XS: 1, S: 2, M: 3, L: 4 }[effort] || 1;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ display: 'inline-flex', gap: 2 }}>
        {[1, 2, 3, 4].map(i => (
          <span key={i} style={{ width: 5, height: 14,
            background: i <= fill ? C.ink : C.creamLine }} />
        ))}
      </span>
      <Mono color={C.ink}><span style={{ fontSize: 11, fontWeight: 500 }}>{effort}</span></Mono>
    </span>
  );
};
```

---

## Top bar

Sticky-top, ink background, hosts logo + run metadata + actions.

Structure:
- Left: small lime square (rotated 45°) + `Anyreach` + ` / ` + `GTM Stack Audit`
- Center: spacer
- Right: run metadata (run #, completion date, runtime with green dot),
  divided by 1px vertical rules
- Far right: `[Re-run audit]` ghost button + `[Export PDF]` lime button

The lime PDF-export button is the ONE place in the entire UI where
lime appears as a pure CTA color (overview hero gets the other lime
moment). This is intentional: the export-to-PDF action is the bridge
to the deck artifact.

---

## Title block

Below the top bar, before the tab nav.

- Eyebrow: `<client> · <window> audit window`
- Hero headline: 60px Fraunces, can include `<Italic>` and break across 2 lines.
  This is the audit's argument in one sentence.
- Body paragraph: 15px DM Sans, color `C.mutedOnCream`, max-width 760px.
  This is what the audit found, summarized in 2–3 sentences.
- Right column (border-left, 32px padding-left): "Audit by" + engine name
  + version + a small chip showing the model that ran the audit.

The hero headline is the most important text in the artifact. It should
sound like the strategy memo speaks — sharp, opinionated, editorial.
Read `strategy.md` and steal a phrase.

---

## Tab nav

Sticky at the top of the scroll area. Five tabs in this exact order:

```
Overview   Findings <count>   Tactics <count>   Strategy   Tools <count>
```

The count chips next to Findings/Tactics/Tools use `<Mono>` and are
colored:
- Findings: `C.crimson` when active (because of critical findings)
- Tactics: `C.indigo` when active
- Tools: `C.ink` when active

Active tab gets a 2px ink underline + 600 weight. Inactive: muted text,
no underline. Underline sits flush with the bottom border using a -1px
margin trick.

---

## Hero stat strip (Overview tab)

The single biggest moment of the Overview tab. Ink background, full width
(extends to page edges visually, contained within layout). 4 columns
separated by 1px inkLine vertical rules.

- Column 1 (1.5 ratio): the audit's argument as a multi-line headline,
  ending with `<Italic color={C.lime}>` on the punchline word.
- Columns 2–4: KPI tiles — Findings count + severity breakdown,
  Recommended Tactics count + 30-day breakdown, Audit Runtime + tool
  count.

Numbers in the KPI tiles: 56px Fraunces, wrapped in `<Mono>` for digit
alignment.

---

## Severity distribution bar (Overview tab)

Horizontal stacked bar, 80px tall. Three segments (critical / high /
medium) sized by count. Each segment shows:
- Top: small uppercase "CRITICAL" / "HIGH" / "MEDIUM" label
- Bottom: the count in 36px Fraunces wrapped in Mono

1px gap between segments using `gap: 1` and `background: C.creamLine`
on the parent.

---

## Tools audited list (Overview tab) + Tool cards (Tools tab)

Compact version (overview):
- Each tool row: 36px ink square with the tool's lucide icon, name in
  18px Fraunces, category in 11px DM Sans muted, and a colored
  `<HealthDot>` on the right.
- Separated by 1px `C.creamLine` rows.

Full version (Tools tab):
- One large card per tool. If health is `critical`, the card has ink
  background with cream text — this is rare and signals "this tool
  needs immediate attention". If `amber`, the card has cream background
  with ink text and an amber "Needs attention" chip.
- Header row: 56px icon square + name (36px Fraunces) + workspace info
  + status chip (crimson for critical, amber for needs-attention).
- 4-column stats grid below, separated by 1px hairlines (inkLine on
  ink, creamLine on cream).
- Footer line: italic health note explaining the issue.

---

## Findings list (Findings tab)

Clickable rows with expand/collapse. Each row:

```
[F-XXX]  [SeverityChip]  [Title in 17px Fraunces]    [Tool tags]   [▼/▲]
```

Border between rows: 1px `C.creamLine`. First row has a 1px ink top
border. Last row has a 1px ink bottom border.

Expanded state shows a 2-column layout below the row:
- Left (1fr): Evidence panel — `C.creamSoft` background, 2px indigo
  left border. Eyebrow "Evidence", then a list of `[label, value]`
  pairs separated by 1px `C.creamLine`.
- Right (1.4fr): Implication paragraph + Action paragraph. The Action
  section has its own eyebrow in `C.indigo` and ends with two buttons:
  `[View linked tactic]` (primary) and `[Mark as reviewed]` (ghost).

---

## Tactics list (Tactics tab)

Similar row structure but more dense (no expand state):

```
[N.] [9.5]  [EffortChip]  [Title + ID/from/outcome]   [Tool tags]   [↗]
```

The priority score `9.5` is rendered in 26px Fraunces with the digit
wrapped in Mono.

The title row has the title in 15px Fraunces and a smaller line below
in 12px DM Sans muted that reads:
`<Mono color={C.indigo}>{T-id}</Mono> · from <Mono>{F-id}</Mono> · {outcome}`

---

## Strategy hero memo (Strategy tab)

The audit's argument in one big block. Ink background, 56px vertical
padding, 60px horizontal padding. 40px Fraunces headline with two
italicized phrases. Below: 14px body in muted-on-ink, max-width 880px.

This is the "thesis" of the entire audit. Take the hero paragraph
from `strategy.md`'s executive summary and adapt it.

---

## Three strategic shifts (Strategy tab)

3-column tile grid, each shift gets one column. Each card:

- Big number `01` / `02` / `03` in 56px Fraunces (first one in `C.indigo`
  to highlight which is the lead shift)
- Title in 22px Fraunces 500
- Body in 13px DM Sans, color `C.ink`, line-height 1.6
- Spacer (`flex: 1`) to push the alt body to the bottom
- Alt body (the "or accept the alternative" line): 12px italic muted,
  separated by a 1px `C.creamLine` top border

The 1px gap between cards is achieved by `gap: 1; background: C.creamLine`
on the parent grid.

---

## Risks callout (Strategy tab)

A 2-column grid of 4 risk descriptions, inside a `C.creamSoft` panel
with 2px crimson left border. Eyebrow in crimson reads "Risks if status
quo persists". Each risk has a 15px Fraunces title and a 12px muted
body.

---

## Footer

Single row, 24px padding, 11px text in mutedOnCream. Two columns:
- Left: run metadata recap (`Audit run by <user> · <N> tools · <N>
  findings · <runtime> elapsed`)
- Right: a few footer links separated by `·` (`View raw JSON`,
  `Documentation`, `Audit history`). The first link gets a tiny
  `<ExternalLink size={11} />` icon.
