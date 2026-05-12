# Input Schema — GTM Audit App

What the audit produces and how to map it into the prototype's data model.

The GTM-stack-audit pipeline produces a small set of JSON files plus a
markdown strategy memo. Read what's available; not every file is
required.

---

## File inventory

| File | Required | Purpose |
|---|---|---|
| `run_summary.json` | yes | Run metadata: client name, tools audited, severity counts, top findings, runtime |
| `findings.json` | yes | The audit findings — title, severity, evidence, implication, action |
| `tactics.json` | yes | The recommended tactics — priority, effort, title, outcome |
| `00_inventory.json` | yes | Tool inventory — auth status, record counts, warnings |
| `strategy.md` | recommended | Free-text strategy memo. Steal the hero paragraph from here. |
| `10_crm.json` | optional | Per-tool deep stats (CRM). Use for the Tools tab. |
| `12_sales_engagement.json` | optional | Per-tool deep stats (sales engagement). Use for the Tools tab. |
| Other `<NN>_<category>.json` | optional | More per-tool extracts. |

---

## Data model in the JSX prototype

Map the audit JSON into these constants at the top of the JSX file:

### `RUN`

```javascript
const RUN = {
  client: 'Anyreach Inc',                 // run_summary.client_name
  startedAt: '2026-05-09T00:00:00Z',      // run_summary.run_started_at
  completedAt: '2026-05-09T00:30:00Z',    // run_summary.run_completed_at
  durationMin: 30,                        // (completed - started) in minutes
  toolsAudited: ['Attio', 'Apollo'],      // run_summary.tools_audited (capitalized)
  categories: ['CRM', 'Sales Engagement'],// run_summary.categories_covered
  findingsTotal: 12,                      // run_summary.findings_count_by_severity.total
  findingsBySeverity: {                   // run_summary.findings_count_by_severity
    critical: 4, high: 5, medium: 3, low: 0,
  },
  tacticsTotal: 12,                       // run_summary.tactics_count_by_effort.total
  tacticsByEffort: {                      // run_summary.tactics_count_by_effort
    XS: 4, S: 5, M: 3, L: 0,
  },
};
```

### `TOOLS`

One entry per tool in `00_inventory.json`. Pull stats from the
per-tool detail files when available.

```javascript
const TOOLS = [
  {
    name: 'Attio',                       // inventory.tools[].tool (capitalized)
    category: 'CRM',                     // inventory.tools[].category (display-cased)
    auth: 'OK',                          // inventory.tools[].auth_status
    workspace: 'Anyreach',               // inventory.tools[].workspace.name
    user: 'richard@anyreach.ai',         // inventory.tools[].workspace.user
    role: 'Admin',                       // inventory.tools[].workspace.access_level
    icon: Database,                      // pick the lucide icon (see below)
    stats: [                             // 4 short stat pairs, hand-pick the most telling
      { label: 'Companies', value: '46,191' },
      { label: 'People', value: '111,116' },
      { label: 'Deals', value: '146' },
      { label: 'Active users', value: '2 / 10' },
    ],
    health: 'amber',                     // see "Health classification" below
    healthNote: 'Single-owner pipeline · 99% companies unclassified', // 1-sentence diagnosis
  },
  // ... one per tool
];
```

#### Health classification

Use the `warnings` arrays in the per-tool JSON to assign a health level:

- `critical` — tool literally cannot perform its function (Apollo with
  0 linked inboxes, CRM with 0 records, dialer with 0 numbers
  provisioned)
- `amber` — tool is functional but has serious data-quality or
  configuration issues (most CRMs in audits land here)
- `good` — no critical or major warnings

Default: `amber` for most production tools; `critical` only when the
tool is literally inoperable.

#### Tool icon mapping

Pick from lucide-react based on category:

| Category | Icon |
|---|---|
| CRM | `Database` |
| Sales Engagement / Outbound | `Mail` |
| Marketing Automation | `Megaphone` |
| Conversation Intelligence | `Headphones` |
| Data Provider | `Layers` |
| Dialer | `Phone` |
| Other | `Box` |

### `FINDINGS`

One entry per finding in `findings.json`.

```javascript
const FINDINGS = [
  {
    id: 'F-001',                                   // finding.id
    severity: 'critical',                          // finding.severity
    title: 'Stated ICP (BPOs) does not match...',  // finding.title
    evidence: [                                    // finding.evidence.values flattened
      ['Stated ICP', 'BPO partners'],              // [label, value]
      ['Won deals', '5 total'],
      // ... pick 4-6 most-telling values
    ],
    implication: '...',                            // finding.implication
    action: '...',                                 // finding.recommended_action
    tools: ['Attio', 'Apollo'],                    // derived from finding.evidence.fact_files
  },
  // ... one per finding
];
```

#### Picking evidence rows

`finding.evidence.values` may have many fields. Pick the 4–6 most
telling. Prefer numeric values that quantify the problem. Format:
- Percentages: `'2.1%'` (not `0.021`)
- Counts: `'46,191'` (use locale-formatted strings)
- Ratios: `'2 of 5'` (not `0.4`)
- Booleans: `'Yes'` / `'No'` / `'Missing'`
- Comparisons: `'5x worse'` (when there's an industry benchmark)

#### Deriving tool tags

Map `finding.evidence.fact_files` (e.g. `["10_crm.json", "12_sales_engagement.json"]`)
to user-facing tool names:

| Fact file | Tag |
|---|---|
| `10_crm.json` | `Attio` (or whichever CRM is in inventory) |
| `12_sales_engagement.json` | `Apollo` (or sales-engagement tool) |
| `20_marketing.json` | `HubSpot` (or MAP tool) |
| etc. | check inventory.tools for the name |

### `TACTICS`

One entry per tactic in `tactics.json`.

```javascript
const TACTICS = [
  {
    id: 'T-001',                       // tactic.id
    from: 'F-002',                     // tactic.from_finding
    priority: 9.5,                     // tactic.priority_score
    effort: 'S',                       // tactic.effort
    title: "Decide Apollo's fate...",  // tactic.title
    outcome: 'Apollo either becomes...', // tactic.expected_outcome (first sentence is fine)
    tools: ['Apollo'],                 // tactic.tools_involved (display-cased)
  },
  // ... sorted by priority_score descending
];
```

### `STRATEGIC_SHIFTS`

Pull these from `strategy.md` — usually under a "Strategic shifts" or
"Three shifts recommended" heading. There should be exactly 3.

```javascript
const STRATEGIC_SHIFTS = [
  {
    n: '01',
    title: 'Pick one ICP and re-aim the stack at it',
    body: '...',                       // the main body paragraph from strategy.md
    altBody: 'A few hours of work that unlocks every other analysis.', // the closing line / alt path
  },
  // ... three total
];
```

If `strategy.md` doesn't have shifts spelled out, derive them from the
top 3 tactics — but warn the user, since the strategy memo's voice is
better than tactics-table summaries.

---

## Capitalization / display rules

The audit JSON tends to use snake_case or lowercase tool names. The
JSX prototype displays them as proper nouns:

- `attio` → `Attio`
- `apollo` → `Apollo`
- `crm` → `CRM`
- `sales-engagement` → `Sales Engagement`
- `marketing-automation` → `Marketing Automation`
- `conversation-intel` → `Conversation Intelligence`
- `data-providers` → `Data Providers`
- `dialer` → `Dialer`
