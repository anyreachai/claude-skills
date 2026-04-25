---
name: calls
description: "Analyze post-sales calls"
---

---
name: analyze-call
description: Analyze sales call transcripts with three modes — (1) full PDF report with sentiment tracking, engagement scoring, and seller performance, (2) inflection-point / frame-shift analysis, and (3) deep stakeholder psychoanalysis with reverse perception analysis. Trigger on "analyze this call", "score this meeting", "review this transcript", "call debrief", "post-mortem", "what went well", "give me feedback on this call". Trigger inflection-analysis on "before and after analysis", "did the money shot work", "frame shift analysis", "posture analysis", "did the frame flip", or "/inflection-analysis". Trigger psychoanalysis on "psychoanalyze", "read this person", "what's their psychology", "what makes them tick", "how do they see me", "stakeholder analysis", or "/psychoanalyze". Do NOT use for simple recaps or summary emails.
---

# Sales Call Transcript Analyzer

This skill has three modes:

1. **Full Call Analysis** (default) — Analyzes sales call transcripts and produces a branded PDF report covering sentiment analysis, buyer psychoanalysis, engagement scoring, seller performance evaluation, and strategic recommendations. Triggered by "analyze this call", "score this meeting", etc.
2. **Inflection Analysis** — Performs a surgical before-and-after analysis of a specific strategic move within a transcript, quantifying the counterpart's posture shift. Triggered by `/inflection-analysis`, "before and after analysis", "did the frame flip", etc. See the **Inflection Analysis Module** section below.
3. **Deep Psychoanalysis** — Produces narrative-form psychological profiles of each stakeholder plus a reverse analysis of how each stakeholder perceives Richard. Triggered by `/psychoanalyze`, "psychoanalyze", "read this person", "what makes them tick", "how do they see me", etc. See the **Deep Psychoanalysis Module** section below.

## Prerequisites

- A sales call transcript (uploaded file, pasted text, or document in context)
- PDF generation via reportlab (`pip install reportlab --break-system-packages` if needed)

## Quick Start

When the user provides a transcript and asks for analysis:

1. Read the transcript carefully, identifying all participants and their roles (buyers vs. sellers)
2. Read `references/PDF_TEMPLATE.md` for the exact PDF generation code and styling
3. Analyze the transcript using the framework below
4. Generate the PDF report
5. Present the file and give a concise verbal summary of the 3-4 most important findings

## Analysis Framework

### Step 1: Identify Participants

From the transcript, determine:
- **Buyers**: Names, titles/roles, decision-making authority level
- **Sellers**: Names, companies, roles in the pitch
- **Relationships**: Any pre-existing relationships, internal champions, gatekeepers

Classify each buyer as one of:
- **Decision Maker** — has budget authority or final say
- **Influencer** — shapes the decision but doesn't make it
- **Gatekeeper** — controls access/process (legal, InfoSec, procurement)
- **Champion** — internal advocate who will sell on your behalf
- **End User** — will use the product but doesn't decide

### Step 2: Map Call Phases

Break the call into sequential phases. Common phases include:
- Rapport / Small Talk
- Context Setting / History
- Vision / Pitch
- Pushback / Objections
- Live Demo
- Pricing Discussion
- Use Case Discussion
- Next Steps / Close

Estimate approximate duration for each phase. Note which seller was leading each phase.

### Step 3: Track Sentiment

For each buyer, score sentiment (1-10) at each call phase:
- **1-3**: Resistant, skeptical, shutting down
- **4-5**: Neutral, polite but disengaged
- **6-7**: Interested, asking questions, leaning in
- **8-10**: Excited, self-identifying use cases, volunteering next steps

Identify **inflection points** — moments where sentiment shifted significantly. For each, document:
- What happened (the trigger)
- The sentiment shift (e.g., "7 → 3")
- The impact on the rest of the call

### Step 4: Buyer Psychoanalysis

For each buyer, build a profile:

| Field | Description |
|-------|-------------|
| **Archetype** | A 2-3 word label (e.g., "Pragmatic Power Broker", "Institutional Navigator", "Technical Evaluator") |
| **Decision Style** | How they make decisions — data-driven, relationship-driven, consensus-seeking, etc. |
| **Trust Triggers** | What specifically built trust during the call |
| **Risk Antenna** | What they're most worried about — and whether their concerns are blockers or coaching |
| **Key Insight** | The single most important thing to know about this person for the next interaction |

Look for these behavioral signals:
- **Champion signals**: Volunteering budget, rehearsing internal pitch language, offering to schedule follow-ups
- **Coaching signals**: Warning about internal processes, naming specific people/teams to prepare for
- **Blocker signals**: Categorical statements ("this won't happen"), refusal to engage on specifics
- **Interest signals**: Questions shifting from IF to HOW, self-identifying use cases, asking about pricing

