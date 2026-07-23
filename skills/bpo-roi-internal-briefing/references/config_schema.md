# Internal Briefing Config Schema

The internal briefing reads the same base config as `bpo-roi-brief` plus the optional `internal_briefing` section documented here.

For the base schema (BPO, end client, current state, pricing phases, use cases, etc.), see the `bpo-roi-brief` skill's `references/config_schema.md`.

## Top-level fields specific to the internal briefing

```json
{
  "internal_recipients": [...],
  "stakeholders": [...],
  "internal_briefing": { ... },
  "pricing_phases": [
    { ..., "platform_cost_estimate": 1500000 }
  ]
}
```

## internal_recipients (recommended)

The names this briefing is addressed to. Renders in the title block as "For: ...".

```json
"internal_recipients": ["Robert Head", "Sid Mukherjee", "Joby Thomas Varghese"]
```

## stakeholders (optional)

Customer-side stakeholders the team will be talking to. Used in default talking points if not overridden.

```json
[
  {"name": "Tom Lynch", "title": "CEO"},
  {"name": "Julie Barton", "title": "VP Member Experience"},
  {"name": "Dan Brady", "title": "CFO"}
]
```

## pricing_phases — additional field

Each phase can have an optional `platform_cost_estimate` (in dollars) for honest margin math:

```json
{"name": "Phase 1", "containment": 0.55, "price_per_outcome": 3.00,
 "fte_rate": 10, "fte_share": 0.583,
 "platform_cost_estimate": 1500000}
```

If omitted, defaults are applied: Phase 1 = $1.5M, Phase 2 = $1.0M, Phase 3 = $0.7M. Override when you have better data on actual platform run-rate.

## internal_briefing.version + date

Stamps the footer of every page. Default: `v1` and today's date.

```json
"version": "v5",
"date": "Apr 28, 2026"
```

## internal_briefing.overview_intro (optional)

The opening paragraph of Section 1. Defaults to a generic statement if omitted; override for specificity.

```json
"overview_intro": "Robert requested an executive-level ROI model comparing Fabletics' current state..."
```

## internal_briefing.confidentiality_note (optional)

A red callout in Section 2 when there's intel that must stay internal. Don't include if you don't have such intel.

```json
"confidentiality_note": "Jam disclosed that Fabletics spends approximately $3M on AI annually but explicitly asked that this number not be referenced or shared internally. Our model derives the estimate independently from public Cognigy pricing data..."
```

## internal_briefing.talking_points (recommended)

Three sub-fields for the talking-points section.

```json
"talking_points": {
  "lead_with": [
    ["Savings from Day 1.", "$3.00/outcome is already 35% below..."],
    ["It only gets better.", "Price steps down as AI containment improves..."]
  ],
  "if_pushed_on_price": [
    ["Their Cognigy alone costs $2.74 per AI-resolved contact", "— and it only handles 22.5% of volume..."]
  ],
  "other_questions": {
    "If They Ask About the Cognigy Spend Estimate": [
      ["We derived it from Cognigy's public billing model", "(per-conversation pricing) applied to Fabletics' stated contact volumes."]
    ]
  }
}
```

Each talking point is a `[bold_lead, body_text]` tuple. The bold lead is rendered in bold, the body text follows as normal weight.

`lead_with` defaults to four standard messages if omitted (savings from Day 1 / it only gets better / zero risk / one vendor one price).

`if_pushed_on_price` and `other_questions` are optional but high-value — they prep the team for the most common objections.

## internal_briefing.intel_findings (optional)

A table of insights from discovery, Q&A responses, RFP responses, etc. If omitted, Section 5 is skipped.

```json
"intel_source": "Q&A Response (Dec 5, 2025)",
"intel_intro": "Key findings from Julie Barton's Q&A doc...",
"intel_findings": [
  {"topic": "AI Containment", "finding": "20–25% (22.5% midpoint)", "how_we_use_it": "Sourced number replacing 35% industry benchmark"},
  {"topic": "VoC Tool", "finding": "Medallia", "how_we_use_it": "Confirmed in attribution metrics"}
]
```

## internal_briefing.red_lines (recommended)

Explicit list of things never to say to the customer. Renders as red-bordered bullets in Section 6.

```json
"red_lines": [
  "Never reference confidential intel as a sourced number.",
  "Never share our internal margins or cost structure.",
  "Never share per-minute or per-hour internal rates.",
  "Never position this as 'replacing' their AI vendor — frame as 'elevating' their CX."
]
```

If omitted, six standard red lines are included.

## internal_briefing.next_steps (optional)

The "what happens next" section. Numbered list rendered as Section 7. Defaults to standard steps if omitted.

```json
"next_steps": [
  "Internal review of brief and updated model.",
  "Legal/commercial review — stress-test liability language.",
  "Source sanity-check on directional validity of headline numbers before send.",
  "Share the client-facing brief with stakeholders.",
  "Schedule alignment call.",
  "Upon client interest, prepare SOW for the lighthouse pilot."
]
```

## Margin profile inputs

The Section 3 margin table is computed automatically from:
- `pricing_phases[*].price_per_outcome` × annual contact volume → customer-paid annual cost
- `pricing_phases[*].fte_share` × `current_state.fte_count` × `pricing_phases[*].fte_rate` × 2,080 hrs → FTE labor cost
- `pricing_phases[*].platform_cost_estimate` (or default) → AI platform cost
- Total cost = labor + platform; margin = customer cost - total cost

A callout fires when Phase 1 margin drops below 20%, warning the team not to concede further on Phase 1 price. This is intentional — early-phase margins are typically thin in outcomes-based pricing because we absorb FTE delivery on residual volume.
