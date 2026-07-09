---
name: bpo-roi-model
description: "Generate the BPO outcomes-based ROI financial model as a 4-tab Excel workbook (.xlsx). Produces a formula-driven model with Executive Summary dashboard, Current State cost cascade, Proposed Model phased pricing + savings + retention math, and Assumptions audit trail. Inputs are clearly marked and edits to any input cell cascade through the rest of the workbook automatically. Reuses the same config schema as the bpo-roi-brief and bpo-roi-internal-briefing skills. Trigger whenever the user asks for an 'ROI model', 'savings model', 'pricing model in Excel', 'spreadsheet financial model', 'BPO ROI xlsx', 'outcomes-based pricing model', 'editable savings calculator', or any spreadsheet-form deliverable accompanying an outcomes-based ROI pitch. Always use this skill instead of writing Excel from scratch — it contains the full 4-tab structure, branded styling that adapts to the BPO's colors, formula architecture, and recalc-validation pipeline."
---

# BPO Outcomes-Based ROI — Financial Model Generator

Generate the formula-driven Excel workbook that backs up the ROI brief. This is the "show your work" artifact — the spreadsheet that anyone (CFO, ops lead, procurement) can open, audit, and adjust to test the math. Every published number in the brief and internal briefing traces back to a cell in this workbook.

## What this skill produces

A 4-tab .xlsx workbook:

1. **Executive Summary** — top-level dashboard. Headlines: total CX spend, cost per outcome, AI containment, annual savings (Year 1 / Year 2+), savings %, total annual value with retention. Pulls from the other tabs via formula references.
2. **Current State** — the cost cascade. Volumes per channel (input cells), AI vendor billing rates and platform cost (input cells), AI vendor spend = volume × rate (formulas), BPO labor = FTEs × rate × annual hours (formulas), total CX spend, blended cost per outcome, and the cost-per-AI-outcome / cost-per-human-outcome breakdown.
3. **Proposed Model** — phased pricing + savings. Per-phase containment, price per outcome, monthly volume, months in phase, phase cost. Year 1 blended cost (sum of phases), Year 2+ steady-state cost. Annual savings $ and % vs. current state. Retention impact (revenue × lift %) and total annual value summary.
4. **Assumptions** — input audit trail. Every input cell from the other tabs is summarized here with source citation, so reviewers can sanity-check inputs in one place.

The model uses the BPO's brand colors (navy and accent) for headers and section bands, with pastel callouts for highlight cells (totals, savings, blended cost). Input cells have a light navy tint so users know what's editable.

## When to use this skill

Trigger whenever someone asks for the financial model in spreadsheet form. Phrases that should fire:

- "Build the ROI model in Excel for [client]"
- "Generate the savings model"
- "Create the pricing model spreadsheet"
- "Make the BPO ROI xlsx"
- "I need the editable savings calculator"
- "Spreadsheet version of the financial math"

Do NOT use this skill for:
- The customer-facing 3-page PDF (use `bpo-roi-brief`)
- The internal Word briefing with talking points and red lines (use `bpo-roi-internal-briefing`)
- A SOW or contract (use `proposal-sow-generator`)

## How it relates to the other ROI skills

Same family as `bpo-roi-brief` and `bpo-roi-internal-briefing` — they all read the **same config schema**. Run all three from one config file when you want the full deal package (PDF brief + Word briefing + Excel model).

## How to run it

### Step 1: Use the same config you used for the brief

This skill reads the same `current_state`, `pricing_phases`, `bpo`, `end_client`, etc. fields as the brief skill. If you've already built a config, point this script at it.

The model tab uses `current_state.annual_revenue` to drive the Retention impact section. If revenue is omitted, that section is skipped gracefully.

The model uses `retention_lift_pct` (default 0.005 = 0.5%) for the retention math. Override for very large enterprises where 0.5% would dwarf direct savings.

### Step 2: Run the generator

```bash
cd /path/to/skill/scripts
python build_model.py /path/to/config.json /path/to/output.xlsx
```

### Step 3: Validate on first open

The script prints input values for sanity-check but doesn't pre-compute formulas. On first open in Excel or LibreOffice, all formulas calculate. To validate without opening the file, run:

```bash
python /mnt/skills/public/xlsx/scripts/recalc.py /path/to/output.xlsx
```

This evaluates every formula and reports errors. Zero errors expected.

### Step 4: Sanity-check the headline numbers

Open the workbook to the Executive Summary tab. Confirm:

- **Total CX spend** matches what you expect for the deal size
- **Blended cost per outcome** is in the $2–$10 range (outside that, inputs may be wrong)
- **Year 1 savings %** is in the 30–50% range (the credible band)
- **Total Annual Value** is the headline number that should appear in the brief's value strip

If any of those are far from expected, an input cell is probably wrong. Common gotchas:

- AI containment entered as `22.5` instead of `0.225`
- FTE count missing a digit (e.g., `90` instead of `900`)
- Hourly rate entered with too many or too few digits (`100` instead of `10`)

## Working example

`examples/fabletics_config.json` reproduces the v4 Fabletics model. Key numbers:

- Total CX spend: $21,605,600
- AI vendor (estimated): $2,885,600
- Blended cost: $4.62 / outcome
- Year 1 savings: $8,167,850 (37.8%)
- Year 2+ savings: $9,219,500 (42.7%)
- Cost per AI-resolved outcome: $2.74
- Cost per human-resolved outcome: $5.17

If you modify the model builder, validate by re-rendering this example and confirming all numbers match.

## Common patterns

**The customer wants to test their own scenarios**: that's exactly what this skill is for. Send them the .xlsx and let them adjust the input cells (FTE count, hourly rate, containment rate, phase prices). The whole model recalculates. Make sure the cells you want them to edit have the light-navy input fill so they know what's safe to change.

**The CFO wants to see the math**: this is the artifact for that. The Assumptions tab summarizes every input with source citation, and the Current State tab shows the full derivation of total CX spend. Walk them through Current State → Proposed Model → back to Executive Summary.

**The numbers don't match the brief**: usually means the brief was generated from a different config than the model. Always use the same config file for both. If the brief uses `pricing_phases` overrides that the model doesn't, the savings will diverge.

**You want to add new revenue streams or scenarios**: edit the `build_model.py` script. The 4-tab structure is fixed but each tab is built from a single function — you can extend any of them without touching the others. The xlsx skill in /mnt/skills/public/xlsx has reference docs on advanced openpyxl patterns.

**The model needs to support a different vertical**: the structure is generic. Edit `build_model.py` if you want to rename specific labels (e.g., "Member Experience" → "Customer Care") but most of the variable text already pulls from config (`engagement_label`, `bpo.label`, etc.).
