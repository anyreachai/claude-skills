---
name: anyreach-funnel-analysis
description: Run an end-to-end funnel analysis for Anyreach using Mixpanel data, generating a comprehensive PDF report with acquisition, onboarding, in-app activation metrics, hidden insights, and recommendations. Use this skill whenever the user asks to analyze the funnel, check conversion rates, rerun the funnel analysis, generate funnel metrics, create a funnel report, compare pre/post auth page performance, check activation rates, or asks about signup-to-agent conversion. Also trigger when the user says things like "rerun this analysis", "give me the latest funnel numbers", "how's the funnel doing", "check conversion rates", "what are the dropoffs", or "generate the funnel PDF". This skill should be used even for partial funnel questions like "what's the agent creation rate" or "how's onboarding converting" since the full context is needed for accurate analysis.
---

# Anyreach End-to-End Funnel Analysis

This skill conducts a comprehensive funnel analysis for Anyreach using Mixpanel, covering the full journey from marketing site visit through signup, onboarding, and in-app feature activation. It produces a formatted PDF report with key metrics, dropoff analysis, hidden insights, and prioritized recommendations.

## Prerequisites

- Mixpanel tools must be available (Run-Funnels-Query, Run-Segmentation-Query)
- PDF generation via reportlab (pre-installed)
- Mixpanel Project ID: **3699924**

## Quick Start

When the user asks to run or rerun the funnel analysis:

1. Read `references/QUERIES.md` for the exact Mixpanel queries to run
2. Read `references/REPORT_TEMPLATE.md` for the PDF generation code
3. Execute all queries, compute metrics, generate the PDF
4. Present findings with the key narrative (see Interpretation Guide below)

## Analysis Framework

### Step 1: Pull Fresh Data

Run ALL queries documented in `references/QUERIES.md`. The date range should be:
- **from_date**: `2025-11-01` (fixed start — this is when meaningful tracking began)
- **to_date**: today's date
- **conversion window**: 30 days (`length: 30, length_unit: "day"`)

For the auth page pre/post comparison, use:
- **Pre-update period**: Jan 27 – Feb 12, 2026
- **Post-update period**: Feb 13 – today
- Compare using **daily Signup Completed averages only** (not conversion rates — see Auth Caveat below)

### Step 2: Compute Metrics

From the query results, calculate:

**Top-level stats:**
- End-to-end rate: Onboarding Completed / CTA Clicked
- Agent creation rate: Agent Created / Signup Completed
- Onboarding completion rate: Onboarding Completed / Onboarding Page Viewed
- Trial start rate: Trial Started / Signup Completed

**Step conversions** for each funnel stage (current step / previous step).

**Daily averages** for auth comparison (total completions / days in period).

**Onboarding path analysis:**
- Completers → Agent Created rate
- Skippers → Agent Created rate  
- Abandoners → Agent Created rate

**Activation window:** Compare 7-day vs 30-day Agent Created counts to determine what % of activation happens in week 1.

### Step 3: Generate PDF Report

Use the template in `references/REPORT_TEMPLATE.md` to generate a professional PDF with these sections:

1. **Key Metrics** (4 stat cards at top)
2. **Acquisition Funnel** (CTA → Signup Started → Signup Completed)
3. **Auth Page Pre/Post Comparison** (daily completions table)
4. **Onboarding Funnel** (Page Viewed → Analysis → Complete, plus abandoned/skipped)
5. **In-App Feature Activation** (all features ranked by % of signups)
6. **Hidden Insights** (6 insights — see below)
7. **Top Leaks by Impact** (ranked table)
8. **Changes Since Last Analysis** (if previous data is available)
9. **Recommended Actions** (prioritized P0/P1/P2)

### Step 4: Present and Narrate

After generating the PDF, provide a concise narrative summary highlighting:
- The 2-3 most important changes since last analysis
- Whether key metrics are trending up or down
- Any new patterns or anomalies

## Auth Page Caveat (CRITICAL)

**The "Signup Started" event changed definitions on Feb 13, 2026:**
- **Pre-update**: Fired on GET to /sign-up (page load — counted every bouncer)
- **Post-update**: Fires after user clicks "Sign up with Google" or "Continue with email" (higher intent)

**This means:**
- Signup Started → Completed conversion rates are NOT comparable across periods
- The ONLY valid comparison is **absolute daily Signup Completed** counts
- Always flag this caveat prominently in the report
- Once the SIGNUP_STARTED fix ships (fire on page load again), this caveat can be removed

## Interpretation Guide: Hidden Insights

These are the recurring patterns to check and report on. Update the specific numbers but maintain these analytical frames:

### Insight #1: Onboarding Skippers vs Completers
Query: Onboarding Completed → Agent Created vs Onboarding Skipped → Agent Created.
**Pattern**: Skippers consistently create agents at a higher rate than completers. The onboarding auto-publishes an agent (visible in `onboarding_state` JSON — every completion has `"published":true`), creating a false "done" feeling. Report the ratio (e.g., "2.4x higher").

### Insight #2: Signups That Never See Onboarding
Compare Signup Completed count vs Onboarding Page Viewed (within 1 hour window). The gap represents users who signed up but got zero guided experience.

### Insight #3: Trial Starts Disconnected from Product Usage
Query: Trial Started → Agent Created. Pattern: Most trial starters never create an agent. This represents a churn risk — users paying before experiencing value.

### Insight #4: 7-Day Activation Window
Compare Signup → Agent Created with 7-day vs 30-day conversion windows. Pattern: ~90%+ of agent creation happens in the first week. After day 7, users are essentially lost.

### Insight #5: Onboarding-to-Dashboard Handoff
Query: Onboarding Completed → Dashboard Viewed. Pattern: ~1/3 of onboarding completers never reach the dashboard — they finish onboarding and disappear.

### Insight #6: Agent Creation Flat vs Signup Volume
Query: Weekly Agent Created and weekly Signup Completed segmentations. Pattern: Agent creation stays at 2-6/week regardless of signup volume fluctuations. The bottleneck is product experience, not top-of-funnel.

## Leak Ranking

Rank leaks by **absolute users lost**, not just percentage:

1. Signup Completed → Agent Created (usually #1 — the activation cliff)
2. Signup Started → Completed (auth page black box)
3. Analysis Complete → Onboarding Completed (post-demo dropoff)
4. Trial → Agent Created (paying without value)
5. KB & Phone Numbers (dead-end features)

## Recommendations Framework

Always include these action categories, updating specifics based on current data:

- **P0**: Fix tracking infrastructure (Logto webhook, SIGNUP_STARTED event definition, client-side auth tracking)
- **P1**: Improve post-onboarding handoff and add early activation nudges (day 1-3)
- **P2**: Gate trial behind product action, audit dead-end features (KB, Phone Numbers)

## Output

Save the PDF to `/mnt/user-data/outputs/anyreach-funnel-analysis-{date}.pdf` and present it to the user using the `present_files` tool.
