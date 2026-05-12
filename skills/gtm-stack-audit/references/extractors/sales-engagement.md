# Sales Engagement Extractor Playbook

Applies to: Outreach, Salesloft, Apollo (engagement features), Groove, Mixmax.

Output file: `output_dir/facts/12_sales_engagement.json`.

---

## What to extract

### A. Sequence inventory

- Total sequences (active, paused, archived)
- Active sequences with zero new enrollments last 30 days (orphaned)
- Sequences enrolled by only 1 user (one-off / unsanctioned — flag if >20% of inventory)
- Sequence creator distribution: top 5 creators, % of total inventory each owns
- Sequence age distribution: median days since last edit

### B. Sequence performance (top 20 by enrollment, last 90 days)

For each:
- Enrollments started
- Reply rate (positive replies / enrollments)
- Negative reply rate (out-of-office, opt-out, "stop contacting")
- Meeting booked rate
- Opt-out rate
- Finished-without-reply rate
- Step-level drop-off (where in the cadence prospects disengage)

### C. Rep adoption

- Active users last 30 days
- Sequences enrolled per user (median, p75, p90)
- Calls logged per user last 30 days
- Emails sent per user last 30 days
- Tasks completed per user last 30 days
- Users with zero activity last 14 days (license waste candidates)

### D. Templates and snippets

- Total templates
- Templates by ownership: shared vs personal
- Template last-edited distribution (% edited in last 90 days — staleness signal)
- Most-used templates last 30 days (top 10)

### E. Calendar/booking integration

- Meeting bookings via integrated calendar last 90 days
- Median time from sequence start → meeting booked
- No-show rate (where tracked)

### F. CRM sync health

- % of sequence activities synced to CRM
- Sync error count last 7 days
- Records out-of-sync (in tool but not in CRM, or vice versa)

---

## Query strategy

**Outreach:** REST API. Use `/sequences` with filters, `/mailings` for email metrics, `/calls` for dialer activity. Aggregate locally.

**Salesloft:** REST API. Use `/cadences` for sequences, `/cadence_memberships` for enrollments, `/activities` for granular activity. Has good built-in analytics endpoints — prefer them over raw record pulls.

**Apollo:** GraphQL/REST hybrid. Sequence endpoints are more limited than dedicated tools — pull what's available and flag gaps.

**For all:** Most sales engagement tools rate-limit aggressively. Stagger calls. If you hit a limit, sleep and retry — don't crash.

---

## Output schema

```json
{
  "tool": "outreach",
  "extracted_at": "...",
  "lookback_window": "90 days",
  "sequence_inventory": {
    "total": 187,
    "active": 142,
    "paused": 28,
    "archived": 17,
    "orphaned_active": 47,
    "single_user_sequences": 38,
    "single_user_pct": 0.203,
    "top_creators": [{"user_id": "...", "name": "Rep A", "sequences_owned": 41, "pct": 0.219}],
    "median_days_since_edit": 84
  },
  "sequence_performance_top20": [
    {
      "sequence_id": "...",
      "name": "Outbound - Mid-market - Healthcare",
      "enrollments_90d": 412,
      "reply_rate": 0.083,
      "negative_reply_rate": 0.041,
      "meeting_booked_rate": 0.024,
      "opt_out_rate": 0.018,
      "finished_no_reply_rate": 0.612,
      "step_dropoff": [
        {"step": 1, "active_pct": 1.0},
        {"step": 2, "active_pct": 0.78},
        {"step": 3, "active_pct": 0.42}
      ]
    }
  ],
  "rep_adoption": {
    "active_users_30d": 42,
    "median_sequences_per_user": 4,
    "p75_sequences_per_user": 9,
    "median_calls_per_user_30d": 84,
    "median_emails_per_user_30d": 412,
    "median_tasks_per_user_30d": 142,
    "users_zero_activity_14d": 8
  },
  "templates": {
    "total": 412,
    "shared": 142,
    "personal": 270,
    "edited_last_90d_pct": 0.21,
    "top_used_30d": [{"template_id": "...", "name": "...", "uses_30d": 412}]
  },
  "calendar": {
    "meetings_booked_90d": 184,
    "median_time_to_meeting_days": 9.2,
    "no_show_rate": 0.18
  },
  "crm_sync": {
    "activities_synced_pct": 0.94,
    "sync_errors_7d": 12,
    "out_of_sync_records": 47
  },
  "warnings": []
}
```
