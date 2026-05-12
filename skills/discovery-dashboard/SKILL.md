---
name: discovery-dashboard
description: Generate a single-file React (.jsx) interactive project dashboard from a discovery call transcript, meeting notes, or early-stage account context. Produces an editorial dashboard with a "what is this project" overview plus drill-down tabs for stakeholders, pain & value, scope, decision path, and risks/next steps. Trigger when Richard provides a discovery transcript, kickoff notes, or scoping notes and asks to turn it into a dashboard, project snapshot, account view, deal map, or at-a-glance view. Trigger on phrases like "turn this discovery into a dashboard", "project dashboard from these notes", "JSX view of this deal", "snapshot this discovery", "deal-on-a-page", "drill-down view of this call", "project map from the transcript". Also trigger when a transcript or notes file is uploaded with a request to visualize the project or create an internal view of the deal. Do NOT use for PDF briefs (use account-brief-generator), SoWs (use proposal-sow-generator), or call scoring (use analyze-call).
---

# Discovery Dashboard (JSX Project View)

Turn raw discovery material — call transcript, meeting notes, attached
docs, Slack thread, anything the team captured in the first 1–3
touchpoints with a prospect — into a single-file React (.jsx) dashboard
that says, at a glance, **what this project is, who's involved, and
what we still need to learn**.

The dashboard has a sticky top bar with deal metadata, an editorial
hero block that frames the project in one sentence, a 4-stat strip,
and six drill-down tabs. Every section is built to answer one question
fast and let you go deeper without leaving the page.

The visual system is the Anyreach editorial design language — cream +
ink alternation, Fraunces serif headlines, DM Sans body, JetBrains
Mono numerics, indigo + lime accents, hairline dividers, sharp
corners. Goal: feels like a real B2B product surface (Linear or
Vercel admin), not a Notion doc.

## When To Use This Skill

Use this skill whenever Richard provides discovery material and wants
a visual project snapshot. Typical triggers:

- "turn this discovery call into a dashboard"
- "make a project dashboard from these notes"
- "give me the account view for [prospect]"
- "snapshot this discovery"
- "what does this deal look like at a glance"
- "build a JSX view of this project"

For other deliverables from the same input:
- **PDF brief / account memo** → `account-brief-generator`
- **Proposal / SoW** → `proposal-sow-generator`
- **Call scoring + analysis PDF** → `analyze-call`
- **Recap email to attendees** → `meeting-recap-email`
- **Stakeholder psychoanalysis** → `stakeholder-intel`

Use `discovery-dashboard` when the deliverable is an **interactive
artifact for internal use** — something the deal team scrolls through
to orient on a fresh opportunity.

## Input Contract

This skill is omnivorous on input. Any combination of:

| Input | Where it lives | What to pull from it |
|---|---|---|
| Discovery call transcript | uploaded file or pasted text | most of the dashboard — quotes, pain, scope, stakeholders, next steps |
| Meeting notes | uploaded .md/.docx or pasted | same as transcript, often more curated |
| Slack thread | pasted | internal interpretation, who-said-what after the call |
| Email thread | pasted or via Gmail tool | prior context, stakeholder list, next-step commitments |
| Attached deck or doc from prospect | uploaded | scope clues, technical stack, internal initiatives |
| LinkedIn profiles of attendees | URLs | stakeholder titles + influence calibration |

**Minimum viable input**: a transcript or set of notes from one
discovery-stage call. Everything else is bonus context that improves
calibration.

## Workflow

1. **Read every input file before drafting**. Use `view` on uploaded
   files, read transcripts in full. Do not skim — the dashboard's
   credibility depends on quoting real things people actually said.

2. **Read `references/design_system.md`** to load the color tokens,
   font stack, and component patterns into context.

3. **Read `references/data_model.md`** to see the exact shape of the
   constants the JSX template expects (`PROJECT`, `STAKEHOLDERS`,
   `PAIN_POINTS`, `VALUE_PROPS`, `SCOPE`, `DECISION`, `RISKS`,
   `NEXT_STEPS`, `OPEN_QUESTIONS`, `COMPETITION`).

