---
name: meeting-recap-email
description: "Generate a professional email recap of a meeting and draft it to the attendees. Trigger on 'recap that meeting', 'send a recap', 'meeting follow-up email', 'summarize the meeting and email it', 'write a recap to the attendees', 'draft a follow-up from that call', 'send meeting notes', 'email the recap', 'recap email', 'post-meeting email', 'send the attendees a summary', or when the user provides a transcript and says 'turn this into a follow-up email'. Also trigger for partial requests like 'follow up from that call'. Pulls attendees from Google Calendar, extracts decisions and action items from transcripts/notes, and drafts via message_compose or Gmail. Do NOT use for deep call analysis or PDF reports (use analyze-call) or pre-meeting briefs (use account-brief-generator)."
---

# Meeting Recap Email Generator

Generate a concise, action-oriented email recap of a meeting and draft it to the attendees using the message_compose tool or Gmail.

## Overview

This skill takes a meeting transcript, notes, or context and produces a professional recap email that reinforces decisions, locks in action items with owners and deadlines, and sets the tone for next steps. The email is drafted via `message_compose_v1` (preferred) or Gmail tools if available.

---

## Step 1: Gather Inputs

You need three things to generate a good recap: what happened, who was there, and the meeting context. Gather them from whatever combination of sources is available.

### 1a. Meeting Content (required — at least one source)

Look for the meeting content in this priority order:

1. **Transcript uploaded or pasted** — richest source. Read the full transcript.
2. **Notes provided by user** — may be bullet points, a summary, or rough notes.
3. **Past conversation context** — if the user says "that call we just discussed" or "the meeting I just told you about," search conversation history using `conversation_search` with relevant keywords (company name, contact name, topic).
4. **Calendar event** — if the user references a specific meeting ("my 2pm with Centene"), pull it from Google Calendar to get the title, attendees, time, and any attached notes/agenda.

If no content is available, ask the user: "Could you share the transcript, notes, or key points from the meeting? I need something to work from."

### 1b. Attendee List (required)

Determine who should receive the recap:

1. **From the transcript** — extract all named participants and their companies/roles.
2. **From Google Calendar** — if the user names a calendar event, use `gcal_list_events` to pull the attendee list with emails and RSVP status. Use `condenseEventDetails=false` to get full attendee info.
3. **From the user** — if attendees aren't clear, ask: "Who should receive this recap?"

Separate attendees into:
- **External** (client/partner/prospect) — these are the TO recipients
- **Internal** (Anyreach team) — CC'd unless the user says otherwise

If the user says "send to the attendees" without specifying, default to all attendees on the calendar invite or all participants in the transcript.

### 1c. Meeting Context (helpful but not required)

From memory, conversation history, or the user's request, identify:
- **Company name** and relationship context (prospect, partner, client)
- **Deal stage** if applicable (discovery, pilot, negotiation, etc.)
- **Meeting purpose** (first call, demo, negotiation, check-in, kickoff, etc.)
- **Sender identity** — who is sending the email (default: Richard unless specified)

---

## Step 2: Analyze the Meeting

Extract the following from the transcript/notes. Not every meeting will have all of these — include only what's relevant.

### Decisions Made
Concrete agreements or conclusions reached during the meeting. These are things both sides committed to or aligned on. Be specific — "agreed to move forward with a pilot" is better than "discussed next steps."

### Action Items
The most critical section. For each action item, capture:
- **What** — the specific task or deliverable
- **Who** — the person or team responsible (use actual names)
- **When** — the deadline or timeframe (if discussed; if not, note "TBD" but suggest a reasonable deadline)

If action items weren't explicitly stated, infer them from commitments people made during the call ("I'll send that over" → action item for that person).

### Key Discussion Points
The 3-5 most important topics discussed, distilled to one sentence each. These aren't minutes — they're the headlines. Focus on what would matter if someone missed the meeting.

### Open Questions / Parking Lot
Items that were raised but not resolved, or that need further exploration. These signal awareness and prevent things from falling through the cracks.

### Next Meeting / Next Steps
Any agreed-upon follow-up meeting, timeline for next touchpoint, or general next steps.

---

## Step 3: Draft the Email

### Email Structure

The email follows a consistent structure. Keep it tight — a recap email should take 90 seconds to read.

```
Subject: [Meeting Title] — Recap & Action Items | [Date]

---

[Greeting — personalized to primary recipient or group]

[1-2 sentence summary of the meeting: what it was about, the key outcome or tone]

**Key Discussion Points**
• [Point 1]
• [Point 2]
• [Point 3]

**Decisions**
• [Decision 1]
• [Decision 2]

**Action Items**
• [Owner]: [Task] — [Deadline]
• [Owner]: [Task] — [Deadline]
• [Owner]: [Task] — [Deadline]

**Next Steps**
[Next meeting date/time if known, or proposed timeline]

[Closing — warm but professional, matches the relationship stage]

[Signature]
```

### Writing Style Guidelines

These principles ensure the email reads like it came from a founder, not a meeting bot:

