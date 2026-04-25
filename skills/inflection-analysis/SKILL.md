---
name: inflection-analysis
description: "Analyze sales call transcripts with full psychoanalysis, sentiment tracking, engagement scoring, seller performance evaluation, AND Before & After inflection point analysis — all output as a branded PDF report. Use this skill when Richard says 'analyze the inflection', 'before and after analysis', 'did the money shot work', 'frame shift analysis', 'posture analysis', 'analyze this call', 'how did the call go', 'score this meeting', 'review this transcript', 'call debrief', 'post-mortem', 'rate our sales performance', 'what went well', 'give me feedback on this call', 'break down this conversation', 'how was my objection handling', 'did the buyer seem interested', 'inflection point', 'did the frame flip', or 'narrative shift analysis'. Trigger whenever a sales call transcript or meeting transcript is provided and the user wants analytical depth, scoring, or a PDF report. Do NOT use for simple recaps or summary emails."
allowed-tools: Bash, Read, Edit, Write, AskUserQuestion, Grep
---

# Sales Call Analyzer + Inflection Point Analysis

This skill produces a comprehensive branded PDF report that combines two analysis modes:

1. **Full Call Analysis** — Sentiment tracking, buyer psychoanalysis, engagement scoring, seller performance, strategic recommendations
2. **Inflection Point Analysis** — Surgical before/after comparison of how a specific strategic move shifted the counterpart's posture and frame

Both are always performed. The inflection analysis is the crown jewel — it's what makes this different from generic call reviews.

---

## WORKFLOW — Follow these steps exactly in order

### STEP 1: Ingest the Transcript

Ask the user to provide the call transcript (paste, file path, or URL). The transcript MUST include timestamps. If it doesn't have timestamps, tell the user you need a timestamped transcript for this analysis to work.

Read and parse the entire transcript.

### STEP 2: Chapter the Call

Break the call into natural chapters based on topic shifts, speaker changes, or energy shifts. Present them as a numbered list with timestamp ranges and a short description:

```
1. [0:00 - 4:30] — Introductions and rapport building
2. [4:30 - 12:15] — Counterpart establishes their position and leverage
3. [12:15 - 18:40] — Discovery / information exchange
4. [18:40 - 25:00] — Counterpart's monologue about their needs
5. [25:00 - 33:00] — Commercial terms discussion
6. [33:00 - 33:45] — THE INFLECTION POINT — Richard's strategic move
7. [33:45 - 42:00] — Counterpart's shifted response
8. [42:00 - 55:00] — New dynamic / closing
```

Then ask the user TWO questions:

> **1. Which chapters do you want included in the Before & After inflection analysis?**
> (Select chapter numbers, or say "all")
>
> **2. What was the goal you were trying to achieve with your strategic move at the inflection point?**
>
> Examples:
> - "Flip the power dynamic so they stop acting like the gatekeeper"
> - "Get them to offer resources/investment instead of just asking for free work"
> - "Shift from them setting terms to them asking to be included"
> - "Create urgency so they stop slow-playing the deal"
> - "Establish that we have alternatives so they compete for us"

Wait for the user's response before continuing.

### STEP 3: Run the Full Analysis

Perform ALL of the following analyses on the transcript. These feed into the PDF report.

---

#### 3A: Identify Participants

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

---

#### 3B: Map Call Phases

Break the call into sequential phases with approximate duration. Common phases:
- Rapport / Small Talk
- Context Setting / History
- Vision / Pitch
- Pushback / Objections
- Live Demo
- Pricing Discussion
- Use Case Discussion
- Next Steps / Close

Note which seller was leading each phase.

---

#### 3C: Track Sentiment

For each buyer, score sentiment (1-10) at each call phase:
- 1-3: Resistant, skeptical, shutting down
- 4-5: Neutral, polite but disengaged
- 6-7: Interested, asking questions, leaning in
- 8-10: Excited, self-identifying use cases, volunteering next steps

