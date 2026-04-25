---
name: competitor-deep-dive
description: >
  Generate a competitive analysis PDF from any competitor website URL. Deep research across user reviews, employee sentiment, technical capabilities, pricing, and market position — produces a branded Anyreach white paper. Trigger on: "analyze [company]", "deep dive on [URL]", "competitive report", "battle card", "what do users say about [company]", "research [competitor]", "pull everything on [company]", or any request to investigate a competitor in AI voice, conversational AI, contact center, CX, or BPO. Also triggers for updating existing competitor analyses. Do NOT use for Anyreach internal analysis.
---

# Competitor Deep Dive Analysis

Generate a comprehensive, evidence-based competitive analysis PDF from a competitor's website URL. The output is a branded Anyreach white paper suitable for sharing with prospects, partners, investors, and internal teams.

---

## Prerequisites

- A competitor website URL (or company name — Claude will find the URL)
- Web search + web_fetch tools for research
- reportlab for PDF generation (`pip install reportlab --break-system-packages`)

---

## Workflow

### Step 0 — Read the PDF Template

**Before doing anything else**, read `references/PDF_TEMPLATE.md` in this skill directory. It contains the complete PDF generation code, color system, custom flowables, and page structure. You will need this for the final output.

Also read `references/RESEARCH_FRAMEWORK.md` for the detailed research methodology and source hierarchy.

### Step 1 — Identify the Competitor

From the URL or company name provided:
1. Fetch the competitor's homepage with `web_fetch`
2. Extract: company name, tagline, positioning, product category, target market
3. Fetch 1-2 additional pages: `/about`, `/pricing`, `/product`, `/platform`, `/solutions`
4. Note their claimed capabilities, language, and brand positioning

### Step 2 — Deep Research (8-15 searches)

Execute research across ALL of these categories. This is the core of the analysis — be thorough. Use `web_search` and `web_fetch` to gather evidence.

**CRITICAL: Every claim in the report must be backed by a specific, named source. No unsourced assertions.**

#### 2a. User Reviews & Ratings (3-4 searches)
```
"[Company]" site:g2.com reviews
"[Company]" site:gartner.com peer-insights
"[Company]" site:trustradius.com
"[Company]" site:capterra.com reviews
```
Extract: overall rating, number of reviews, rating distribution (look for suspicious patterns like zero low-star reviews), most common complaints, most praised features. Look for "Vendor Referred" or incentivized review tags.

#### 2b. Employee Sentiment (1-2 searches)
```
"[Company]" site:glassdoor.com reviews
"[Company]" glassdoor rating CEO approval
```
Extract: overall rating, CEO approval, recommend to friend %, top complaints (culture, work-life balance, management). Employee sentiment often reveals operational dysfunction that affects product quality.

#### 2c. Technical Capabilities & Limitations (2-3 searches)
```
"[Company]" voice AI limitations OR issues OR problems
"[Company]" technical review OR benchmark OR comparison
"[Company]" site:github.com issues OR bugs
"[Company]" site:reddit.com
```
Extract: documented bugs, performance benchmarks, architectural limitations, developer complaints, integration issues.

#### 2d. Pricing & Business Model (1-2 searches)
```
"[Company]" pricing 2025 2026
"[Company]" cost OR pricing OR contract OR enterprise
```
Extract: published pricing, hidden costs, contract terms, minimum commitments, total cost of ownership.

#### 2e. Market Position & Analyst Coverage (1-2 searches)
```
"[Company]" Gartner Magic Quadrant 2024 2025
"[Company]" Forrester Wave OR IDC OR analyst
"[Company]" funding OR valuation OR revenue OR layoffs
```
Extract: analyst positioning, funding history, growth trajectory, any layoffs or restructuring.

#### 2f. Production Deployments & Customer Feedback (1-2 searches)
```
"[Company]" case study OR customer OR deployment
"[Company]" site:reddit.com OR site:community.* feedback
```
Extract: named customers, deployment scale, reported success/failure rates, customer churn signals.

#### 2g. Direct Comparison to Anyreach (1 search)
```
"[Company]" vs "Anyreach" OR "[Company]" alternative
```
Extract: any existing comparisons, competitive positioning, feature gaps.

### Step 3 — Synthesize Findings

Organize all research into these sections:

1. **Company Overview** — What they do, who they serve, their positioning
2. **What They Claim vs. What Users Say** — Marketing claims mapped against actual user feedback
3. **The Good** — Genuine strengths with evidence (be fair and honest)
4. **The Bad** — Weaknesses, limitations, production issues with evidence
5. **Review Authenticity Analysis** — Rating distributions, incentivized reviews, suspicious patterns
6. **Employee Perspective** — Glassdoor data as a signal of operational health
7. **Technical Assessment** — Architecture, performance, documented limitations
8. **Pricing Reality** — Published vs. true cost
9. **Competitive Comparison** — Side-by-side with Anyreach across key dimensions
10. **Conclusion** — Evidence-based verdict

