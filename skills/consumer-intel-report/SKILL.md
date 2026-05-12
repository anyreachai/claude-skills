---
name: consumer-intel-report
description: >
  Generate a white-labeled 12-section Consumer Experience Intelligence PDF from multi-platform consumer review data (Trustpilot, BBB, Reddit, G2, Glassdoor, app stores). Produces a McKinsey-caliber deliverable with dark-navy + accent-blue editorial design — cover, exec summary, methodology, quantitative + thematic analysis, deep dive on critical findings, employee sentiment, competitive benchmarking, competitor deep dives, AI opportunity matrix, perception gap, recommendations, conclusion. Trigger on "consumer intelligence report", "CX intelligence report", "consumer experience report", "multi-platform review analysis", "review intelligence PDF", "12-section review report", "CX deep dive for [company]", or when review data is provided with a request for a consulting-style PDF. White-labeled via prepared_by. Do NOT use for BPO outcomes pricing (bpo-roi-brief), single-competitor analysis (competitor-deep-dive), bot usage CSVs (demo-bot-usage-report), or general business research (company-deep-research).
---

# Consumer Experience Intelligence Report

Generate a McKinsey-caliber 12-section PDF report analyzing a company's consumer experience through multi-platform review data, surfacing AI automation opportunities, perception gaps, and strategic recommendations. The report is white-labeled (prepared_by parameter) so it can be delivered under any consulting firm's name.

---

## Prerequisites

- Review data (XLSX or CSV companion file, or raw review text) covering multiple independent platforms
- Company logo PNG (transparent background preferred — will auto-strip black/solid backgrounds)
- `reportlab` and `Pillow` for PDF + logo handling (`pip install reportlab Pillow --break-system-packages`)
- 5-15 minutes of analysis depending on dataset size

---

## Workflow

### Step 0 — Read the PDF Template

**Before doing anything else**, read `references/PDF_TEMPLATE.md` in this skill directory. It contains the complete reportlab code: color system, custom flowables (StatCard, CalloutBox, QuoteBlock), page templates (cover_page, normal_page), and the full build pattern. You'll need this for the final output.

### Step 1 — Collect Inputs

Confirm (or ask for) the 12 required inputs. If the user provided most of them in context, just verify gaps:

1. **Company Name** — Full legal name (e.g., "Acme Corporation, Inc.")
2. **Company Logo** — PNG path; transparent bg preferred. If black/solid bg, auto-strip with PIL (threshold R,G,B < 30 → alpha=0)
3. **Prepared By** — Consulting firm or team name (used on cover, footer, sign-off). For Anyreach-prepared reports, this is "Anyreach"
4. **Report Date** — Delivery date
5. **Data Period** — Review date range (e.g., "August 2022 - March 2026")
6. **Review Data Source** — Path to XLSX/CSV, or pasted review data
7. **Total Reviews Analyzed** — Integer count
8. **Total Market Reviews** — Estimated total across all platforms (e.g., "96,131+")
9. **Platforms Scraped** — List of independent platforms with per-platform review counts
10. **Focus Area** (optional) — Specific lens like "Foreign Language Support", "Billing Disputes", "Mobile App Experience". Default: general Consumer Experience
11. **Competitor Names** — 2-4 direct competitors for benchmarking
12. **Industry** — Company's industry (for context-appropriate analysis)

If any input is missing and can be inferred from context, infer it. Otherwise, ask in a single batched message.

### Step 2 — Analyze the Review Data

Process the review dataset to produce the analytical content. The skill is data-driven — every claim should be backed by something in the dataset.

**Quantitative pass:**
- Average rating per platform
- Star rating distribution (1-5 star %) — flag bimodal distributions (high 1-star AND high 5-star) as a key finding
- Sentiment distribution (Positive / Mixed / Negative)
- Sentiment over time (quarterly if dataset spans 6+ months) — identify trend direction
- Note any data-integrity discrepancies (e.g., stars and AI sentiment disagree)

**Thematic pass:**
- Extract 6-10 themes by frequency
- For each theme: frequency %, severity (CRITICAL / HIGH / MEDIUM / LOW / OPPORTUNITY), confidence (HIGH / MEDIUM / LOW with n=X), automation potential (HIGH / MEDIUM / LOW)
- Sort by frequency descending
- Count themes with HIGH automation potential — surface as a callout

