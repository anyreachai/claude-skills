---
name: leverage-analysis
description: Generate an interactive React (.jsx) leverage analysis dashboard that quantifies power dynamics between two parties in a negotiation, partnership, or advisor relationship. Use whenever Richard asks to analyze, quantify, score, or visualize leverage, power dynamics, negotiation position, or bargaining power between Anyreach and any counterparty. Trigger on phrases like "who has leverage", "quantify leverage", "power dynamics", "negotiation position", "where do we stand", "leverage matrix", "who holds the cards", "score the relationship", or any request to understand relative negotiation strength. Also trigger when contracts or advisor agreements are uploaded with questions about leverage or positioning.
---

# Leverage Analysis Dashboard

This skill produces a branded React (.jsx) interactive dashboard that quantifies leverage between two parties across multiple dimensions, including financial exposure modeling and game theory scenario analysis.

## When to Use

- Richard asks to quantify leverage, power dynamics, or negotiation position with any counterparty
- Contracts or agreements are uploaded with questions about leverage or bargaining strength
- Any request to visualize who holds the cards in a deal, partnership, or employment relationship
- Requests to model financial exposure under current vs. restructured terms
- Game theory analysis of what each party can credibly do

## Workflow

### Step 1: Gather Context

Collect information from all available sources. **Be thorough — the dashboard is only as good as the evidence behind it.**

1. **Uploaded Documents**: Read any contracts, agreements, SOWs, or MSAs using the appropriate reading skill. Extract: compensation terms, termination clauses, commission structures, equity grants, exclusivity provisions, non-compete terms, IP ownership, notice periods.

2. **Email Evidence** (if Gmail is available): Search for email threads between the parties. Analyze:
   - Who initiates substantive communications vs. who forwards/relays
   - Who authors deliverables (SOWs, decks, proposals, MSAs)
   - Who responds to prospect/partner questions directly
   - Who does scheduling/logistics vs. strategic/technical work
   - Volume and substance of each party's contributions

3. **Conversation History**: Use `conversation_search` to find prior discussions about the relationship, deal dynamics, concerns, or negotiation context. Search for the counterparty's name and related deal names.

4. **Memory / userMemories**: Pull relevant context about the relationship, ongoing deals, team dynamics, and company status.

5. **Slack/Other Channels** (if available): Search for interactions between the parties for behavioral evidence of contribution patterns.

### Step 2: Define Leverage Dimensions

Score each dimension on a 0-100 scale for EACH party (must sum to 100 per dimension). Use the following standard dimensions, adding or removing as appropriate for the specific relationship:

| Dimension | What It Measures |
|-----------|-----------------|
| Relationship Ownership | Who do the prospects/partners/clients actually communicate with directly? |
| Deal Execution | Who does the substantive work — demos, decks, SOWs, MSAs, pricing, compliance? |
| Pipeline Generation | Who sources the deals? What's the volume and conversion rate of each party's pipeline? |
| Technical Capability | Who has the skills to deliver the product/service? Can the counterparty replicate it? |
| Revenue Dependency | If one party disappeared tomorrow, what happens to active revenue? |
| Contractual Position | Who has favorable termination, IP, and compensation terms? |
| Network Access | Who has relationships the other party can't easily replicate? |
| Institutional Knowledge | Who holds the critical product, market, and operational knowledge? |
| Replaceability | How easily could each party's contributions be replaced by someone else or by internal capabilities? |
| Information Asymmetry | Who knows more about the deals, the product, the market, and the counterparty's position? |

**Scoring Guidelines:**
- Base scores on EMAIL EVIDENCE and documented behavior, not claims or titles
- A score of 95/5 means one party has near-total control of that dimension
- A score of 60/40 means one party has an edge but the other has meaningful contribution
- A score of 50/50 means genuine parity
- Always cite specific evidence (email dates, document names, behavioral patterns) for each score

### Step 3: Model Financial Exposure

Calculate and display:

1. **Status Quo Exposure**: Total financial commitment if the current agreement continues unchanged. Include retainers, commission on in-flight deals, commission on expansion (especially perpetuity clauses), equity vesting.

2. **Post-Restructure Exposure**: What the financial commitment would be under proposed new terms. Show the delta clearly.

3. **Risk Items**: Flag any terms that create unbounded or disproportionate financial exposure (perpetuity commissions, expansion clauses with vague attribution, etc.)