### Step 5: Score Engagement

Score the overall buyer engagement (1-10) across these dimensions:

| Dimension | What to Look For |
|-----------|-----------------|
| **Questions Asked** | Volume, depth, and specificity of buyer questions |
| **Objections Raised** | Were objections real barriers or coaching? How many? |
| **Use Cases Self-ID'd** | Did buyers independently identify applications? (Very bullish signal) |
| **Internal Championing** | Did anyone volunteer to sponsor internally, fund a test, or schedule follow-ups? |
| **Urgency Signals** | Timeline pressure, competitive mentions, "we need this now" language |
| **Next Step Commitment** | Specificity of agreed next steps — vague ("let's talk soon") vs. concrete ("meeting with marketing in 2 weeks") |

Provide evidence from the transcript for each score.

### Step 6: Evaluate Seller Performance

For each seller, score (1-10) on:

| Metric | Description |
|--------|-------------|
| **Rapport Building** | Relationship management, reading the room, creating comfort |
| **Objection Handling** | Speed and quality of response to buyer pushback |
| **Demo Execution** | Effectiveness of any live demos, wow moments, technical credibility |
| **Value Articulation** | Connecting features to buyer-specific outcomes, ROI framing |
| **Closing / Next Steps** | Securing specific commitments, locking dates, defining owners |
| **Adaptability** | Pivoting when something isn't working, reading signals, adjusting approach |

For each seller, write:
- **Strengths**: What they did well with specific examples
- **Areas for Improvement**: A table with columns: Issue | What Happened | Impact | Fix

### Step 7: Build Scorecard

Create two lists:
- **What Worked**: 5-7 things that went well, with evidence
- **What Needs Improvement**: 5-7 things that could be better, with evidence

### Step 8: Strategic Recommendations

Create prioritized next steps:
- **P0** (do within 48 hours): Time-sensitive actions that preserve momentum
- **P1** (do within 2 weeks): Important preparation for next interaction
- **P2** (do before next meeting): Nice-to-have that strengthens position

Each recommendation needs: Action, Owner, Deadline.

### Step 9: Bottom Line

One paragraph: Is this deal real? What's the biggest risk? What's the single most important thing to do next?

## PDF Generation

Read `references/PDF_TEMPLATE.md` for the complete PDF generation code including:
- Anyreach brand colors and typography
- Custom flowables (ColorBar, ScoreCard)
- Chart functions (sentiment line chart, engagement bar chart, seller comparison bars, call flow timeline)
- Standard table styling with proper text wrapping
- 5-page layout structure

### Critical PDF Rules

1. **ALL table cells must be Paragraph objects** — never plain strings. This ensures text wraps within columns.
2. **Define cell styles** (cell_style, cell_bold, cell_header_white, cell_red, cell_amber, cell_green, cell_indigo, cell_pink, cell_cyan) before building tables.
3. **Use the `P = Paragraph` shorthand** for readability.
4. **Column widths must sum to ~480** (the usable page width with 0.7in margins on letter size).
5. **Add RIGHTPADDING to all table styles** — without it, text can touch cell borders.
6. **Charts use Drawing objects** with hardcoded coordinates — adjust data points but keep the chart structure.

## Output

- Generate PDF to `/home/claude/call_analysis.pdf`
- Copy to `/mnt/user-data/outputs/call_analysis.pdf`
- Present the file using `present_files`
- Give a concise verbal summary (3-4 sentences) of the most important findings — don't repeat the entire report

## Adapting to Different Call Types

This framework works for any sales-adjacent meeting. Adjust terminology as needed:

| Call Type | Buyer = | Seller = | Focus |
|-----------|---------|----------|-------|
| Sales demo | Prospect | Sales team | Conversion signals |
| Partnership meeting | Partner org | Your team | Alignment signals |
| Investor pitch | Investor | Founders | Conviction signals |
| Customer success | Existing customer | CS team | Retention/expansion signals |
| Internal stakeholder | Executive sponsor | Project team | Approval signals |

---

## Inflection Analysis Module

**Name:** `inflection-analysis`

This module performs a focused before-and-after analysis of a specific strategic move within a call transcript. It isolates a single inflection point and quantifies the counterpart's posture shift. Use this module when the user says `/inflection-analysis`, "before and after analysis", "did the money shot work", "frame shift analysis", "posture analysis", "inflection point analysis", "did the frame flip", or "narrative shift analysis".

This is **not** a general call review — it is a surgical debrief of frame control and narrative shifts.

### Workflow

#### STEP 1: Ingest the Transcript

Ask for the timestamped transcript (paste, file, or URL). **Reject if no timestamps** — timestamps are required for this analysis. If the user pastes without timestamps, ask them to re-export with timestamps enabled.

