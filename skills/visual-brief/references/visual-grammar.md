# Visual grammar

How to go from dense material to a page the eye reads faster than text. Read this when choosing what to draw and how to word it.

## 1. The hero-contrast method

1. **Collect every figure** with its basis (what it is a share of, what period it covers). Dense material usually has 15–40 of them.
2. **Pair figures into ratios.** Input vs output (dials vs conversations), before vs after (6.5% vs 1.9%), one cohort vs another (4.24 vs 1.61), cost vs price ($14–28K vs $2K), what is captured vs what is not (27% vs 84% unknown).
3. **Rank the ratios by surprise.** The hero is the one a reader would repeat to a colleague. It usually spans more than an order of magnitude or reverses an expectation ("activity is above the minimum, and 94% of it reaches no one").
4. **The hero goes on the cover**, drawn at true scale, with the headline carrying the two numbers: "49,675 dials. 130 real conversations."
5. **Two or three supporting contrasts** become the middle bands. Each gets a claim headline.
6. **Everything else** is context (chips, cards, a rail) or a caption.

If no ratio is surprising, the material is not a diagnostic; it is probably a plan or a proposal. Use the proposal band library below instead of forcing a dramatic chart.

## 2. Data shape → form

| Shape | Form | Notes |
|---|---|---|
| A small part of a huge whole (0.1–10%) | **Waffle of 1,000 cells**, 40 × 25 | Per-1,000 framing lets 0.26% exist as 3 cells. Legend states the exact value ("2.6, drawn as 3"). Fill order: rarest first, top-left. |
| Two or three points in time | **Vertical bars** with a dashed drop line and the delta as a red label | Only the points you have; do not interpolate months you were not given. |
| One cohort vs another | **Horizontal bars** on one axis, the better cohort in accent, the multiple in the caption | Gridlines at round numbers the bars actually reach. |
| A rate between 0 and 100% | **Meter** (track + fill) with the number right-aligned | Red fill when the number is a loss ("84% unknown"). Grow once on entering view. |
| A range against a point | **Range bars** on one money axis | The range is a filled bar from low to high; the point is a small block. Same axis for both or the comparison lies. |
| A sequence with order | **Rail** (vertical, nodes light up) or **timeline** (horizontal, weeks above) | Number the nodes only if the order is information. |
| A leak through stages | **Flow simulation** (canvas, dots at real rates) or sankey | Simulation when the point is magnitude; sankey when the point is which path each unit took. |
| Two options | **Lanes** side by side, `VS` between, the recommended one in deep indigo | Bullets inside lanes are fine; this is the one place a list is a list. |
| Categories, no order | **Chips** | Wrap. Never numbered. |
| A set of fields or criteria | **Field grid** with a leading index in accent | Index only if the source numbers them or the count is the message ("ten fields"). |
| Pre-agreed thresholds | **Gate rows**: label, `from → ≥ target` in Literata | The arrow is the visual; keep targets as multiples or percentages, as the source states them. |
| A proposal | **Benefit cards** (big figure + claim + two lines) → proof timeline → structure tiles → quiet terms box | Price last, small, grey, dashed border. |

## 3. Color semantics

Pick a meaning for each color at the start and write it into the legend of the first visual that uses it. Then never reuse a color for a different meaning anywhere on the page.

Defaults that have worked:

- **Grey** — nothing happened, the unweighted mass, the control.
- **Amber** — partial, live but not the target, a caution, an internal flag.
- **Indigo** — the thing the reader wants, the right party, Anyreach's contribution, the recommended option.
- **Red** — a loss, a decline, a cost that exceeds its price.
- **Green** — a resolved outcome, a meeting set. Use sparingly; one green chip per page is plenty.

Body text, labels and captions never take a series color. Big stat numerals may, when they are the thing the color means (a red 94%, an indigo 130).

## 4. Copy rules

- **Headlines are claims with numbers.** "Reach is getting worse as volume goes up, and who gets dialed matters 2.6×." Never a topic label ("Contactability and targeting" is the eyebrow, not the headline).
- **Captions carry the basis and the provenance.** "Share of applicable calls in Televerde's analyzed SDR call sets." "Per-1,000 figures derived from the reported totals." One caveat per caption at most.
- **Lists become structure.** Seven incumbents → chips. Ten fields → a field grid. Six steps → a rail. Five asks → cards with the same four slots each (number, title, Today, Ask, data tag).
- **Repeated elements share a template.** Every card in a row has the same slots in the same order; if one card lacks a slot, leave it empty rather than restructuring.
- **The source's own verdict is a pull quote** when it exists ("Activity is not the constraint…"). It does more than any paraphrase.
- **Plain sentences.** No em-dash asides, no "not X but Y", no colon-reveals, no "worth noting". Short.
- **Name the page like a product.** `RUCKUS Pilot Brief`, `Startek Renewal Brief`, `Q3 Funnel Brief`. Two to four words, no colon explainer.

## 5. Band library by goal

Pick bands for the goal, not from habit.

**Diagnose a program or a problem** (the RUCKUS shape)
cover with hero contrast + simulation → what the thing is (3 context cards) → the leak (waffle + trend + cohort) → the quality problem (meters) → what changes (animated strip) → the asks → how success is judged → proposal → footer

**Compare options or vendors**
cover with the decision in one sentence → what each option is (cards) → the comparison grid on the criteria that matter (lanes or a scored table) → the deciding contrast (one chart) → recommendation card → footer

**Explain a plan or a proposal**
cover with the outcome ("hit the number with the team you have") → benefit cards with headline figures → timeline → scope and gates side by side → structure tiles → terms box → footer

**Report status**
cover with the three numbers that moved → one band per metric that changed, each a trend chart with the delta → what we did (rail) → what is next (timeline) → footer

**Teach a mechanism**
cover with the mechanism as a simulation → the pieces (cards with pictograms) → the sequence (rail or strip) → where it breaks (meters or a leak chart) → footer

## 6. Internal vs external

Everything about a counterparty that they did not tell you (their revenue, margins, costs, labor model, why they are shopping) and every note about how to negotiate (fallbacks, floors, what to withhold, "lead with X", "price against Y") lives in **one band** marked with the amber pill `Internal · Anyreach estimates, not <their> figures`. The footer's provenance column names that band.

The share-safe cut removes that band, removes posture language elsewhere (a "lead wedge" tag on a card, a "how to price it" in an eyebrow, a "they won't take fixed cost" in a paragraph), renumbers, keeps the light/dark alternation (flip the footer if needed), and rewrites the provenance column. Observations about the counterparty's own gaps stay only if reframed as a question worth asking together.

A proposal shown to the counterparty can still say what they earn from it (resale margin, a suggested retail price, a step-down fee). That is the pitch to them, not an estimate about them.