Identify inflection points — moments where sentiment shifted significantly. For each:
- What happened (the trigger)
- The sentiment shift (e.g., "7 → 3")
- The impact on the rest of the call

---

#### 3D: Buyer Psychoanalysis

For each buyer, build a profile:

| Field | Description |
|-------|-------------|
| Archetype | A 2-3 word label (e.g., "Pragmatic Power Broker", "Institutional Navigator") |
| Decision Style | Data-driven, relationship-driven, consensus-seeking, etc. |
| Trust Triggers | What specifically built trust during the call |
| Risk Antenna | What they're most worried about — blocker or coaching? |
| Key Insight | Single most important thing to know for next interaction |

Behavioral signals to look for:
- **Champion signals**: Volunteering budget, rehearsing internal pitch language, offering follow-ups
- **Coaching signals**: Warning about internal processes, naming people/teams to prepare for
- **Blocker signals**: Categorical statements ("this won't happen"), refusal to engage on specifics
- **Interest signals**: Questions shifting from IF to HOW, self-identifying use cases, asking about pricing

---

#### 3E: Score Engagement

Score overall buyer engagement (1-10) across:

| Dimension | What to Look For |
|-----------|-----------------|
| Questions Asked | Volume, depth, specificity |
| Objections Raised | Real barriers or coaching? How many? |
| Use Cases Self-ID'd | Did buyers independently identify applications? |
| Internal Championing | Volunteered to sponsor, fund a test, schedule follow-ups? |
| Urgency Signals | Timeline pressure, competitive mentions, "we need this now" |
| Next Step Commitment | Vague ("let's talk soon") vs. concrete ("meeting in 2 weeks") |

Provide evidence from transcript for each score.

---

#### 3F: Evaluate Seller Performance

For each seller, score (1-10):

| Metric | Description |
|--------|-------------|
| Rapport Building | Reading the room, creating comfort |
| Objection Handling | Speed and quality of response to pushback |
| Demo Execution | Effectiveness of live demos, wow moments |
| Value Articulation | Connecting features to buyer-specific outcomes |
| Closing / Next Steps | Securing specific commitments, locking dates |
| Adaptability | Pivoting when something isn't working, reading signals |

For each seller:
- **Strengths**: What they did well with specific examples
- **Areas for Improvement**: Table with: Issue | What Happened | Impact | Fix

---

#### 3G: Scorecard

- **What Worked**: 5-7 things that went well, with evidence
- **What Needs Improvement**: 5-7 things that could be better, with evidence

---

#### 3H: Strategic Recommendations

Prioritized next steps:
- **P0 (within 48 hours)**: Time-sensitive actions preserving momentum
- **P1 (within 2 weeks)**: Important preparation for next interaction
- **P2 (before next meeting)**: Strengthens position

Each recommendation: Action, Owner, Deadline.

---

#### 3I: Bottom Line

One paragraph: Is this deal real? Biggest risk? Single most important next action?

---

### STEP 4: Inflection Point Analysis (The Before & After)

This is the core differentiator. Using the chapters and goal the user selected in Step 2, produce:

---

#### The Inflection Point: ~[TIMESTAMP]

State what Richard said or did at this moment. Quote the exact words from the transcript in italics.

---

#### BEFORE: [Counterpart Name]'s Posture (~[start] to [inflection timestamp])

**Dominant frame:** One sentence capturing their operating assumption in quotes.
Example: *"I have what you need. Let me tell you how big my world is."*

Brief 1-2 sentence explanation of what this frame means — how they're positioning themselves relative to Richard.

**Key quotes showing this:**

For each relevant quote from the BEFORE section:
- **[Timestamp]** — *"Exact quote from transcript."* → One-sentence interpretation of what this reveals about their posture/frame. Be specific about the power dynamic.

Aim for 5-10 key quotes. Prioritize quotes that show:
- Self-serving statements (talking about THEIR needs, THEIR importance)
- Paternalistic or directive language
- Leverage-establishing moves (name-dropping, flexing assets)
- Requests for free work or one-sided asks
- Dismissive or condescending framing
- Setting terms unilaterally

