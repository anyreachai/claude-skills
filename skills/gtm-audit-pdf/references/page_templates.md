# Page Templates — GTM Audit PDF

Code patterns for building each of the 8 pages. Use these as the
canonical implementations — copy and adapt rather than reinventing.

All snippets assume these imports:

```python
from lib.tokens import C, TYPE, FONT_DISPLAY, FONT_BODY, FONT_MONO, label_style, SPACE
from lib.components import (
    page, hero_block, section_header, tile_grid, metric_tile,
    metric_tile_row, detail_tile, qa_row, scenario_card, callout,
    closing_tagline, italic, mono, label,
)
from lib.charts import donut, stacked_area, bridge_bars, comparison_bars
from lib.render import build_deck
```

These come from the `anyreach-deck` skill at
`/mnt/skills/user/anyreach-deck/lib/`.

---

## Page 1 — Hero

The default `hero_block` uses 170px font which is too tall for a
multi-line headline. Build a **custom hero** at 120px:

```python
def make_hero_page():
    metrics = [
        {'label': 'Findings',      'value': '12',     'sub': '4 critical · 5 high · 3 medium'},
        {'label': 'Tactics',       'value': '12',     'sub': 'Effort: 4 XS · 5 S · 3 M'},
        {'label': 'Tools audited', 'value': '02',     'sub': 'Attio · Apollo'},
        {'label': 'Audit runtime', 'value': '30 min', 'sub': 'MCP-orchestrated · all-time data'},
    ]

    hero = f'''
        <div style="padding-top:0;">
            <div style="{label_style(True)}margin-bottom:24px;">
                GTM Stack Audit · <Client Name> · <Date>
            </div>
            <h1 style="font-family:{FONT_DISPLAY};font-size:120px;
                       line-height:0.96;letter-spacing:-0.025em;margin:0;
                       font-weight:500;color:{C['ink']};max-width:1180px;">
                Pitch versus {italic("data")}.
            </h1>
            <p style="margin-top:28px;font-size:{TYPE['body_lg']}px;
                      line-height:1.55;color:{C['mutedOnCream']};max-width:760px;">
                <2-3 sentence audit summary in editorial voice>
            </p>
            <div style="margin-top:18px;font-size:{TYPE['body_xs']}px;
                        color:{C['mutedOnCream']};">
                Audit by ... · for ...
            </div>
        </div>
    '''

    metrics_row = metric_tile_row(metrics, on_cream=True)

    return page(
        f'<div style="height:100%;display:flex;flex-direction:column;'
        f'justify-content:space-between;">{hero}{metrics_row}</div>',
        background=C['cream'],
    )
```

The `flex; justify-content: space-between` pattern pushes the hero to
the top and the metrics to the bottom of the 900px page. Don't change
this layout.

---

## Page 2 — Critical Findings (4 detail_tiles on ink)

```python
def make_critical_findings_page():
    findings = [
        {
            'eyebrow': 'F-001', 'eyebrow_aux': 'CRITICAL',
            'title': '<2-3 word punchy title>',
            'value': '<biggest number>', 'value_caption': '<what the number means>',
            'ratio': '<one-line memorable summary>',
            'bullets': [
                '<4 supporting evidence rows, each ≤80 chars>',
                '...',
                '...',
                '...',
            ],
        },
        # ... 3 more
    ]

    tiles_html = [
        detail_tile(**f, on_cream=False, accent=C['lime'] if i == 0 else C['indigoLight'])
        for i, f in enumerate(findings)
    ]
    grid = tile_grid(tiles_html, columns=4, on_cream=False)

    headline = f'Where the {italic("gap", C["lime"])} is.'
    body = '<1-2 sentence framing of the four critical findings>'

    return page(
        section_header('01 · Critical Findings', headline, body, on_cream=False) + grid,
        background=C['ink'],
    )
```

Key rules:
- `on_cream=False` because page is ink
- First tile gets `lime` accent (the only lime moment on this page)
- Remaining 3 get `indigoLight`
- Bullets ≤4 per tile (more = card overflow)
- `eyebrow_aux='CRITICAL'` always — it's the signal that all 4 are
  critical-severity findings

