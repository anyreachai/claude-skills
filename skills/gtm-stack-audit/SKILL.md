---
name: gtm-stack-audit
description: "Run a cross-tool GTM stack audit on a BPO partner's go-to-market tooling (CRM, marketing automation, sales engagement, conversation intelligence, data providers, dialers) and produce a strategy memo plus tactics backlog. Use whenever Anyreach needs to audit, assess, map, or analyze a BPO partner's GTM stack during onboarding when admin/MCP access has been granted across tools. Trigger on 'audit their GTM stack', 'map their tools', 'assess their RevOps', 'BPO onboarding audit', 'analyze their Salesforce/HubSpot/Outreach', 'figure out what's going on in their GTM tools', 'GTM diagnostic', 'RevOps audit', 'sales stack assessment', 'where are the leaks in their funnel', or whenever credentials for multiple GTM tools are provided with a request for cross-tool analysis. This skill orchestrates per-tool extraction and a triangulation pass that produces findings no single-tool analysis can — use it instead of analyzing tools one-at-a-time."
---

# GTM Stack Audit

Audit a BPO partner's go-to-market tooling and produce (a) a strategy memo for their leadership, (b) a tactics backlog for the Anyreach delivery team, and (c) a structured `findings.json` that downstream Anyreach systems can consume.

## What this skill is for

Anyreach's BPO onboarding flow gives us admin or MCP access to a partner's GTM stack — typically some combination of Salesforce/HubSpot/Dynamics (CRM), Marketo/HubSpot/Pardot (marketing automation), Outreach/Salesloft/Apollo (sales engagement), Gong/Chorus (conversation intelligence), ZoomInfo/Apollo (data providers), and Five9/Genesys/RingCentral (dialers). Mapping this manually takes days. This skill replaces the manual mapping with an orchestrated extraction → triangulation → synthesis pipeline.

The IP is in the **triangulation across tools** — any junior analyst can pull a Salesforce report, but knowing that closed-won firmographics drift 30% from stated ICP, or that 62% of MAP-sourced leads never get touched in CRM within 48 hours, requires joining facts from multiple systems. That cross-tool reasoning is where this skill earns its keep.

---

## Operating principles (apply throughout)

1. **Aggregate first, sample second, dump never.** Full record exports are almost never the right call. Prefer counts, distributions, percentiles, top-N samples. If a query would return >500 records, narrow it.
2. **Write everything to disk as you go.** Each phase emits structured JSON to `output_dir/facts/`. Do not hold large result sets in context. Coordinator reads facts off disk in Phase 2.
3. **Cite sources in every finding.** Every claim references the underlying fact file and tool. No claims without provenance.
4. **Skip with logging, never guess.** If a tool isn't accessible or a query fails, append to `output_dir/gaps.json`. Do not infer values. A documented gap is more valuable than a fabricated number.
5. **Token discipline.** Per-tool sub-agents target ≤200K input / ≤20K output. The coordinator targets ≤100K input / ≤10K output. If a phase blows budget, checkpoint to disk and resume.
6. **Tenancy is sacred.** One `.mcp.json` per BPO, ephemeral creds, fresh workspace, no cross-client state leakage.

---

## Inputs

The orchestrator should pass:

```json
{
  "client_id": "string — internal BPO ID",
  "client_name": "string — display name",
  "tool_inventory": [
    {"name": "salesforce", "mcp_server": "...", "auth_method": "..."},
    {"name": "outreach", "mcp_server": "...", "auth_method": "..."}
  ],
  "output_dir": "absolute path — fresh per run",
  "stated_icp": "optional — text or URL describing the BPO's claimed target customer",
  "anchor_quarter": "optional — defaults to 'last 4 quarters from today'"
}
```

If any input is missing, prompt for it before starting Phase 0. Do not proceed with assumed values.

---

## Phase 0 — Inventory & access verification

Before any extraction, confirm what's actually reachable. For each tool in `tool_inventory`:

