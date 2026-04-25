---
name: account-brief-generator
description: "Generate a comprehensive meeting brief / account memo for any company, contact, or deal by pulling data from Gmail, Google Calendar, Slack, and past Claude conversations. Use this skill whenever the user asks to generate a meeting brief, account summary, deal memo, contact timeline, relationship history, engagement recap, or any request like 'give me everything on [company/person]', 'summarize my interactions with [contact]', 'prep me for a call with [company]', 'what's the history with [deal]', 'generate a brief on [account]', 'pull together everything related to [person]', or 'create an account memo for [company]'. Also trigger when the user asks to prepare for a meeting and names a company or contact. This skill should be used even for partial requests like 'what do we know about [company]' or 'timeline with [person]' since the full context is needed for a complete picture."
---

# Account Brief Generator

Generate a branded, professional .docx meeting brief for any company or contact by aggregating data across Gmail, Google Calendar, Slack, and past Claude conversations.

## Overview

This skill produces a comprehensive Word document that serves as a pre-meeting intelligence packet. It contains: executive summary, key contacts table, complete engagement timeline, use cases discussed, commercial terms, negotiation status, strategic context, risk factors, and recommended meeting objectives.

---

## Step 1: Identify the Target

Extract from the user's request:
- **Company name** (and domain if provided, e.g., results-cx.com)
- **Contact name(s)** (e.g., Michelle, Will)
- **Any known email addresses or titles**

If the user is vague, ask for clarification before proceeding.

---

## Step 2: Data Gathering

Execute ALL of the following data-gathering steps. The quality of the brief depends on casting a wide net. Do not skip any source.

### 2a. Past Claude Conversations (conversation_search)

Run **4-6 keyword searches** against past conversations to find every prior discussion about this account. Vary the queries to maximize coverage:

```
Search 1: "[Company] [Contact1] [Contact2]"
Search 2: "[Company] MSA partnership deal pricing"
Search 3: "[Company] call meeting [month] discovery demo"
Search 4: "[Company] infosec NDA procurement legal"
Search 5: "[Company] deck pricing follow-up"
Search 6: "[Contact1] [Contact2] [domain]"
```

**What to extract from results:**
- Email threads (subject lines, dates, who said what, key quotes)
- MSA / legal negotiation details (redline items, sticking points, status)
- Pricing discussed (tiers, pilot fees, platform fees, per-unit costs)
- Use cases discussed (specific products, verticals, workflows)
- Deal stage and pipeline classification
- Strategic context (market positioning, competitive landscape)
- Internal analysis and recommendations from prior conversations
- Action items that were identified

### 2b. Google Calendar Events (gcal_list_events)

Run **3 calendar searches** to find every meeting involving the company or contacts:

```
Call 1: gcal_list_events(q="[Company Name]", timeMin="2025-01-01T00:00:00", timeMax="[today]", condenseEventDetails=false)
Call 2: gcal_list_events(q="[Contact1 Full Name]", timeMin="2025-01-01T00:00:00", timeMax="[today]", condenseEventDetails=false)
Call 3: gcal_list_events(q="[Contact2 Full Name]", timeMin="2025-01-01T00:00:00", timeMax="[today]", condenseEventDetails=false)
```

**CRITICAL: Use `condenseEventDetails=false`** to get full attendee lists, organizer info, RSVP status, attachments, and creation/update timestamps.

**What to extract from results:**
- Every meeting date, time, duration, and title
- Full attendee lists with email addresses and RSVP status (accepted, needsAction, declined)
- Who organized each meeting (organizer field)
- Meeting descriptions and attached documents (Gemini notes, agendas)
- Meeting locations (Teams, Zoom, Google Meet, in-person)
- Pattern of engagement (frequency, gaps, acceleration)
- Upcoming scheduled meetings (flag these prominently)

### 2c. Slack Messages (slack_search_public_and_private)

Run **2-3 Slack searches** to find internal team discussions about the account:

```
Call 1: slack_search_public_and_private(query="[Company] [Contact1] [Contact2]", sort="timestamp", sort_dir="asc", include_context=false, limit=20)
Call 2: slack_search_public_and_private(query="[Company] MSA", sort="timestamp", sort_dir="desc", limit=10)
Call 3: slack_search_public_and_private(query="[Company]", after="[timestamp of last known activity]", sort="timestamp", sort_dir="asc", limit=10)
```

