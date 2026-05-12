# Conversation Intelligence Extractor Playbook

Applies to: Gong, Chorus (now ZoomInfo Engage), Clari Copilot (formerly Wingman), Avoma, Fathom (basic).

Output file: `output_dir/facts/13_conversation_intel.json`.

---

## What to extract

### A. Call volume & coverage

- Total recorded calls last 90 days
- Calls per rep distribution (median, p75, p90)
- Reps with zero recorded calls last 30 days (license waste or non-customer-facing role)
- % of opportunities with at least one recorded call (coverage)
- % of closed-won deals with recorded discovery + demo + close calls (full-cycle coverage)

### B. Talk dynamics

- Talk ratio distribution (rep talk time / total talk time)
- Longest monologue distribution (longest uninterrupted rep stretch)
- Question rate (questions asked per minute)
- Patience metric (median wait time after asking a question before speaking again)
- Distribution of these metrics by rep (top performers vs bottom performers)

### C. Coaching signals (last 90 days)

- Top 20 objection topics by frequency (use the tool's native trackers if available)
- Top 10 competitor mentions by frequency
- Top 10 product mentions by frequency
- Top 10 pain points / use cases mentioned
- Sentiment distribution per call (positive / neutral / negative — if tool supports)

### D. Deal risk signals

- Open deals flagged at-risk by the tool's risk model
- Risk reasons distribution
- Deals with no rep activity in last 14 days (stalled)
- Deals with single-thread engagement (one contact only — flight risk)

### E. Multithreading & buying committee

- Average number of contacts engaged per won deal
- Average number of contacts engaged per lost deal
- % of won deals with C-suite engagement
- % of lost deals with C-suite engagement

### F. Tracker / topic configuration

- Active tracker categories
- Hit count per tracker last 90 days
- Trackers with zero hits last 90 days (config rot)

---

## Query strategy

**Gong:** REST API and the more complete extensible API. Use `/v2/calls` with filters, `/v2/stats/activity/scorecards` for aggregated metrics. The `/v2/data-privacy/data-for-customer` endpoint is useful for compliance but heavy — don't use for routine extraction.

**Chorus / ZoomInfo Engage:** Has a smaller public API surface. May need to rely on saved-report exports.

**Clari Copilot:** REST API. Aggregations via the `/insights` endpoints.

**For all:** Don't pull call transcripts. Pull metadata, scorecard data, and tracker hits only. Transcripts are massive and rarely useful at the audit-aggregate level.

---

## Output schema

```json
{
  "tool": "gong",
  "extracted_at": "...",
  "lookback_window": "90 days",
  "call_volume": {
    "total_calls_90d": 4280,
    "calls_per_rep": {"median": 84, "p75": 142, "p90": 218},
    "reps_zero_calls_30d": 6,
    "opps_with_call_pct": 0.71,
    "closed_won_full_cycle_coverage_pct": 0.42
  },
  "talk_dynamics": {
    "talk_ratio_distribution": {"median": 0.61, "p25": 0.48, "p75": 0.74},
    "longest_monologue_seconds": {"median": 84, "p75": 142, "p90": 218},
    "questions_per_minute": {"median": 1.2, "p75": 1.8},
    "patience_seconds": {"median": 1.4},
    "by_rep_top5_winrate": [{"user": "...", "talk_ratio": 0.48, "win_rate": 0.34}],
    "by_rep_bot5_winrate": [{"user": "...", "talk_ratio": 0.78, "win_rate": 0.08}]
  },
  "coaching": {
    "top_objections": [{"topic": "Pricing", "count": 412}, {"topic": "Timing", "count": 284}],
    "top_competitors": [{"competitor": "Vendor A", "count": 142}, {"competitor": "Vendor B", "count": 87}],
    "top_products": [{"product": "Module X", "count": 412}],
    "top_pain_points": [{"pain": "Manual reporting", "count": 184}],
    "sentiment_distribution": {"positive": 0.48, "neutral": 0.41, "negative": 0.11}
  },
  "deal_risk": {
    "at_risk_count": 47,
    "risk_reasons": [{"reason": "No activity 14d+", "count": 18}, {"reason": "Single thread", "count": 14}],
    "stalled_14d_count": 84,
    "single_thread_open_pct": 0.41
  },
  "multithreading": {
    "won_deals_avg_contacts": 4.8,
    "lost_deals_avg_contacts": 2.1,
    "won_with_c_suite_pct": 0.62,
    "lost_with_c_suite_pct": 0.18
  },
  "trackers": {
    "active_count": 84,
    "hit_distribution": [{"tracker": "Pricing objection", "hits_90d": 412}],
    "zero_hit_count": 23
  },
  "warnings": []
}
```
