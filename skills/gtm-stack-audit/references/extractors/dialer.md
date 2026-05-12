# Dialer / Contact Center Extractor Playbook

Applies to: Five9, Genesys Cloud, NICE CXone, RingCentral Engage / RingEX, Talkdesk, 8x8, Avaya, Nextiva.

Output file: `output_dir/facts/15_dialer.json`.

This is often the most critical extraction for BPO audits — the dialer is the BPO's production floor. For an outbound BPO especially, dialer metrics dwarf CRM metrics in revenue significance.

---

## What to extract

### A. Outbound volume (last 30 days, by team and by campaign)

- Total dials
- Connect rate (connected calls / dials)
- Right-party-contact rate (RPC / connects, where tagged)
- Conversation rate (conversations >30s / connects)
- Average handle time (AHT)
- Average wait/preview time before dial
- Abandonment rate

### B. Inbound volume (last 30 days)

- Total inbound calls
- Service level (% answered within target — usually 80% in 20s, but check the BPO's own SLA)
- Average speed of answer
- Average handle time
- First-call resolution rate (where tracked)
- Transfer rate
- Abandonment rate

### C. Disposition distribution

For all calls last 30 days:
- Top 20 dispositions by count
- Disposition consistency: % of calls with a disposition tagged
- Custom dispositions count (sprawl signal — flag if >50)

### D. Agent activity

- Total active agents last 30 days
- Calls per agent distribution (median, p75, p90 for outbound; same for inbound)
- Adherence / occupancy distribution (where the WFM module is integrated)
- Top 5 agents by volume — flag if any agent >2x median (data quality risk or skill imbalance)
- Agents with zero calls last 14 days

### E. Campaign / list management (outbound)

- Active dialer lists / campaigns
- List penetration rate (% of records dialed at least once)
- Right-party-contact rate per list
- Lists with zero dials last 14 days (stale)
- DNC scrub status and frequency

### F. Quality monitoring

- Calls scored last 30 days (if QA module integrated)
- Average QA score
- Calibration session frequency
- Coaching sessions logged

### G. CRM / system integration

- % of dialer calls logged to CRM
- Median sync lag (call ended → logged in CRM)
- Sync errors last 7 days
- Screen-pop / agent desktop integration status

### H. Compliance signals

- TCPA / DNC violation flags last 90 days
- Recording disclosure compliance rate (if tracked)
- After-hours dial rate (regulatory risk)

---

## Query strategy

**Five9:** Has a SOAP-based supervisor API and a REST stats API. Stats API for aggregates, supervisor API for config. Admin Console export for compliance data.

**Genesys Cloud:** Modern REST API with strong analytics endpoints (`/analytics/conversations/aggregates/query`). Prefer aggregate queries over conversation-level pulls — conversations can be millions of records.

**NICE CXone:** REST API. Reporting endpoints (`/reports`) for pre-aggregated metrics.

**RingCentral:** REST API. Engage Voice has the dialer endpoints; basic RingEX has lighter call analytics.

**Talkdesk:** REST API. Reasonable analytics endpoints.

**For all:** Dialer data volume is enormous. Always use the platform's aggregation endpoints. Pulling individual call records for a 30-day window on a busy BPO floor will hit timeouts and rate limits.

---

## Output schema

```json
{
  "tool": "five9",
  "extracted_at": "...",
  "lookback_window": "30 days",
  "outbound": {
    "total_dials": 1840000,
    "connect_rate": 0.18,
    "rpc_rate": 0.42,
    "conversation_rate": 0.61,
    "avg_handle_time_seconds": 284,
    "abandonment_rate": 0.04,
    "by_campaign": [{"campaign": "Healthcare Q2", "dials": 412000, "connects": 87000, "conversations": 53000}]
  },
  "inbound": {
    "total_calls": 124000,
    "service_level_pct": 0.78,
    "service_level_target": "80% in 20s",
    "avg_speed_of_answer_seconds": 31,
    "avg_handle_time_seconds": 412,
    "first_call_resolution_rate": 0.68,
    "transfer_rate": 0.12,
    "abandonment_rate": 0.07
  },
  "dispositions": {
    "top_20": [{"disposition": "No answer", "count": 412000}, {"disposition": "Voicemail", "count": 284000}],
    "tagged_pct": 0.94,
    "custom_disposition_count": 87
  },
  "agents": {
    "active_30d": 412,
    "outbound_calls_per_agent": {"median": 412, "p75": 612, "p90": 842},
    "inbound_calls_per_agent": {"median": 184, "p75": 248, "p90": 312},
    "occupancy_median": 0.72,
    "top5_agent_volume_vs_median_ratio": 1.8,
    "agents_zero_calls_14d": 12
  },
  "campaigns": {
    "active_lists": 41,
    "list_penetration": [{"list": "Healthcare Q2", "penetration_pct": 0.84}],
    "lists_zero_dials_14d": 8,
    "dnc_scrub_frequency_days": 1
  },
  "quality": {
    "calls_scored_30d": 4200,
    "avg_qa_score": 0.82,
    "calibration_sessions_30d": 12,
    "coaching_sessions_30d": 184
  },
  "integration": {
    "calls_logged_to_crm_pct": 0.91,
    "median_sync_lag_seconds": 47,
    "sync_errors_7d": 84,
    "screen_pop_integrated": true
  },
  "compliance": {
    "tcpa_dnc_violations_90d": 0,
    "recording_disclosure_compliance_pct": 0.99,
    "after_hours_dial_rate": 0.02
  },
  "warnings": []
}
```
