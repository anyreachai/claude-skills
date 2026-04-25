---
name: company-deep-research
description: >
  Deep research any company and produce a professionally designed .docx report covering overview, history, divisions, GTM strategy, competitive landscape, key personnel, and strategic challenges. Trigger on: "deep research on [company]", "research [company] business", "GTM analysis", "understand their go-to-market", "company deep dive", "tell me everything about [company]", or any request to understand a company's business structure, divisions, sales motion, or competitive positioning. Also trigger when user provides company URLs and asks to understand their business or GTM. Use even for partial requests like "what's their GTM" since the full framework produces the best output. Do NOT use for individual stakeholder research (use stakeholder-intel) or competitor battle cards (use competitor-deep-dive).
---

# Company Deep Research & GTM Analysis

Generate a comprehensive, evidence-based deep research report on any company, delivered as a professionally designed Word document (.docx). The output covers company overview, history, division breakdown, go-to-market strategy, competitive landscape, key personnel, and strategic implications.

---

## Prerequisites

- Company name and/or website URL(s)
- Optional: call transcripts, internal notes, or uploaded files with context
- Web search + web_fetch tools for research
- `npm install -g docx` for Word document generation
- Read the docx skill at `/mnt/skills/public/docx/SKILL.md` for validation steps

---

## Workflow

### Step 0 — Read References

Before doing anything else, read these reference files in this skill directory:

1. `references/RESEARCH_FRAMEWORK.md` — The complete research methodology, search patterns, and section structure
2. `references/DOCX_TEMPLATE.md` — The complete docx-js code template, color system, helper functions, and document structure

### Step 1 — Identify the Target & Gather Context

Extract from the user's request:
- **Company name** and **website URL(s)** (primary site + any division/brand sites)
- **Any uploaded transcripts or files** — read these first, they contain insider context that public research won't surface (pricing discussions, internal challenges, org politics, deal status)
- **Specific focus areas** the user cares about (e.g., "focus on their BPO division" or "understand their GTM")

If the user provides transcripts, extract every named person, their role, what they said about the business, internal challenges mentioned, tools/platforms referenced, and competitive dynamics discussed. This insider context is gold — weave it throughout the research sections rather than isolating it.

### Step 2 — Deep Web Research (15-30 searches)

Execute research across ALL of these categories. Scale tool calls to complexity — a simple single-division company may need 15 searches, a multi-division conglomerate may need 30+. The quality of the report depends on thorough, multi-angle research.

**Every claim in the report must be backed by evidence. No unsourced assertions.**

#### 2a. Company Overview & History (3-5 searches)
```
[Company] founded history overview
[Company] CEO founder story
[Company] acquisitions timeline
[Company] revenue employees size
[Company] headquarters locations offices
```
Extract: founding story, key milestones, acquisitions, geographic expansion, revenue/employee estimates, ownership structure (public/private/PE-backed), funding history.

#### 2b. Division / Business Unit Breakdown (2-4 searches per division)
```
[Division/Brand name] products services
[Division/Brand name] customers case studies
[Division/Brand name] competitors alternatives
site:[company-url] about solutions services
```
For each division: what they sell, who they sell to (ICP), key customers, competitive positioning, recent product launches. Fetch the actual division websites to understand messaging and positioning.

#### 2c. Go-to-Market Strategy (4-6 searches)
```
[Company] marketing team leadership CMO
[Company] conference events speaking
[Company] case studies customer stories
[Company] press releases news 2025 2026
[Company] LinkedIn company page
[Company] sales team structure
```
Extract: marketing leadership and tenure, conference strategy, content marketing maturity, sales team size and structure, channel strategy (direct vs. partner), digital presence quality, tech stack (look for Marketo, HubSpot, Salesforce mentions in job postings or press).

#### 2d. Competitive Landscape (3-5 searches)
```
[Company] competitors alternatives comparison
[Company] vs [Competitor] review
[Company] market position industry ranking
[Company] Gartner Forrester IDC analyst
```
For each division, identify 3-7 direct competitors. Understand where the company sits in the market (leader, challenger, niche player). Note any analyst recognition (Gartner MQ, Forrester Wave, IDC MarketScape).

#### 2e. Recent Strategic Moves (2-4 searches)
```
[Company] news announcements 2025 2026
[Company] partnership acquisition investment
[Company] AI strategy artificial intelligence
[Company] restructuring reorganization rebrand
```
Extract: recent rebranding, new hires, AI initiatives, partnerships, M&A, geographic expansion.

#### 2f. Key Personnel (2-4 searches)
```
[Company] leadership team executive
[Company] [specific name] LinkedIn role
[Company] new hire appointment announcement
```
Build a personnel table: name, title, tenure, background, relevance. Cross-reference with any transcript data.

### Step 3 — Synthesize & Structure

Organize all research into these sections (adapt based on company complexity):

1. **Executive Summary** — 2-3 paragraphs capturing the essential story: what the company is, what's happening now, and what matters strategically
2. **Company Overview & History** — Origin story, milestones, acquisitions timeline table, company snapshot (HQ, employees, revenue, ownership, tech stack)
3. **Corporate Structure** — Division/brand breakdown with table (entity, brand, focus, leadership). Only if multi-division.
4. **Division Deep Dives** — One section per major division covering: what they do, platform/product capabilities, notable customers, competitive landscape
5. **Go-to-Market Analysis** — Marketing leadership, team maturity, conference strategy, digital presence, sales team structure, marketing tech stack, maturity assessment
6. **Key Personnel** — Table with name, role, key background
7. **Challenges & Strategic Implications** — Honest assessment of headwinds: sales bottlenecks, marketing gaps, competitive threats, transition risks
8. **Conclusion** — What to watch, key signals, overall assessment

For simpler companies (single division, straightforward GTM), collapse sections. For complex multi-division enterprises, expand with more division deep dives.

### Step 4 — Generate the Word Document

Read `references/DOCX_TEMPLATE.md` and use it as the code template. The template provides:
- Color system (navy headers, blue accents, light backgrounds)
- Helper functions (heading, para, bold, kvTable, dataTable, divider, spacer)
- Cover page structure
- Table of Contents setup
- Section formatting patterns
- Header/footer with page numbers

Adapt the template content to the specific company. Key rules:
- Use data tables (with alternating row shading) for structured information like acquisitions, divisions, personnel
- Use key-value tables (colored label column) for company snapshots
- Use bullet lists (proper LevelFormat.BULLET, never unicode) for capability lists
- Use dividers between major sections
- Use page breaks before major new topics
- Keep prose analytical and evidence-based — no fluff

After generating, validate:
```bash
python /mnt/skills/public/docx/scripts/office/validate.py output.docx
```

Copy to `/mnt/user-data/outputs/` and present with `present_files`.

---

## Quality Checklist

Before presenting the final document:
- [ ] Every division has its own deep dive section with competitive landscape
- [ ] Personnel table includes all key leaders with backgrounds
- [ ] GTM section assesses marketing maturity honestly (not just listing tools)
- [ ] Challenges section is candid, not just positive spin
- [ ] Data tables use alternating row shading for readability
- [ ] Cover page has company name, subtitle, date, classification
- [ ] Table of Contents is included
- [ ] Document validates without errors
- [ ] Transcript insights (if provided) are woven throughout, not siloed
