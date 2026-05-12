# Extraction Guide — Transcript → Data Model

How to read a raw discovery call transcript or meeting notes and fill
in the dashboard data model. The dashboard is only as good as the
extraction; this is where the work is.

---

## The five-pass read

Don't try to extract everything in one pass. Read the transcript
five times, each time looking for one specific signal class.

### Pass 1 — Skim for shape

Goal: figure out what kind of call this was, how engaged the prospect
was, what the deal is roughly about.

Note for yourself:
- Call duration
- Who spoke and roughly how often
- Was this a first-touch discovery or a deeper follow-up?
- What's the headline thesis — what is the prospect actually trying
  to solve?

This pass produces `PROJECT.headline`, `PROJECT.frame`, and
`PROJECT.eyebrow`.

### Pass 2 — Stakeholders

Walk through the transcript and list every name mentioned, on-call or
referenced. For each one, capture:

- Title (from intro round or signature lines)
- Whether they were on the call
- Their longest / most revealing quote
- Role in the deal (see role rubric below)
- Sentiment (see sentiment rubric below)
- Influence 1–5 (see influence rubric below)

Common discovery-call attendee composition:
- 1 champion (pulled you in, often most enthusiastic)
- 1 economic buyer (often quiet, asks pointed cost questions)
- 1–2 technical evaluators (asks about integrations, security)
- 1–2 end-user voices (operational reality)
- Sometimes a gatekeeper (procurement, security)

Output: `STAKEHOLDERS` array.

#### Role rubric

| Role | Signal | Example phrase |
|---|---|---|
| `champion` | Pulled you in, defends scope, knows your product better than the others | "I sent the team your one-pager last week" |
| `economic_buyer` | Asks about pricing model, talks budget, signs the contract | "And the licensing structure is per-seat or per-call?" |
| `technical` | Asks integration / architecture / security questions | "How do you handle PII redaction in transcripts?" |
| `user` | Talks about day-to-day workflow, operational pain | "My team is on hold for 11 minutes some afternoons" |
| `influencer` | Senior, not the buyer, but listened to | Mostly listens, makes 1–2 weighty comments |
| `gatekeeper` | Compliance, security, procurement, legal | "I need to see the DPA before this goes anywhere" |

#### Sentiment rubric

| Sentiment | Signal |
|---|---|
| `positive` | Volunteers next steps, uses "we" / "us", quotes specifics back at you |
| `neutral` | Asks clarifying questions but doesn't endorse |
| `skeptical` | Asks "what about" or "how do you handle" questions with implied doubt |
| `blocker` | Pushes back substantively, raises objections that aren't resolved |

#### Influence rubric

| Influence | What it means |
|---|---|
| 5 | Can sign the contract or kill the deal alone |
| 4 | Recommends to the signer, decision rarely reversed |
| 3 | One of several inputs to the signer |
| 2 | Sub-team voice, no veto power |
| 1 | End-user voice, mostly informational |

---

### Pass 3 — Pain points and value mapping

Walk through and mark every time the prospect describes a problem.
Pull the language they used, the numbers (if any), and the speaker.

For each pain, ask: **did they quantify it?** If they said "we're
losing about $400K a quarter" or "31% of after-hours calls drop", the
pain is quantified. Otherwise it's qualitative.

Severity rubric:
- `high`: urgency language — "hemorrhaging", "this quarter", "we
  have to", "we're losing $X". Or: it appears 3+ times across the
  call.
- `medium`: real pain, no urgency framing.
- `low`: mentioned once, not core to the deal.

For each pain, pair it with **the Anyreach answer** the rep offered
on the call (or what they should have offered). This becomes
`VALUE_PROPS`. If no answer was offered yet, set `linkedValuePropId`
to `null` — the dashboard will render that gap explicitly, which is
useful for next-call prep.

Output: `PAIN_POINTS` + `VALUE_PROPS` arrays.

---

### Pass 4 — Scope, decision, competition

This pass is more mechanical — pull factual content into the
structured fields.

#### Scope

- **Channels**: voice / chat / SMS / email / WhatsApp / webchat. For
  each one mentioned, mark `committed` / `probable` / `exploratory` /
  `out` based on the language.
  - "yes we want voice" → committed
  - "we'd probably want chat too" → probable
  - "and maybe SMS down the road" → exploratory
  - "email we handle in-house" → out
- **Languages**: any mentioned. English is default.
- **Integrations**: every system named. Mark complexity based on
  what you know (CRM = medium, custom core banking = high, SIP
  trunk = low).
- **Use cases**: every workflow the prospect described the agent
  doing.
- **In-scope vs out-of-scope**: explicit "yes do this" / "no don't
  do this" statements.
- **Technical requirements**: security, compliance, data residency,
  uptime, latency. Mark each as `open` / `confirmed` / `blocked`.