#### STEP 2: Chapter the Call

Break the transcript into natural chapters with timestamp ranges:

```
1. [0:00 – 4:30]  — Introductions and rapport building
2. [4:30 – 12:15] — Counterpart establishes their position and leverage
3. [12:15 – 18:40] — Discovery / information exchange
4. [18:40 – 22:10] — Strategic move / frame flip
5. [22:10 – 35:00] — Aftermath and negotiation
...
```

Then ask: **"Which chapters do you want included in the Before & After analysis?"**

#### STEP 3: Identify the Goal

Ask: **"What was the goal you were trying to achieve with your strategic move?"**

Example goals:
- "Flip the power dynamic so they stop acting like the gatekeeper"
- "Get them to offer resources/investment instead of just asking for free work"
- "Create urgency so they stop slow-playing the deal"

#### STEP 4: Produce the Analysis

Structure the output with these five sections:

**1. The Inflection Point**

`~[TIMESTAMP]` — Exact quote of what Richard said/did. One sentence explaining why this was the pivotal moment.

**2. BEFORE: [Counterpart Name]'s Posture**

- Dominant frame in one sentence (e.g., "Treating the conversation as a vendor evaluation where they hold all the leverage")
- 5–10 timestamped quotes with power-dynamic interpretations for each
- End with a quantified ratio: self-serving vs. value-offering statements

Example format:
```
[4:32] "We'd need to see a full POC before we commit anything."
→ Gatekeeper posture. Demands free work without reciprocal commitment.

[7:15] "Our team is really busy right now, so timing is tricky."
→ Manufactured scarcity. Creates asymmetric urgency.

Self-serving : Value-offering ratio — 8:1
```

**3. AFTER: [Counterpart Name]'s Posture**

- New dominant frame in one sentence (e.g., "Positioning themselves as a collaborative partner seeking mutual alignment")
- 5–10 timestamped quotes showing the contrast
- Prioritize quotes that show: requesting inclusion, expressing vulnerability, offering tangible value, accommodating language

Example format:
```
[23:05] "What if we allocated two engineers from our side to help with integration?"
→ Offering tangible resources. Investing their own capital into the partnership.

[26:40] "I don't want you to feel like we're not serious about this."
→ Vulnerability / reassurance. Protecting the relationship.

Self-serving : Value-offering ratio — 2:5
```

**4. Quantified Shift Table**

| Metric | Before | After |
|--------|--------|-------|
| "Here's my problem, solve it" statements | ~count | ~count |
| "Here's what I can do for you" statements | ~count | ~count |
| Acknowledges Richard's risk/needs | count | count |
| Offers something tangible | count | count (list them) |
| Expresses vulnerability/dependence | count | count |
| Accommodating language | count | count |
| Name-drops for own status | count | count |
| Name-drops as value offering | count | count |

**5. Verdict**

Did it achieve the goal? **Yes / No / Partially.**

Single biggest evidence point supporting the verdict.

End with:

> The frame flipped from "[before dominant frame]" to "[after dominant frame]."

### Analysis Principles

- **Quote-driven** — every claim backed by exact quote + timestamp
- **Contrast is everything** — always make the DELTA explicit between before and after
- **Interpret subtext** — what the quote REVEALS about power dynamics, not just what it says
- **Quantify the shift** — count patterns, calculate ratios, fill the table with real numbers
- **No generic call analysis** — this is about frame control and narrative shifts, not "objection handling" or "rapport building"
- **Be direct** — write like debriefing a founder who wants the truth, not a coaching session

### Output Format

This module produces its analysis as inline text in the conversation (not a PDF). It is interactive — Steps 1–3 are conversational prompts, and Step 4 is the deliverable. If the user wants the analysis in PDF format, use the PDF template from `references/PDF_TEMPLATE.md` with the same Anyreach branding.

---

## Deep Psychoanalysis Module

**Name:** `psychoanalyze`

This module produces two analyses per stakeholder: a deep psychological profile of the stakeholder, and a reverse analysis of how that stakeholder perceives Richard. Use this module when the user says `/psychoanalyze`, "psychoanalyze", "read this person", "what's their psychology", "what makes them tick", "how do they see me", or "stakeholder analysis".

This is **not** a scorecard or a sales methodology framework. It's a raw, narrative-form psychological read — the kind a world-class executive coach or hostage negotiator would give in private.

### Inputs Required

Before producing the analysis, gather or confirm these inputs (some may already be in context):

1. **Communications** — call transcript, text messages, emails, or any interaction record
2. **Stakeholder background** — role, company, career history, what they want from the deal
3. **Relationship context** — how long you've been working together, what's happened so far, where things stand
4. **Deal dynamics** — what's being negotiated, what's at stake for each side, power dynamics or political considerations

