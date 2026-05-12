# Input Schema — GTM Audit PDF

What the audit produces and how to use each piece in the PDF builder.

This schema is the same as the one consumed by `gtm-audit-app`. The
PDF builder is more selective about what it pulls out — pages have
limited vertical space, so each page picks the 4–9 most-telling data
points from the source files.

---

## File inventory

| File | Required | Used on which pages |
|---|---|---|
| `run_summary.json` | yes | Page 1 (metric tiles), Page 8 (closing metrics) |
| `findings.json` | yes | Page 2 (4 critical), Page 4 (full ledger) |
| `tactics.json` | yes | Page 6 (top 9 ranked) |
| `00_inventory.json` | yes | Page 3 (tool cards) |
| `strategy.md` | recommended | Page 1 subhead, Page 5 shifts, Page 7 risks |
| Per-tool `<NN>_*.json` | optional | Page 3 (deep stats per tool) |

---

## Per-page extraction guide

### Page 1 — Hero metrics row

Pull from `run_summary.json`:

```python
metrics = [
    {'label': 'Findings',
     'value': str(run_summary['findings_count_by_severity']['total']),
     'sub': f'{C} critical · {H} high · {M} medium'},  # from same dict
    {'label': 'Tactics',
     'value': str(run_summary['tactics_count_by_effort']['total']),
     'sub': f'Effort: {XS} XS · {S} S · {M} M'},
    {'label': 'Tools audited',
     'value': f'{len(tools):02d}',  # zero-padded count
     'sub': ' · '.join(tools_audited)},  # capitalized names
    {'label': 'Audit runtime',
     'value': f'{duration_min} min',
     'sub': 'MCP-orchestrated · all-time data'},
]
```

The hero **headline** comes from voice (see `voice_guide.md`). The
**subhead** (2–3 sentences) comes from `strategy.md`'s executive
summary opening.

### Page 2 — Four critical findings as detail tiles

Filter `findings.json` to `severity == 'critical'` (there should be
~4). For each, build a `detail_tile`:

```python
detail_tile(
    eyebrow=finding['id'],                       # 'F-001'
    eyebrow_aux='CRITICAL',                       # always
    title=short_title(finding['title']),          # 2-3 word punchy title
    value=biggest_number(finding['evidence']),    # the most damning metric
    value_caption=context_for_number,             # what the metric means
    ratio=memorable_one_liner(finding),           # italic ratio line
    bullets=top_4_evidence_rows(finding),         # 4 supporting bullets
    on_cream=False,                               # page is ink
    accent=C['lime'] if i == 0 else C['indigoLight'],
)
```

The first card gets `lime` accent — this is the single lime moment for
this page. The other three get `indigoLight`.

#### Building a "punchy title" from a finding

`finding.title` is usually a full sentence like "Stated ICP (BPOs)
does not match either won-deal or active-prospecting reality". For
the detail tile, condense to 2–3 words: `"ICP drift"`, `"Apollo cannot
send"`, `"No team in CRM"`, `"Pipeline math broken"`. The full title
goes on Page 4's ledger.

#### Building a "biggest number"

Scan `finding.evidence.values` for the most striking single
quantitative datapoint. Examples:
- `"0 of 5 won deals are BPOs"` → value `'0/5'`, caption `'won deals are BPOs'`
- `"6.8% hard bounce rate"` → value `'6.8%'`, caption `'hard bounce rate'`
- `"100% of 146 deals owned by Richard"` → value `'100%'`, caption `'deals owned by CEO'`

### Page 3 — Tool cards

For each entry in `inventory.tools`:

- Pull 7–8 stats from the per-tool JSON. Pick the most telling.
  Mix product-usage stats (record counts, active users, sequences)
  with health stats (linked inboxes, % classified, bounce rate).
- Compute health: `'critical'` if the tool literally cannot perform
  its function (Apollo with 0 inboxes), `'amber'` for serious data-
  quality issues, `'good'` otherwise.
- Write a 1–2 sentence health note that captures the diagnosis.

