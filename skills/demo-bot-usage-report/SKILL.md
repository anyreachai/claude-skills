---
name: demo-bot-usage-report
description: Generate an Anyreach-branded 9-10 page PDF usage report from an Anyreach platform conversations export CSV. Use whenever the user provides a conversations CSV (or references one already uploaded) and asks to analyze how a bot is being used, build a partner-facing report, or summarize demo activity. Trigger on phrases like "create a usage report from this CSV", "analyze the X bot calls", "build a report on how the Y demo is being used", "do the same for Z" (when a prior bot was just analyzed), "summarize what the bot did across these sessions", or "build a report I can send to partner". Output covers topic distribution, duration, capability surface, user sentiment, engagement depth, channel mix, verbatim user quotes with qualitative observations, dialogue examples, and partner takeaways. Use this skill instead of writing one-off PDF code; layout, brand, charts, and analytical heuristics are all standardized.
---

# Demo Bot Usage Report

Generate a stakeholder-ready PDF that summarizes how an Anyreach demo bot is being used, with topic distribution, capability surface, sentiment, engagement depth, verbatim user quotes & qualitative observations, dialogue examples, and partner-facing takeaways. The output uses the Anyreach brand system and is designed to be sent directly to BPO partners, prospects, or executive stakeholders.

This skill was built from the AT&T (Sophia / Startek) and Access Bank (Lily) reports and generalizes across any Anyreach demo bot.

---

## Prerequisites

- A **conversations export CSV** from the Anyreach platform (typically named `conversations_export_YYYY-MM-DD.csv`), containing at minimum: `ID`, `Agent ID`, `Agent Config`, `Channel`, `Direction`, `Duration`, `Status`, `Created At`, `Conversation` (JSON), `Summary`
- Python with `pandas`, `matplotlib`, `reportlab`, `pypdfium2` available (install with `--break-system-packages` if needed)
- DejaVu Sans font available at `/usr/share/fonts/truetype/dejavu/` (for non-English glyph support — Twi, naira symbol, etc.)

---

## Workflow

### Step 0 — Read the references

Before writing any code, load:
- `references/PDF_TEMPLATE.md` — full reportlab code: brand colors, custom flowables, chart styling, page structure, footer
- `references/QUOTE_EXTRACTION.md` — the heuristics for the "Voice from the transcripts" section (verbatim quotes + qualitative observations)

Do not reimplement these from scratch. The styling, colors, fonts, and flowables are calibrated against existing reports.

### Step 1 — Identify the bot and addressee

From the CSV's `Agent Config` field, identify:
- **Bot identity** — the bot's first name (e.g., "Sophia", "Lily") and the brand it represents (e.g., "AT&T", "Access Bank PLC")
- **Date range** of the sessions
- **Channel mix** — webrtc only, telephone only, or hybrid

Then determine the **addressee**:
- If the user explicitly named one ("for Startek", "to send to Bharat", "for the Access Bank team") — use that
- If a prior conversation in this thread analyzed the same bot for a specific partner — reuse that addressee
- Otherwise, ask once with `ask_user_input_v0` to pick from likely candidates (the brand company, a named BPO partner, or "internal review")

Do NOT ask for clarification on every bot — only ask when the addressee is genuinely ambiguous.

### Step 2 — Analyze the data

Load the CSV with pandas and extract everything needed for the report. The complete analysis pipeline is in `references/PDF_TEMPLATE.md` under "Data extraction"; the new quotes pipeline is in `references/QUOTE_EXTRACTION.md`. At a minimum, compute:

**Basic stats**
- Total sessions, completed vs unanswered/abandoned
- Duration: mean, median, min, max, total audio hours
- Channel and direction distribution
- Date range and per-day session counts