4. **Read `references/extraction_guide.md`** for the heuristics on
   how to pull each piece from raw transcript material — what counts
   as a pain point, how to score stakeholder influence/sentiment, how
   to tag scope items.

5. **Start from the template** at `templates/dashboard_template.jsx`.
   The structural skeleton — top bar, hero, 4-stat strip, six tabs,
   helper components — is already wired. Replace the placeholder data
   constants at the top of the file with extracted data.

6. **Reference the example** at `examples/example_dashboard.jsx` for
   a realistic worked example (a fictional BPO discovery call) showing
   every component populated with believable content.

7. **Output to `/mnt/user-data/outputs/<company>_discovery_dashboard.jsx`**
   as a single self-contained file that renders in the Claude.ai
   artifact previewer with no external setup.

## Required Page Structure

Every discovery dashboard has the same six tabs in the same order.
Consistency means Richard always knows where to look on a fresh
opportunity. Don't reorder or rename without a strong reason.

```
[Top bar]   Logo · prospect name · call date · deal stage · owner · [Export] [Share]
[Hero]      Eyebrow · big editorial headline · one-paragraph project frame · attribution
[Strip]     4 KPIs on ink: deal-size estimate · timeline · stakeholder count · use cases
[Tab nav]   Overview / Stakeholders / Pain & Value / Scope / Decision / Risks & Next  (sticky)

OVERVIEW (cream)
  - Project frame block (the one-paragraph thesis of what we're solving)
  - "What we heard" — 3-column preview: top pain, top value, top risk
  - Use case chip grid (5–9 chips with channel + status badges)
  - Mini timeline bar (kickoff → pilot → expansion milestones)
  - Top 3 next steps preview row

STAKEHOLDERS (cream)
  - Stakeholder count + role distribution header
  - Influence × Sentiment grid (2D plot, 4 quadrants labeled)
  - Stakeholder cards: name, title, role-in-deal, sentiment, "what they said" pull-quote

PAIN & VALUE (ink)
  - Two-column mapping: each pain on the left → value prop / Anyreach answer on the right
  - Each row clickable / expandable to show source quote from transcript
  - Quantified-pain callout strip at bottom (the few pains where they gave numbers)

SCOPE (cream)
  - Channels covered (voice / chat / SMS / email / WhatsApp) with volume estimates
  - Languages required
  - Integrations needed (CRM, contact center, telephony, data sources)
  - In-scope vs out-of-scope two-column list
  - Technical requirements / non-negotiables

DECISION (cream)
  - Decision criteria checklist (what they said matters for vendor choice)
  - Process map: champion → economic buyer → security → procurement → signed
  - Competition list with positioning notes
  - Timeline bar with key decision milestones

RISKS & NEXT STEPS (ink)
  - Risk heatmap (impact × likelihood) — 4-quadrant 2D plot
  - Open questions list (things we did NOT get answered)
  - Concrete next steps with owners + dates
  - "Decide in 14 days" style spotlight callout for the one thing that unlocks momentum
```

## Design Discipline

The look comes from restraint. Hard rules (same as gtm-audit-app):

- **Use the cream/ink/indigo/lime palette only.** No new hex values.
- **Fraunces for headlines, DM Sans for body, JetBrains Mono for any
  standalone number.** Never mix these up.