---

## Page 3 — Tool Inventory (custom 2-column tool cards)

The default `detail_tile` doesn't fit tool data well — tools have
stats tables + a status chip + a health note, which are different from
the bulleted `detail_tile` shape. Build custom cards:

```python
def make_tools_page():
    def tool_card(name, category, status, status_color, stats, healthNote, accent):
        stats_html = ''
        for s in stats:
            stats_html += f'''
                <div style="display:flex;justify-content:space-between;align-items:baseline;
                            padding:11px 0;border-bottom:1px solid {C["creamLine"]};">
                    <div style="font-size:{TYPE["caption"]}px;color:{C["mutedOnCream"]};">{s[0]}</div>
                    <div style="font-family:{FONT_MONO};font-size:14px;font-weight:500;
                                color:{C["ink"]};font-variant-numeric:tabular-nums;">{s[1]}</div>
                </div>
            '''
        return f'''
            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                <div>
                    <div style="{label_style(True)}">{category}</div>
                    <div style="font-family:{FONT_DISPLAY};font-size:42px;line-height:1;
                                margin-top:8px;font-weight:500;color:{C["ink"]};">{name}</div>
                </div>
                <div style="display:inline-flex;align-items:center;gap:6px;
                            padding:5px 10px;background:{status_color};
                            color:{C["cream"] if status_color == C["crimson"] else C["ink"]};
                            font-family:{FONT_BODY};font-size:9px;letter-spacing:0.18em;
                            text-transform:uppercase;font-weight:600;">
                    <span style="width:5px;height:5px;background:{C["cream"] if status_color == C["crimson"] else C["ink"]};
                                 border-radius:50%;opacity:0.85;"></span>{status}
                </div>
            </div>
            <div style="margin-top:24px;">{stats_html}</div>
            <div style="margin-top:18px;padding-top:14px;border-top:1px solid {accent};
                        font-style:italic;font-size:{TYPE["caption"]}px;
                        color:{C["mutedOnCream"]};line-height:1.55;">
                {healthNote}
            </div>
        '''

    cards = [tool_card(...), tool_card(...)]   # one per tool
    grid = tile_grid(cards, columns=2, on_cream=True)

    headline = f'Two systems, {italic("one functioning")}.'  # adjust to actual finding count
    body = '<framing of the tool inventory state>'

    return page(
        section_header('02 · Tool Inventory', headline, body) + grid,
        background=C['cream'],
    )
```

- Stats: 7 rows is a comfortable max
- Status chip color: `C['crimson']` for critical health, `C['amber']`
  for amber health
- Health note border-top color: same as status chip color, for visual
  consistency

---

## Page 4 — Findings Ledger (custom dense rows)

```python
def make_findings_ledger_page():
    findings = [
        ('F-001', 'critical', '<full title from findings.json>', 'Tool A + Tool B'),
        # ... one tuple per finding
    ]

    sev_colors = {
        'critical': (C['crimson'], C['cream']),
        'high':     (C['amber'],   C['ink']),
        'medium':   (C['creamLine'], C['ink']),
    }

    rows_html = ''
    for i, (fid, sev, title, tools) in enumerate(findings):
        bg, fg = sev_colors[sev]
        sev_chip = (
            f'<span style="display:inline-flex;align-items:center;gap:5px;'
            f'padding:3px 8px;background:{bg};color:{fg};'
            f'font-family:{FONT_BODY};font-size:9px;letter-spacing:0.16em;'
            f'text-transform:uppercase;font-weight:600;">'
            f'<span style="width:5px;height:5px;background:{fg};border-radius:50%;opacity:0.8;"></span>'
            f'{sev}</span>'
        )
        is_first = i == 0
        rows_html += f'''
            <div style="display:grid;grid-template-columns:70px 110px 1fr 200px;
                        gap:24px;align-items:center;padding:13px 0;
                        border-top:1px solid {C["creamLine"]};
                        {'border-top:1px solid ' + C["ink"] + ';' if is_first else ''}">
                <div style="font-family:{FONT_MONO};font-size:13px;color:{C["mutedOnCream"]};
                            font-variant-numeric:tabular-nums;">{fid}</div>
                <div>{sev_chip}</div>
                <div style="font-family:{FONT_DISPLAY};font-size:14px;color:{C["ink"]};
                            font-weight:500;line-height:1.4;">{title}</div>
                <div style="font-family:{FONT_BODY};font-size:10px;color:{C["mutedOnCream"]};
                            text-align:right;letter-spacing:0.04em;">{tools}</div>
            </div>
        '''
    rows_html += f'<div style="border-top:1px solid {C["ink"]};"></div>'  # closing border

    headline = f'The ledger of {italic("twelve")}.'   # match the finding count
    return page(section_header('03 · Findings Ledger', headline, body) + rows_html,
                background=C['cream'])
```

