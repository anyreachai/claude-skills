Quick burn rate and runway check for Anyreach.

## Instructions

1. Read the framework from `C:\Users\Lin Richard\Desktop\claudeos\memory\financial-analysis.md`
2. Read BOTH QuickBooks files from `C:\Users\Lin Richard\Desktop\financials\quickbooks\`:
   - Balance Sheet (for cash position)
   - Profit & Loss (for revenue, costs, and burn calculation)
3. Check for OpStart packages in the financials folder — if present, use as authoritative source
4. From the most recent full month:
   - Cash = QB Balance Sheet (Mercury Checking + Wise USD)
   - Revenue = QB P&L "Total for Income" (collected, not contracted MRR)
   - Costs = QB P&L "Total for Expenses" (actual — do NOT adjust or subtract items)
   - Burn = Costs - Revenue
   - Runway = Cash / Burn
5. Output a short summary:
   - Current cash
   - Collected revenue
   - Monthly costs (actual from P&L)
   - Net burn
   - Runway in months
   - Zero cash date
Keep it brief — 10 lines max.
