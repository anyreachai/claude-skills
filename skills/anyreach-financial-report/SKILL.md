---
name: anyreach-financial-report
description: Generate Anyreach monthly financial health reports — PDF, JSX dashboard, and Cowork config. Use whenever Richard asks to generate, update, or rerun the financial report, monthly report, financial analysis, cash flow, MRR report, runway analysis, or dashboard. Trigger on "update the financials", "redo the analysis", "regenerate the report", "what's our runway", "what's our burn", "update the config", "run the biweekly", or when Richard provides updated data (Mercury CSV, team changes, customer changes, churn, new deals) and wants financials updated. Also trigger for partial requests like "add X to payroll" or "remove Y customer" since those require regenerating. Always use this skill — it contains the proven report structure, ReportLab template, JSX dashboard, normalization rules, 15% buffer methodology, and all customer-specific pricing (eSal tiers, SIBS ramp).
---

# Anyreach Financial Health Report Generator

This skill generates the monthly financial health report for Anyreach Inc., producing three deliverables:

1. **PDF Report** (ReportLab) — 4-5 page formal report
2. **JSX Dashboard** (React/Recharts) — Interactive dashboard with charts + full customer table
3. **Financial Config** (Markdown) — Data layer for Cowork scheduled automation

## Quick Start

When asked to generate or update the financial report:

1. Read `references/CONFIG_FORMAT.md` for the current financial state (or use the latest financial-config.md if available)
2. Read `references/REPORT_TEMPLATE.md` for PDF generation code patterns
3. Read `references/DASHBOARD_TEMPLATE.md` for JSX chart patterns
4. Apply any updates Richard provides (team changes, customer changes, pipeline updates)
5. Generate all three deliverables to `/mnt/user-data/outputs/`

## Core Financial Model

### Expense Buffer
All planning uses a **15% contingency buffer** on nominal expenses. This covers COGS scaling, travel, legal, annual renewals, and hiring pressure.

```
Nominal expenses = COGS + OPEX
Buffered expenses = Nominal × 1.15
Net burn = Buffered expenses - MRR
Runway = Cash / Net burn (if burning)
```

### MRR Collection Timing
Not all MRR collects immediately. Apply payment terms:
- **Immediate:** Ingenium, eSal, Evolv (Stripe)
- **Net 45:** Startek (Consulting + Platform) — 1.5 month lag
- **Net 60:** Results-CX — 2 month lag
- **Standard:** Most others — collect same month
- **New accounts:** Assume 1-month collection lag unless specified

### Cash Flow Projection Rules
1. MRR collected ≠ MRR billed (payment terms create lag)
2. Pilot cash lands on specific dates, not spread evenly
3. Prorated invoices for mid-month churn (half-month)
4. Expenses are constant monthly (buffered rate)
5. New forecast accounts: bill month 1, collect month 2

### Normalization Rules (from raw data)
When processing Mercury/bank CSVs:
- Filter out `Status == 'Failed'` transactions
- Strip one-time charges: legal fees, annual renewals billed monthly, one-off software
- Normalize software with outlier months (e.g., Cursor spike → steady-state rate)
- Mercury date format: `MM-DD-YYYY`
- Wise: filter `Direction == 'OUT'` only for contractor payments

## Report Structure

### PDF (4-5 pages)

**Page 1: Cash Position + Customers**
- Headline banner with status (cash-positive, burn rate, runway)
- Cash position table (Mercury balance, MRR, ARR, expenses nominal/buffered, burn, runway, pilot cash, projected cash)
- Active customers table with MRR, % of total, collection timing
- Churned accounts (if any) with reason and final invoice

**Page 2: Cash Flow Analysis**
- 6-month projection table (Apr–Sep or current 6-month window)
- Line items: MRR Collected (broken by payer timing), Pilot Cash (itemized), Total Inflows, Expenses (buffered), Net Cash Flow, Ending Cash
- Narrative bullets for each month explaining what happens
- Optional: downside scenario (no pilots) or buffer sensitivity table