**Before-section summary:** Quantify the pattern. Example:
> [Name] mentions what they need or have ~X times. They mention what they can do for Richard ~Y times. Ratio of self-serving vs. value-offering statements: roughly X:1.

---

#### AFTER: [Counterpart Name]'s Posture (~[post-inflection] onward)

**Dominant frame shifts to:** One sentence in quotes.
Example: *"What can I do to make sure you pick us?"*

For each relevant quote from the AFTER section:
- **[Timestamp]** — *"Exact quote from transcript."* → One-sentence interpretation showing HOW the posture shifted. Be explicit about the contrast with the BEFORE behavior.

Aim for 5-10 key quotes. Prioritize quotes that show:
- Asking clarifying questions within RICHARD'S framework (not setting their own)
- Requesting inclusion (vs. assuming it)
- Expressing vulnerability or fear of being displaced
- Acknowledging Richard's risk or constraints (not just their own)
- Offering tangible value (money, access, resources, introductions)
- Accommodating language ("whatever it takes", walking back demands)
- Using the same assets they previously flexed for status, but now OFFERING them as value

---

#### Quantified Shift

Create a comparison table with these metrics (adapt based on what's relevant):

| Metric | Before [timestamp] | After [timestamp] |
|--------|-------------------|-------------------|
| "Here's my problem, solve it" statements | ~count | ~count |
| "Here's what I can do for you" statements | ~count (vague/specific) | ~count (vague/specific) |
| Acknowledges Richard's risk/needs | count | count |
| Offers something tangible (money, access, resources) | count | count (list them) |
| Expresses vulnerability/dependence | count | count |
| Accommodating language | count | count |
| Name-drops for own status | count | count |
| Name-drops as value offering to Richard | count | count |

Add or remove rows based on what patterns actually appear. Don't force metrics that aren't relevant.

---

#### Inflection Verdict

**Did the inflection point achieve the stated goal?** Answer directly: Yes, No, or Partially.

Then explain in 2-3 sentences:
1. What the frame was BEFORE
2. What the frame became AFTER
3. The single biggest piece of evidence (the most telling quote or behavioral shift)

End with a bold one-liner:
> **The frame flipped from "[before frame]" to "[after frame]."**

---

### STEP 5: Generate the PDF Report

Install reportlab if needed:
```bash
pip install reportlab --break-system-packages 2>/dev/null || pip install reportlab
```

Generate a branded PDF with the following structure and styling. Write a Python script that produces the PDF.

#### Brand Colors & Typography

```python
from reportlab.lib.colors import HexColor

# Anyreach brand palette
NAVY = HexColor('#0A1628')
DARK_BG = HexColor('#0F1D32')
WHITE = HexColor('#FFFFFF')
PINK = HexColor('#E91E8C')
CYAN = HexColor('#00D4FF')
GREEN = HexColor('#00C48C')
AMBER = HexColor('#FFB800')
RED = HexColor('#FF4757')
INDIGO = HexColor('#6C5CE7')
LIGHT_GRAY = HexColor('#F5F7FA')
MED_GRAY = HexColor('#E2E8F0')
DARK_GRAY = HexColor('#4A5568')
TEXT_DARK = HexColor('#1A202C')

# Page setup
from reportlab.lib.pagesizes import letter
PAGE_W, PAGE_H = letter
MARGIN = 0.7 * 72  # 0.7 inches
CONTENT_W = PAGE_W - 2 * MARGIN  # ~480 points
```

#### PDF Structure (Pages)

The PDF should have this layout:

**Page 1 — Cover**
- Pink top bar (full width, 4pt tall)
- "SALES CALL ANALYSIS" title
- Call date, participants, duration
- "CONFIDENTIAL" footer

**Page 2 — Call Overview & Sentiment**
- Call phases table with durations and lead seller
- Sentiment tracking chart (line chart showing each buyer's sentiment across phases)
- Key inflection points listed

**Page 3 — Buyer Psychoanalysis & Engagement**
- Buyer profile cards (archetype, decision style, trust triggers, risk antenna, key insight)
- Engagement scorecard (bar chart + evidence table)

**Page 4 — Seller Performance**
- Seller score comparison (grouped bar chart)
- Strengths and improvement areas for each seller
- What Worked / What Needs Improvement lists

**Page 5 — Inflection Point Analysis (THE BEFORE & AFTER)**
- The inflection point moment (highlighted quote box)
- BEFORE section with dominant frame + key quotes
- AFTER section with shifted frame + key quotes
- Quantified shift comparison table
- Verdict with bold frame-flip one-liner

**Page 6 — Strategic Recommendations & Bottom Line**
- P0/P1/P2 recommendations table
- Bottom line paragraph
- Anyreach footer branding

#### Critical PDF Rules

1. **ALL table cells must be Paragraph objects** — never plain strings. This ensures text wraps within columns.
2. Define cell styles before building tables:
```python
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph

cell_style = ParagraphStyle('cell', fontName='Helvetica', fontSize=8, leading=10, textColor=TEXT_DARK)
cell_bold = ParagraphStyle('cell_bold', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=TEXT_DARK)
cell_header = ParagraphStyle('cell_header', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=WHITE)
cell_italic = ParagraphStyle('cell_italic', fontName='Helvetica-Oblique', fontSize=8, leading=10, textColor=DARK_GRAY)

def P(text, style=cell_style):
    return Paragraph(str(text), style)
```
3. Column widths must sum to ~480 (usable page width with 0.7in margins).
4. Add RIGHTPADDING and LEFTPADDING (6pt minimum) to all table styles.
5. Use `SimpleDocTemplate` with `onFirstPage` and `onLaterPages` callbacks for headers/footers.
6. For the inflection point quote box, use a colored background frame or a Table with BACKGROUND color.

#### Charts

Use reportlab's `Drawing`, `LinePlot`, `VerticalBarChart` from `reportlab.graphics.charts`:

- **Sentiment Line Chart**: X-axis = call phases, Y-axis = sentiment 1-10, one line per buyer
- **Engagement Bar Chart**: One bar per engagement dimension, colored by score (red <4, amber 4-6, green 7+)
- **Seller Comparison Bars**: Grouped bars showing each seller's scores across metrics

#### Output

```python
# Generate to both locations
doc.build(story)

import shutil
shutil.copy('/home/claude/call_analysis.pdf', '/mnt/user-data/outputs/call_analysis.pdf')
```

After generating, present the file and give a concise 3-4 sentence verbal summary of the most important findings — focusing on the inflection verdict.

---

## ANALYSIS PRINCIPLES

- **Quote-driven**: Every claim must be backed by an exact quote with timestamp. No hand-waving.
- **Contrast is everything**: The value of the inflection analysis is in the DELTA between before and after. Always make the contrast explicit.
- **Interpret the subtext**: Don't just quote — explain what the quote REVEALS about the power dynamic, frame, or posture.
- **Quantify everything**: Count patterns, calculate ratios, score dimensions. Numbers make shifts undeniable.
- **Be direct and incisive**: Write like you're debriefing a founder who wants the truth, not a sanitized summary.
- **The inflection is the star**: The full call analysis provides context, but the Before & After is the crown jewel of the report. It should be the most detailed and impactful section.

## ADAPTING TO DIFFERENT CALL TYPES

| Call Type | Buyer = | Seller = | Focus |
|-----------|---------|----------|-------|
| Sales demo | Prospect | Sales team | Conversion signals |
| Partnership meeting | Partner org | Your team | Alignment signals |
| Investor pitch | Investor | Founders | Conviction signals |
| Customer success | Existing customer | CS team | Retention/expansion signals |
| Internal stakeholder | Executive sponsor | Project team | Approval signals |