- **Lead with the outcome, not the process.** "We aligned on launching a 90-day pilot starting June 1" beats "We discussed the potential for a pilot program."
- **Action items are sacred.** Every action item needs a name attached to it. If no name was assigned during the meeting, assign one in the email (this is a power move — it creates accountability).
- **Be direct but warm.** The tone should feel like a competent peer confirming what was agreed, not a secretary taking minutes. Match the relationship stage: more formal for first meetings, more casual for established relationships.
- **Use the recipient's language.** If they called it a "proof of concept," don't rename it to "pilot." Mirror their terminology.
- **No filler.** Cut "Thank you for your time" unless it's genuinely the first meeting. Cut "As discussed" — they know it was discussed, they were there. Cut "Please don't hesitate to reach out" — of course they can reach out.
- **Signal momentum.** The recap should make the deal feel like it's moving forward. End with a specific next step or proposed date, not an open-ended "let us know."
- **Keep it scannable.** Bold labels, short bullets, clear hierarchy. The recipient should be able to forward this to their boss and it should make sense without context.

### Tone Calibration by Meeting Type

| Meeting Type | Tone | Subject Line Pattern | Special Emphasis |
|---|---|---|---|
| First call / Discovery | Professional, enthusiastic but not eager | "[Company] × Anyreach — Intro Call Recap" | Use cases discussed, mutual fit |
| Demo / Technical | Confident, capability-focused | "[Company] Demo Recap — Next Steps" | What was shown, what impressed, follow-up items |
| Negotiation / Commercial | Precise, forward-looking | "[Company] Discussion Recap — Action Items" | Terms discussed, what's agreed vs. open |
| Partnership alignment | Collaborative, strategic | "[Company] Partnership — Meeting Notes" | Shared goals, integration points, joint action items |
| Check-in / Status | Casual, efficient | "[Company] Check-In — Quick Recap" | Progress updates, blockers, next checkpoint |
| Kickoff | Energetic, structured | "[Company] Kickoff — Recap & Timeline" | Roles, milestones, communication cadence |

### Handling Internal-Only Recaps

If the user says "internal only" or "just for the team," adjust:
- Drop the warm greeting — use "Team," or "Quick recap:"
- Be more candid about the read on the meeting (include internal assessment)
- Include strategic notes about next moves that you wouldn't share externally
- Add a "Read on the Room" section with honest assessment of each stakeholder's engagement level

---

## Step 4: Deliver the Email

### Option A: message_compose (preferred for external emails)

Use the `message_compose_v1` tool with `kind: "email"`. This gives the user a polished draft they can review, edit, and send from their mail client.

Choose the right number of variants based on the situation:
- **1 variant** (default) — most meeting recaps are straightforward. Just draft the email.
- **2 variants** — if there's strategic ambiguity about how to frame the meeting (e.g., "Do we lead with the timeline pressure or play it cool?"), offer two approaches with clear labels like "Create urgency" vs. "Keep it collaborative."

Include a subject line for each variant.

### Option B: Gmail (if user explicitly asks to send)

If the user says "send it" or "email it now" and Gmail tools are available:
1. Use `tool_search` to find Gmail send tools
2. Draft the email content
3. Show the user the draft first and ask for confirmation before sending

Never send an email via Gmail without the user confirming the draft first.

### Option C: Inline (if user just wants the text)

If the user says "just write it" or "give me the text," provide the email inline in the conversation. Don't use message_compose — just write it out.

---

## Step 5: Offer Follow-Up

After delivering the recap, briefly offer:
- "Want me to add a calendar invite for the next meeting?" (if a follow-up was discussed)
- "Should I also send an internal-only version with your read on the room?" (if the recap was external)

Keep these offers to one line each — don't be pushy.

---

## Edge Cases

### No transcript — only a calendar event
If the user says "recap my 2pm meeting" but provides no notes or transcript:
1. Pull the calendar event for context (title, attendees, time)
2. Search conversation history for any discussion about this meeting
3. If still no content, ask: "I can see the meeting was with [attendees] about [title]. Could you give me the key points and any action items? I'll turn them into a polished recap."

### Multiple meetings to recap
If the user asks to recap several meetings at once, handle them sequentially. Draft each as a separate email with its own subject line and attendee list.

### Transcript from a third-party tool
If the user uploads a transcript from Otter, Fireflies, Gong, or another tool, parse it as-is. These transcripts often have timestamps and speaker labels — use them to improve accuracy but don't include timestamps in the email.

### User wants to customize the format
If the user has a preferred recap format or template, follow it. The structure above is the default, but the user's preference takes priority.

---

## Quality Checklist

Before delivering the recap email, verify:

- [ ] Subject line includes the company/meeting name AND the date
- [ ] Every action item has an owner (a specific person's name)
- [ ] No action items were missed from the transcript/notes
- [ ] Decisions are stated as facts, not as "we discussed possibly doing X"
- [ ] The tone matches the relationship stage and meeting type
- [ ] No internal-only commentary leaked into an external-facing email
- [ ] Next steps or follow-up meeting is mentioned
- [ ] The email is scannable in under 90 seconds
- [ ] Recipient list is correct (external TO, internal CC)
