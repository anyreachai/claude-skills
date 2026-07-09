---
name: bpo-roi-internal-briefing
description: "Generate the internal-only Word briefing that accompanies a BPO outcomes-based ROI pitch. This is the document that goes to the BPO's internal team (sales, commercial, ops leadership) — never to the end client. It contains talking points, margin profile (honest blended cost vs. customer-paid price), red lines, intel findings, confidentiality notes, and the script for handling tough customer questions. Reuses the same config schema as bpo-roi-brief plus an optional internal_briefing section. Trigger whenever the user asks for an 'internal briefing', 'sales team briefing', 'talking points doc', 'margin profile doc', 'red lines doc', 'pre-call alignment doc', 'BPO team enablement doc', or any internal Word doc accompanying an outcomes-based ROI pitch. Always use this skill instead of writing the doc from scratch."
---

# BPO Outcomes-Based ROI — Internal Briefing Generator

Generate the internal Word document that accompanies a BPO outcomes-based ROI pitch. This is the doc that goes to the BPO's *internal* sales/ops/commercial team — never to the end client. It enables them to walk the customer through the deal with consistent talking points, honest margin awareness, and clear red lines on what not to say.

## What this skill produces

A multi-page Word document (typically 4 pages) with seven sections:

1. **Model Overview** — bullets covering current state, proposed pricing, Year 1/2+ savings, retained revenue, revenue gen potential, total Year 1 value
2. **How We Built the Current State Estimate** — derivation of AI vendor spend (with optional confidentiality callout), BPO labor cost, sourced AI containment rate, revenue benchmark validation
3. **Pricing Strategy** — why the price curve was chosen, plus the **Margin Profile (INTERNAL ONLY)** table showing honest blended cost (FTE labor + AI platform) per phase vs. what the customer pays
4. **Key Talking Points for Customer** — what to lead with, how to handle pushback on price, how to handle other tough questions
5. **Intel Findings** *(optional)* — table of insights surfaced from discovery / Q&A / RFP responses
6. **What NOT to Say (Red Lines)** — explicit list of things never to share with the customer
7. **Next Steps** — internal sequencing before client send

The document uses BPO brand colors but with internal-doc styling: serif numbering, red confidentiality stamps, pink-soft callouts for emphasis. The footer includes a "DO NOT SHARE EXTERNALLY" warning on every page.

## When to use this skill

Trigger whenever someone asks for an internal-facing companion doc to a BPO ROI pitch. Phrases that should fire:

- "Build the internal briefing for [client]"
- "Generate the Startek/[BPO] internal talking points"
- "Create the margin profile doc"
- "Draft the red lines doc"
- "Make the pre-call internal alignment doc"
- "Sales team briefing for the [client] pitch"
- "Internal Word doc to go with the ROI brief"

Do NOT use this skill for:
- The customer-facing 3-page PDF brief (use `bpo-roi-brief`)
- The financial model in spreadsheet form (use `bpo-roi-model`)
- A SOW or contract draft (use `proposal-sow-generator`)

## How it relates to the other ROI skills

This skill is part of a three-skill family that all read the **same config schema**:
- `bpo-roi-brief` — produces the 3-page external PDF
- `bpo-roi-internal-briefing` — produces the Word internal briefing (this skill)
- `bpo-roi-model` — produces the Excel financial model

Run all three from one config file when you want the full deal package. Each is independently triggerable so you can regenerate one without re-running the others.

## How to run it

The workflow is: gather inputs → write a config JSON → run the generator.

### Step 1: Gather inputs

The internal briefing reads the same base config as the brief (BPO, end client, current state, phases, etc.) plus an optional `internal_briefing` section that holds talking points, red lines, and intel findings. See `references/config_schema.md` for full schema.

If you've already built the config for `bpo-roi-brief`, you can extend it with the `internal_briefing` block and reuse the same file. Don't rewrite the base config.

**Required for this skill specifically:**
- Everything required by `bpo-roi-brief` (BPO, end client, current state, use cases, priorities, pilot, etc.)

**Highly recommended for this skill specifically:**
- `internal_recipients` — list of names this briefing is for ("Robert Head", "Sid Mukherjee", etc.)
- `internal_briefing.talking_points.lead_with` — the four headline messages to lead with
- `internal_briefing.red_lines` — explicit list of things never to say to the client

**Optional but high-value:**
- `internal_briefing.confidentiality_note` — for any intel that must stay internal (e.g., a number a contact shared off-the-record)
- `internal_briefing.intel_findings` — table of insights from discovery / Q&A / RFP responses
- `internal_briefing.talking_points.if_pushed_on_price` — how to defend the price
- `internal_briefing.talking_points.other_questions` — other tough Q&As the team should be prepped for
- `internal_briefing.next_steps` — sequencing before client send
- `pricing_phases[*].platform_cost_estimate` — per-phase platform cost for honest margin math (defaults applied if omitted)

### Step 2: Run the generator

```bash
cd /path/to/skill/scripts
python render_briefing.py /path/to/config.json /path/to/output.docx
```

The script prints both the brief math cascade AND the internal margin profile so you can sanity-check before opening the file. Look for:

- Phase 1 margin should be in the 5–20% range. If it's 50%+, your `platform_cost_estimate` is too low or your FTE retention curve is too aggressive (the math thinks you have fewer agents than you actually need).
- Phase 3 margin should be 60–80%. This is the back-loaded economics of outcomes pricing — most of the value lands in steady state.
- If Phase 1 margin is negative, the deal isn't viable at the current price. Either raise Phase 1 price or lower Phase 1 platform cost / FTE share.

### Step 3: Sanity-check before sharing

This document is internal-only and contains margin numbers that would damage the deal if leaked. Before sharing:

- Confirm the footer reads "DO NOT SHARE EXTERNALLY"
- Confirm there's no language that could be misread as a customer commitment ("we will guarantee 90% containment") — pricing milestones are targets requiring joint validation, not contractual guarantees
- Confirm any third-party intel sourced from a contact off-the-record is in the confidentiality callout, not in talking points

## Working example

`examples/fabletics_config.json` is the canonical reference — produces the v5 Fabletics internal briefing exactly. The numbers it produces should match:

- Total CX: $21.6M, AI vendor: $2.9M, BPO labor: $18.7M
- Phase 1 margin: ~11% on $1.6M gross
- Phase 2 margin: ~48% on $6.4M gross
- Phase 3 margin: ~75% on $9.3M gross

If you modify the math layer, validate by re-running this example.

## Common patterns

**The customer is a public company and the BPO has a contact who shared a confidential number** (e.g., "I heard from Jam that they spend $3M on AI"): put that intel in `internal_briefing.confidentiality_note` so it stays internal, and let the back-of-envelope estimator in the brief skill produce the published number that gets shared externally. The published number derives from public data; the confidential number stays inside.

**The team is new to outcomes-based pricing and wants more guidance**: expand `internal_briefing.talking_points.other_questions` with FAQ-style Q&As. The skill renders each as its own subsection with bullets.

**Phase 1 margin came out very thin (single digits)**: that's actually realistic and useful information. Don't try to hide it — flag it explicitly to the team so they know not to concede further on Phase 1 price during negotiation. The skill auto-renders a callout when Phase 1 margin drops below 20%.

**The end-client gave you their tool stack and target KPIs**: capture them as `intel_findings` rows. These show the team that the brief is grounded in customer-supplied data, which makes them more confident defending the model.
