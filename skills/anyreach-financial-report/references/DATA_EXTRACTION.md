# Data Extraction Guide

## 1. Mercury Banking CSV

**Location:** Usually uploaded as `mercury_banking_*.csv`
**Date format:** `MM-DD-YYYY` in the `Date (UTC)` column
**Key columns:** Date (UTC), Description, Amount, Status, Mercury Category

### Extraction Steps
1. Filter out `Status == 'Failed'` rows
2. Parse dates as MM-DD-YYYY
3. Group by month
4. Categorize by Mercury Category or Description pattern matching
5. Identify one-time charges to strip from normalized base:
   - Legal fees (Duane Morris, etc.)
   - Annual renewals appearing as single large charges
   - Software outlier months (e.g., Cursor $5K+ when normal is $500)
   - Failed/reversed transactions

### Common Categories
- Payroll: Gusto debits (semi-monthly)
- Rent: Bilt payments (~$5,147/mo)
- Software: Credit card charges (aggregate)
- Insurance: UHC, Guardian, Next Insurance
- Meals: DoorDash, restaurants (flag for review)
- Revenue deposits: Customer payments

## 2. Gusto Employee Payments CSV

**Key columns:** Employee Name, Pay Period, Gross Pay, Net Pay, Taxes, Benefits
**Used for:** Verifying FTE payroll matches expected amounts

### Extraction Steps
1. Sum by employee per month
2. Cross-reference with internal payroll tracking sheet
3. Flag discrepancies (e.g., missing employees, unexpected amounts)
4. Note: Shangeth Rajaa and T S Akarsh transitioned from Gusto to Wise — they will NOT appear in Gusto data

## 3. Wise Contractor Payments CSV

**Key columns:** Direction, Status, Source name, Target name, Source amount (after fees), Target amount (after fees), Finished on
**Used for:** Contractor and international FTE payments

### Extraction Steps
1. Filter `Direction == 'OUT'` only
2. Filter `Status != 'CANCELLED'` (keep COMPLETED)
3. Sum by Target name per month
4. Key contractors paid via Wise: Shangeth Rajaa ($6K), T S Akarsh ($5K), Kanika Batra ($2,175), Joel ($1,850), Honey Grace Maglana ($1,400), Shyam Sunil Engineer ($4,725)

## 4. QuickBooks Balance Sheet CSV

**Used for:** Point-in-time asset/liability verification
**Cross-reference:** Mercury checking balance should match QB cash account

## 5. QuickBooks Profit & Loss CSV

**Used for:** Revenue and expense verification
**Cross-reference:** Monthly totals should approximately match Mercury outflows after normalization
**Note:** QB categories may differ from Mercury categories — map by vendor name

## 6. Internal Payroll Tracking Sheet

**Format:** Usually a CSV/Excel with columns: Name, Type, Total Monthly Payroll, Total Annual Payroll
**Used for:** Source of truth for expected payroll
**Note:** This is the INTENDED payroll, not actuals. Cross-reference with Gusto + Wise for actual disbursements.

## 7. Internal Customer List / Pipeline Sheet

**Format:** Usually CSV/Excel with columns: Customer name, MRR, Status, Start Date, Payment Terms
**Used for:** Active customers, pipeline, forecast accounts
**Rules:**
- Active = invoiced and paying (or recently started)
- Pipeline = verbally agreed, not yet invoiced
- Forecast = expected future accounts with estimated start dates
- Churned = formally terminated
- Written off = non-paying, removed from projections (e.g., Ambassador)
- Parked = project paused, may resume (e.g., Part's Geek, Pavlov)

## General Normalization Checklist

Before computing burn/runway, strip these from the monthly cost base:
- [ ] One-time legal fees
- [ ] Annual software renewals appearing as single charges
- [ ] Software outlier months (use steady-state, not spike month)
- [ ] Failed/reversed transactions
- [ ] Google Ads (if turned off)
- [ ] Departed employees still showing in partial-month data
- [ ] One-off consulting or contractor payments that won't recur

After stripping, add back:
- [ ] Wise-paid contractors not in Mercury CSV
- [ ] Any regular expenses paid outside Mercury (if applicable)