If the user provides a transcript but not the background context, ask for it. If they say "you have enough," proceed with what's available but note the gaps.

### Output Structure

For **each stakeholder** identified in the communications, produce both analyses below. If there are 3 stakeholders, produce 6 analyses (3 profiles + 3 reverse reads).

---

### ANALYSIS 1: Psychoanalyze [Stakeholder Name]

Write as a continuous narrative — not bullet points, not tables. Go deep on each dimension. Use specific quotes or behaviors from the communications as evidence. Don't hedge.

**Seven dimensions to cover:**

**1. Core Psychological Driver**
What is the deepest motivation behind their behavior? Not what they say they want, but what they actually need — career validation, control, legacy, fear of irrelevance, financial security, ego protection, etc. Consider their career stage and life context (a 30-year-old founder and a 55-year-old PE executive have fundamentally different psychological frameworks).

**2. Communication Pattern Decoding**
What does their word choice, tone, what they emphasize, and what they avoid reveal about how they think? When they make compliments, are they genuine or strategic? When they express frustration, is it real or performative? Look for patterns, not isolated moments.

**3. Real Power Position**
Do they have real authority or just influence? Who do they actually report to or depend on? What are the constraints on their ability to deliver what they're promising? Where is the gap between their title and their actual power?

**4. Fear Structure**
What are they most afraid of in this deal, in their career, in this relationship? What would happen to them personally if this deal falls apart? What's the worst-case scenario they're trying to avoid?

**5. Relationship With Richard**
What does Richard represent to them beyond the transaction? A tool, a partner, a threat, a mentor, a validation mechanism? How would they describe Richard to someone else when he's not in the room?

**6. The Unspoken Vulnerability**
Every stakeholder has a gap between who they present themselves as and who they actually are. What is that gap? Where does their confidence mask insecurity?

**7. Behavioral Prediction + Playbook**
Based on everything above: What will they do next? If the deal goes well, how will they act? If it goes badly? What's their likely move in the next 1–2 weeks? Then: What approach will be most effective with them? What should Richard avoid doing? What's the one thing Richard could say or do that would deepen their trust or commitment?

---

### ANALYSIS 2: How [Stakeholder Name] Perceives Richard

Flip the lens. Write this **in second person**, as if directly advising the stakeholder about Richard. The stakeholder came to you and asked: "Psychoanalyze Richard for me based on everything I've observed."

**Seven dimensions to cover:**

**1. Negotiating Style**
How they perceive Richard's negotiating approach — what makes him effective or dangerous as a counterpart. What patterns have they noticed?

**2. Core Motivations (Their Read)**
What they think drives Richard — and whether they're right or wrong about it. Where their mental model of Richard is accurate vs. where it has blind spots.

**3. Perceived Vulnerabilities**
Where they think Richard's weak points and blind spots are. What they believe they could exploit or where they think Richard overextends.

**4. Trust & Loyalty Model**
How Richard decides who gets his full commitment vs. who gets deprioritized. What signals loyalty vs. transactional behavior. What earns — and loses — Richard's investment.

**5. What Richard Wants But Won't Ask For**
The unspoken asks. What Richard needs from them that he'll never explicitly state — validation, partnership equity, respect, autonomy, etc.

**6. The Loss Scenario**
What would happen if they lost Richard as a partner? How would he react — would he fight, walk, or escalate? Where would he go next? What leverage would shift?

**7. How to Work With Richard**
Specific, actionable advice to the stakeholder on managing the relationship most effectively. What to do, what to avoid, what to never say.

---

### Multi-Stakeholder Dynamics

When there are multiple stakeholders, add a brief section after all individual analyses:

**Cross-Stakeholder Map** — How each stakeholder relates to the others. Who defers to whom? Where are the internal alliances and tensions? Who is the real decision-maker vs. the performative one? If Richard needs to choose who to invest relationship capital in, who delivers the most leverage?

### Analysis Principles

- **Narrative, not bullet points** — write like an executive briefing, not a CRM note
- **Evidence-backed** — every claim tied to a specific quote, behavior, or pattern from the communications
- **Patterns over moments** — what someone does repeatedly matters more than what they did once
- **Silence is data** — pay attention to what's NOT said, avoided, or deflected
- **Career stage matters** — interpret behavior through the lens of where this person is in their career and what they have to lose
- **No diplomacy** — write the honest read, even if it's uncomfortable
- **Subtext over text** — decode what behavior REVEALS about psychology, not just what words say

### Output Format

Inline text in the conversation. Each stakeholder gets a clearly labeled section with both analyses. If the user wants PDF output, use the PDF template from `references/PDF_TEMPLATE.md` with Anyreach branding — narrative text formatted as body paragraphs with H2 section headers per stakeholder.