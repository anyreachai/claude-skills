# Output Schemas

Every artifact this skill produces follows a strict schema. Downstream Anyreach systems consume these files; deviation breaks the pipeline.

---

## `output_dir/facts/00_inventory.json`

```json
{
  "client_id": "string",
  "client_name": "string",
  "run_id": "uuid",
  "run_started_at": "ISO 8601",
  "tools_verified": [
    {
      "name": "salesforce",
      "instance_type": "production | sandbox | unknown",
      "tier": "string",
      "api_rate_limit": "string or null",
      "record_counts": {"Account": 0, "Opportunity": 0, "Contact": 0}
    }
  ],
  "tools_failed": [
    {"name": "string", "error_code": "string", "error_message": "string"}
  ],
  "tools_skipped": [
    {"name": "string", "reason": "no_mcp_available | sandbox_not_useful | other"}
  ]
}
```

---

## Per-tool fact files

See the individual extractor playbooks for the schema specific to each tool category. Each fact file must include:

- `tool` (string, required)
- `extracted_at` (ISO 8601, required)
- `lookback_window` (string, required — e.g., "90 days", "4 quarters")
- `warnings` (array of strings — free-form notes about partial extraction, missing fields, etc.)

If a section can't be populated, set its value to `null` (not omitted, not empty object). Phase 2 rules check for `null` explicitly.

---

## `output_dir/findings.json`

```json
{
  "client_id": "string",
  "run_id": "uuid",
  "generated_at": "ISO 8601",
  "findings": [
    {
      "id": "F-001",
      "rule": "T1 | T2 | ... | T12 | custom",
      "severity": "critical | high | medium | low",
      "title": "string — short headline (≤100 chars)",
      "evidence": {
        "fact_files": ["10_crm.json"],
        "values": {"<key>": "<value>"}
      },
      "implication": "string — what this means for the business (1–3 sentences)",
      "recommended_action": "string — concrete next step (1–2 sentences)",
      "confidence": "high | medium | low",
      "delta": "new | improved | regressed | held_steady | null"
    }
  ],
  "rule_skip_log": [
    {"rule": "T11", "reason": "missing_input: contact-account join not available in this CRM"}
  ]
}
```

`delta` is null on first audit, populated on re-runs by comparison with the prior run's `findings.json`.

---

## `output_dir/tactics.json`

```json
{
  "client_id": "string",
  "run_id": "uuid",
  "generated_at": "ISO 8601",
  "tactics": [
    {
      "id": "T-001",
      "from_finding": "F-003",
      "title": "string",
      "tools_involved": ["salesforce", "outreach"],
      "specific_change": "string — what exactly changes",
      "effort": "XS | S | M | L",
      "expected_outcome": "string — measurable target",
      "measurement": "string — how we'll know it worked",
      "dependencies": ["string"],
      "priority_score": 0.0,
      "owner_recommendation": "string — which role at the BPO should own this"
    }
  ]
}
```

`priority_score` is computed as `(impact_score × confidence_score) / effort_score` where:
- impact_score: critical=4, high=3, medium=2, low=1 (inherited from source finding)
- confidence_score: high=1.0, medium=0.7, low=0.4 (inherited from source finding)
- effort_score: XS=0.5, S=1, M=2, L=4

Sort the tactics array by `priority_score` descending.

---

## `output_dir/run_summary.json`

```json
{
  "client_id": "string",
  "client_name": "string",
  "run_id": "uuid",
  "run_started_at": "ISO 8601",
  "run_completed_at": "ISO 8601",
  "tools_audited": ["salesforce", "outreach", "..."],
  "tools_skipped": ["..."],
  "findings_count_by_severity": {"critical": 0, "high": 0, "medium": 0, "low": 0},
  "tactics_count_by_effort": {"XS": 0, "S": 0, "M": 0, "L": 0},
  "top_5_findings": ["F-001", "F-003", "F-007", "F-009", "F-012"],
  "estimated_30_day_impact": "string — qualitative summary",
  "anyreach_wedge_recommendations": [
    {
      "anyreach_product": "voice agent | agent assist | quality monitoring | ...",
      "fit_rationale": "string — why this finding sets up this wedge",
      "tied_to_findings": ["F-003", "F-007"]
    }
  ]
}
```

The `anyreach_wedge_recommendations` block is what makes this audit dual-purpose: it produces value for the BPO and surfaces where Anyreach products map cleanly to the BPO's actual problems. Don't force it — only populate when a finding genuinely sets up an Anyreach product fit.

---

## `output_dir/gaps.json`

```json
{
  "client_id": "string",
  "run_id": "uuid",
  "gaps": [
    {
      "tool": "string",
      "phase": "0 | 1 | 2",
      "gap_type": "auth_failed | api_unavailable | field_missing | join_impossible | rate_limited | other",
      "details": "string",
      "severity_for_audit": "blocker | degrades_findings | nice_to_have"
    }
  ]
}
```

The orchestrator surfaces this file to the human reviewer. Gaps marked `blocker` should pause the run for human input.

---

## `output_dir/extractor_errors.json`

For tracking vendor API drift over time:

```json
{
  "run_id": "uuid",
  "errors": [
    {
      "tool": "marketo",
      "extractor_section": "email_health.weekly_series",
      "error": "string",
      "playbook_query_that_failed": "string"
    }
  ]
}
```

If the same `(tool, extractor_section)` pair fails across multiple recent runs, the skill maintainer should update the relevant extractor playbook.