Categorize each line item as:
- `spent` — Already paid, sunk cost
- `owed` — Committed under current terms on in-flight deals
- `risk` — Potential future exposure if terms are not restructured

### Step 4: Map Game Theory Scenarios

For EACH party, define 3-5 credible actions they could take, and for each:

- **Action**: What they could do
- **Impact**: What would actually happen if they did it
- **Severity**: Rate as `none`, `low`, `medium`, `high`, or `critical` for the counterparty's actions; rate as `strong`, `neutral`, or `weak` for Richard's options

Base severity on REALISTIC outcomes, not worst-case anxiety. Consider:
- Does the counterparty actually have the relationships to cause damage?
- Does the contract support their position or Richard's?
- What does the audit trail (email, CRM, documents) actually show?

### Step 5: Generate the Dashboard

Create a React `.jsx` file with the following structure:

#### Design System
- **Background**: `#0B0B1A` (deep navy-black)
- **Cards**: `#12122A` with `#1E1E3A` borders
- **Accent (Party A / Richard)**: `#5B5FC7` (indigo)
- **Counterparty color**: `#EF4444` (red)
- **Positive/strong**: `#10B981` (green)
- **Warning**: `#F59E0B` (amber)
- **Font**: JetBrains Mono from Google Fonts (import in component)
- **Text**: `#E2E8F0` primary, `#94A3B8` dim, `#6B7280` muted

#### Component Structure

```
LeverageDashboard
├── Header (title, subtitle, live analysis indicator)
├── Composite Score Section
│   ├── ScoreCircle (Party A aggregate)
│   ├── Leverage Ratio (X:1)
│   └── ScoreCircle (Party B aggregate)
├── Tab Navigation (3 tabs)
├── Tab 1: Leverage Analysis
│   └── Expandable cards per dimension with bar visualization
│       ├── Category name + scores
│       ├── Horizontal split bar (Party A color | Party B color)
│       └── Expanded: details + evidence citation
├── Tab 2: Financial Exposure
│   ├── Status quo total exposure (hero card, red)
│   ├── Line items with type badges (spent/owed/risk)
│   └── Post-restructure exposure (hero card, green)
├── Tab 3: Game Theory
│   ├── Counterparty's options (with severity badges)
│   ├── Richard's options (with strength badges)
│   └── Bottom line verdict card
└── Footer (confidential)
```

#### Key Implementation Details

1. **ScoreCircle**: SVG circle with `stroke-dasharray` / `stroke-dashoffset` animation. Show numeric score centered. Size ~120px.

2. **Leverage bars**: Flexbox row, 8px height, border-radius 4, Party A color left + Party B color right, widths as percentages.

3. **Expandable cards**: Use `useState` to track which dimension is expanded. On tap, show `details` (factual summary) and `evidence` (specific citation with 📎 prefix).

4. **Financial line items**: Right-aligned value with color-coded type badge (`spent` = muted, `owed` = amber, `risk` = red).

5. **Game theory cards**: Left border colored by severity. Badge in top-right.

6. **Tab state**: `useState` for active tab. Style active tab with card background, inactive transparent.

7. **All data should be hardcoded in the component** — no external data fetching. Define arrays of objects at the top of the component.

8. **Mobile-first**: This will render in Claude's artifact viewer. Keep padding tight (14-16px cards), font sizes small (10-12px body, 22px titles), and ensure everything is tappable.

9. **Do NOT use localStorage or sessionStorage.**

### Step 6: Output

Save the `.jsx` file to `/mnt/user-data/outputs/` with a descriptive filename like `leverage_analysis_[counterparty].jsx` and present it using `present_files`.

Provide a brief summary of the key findings:
- Overall leverage ratio
- The single highest-risk financial exposure item
- The counterparty's strongest and weakest positions
- Recommended next action based on the analysis

## Customization Notes

- **For advisor/employee relationships**: Emphasize contribution analysis (who does the work), financial exposure (commission structure), and replaceability
- **For partner/vendor relationships**: Emphasize contractual position, exclusivity terms, IP ownership, and revenue dependency
- **For investor relationships**: Emphasize dilution, board control, information rights, and exit dynamics
- **For acquirer relationships**: Emphasize BATNA (best alternative), timeline pressure, competitive dynamics, and information asymmetry

## Template Reference

See `references/dashboard-template.jsx` for the base React component template with all styling, layout, and interactivity pre-built. Customize the data arrays for each specific analysis.