**Quote pass:**
- For each CRITICAL or HIGH theme, pull 2-3 representative direct quotes with attribution (name/initials, platform, date)
- Quotes should illustrate the systemic nature of the issue, not be cherry-picked

**Employee signal pass (if Glassdoor/Indeed data available):**
- Employer rating, CEO approval, top complaint themes
- Pull 3-4 employee quotes that connect to customer-facing failures

**Competitive pass:**
- Per-platform ratings comparison across [Company] + 2-3 competitors
- Portfolio/scale comparison (locations, customers, revenue, awards — whatever is industry-relevant)
- Switching signals — count reviews mentioning intent to leave or competitor names

**Perception gap pass:**
- Curated platforms (Trustpilot, BBB, Google Business — channels where reputation is managed) vs independent platforms (Reddit, app stores, news comments)
- Compute the numerical gap between the two

### Step 3 — Assemble the 12 Sections

Every report follows this exact structure. Each section is mandatory.

| # | Section | Required Elements |
|---|---------|-------------------|
| Cover | Dark-bg cover page | Logo, title (Focus Area or "Consumer Experience"), subtitle, tagline, meta block, confidential marker |
| 01 | Executive Summary | 4 stat cards, red KEY FINDING callout, amber INSIGHT callout, 3-5 sentence summary |
| 02 | Methodology | 7 subsections (2.1-2.7), Platform Breakdown table, amber methodology note |
| 03 | Quantitative Analysis | 3.1 Avg rating by platform, 3.2 Star distribution, 3.3 Sentiment distribution, 3.4 Sentiment over time |
| 04 | Thematic Analysis | Issue Frequency table (6-10 themes), green Automation Opportunity callout |
| 05 | Deep Dive — Critical Findings | One subsection per CRITICAL/HIGH theme (4-6 subsections), each with description + red/amber callout + 2-3 quotes |
| 06 | Internal Signal — Employee Sentiment | Glassdoor/Indeed ratings, amber Employee Signal callout, 3-4 employee quotes, analysis paragraph |
| 07 | Competitive Context & Benchmarking | 4 stat cards, Platform Ratings Comparison table, Portfolio Comparison table, Switching Signals, threat summary |
| 08 | Competitor Deep Dives | One subsection per competitor (typically 3), each with header + overview + 2-3 quotes + theme breakdown |
| 09 | AI Opportunity Matrix | Cross-competitor pain-point matrix table, green Automation Opportunity callout |
| 10 | The Perception Gap | 2 stat cards (curated vs independent rating), red Perception Gap callout, strategic implications |
| 11 | Strategic Recommendations | 6-8 structured recommendation tables, Implementation Priority Matrix (QUICK WINS / NEAR-TERM / STRATEGIC), green Projected Impact callout |
| 12 | Conclusion | Summary paragraph, Transformation Summary table, green PATH FORWARD callout, sign-off block |

The detailed content rules per section are in `references/PDF_TEMPLATE.md` under "Section-by-Section Content Rules" — read that section before writing each section.

### Step 4 — Render the PDF

Generate using the complete code template in `references/PDF_TEMPLATE.md`. The template includes:
- All three custom flowables (StatCard, CalloutBox, QuoteBlock)
- Both page templates (cover_page with full dark-navy bleed, normal_page with footer)
- Logo preprocessing (PIL-based transparent-bg conversion)
- Full color palette and typography definitions
- A worked example of the build pattern showing how sections are appended

**Output paths:**
1. Generate PDF to `/home/claude/consumer_intel_report.pdf` first (scratchpad)
2. Copy final to `/mnt/user-data/outputs/{company_name}_consumer_intelligence_report.pdf`
3. Present via `present_files`
4. Give a 3-4 sentence verbal summary highlighting: top finding, perception gap (if material), and the single largest AI automation opportunity

### Step 5 — Quality Pass

Before delivering, verify the checklist in `references/PDF_TEMPLATE.md` under "Quality Checklist". The big ones:
- Logo floats on dark background (no box/container around it)
- All 12 sections present in correct order
- Callout colors correctly coded (red=critical, amber=warning, green=opportunity)
- Stat cards display 4-across with left accent borders
- Footer carries {Prepared By} on every page except cover
- No hardcoded company names — every reference uses the parameterized value
- Implementation Priority Matrix has section banners (QUICK WINS / NEAR-TERM / STRATEGIC)
- Transformation Summary uses DARK_NAVY header background

