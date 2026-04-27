---
name: bpo-roi-brief
description: "Generate a high-fidelity 3-page Anyreach-style ROI brief PDF for any BPO pitching their end-client on outcomes-based AI + human pricing. The PDF matches the exact format proven on the Fabletics × Startek deal — page 1 (current state vs. outcomes-based future state), page 2 (outcome definitions + client-specific priorities), page 3 (lighthouse pilot proposal). Trigger whenever the user asks to build, generate, draft, or produce a 'BPO ROI brief', 'outcomes-based pricing brief', 'AI replacement ROI', 'partner pitch brief', or any 3-page ROI deliverable for a BPO partner pitching an enterprise/end-client. Also trigger when the user provides BPO brand guide + client current-state metrics and asks for a 'pitch deck', 'ROI doc', 'partner brief', or 'savings analysis brief'. Always use this skill instead of writing a brief from scratch — it contains the full template, brand-adaptive design system, ROI math model (containment, blended cost, phased pricing cascade, lighthouse pilot value), and PDF rendering pipeline."
---

# BPO Outcomes-Based ROI Brief Generator

Generate a 3-page Anyreach-style ROI brief PDF for a BPO partner pitching their end-client on outcomes-based AI + human pricing. The format is proven — it's the exact deliverable Anyreach × Startek used with Fabletics. This skill produces the same artifact for any BPO/end-client combination.

## What this skill produces

A landscape 13.33" × 7.5" PDF, three pages:

1. **Page 1 — Current state vs. outcomes-based future state.** Side-by-side cards: estimated current CX spend (AI vendor + BPO labor) and the proposed phased per-resolved-outcome pricing. Ends with the four message cards (Savings from Day 1 / It Only Gets Better / Zero Ramp Risk / One Vendor One Price) and a consolidated total-value strip.
2. **Page 2 — Outcome definitions and stated priorities.** "Stake in the ground" hero with the resolution definition. Left column: outcome definitions per use case with attribution metrics. Right column: end-client's stated priorities + KPI alignment. Path-forward strip at the bottom.
3. **Page 3 — Lighthouse pilot proposal.** Anchor on a single use case the BPO can stand up in 6–8 weeks. Four cards: why this first / what we stand up / what client does / commercial offer. Value summary strip (savings + retained revenue) + decision strip.

The math model handles the financial cascade automatically — given volumes, FTE count, hourly rate, and current containment, it derives blended cost per outcome, phased pricing savings, year-1 / year-2+ totals, and lighthouse pilot value range. All figures cascade consistently across the three pages.

## When to use this skill

Trigger this skill when the user asks for any of the following:

- "Build me an ROI brief for [BPO] pitching [Client]"
- "Generate the same Fabletics-style brief but for [other client]"
- "Create a 3-page outcomes-based pricing brief"
- "Draft the partner pitch brief for [BPO]"
- "Make the AI replacement ROI doc for [Client]"

Also trigger when the user supplies BPO brand colors + a logo + end-client current state metrics and asks for a "ROI doc," "pitch brief," or "savings analysis."

Do NOT use this skill for:
- Single-page executive summaries (use the regular doc skill)
- Long-form proposals or SOWs (use proposal-sow-generator)
- Deck/slide presentations (use anyreach-startek-deck or shadcn-deck)
- Raw financial models in spreadsheet form (use xlsx skill)

## How to run it

The workflow is: gather inputs → write a config JSON → run the renderer.

### Step 1: Gather the inputs

The user will provide a mix of required and optional inputs. Map them to the config schema (full schema below). If anything required is missing, ask before proceeding.

**Required:**
- BPO name, label (e.g. "BPO" or "CCO"), brand navy hex, brand accent hex, logo file
- BPO's end-client name + short name
- Current state: contact volumes by channel, FTE count, hourly FTE rate, current AI containment rate (decimal, e.g. 0.225)
- At least 3 use cases with outcome definitions
- At least 3 client priorities

**Optional but recommended:**
- AI vendor name (defaults to "Cognigy") and any known annual spend (otherwise estimated from public per-conversation rates)
- Annual revenue (enables CX-as-%-of-revenue benchmark and retained-revenue calc)
- Tech stack list (Zendesk, Medallia, etc — adds credibility)
- Target KPIs the client has stated
- Containment source citation (footnote text)
- Lighthouse pilot details (volume share, target containment, 4 sets of bullets, phase 2 unlocks)
- Path-forward steps and decision-strip steps (sensible defaults provided if omitted)
- Revenue generation estimate (if pitching the upside layer)

When inputs are vague, lean toward asking. The brief lives or dies on the credibility of the current-state numbers — if the user hands you "around 1M chats and 800 FTEs at $10," push back and ask for tighter ranges. If the user has a Q&A response or RFP doc from the end-client, ask for it — sourced numbers go in footnotes and dramatically improve credibility.

### Step 2: Write the config JSON

Use `examples/fabletics_config.json` as a starting template — copy it, then swap in the new BPO and end-client values. Keep the structure identical.

The schema is documented in `references/config_schema.md` — read it for full field details, especially the optional fields and their defaults.