### Page 4 — Findings ledger

Sort `findings.json` by severity (critical first, then high, then
medium). For each, render one row:
`F-id · severity_chip · short_title · tool_tags`

Use a dense layout — 12 rows fit comfortably on the page.

#### Severity chip colors

| Severity | bg | fg |
|---|---|---|
| critical | C['crimson'] | C['cream'] |
| high | C['amber'] | C['ink'] |
| medium | C['creamLine'] | C['ink'] |
| low | C['creamSoft'] | C['mutedOnCream'] |

### Page 5 — Three Shifts

Pull from `strategy.md`'s "Three strategic shifts recommended" (or
similarly-titled) section. There should be exactly 3.

For each, render a `scenario_card`:

```python
scenario_card(
    eyebrow=f'SHIFT 0{n}',                # 01 / 02 / 03
    headline_value=key_word,              # 'ICP' / 'Hygiene' / 'Apollo'
    headline_unit=tagline,                # 'align CRM, brand, outbound'
    metric_a_label='...', metric_a_value='...',  # one quantification
    metric_b_label='...', metric_b_value='...',  # another quantification
    body=main_paragraph,
    implication=closing_italic_line,
    accent=C['lime'] if n == 1 else C['indigoLight'] if n == 2 else C['rose'],
    is_highlight=(n == 1),                # first shift gets the highlight
)
```

If `strategy.md` doesn't have shifts spelled out clearly, **derive them
from the top 3 tactics** — but warn the user, since the strategy memo
voice is sharper than tactics-table summaries.

### Page 6 — Top 9 tactics

Sort `tactics.json` by `priority_score` descending. Take top 9.
For each, render one row:
`rank · priority · effort_bars · title (with id) · tools`

Effort bars: `XS` = 1 filled / 4, `S` = 2/4, `M` = 3/4, `L` = 4/4.
Each bar is a 5×14px rectangle. Filled = `C.ink`, unfilled = `C.creamLine`.

### Page 7 — Risks Q&A

If `strategy.md` has a "Risks if status quo persists" section, pull
the 4 risks from there. Otherwise, derive 4 risks from the critical
findings.

Standard 4 risks for any audit:
1. **Investor narrative risk** — what diligence will find
2. **Concentration risk** — which customer/channel is over-weighted
3. **Domain reputation risk** (or technical debt risk) — what compounds
4. **Hire-time risk** — what the next AE/PM/eng hire will see

For each, use a `qa_row` with the title as the question and the body
as the answer.

The closing `callout` summarizes "the cheapest fix" — typically a
1-sentence quantification like "the five sprint-1 tactics combined are
under 12 hours of work and produce X, Y, Z". Use indigo accent (not
crimson — the callout is constructive, not warning).

### Page 8 — Closing

Three closing metrics that quantify the path forward:

```python
closing_metrics = [
    {'label': '30-day slate', 'value': str(N), 'sub': 'Tactics that ship by <date>'},
    {'label': 'Decision needed', 'value': str(M), 'sub': 'Things needing a yes/no'},
    {'label': 'Hours to value', 'value': f'~{H}', 'sub': 'Sprint-1 tactics combined'},
]
```

The closing tagline is the deck's final word. Pull a phrase from
`strategy.md`'s closing paragraph or write one in that voice. The
Anyreach reference uses "The audit is not a *verdict*. It is a
*checklist*." which captures the diagnostic-not-prescriptive posture.

The metadata `lines` (3 lines under the tagline) follow this pattern:
1. UPPERCASE: engine version + date
2. Mixed case: scope summary
3. Mixed case: who ran it + workspace

---

## Tool name capitalization

Same as gtm-audit-app:

- `attio` → `Attio`
- `apollo` → `Apollo`
- `crm` → `CRM`
- `sales-engagement` → `Sales Engagement`
- `marketing-automation` → `Marketing Automation`
- `conversation-intel` → `Conversation Intelligence`

The PDF is a polished artifact — never show snake_case to the reader.