**What to extract from results:**
- Call summaries posted by team members (these are gold — they contain structured meeting notes)
- Internal deal commentary and strategy discussions
- Action items assigned to team members
- Deal health assessments
- Competitive intelligence mentioned
- Links to Google Drive documents (call recordings, decks, proposals)

**Follow-up on threads:** If a Slack message has `reply_count > 0`, use `slack_read_thread` to get the full thread context.

### 2d. Gmail (if enabled)

If Gmail tools are available, search for email threads:

```
gmail_search_messages(query="from:[domain] OR to:[domain]")
gmail_search_messages(query="[Contact1 name] [Company]")
```

If Gmail is NOT enabled, use `search_mcp_registry` to check if it's connected, and `suggest_connectors` to prompt the user to enable it. Note in the brief that email data was not available.

---

## Step 3: Synthesize & Deduplicate

After gathering all data, synthesize into a unified timeline. Key principles:

1. **Deduplicate events** — the same meeting will appear in Calendar, Slack summaries, and past conversations. Merge them into a single timeline entry with the richest detail.
2. **Resolve conflicts** — if Calendar says a meeting was Oct 24 but Slack says Oct 25, trust the Calendar timestamp.
3. **Infer gaps** — if there's a long gap between touchpoints, note it. Gaps are meaningful context.
4. **Flag upcoming meetings** — if there's a meeting scheduled today or in the future, highlight it prominently and build the brief's recommendations around it.
5. **Identify all people** — compile every person mentioned across all sources (both from the target company and your own team). Include their title, email, and role in the engagement.

---

## Step 4: Generate the Document

### Required Dependency

```bash
npm install -g docx  # docx-js v9.x
```

### Brand System

Apply the user's brand colors if known from memory. If not, use the following professional defaults:

```javascript
// Default professional palette
const NAVY = "1B2A4A";
const PRIMARY = "2563EB";     // Blue accent
const GREEN = "10B981";
const DARK_TEXT = "1F2937";
const MUTED = "6B7280";
const WHITE = "FFFFFF";
```

If the user's brand colors are available in memory (e.g., from a sales deck design spec), use those instead. For example:
```javascript
// Anyreach brand (example — pull from memory)
const NAVY = "161631";
const INDIGO = "5B5FC7";
const GREEN = "10B981";
const CYAN = "06B6D4";
const DARK_TEXT = "1A1A2E";
const MUTED = "6B7280";
```

### Document Structure

The .docx MUST contain ALL of the following sections, in this order:

```
1. TITLE BLOCK
   - "MEETING BRIEF" label (small, uppercase, accent color)
   - Company name (large, bold, navy)
   - Subtitle with contact names and "Engagement History & Current Status"
   - Prepared date and author

2. EXECUTIVE SUMMARY
   - 2-3 paragraphs: who they are, how long engaged, current status, what's at stake
   - Mention any meeting happening today/soon

3. KEY CONTACTS TABLE
   - Table with columns: NAME | TITLE | EMAIL / ROLE
   - Navy header row with white text
   - Include ALL identified contacts from the target company
   - Include a note about which contacts are decision-makers vs. technical evaluators

4. ANYREACH / OUR TEAM PARTICIPANTS
   - Bullet list of every internal person who has been involved
   - Note their role in the engagement

5. COMPLETE ENGAGEMENT TIMELINE
   - Table with columns: DATE | EVENT | DETAILS
   - Navy header row
   - Alternating row highlights for key milestone events
   - Every single touchpoint in chronological order
   - Include: calendar meetings, email exchanges, Slack-noted calls, document deliveries, MSA exchanges

6. USE CASES DISCUSSED
   - H2 subheadings grouping by conversation/meeting where they were raised
   - Bullet lists of specific use cases
   - Include a "Platform Capabilities Demonstrated" subsection

7. COMMERCIAL TERMS SHARED
   - Bold label + normal text for each line item
   - Pilot fee, platform fee, per-unit pricing, commitments, special terms

8. NEGOTIATION / MSA STATUS (if applicable)
   - Current state of any legal/procurement process
   - H2 "Outstanding Items" with detailed bullet points for each open issue
   - Note who on their side owns the legal decisions

9. STRATEGIC CONTEXT
   - H2 "Why [Company] Matters" — TAM, client count, market position
   - H2 for any market catalyst (e.g., competitor disruption, industry news)
   - H2 "Credibility Points That Landed" — what resonated in prior conversations

10. RISK FACTORS & WATCH ITEMS
    - Bullet list with bold label + explanation for each risk
    - Cover: internal alignment gaps, compliance timelines, engagement pace, key person dependencies

11. TODAY'S MEETING / NEXT STEPS (if applicable)
    - Meeting time, attendees, who's NOT on the call
    - H2 "Recommended Objectives" — numbered list of 4-6 specific, actionable objectives

12. KEY DOCUMENTS & REFERENCES
    - Bullet list of all documents, links, and reference materials identified during research
    - Google Drive links, Slack message links, email thread subjects
```

