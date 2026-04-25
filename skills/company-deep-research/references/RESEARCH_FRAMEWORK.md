# Research Framework Reference

## Source Hierarchy

When conflicting information is found, prioritize sources in this order:

1. **Call transcripts / uploaded files** — First-party insider context is the highest-value source. People reveal things in conversation they'd never put on a website.
2. **Company's own website and press releases** — Official positioning and announcements
3. **SEC filings / investor presentations** — For public companies, the most reliable financial data
4. **Analyst reports** (Gartner, Forrester, IDC) — Credible third-party validation
5. **Industry publications** (trade press, conference coverage) — Good for recent moves
6. **Business databases** (ZoomInfo, Crunchbase, PitchBook, LinkedIn) — Employee counts, funding, org charts
7. **Job postings** — Reveal tech stack, team structure, and strategic priorities
8. **Review sites** (G2, Capterra, Glassdoor) — Customer and employee sentiment
9. **Social media** (LinkedIn company page, executive posts) — Thought leadership and culture signals

## Transcript Mining Guide

When the user provides call transcripts, extract and categorize:

### People & Roles
- Every named person and their title/role
- Reporting relationships mentioned
- Decision-making authority signals ("I'll need to check with...", "that goes through John's team")

### Business Intelligence
- Revenue/size indicators ("we have 3 salespeople globally", "8,000 employees")
- Tool/platform mentions (Salesforce, Marketo, HubSpot, etc.)
- Pain points and challenges ("our biggest problem is...", "we can't convert them")
- Strategic priorities ("leads leads leads", "we're rebuilding the marketing team")

### Organizational Dynamics
- New hires and their mandates ("I was brought in to rebuild marketing")
- Internal politics ("80% of marketing tech gets rejected by security")
- Budget and resource constraints
- Competitive tools being evaluated

### Deal Context (if applicable)
- Where the deal stands (NDA, pilot, partnership discussion)
- Key stakeholders and their positions
- Objections and concerns raised
- Next steps discussed

## Search Query Patterns

### For Private Companies (revenue unknown)
```
"[Company]" revenue OR annual OR employees site:zoominfo.com
"[Company]" Crain's OR Inc. 5000 OR Deloitte fast 500
"[Company]" funding OR raised OR investment site:crunchbase.com
[Company] glassdoor reviews employees
```

### For Companies Undergoing Transformation
```
"[Company]" rebrand OR restructuring OR reorganization
"[Company]" new CEO OR new CMO OR new CTO appointment
"[Company]" AI strategy OR digital transformation
"[Company]" layoffs OR hiring OR expansion
```

### For Understanding GTM Maturity
```
"[Company]" conference OR event OR speaking OR sponsor
"[Company]" case study OR customer story OR testimonial
"[Company]" webinar OR podcast OR blog OR newsletter
site:[company-url] blog OR resources OR insights
[Company] marketing director OR demand generation site:linkedin.com
```

### For Competitive Positioning
```
"[Company]" vs "[Competitor]"
"[Company]" alternative OR competitors site:g2.com
"[Company]" Gartner magic quadrant OR Forrester wave
"[Company]" market share OR market position
```

## Section-Specific Research Depth

| Section | Min Searches | Key Sources | Output |
|---------|-------------|-------------|--------|
| Company Overview | 3-5 | Website, press, databases | Origin story, snapshot table |
| Division Breakdown | 2-4 per division | Division websites, press releases | Deep dive per division |
| GTM Strategy | 4-6 | LinkedIn, job posts, conferences, press | Maturity assessment |
| Competitive Landscape | 3-5 per division | G2, analyst reports, comparison sites | Competitor table per division |
| Key Personnel | 2-4 | LinkedIn, press releases, company website | Personnel table |
| Recent Moves | 2-4 | News, press releases, social | Strategic implications |

## Writing Guidelines

- **Be analytical, not promotional.** This is intelligence, not marketing copy.
- **Quantify wherever possible.** "~8,000 employees across 6 countries" beats "a large global company."
- **Name names.** "Led by Vladimir Sterescu (promoted January 2025)" beats "led by experienced leadership."
- **Be honest about gaps.** "Revenue estimates range widely ($300M–$600M) and are unverifiable for this private company" is better than picking one number.
- **Weave transcript insights throughout.** Don't create a "what we learned from the call" section. Instead, enrich each section with insider context naturally. For example, in the GTM section, reference what the marketing leader said about their challenges.
- **End with honest challenges.** Every company has them. A report that's all positive is not credible.