- **Lime is the spotlight color.** At most one lime element per view.
  Reserve it for the single most-emphasized phrase (often a deal-size
  number, a timeline ultimatum, or the dashboard's argument).
- **Crimson is for `severity: high` risks and red-flag callouts only.**
  Not decorative.
- **Hairline borders, sharp corners.** No rounded corners except the
  50% radius on tiny status dots. No drop shadows. The system is flat.
- **Italics carry rhetorical weight.** Italicize the emotional or
  conceptual word in headlines: `Two systems, *one mandate*.`,
  `The pain is *measured*, not vague.`, `Decide by *Friday*.`

## Voice & Copy Rules

The dashboard's editorial credibility comes from the headlines and
quote selections. Generic copy ("Discovery Call Summary", "Project
Overview Dashboard") is the failure mode.

- **Hero headline** = one-sentence thesis of the project, in Richard's
  voice. Italicize the operative word.
- **Pull quotes** from stakeholders should be verbatim or close
  paraphrase. If the transcript has a phrase that captures the deal's
  argument ("we're hemorrhaging on after-hours volume"), it goes in.
- **Project frame paragraph** should answer: what problem, what scope,
  what success looks like, what's the urgency. ~50 words, declarative.
- **Eyebrow labels** are ALL CAPS, letter-spaced, 10px. Use them for
  section labels: `DISCOVERY · APR 23 2026`, `STAKEHOLDER MAP`,
  `WHAT WE HEARD`.

## Output Format

A single `.jsx` file that:

- Imports `React, { useState }` from `'react'` and ~10 icons from
  `'lucide-react'`
- Defines design tokens (`C`, `FONT_DISPLAY`, `FONT_BODY`, `FONT_MONO`)
  as module-level constants (copy verbatim from the template)
- Defines the discovery data (`PROJECT`, `STAKEHOLDERS`, `PAIN_POINTS`,
  `VALUE_PROPS`, `SCOPE`, `DECISION`, `RISKS`, `NEXT_STEPS`,
  `OPEN_QUESTIONS`, `COMPETITION`) as module-level constants
- Defines helper components (`<Mono>`, `<Italic>`, `<Eyebrow>`,
  `<SeverityChip>`, `<SentimentDot>`, `<InfluenceBar>`)
- Defines one view component per tab (`OverviewView`, `StakeholdersView`,
  `PainValueView`, `ScopeView`, `DecisionView`, `RisksNextView`)
- Exports a default `DiscoveryDashboard` component

The file should be self-contained — no external CSS, no imports beyond
React and lucide-react. Embed the Google Fonts `<link>` inside the
top-level component so Fraunces / DM Sans / JetBrains Mono render in
the artifact previewer.

## After Building — Verify

The artifact runs in a browser, not Python, so do a careful read-pass
before declaring done:

1. **Stakeholder count** in the top-bar matches `STAKEHOLDERS.length`.
2. **Every pain point** has a paired value prop (or an explicit "no
   answer yet" marker).
3. **Every stakeholder** has `name`, `title`, `role`, `sentiment`
   (positive/neutral/skeptical/blocker), `influence` (1–5), and at
   least one `quote` field.
4. **Every risk** has `impact` (high/medium/low), `likelihood`
   (high/medium/low), `mitigation`, and (where possible) a transcript
   reference.
5. **Next steps** have owner + date, not generic "follow up".
6. **Hero headline** uses Richard's voice — sharp, opinionated. If it
   reads like AI summary boilerplate, rewrite it using a phrase the
   prospect actually said in the transcript.
7. **Lime appears once per view.** If you see it twice, demote one.
8. **No invented facts.** If the transcript doesn't say what the deal
   size is, leave it as "TBD" — do not hallucinate ARR or seat counts.

## Common Pitfalls

- **Generic hero copy.** "Discovery dashboard for [Company]" is the
  failure mode. Reread the transcript; find the phrase that captures
  what's actually at stake; build the headline from there.
- **Inventing stakeholders or quotes.** If a name is mentioned once in
  passing with no quote, include them as a stakeholder card but mark
  the quote slot empty or `"(mentioned but did not speak on call)"`.
  Never fabricate a quote.
- **Treating every mention of a number as a "quantified pain".** A
  pain is quantified only if the prospect tied a dollar amount, time
  amount, percentage, or count to it on the call. Otherwise it's
  qualitative.
- **Overusing lime.** One spotlight per view, max. If everything is
  emphasized, nothing is.
- **Putting all data into one giant constant.** Split into the named
  structures — the view components consume them directly.
- **Forgetting the Google Fonts `<link>`.** Without it, Fraunces falls
  back to Times New Roman and the design collapses.

## File Layout

```
discovery-dashboard/
├── SKILL.md                          ← this file
├── references/
│   ├── design_system.md              ← colors, fonts, type scale, do/don't
│   ├── data_model.md                 ← shape of every JSX constant
│   └── extraction_guide.md           ← how to pull data from transcripts
├── templates/
│   └── dashboard_template.jsx        ← structural skeleton with all 6 tabs
└── examples/
    └── example_dashboard.jsx         ← worked example (fictional BPO call)
```
