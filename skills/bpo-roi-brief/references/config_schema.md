# Config Schema Reference

Full schema for the BPO ROI brief config JSON. See `examples/fabletics_config.json` for a complete working example.

## Top-level structure

```json
{
  "bpo": {...},
  "ai_partner": {...},
  "end_client": {...},
  "engagement_label": "...",
  "page1": {...},
  "current_state": {...},
  "tech_stack": [...],
  "voc_tool_footnote": "...",
  "revenue_generation": {...},
  "use_cases": [...],
  "priorities": [...],
  "target_kpis": [...],
  "target_kpis_footnote": "...",
  "path_forward": [...],
  "lighthouse": {...},
  "pilot": {...},
  "decision_steps": [...],
  "pricing_phases": [...]
}
```

## bpo (required)

The BPO running the pitch.

```json
{
  "name": "Startek",                    // Display name in headers and footers
  "label": "BPO",                       // What to call agents (e.g. "BPO", "CCO", "agents")
  "logo_path": "startek_logo.png",      // Relative to the config JSON, or absolute
  "brand": {
    "navy": "#003D6B",                  // Required: primary dark color
    "accent": "#E92983",                // Required: highlight color
    "navy_dark": "#0A2746",             // Optional: derived by darkening navy if omitted
    "navy_deep": "#061E38",             // Optional: derived
    "accent_soft": "#FDE7F1"            // Optional: derived from accent (pastel for callouts)
  }
}
```

## ai_partner (optional)

The AI tech vendor partnering with the BPO. Defaults to `{"name": "Anyreach AI"}`.

## end_client (required)

The brand the BPO is pitching.

```json
{
  "name": "Fabletics",          // Full display name
  "short_name": "Fabletics"     // Used in headings and KPI alignment block
}
```

