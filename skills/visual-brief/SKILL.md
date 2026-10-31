---
name: visual-brief
description: "Turn dense, hard-to-read material (long emails, specs, program reviews, PDFs, transcripts, data dumps, RFPs, assessments) into a scannable scroll-deck brief — a single HTML artifact of alternating dark/light bands, each with one claim headline and one chart or diagram drawn to scale, plus at most two motion pieces that explain the core mechanism. Use whenever Richard drops content and asks for \"the high level\", \"make this visual\", \"easy to digest\", \"something I can screenshare\", \"a one-pager\", \"a brief\", \"a visual summary\", \"turn this into a deck-like page\", or says material is \"dense\", \"hard to read\", \"too long\", or \"wall of text\" — even when he does not say \"visual\". Also use for refreshes of an existing brief (\"add a section on X\", \"make it share-safe\", \"redo it in the deck style\"). Always start from this skill instead of designing a page from scratch: it carries the visual grammar, the Anyreach deck design system, the motion patterns, and the internal/external split that past briefs got right."
---

# Visual brief

Turn something dense into something a busy reader scans in two minutes and a counterparty can watch on a screenshare. The reference build is the RUCKUS × Televerde pilot brief at https://claude.ai/artifact/B1QVFzHtaXqvKGQKLqQRca (read it with the Artifact tool, `action: "read"`, when you want to see the finished shape). The bundled `assets/template.html` is that page with its content stripped out and the helpers kept.

The job is not to make the material shorter. It is to find what the material is actually saying, show that in a form the eye reads faster than text, and keep every number traceable.

## 1. Get the goal before anything else

A brief has one reader and one job. Ask yourself (or Richard, in one line, if it is genuinely unclear):

- **Who reads it, and in what setting?** Richard alone, prepping. His team. A partner on a screenshare. An investor. The setting decides what can be on screen (see §6) and how much explanation each visual needs.
- **What should the reader do or believe at the end?** "Agree the pilot is about reach, not coaching." "Approve the pricing." "Understand why this vendor is shopping." Write this sentence down; every band has to earn its place against it.
- **What is the source?** Someone else's document (their claims, their numbers), Richard's own analysis (his estimates), or a mix. The provenance of each figure matters later.

If the goal is obvious from the conversation, do not ask. Richard prefers you take the reasonable reading and go.

## 2. Pull the numbers out before you lay anything out

Read the whole source. Build a plain table in your head or a scratch file, one row per figure:

| figure | value | basis | provenance |
|---|---|---|---|
| dials | 49,675 | through Oct 14 | reported by Televerde |
| right-party rate | 0.26% | 130 ÷ 49,675 | derived |
| price per meeting | $1.5–2.5K | market band | Anyreach estimate |

Three provenance classes, and they never blur:

- **Reported** — the source said it. Quote the basis ("share of applicable calls", "through Oct 14").
- **Derived** — arithmetic on reported figures. Show the arithmetic in a caption once ("per-1,000 figures derived from 49,675 dials and 130 conversations").
- **Estimated** — Richard's or your back-of-envelope. Lives in its own band, flagged, and removable (§6).

Never invent a figure to fill a chart. If a split is not in the source (say, how much of "non-live" is voicemail vs invalid), draw the aggregate and say so in the caption. Readers forgive a missing number; they do not forgive a made-up one.

## 3. Find the hero contrast

Every dense document hides one ratio that makes the whole thing click: 49,675 dials → 130 real conversations; 94% of effort reaching nobody; a meeting that costs ten times what it is priced at. Find it. It becomes the cover headline and the first visual, drawn at true scale so the gap is seen rather than stated.

Then look for the two or three supporting contrasts (a trend that moved the wrong way, a cohort that outperforms 2.6×, an execution rate under 25%). Those are the middle bands. Everything else is context or a list, and lists become chips, rails or cards, never bullet dumps.

The test for every band: does the reader know something after this visual they could not have gotten as fast from a sentence? If not, cut it or fold it into a caption.

## 4. Choose the form from what the data is

Read `references/visual-grammar.md` for the full mapping and the copy rules. The short version:

| the data is… | draw it as… |
|---|---|
| a small part of a huge whole | 1,000-cell waffle (per-1,000 makes 0.26% visible as 3 cells) |
| a change between two or more points in time | vertical bars with the delta called out, or a slope |
| a ratio between cohorts | horizontal bars, labelled with the multiple |
| how often something happens (0–100%) | meters, red when the number is a loss |
| a range against a point (cost vs price) | range bars on one dollar axis |
| a sequence that must happen in order | a rail or timeline with lit nodes |
| a leak through stages | a flow simulation (canvas) or sankey, at the real rates |
| two options compared | side-by-side lanes, one highlighted |
| a list of categories | chips; numbered only if the order is information |
| a proposal or decision | benefits first as cards, terms last in a quiet dashed box |

Charts are drawn to scale, always: one axis, labels that name values the chart actually reaches, text from the theme tokens. A bar that is "too small to see" is the point; give it a 4px minimum and let the caption say "drawn as 3".