#### Decision

- **Criteria**: what did they say matters? Look for "we need" / "for
  us the most important thing is" / "the deal-breaker is".
- **Process**: every gate mentioned (security review, procurement,
  legal, board approval). Map to `process` array with owner + date.
- **Timeline**: pilot start target, pilot end target, expansion
  target. If only one date was mentioned, infer the others ±12 weeks.

#### Competition

- Any vendor named on the call goes in `COMPETITION`.
- The incumbent (often "what we do today" or "Verint" / "Genesys" /
  in-house IVR) is always a competitor — list it even if not named
  as such.
- Threat level: `high` if actively evaluating, `medium` if mentioned
  in passing, `low` if not actively considered.

Output: `SCOPE`, `DECISION`, `COMPETITION`.

---

### Pass 5 — Risks, open questions, next steps

This is the "what now" pass.

#### Risks

What could kill this deal? Re-read with a paranoid lens. Each risk
needs:
- A concrete description
- Impact (high/medium/low) — if this fires, how bad?
- Likelihood (high/medium/low) — how likely is it to fire?
- Mitigation — what do we do about it?
- Owner — who on our side handles it?

Common discovery-stage risk patterns:
- Security review demands a cert we don't have
- A key stakeholder wasn't on the call (and may say no later)
- The use case touches a system we haven't integrated before
- The buyer has a competing internal project / build-vs-buy debate
- Procurement timeline conflicts with pilot start
- Champion is mid-level — no senior sponsor identified yet

#### Open questions

The things we did NOT learn on the call. These are the highest-value
items because they shape the next-call agenda. Re-read with the
question: "if a board member asked me X about this deal, would I have
the answer?" — every X you can't answer goes here.

Common open-question patterns:
- Budget envelope
- Signature authority on the MSA
- Expansion roadmap beyond the pilot
- Internal politics around the project
- Conflicting initiatives on the same buyer's plate

#### Next steps

Pull every commitment from the call. Each one needs an owner and a
date. If a date wasn't given, infer a reasonable one based on the
pilot timeline (e.g., security review within 2 weeks of discovery).

Status values:
- `open`: committed, not yet done
- `done`: completed since the call
- `blocked`: waiting on something

Sort by priority. The top 3 will show in the Overview tab preview.

---

## Hero copy generation — the hard part

The hero headline is the dashboard's editorial signature. Generic
copy ("Discovery Dashboard for NWFCU") kills credibility.

### Algorithm

1. Read the transcript once more, looking only for phrases that
   capture **what's actually at stake**. Examples from real calls:
   - "we're hemorrhaging on after-hours"
   - "two queues, no shared visibility"
   - "the timeline is the timeline"
   - "we keep losing on Spanish-language coverage"

2. Compress to 4–8 words. Use parallel structure where possible:
   - "Two queues, *one mandate*." (parallel, with italic spotlight)
   - "The pain is *measured*, not vague." (rhetorical contrast)
   - "Decide by *Friday*." (ultimatum, lime spotlight)
   - "Six channels, *one* roadmap." (numeric contrast)

3. Italicize the word that carries the argument or emotion. That word
   goes in `PROJECT.spotlightWord` and renders as italic + lime.

4. Read it aloud. If it sounds like SaaS marketing copy ("Unify your
   member services experience"), throw it out and start over.

### Frame paragraph

The 50-word frame answers four questions in order:
1. **What's the problem?** (one sentence)
2. **What's the scope of our involvement?** (one sentence)
3. **What does success look like?** (one sentence, with metrics if
   they were named on the call)
4. **What's the urgency?** (implied via timeline mention)

Example:
> Member services is splitting calls across two contact centers with
> no shared queue. The 12-week pilot replaces their after-hours
> overflow agent with an AI agent on the NWFCU number, with success
> measured on containment rate and post-call CSAT.

That's 41 words, hits all four beats, no marketing speak.

---

## Anti-hallucination checklist

Before finalizing, audit your extracted data:

- [ ] Every stakeholder name appears in the source transcript or notes.
- [ ] Every quote is verbatim or labeled as paraphrase.
- [ ] No invented numbers. If "deal size" wasn't discussed, the KPI
      reads `'TBD'` not a guess.
- [ ] No invented integrations. If the prospect didn't name their
      CRM, don't write "Salesforce" — write "CRM (not named)".
- [ ] No invented dates. If pilot start wasn't discussed, leave the
      timeline TBD rather than imagining a date.
- [ ] Champion identification is conservative. If nobody was clearly
      championing the deal, mark the most-engaged person as
      `positive` sentiment but role `influencer`, not `champion`.

The dashboard's value is that it's true. If it has any one fabricated
detail, the deal team stops trusting it.