### Document Generation Code Pattern

Use this exact JavaScript structure with docx-js:

```javascript
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, LevelFormat, PageBreak, TabStopType
} = require("docx");

// --- COLOR CONSTANTS (use brand colors from memory or defaults) ---
const NAVY = "161631";
const PRIMARY = "5B5FC7";
const DARK_TEXT = "1A1A2E";
const MUTED = "6B7280";
const WHITE = "FFFFFF";

// --- REUSABLE PRIMITIVES ---
const border = { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({ heading: level, children: [new TextRun(text)] });
}

function body(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    ...opts,
    children: Array.isArray(text)
      ? text
      : [new TextRun({ font: "Calibri", size: 22, color: DARK_TEXT, ...opts.run, text })],
  });
}

function label(text) {
  return new Paragraph({
    spacing: { before: 200, after: 60 },
    children: [
      new TextRun({ text: text.toUpperCase(), font: "Calibri", size: 18, bold: true, color: PRIMARY }),
    ],
  });
}

function bulletItem(text, ref = "bullets") {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 60 },
    children: Array.isArray(text)
      ? text
      : [new TextRun({ font: "Calibri", size: 22, color: DARK_TEXT, text })],
  });
}

function bold(text) {
  return new TextRun({ font: "Calibri", size: 22, color: DARK_TEXT, bold: true, text });
}

function normal(text) {
  return new TextRun({ font: "Calibri", size: 22, color: DARK_TEXT, text });
}

function muted(text) {
  return new TextRun({ font: "Calibri", size: 20, color: MUTED, text });
}
```

### Timeline Table Row Pattern

Use alternating highlights for key milestone events:

```javascript
function timelineRow(date, event, details, highlight = false) {
  const fill = highlight ? "EEF2FF" : WHITE;
  return new TableRow({
    children: [
      new TableCell({
        borders,
        width: { size: 2000, type: WidthType.DXA },
        margins: cellMargins,
        shading: { fill, type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            children: [new TextRun({ font: "Calibri", size: 20, bold: true, color: PRIMARY, text: date })],
          }),
        ],
      }),
      new TableCell({
        borders,
        width: { size: 2800, type: WidthType.DXA },
        margins: cellMargins,
        shading: { fill, type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            children: [new TextRun({ font: "Calibri", size: 20, bold: true, color: DARK_TEXT, text: event })],
          }),
        ],
      }),
      new TableCell({
        borders,
        width: { size: 4560, type: WidthType.DXA },
        margins: cellMargins,
        shading: { fill, type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            children: [new TextRun({ font: "Calibri", size: 20, color: DARK_TEXT, text: details })],
          }),
        ],
      }),
    ],
  });
}
```

### Table Header Row Pattern

Navy background with white text for all table headers:

```javascript
function tableHeaderRow(columns, columnWidths) {
  return new TableRow({
    children: columns.map((col, i) =>
      new TableCell({
        borders,
        width: { size: columnWidths[i], type: WidthType.DXA },
        margins: cellMargins,
        shading: { fill: NAVY, type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            children: [new TextRun({ font: "Calibri", size: 18, bold: true, color: WHITE, text: col })],
          }),
        ],
      })
    ),
  });
}
```

### Document Skeleton