- 12 rows fit comfortably; 16+ rows start to crowd
- Row height: 13px padding × 2 + content height ≈ 40px per row
- Sort order: critical → high → medium → low

---

## Page 5 — Three Shifts (3 scenario_cards on ink)

```python
def make_shifts_page():
    shifts = [
        scenario_card(
            eyebrow='SHIFT 01',
            headline_value='<key word>', headline_unit='<tagline>',
            metric_a_label='<metric A label>', metric_a_value='<metric A value>',
            metric_b_label='<metric B label>', metric_b_value='<metric B value>',
            body='<main paragraph>',
            implication='<italic closing line>',
            accent=C['lime'],
            is_highlight=True,            # only the first shift highlights
        ),
        scenario_card(...accent=C['indigoLight'], is_highlight=False),
        scenario_card(...accent=C['rose'],       is_highlight=False),
    ]

    grid = (f'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;'
            f'background:{C["inkLine"]};">{"".join(shifts)}</div>')

    headline = f'Decide in {italic("30 days", C["lime"])}.'
    body = '<framing of why this is a 30-day decision, not a 90-day decision>'

    return page(section_header('04 · The Three Shifts', headline, body, on_cream=False) + grid,
                background=C['ink'])
```

- 1px gap on `inkLine` background creates hairlines between cards
- First shift is highlighted (lime border-top) — this is the
  "recommended" shift
- The lime accent on the first shift's headline is the page's lime
  moment

---

## Page 6 — Tactics Ranked (custom ranked rows)

```python
def make_tactics_page():
    tactics = [
        ('T-001', 9.5, 'S', '<title>', 'Tool tags'),
        # ... top 9
    ]

    rows_html = ''
    for i, (tid, prio, effort, title, tools) in enumerate(tactics):
        is_first = i == 0
        fill = {'XS': 1, 'S': 2, 'M': 3, 'L': 4}[effort]
        bars = ''
        for j in range(1, 5):
            bg = C['ink'] if j <= fill else C['creamLine']
            bars += f'<span style="display:inline-block;width:5px;height:14px;background:{bg};"></span>'

        rows_html += f'''
            <div style="display:grid;grid-template-columns:36px 80px 100px 1fr 200px;
                        gap:20px;align-items:center;padding:14px 0;
                        border-top:1px solid {C["creamLine"]};
                        {'border-top:1px solid ' + C["ink"] + ';' if is_first else ''}">
                <div style="font-family:{FONT_MONO};font-size:11px;color:{C["mutedOnCream"]};">{i+1}.</div>
                <div style="font-family:{FONT_DISPLAY};font-size:24px;color:{C["ink"]};
                            font-weight:500;line-height:1;">
                    <span style="font-family:{FONT_MONO};">{prio:.1f}</span>
                </div>
                <div style="display:inline-flex;align-items:center;gap:8px;">
                    <span style="display:inline-flex;gap:2px;">{bars}</span>
                    <span style="font-family:{FONT_MONO};font-size:11px;color:{C["ink"]};font-weight:500;">{effort}</span>
                </div>
                <div>
                    <div style="font-family:{FONT_DISPLAY};font-size:14px;color:{C["ink"]};
                                font-weight:500;line-height:1.4;">{title}</div>
                    <div style="font-family:{FONT_MONO};font-size:10px;color:{C["mutedOnCream"]};
                                margin-top:3px;">{tid}</div>
                </div>
                <div style="font-family:{FONT_BODY};font-size:10px;color:{C["mutedOnCream"]};
                            text-align:right;letter-spacing:0.04em;">{tools}</div>
            </div>
        '''
    rows_html += f'<div style="border-top:1px solid {C["ink"]};"></div>'

    headline = f'Twelve moves, ranked by {italic("impact ÷ effort")}.'
    body = '<framing — typically: top 9 shown, first 5 are the 30-day slate>'

    return page(section_header('05 · Tactics, Ranked', headline, body) + rows_html,
                background=C['cream'])
```