**Conversation structure (per session)**
- User turn count, assistant turn count, total turns
- Function call count by tool name
- Interruption events
- Per-message transcription confidence (note: short utterances naturally score low — don't treat that as a quality issue)
- Per-turn latency metrics (`e2e_latency`, `llm_node_ttft`, `tts_node_ttfb`, `end_of_turn_delay`) — surface these only for INTERNAL reports, never partner-facing ones

**Topics (multi-label)**
- Build a topic taxonomy from the actual data — don't reuse AT&T/Access Bank categories blindly. Look at `Summary` fields and full transcript content to identify the 6-9 dominant clusters.
- Tag each session against every topic it touches (sessions can hit multiple). Sum totals will exceed session count — note this in the chart caption.

**Sentiment (per user turn)**
- Use the keyword-based classifier in `references/QUOTE_EXTRACTION.md`. Skip empty/widget-only user turns.
- Report total turns scored, % positive, % neutral, % negative.

**Quote candidates** — see `references/QUOTE_EXTRACTION.md` for the full extraction methodology.

**Qualitative observations** — patterns across the corpus: interruption clustering, repetition, language switching, off-script handling, escalation behavior.

### Step 3 — Generate charts

Six standard charts (matplotlib code in `references/PDF_TEMPLATE.md`):
1. `01_use_cases.png` — horizontal bar of topics covered
2. `02_duration.png` — histogram of session length with median line
3. `03_sentiment.png` — donut chart of user-turn sentiment
4. `04_tools.png` — horizontal bar of tool/widget invocations
5. `05_turns.png` — histogram of user turns per session
6. `06_timeline.png` OR `06_channel_mix.png` — daily activity bar (default) OR channel mix (when the bot has both web and phone sessions, like Access Bank)

All charts use the Anyreach brand palette: `#5B5FC7` indigo, `#10B981` green, `#06B6D4` cyan, `#F59E0B` amber, `#EC4899` pink, `#161631` dark navy, `#6B7280` muted gray. The single tallest bar in histograms gets recolored pink (`#EC4899`) to draw the eye.

### Step 4 — Generate the PDF

The 10-section structure (note: section 4 is NEW vs. the original AT&T/Access Bank reports):

| Page | Section | Content |
|------|---------|---------|
| 1 | **Cover** | Title, addressee, 8 key stats in two rows of 4, executive bottom-line paragraph |
| 2 | **Section 1: What the bot was asked to do** | Topics chart + commentary; opens "Section 1" of the report |
| 3 | (continued) | Duration chart + length-to-content table |
| 4 | **Section 2: Capability surface** | Tools/widgets chart + commentary on top capabilities |
| 5 | (continued) | Channel mix OR engagement depth + supporting table |
| 6 | **Section 3: How it felt to the user** | Sentiment donut + commentary |
| 7 | (continued) | Engagement depth chart + at-a-glance telemetry table |
| 8 | **Section 4: Voice from the transcripts** *(NEW)* | 6-9 verbatim quote cards + "Other qualitative observations" subsection. See `references/QUOTE_EXTRACTION.md`. |
| 9 | **Section 5: Representative interactions** | 3-4 verbatim dialogue examples in styled boxes |
| 10 | **Section 6: What this means for [addressee]** | Dimension-by-dimension takeaway table, verdict bar, suggested next step, methodology note |

Always register DejaVu Sans for any cell or paragraph that may contain non-English text or special symbols (₦, ɛ, ɔ, é, ñ, etc.). Helvetica will render those as black squares.

Use `KeepTogether` around `(heading + body + chart)` triplets to prevent stranded headings on page breaks.

### Step 5 — Output

1. Save the PDF to `/home/claude/[bot_brand_lower]_demo_bot_usage_report.pdf`
2. Render every page with `pypdfium2` to PNG and visually QA — check for stranded headings, overlapping labels, missing glyphs, cut-off content
3. If layout issues are found, fix and re-render before presenting
4. Copy to `/mnt/user-data/outputs/[bot_brand_lower]_demo_bot_usage_report.pdf`
5. Optionally also output an enriched per-session CSV with extracted metrics
6. Use `present_files` to share the PDF (and CSV if produced)
7. End with a 3-5 sentence verbal summary of the headline findings — what's notable about THIS bot specifically, not just generic praise

---

## Quality standards

### What makes a GOOD bot usage report
- **Data-derived**: Every claim is sourced from the actual session telemetry — no fabricated numbers
- **Specific to this bot**: Topics, examples, takeaways reflect what THIS deployment did, not generic AI-bot copy
- **Visually consistent**: Anyreach brand system applied throughout (colors, fonts, layout)
- **Stakeholder-ready**: Reads like a confident proof point, not a feature dump
- **Tight**: Concise prose, big numbers, real quotes, no fluff
- **Honest about scope**: Methodology note clearly states "demo and validation traffic, not production customer calls"

### What makes a BAD bot usage report
- Generic claims that could apply to any AI bot
- Fabricated success metrics or made-up customer reactions
- Long prose explanations where a chart would suffice
- Surfacing internal performance issues (latency, error rates) in a partner-facing doc
- Reusing topic categories from a different bot deployment instead of deriving from this data
- Skipping the "Voice from the transcripts" section because quote extraction takes more thinking
- Including an interesting quote without verifying it actually appears in the transcripts

### The Anyreach voice in these reports
- **Confident and grounded** — let the data speak
- **Concrete** — exact numbers, real verbatim quotes, named tools
- **Partner-aware** — the takeaway section frames the data through the addressee's lens
- **Direct** — bold the key finding in each section, don't bury it

---

## Adapting across bot deployments

Different bot deployments have different shapes. Lean into what's distinctive:

| Bot type | What's distinctive | What to emphasize |
|----------|-------------------|------------------|
| Telco retail care (e.g., AT&T Sophia) | Heavy authenticated workflows (OTP, profile fetch, plan change), multi-tool surface, life-event scenarios | Full end-to-end account modification, empathy handling, depth of tool use |
| Banking concierge (e.g., Access Bank Lily) | Web-to-phone handoff, multilingual (incl. African languages), product education funnel | Cross-channel continuity, language coverage, product-specific recommendations |
| Healthcare / scheduling | HIPAA-conscious wording, appointment workflows | Identity verification, structured intake, after-hours coverage |
| Government / utility | Plain language, multi-language, vulnerability-aware | Accessibility, language coverage, no escalation to human |
| Outbound sales | Prospect qualification, callback scheduling | Conversion rate signals, qualification depth, follow-up hooks |

Don't force a section that doesn't fit. If the bot has no telephone sessions, drop the channel mix chart and use daily activity instead. If there's no multilingual content, drop language references from the takeaways.

---

## Edge cases

- **Very small dataset (<20 sessions)**: Note this prominently in the methodology and frame the report as "early indicators" rather than statistical claims.
- **Single-day burst**: Note the concentration in the timeline section. For Access Bank we saw 63/69 sessions on one day — that's worth flagging as a validation sprint, not normal traffic.
- **No sentiment classifications**: If user turns are too short or too widget-heavy to score, skip the sentiment donut and replace with a different signal (e.g., topic transitions, follow-up question rate).
- **Multilingual but limited samples**: Even one good multilingual exchange is worth highlighting as a capability proof. Don't undersell it.
- **Internal report (not partner-facing)**: Add a latency/quality section after Section 3 with e2e latency distribution and outlier analysis. Never put this in partner-facing PDFs.
- **Caller is asking "do the same for X"**: Read the prior chat for context (addressee, format expectations, any tone calibration the user requested), then proceed without re-confirming everything.

---

## Reference files

- `references/PDF_TEMPLATE.md` — Full reportlab generation code: brand colors, font registration, custom flowables (CoverBar, KeyStatBox, ColorBar, VerdictBar, QuoteCard), chart generation code, page layout, footer
- `references/QUOTE_EXTRACTION.md` — Methodology for the "Voice from the transcripts" section: quote category taxonomy, extraction heuristics, layout pattern, qualitative observation framework
