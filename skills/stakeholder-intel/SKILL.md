---
name: stakeholder-intel
description: >
  Deep research a person and generate a psychoanalysis PDF covering career history, LinkedIn activity, AI/tech views, decision-making style, motivations, and tactical pitch advice. Trigger on: "research [person]", "deep dive on [LinkedIn URL]", "profile [stakeholder]", "what makes [person] tick", "prep me for [person]", "psychoanalysis of [name]", "stakeholder brief", "tell me everything about [name]", "look into [person]", or any request to research a contact, executive, or decision-maker for a meeting. Also trigger when a LinkedIn URL is provided with a research request. Use even for partial requests like "what do we know about [name]" since the full research produces the most actionable output.
---

# Stakeholder Intelligence Brief Generator

Generate a comprehensive, branded PDF intelligence brief on any person — typically a prospect stakeholder, executive, or decision-maker — by deep-researching their public footprint. The output is a professionally designed Anyreach-branded PDF covering career arc, psychological profile, public positions, network analysis, and a tactical playbook for how to speak their language in a meeting.

---

## Step 0 — Read the PDF Template

**Before doing anything else**, read `references/PDF_TEMPLATE.md` in this skill directory. It contains the complete ReportLab PDF generation code, Anyreach color system, reusable components, and page structure.

---

## Step 1 — Gather Context from the User

Extract from the request:
- **Full name** and spelling variants
- **Current company and title**
- **LinkedIn URL** (if provided)
- **Purpose** — what meeting, pitch, or deal is this for? Who will be presenting? This shapes the tactical section.

If context is thin, ask before researching. The purpose determines the entire framing.

---

## Step 2 — Deep Research (10-20 searches)

This is the core of the skill. Be exhaustive. Use `web_search` and `web_fetch` together — search finds the URLs, fetch gets the full content.

### 2a. LinkedIn Profile & Activity (3-5 searches)

```
"[Full Name]" "[Company]" site:linkedin.com
"[Full Name]" "[Title]" linkedin
"[Full Name]" "[Company]" linkedin posts OR articles
```

**Extract:**
- Current title, tenure, full career history (every role, company, dates)
- LinkedIn headline and self-description — exact wording reveals self-image
- Education (schools, degrees, dates)
- **LinkedIn posts** — this is the highest-value source. Extract:
  - Topics and recurring themes
  - Their stance on AI, automation, transformation
  - Exact phrases and vocabulary they use (these become pitch language)
  - Hashtags they use (map their mental territory)
  - Who they tag, share from, or engage with (reveals orbit)
  - Whether they're a thought leader, curator, or lurker
  - Tone: data-driven vs. narrative, formal vs. casual, provocative vs. safe

### 2b. University & Alumni Profiles (1-2 searches)

```
"[Full Name]" "[University]" alumni OR profile OR interview
"[Full Name]" MBA OR executive education interview
```

**Why this matters:** Alumni interviews are gold. People speak candidly about formative experiences, career turning points, values, and personal philosophy. These details power the psychological profile.

### 2c. Conference & Speaking Appearances (2-3 searches)

```
"[Full Name]" "[Company]" conference OR keynote OR panel OR speaker
"[Full Name]" "[Company]" podcast OR webinar OR interview
```

**Extract:** Topics they speak on publicly, conferences they attend, co-panelists, stated positions. Fetch podcast show notes for direct quotes.

### 2d. News & Press (2-3 searches)

```
"[Full Name]" "[Company]" news OR announcement OR press
"[Company]" "[their function]" strategy OR transformation 2025 2026
```

**Extract:** Quotes attributed to them, company announcements involving their function, strategy shifts.

### 2e. Company Context (2-3 searches)

```
"[Company]" "[their function]" leadership changes 2025 2026
"[Company]" AI OR automation OR transformation customer
"[Company]" challenges OR competitors OR market position
```

**Why this matters:** Leadership churn = instability = openness to new partners. Recent strategy announcements reveal what they're being told to prioritize. This creates the "timing" argument in the tactical section.

### 2f. Internal Context (if tools available)

If conversation_search, Gmail, Slack, or Calendar tools are available:
```
conversation_search: "[Name]" "[Company]"
gmail_search: "from:[domain] OR to:[domain]"
```
Extract any prior interactions, what resonated, what didn't, deal history.

---

## Step 3 — Synthesize the Profile

Raw data becomes actionable intelligence. Build these analytical sections:

### 3a. Career Arc Narrative

Tell the *story*, don't list jobs:
- What's the throughline? (e.g., "from East German call centre agent to eBay's outsourcing chief")
- What formative experiences shaped them? (e.g., Berlin Wall falling at age 16, starting on the frontline)
- What did each role build? (e.g., IBM instilled process discipline, Yahoo taught chaos tolerance)
- What does the trajectory reveal about ambition, values, and identity?

### 3b. What They Control

Map their scope of responsibility in concrete terms:
- What decisions do they make? (budgets, vendor selection, strategy, headcount)
- Who reports to them? What org do they run?
- What's their mandate from leadership?
- **Key implication:** Why does this person matter for the pitch?

### 3c. LinkedIn Intelligence