Common gotchas:
- `volumes` keys must be from {voice, chat, social, email, whatsapp}
- `ai_containment_rate` is a decimal (0.225, not 22.5)
- Use HTML inline tags (`<b>`, `<i>`) inside string fields for emphasis — they render correctly
- Brand colors: just supply `navy` and `accent` hex codes; darker/lighter variants are derived automatically
- The logo path is relative to the config JSON file's location

### Step 3: Stage the inputs

Put the config JSON and the BPO logo in the same directory. The logo must be a PNG (transparent or on the navy background — test both if unsure). Recommended logo dimensions: ~170×45px for the wordmark.

### Step 4: Render

Run from the working directory:

```bash
cd /path/to/skill/scripts
python render_brief.py /path/to/config.json /path/to/output.pdf
```

The script will:
1. Compute the ROI cascade from the config
2. Render the Jinja template with all derived values
3. Use Playwright (Chromium) to produce the PDF at the correct page size
4. Print a numbers summary so you can sanity-check the math

If Playwright isn't installed it will install itself the first time.

For debugging, render HTML only first:
```bash
python render_brief.py config.json output.html --html-only
```
Open the HTML in a browser to iterate on copy/layout before committing to PDF.

### Step 5: Sanity-check

After rendering, verify:
- The numbers cascade printed at the end of the script makes sense (Y1 savings should be 30–45% range; if it's 60%+ or negative, an input is wrong)
- Visual: open the PDF and confirm page 1 cards are equal height, page 2 fills its space, page 3 is anchored on a real use case
- Footnotes: every superscript on page 1 has a matching footnote at the bottom
- Possessives: end-client name reads naturally in the headers ("Walmart's" vs. "Fabletics'" — handled automatically)

If the cascade printout shows weird numbers (e.g., "Year 1 savings: $42M (90%)"), the most common causes are:
- AI containment entered as 22.5 instead of 0.225
- FTE count entered as 9 (typo) instead of 900
- Hourly rate missing decimals ($10000 vs $10)

## Config schema (full)

See `references/config_schema.md` for the complete schema with all optional fields and defaults. Read it before drafting the config — there are several useful optional fields (footnotes, KPI alignment, revenue generation upside) that significantly improve the brief.

## Working example

`examples/fabletics_config.json` is the exact config that reproduces the Fabletics v4 brief. Use it as the canonical reference. The numbers it produces should match:

- Total CX spend: $21,605,600
- AI vendor (estimated): $2,885,600
- Blended cost: $4.62/outcome
- Year 1 savings: $8.5M (39.2%)
- Year 2+ savings: $9.9M (45.9%)
- Lighthouse savings range: $3.8M – $6.0M

If you ever modify the math layer, validate by re-running this example and confirming the numbers match.

## Brand adaptation

The skill handles brand colors automatically. You only need to provide:
- `bpo.brand.navy` (the primary dark color, used for header and accents)
- `bpo.brand.accent` (the highlight color, used for the pink-equivalent accents and the top bar)

Darker navy variants (`navy_dark`, `navy_deep`) used in hero blocks are derived by darkening the base navy unless explicitly overridden. The pink-soft callout background is derived by lightening the accent. This works well for most BPO brands. For brands with unusual color palettes (e.g. green or purple as primary), pass all four explicitly under `bpo.brand`.

The logo embeds directly into the navy header. If the BPO logo is on a transparent background, it'll show against the navy. If it's on a white background, it may look awkward — crop to navy or transparent first.

## Common patterns

**End-client provided a Q&A or RFP response with stated containment**: cite the source in `current_state.containment_source` — this becomes footnote ¹ on page 1, dramatically increasing credibility. Don't fabricate sources; if there's no verifiable citation, leave the footnote out.

**End-client's AI vendor spend is unknown**: leave `ai_vendor.annual_spend` unset and let the back-of-envelope estimator run. The methodology footnote (★ on page 1) is added automatically. This is preferable even when you do know the spend if it came from a confidential intel source — the published estimate insulates the source.

**The end-client's name ends in 's'**: the smart-possessive filter handles this automatically. "Fabletics" becomes "Fabletics'" not "Fabletics's".

**Pilot volume share unknown**: defaults to 35% (typical for billing/skip/credit category in subscription retail). For non-subscription verticals, override `lighthouse.volume_share` based on the lighthouse use case.

**Multiple use cases compete for "lighthouse"**: pick the one with the lowest risk + highest documented volume. The criteria: rules-based (not policy judgment), non-retention, non-escalation, KB already documented. Billing/skip/credit hits all four for subscription retail.

**The current-state blended cost is way above $5/outcome**: the default pricing phases ($3.00 → $2.50) will produce >70% savings, which reads as "too good to be true" and slows the deal. Override `pricing_phases` to anchor Phase 1 around 60–70% of the current blended cost. The render script prints a plausibility warning with suggested values when this happens — follow the suggestion.

**The current-state blended cost is below $2/outcome**: the default phases will produce minimal or negative savings. Either the inputs are wrong (verify FTE count and rate) or the deal economics don't work for outcomes-based pricing. Surface this to the user before producing a brief that won't sell.

**Year 1 savings should land in the 30–50% range** to read credibly. Outside that range, adjust the pricing curve. The plausibility checks at the end of the render output will flag this automatically.
