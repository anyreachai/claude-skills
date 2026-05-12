# Triangulation Rules

This file defines the cross-tool reasoning that produces findings. Each rule (T1–T12) takes inputs from one or more fact files and emits zero or more findings. This is where the audit earns its keep — single-tool extraction is commodity; multi-tool reasoning is the IP.

When evaluating a rule, if a required input is missing or `null`, skip the rule and log a gap rather than firing the rule with bad data.

---

## T1. ICP Reality Check

**Inputs:** `10_crm.json` (closed-won firmographics), `stated_icp` from run inputs.

**What it checks:** Does the BPO's claimed ICP match the firmographics of customers they actually win?

**Method:**
1. Parse stated ICP into structured dimensions (industry, employee band, geo, ACV range).
2. From `closed_won.by_industry`, `by_employee_band`, `by_geo`, `acv_distribution`, identify the top concentration on each dimension (the "actual ICP").
3. Compute drift on each dimension:
   - Categorical (industry, geo): % of won deals that fall outside stated ICP categories.
   - Continuous (employee count, ACV): % of won deals more than 1 standard deviation from stated mid-point.
4. If drift on any single dimension >25%, fire a finding.

**Severity:** `high` if drift >25% on any one dimension, `critical` if drift >40% on any one OR drift >25% on three+ dimensions simultaneously.

**Why it matters:** ICP drift is the silent killer of GTM efficiency. The org optimizes outbound, content, and sequences for stated ICP while actually winning a different segment. Every dollar of marketing spend is mistargeted by the drift percentage.

---

## T2. Source Attribution Integrity

**Inputs:** `11_map.json` (`lead_sources`, `integration_health`), `10_crm.json` (`closed_won.by_source`).

**What it checks:** Does lead source data survive the MAP → CRM journey intact?

**Method:**
1. Compare MAP's reported new-lead source distribution (last 90 days) against CRM's source distribution for leads created in the same window.
2. Compute the % of MAP-sourced leads that retain their original source value in CRM.
3. Flag if retention <85%.

**Severity:** `high` if retention <85%, `critical` if <60% (attribution is essentially broken).

**Why it matters:** If source attribution is broken, every downstream analysis is broken. Marketing spend allocation, channel ROI, source-specific playbooks — all built on sand.

---

## T3. Handoff Latency

**Inputs:** `11_map.json` (`mql_to_sql.median_time_to_sql_hours`, `p75_time_to_sql_hours`, `rejection_rate`).

**What it checks:** How long do MQLs sit before sales acts on them?

**Method:**
- Median time-to-SQL >24 hours: `medium` finding
- Median time-to-SQL >48 hours: `high` finding
- Median time-to-SQL >72 hours: `critical` finding
- Rejection rate >40%: separate `high` finding (MQL definition broken)

**Why it matters:** Lead intent decays exponentially. A 72-hour median handoff means most prospects have evaluated competitors before sales engages.

---

## T4. Rep Concentration Risk

**Inputs:** `10_crm.json` (`pipeline.by_stage`, `closed_won.by_owner`, `closed_won.owner_gini`).

**What it checks:** How much of revenue depends on a small number of reps?

**Method:**
1. Compute share of open pipeline value held by top 3 reps.
2. Compute share of last-4Q closed-won held by top 3 reps.
3. Use Gini coefficient as a continuous fairness measure.

**Severity:**
- Top 3 share >50% of pipeline OR >60% of closed-won: `high`
- Top 1 share >40% of pipeline OR >50% of closed-won: `critical` (single point of failure)
- Gini >0.65: `medium` (severe inequality but no single dependency)

**Why it matters:** A BPO whose forecast depends on one rep is one resignation away from a missed quarter. This is a hiring + enablement problem disguised as a sales problem.

---

## T5. Sequence ROI

**Inputs:** `12_sales_engagement.json` (`sequence_performance_top20`), `10_crm.json` (closed-won opportunity creation, by source/sequence if joinable).

**What it checks:** Which sequences actually create pipeline, and which are vanity?

**Method:**
1. For each top-20 sequence, compute: enrollments → meetings → opportunities → closed-won (where the join is possible).
2. Rank by opp-creation rate and revenue-influenced.
3. Identify sequences with high enrollment (>200) and zero opps as retirement candidates.
4. Identify sequences with <0.5% opp-creation rate as low-yield.

**Output finding type:** A list of sequence IDs with action recommendations (retire / reduce / preserve / expand).

**Severity:**
- More than 30% of top-20 sequences are retirement candidates: `high`
- Sequence-to-opp data join cannot be completed (no contact-level keys): finding emitted at `low` severity flagging the integration gap.

**Why it matters:** Most sales orgs have 5x more sequences than they need, and reps default to whichever sequence is at the top of the list rather than the highest-performing one. Cleaning this up is one of the highest-ROI 30-day moves available.

---

## T6. Tool ROI

**Inputs:** All extractor files' license/utilization sections.

**What it checks:** Is the BPO paying for capability they're not using?

**Method:**
For each tool with license data:
- Compute `active_users / licensed_seats`
- Flag if <50%: `medium` finding
- Flag if <30%: `high` finding

For each tool with credit/usage data:
- Compute `credits_used / credits_allotted` MTD
- Flag if <40% with two months of history showing the same pattern: `medium` finding

