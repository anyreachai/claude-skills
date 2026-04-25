---
name: maturity-assessment
description: Generate an operational maturity assessment dashboard (.jsx) that benchmarks Anyreach's enterprise readiness across key domains, combining quantitative metrics with qualitative analysis. Use this skill whenever Richard asks to assess, benchmark, audit, or score Anyreach's operational maturity, enterprise readiness, process maturity, or SOP coverage. Also trigger on phrases like "how are we doing operationally", "are we enterprise-ready", "grade our processes", "how mature are our ops", "pound for pound assessment", "maturity dashboard", "benchmark our SOPs", "how do we stack up", or any request to evaluate Anyreach's operational sophistication relative to funding stage. Trigger even for partial requests like "score our contract process" or "how's our compliance posture" since the full cross-domain assessment produces the most useful output. This skill should also trigger when Richard uploads SOP documents and asks for an assessment or analysis of operational readiness.
---

# Operational Maturity Assessment Dashboard

This skill produces a branded React (.jsx) dashboard that benchmarks Anyreach's operational maturity across domains, plotting each against typical startup funding stages (Pre-Seed → Series C+).

## When to Use

- Richard asks to assess operational maturity, enterprise readiness, or process sophistication
- SOP documents are uploaded with a request to evaluate or benchmark
- Any request to visualize or score Anyreach's operational posture
- Requests to compare Anyreach's process maturity against funding stage norms

## Workflow

### Step 1: Gather Context

Collect information from three sources. **Do not skip any source.**

1. **Uploaded SOPs / Documents**: Read all uploaded `.docx` files using the docx Python library. Extract: document title, version, date, owner, scope, number of steps/sections, key metrics or SLAs mentioned, roles defined.

2. **Conversation History**: Use `conversation_search` to find context on:
   - Active deals and their stages (search: "deal pipeline enterprise")
   - Contract negotiations and outcomes (search: "MSA contract redlines")
   - Compliance and security posture (search: "SOC 2 compliance infosec")
   - Product launches and capabilities (search: "product launch feature")
   - Team size, funding, runway (search: "funding runway MRR")

3. **Memory / userMemories**: Pull company context, deal status, team composition, and any other relevant background already in context.

### Step 2: Score Domains

Evaluate each domain on a 1–5 scale mapped to funding stages:

| Score | Stage Equivalent | Meaning |
|-------|-----------------|---------|
| 1 | Pre-Seed | Ad hoc, founder-dependent, undocumented |
| 2 | Seed | Partially documented, still founder-led |
| 3 | Series A | Formalized SOPs, repeatable, some delegation |
| 4 | Series B | Battle-tested, codified from real negotiations, institutional knowledge |
| 5 | Series C+ | Fully delegated, team-executable, continuously improved |

**Standard domains to assess** (add/remove based on available data):

- **Contract Negotiation**: MSA sophistication, standing rules, trap documentation, counterparty count
- **Compliance & Infosec**: Certifications, document library size, DDQ response process, audit readiness
- **Sales Operations**: Partner enablement workflow, deliverable types, automation, intake standardization
- **SLA Management**: Extraction process, risk classification, monitoring cadence, per-client tracking
- **Discovery & Proposals**: Call framework, question bank, proposal generation pipeline, SOW iteration depth
- **Organizational Scalability**: Team size vs. process load, CEO dependency, SOP freshness, delegation evidence

For each domain, produce:
- **Score** (1–5)
- **Stage equivalent** (Pre-Seed through Series C+)
- **4 quantitative proof points** (specific numbers from SOPs and deals)
- **1 qualitative paragraph** (honest assessment with comparisons to stage norms)

### Step 3: Compile Deal Pipeline

From conversation history and memory, build the active deal pipeline with:
- Deal name (client / partner)
- Current stage
- Value indicator
- Status (active / caution / early / stalled)

### Step 4: Generate Dashboard

Read the dashboard template from `references/dashboard-template.jsx`. This template contains the full React component structure, Anyreach design system colors, and interactive components.

**Customization rules:**
- Update the `DOMAINS` array with scored domains from Step 2
- Update `DEAL_PIPELINE` with current deals from Step 3
- Update header stats (SOP count, deal count, compliance docs, funding stage)
- Update the verdict section with the composite assessment
- Identify the single biggest risk and feature it in the risk callout
- All colors must use the Anyreach design system (see template constants)

### Step 5: Output

Save the `.jsx` file to `/mnt/user-data/outputs/anyreach_maturity_dashboard.jsx` and present it.

## Design System Reference

These are the Anyreach brand colors — use them for all dashboard output:

```
bg: "#0D0D1A"
surface: "#161631"
card: "#1E1E3A" / "#252550" (hover)
border: "#2A2A4A"
text: "#E8E8F0"
muted: "#8B8BA8"
indigo: "#5B5FC7"
green: "#10B981"
cyan: "#06B6D4"
amber: "#F59E0B"
pink: "#EC4899"
red: "#EF4444"
purple: "#8B5CF6"
```

Font: DM Sans (imported from Google Fonts in the component).

## Scoring Calibration Notes

Be honest. The value of this assessment is accuracy, not flattery. Specific calibration guidance:

- **Organizational Scalability** should almost always score low for a <15 person company where the CEO owns all SOPs. Don't inflate this.
- **Contract Negotiation** can score high (4+) if there are 5+ real counterparty negotiations with documented lessons learned and codified rules.
- A domain with a v1.0 SOP published this month scores lower than one with a v3+ SOP that's been iterated through real use.
- Evidence of **battle-testing** (e.g., "this rule exists because Startek tried X") is worth more than theoretical completeness.
- The composite verdict should compare Anyreach's maturity to what's typical at each funding stage, not to an ideal state.
