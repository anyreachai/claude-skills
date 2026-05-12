# Voice Guide — GTM Audit PDF

The PDF lives or dies on its **headlines**. Generic SaaS-dashboard
copy collapses the editorial feel and turns the brief into another
status report. This guide explains how to extract the audit's voice
from `strategy.md` and adapt it to the deck's headlines and copy.

---

## The pattern

Every section headline in this deck follows the same shape:

> A short (3–5 word) Fraunces phrase, with one or two italic words
> carrying the rhetorical weight.

Examples from the Anyreach reference deck:

| Page | Headline |
|---|---|
| 1 | `Pitch versus *data*.` |
| 2 | `Where the *gap* is.` |
| 3 | `Two systems, *one functioning*.` |
| 4 | `The ledger of *twelve*.` |
| 5 | `Decide in *30 days*.` |
| 6 | `Twelve moves, ranked by *impact ÷ effort*.` |
| 7 | `What it costs to *not act*.` |
| 8 | `The audit is not a *verdict*. It is a *checklist*.` |

Notice:

- Length: 3–7 words. Never longer.
- One or two italic words per headline. Never an entirely italic line.
- The italic word is the **emotionally loaded** word — `gap`, `not act`,
  `verdict`, `data`, `30 days`. Not the structural word — never
  italicize "the" or "of" or "system".
- A period at the end. Always. Even if the line is a fragment.

---

## How to derive headlines from `strategy.md`

The strategy memo is the deck's voice source. Read it carefully and
look for phrases that already carry the rhetorical weight you need:

1. **Page 1 (the audit's argument).** Look at the executive summary's
   first or last sentence. The Anyreach memo opens with "Anyreach's
   GTM tooling tells a different story than the company's pitch" →
   `Pitch versus *data*.`

2. **Page 2 (critical findings frame).** Look for the language used
   to describe the cluster of critical findings. Anyreach: "the
   GTM machinery is mostly off, and the parts that are running are
   running on the wrong target" → `Where the *gap* is.`

3. **Page 3 (tools framing).** This is usually about the *contrast*
   between tools — one functioning, one not; or two with different
   diagnoses. Anyreach: Apollo critical, Attio amber → `Two systems,
   *one functioning*.`

4. **Page 4 (full findings).** A meta-line about the finding count.
   Anyreach: 12 findings → `The ledger of *twelve*.`

5. **Page 5 (strategic shifts).** This is usually about a deadline
   or a forced choice. The Anyreach memo says "decide in the next 30
   days whether Anyreach is in founder-led-sales mode" → `Decide in
   *30 days*.`

6. **Page 6 (tactics).** A line that captures the prioritization
   logic. Anyreach: 12 tactics ranked by priority score = impact / effort
   → `Twelve moves, ranked by *impact ÷ effort*.`

7. **Page 7 (risks).** The cost of inaction. Anyreach memo's risks
   section frames each as "what diligence will find" → `What it costs
   to *not act*.`

8. **Page 8 (closing).** The deck's final word. The Anyreach memo
   doesn't have one, so the deck wrote one in voice: `The audit is
   not a *verdict*. It is a *checklist*.` This captures the
   diagnostic-not-prescriptive posture that runs through the whole brief.

---

## What to do if `strategy.md` is missing or generic

If the strategy memo doesn't have sharp phrases, write them from the
findings. Look at:

- **Severity counts.** "12 findings, 4 critical" → `Twelve, in *four
  buckets*.`
- **Top finding.** What's the single biggest issue? Distill to 2-3
  words and italicize one.
- **Known tradeoffs.** "Pick one ICP" → `Pick *one*.`
- **Deadlines.** "Within 30 days" → `Decide in *30 days*.`

Avoid:

- ❌ "GTM Stack Audit Findings" (generic, descriptive)
- ❌ "Critical Issues Identified" (passive, corporate)
- ❌ "Recommended Strategic Direction" (consultancy-deck cliché)
- ❌ "Twelve Findings to Address" (boring)
- ❌ Punctuation other than `.` or `?` at the end

---

## Body copy voice

The headline carries the weight. The body is the supporting evidence,
not the second wave of opinion.

| | |
|---|---|
| **Tone** | Direct, declarative, present tense. "The CRM is a 46K-row dump." Not "It appears that the CRM may be operating sub-optimally." |
| **Length** | Headline body = 1-2 sentences max. Page-level body = 2-4 sentences. |
| **Numbers** | Always wrapped in `mono(...)`. Always with their unit. "5 won deals in 14 months" not "5 deals" or "five wins". |
| **Italics in body** | Use sparingly — once or twice per page-body. Italicize the conceptual word: "The current state — paying for tools, telling the world there's a sales motion, but operating like a *single-CEO consulting practice* — is the most expensive of the three options." |
| **Forbidden words** | "leverage" (verb), "synergy", "best-in-class", "world-class", "robust", "seamless", "optimize" (use a more specific verb). |

---

## Section number labels

Every page has an eyebrow label like `01 · CRITICAL FINDINGS`. The
pattern:

- Two-digit number, zero-padded
- Middle dot (`·`, U+00B7)
- Section name in Title Case
- ALL UPPERCASE (handled by the `label_style` CSS)
- Comma-free

Examples: `01 · CRITICAL FINDINGS`, `02 · TOOL INVENTORY`, `03 ·
FINDINGS LEDGER`, `04 · THE THREE SHIFTS`, `05 · TACTICS, RANKED`,
`06 · RISKS IF STATUS QUO PERSISTS`. Page 1 (hero) uses the
client-and-date eyebrow instead. Page 8 (closing) has no eyebrow.

---

## Lime budget

The lime accent is the loudest visual moment in the deck. Use it
sparingly:

- **Maximum 2-3 lime moments** in an entire deck.
- **At most 1 per page.**
- **Reserved placements:**
  - Page 1: one word in the hero subhead body, OR one word in the
    headline (not both)
  - Page 2: the first detail tile's accent (the rest are indigoLight)
  - Page 5: the highlighted shift's accent + one word in the headline
  - Page 8: one italic word in the closing tagline

If a deck has more than 3 lime moments, demote ones that aren't on
the highest-stakes pages (1, 5, 8).
