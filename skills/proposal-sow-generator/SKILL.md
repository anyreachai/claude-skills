---
name: proposal-sow-generator
description: Generate a professional Proposal and Statement of Work (SoW) PDF from a sales call transcript, plus an integration flowchart visual. Use this skill whenever the user provides a transcript (or references a past call) and asks to create a proposal, SoW, statement of work, scope of work, project proposal, pilot proposal, or engagement letter. Also trigger on phrases like "generate a proposal for [company]", "create the SoW", "write up the proposal from that call", "turn this transcript into a proposal", "draft the SoW for [prospect]", "build the proposal doc", "scope this out", or "put together the pilot agreement". Trigger even for partial requests like "draft the commercial terms" or "write up the scope" since the full SoW framework produces the best output. Do NOT use for simple call summaries or recaps — only for formal proposal/SoW document generation.
---

# Proposal & Statement of Work Generator

This skill analyzes a sales call transcript and produces two outputs:
1. **A branded PDF Proposal & SoW** with cover page, background, objectives, scope, integration spec, risks, RACI, timeline, commercial terms, and signature block
2. **An integration flowchart visual** (color-coded process map) rendered inline via the Visualizer

## Prerequisites

- A sales call transcript (uploaded file, pasted text, or document in context)
- PDF generation via reportlab (`pip install reportlab --break-system-packages` if needed)
- Read `references/PDF_TEMPLATE.md` for exact PDF generation code and styling

## Workflow

When the user provides a transcript and asks for a proposal or SoW:

1. Read the transcript carefully, identifying all participants, their roles, the company, and the use case
2. Read `references/PDF_TEMPLATE.md` for the PDF generation code and styling
3. Extract and synthesize information using the Analysis Framework below
4. Generate the PDF
5. Generate the integration flowchart visual using the Visualizer (call `visualize:read_me` with `["diagram"]` module, then `visualize:show_widget`)
6. Present the PDF file and give a concise verbal summary

## Analysis Framework

### Step 1: Extract Core Metadata

From the transcript, determine:

| Field | Description |
|-------|-------------|
| **Company Name** | The prospect's company name |
| **Use Case** | Primary use case being discussed (e.g., "Inbound Customer Support Automation") |
| **Decision Maker** | Name, title, email of the person with budget authority |
| **Stakeholders** | All participants — names, titles, roles (Decision Maker, Influencer, Technical Lead, End User) |
| **Company Size / Stage** | Revenue stage, employee count, industry — used for pricing calibration |
| **Platforms / Tools Mentioned** | CRM, telephony, ticketing, databases, APIs referenced in the call |

### Step 2: Build Each SoW Section

#### 2A — Cover Page
```
Proposal: Anyreach × {{Company Name}} — {{Use Case}}
Prepared for: {{Company Name}}
Prepared by: Anyreach, Inc.
Date: {{Today's date}}
```

#### 2B — Introduction & Background

Synthesize from the transcript:
- **Company background**: What does the prospect do? Industry, size, customer base
- **Stakeholders**: Who was on the call, their roles, and decision-making authority
- **High-level objectives**: What are they trying to achieve? Why now?
- **Current state**: How are they handling this today? What's broken?
- **Key metrics**: Any numbers mentioned — call volume, handle time, CSAT, cost per interaction, headcount
- **Use case summary**: 2-3 sentences describing the proposed automation scope

Write this as flowing prose, not bullet points. It should read like a consultant's executive briefing.

#### 2C — Objectives

Split into:
- **Primary Goals** (must-haves): Quantitative targets mentioned or implied — e.g., "Reduce average handle time by 30%", "Automate 60% of Tier 1 inquiries"
- **Secondary Goals** (nice-to-haves): Qualitative outcomes — e.g., "Improve agent satisfaction", "Gain visibility into call drivers"