1. Verify auth with a no-op call (e.g., `whoami`, list users, fetch org settings).
2. Record API tier and rate limits.
3. Record top-level record counts (Accounts, Opportunities, Contacts, Campaigns, Sequences, Calls — whatever the tool exposes).
4. Detect whether this is the production instance or a sandbox. If sandbox, flag prominently and confirm with user before proceeding.

Write `output_dir/facts/00_inventory.json`. See `references/output-schemas.md` for the exact schema.

If any tool fails auth, append to `output_dir/gaps.json` and continue. Do not abort the run for a single tool failure unless the failed tool is the CRM — without a CRM, the audit is not viable, and the run should pause for human input.

---

## Phase 1 — Per-tool extraction

For each verified tool, run the extraction playbook for that tool category. Each tool emits a single fact file. Sub-agents extract; they do not analyze.

**Extraction playbooks by category:**

- CRM (Salesforce, HubSpot, Dynamics, Zoho) → see `references/extractors/crm.md`
- Marketing automation (Marketo, HubSpot, Pardot, Eloqua) → see `references/extractors/map.md`
- Sales engagement (Outreach, Salesloft, Apollo) → see `references/extractors/sales-engagement.md`
- Conversation intelligence (Gong, Chorus, Clari Copilot) → see `references/extractors/conversation-intel.md`
- Data providers (ZoomInfo, Apollo, Cognism, LinkedIn Sales Nav) → see `references/extractors/data-providers.md`
- Dialers / contact center (Five9, Genesys, RingCentral, NICE) → see `references/extractors/dialer.md`

Read the relevant reference file for whatever tool you're extracting — do not skip it. Each playbook specifies the exact queries, aggregations, and output structure. Deviating from the playbook breaks the triangulation in Phase 2 because the T-rules expect specific fact-file fields.

**Output paths:**

```
output_dir/facts/00_inventory.json
output_dir/facts/10_crm.json
output_dir/facts/11_map.json
output_dir/facts/12_sales_engagement.json
output_dir/facts/13_conversation_intel.json
output_dir/facts/14_data_provider.json
output_dir/facts/15_dialer.json
```

If a tool category has multiple instances (rare but possible — e.g., a BPO running two CRMs after an acquisition), use suffixed filenames: `10_crm_salesforce.json`, `10_crm_hubspot.json`. Note this in `output_dir/run_meta.json` and the triangulation will handle both.

**Parallelism:** When the orchestrator supports sub-agent fan-out, run all tool extractions in parallel. Each is independent. When running single-threaded, run in the order above (CRM first — many downstream queries reference CRM IDs).

---

## Phase 2 — Cross-tool triangulation

This is where the IP lives. The coordinator reads all `facts/*.json` from disk (no MCP needed in this phase) and applies the triangulation rules.

Read `references/triangulation-rules.md` for the full rule catalog. There are 12 core rules (T1–T12) covering ICP reality check, source attribution integrity, handoff latency, rep concentration, sequence ROI, tool ROI, pipeline coverage, stage skipping, activity-vs-outcome, competitor pattern, data quality cascade, and zombie spend.

Each rule produces zero or more findings. A finding has:

```json
{
  "id": "F-001",
  "rule": "T4",
  "severity": "critical | high | medium | low",
  "title": "short headline",
  "evidence": {
    "fact_files": ["10_crm.json"],
    "values": {"top_3_share_pipeline": 0.58}
  },
  "implication": "what this means for the business",
  "recommended_action": "concrete next step",
  "confidence": "high | medium | low"
}
```

Write all findings to `output_dir/findings.json`. See `references/output-schemas.md` for the full schema.

**Severity guide:**
- `critical` — directly threatens revenue or commitments (e.g., forecast accuracy <60%, single rep >50% of pipeline)
- `high` — material structural problem (e.g., ICP drift >25%, source attribution leak >15%)
- `medium` — efficiency or hygiene issue (e.g., tool license utilization <50%)
- `low` — cosmetic or future-risk (e.g., custom field sprawl)

**Confidence guide:**
- `high` — finding follows directly from clean data, single tool, no inference
- `medium` — cross-tool join with reasonable matching (>80% match rate)
- `low` — cross-tool join with weak matching, or finding inferred from indirect signals