---

## Design System (Quick Reference)

Full details in `references/PDF_TEMPLATE.md`. At a glance:

**Colors:**
- `DARK_NAVY` `#1A1F3D` — cover bg, primary headers
- `MEDIUM_BLUE` `#2F5496` — section headers, table headers
- `ACCENT_BLUE` `#3B7DD8` — accent lines, stat card borders, quote borders
- `LIGHT_BG` `#F5F6FA` — quote backgrounds, alternating rows
- `LIGHT_BLUE_BG` `#E8EFF8` — total rows
- `CRITICAL_RED` `#DC2626`, `WARNING_AMBER` `#F59E0B`, `OPPORTUNITY_GREEN` `#10B981` — callouts

**Typography:** Helvetica family. Section numbers 36pt bold, titles 20pt bold, body 10pt @ 15pt leading justified, table text 8.5-9pt, quotes 9.5pt italic.

**Page:** US Letter (612×792pt), margins 54pt L/R × 60pt T/B, usable width 504pt. Top accent line 3px ACCENT_BLUE, footer at y=42 with 0.5pt hairline rule above.

---

## Voice & Tone

- **Evidence-first.** Every claim ties back to the dataset. No marketing fluff, no vague generalizations.
- **Direct.** Bold the key finding. Don't bury the lede.
- **Fair.** Acknowledge competitor strengths honestly. The report is more credible when it doesn't read like a hatchet job.
- **Specific.** Exact percentages, exact quote attributions, exact dates. "Users report issues" is useless; "27% of independent-platform reviews cite billing disputes (n=412)" is gold.
- **Action-oriented.** Every finding maps to a recommendation in §11. Every recommendation maps to a metric in §12.

---

## Adapting to Different Companies

| Company Type | Emphasis | Likely Themes |
|---|---|---|
| Multi-location service (banks, gyms, salons) | Inconsistency across locations, staff turnover signal | Front-line variability, hold times, billing |
| SaaS / B2B platform | Onboarding friction, support gaps, churn signals | Implementation pain, ticket SLAs, feature gaps |
| Consumer app | Mobile UX, in-app support, app-store rating spread | Login issues, app crashes, payment friction |
| E-commerce / DTC | Fulfillment, returns, customer service responsiveness | Shipping delays, return policy disputes, sizing |
| Healthcare / insurance | Claim disputes, scheduling, member experience | Auth delays, denials, hold times |
| Auto / industrial | Service-bay experience, parts availability, warranty | Wait times, transparency, repeat repairs |

The 12-section structure stays the same; the **themes**, **competitor set**, and **focus area** adapt to the industry.

---

## White-Labeling Notes

This skill is intentionally white-labelable. The `prepared_by` parameter flows into:
- Cover page spaced-letter header: `"{PREPARED_BY} — C O N S U M E R  I N T E L L I G E N C E"`
- Cover meta block: "Prepared by: {Prepared By}"
- Footer right-aligned text on every internal page
- Sign-off block on the conclusion page

When Richard runs this for Anyreach as the analytics-partner positioning, `prepared_by = "Anyreach"`. When it's run for a BPO partner who wants to present consumer intel to their end-client, `prepared_by = "{BPO Name}"`.

---

## Edge Cases

- **Sparse data on a platform:** Note review count alongside rating. A 5-star rating on n=3 reviews is not a finding.
- **No employee data available:** Skip §6 entirely or replace with a one-paragraph note explaining the absence; do NOT pad with speculation.
- **Only one competitor known:** §07 and §08 still run, just narrower. The matrix in §09 needs at least 2 competitors to be meaningful — if only one, restructure as a head-to-head.
- **Reports without a clear focus area:** Use "Consumer Experience" as the focus and let the themes drive emphasis organically.
- **Logo missing or low quality:** Fall back to a text wordmark in white (Helvetica-Bold, 32pt) centered where the logo would have been. Do not invent a logo.
- **Curated/independent split unclear:** If you can't cleanly separate curated from independent platforms, skip §10's stat cards and write the section as a narrative on managed-reputation risk instead.