### Step 4 — Determine Report Format

Based on the type of competitor, choose the appropriate format:

**Format A: Deep Investigative Report** (default for most competitors)
- Use when: The competitor has enough public data for a thorough investigation
- Style: Long-form editorial with inline source citations, bold key findings, section dividers
- Best for: Kore.ai, SoundHound, Avaamo-type companies with lots of public evidence
- Pages: 6-12 pages

**Format B: Head-to-Head Comparison Report** (use when live testing data exists)
- Use when: We have actual test session data (voice recordings, chat transcripts, latency measurements)
- Style: Structured scorecards, dimension-by-dimension tables, metric comparisons
- Best for: Companies where we've done live A/B testing (like Crescendo, Nova Sonic)
- Pages: 10-17 pages
- NOTE: Only use this format if the user provides test session data alongside the URL

**Default to Format A** unless test data is provided.

### Step 5 — Generate the PDF

Read `references/PDF_TEMPLATE.md` and use the complete PDF generation code. The template includes:
- Anyreach brand colors and typography
- Cover page with competitor name and date
- Section headers with colored bars
- Source citation formatting
- Comparison tables with Anyreach brand styling
- Conclusion page with key verdict

**Source Citation Rules:**
- Every factual claim must have an inline source tag: **(G2)**, **(Glassdoor)**, **(Gartner)**, **(Reddit)**, **(TechCrunch)**, etc.
- Use the rounded-pill citation style from the Kore.ai report format
- Bold key statistics and findings
- Use italics for direct quotes (kept short, paraphrased when possible)

### Step 6 — Output

1. Generate PDF to `/home/claude/competitor_analysis.pdf`
2. Copy to `/mnt/user-data/outputs/[competitor-name]_deep_dive.pdf`
3. Present the file using `present_files`
4. Give a 3-4 sentence verbal summary of the most important findings

---

## Quality Standards

### What makes a GOOD competitive analysis:
- **Evidence-based**: Every claim has a named source
- **Fair**: Acknowledges genuine competitor strengths honestly
- **Specific**: Exact numbers, quotes, dates — not vague generalizations
- **Actionable**: Prospects can use this to make informed decisions
- **Current**: Prioritizes 2025-2026 data over older information

### What makes a BAD competitive analysis:
- Marketing fluff without evidence
- One-sided attack piece with no acknowledgment of strengths
- Vague claims like "users report issues" without specifics
- Outdated information presented as current
- Unsourced statistics

### The Anyreach Voice in These Reports:
- **Confident but fair** — We acknowledge where competitors are strong
- **Evidence-first** — Let the data speak; don't editorialize excessively
- **Direct** — Bold key findings, don't bury the lede
- **Investigative tone** — "What users actually say" vs. "what marketing claims"

---

## Adapting to Different Competitor Types

| Competitor Type | Research Focus | Key Dimensions |
|----------------|---------------|----------------|
| Voice AI platform (Parloa, ASAPP, PolyAI) | Voice quality, latency, language support, telephony | TTFA, barge-in, session limits, echo cancellation |
| Conversational AI (Kore.ai, Yellow.ai, Cognigy) | NLU accuracy, channel coverage, ease of use, pricing | Answer accuracy, learning curve, deployment time |
| Contact center AI (Five9, NICE, Genesys) | Integration depth, analytics, workforce management | TCO, migration complexity, lock-in |
| BPO + AI (Crescendo, Laivly, Replicant) | Task completion, human escalation, cost per resolution | Agentic capability, channel consistency, pricing |
| Cloud provider AI (AWS Nova Sonic, Google CCAI) | Raw model capability vs. platform readiness, ecosystem lock-in | Build vs. buy, hidden infrastructure costs |
| Startup competitor (Blue Machines, Retell) | Product maturity, funding, team, customer base | Production readiness, enterprise features, scale |

---

## Edge Cases

- **Company has very little public data**: Focus more on website claims analysis, any press/funding coverage, and note the lack of independent validation as itself a finding.
- **Company is a cloud provider (AWS, Google, Azure)**: Frame as "model vs. platform" — they provide ingredients, Anyreach provides the meal. Focus on total cost of ownership and time-to-production.
- **Company is much larger (Five9, NICE, Genesys)**: Frame as "legacy vs. AI-native" — they're bolt-on AI onto existing infrastructure, Anyreach is AI-first.
- **Company is a direct startup competitor**: Frame as feature depth + production readiness. Be especially fair since they're in a similar position.
- **User provides additional context (deal they're competing in, specific prospect concerns)**: Tailor the emphasis of the report to address those concerns directly.