## 5. Build it as a scroll deck

Open `assets/template.html` and `references/design-system.md`. The page is a sequence of full-bleed **bands** alternating dark `#0C0C12` and light `#F7F7F4`, in the Anyreach web brand (Literata headlines and big numerals, Inter body, indigo accent). Each band has:

1. An indigo uppercase **eyebrow**: `02 · The leak`. Numbered because a brief is read in order.
2. A **claim headline** in Literata — a sentence with a number in it, not a topic. "Of every 1,000 dials, 60 reach a human. Fewer than 3 reach the right one." not "Funnel analysis".
3. One **visual** (sometimes two side by side when they answer the same question).
4. A **caption** of one or two lines: basis, provenance, and the one caveat that matters.
5. A faint giant **section numeral** top-right (the `.bignum`), the deck-divider motif.

Typical band order for a diagnostic brief: cover (hero contrast, motion, headline stats, the source's own one-line verdict as a pull quote) → context (what the thing is, in three cards with flat pictograms) → the problem bands (two or three) → the mechanism band (what changes, with the animated strip) → the asks or options → how success is judged → the proposal → footer (next step, sources, what is derived vs estimated). Adapt freely; the order follows the goal from §1, not this list.

**Color semantics are declared once and never change across the page.** Pick them for the subject and keep them: in the RUCKUS brief grey = nothing happened, amber = partial, indigo = the thing we want / Anyreach's contribution, red = a loss. Body text never takes a series color; big stat numerals may.

**Motion explains, it does not decorate.** At most two pieces per brief, and only where a mechanism is easier to watch than to read:
- A **canvas flow simulation** on the cover, running the real rates (1,000 dots at 94/5.7/0.26%). Painted dark background, loops, pauses off-screen, reseeds on return.
- A **three-panel animated strip** (Web Animations API, one shared loop) for before/during/after or input/process/output stories.

Both patterns, with code, are in `references/motion.md`. The page must be complete at rest: reduced-motion viewers get a finished static frame, never an empty box, and nothing waits at `opacity: 0` for a scroll trigger. Meters may grow once when they enter view because their resting state is full.

**Responsive and clean.** One HTML file, no libraries, phone width works, no horizontal scroll, gutters via `max(16px, env(safe-area-inset-*))`, every control has a stable id. Fonts from Google Fonts with real fallbacks. Load the `artifact-design` skill before writing if it is listed; its page contract is the one the Artifact viewer enforces.

## 6. Internal and external are different pages

Briefs get screenshared. Design for the cut from the start:

- Anything estimated about a counterparty (their revenue, margin, cost structure, labor model), any negotiation notes (fallbacks, floors, what to keep out of the conversation), and any "lead wedge / price against X" posture goes in **its own band** with an amber **Internal · Anyreach estimates** pill. One band, so the share-safe cut is one deletion.
- Observations about the counterparty's own blind spots are fine externally if framed as a question worth asking ("One more thing to check"), not as a gap in their work.
- A proposal band states what the counterparty gets first (as cards with the headline figures), the proof and its gates second, the structure third, and the numbers last in a quiet dashed "the numbers, in one place" box. Price is the afterthought of the benefit, by layout.
- When asked for the share-safe version: remove the internal band, strip posture language elsewhere (tags, headlines), renumber the bands, keep the dark/light alternation, and update the footer's provenance note. Say what was removed. The previous version stays in the artifact's history.

## 7. Check once, publish, reply short

Run `scripts/check.py <file>` (Playwright): it asserts `scrollWidth` equals the viewport at 1280 and 400, zero page errors, `document.getAnimations().length > 0` when the strip is present, and writes a desktop screenshot plus a phone screenshot and a frame of each motion piece. Look at them once, make one pass of fixes (text that overflows its pill, labels on a line, a count that reads wrong), and publish with the Artifact tool. New page: `icon: "chart"`, a one-sentence description, title as a short name (`RUCKUS Pilot Brief`). Refresh: same file path, so the link holds.

Write the chart's own font-size rules when an SVG is scaled up (a 360-wide viewBox at 520px makes 12px text read as 17px).

Reply in a few short paragraphs: what the hero visual shows, what the motion pieces do, the one judgment call you made (a split you inferred, a range you chose), and whether the page is share-safe. No URL paste, no step recap, no list of sections.

## Files

- `assets/template.html` — the stripped reference build: tokens, band CSS, component CSS, waffle builder, meter grow, the configurable flow simulation, the `tl()` strip helper, the range-slider pattern.
- `references/design-system.md` — tokens for both bands, type scale, every component with its CSS and when to use it, chart recipes with the arithmetic for drawing to scale.
- `references/visual-grammar.md` — data shape → form mapping in detail, the hero-contrast method, color semantics, copy rules, band library by goal, the internal/external split.
- `references/motion.md` — the canvas simulation and the animated strip: structure, timing, pause/resume, reduced motion, what to animate and what to leave still.
- `scripts/check.py` — the Playwright render check and screenshots.
