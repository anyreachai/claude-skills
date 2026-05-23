# Financial Config Format

The financial-config.md file is the **data layer** for Cowork scheduled automation. It must be machine-readable while also being human-scannable. The scheduled task reads this file, pulls live Mercury cash balance, and generates the PDF + JSX outputs.

## Structure

```markdown
# Anyreach Financial Config
# Updated: [DATE]

## Status
- Active MRR: $XX,XXX (N accounts)
- Burn (15% buffer): $XX,XXX/mo | Runway: XX months
- [Key milestone or status note]
- [Forecast peak or next inflection point]

## Active (N) — $XX,XXX
[Inline list: Customer $MRR | Customer $MRR | ...]

## [Tiered pricing notes if applicable]
- eSal: $9,495 (Apr-Sep) → $14,243 (Oct-Dec) → $17,091 (Jan+)

## Churned [Date]: Customer $MRR + Customer $MRR (reason)

## [Conversion wave name] — +$XX,XXX
[Inline list of accounts with MRR and dates]

## Later: [Account $MRR (Date) | Account $MRR (Date)]
## Removed: [List with reasons]

## Team (N) — $XX,XXX/mo
[Inline list or table]

## Expenses: Nominal $XX,XXX → Buffered (15%) $XX,XXX
## Pilots: $XXX,XXX [itemized]

## Cash Flow
| Month | Collected | Pilot | Net | Balance |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |
```

## Key Rules

1. **Status section** must be first — it's the executive summary a human scans
2. **Inline format preferred** for lists that don't need full tables (saves space)
3. **Change log** at the bottom tracks every update with date, change, and financial impact
4. **Tiered pricing** must be explicit — the automation needs to know which tier is current
5. **Ramp schedules** must be explicit (e.g., SIBS $3K×3mo→$45K)
6. **"Removed" section** prevents re-adding accounts that were intentionally excluded
7. **Cash flow table** must show collected (not billed) amounts

## How Cowork Uses This

The scheduled task (biweekly) runs this workflow:
1. Read financial-config.md
2. Pull live Mercury balance via API (if available) or use last known
3. Check if any dates have passed (e.g., churn effective date)
4. Generate PDF + JSX using the REPORT_TEMPLATE and DASHBOARD_TEMPLATE
5. Optionally post a Slack summary
6. Append run timestamp to change log

## Updating via Dispatch

When Richard says "update the config: add X at $Y/mo", the dispatch handler:
1. Reads current config
2. Applies the change to the appropriate section
3. Updates the status summary
4. Recalculates cash flow
5. Appends to change log
6. Regenerates PDF + JSX

## Validation Checks

Before generating reports, validate:
- [ ] Payroll sum matches team table total
- [ ] Active MRR sum matches customer list
- [ ] No customer appears in both Active and Churned
- [ ] No customer appears in both Active and Forecast
- [ ] Buffered expenses = Nominal × 1.15
- [ ] Cash flow months are consecutive
- [ ] Pilot cash amounts sum to stated total
