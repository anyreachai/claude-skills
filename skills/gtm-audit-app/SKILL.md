---
name: gtm-audit-app
description: Generate a single-file React (.jsx) prototype that displays the output of a GTM stack audit — findings, tactics, strategy, tools — as an interactive Linear/Vercel-quality dashboard with editorial typography (Fraunces serif, cream + ink, indigo + lime accents). Use this skill whenever the user wants to turn a GTM audit run into a clickable app mockup, product UI, dashboard prototype, or "what would this look like inside our app" artifact. Trigger on "build a JSX prototype for the audit", "show what this would look like as a product", "turn the audit into an app mockup", "JSX version of the audit", "design a UI for this audit data", or whenever GTM audit JSON files (findings.json, tactics.json, strategy.md, run_summary.json) are provided with a request for an interactive prototype rather than a static report. Trigger even for partial requests like "make this look like an app". Do NOT trigger when the user wants a PDF, deck, or static document — use gtm-audit-pdf instead.
---

# GTM Audit App (JSX Prototype)

Turn the JSON output of a GTM stack audit into a single-file React (.jsx)
artifact that looks like a real B2B SaaS product feature — header bar, run
metadata, tab navigation, expandable finding cards, ranked tactics list,
strategy memo, tool inventory.

The visual system is the Anyreach editorial design language adapted to a
product UI: cream + ink alternation, Fraunces serif headlines, DM Sans body,
JetBrains Mono numerics, indigo + lime accents, hairline dividers, severity
chips. The result should feel like Linear or Vercel's admin surface
crossed with a magazine feature — opinionated, sharp, not generic SaaS.

## When To Use This Skill

Use this skill any time someone wants the audit data presented as an
**interactive product UI** — a clickable mockup of how the audit could
appear inside a customer-facing app. Typical triggers:

- "build a JSX prototype for what this would look like in an app"
- "design a product UI for the audit"
- "turn the audit into a dashboard"
- "show me what this would look like as a feature"

For static PDF deliverables, use `gtm-audit-pdf` instead.

## Input Contract

This skill consumes the standard GTM-audit run output. Read what's
available before starting; not every file is required.

| File | Required? | What's in it |
|---|---|---|
| `findings.json` | yes | Array of findings with severity, evidence, implication, recommended_action |
| `tactics.json` | yes | Array of tactics with priority_score, effort, title, expected_outcome |
| `run_summary.json` | yes | Run metadata (tools, severity counts, top findings, runtime) |
| `00_inventory.json` | yes | Per-tool inventory (Attio, Apollo, etc.) with auth + record counts |
| `strategy.md` | recommended | Free-text strategy memo for the Strategy tab content |
| `10_crm.json`, `12_sales_engagement.json`, etc. | optional | Per-tool deep stats — pull these for the Tools tab |

See `references/input_schema.md` for the exact field shapes and how to
map them into the prototype's data model.

## Workflow

1. **Read the input files** in `/mnt/project/` (or wherever the user's
   audit output lives). Always start with `run_summary.json` to get the
   client name, tool list, and severity counts. Then pull the data you'll
   need for each view.

2. **Read `references/design_system.md`** to load the color tokens, font
   stacks, and component patterns into context. Don't invent new tokens —
   the editorial feel comes from disciplined reuse.

3. **Read `references/component_catalog.md`** for the patterns the
   prototype uses: severity chips, effort bars, expandable finding cards,
   tab navigation, hero stat strips, tool cards. Each has a tested
   implementation.

4. **Start from the template** at `templates/audit_app_template.jsx`. It
   has the full structural skeleton — header bar, title block, tab nav,
   five views, footer — with placeholder data. Substitute the real audit
   data into the constants at the top of the file.

5. **Look at the example** at `examples/anyreach_example.jsx` for a
   working reference. Every component pattern is exercised there.

6. **Output to `/mnt/user-data/outputs/<client>_gtm_audit_app.jsx`** as a
   single self-contained file. The artifact should render in the
   Claude.ai artifact previewer with no additional setup.

## Required Page Structure

Every audit-app prototype has the same five tabs in the same order. This
is intentional — consistency across audits means a returning user knows
where to look. Don't reorder or rename without a strong reason.

```
[Top bar]   Logo · client · run number · timestamp · runtime · [Re-run] [Export PDF]
[Title]     Eyebrow · big editorial headline · summary paragraph · audit-engine byline
[Tab nav]   Overview / Findings / Tactics / Strategy / Tools  (sticky)

OVERVIEW
  - Hero stat strip (4 columns on ink): the audit's argument + 3 KPIs
  - Severity distribution bar (cream)
  - Tools audited list (cream)
  - Top 5 findings preview row

FINDINGS
  - Filter row (all / critical / high / medium chips)
  - List of findings, each expandable to show evidence + implication + action

TACTICS
  - Effort summary (XS / S / M / L counts)
  - Ranked tactics list (priority score, effort bars, title, tools)

STRATEGY
  - Hero memo block (ink): the audit's argument quoted from strategy.md
  - Three strategic shifts (3-column tile grid)
  - Risks-if-status-quo callout (4 risks in 2-column layout)

TOOLS
  - One large card per audited tool with stats grid + health badge
```