The smart-possessive filter handles names ending in 's' automatically (Fabletics → Fabletics').

## engagement_label (optional)

What the engagement is called in the brief headers and footers. Default: "Member Experience Partnership".

Examples:
- "Member Experience Partnership" (subscription retail)
- "Customer Care Modernization" (telco)
- "Patient Engagement Transformation" (healthcare)

## page1 (optional)

Headline overrides for page 1.

```json
{
  "title": "Outcomes-Based Member Experience",
  "subtitle": "AI + Human, One Vendor, One Price"
}
```

## current_state (required)

The numbers that drive the entire ROI cascade.

```json
{
  "volumes": {
    "voice": 1820000,
    "chat": 2410000,
    "social": 444000,
    "email": 0,
    "whatsapp": 0
  },
  "fte_count": 900,
  "fte_hourly_rate": 10,
  "ai_containment_rate": 0.225,
  "containment_source": "...",         // Optional but recommended — becomes footnote ¹
  "annual_revenue": 1000000000,        // Optional — enables CX % of revenue and retained revenue
  "channels_display": "chat · voice · WhatsApp",  // Optional — overrides auto-built channel list
  "ai_vendor": {
    "name": "Cognigy",                 // Optional — defaults to "Cognigy"
    "annual_spend": 2900000,           // Optional — if known
    "estimated_rates": {               // Optional — used if annual_spend not given
      "voice": 0.55,
      "chat": 0.60,
      "social": 0.65,
      "platform_base": 150000
    }
  }
}
```

**Critical rules:**
- `ai_containment_rate` is a decimal (0.225 = 22.5%)
- `volumes` keys must be from {voice, chat, social, email, whatsapp}
- `fte_hourly_rate` is full dollars (10, not 1000)
- If `ai_vendor.annual_spend` is omitted, the back-of-envelope estimator runs and the methodology footnote * is added automatically

## tech_stack (optional)

List of named tools the end-client uses. Cited in the page 2 footnote.

```json
["Zendesk", "Medallia", "Helpjuice", "Cognigy", "Genesys"]
```

## voc_tool_footnote (optional)

Footnote ³ on page 2 — confirms the VoC tool used in the attribution metrics.

## revenue_generation (optional)

The upside layer in the page 1 value strip.

```json
{
  "annual_estimate": 38400000,
  "source_note": "Revenue generation requires engagement beyond Global Member Services scope..."
}
```

If omitted, the value strip shows only direct savings + retained revenue (two layers). If included, shows three layers.

## retention_lift_pct (optional)

The CX lift assumption used for retained revenue. Default `0.005` (0.5%).

```json
"retention_lift_pct": 0.005
```

When to lower:
- For very large enterprises (>$10B revenue), 0.5% can produce a retained-revenue figure that visually dwarfs the direct cost savings. Try 0.001–0.002 instead.
- The plausibility check warns when retained revenue exceeds 3× direct savings.

When to omit:
- Set `annual_revenue` to null or remove it entirely from `current_state` to skip the retained-revenue layer altogether (value strip then shows just direct savings + revenue gen, if provided).

## use_cases (required, ≥3 recommended)

Outcome definitions for page 2 left column.

```json
[
  {
    "name": "Billing Dispute Resolution",
    "definition": "Dispute <b>closed</b>, no re-open within 48 hrs, <b>no chargeback</b> filed downstream.",
    "attribution": "Zendesk ticket status · 48hr recontact rate · Payment-gateway chargeback flag · Post-resolution CSAT"
  },
  ...
]
```

HTML tags allowed in `definition` and `attribution` for emphasis. 5 use cases is the sweet spot.

## priorities (required, ≥3 recommended)

End-client's stated priorities for page 2 right column.

```json
[
  {
    "name": "Membership Billing Confusion",
    "description": "Proactive <b>AI education at sign-up</b>; skip-deadline reminders before the bill posts."
  },
  ...
]
```

## target_kpis (optional)

The end-client's own stated 2026 (or current-year) target KPIs. If provided, renders as a callout box on page 2.

```json
[
  "Improve member retention rate",
  "Increase MSAT YoY across all channels",
  "Reduce repeat contact rate"
]
```

## target_kpis_footnote (optional)

Footnote ⁴ citing the source of the KPIs. Strongly recommended if `target_kpis` is provided.

## path_forward (optional)

Page 2 bottom strip. 4 steps recommended. Sensible defaults if omitted.

```json
[
  "30-min ROI walk-through with [stakeholders]",
  "Discovery workshop to validate outcome definitions",
  "[Client] names IT POC ([systems])",
  "[BPO] prepares SOW for [N] wk lighthouse pilot"
]
```

## lighthouse (optional)

Tunes the page 3 lighthouse pilot math.

```json
{
  "volume_share": 0.35,             // Default 0.35 (35% of total contacts)
  "target_containment": 0.65        // Default 0.65 (65% — what AI handles in this category)
}
```

## pilot (required for page 3)

The full lighthouse pilot proposal.

```json
{
  "name": "Billing / Skip / Credit Automation",
  "description": "Rules-based, non-retention, non-escalation — the single lowest-risk, highest-ROI category...",
  "timeline": "6–8 Week Path to Live",       // Page 3 header subtitle
  "timeline_short": "6–8 wks",               // Right-side stat in the hero
  "why_first": [...],                        // 4-5 bullet points (HTML allowed)
  "what_we_stand_up": [...],                 // 4-5 bullet points
  "what_client_does": [...],                 // 4-5 bullet points
  "commercial_offer": [...],                 // 4-5 bullet points
  "phase2_unlocks": "Shipping / WISMO · Retention Save · ..."
}
```

## decision_steps (optional)

Page 3 bottom strip. 3 steps. Sensible defaults if omitted.

```json
[
  {"title": "30-min alignment call", "detail": "[stakeholder names]"},
  {"title": "One IT contact named", "detail": "[systems]"},
  {"title": "SOW signed → 6–8 wk pilot build", "detail": "Within standard eval window"}
]
```

## pricing_phases (optional)

Override the default 3-phase pricing curve. Only do this for non-standard deals.

```json
[
  {"name": "Phase 1", "months": "1-6",  "duration": 6, "containment": 0.55, "price_per_outcome": 3.00, "fte_share": 0.60},
  {"name": "Phase 2", "months": "7-9",  "duration": 3, "containment": 0.75, "price_per_outcome": 2.75, "fte_share": 0.32},
  {"name": "Phase 3", "months": "10+",  "duration": 3, "containment": 0.90, "price_per_outcome": 2.50, "fte_share": 0.13}
]
```

`fte_share` is optional per phase — if omitted, the default curve (60% → 32% → 13% of original FTEs) is applied. Override when you want a more or less aggressive ramp-down.

`duration` is in months. Total durations should add up to 12 for clean year-1 math.

## Number formatting cheat sheet

The renderer applies these formats automatically:

| Raw input        | Display                      |
|------------------|------------------------------|
| 21605600         | $21.6M                       |
| 2885600          | $2.9M                        |
| 8459975          | $8.5M                        |
| 0.225            | 22.5%                        |
| 0.392            | 39.2%                        |
| 4.6225           | $4.62                        |
| 4674000          | 4.67M                        |
| 1635900          | 1.64M                        |
| 444000           | 444K                         |
| 3.0              | $3.00                        |

Currency rounds to one decimal place above $1M, no decimals below. Volumes round to two decimals above 1M, no decimals below.
