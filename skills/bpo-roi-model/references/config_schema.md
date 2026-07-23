# Model Config Schema

The model reads the same base config as `bpo-roi-brief` and `bpo-roi-internal-briefing` — there are **no extra fields** specific to the model.

For the full schema, see the `bpo-roi-brief` skill's `references/config_schema.md`.

## Fields the model uses

The model reads:

- `bpo.name`, `bpo.label`, `bpo.brand.navy`, `bpo.brand.accent` — for branding
- `ai_partner.name` — appears in subtitle
- `end_client.name` — appears in titles and column headers
- `engagement_label` — appears in the workbook title
- `current_state.volumes` — drives the volume table on Current State tab
- `current_state.fte_count`, `fte_hourly_rate` — drive BPO labor cost
- `current_state.ai_containment_rate` — drives the cost-per-outcome breakdown
- `current_state.ai_vendor.name` — labels the AI cost section
- `current_state.ai_vendor.estimated_rates` — drives the back-of-envelope AI spend estimate
- `current_state.containment_source` — appears as a description note
- `current_state.annual_revenue` — drives the retention impact section (omit to skip)
- `pricing_phases` — drives the phased pricing table on Proposed Model tab
- `retention_lift_pct` — default 0.005, drives the retention revenue calc

## Fields the model ignores

The model does not use these (they're for the other skills):

- `internal_briefing.*`
- `internal_recipients`
- `stakeholders`
- `use_cases`, `priorities`, `pilot`, `decision_steps`, `path_forward`
- `target_kpis`, `intel_findings`
- Any `.json` field with text intended for the brief or internal briefing

You can include all of these in a single config — the model just reads what it needs.

## Output structure

| Tab | Purpose | Key cells |
|---|---|---|
| Executive Summary | Top-level dashboard | Pulls from other tabs via formulas |
| Current State | Cost cascade with input cells | Volumes, AI rates, FTE inputs (light navy fill) |
| Proposed Model | Phased pricing + savings + retention | Containment, price, FTE share inputs |
| Assumptions | Input audit trail | Static text — sources for every assumption |

Input cells are highlighted with a light navy fill (`#E8EEF5`) so users know what's safe to edit. All other cells are formulas — editing them breaks the cascade.

## Number formatting

The script applies these formats automatically:

| Field type | Format | Example |
|---|---|---|
| Volume / contact counts | `#,##0` | 4,674,000 |
| Currency (whole dollars) | `"$"#,##0` | $21,605,600 |
| Currency (2 dp) | `"$"#,##0.00` | $4.62 |
| Percentage | `0.0%` | 22.5% |

If you need different formatting, edit `FMT_*` constants at the top of `build_model.py`.