**Critical:** at most 9 rows. 10+ rows overflow the page. If there
are more tactics, mention "top 9 of 12" in the body and don't show
the rest.

---

## Page 7 — Risks Q&A

```python
def make_risks_page():
    qa_items = [
        ('<risk title 1>', '<risk body 1>'),
        ('<risk title 2>', '<risk body 2>'),
        ('<risk title 3>', '<risk body 3>'),
        ('<risk title 4>', '<risk body 4>'),
    ]
    qa_html = ''.join(qa_row(i + 1, q, a) for i, (q, a) in enumerate(qa_items))

    callout_html = callout(
        eyebrow='The cheapest fix',
        body=(f'<1-sentence quantification: e.g. "the five sprint-1 tactics combined '
              f'are {mono("under 12 hours", C["ink"])} of focused work and produce '
              f'{italic("X, Y, Z")} — together, the basis for a clean fundraise narrative.">'),
        accent=C['indigo'],   # NOT crimson — callout is constructive
    )

    headline = f'What it costs to {italic("not act")}.'
    body = '<framing — risks are individually survivable but compound>'

    return page(section_header('06 · Risks if Status Quo Persists', headline, body)
                + qa_html + callout_html,
                background=C['cream'])
```

- 4 Q&A rows fit comfortably; 5+ start to crowd against the callout
- The closing callout is constructive (indigo), not warning (crimson)
- Each Q is a risk *category* (4–6 words), not a question — "Investor
  narrative risk", "Concentration risk", etc.

---

## Page 8 — Closing

```python
def make_closing_page():
    closing_metrics = [
        {'label': '30-day slate',   'value': '<N>',  'sub': 'Tactics that ship by <date>'},
        {'label': 'Decision needed','value': '<M>',  'sub': '<the binary decisions>'},
        {'label': 'Hours to value', 'value': '~<H>', 'sub': 'Sprint-1 tactics combined'},
    ]
    metrics_row = metric_tile_row(closing_metrics, on_cream=False)

    tagline = closing_tagline(
        headline=(f'<closing headline with one or two italic words, possibly with a lime accent>'),
        lines=[
            '<UPPERCASE engine + version + date>',
            '<scope summary>',
            '<who ran it · workspace>',
        ],
    )

    return page(
        f'<div style="height:100%;display:flex;flex-direction:column;'
        f'justify-content:space-between;">{metrics_row}{tagline}</div>',
        background=C['ink'],
    )
```

- **3 metric tiles only.** 4 tiles overflow into the tagline area.
- The closing tagline can have one lime moment — usually the second
  italic word.
- Don't add extra content between the metrics and the tagline. The
  whitespace between them is intentional.

---

## Final assembly

```python
def main():
    pages = [
        make_hero_page(),
        make_critical_findings_page(),
        make_tools_page(),
        make_findings_ledger_page(),
        make_shifts_page(),
        make_tactics_page(),
        make_risks_page(),
        make_closing_page(),
    ]
    output = Path('/mnt/user-data/outputs/<client>_gtm_audit.pdf')
    build_deck(pages, output_path=output, title='<Client> · GTM Stack Audit · <Date>')

    # MANDATORY visual inspection
    import pypdfium2 as pdfium
    pdf = pdfium.PdfDocument(output)
    for i, p in enumerate(pdf):
        p.render(scale=0.7).to_pil().save(f'/tmp/preview_p{i+1}.png')
    # Then VIEW each preview file before declaring done.
```
