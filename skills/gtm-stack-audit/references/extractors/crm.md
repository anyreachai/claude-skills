# CRM Extractor Playbook

Applies to: Salesforce, HubSpot CRM, Microsoft Dynamics 365, Zoho CRM, Pipedrive.

Output file: `output_dir/facts/10_crm.json` (or `10_crm_<vendor>.json` if multi-instance).

The CRM is the spine of every triangulation rule in Phase 2. Be especially disciplined here — bad CRM extraction breaks everything downstream.

---

## What to extract

### A. Pipeline shape (current state)

For all open opportunities:
- Count and total value by stage
- Median age in stage
- Days since last activity (median, p75, p90)

For closed opportunities (last 4 quarters):
- Stage-to-stage conversion rate (% that progressed from each stage to the next)
- % of closed-won that skipped one or more stages (used by T8)

### B. Closed-won analysis (last 4 quarters)

- Count and total ACV
- ACV distribution: p25, p50, p75, p90
- Median sales cycle (created → closed-won), in days
- Lead source distribution (count and % of total)
- Owner/rep distribution (count, % of total, Gini coefficient if computable)
- Industry distribution (top 10)
- Employee band distribution (if firmographic field exists)
- Geo distribution (country/region, top 10)
- Deal size by source (mean ACV per source)

### C. Closed-lost analysis (last 4 quarters)

- Count and total potential value
- Top 10 loss reasons by count
- Top 10 loss reasons by value
- Stage distribution at time of loss (where in funnel deals die)
- Median time-to-loss
- Competitor field distribution (if populated) — used by T10

### D. Account base

- Total accounts
- % with activity (any task/event/email logged) in last 30/60/90 days
- % with at least one open opportunity
- Tier/segment distribution (if such fields exist — common names: Tier, Segment, Account_Type__c, hubspot_owner_id)
- ICP fit score distribution (if such field exists)

### E. Data quality

For Accounts:
- % records with missing Industry
- % records with missing Employee Count / Number of Employees
- % records with missing Annual Revenue
- % records with missing Owner
- % records with missing Country / Billing State
- Duplicate rate by domain (count of accounts where another account shares the same email domain or website domain)

For Contacts:
- % with valid email format
- % with phone number
- % with title
- Bounce rate / invalid email rate (if tracked)

For Opportunities:
- % with missing Amount
- % with missing Close Date
- % with Close Date in the past but still Open (overdue)
- % with missing Lead Source

### F. User activity

- Active users last 30 days (count)
- Last login distribution (median days since last login)
- Records edited per user last 30 days (median, p75)
- Top 5 users by record edits — flag if any single user accounts for >40% of all edits (admin or scripted activity)

### G. Custom objects and fields