**Why it matters:** Underutilized tools are the easiest cost-cutting case to make to a CFO and a useful door-opener for the broader audit conversation. Often the tool isn't the problem — the workflow forcing reps to use it is.

---

## T7. Pipeline Coverage Sanity

**Inputs:** `10_crm.json` (`pipeline.open_total_value`, `pipeline.stage_conversion_rates`, `closed_won.median_sales_cycle_days`).

**What it checks:** Does open pipeline support the implied forecast?

**Method:**
1. From open pipeline by stage, apply historical stage-conversion rates to compute expected close-in-quarter value.
2. Compare to stated forecast if accessible. If not, compare to last-quarter closed-won as a proxy for implied target.
3. Flag if implied coverage <2.5x for the current quarter (industry rule of thumb is 3–4x for SaaS, 2.5x for services).

**Severity:**
- Implied coverage 2.0–2.5x: `medium`
- Implied coverage <2.0x: `high`
- Implied coverage <1.5x: `critical` (math doesn't support the forecast)

**Why it matters:** The board hears the forecast. If pipeline math doesn't support it, the audit needs to surface that — directly to the BPO's CRO if needed.

---

## T8. Stage Skipping

**Inputs:** `10_crm.json` (`closed_won.stage_skip_rate`).

**What it checks:** Are deals respecting the defined sales process?

**Method:**
- Stage skip rate >25%: `high` finding
- Stage skip rate >40%: `critical` finding (stages are theatrical, forecasts are unreliable)

**Why it matters:** When stages are skipped, stage-based forecasting becomes meaningless. Either the stages are wrong (process problem) or reps are gaming them (incentive problem). Either way, fix needed.

---

## T9. Activity ≠ Outcome

**Inputs:** `12_sales_engagement.json` (`rep_adoption`, calls/emails per user), `10_crm.json` (`closed_won.by_owner`).

**What it checks:** Does rep activity correlate with rep outcome?

**Method:**
1. Compute correlation between per-rep activity volume (calls + emails) and per-rep closed-won.
2. Flag if correlation is negative or near-zero (<0.1).

**Severity:**
- Correlation 0.1–0.3: `medium` (weak relationship — targeting question)
- Correlation <0.1: `high` (no relationship — activity is theater)
- Correlation <0: `critical` (high-activity reps lose more — broken incentive or broken targeting)

**Why it matters:** Most orgs assume more activity = more outcome and pile on activity expectations. When the correlation is weak, the bottleneck is targeting or skill, not effort. Adding more dials makes things worse.

---

## T10. Competitor Pattern

**Inputs:** `13_conversation_intel.json` (`coaching.top_competitors`), `10_crm.json` (`closed_lost.competitor_field`).

**What it checks:** Are the competitors in calls the same as the competitors in CRM?

**Method:**
1. Compare top 5 competitors by Gong mention count to top 5 in CRM closed-lost competitor field.
2. Flag any competitor that's in the top 5 of one and not the other.

**Severity:** Always `medium`, but the qualitative finding is high-value.

**Why it matters:** When Gong shows you're losing to Vendor A but CRM doesn't, you have a closed-lost data quality problem (and competitive positioning is being mis-allocated). When CRM shows Vendor B is the top competitor but Gong doesn't, you have a stale competitive picture.

---

## T11. Data Quality Cascade

**Inputs:** `10_crm.json` (`data_quality`), `12_sales_engagement.json` (`sequence_performance_top20`).

**What it checks:** Does poor account data lead to worse sequence performance?

**Method:**
1. Tag accounts in CRM by data completeness (high: ≥80% of critical fields; low: <50%).
2. Compute reply rate for sequences targeting high-completeness accounts vs low-completeness accounts (where contact-account joins are available).
3. Flag if low-completeness reply rate is <50% of high-completeness reply rate.

**Severity:** `high` if gap >2x. The finding doubles as the business case for a data investment.

**Why it matters:** The data investment case is usually made on principle ("we should have clean data"). This rule converts it to dollars: bad data is worth X% of reply rate, which is worth Y meetings, which is worth Z pipeline.

---

## T12. Zombie Spend

**Inputs:** All extractor files' "active but inactive" sections.

**What it checks:** What is the BPO paying for that produces no outcomes?

**Method:**
Sum across:
- Active campaigns with zero engagement last 30 days (with spend) — from MAP
- Orphaned active sequences — from sales engagement
- Underutilized data provider credits — from data providers
- Idle dialer lists — from dialer
- Active workflows with zero firings — from MAP and CRM

**Output:** A consolidated zombie list with estimated annual spend impact (where spend data is available).

**Severity:** `medium`, but the dollar number is what gets attention.

**Why it matters:** Easy quick wins. Almost every audit finds 5–15% of GTM tooling spend is going to artifacts no one is using. Killing them frees budget for the things actually working.

---

## Adding new rules

When a human reviewer flags a missed insight on a real audit, encode it here as a new T-rule. Follow the same structure: inputs, method, severity, why-it-matters.

Versioning: bump the comment at the top of this file when adding a rule, and note the audit that motivated it. The skill maintainer reviews quarterly to consolidate or retire rules that aren't producing useful findings.
