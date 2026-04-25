Run the Anyreach CEO Financial Health Report.

## Instructions

1. Read the analysis framework from `C:\Users\Lin Richard\Desktop\claudeos\memory\financial-analysis.md`
2. Read all 4 data source CSVs from `C:\Users\Lin Richard\Desktop\financials\`:
   - `gusto/` — payroll journal (identify current employees and costs)
   - `mercury/` — bank transactions (recent cash flows)
   - `quickbooks/` — Balance Sheet + Profit & Loss (monthly financials)
   - `wise/` — international contractor payments
3. Check for OpStart packages in the financials folder — if present, use as authoritative source
4. Ask me for any updates:
   - Team changes (new hires, cuts) since last run
   - Updated pipeline (customers, MRR, probability, upfront amounts)
5. Use ACTUAL P&L numbers — do not adjust, normalize, or subtract "one-off" items
6. Build team from Gusto + Wise payment data, not from memory or hardcoded lists
7. Generate the full report with ALL sections:
   - CEO Dashboard Summary (5-line snapshot)
   - Cash Position
   - Revenue (collected, monthly trend + active customer table)
   - Team & People Costs (from Gusto + Wise data)
   - Expense Breakdown (COGS, S&M, R&D, G&A from P&L)
   - Profitability Metrics (gross margin, operating margin, burn multiple)
   - Full Pipeline Table (active + high/medium/low probability)
   - Scenario Analysis (No Deals / High Prob / High+Med / All)
   - Probability-Weighted Forecast
   - Key Risks & Flags
   - Historical Context
8. Run all validation checks (Step 9 in framework): QB math, OpStart cross-check, Gusto↔QB payroll match, Wise↔QB match, cash sanity, runway sanity
9. Flag any data that looks stale or inconsistent