- List all non-standard objects (anything outside the platform's default schema)
- Top 10 most-populated custom fields on Account
- Top 10 most-populated custom fields on Opportunity
- Count of total custom fields per object — flag if >50 on any single object (sprawl signal, used by red-flag catalog)

### H. Process inference

- Number of distinct opportunity record types
- Number of active sales processes / pipelines
- Workflow rules / flows / automations: count of active vs inactive
- Approval processes: count, average time to approval (if measurable)

---

## Query strategy

**Salesforce:** Prefer SOQL aggregate queries (`SELECT COUNT(), AVG(Amount), STDDEV(Amount) FROM Opportunity WHERE ...`) over record-level pulls. Use Reports API for historical trend data where SOQL is inefficient.

**HubSpot:** Use the analytics endpoints and CRM Search API with aggregations. Avoid full property-set fetches.

**Dynamics:** Use FetchXML with aggregates. Web API for everything else.

**Zoho/Pipedrive:** These have weaker aggregation support — fall back to paginated queries with `limit=200` and aggregate locally. Stop after 5,000 records unless explicitly requested otherwise.

**For all CRMs:** If the API exposes a "report" or "saved view" object, prefer running existing reports over building new queries — it's faster and less likely to hit rate limits.

---

## Output schema

```json
{
  "tool": "salesforce",
  "instance_type": "production",
  "extracted_at": "2026-05-08T...",
  "anchor_quarter": "Q1 2026",
  "lookback_window": "4 quarters",
  "pipeline": {
    "open_count": 412,
    "open_total_value": 8430000,
    "by_stage": [
      {"stage": "Discovery", "count": 145, "value": 1200000, "median_age_days": 18, "median_days_since_activity": 4},
      {"stage": "Demo", "count": 98, "value": 2100000, "median_age_days": 31, "median_days_since_activity": 9}
    ],
    "stage_conversion_rates": {"Discovery_to_Demo": 0.42, "Demo_to_Proposal": 0.61}
  },
  "closed_won": {
    "count": 184,
    "total_acv": 4920000,
    "acv_distribution": {"p25": 12000, "p50": 22000, "p75": 41000, "p90": 78000},
    "median_sales_cycle_days": 47,
    "by_source": [{"source": "Inbound - Web", "count": 62, "pct": 0.337, "mean_acv": 28400}],
    "by_owner": [{"owner": "user_id_1", "count": 41, "pct": 0.223}],
    "owner_gini": 0.58,
    "by_industry": [{"industry": "Healthcare", "count": 38, "pct": 0.207}],
    "by_employee_band": [{"band": "501-1000", "count": 52, "pct": 0.283}],
    "by_geo": [{"region": "US-NE", "count": 71, "pct": 0.386}],
    "stage_skip_rate": 0.31
  },
  "closed_lost": {
    "count": 240,
    "total_potential": 6100000,
    "top_reasons_by_count": [{"reason": "Price", "count": 78}, {"reason": "No decision", "count": 54}],
    "top_reasons_by_value": [{"reason": "Lost to competitor X", "value": 1900000}],
    "by_stage_at_loss": [{"stage": "Demo", "count": 92}],
    "median_time_to_loss_days": 38,
    "competitor_field": [{"competitor": "Vendor A", "count": 41}]
  },
  "account_base": {
    "total": 12480,
    "active_30d_pct": 0.18,
    "active_60d_pct": 0.27,
    "active_90d_pct": 0.34,
    "with_open_opp_pct": 0.09,
    "tier_distribution": [{"tier": "Tier 1", "count": 240, "pct": 0.019}]
  },
  "data_quality": {
    "account_missing_industry_pct": 0.34,
    "account_missing_employee_count_pct": 0.51,
    "account_missing_revenue_pct": 0.62,
    "account_missing_owner_pct": 0.04,
    "account_missing_country_pct": 0.11,
    "account_duplicate_domain_rate": 0.07,
    "contact_invalid_email_pct": 0.09,
    "contact_missing_phone_pct": 0.42,
    "contact_missing_title_pct": 0.28,
    "opp_missing_amount_pct": 0.03,
    "opp_missing_close_date_pct": 0.01,
    "opp_overdue_pct": 0.18,
    "opp_missing_source_pct": 0.22
  },
  "user_activity": {
    "active_users_30d": 87,
    "median_days_since_last_login": 3,
    "median_records_edited_30d": 142,
    "top_user_edit_share": 0.18
  },
  "custom_schema": {
    "custom_objects": ["Custom_Process__c", "Partner_Engagement__c"],
    "top_custom_fields_account": [{"field": "Tier__c", "fill_rate": 0.91}],
    "top_custom_fields_opp": [{"field": "Win_Reason__c", "fill_rate": 0.34}],
    "custom_field_count_account": 47,
    "custom_field_count_opp": 38
  },
  "process_inference": {
    "opp_record_types": 3,
    "active_pipelines": 2,
    "active_workflows": 41,
    "inactive_workflows": 87,
    "active_approval_processes": 5
  },
  "warnings": []
}
```

If a section can't be populated due to API limits or missing fields, set its value to `null` and append an entry to `warnings` describing what was skipped and why. Do not silently omit fields — Phase 2 rules check for `null` explicitly.