Analyze their public positions:
- Quote or paraphrase their key published statements
- Identify the tension or thesis in their thinking (e.g., "AI is valuable BUT only when layered on excellent human ops")
- Map their hashtag vocabulary
- Note the balance of original content vs. curation vs. engagement

### 3d. Network & Orbit

Who is in their professional sphere?
- Companies they engage with on LinkedIn (tag, share, comment)
- People they reference personally ("my friend [name]" = genuine relationship)
- Industry groups or communities
- Advisory positions or board seats

### 3e. Company Context & Timing

Why is *now* a good time to pitch?
- Recent leadership departures or appointments in their org
- Company strategy shifts relevant to the pitch
- Competitive pressures
- Public sentiment issues (customer complaints, press coverage)

### 3f. Psychological Profile

Synthesize all evidence into:
- **Core type label** (e.g., "The Structured Pragmatist", "The Data-Driven Visionary")
- **Decision-making drivers** — what evidence/framing triggers a yes? (ROI data, case studies, peer validation, vision)
- **Risk tolerance** — high/medium/low with evidence
- **Communication style** — formal vs. casual, data vs. narrative, detail vs. big-picture
- **Cultural context** — nationality, norms, anything that affects communication expectations
- **What makes them say yes** — specific conditions for getting the next meeting
- **What turns them off** — specific behaviors or framings to avoid

### 3g. Tactical Playbook

The most important section. Specific, actionable recommendations:
- **Language to use** — mirror their vocabulary, hashtags, and framing
- **Language to avoid** — what turns them off based on their profile
- **Opening moves** — how to start the conversation
- **Proof points they'll respond to** — case studies, data types, peer references
- **How to ask for the next step** — frame workshops/follow-ups using their own stated values
- **Objection handling** — predicted pushback based on profile
- **Personal/cultural touches** — metaphors, references, or framings that connect to their background (e.g., football metaphors for a sports fan, structured methodology for an ex-IBM person)

---

## Step 4 — Generate the PDF

Read `references/PDF_TEMPLATE.md` for all component code. Build the PDF with this structure:

### Page 1: Cover
1. `STAKEHOLDER INTELLIGENCE BRIEF` label (pink, small caps)
2. Person's name (large title)
3. Title and company (subtitle)
4. Context line (e.g., "Prepared for Pratap Rao (CCI) — eBay Pitch, April 2026")
5. Summary table: Role, Tenure, Education, Controls, AI Stance, Decision Style
6. Horizontal rule

### Pages 2+: Sections (numbered H1 headings in indigo)
```
1. CAREER ARC
2. WHAT THEY CONTROL
3. LINKEDIN INTELLIGENCE (with quoted positions, hashtag map)
4. NETWORK & ORBIT (table: Company | Signal)
5. [COMPANY] CONTEXT (leadership changes table, strategy analysis)
6. PSYCHOLOGICAL PROFILE & DECISION-MAKING
   - Decision drivers as bullet cards
   - Green split box: Risk Tolerance | What Makes Them Say Yes
   - Red box: What Turns Them Off
7. TACTICAL PLAYBOOK (colored left-border cards, one per tactic)
8. CONCLUSION (dark navy box with white text)
```

Omit any section that has no data. Sections 6, 7, 8 must always be present.

### Design Rules
- Anyreach brand: dark bg `#161631`, pink top bar, indigo `#5B5FC7` section headings
- Use the component library from PDF_TEMPLATE.md (summary tables, dark callouts, orbit tables, split boxes, tactical cards, conclusion box)
- `PageBreak()` before major sections
- `Spacer(1, 6-12)` between elements
- Escape `&` as `&amp;` in all Paragraph text
- Never use Unicode subscript/superscript (renders as black boxes in ReportLab)

---

## Step 5 — Deliver

```bash
python3 -c "from pypdf import PdfReader; r = PdfReader('[output].pdf'); print(f'{len(r.pages)} pages')"
```

Copy to `/mnt/user-data/outputs/` and call `present_files`.

---

## Key Principles

1. **Evidence over speculation.** Every claim must trace to a source. If you can't find data, say so.
2. **Narrative over lists.** Career arc and psych profile should read as analytical prose.
3. **Actionable over encyclopedic.** Every section connects to "so what does this mean for the pitch?"
4. **Mirror their language.** Highlight their own words and phrases — these become pitch vocabulary.
5. **Respect privacy.** Publicly available professional info only. No home addresses, family, personal social media.
6. **Context shapes everything.** A profile for a sales pitch reads differently than one for a partnership negotiation.

---

## Quality Checklist

- [ ] Full career history represented (not just current role)
- [ ] LinkedIn posts analyzed with specific themes and quotes
- [ ] Psychological profile has a clear type label with evidence
- [ ] Tactical recommendations are specific (not generic "be professional")
- [ ] Their own language is highlighted for mirroring
- [ ] Company context includes leadership changes or strategy shifts
- [ ] Orbit table identifies 3+ companies/people in their sphere
- [ ] Cultural context noted if relevant
- [ ] All claims sourced
- [ ] PDF follows Anyreach brand (pink top bar, indigo headings, dark callouts)
- [ ] File in `/mnt/user-data/outputs/` and `present_files` called
