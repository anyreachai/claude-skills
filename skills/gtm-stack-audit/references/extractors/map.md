# Marketing Automation Extractor Playbook

Applies to: Marketo, HubSpot Marketing Hub, Pardot (Account Engagement), Eloqua, ActiveCampaign.

Output file: `output_dir/facts/11_map.json`.

---

## What to extract

### A. Campaign inventory

- Total campaigns (active, paused, draft, completed)
- Spend per active campaign last 90 days (where spend field is tracked)
- Campaigns with zero engagement last 30 days — used by T12 (zombie spend)
- Campaigns by type (email, paid, event, webinar, content syndication)

### B. Lead source attribution

- New leads/contacts created last 90 days, by original source
- Conversion rate to MQL by source
- Conversion rate to SQL by source (if MAP tracks this — many do via CRM sync)
- Cost per MQL by source (where spend data exists)
- Source field consistency: % of new leads with a populated source

### C. Email program health

For all sends last 90 days, weekly time series:
- Total sends
- Open rate (unique opens / delivered)
- Click rate (unique clicks / delivered)
- Click-to-open rate
- Unsubscribe rate
- Hard bounce rate
- Soft bounce rate
- Complaint rate

Flag any week where unsubscribe rate >0.5% or hard bounce rate >2% (sender reputation risk).

### D. Forms

- Top 10 forms by submission volume (last 90 days)
- Conversion rate per form (visits → submissions, where MAP tracks both)
- Form-to-MQL rate per form
- Forms with zero submissions last 90 days (orphaned)

### E. MQL → SQL handoff

- MQL count last 90 days
- SQL count last 90 days
- Median time MQL → SQL acceptance (in hours)
- Rejection rate (MQLs marked invalid by sales)
- Top rejection reasons (if tracked)

This is the field T3 (handoff latency) depends on most heavily. Be precise here.

### F. Audience / list hygiene

- Total contactable contacts (subscribed, not bounced)
- % engaged in last 90 days (opened or clicked any email)
- % unsubscribed
- % hard-bounced
- % marked spam/complaint
- List growth rate last 90 days (net new — unsubs/bounces)

### G. Workflow / automation

- Active automation programs / workflows
- Programs with zero enrollments last 30 days (orphaned)
- Programs with errors / suspended status

### H. Integration health

- Sync status with CRM (last successful sync, error count)
- % of MAP contacts with corresponding CRM record
- Sync lag distribution (median time MAP create → CRM create)

The integration health section is critical for T2 (source attribution integrity) and T3.

---

## Query strategy

**Marketo:** Use the REST API's bulk extract for lead and activity data. Aggregations require local computation. Pull activities (filter to `email_open`, `email_click`, `unsubscribed`, `bounced`) for the lookback window.

**HubSpot:** Use the analytics endpoints (`/analytics/v2/reports/...`) for pre-aggregated data. CRM Search API for record-level joins.

**Pardot/Account Engagement:** Use the v5 API. Aggregations are limited; pull prospect activity and aggregate locally. Watch for the per-day API limit.

**Eloqua:** REST API with bulk export for activity data.

**For all:** Don't pull full activity logs — extract aggregates. A 90-day activity log can be 10M+ rows on a busy MAP instance.

---

## Output schema

```json
{
  "tool": "marketo",
  "extracted_at": "...",
  "lookback_window": "90 days",
  "campaigns": {
    "total": 1247,
    "active": 184,
    "paused": 92,
    "draft": 47,
    "completed": 924,
    "active_with_zero_engagement_30d": 41,
    "by_type": [{"type": "email_blast", "count": 84}, {"type": "nurture", "count": 38}],
    "spend_last_90d_by_campaign": [{"campaign_id": "...", "name": "...", "spend": 12400}]
  },
  "lead_sources": {
    "new_leads_90d": 8420,
    "by_source": [
      {"source": "Webinar", "count": 1840, "mql_rate": 0.18, "sql_rate": 0.07, "cost_per_mql": 142}
    ],
    "missing_source_pct": 0.08
  },
  "email_health": {
    "weekly_series": [
      {"week_of": "2026-04-27", "sends": 84200, "open_rate": 0.21, "click_rate": 0.034, "unsub_rate": 0.003, "hard_bounce_rate": 0.008, "complaint_rate": 0.0004}
    ],
    "warnings": []
  },
  "forms": {
    "top_10_by_submissions": [{"form_id": "...", "name": "Demo Request", "submissions_90d": 412, "conversion_rate": 0.078, "form_to_mql_rate": 0.61}],
    "orphaned_count": 23
  },
  "mql_to_sql": {
    "mql_count_90d": 1840,
    "sql_count_90d": 612,
    "median_time_to_sql_hours": 18.4,
    "p75_time_to_sql_hours": 47.2,
    "rejection_rate": 0.34,
    "top_rejection_reasons": [{"reason": "Not ICP", "count": 142}, {"reason": "Bad data", "count": 87}]
  },
  "list_hygiene": {
    "total_contactable": 184200,
    "engaged_90d_pct": 0.18,
    "unsubscribed_pct": 0.07,
    "hard_bounced_pct": 0.04,
    "complaint_pct": 0.002,
    "net_growth_90d": 4200
  },
  "automation": {
    "active_programs": 84,
    "orphaned_programs": 27,
    "errored_programs": 4
  },
  "integration_health": {
    "crm_last_sync": "2026-05-08T...",
    "crm_sync_errors_24h": 2,
    "contacts_with_crm_match_pct": 0.84,
    "sync_lag_median_seconds": 142
  },
  "warnings": []
}
```