## Design Discipline

The look comes from restraint. Hard rules:

- **Use the cream/ink/indigo/lime palette only.** Don't introduce new
  hex values. If you think you need a new accent, the answer is to
  rebalance which existing token applies.
- **Fraunces for headlines, DM Sans for body, JetBrains Mono for any
  standalone number.** Never mix these up. Numbers in body fonts kill
  the editorial feel.
- **Lime is the spotlight color.** At most one lime element per view.
  Reserve it for the audit's most-emphasized phrase.
- **Crimson is for `severity: critical` chips and risk callouts only.**
  Don't use it decoratively.
- **Hairline borders, sharp corners.** No rounded corners except the 50%
  radius on tiny status dots. No drop shadows. The system is flat.
- **Italics carry rhetorical weight.** Italicize the emotional or
  conceptual word in headlines: `The machinery is mostly *off*.`,
  `Two systems, *one functioning*.`, `Decide in *30 days*.`

## Output Format

A single `.jsx` file that:

- Imports `React, { useState }` from `'react'` and a small set of icons
  from `'lucide-react'`
- Defines the design tokens (`C`, `FONT_DISPLAY`, `FONT_BODY`,
  `FONT_MONO`) as module-level constants — copy these verbatim from the
  template
- Defines the audit data (`RUN`, `TOOLS`, `FINDINGS`, `TACTICS`,
  `STRATEGIC_SHIFTS`) as module-level constants
- Defines small helper components (`<Mono>`, `<Italic>`, `<Eyebrow>`,
  `<SeverityChip>`, `<EffortChip>`, `<HealthDot>`)
- Defines one view component per tab (`OverviewView`, `FindingsView`,
  `TacticsView`, `StrategyView`, `ToolsView`)
- Exports a default `GTMAuditApp` component that wires it all together

The file should be self-contained — no external CSS, no imports beyond
React and lucide-react. Embed the Google Fonts `<link>` tag inside the
top-level component so Fraunces / DM Sans / JetBrains Mono render
correctly in the artifact previewer.

## After Building — Verify

The artifact runs in a browser, not a Python interpreter, so you can't
visually inspect it. Instead, do a careful **read-pass** of the generated
file before declaring done:

1. Every `FINDING` has `id`, `severity`, `title`, `evidence` (array of
   `[label, value]` pairs), `implication`, `action`, `tools` (array of
   tool names).
2. Every `TACTIC` has `id`, `from` (the source finding), `priority`,
   `effort` (one of `XS`/`S`/`M`/`L`), `title`, `outcome`, `tools`.
3. The hero headline on the Overview tab uses the audit's voice — sharp,
   editorial, opinionated. If it sounds like generic SaaS dashboard
   copy, rewrite it.
4. Lime appears on at most one element per view.
5. Severity counts in the tab nav match the data (`<Mono>{RUN.findingsTotal}</Mono>`
   should equal `FINDINGS.length`, and the per-severity counts should match
   `RUN.findingsBySeverity`).

## Common Pitfalls

- **Importing too many lucide icons.** The template uses ~10 icons
  (`ChevronDown`, `ChevronUp`, `AlertCircle`, `AlertTriangle`,
  `ArrowUpRight`, `Download`, `RefreshCw`, `ExternalLink`, `Sparkles`,
  `Database`, `Mail`). Don't pull in the whole library.
- **Putting all the audit text into one giant constant.** Split into
  the named structures (`RUN`, `TOOLS`, `FINDINGS`, `TACTICS`,
  `STRATEGIC_SHIFTS`). The view components consume them directly.
- **Forgetting the Google Fonts `<link>`.** Without it, Fraunces falls
  back to Times New Roman and the editorial feel collapses to "office
  doc". The link goes inside the top-level component's return JSX.
- **Generic headline copy.** "GTM Audit Dashboard" or "Your audit
  results" is the failure mode. Read `strategy.md` for the audit's
  actual voice and steal a phrase from there.
- **Re-implementing severity chips inline.** Use the `<SeverityChip>`
  component from the template. It encodes the color rules.

## File Layout

```
gtm-audit-app/
├── SKILL.md                       ← this file
├── references/
│   ├── design_system.md           ← colors, fonts, type scale, do/don't
│   ├── component_catalog.md       ← patterns: chips, cards, tabs, hero
│   └── input_schema.md            ← shape of audit JSON files
├── templates/
│   └── audit_app_template.jsx     ← starter scaffold with all 5 tabs
└── examples/
    └── anyreach_example.jsx       ← Anyreach reference implementation
```
