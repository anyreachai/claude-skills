---
name: "discovery-to-proposal"
description: "Run Anyreach's discovery-to-proposal loop for any BPO, partner or client program: first read, discovery questions, diagnosis, economics, feasibility, stack fit, human-vs-AI design, pilot proposal, screenshare brief."
---

# Discovery to proposal

The loop Richard runs when a partner or client sends a problem (a program review, an RFP, a recap email, a "here's where we're stuck") and it has to become a pilot proposal he can screenshare. The reference run is the Televerde × RUCKUS Networks engagement (Oct 2026): a recap email, then a question list, then Justin's answers, then a brief that went through seven versions at https://claude.ai/artifact/B1QVFzHtaXqvKGQKLqQRca. Read it with the Artifact tool when you want to see the finished shape.

The output at each stage is short and scannable in chat. Richard reads on his phone and dislikes dense walls of text. Only build the visual brief when he asks for a doc, deck or presentation, and then use the `visual-brief` skill for it.

This skill is a sequence of stages. Richard enters at whatever stage the conversation is at ("give me the high level", "what should I ask", "how does this change the deck", "what's our pricing"). Figure out the stage, do that stage well, and offer the next one in one line.

## Before anything: what do we already know

Check memory for the partner (`/areas/<partner>.md`, the project's own copy if this chat is in a project) and related files: their existing pricing with Anyreach, the people involved, past deals. Partner pricing must stay consistent across partners (for example the $5K platform number matches iQor's Core number). Check `/areas/anyreach-live-deployments.md` before citing any customer as proof. Read attached files fully; PDFs of email threads often hide the real numbers in a forwarded section.

## Stage 1: The high level

Trigger: a new problem document arrives. Give, in this order and briefly:

1. **The ask in one line.** What the partner wants Anyreach to fix, in their terms.
2. **The numbers that matter.** 4–6 figures with their basis. Find the hero ratio (input vs output, e.g. 49,675 dials → 130 conversations).
3. **What they asked for**, as a numbered list in their language.
4. **How they'll judge it.** Their success metric, quoted if they stated one.
5. **Where Anyreach fits.** Separate the clean wedge (what Anyreach's platform does with data the partner already has) from the risky parts (what depends on third-party data, integrations or behavior change).
6. **Watch-outs.** Pilot design, sample size, data access, end-client approval.

Then answer the follow-ups that come naturally, like "who are they actually calling" (customer type, number type: mobile, direct dial, switchboard, toll-free) and what that implies.

## Stage 2: Discovery questions

Trigger: "what should I ask", "questions for <name>". Give a list grouped like this, with the gating questions first:

- **Must-asks (these gate what we can prototype):** recordings and transcripts (exist? where? exportable before the meeting?), the stack and who owns each license, the relevant hygiene already in place (e.g. number rotation), whether the end client knows an AI partner is coming and who signs off, paid pilot vs proof for a bigger deal.
- **Data:** source of contacts and refresh cadence, number/channel split, how the key outcome is dispositioned (human-entered or system-detected, and how much to trust it), when the trend changed and what changed.
- **Targeting:** who sets the ICP or routing, can they change it without the end client, intent data, size of the universe and whether it's saturated.
- **The floor:** headcount, tenure, attrition, who did any analysis they quoted (tool or manual, which calls), tooling on screen during live work, what comp is tied to.
- **Outcomes:** the exact definition of the paid deliverable, conversion between the last two stages (e.g. set-to-held), actual vs contractual pace, where intel goes, whether the end client pays for intel separately, what happens to "not now".
- **Pilot design:** baseline and the delta that counts as a win, can they split test and control (by accounts, not people, if attrition is high), timeline vs contract renewal or cancel clauses, exec sponsor.
- **Commercial and compliance:** who pays, contract structure (activity minimums vs outcome guarantees, penalties), other programs that look like this one, legal posture on AI-assisted contact, any DPA limiting where data goes.

Offer to make it a doc he can keep open during the call.

## Stage 3: When the answers come back

Trigger: "how does this change the deck", a pasted reply. For each answer decide: does it **confirm**, **kill** or **add** to the current story?

- **Kill your own hypotheses openly.** In the reference run, the caller-ID spam theory died when Justin said Regie rotates ten numbers per rep. Say so and remove it.
- **Look for a clock.** Cancel clauses, go/no-go dates, renewal windows. A deadline usually becomes the center of gravity of the whole pitch.
- **Reconcile contradictions** between their first document and their answers (e.g. a reported connect-rate drop vs "consistent at ~0.3%"). Drop the contested figure from anything on screen rather than argue it.
- **Spot the incumbent tool.** If they name a vendor in their stack (Regie in the reference run), check its website before positioning (Stage 6).
- **Note what must stay off screen:** attrition, underperforming staff, anything that embarrasses the person you're selling to.

If a brief exists, update it (see Stage 9) and summarize the changes as a short list, plus 2–3 notes for Richard only.

## Stage 4: Diagnose where it breaks

Trigger: "is the issue the tool or the people", "where's the leak". Lay the funnel out stage by stage with today's rate, a typical range, and a read:

| Stage | Today | Typical | Read |
|---|---|---|---|

State plainly that typical ranges are rough recollection, not sourced. Name which stages are a **data/targeting** problem, which are **people/process**, and which are **tool configuration**. Show the multiplier math: improving the top stage multiplies everything below it. End with 3–4 questions that would settle the diagnosis (e.g. outcome rate by rep: flat means data, spread means people) and how to frame it in the room without blaming their chosen vendor.

## Stage 5: Economics and feasibility (internal only)

Trigger: "what are they paying", "what are their margins", "can they even hit this", "what do we make". Everything here is back-of-envelope, labelled as estimates, and never goes on a screenshared page.

**Back-solve the program.** Volume per day → headcount; contract language → structure (activity SLA vs outcome-paid vs hybrid).

**What the end client pays the partner.** Per seat × seats, and per outcome × target, as two bases. Give a working range.

**The partner's cost and margin.** Labor (fully loaded, their actual labor model), supervision/QA/content, tooling, overhead. Margin on paper vs margin if they're paid on outcomes they're missing.

**Cost per outcome today.** Spend ÷ outcomes, at each funnel stage. This is the number to price against.

**Feasibility.** Work backwards from the target: outcomes needed → stage counts needed → rate needed, then check two ceilings: capacity (seats × activity × days) and universe (accounts × contacts × realistic yield). Give a scenario table (today, solid lift, best-in-class from day one) and say plainly if the target isn't reachable. Suggest the real lever if it's outside the program (e.g. widening the account universe; give rough market sizes, labelled as rough).

**What Anyreach makes and spends.** Proof fee, recurring per program, usage, kicker, roll-out across programs, any later consulting retainer. Costs: per-minute voice stack (rough, flag that Richard's actual cost is sharper), LLM extraction, setup engineer-weeks, ongoing FTE. Ask for his team's loaded rate to finish the labor math rather than inventing it.

## Stage 6: Stack fit and differentiation

Trigger: "what do we bring that <vendor> doesn't", "how do we play with their stack". Fetch the incumbent vendor's website first; don't rely on memory for what it does. Then:

- **What the incumbent does well, so don't compete there.**
- **A capability table:** capability, incumbent, Anyreach, why it matters for this program.
- **One sentence for the room** that makes Anyreach a layer on top of their tool, so the person who chose it still looks right.
- **One thing to verify** before the meeting (a feature the vendor may have shipped since).

## Stage 7: Compliance sanity

Run this whenever the design involves AI contacting people. Flag, with "I'm not a lawyer, run it past their counsel":

- **AI or prerecorded voice to personal mobiles** generally needs prior express consent under the TCPA; the FCC confirmed in 2024 that AI voices count, and has treated ringless voicemail as a call. B2B does not exempt it. Design around it: verify mobiles from data, use AI voice on business lines only, keep a human on any call to a mobile.
- **Disclosure** when an AI speaks or writes as a person.
- **Data processing:** where recordings and profiles live, and any DPA with the end client.

A compliant-by-design rule ("AI voice on business lines only") is a selling point for the risk-minded sponsor; put it on the page.

## Stage 8: Human vs AI by stage

Trigger: "what should be human vs AI", "design the workflow". Rule: **AI does the volume, the waiting and the paperwork; people own the live conversation with the buyer.** Give a table: stage, who (AI, human, AI + human, incumbent tool), and why. Then the 2–3 ideas with the biggest effect (in the reference run: AI holds the line through IVRs and hold, then warm-transfers; protect the conversion of meetings already won; turn every "not now" into timed nurture plus a billable profile). End with an "always human" list. If the partner's model is people-centered, frame AI as making their people's work better, not replacing seats.

Check the human/AI split against the proof scope. Anything not in the proof is marked "after the proof" so the page doesn't promise more than the pilot delivers.

## Stage 9: The proposal

Trigger: "closing slide", "commercial proposal", "what's our pricing". Use Richard's numbers when he gives them; otherwise propose this shape and ask him to confirm:

- **Proof:** fixed fee, short (6–8 weeks), cohort vs control, live in ~2 weeks with no integration into the partner's core systems. 50% at signature, 50% at readout; fully credited against the first months of recurring if they convert within 30 days. Usage beyond an included block at the standard per-minute rate.
- **Gates, agreed in writing up front:** relative to the control (e.g. ≥2× on reach, ≥1.5× on the paid outcome, a capture rate for intel). Relative gates keep the pilot judged on lift, not on whether the end client renews.
- **Recurring per program, wholesale to the partner:** platform fee, step-down from the second program, usage, and an outcome kicker on incremental results over the control. Aim for a total around the cost of one of their seats, so it's fundable from program margin or resold as the partner's own AI line.
- **Timeline anchored to their clock:** if there's a go/no-go date, put an interim readout before it.
- **Internal only:** a fallback if the partner must fund it alone (lower fee only with a longer commit triggered by the gates), cross-partner price consistency, and any later retainer kept out of the end-client conversation.

**Layout rule: benefits first, price last.** What the partner gets (headline-figure cards) → the proof timeline, scope and gates → recurring parts each described by what they see → a quiet "the numbers, in one place" box at the bottom.

**Design for both outcomes.** If the end client may cancel regardless, the pilot must still produce a portable result for the partner's next program. Say this to Richard explicitly when relevant.

## Stage 10: The brief

When Richard asks for a doc, deck or presentation, load the `visual-brief` skill and build with it. The typical band order for this loop:

cover (hero contrast, simulation, headline stats, their own verdict quoted) → the program (what they sell, who they call, what gets paid for) → the clock (if there is one) → the leak (funnel) → the conversation/quality problem + what changes (animated strip) → their asks → why Anyreach and how it fits their stack (stack diagram, different-jobs table, differentiators, who-does-what, always-human, easy-yes-for-ops) → how success is judged → the proposal → footer (sources, derived figures, still-open questions).

Keep any Stage 5 material in one internal band so the share-safe cut is one deletion. **Before Richard screenshares, make the share-safe version:** remove the internal band, posture language ("lead wedge", "price against"), estimates about the partner's finances or labor model, staff attrition, and anything that blames their vendor. Renumber the bands. Say what was removed.

When updating an existing brief, edit in place (same file path, same link), keep the light/dark alternation, re-run the render check, and fix inconsistencies the update exposes (e.g. a test-cohort description promising features the proof scope doesn't include).

## Stage 11: Account strategy

Trigger: "would getting close preserve the deal", "what's a win here". Be honest about whether "close" is actually close. What keeps an account alive: a trajectory, a credible explanation of the miss, and the cost of switching to someone new. Give a two-outcome table (end client extends / doesn't) with what Anyreach walks away with in each, the pilot design that makes both outcomes wins, and the internal political risk to name early ("we brought in AI and still lost the account"), with the control cohort as the defence.

## How to talk

- Short, scannable, tables where things are compared. No preamble.
- Bottom line first, then the reasoning.
- Label estimates as estimates and recollection as recollection; never invent a source.
- Correct yourself plainly when the user catches something ("Partly. He said it's a mix…").
- End with one next step or one question, not several.
- For anything Richard will send as himself, follow his email style preference (lowercase, conversational).