For each objective, provide:
- The objective statement
- The success metric (how we'll measure it)
- The baseline (current state, if mentioned)
- The target (what success looks like)

If specific numbers weren't mentioned, infer reasonable targets based on industry benchmarks and flag them as "Anyreach-recommended targets pending client confirmation."

#### 2D — Scope & Deliverables

Provide 4-8 deliverables as titled items with 1-2 sentence descriptions. Common deliverables:
- Agent Design & Prompt Engineering
- Voice / Chat Agent Build & Configuration
- Integration Development (specify systems)
- Knowledge Base Curation & Ingestion
- Testing & QA (unit, integration, UAT)
- Training & Enablement
- Go-Live Support & Monitoring
- Post-Pilot Performance Report

Tailor to what was actually discussed. Don't pad with irrelevant deliverables.

#### 2E — Integration & Data Schema

This is the most technical section. Based on the prospect's mentioned workflow, platforms, and use case:

1. **System Architecture**: List every system that touches the workflow (CRM, telephony, ticketing, knowledge base, data warehouse, etc.)
2. **Data Flows**: For each integration point, specify:
   - Source system → Destination system
   - Data elements that flow (e.g., caller ID, account number, ticket status)
   - Direction (read, write, bidirectional)
   - Protocol / method (API, webhook, SFTP, database query)
3. **Schema Outline**: For the core data objects, provide field-level detail:
   - Field name, type, source, required/optional
4. **Authentication & Access**: What credentials / access will be needed from the prospect

If specifics weren't discussed, document assumptions clearly and flag as "to be confirmed during discovery."

#### 2F — Key Risks & Assumptions

Identify 5-8 risks/assumptions organized as:

| Category | Risk / Assumption | Mitigation / Next Step |
|----------|-------------------|------------------------|

Categories: Technical, Data, Process, Timeline, Compliance, Change Management

Focus on edge cases that haven't been answered yet — things like:
- "Assumes API access to [system] is available; to be confirmed"
- "Fallback handling for [edge case] not yet defined"
- "Compliance review for [regulation] required before go-live"

These won't be fully accurate until discovery, but they demonstrate we're thinking ahead.

#### 2G — Roles & Responsibilities

Create a RACI-style table with two columns: **Anyreach** and **{{Company Name}}**

For each side, list:
- **Project Lead / DRI**: Name (if known from transcript), responsibilities, estimated time commitment
- **Technical Lead**: Responsibilities, estimated hours/week
- **Executive Sponsor**: Responsibilities, cadence of check-ins
- **Subject Matter Experts**: Who from the prospect's side needs to be available and for what

Estimate time commitments realistically:
- Anyreach side: Full-time engineering, part-time PM/solutions
- Prospect side: Usually 2-5 hrs/week for technical lead, 1 hr/week for exec sponsor, ad-hoc for SMEs

#### 2H — Timeline & Milestones

Create a phased timeline (typically 4-8 weeks for a pilot):

| Phase | Duration | Key Activities | Milestone / Gate |
|-------|----------|----------------|------------------|

Common phases:
1. **Discovery & Design** (Week 1-2): Requirements deep-dive, integration mapping, agent design
2. **Build & Integrate** (Week 2-4): Agent development, integration build, knowledge base setup
3. **Test & Validate** (Week 4-5): QA, UAT, stakeholder review
4. **Pilot Launch** (Week 5-6): Controlled go-live, monitoring, iteration
5. **Evaluation & Report** (Week 6-8): Performance analysis, recommendation for full deployment

Adjust durations based on complexity discussed in the call.

#### 2I — Commercial Terms

This is a **pilot engagement** with the following structure:

**Pricing Determination Logic:**
1. Estimate Anyreach resource cost: (engineering hours × rate) + (PM hours × rate) + (solutions hours × rate)
2. Consider prospect's company size and stage (startup = lower end, enterprise = higher end)
3. Consider complexity: number of integrations, channels, edge cases
4. Consider strategic value: is this a logo that opens a vertical? Price for relationship.
5. Range: **$5,000 — $100,000** for a pilot

**Payment Terms:**
- 50/50 split: First half paid upfront upon SoW execution, second half upon project completion
- One-time pilot fee (not recurring)
- Pilot duration: as defined in timeline

**What's Included vs. Excluded:**
- Included: Everything in scope section
- Excluded: Ongoing production support post-pilot, additional channels/use cases beyond scope, infrastructure costs on prospect's side

**Path to Production:**
- Brief statement that successful pilot leads to a production agreement with recurring pricing based on volume/usage

#### 2J — Signature Block

```
AGREED AND ACCEPTED:

Anyreach, Inc.
Richard Lin, CEO
richard@anyreach.ai
Signature: ____________________  Date: ____________

{{Company Name}}
{{Decision Maker Name}}, {{Title}}
{{Email}}
Signature: ____________________  Date: ____________
```

### Step 3: Generate the PDF

Follow `references/PDF_TEMPLATE.md` exactly for:
- Anyreach brand colors, typography, and layout
- Cover page with pink accent bar
- Section headers with colored bars
- Tables with proper cell wrapping (ALL cells must be Paragraph objects)
- Professional footer on each page

Output: `/home/claude/proposal_sow.pdf` → copy to `/mnt/user-data/outputs/proposal_sow.pdf`

### Step 4: Generate Integration Flowchart

After producing the PDF, generate an integration/process flowchart visual:

1. Call `visualize:read_me` with `["diagram"]` module
2. Based on the **Integration & Data Schema** section (2E), create a color-coded flowchart showing:
   - All systems involved (boxes)
   - Data flows between them (arrows with labels)
   - The AI agent at the center
   - Color coding by system type:
     - **Indigo (#5B5FC7)**: Anyreach AI Agent
     - **Green (#10B981)**: Customer-facing channels (phone, chat, email)
     - **Cyan (#06B6D4)**: Backend systems (CRM, ticketing, database)
     - **Amber (#F59E0B)**: Data/analytics
     - **Pink (#EC4899)**: Human escalation / agent handoff
3. Include as much detail as possible from the transcript while maintaining readability
4. Use the `visualize:show_widget` tool to render inline

## Output Checklist

- [ ] PDF generated with all 10 sections
- [ ] Cover page has correct company name, use case, and today's date
- [ ] Integration flowchart rendered inline via Visualizer
- [ ] File presented via `present_files`
- [ ] Concise verbal summary (3-4 sentences) of the proposal highlights — don't repeat the entire document