**Page 3: MRR Growth Forecast**
- Forecast table: Month, MRR, Add, vs Buffered Expenses
- June wave (or current conversion wave) account breakdown
- Later adds (NWFCU, SIBS ramp, eSal upgrades, etc.)
- Pilot cash pipeline table
- Deal summaries for signed contracts (e.g., NWFCU)

**Page 4: Team + Scenarios**
- Team table: Name, Type, Role, Monthly Pay (sorted by pay desc)
- Departed list
- Scenario table: Current, After pilots, + Pipeline, + Forecast, churn scenarios
- Strengths (bullet points)
- Risks (bullet points)

### JSX Dashboard

The dashboard includes these sections in order:
1. **KPI row** (5 cards): Active MRR, Burn, Runway or key milestone, Forecast MRR, Cash projection
2. **Status callout** (colored banner with key context)
3. **Customer table** — EVERY account with MRR, status badge, start date, notes. Grouped by: Active, Churned, Forecast/Pipeline, Upgrades, Removed. Running totals at bottom.
4. **eSal pricing table** (if tiered pricing applies)
5. **MRR trajectory chart** (AreaChart) — actual + forecast with buffered expense reference line
6. **Net cash flow waterfall** (BarChart) — green/red bars with value labels
7. **Cash balance projection** (AreaChart)
8. **Cash flow detail table** — collected, pilots, expenses, net, balance by month
9. **Scenarios table** — with color-coded tags (green/amber/red)
10. **Customer bar chart** (horizontal) — current vs forecast stacked
11. **Team pie chart** with legend

### Financial Config (Markdown)
Machine-readable data layer for Cowork automation. Contains:
- Status summary
- All customers with MRR and terms
- Churned accounts
- Team roster with pay
- Forecast accounts with dates
- Cost base (nominal + buffered)
- Cash flow table
- Change log

## Styling

### PDF (ReportLab)
- Dark header: `#1a1a2e`
- Row alternation: white / `#f8f9fa`
- Net Cash Flow row: `#fff3cd` (amber highlight)
- Ending Cash row: `#d4edda` (green highlight)
- Font sizes: Title 18, H2 13, Body 9, Table 8, Notes 8 italic
- Table grid: `#dee2e6`, 0.5pt

### JSX (React/Recharts)
- Tailwind CSS classes
- Color palette: blue `#3266ad`, green `#1D9E75`, red `#E24B4A`, amber `#BA7517`, purple `#534AB7`
- Status badges: green-100/800, amber-100/800, red-100/800
- Charts: CartesianGrid dashed, clean axis labels, custom tooltips
- Value labels on waterfall bars using custom renderLabel function

## Data Sources

When raw data is provided (CSVs, spreadsheets), read `references/DATA_EXTRACTION.md` for parsing logic for each source:
- Mercury banking CSV
- Gusto employee payments CSV
- Wise contractor payments CSV
- QuickBooks Balance Sheet / P&L
- Internal payroll tracking sheet
- Internal customer list
- Pipeline/forecast sheets

## Key Principles

1. **Normalize before computing.** Raw burn is always inflated by one-offs.
2. **Buffer is non-negotiable.** Always show buffered rate as the planning number.
3. **Payment terms matter.** MRR ≠ cash collected. Model the lag.
4. **Pilot cash is timing-specific.** Never spread evenly — use actual expected dates.
5. **Show both nominal and buffered.** The reader should see the range.
6. **Customer table must be exhaustive.** Every account, every status, every MRR.
7. **Forecast is labeled as forecast.** Separate actual from projected in charts.
8. **Narrative after every table.** Don't just show numbers — explain what they mean.
9. **eSal has tiered pricing.** 50% off (Apr-Sep) → 25% off (Oct-Dec) → 10% off (Jan+). Track current tier.
10. **SIBS has a ramp.** $3K × 3 months then $45K. Track position in ramp.