```javascript
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Calibri", color: NAVY },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Calibri", color: PRIMARY },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Calibri", color: DARK_TEXT },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },       // US Letter
        margin: { top: 1440, right: 1440, bottom: 1200, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PRIMARY, space: 4 } },
            spacing: { after: 0 },
            children: [
              new TextRun({ font: "Calibri", size: 16, color: MUTED, text: "CONFIDENTIAL  |  [COMPANY] INTERNAL" }),
            ],
          }),
        ],
      }),
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: "D1D5DB", space: 4 } },
            tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
            children: [
              new TextRun({ font: "Calibri", size: 16, color: MUTED, text: "[Company] Meeting Brief  |  [domain]" }),
              new TextRun({ font: "Calibri", size: 16, color: MUTED, text: "\t[Date]" }),
            ],
          }),
        ],
      }),
    },
    children: [
      // === TITLE BLOCK ===
      // "MEETING BRIEF" label
      // Company name (large)
      // Subtitle with contacts
      // Date line

      // === EXECUTIVE SUMMARY (heading + body paragraphs) ===

      // === KEY CONTACTS TABLE ===

      // === OUR TEAM PARTICIPANTS (label + bulletItems) ===

      // === COMPLETE TIMELINE TABLE ===

      // === USE CASES (heading + H2 subheadings + bulletItems) ===

      // === COMMERCIAL TERMS (heading + body with bold+normal TextRuns) ===

      // === MSA/NEGOTIATION STATUS (heading + H2 + bulletItems) ===

      // === STRATEGIC CONTEXT (heading + H2s + body + bulletItems) ===

      // === RISK FACTORS (heading + bulletItems with bold labels) ===

      // === TODAY'S MEETING (heading + body + H2 + numbered bulletItems) ===

      // === KEY DOCUMENTS (heading + bulletItems) ===
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/home/claude/[Company]_Meeting_Brief.docx", buffer);
  console.log("Done");
});
```

### Title Block Pattern

```javascript
// MEETING BRIEF label
new Paragraph({
  spacing: { after: 40 },
  children: [
    new TextRun({ text: "MEETING BRIEF", font: "Calibri", size: 18, bold: true, color: PRIMARY }),
  ],
}),
// Company name
new Paragraph({
  spacing: { after: 80 },
  children: [
    new TextRun({ text: "[Company] Partnership", font: "Calibri", size: 48, bold: true, color: NAVY }),
  ],
}),
// Subtitle
new Paragraph({
  spacing: { after: 40 },
  children: [
    new TextRun({
      text: "[Contact Names]  |  Engagement History & Current Status",
      font: "Calibri", size: 24, color: MUTED,
    }),
  ],
}),
// Date
new Paragraph({
  spacing: { after: 300 },
  children: [
    new TextRun({ font: "Calibri", size: 20, color: MUTED, text: "Prepared: [Date]  |  Author: [User Name]" }),
  ],
}),
```

---

## Step 5: Validate and Deliver

```bash
python /mnt/skills/public/docx/scripts/office/validate.py [output].docx
```

If validation passes, copy to `/mnt/user-data/outputs/` and call `present_files`.

---

## Handling Missing Data

Not every brief will have all sections. Adapt:

- **No MSA/legal activity** → Omit Section 8 entirely. Don't include empty sections.
- **No pricing discussed** → Omit Section 7. Note in executive summary: "No commercial terms have been formally shared yet."
- **No upcoming meeting** → Rename Section 11 to "Recommended Next Steps" and suggest actions instead of meeting objectives.
- **Gmail not enabled** → Note in executive summary: "Email thread data was not available for this brief. Enable Gmail integration for a more complete picture."
- **Sparse data** → If only 1-2 touchpoints exist, produce a shorter brief. Don't pad with speculation. State clearly what is known vs. unknown.

---

## Quality Checklist

Before delivering, verify:

- [ ] Every calendar event is represented in the timeline
- [ ] Every Slack call summary is reflected in the timeline
- [ ] All contacts from all sources are in the contacts table (deduplicated)
- [ ] All email addresses discovered are included
- [ ] RSVP statuses are noted (especially "needsAction" — signals low engagement)
- [ ] The executive summary mentions the current deal stage
- [ ] If there's a meeting today/soon, it's prominently featured
- [ ] Risk factors are honest, not just positive spin
- [ ] Recommended objectives are specific and actionable (not generic)
- [ ] Brand colors are applied consistently
- [ ] Document passes validation
- [ ] File is in `/mnt/user-data/outputs/` and `present_files` is called