Don't invent findings. If the data doesn't support a rule firing, skip it. A short, sharp findings file beats a bloated one with hedged claims.

---

## Phase 3 — Synthesis

Produce two artifacts. The coordinator handles this phase — no MCP needed, just reads `findings.json` and `facts/*.json`.

### `output_dir/strategy.md` — for the BPO's leadership

Use the template at `assets/strategy-template.md`. Structure:

1. Executive summary (1 page, 5 findings max)
2. Current-state assessment by GTM motion (demand gen → MQL → SQL → opportunity → close → expansion)
3. Top 3 strategic shifts recommended
4. Risks if status quo persists
5. Appendix: data sources and gaps

Tone: peer-to-peer with a CRO. Not a vendor pitch. Not a McKinsey deck. Findings should sting a little — that's the value.

### `output_dir/tactics.json` — for the Anyreach delivery team

A backlog of concrete tasks ranked by `(impact × confidence) / effort`. Each task:

```json
{
  "id": "T-001",
  "from_finding": "F-003",
  "title": "Reassign top-rep accounts to balance pipeline",
  "tools_involved": ["salesforce", "outreach"],
  "specific_change": "Reassign 40% of accounts owned by [top rep] to mid-tier reps; rebuild sequences for transferred accounts",
  "effort": "M",
  "expected_outcome": "Reduce top-rep concentration from 58% to <40% within 60 days",
  "measurement": "Pipeline distribution by rep, weekly",
  "dependencies": ["Sales leadership buy-in", "Comp plan adjustment for transferring rep"],
  "priority_score": 8.4
}
```

Effort scale: `XS` (<1 day), `S` (1–3 days), `M` (1–2 weeks), `L` (>2 weeks).

See `references/output-schemas.md` for the full tactics schema.

---

## Phase 4 — Handoff

Write `output_dir/run_summary.json` with:

```json
{
  "client_id": "...",
  "client_name": "...",
  "run_started_at": "...",
  "run_completed_at": "...",
  "tools_audited": [...],
  "tools_skipped": [...],
  "findings_count_by_severity": {"critical": 1, "high": 4, "medium": 7, "low": 3},
  "tactics_count_by_effort": {"XS": 2, "S": 5, "M": 6, "L": 2},
  "top_5_findings": ["F-001", "F-003", "F-007", "F-009", "F-012"],
  "estimated_30_day_impact": "qualitative summary"
}
```

Then notify the orchestrator the run is complete. The orchestrator handles delivery of `strategy.md` (PDF rendering happens upstream), `tactics.json` (consumed by Anyreach delivery system), and archival of `facts/` for re-runs.

---

## Operating notes

**Re-runs:** When a client is re-audited (typically every 90 days), the orchestrator passes the prior run's `output_dir`. Read the prior `findings.json` and add a `delta` block to each finding showing whether it has improved, regressed, or held steady. Net-new findings get the same `delta: "new"` flag.

**Human review checkpoint:** For the first 5–10 audits across the partner base, pause after Phase 2 and notify Richard (or the assigned RevOps reviewer) before generating `strategy.md`. The findings file is small and reviewable in 10 minutes. After review-quality stabilizes, reduce to spot-checks.

**Token budget overruns:** If a sub-agent hits its budget, checkpoint partial extraction to disk and emit a `partial: true` flag in the fact file. Phase 2 handles partial fact files gracefully — affected T-rules fire with `confidence: "low"` rather than failing.

**Tool changes:** GTM vendor APIs drift. If an extractor reference file's queries fail repeatedly across multiple clients, log to `output_dir/extractor_errors.json` and flag for the skill maintainer. Quarterly re-validation of the extractor playbooks is expected.

---

## Skill maintenance

The triangulation rules are the IP. Every time a human reviewer flags a missed insight on a real audit, encode it as a new T-rule in `references/triangulation-rules.md`. Version that file aggressively.

Per-tool extractors drift with vendor API changes. Re-validate quarterly.

The strategy template is intentionally minimal — most of the variance in output quality comes from the findings, not the prose around them.
