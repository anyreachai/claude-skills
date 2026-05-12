# Data Provider Extractor Playbook

Applies to: ZoomInfo, Apollo (data features), Cognism, LinkedIn Sales Navigator, Lusha, Clearbit, 6sense (firmographic side).

Output file: `output_dir/facts/14_data_provider.json`.

---

## What to extract

### A. License & utilization

- License type and tier
- Total credits / lookups allotted (monthly or quarterly)
- Credits consumed MTD and last 30 days
- Credits remaining
- Active users last 30 days
- Users with zero activity last 30 days (license waste)

### B. Enrichment coverage

- % of CRM accounts with provider ID populated (where provider has pushed back IDs)
- % of CRM contacts with provider ID populated
- Most recent enrichment date distribution (median, p75 — staleness signal)

### C. Push activity

- Records pushed to CRM last 90 days (companies, contacts)
- Records pushed but not actioned in CRM (created in CRM but no opportunity, no activity, no sequence enrollment within 30 days)

### D. Search and list activity

- Saved searches (count, last-run date distribution)
- Lists (count, size distribution)
- Lists with zero exports / zero CRM pushes last 90 days (orphaned)

### E. Intent / signal data (where applicable — ZoomInfo, 6sense, Bombora-integrated)

- Active intent topics being tracked
- Account intent score distribution
- % of high-intent accounts with active opportunities or sequences (intent → action conversion)

This last metric is one of the highest-value diagnostics in the entire audit. A tool surfacing 200 in-market accounts and 0 are in active outbound is a process failure, not a tool failure.

---

## Query strategy

**ZoomInfo:** REST API. Use the admin endpoints for credit and user data, the data API for record-level pulls. Aggregate locally.

**Apollo:** Mixed REST/GraphQL. The admin endpoints are limited — for utilization data, sometimes a saved report export is the only way.

**Cognism:** REST API. Smaller surface area.

**LinkedIn Sales Navigator:** No public API — utilization data requires admin UI scraping or a Sales Navigator + CRM Sync inspection. Often this becomes a "skip with logging" target unless an admin can export usage manually.

**For all:** The point of auditing data providers is rarely the data itself — it's understanding whether the BPO is paying for capability they're not using. Focus on utilization, activation, and the conversion of provider signals into rep actions.

---

## Output schema

```json
{
  "tool": "zoominfo",
  "extracted_at": "...",
  "lookback_window": "90 days",
  "license": {
    "tier": "Advanced+",
    "monthly_credit_allotment": 50000,
    "credits_used_mtd": 18400,
    "credits_used_last_30d": 24200,
    "credits_remaining_mtd": 31600,
    "active_users_30d": 32,
    "users_zero_activity_30d": 14
  },
  "enrichment_coverage": {
    "crm_accounts_with_provider_id_pct": 0.62,
    "crm_contacts_with_provider_id_pct": 0.41,
    "median_days_since_enrichment_account": 84,
    "median_days_since_enrichment_contact": 142
  },
  "push_activity": {
    "companies_pushed_90d": 1240,
    "contacts_pushed_90d": 8420,
    "pushed_not_actioned_30d_pct": 0.62
  },
  "search_and_lists": {
    "saved_searches_count": 84,
    "saved_searches_run_last_30d": 23,
    "lists_count": 142,
    "lists_with_zero_export_90d": 87
  },
  "intent": {
    "active_intent_topics": 41,
    "high_intent_accounts_count": 218,
    "high_intent_with_open_opp_pct": 0.18,
    "high_intent_with_active_sequence_pct": 0.34
  },
  "warnings": []
}
```
