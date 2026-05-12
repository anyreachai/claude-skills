"""GTM Audit PDF — Template scaffold.

Replace the placeholder data with values from the user's audit output,
then run from the script's directory:

    python audit_deck_template.py

Output: /mnt/user-data/outputs/<client>_gtm_audit.pdf

Then ALWAYS render preview PNGs and visually inspect each page before
declaring done — see the `verify` function at the bottom.
"""

from pathlib import Path
import sys

# Import the anyreach-deck library
SKILL_ROOT = Path('/mnt/skills/user/anyreach-deck')
sys.path.insert(0, str(SKILL_ROOT))

from lib.tokens import C, TYPE, FONT_DISPLAY, FONT_BODY, FONT_MONO, label_style, SPACE
from lib.components import (
    page, hero_block, section_header, tile_grid, metric_tile,
    metric_tile_row, detail_tile, qa_row, scenario_card, callout,
    closing_tagline, italic, mono, label,
)
from lib.render import build_deck


# ─────────────────────────────────────────────────────────────────────
# AUDIT DATA — REPLACE WITH REAL VALUES
# ─────────────────────────────────────────────────────────────────────
CLIENT_NAME = '<Client Name>'
CLIENT_SLUG = '<client_slug>'   # used in output filename
RUN_DATE    = '<DD MMM YYYY>'   # e.g. '09 May 2026'


# ============================================================
# PAGE 1 — Hero
# ============================================================
def make_hero_page():
    metrics = [
        {'label': 'Findings',      'value': '<N>',     'sub': '<C critical · H high · M medium>'},
        {'label': 'Tactics',       'value': '<N>',     'sub': '<Effort: ...>'},
        {'label': 'Tools audited', 'value': '<NN>',    'sub': '<comma-separated names>'},
        {'label': 'Audit runtime', 'value': '<N> min', 'sub': 'MCP-orchestrated · all-time data'},
    ]

    hero = f'''
        <div style="padding-top:0;">
            <div style="{label_style(True)}margin-bottom:24px;">
                GTM Stack Audit · {CLIENT_NAME} · {RUN_DATE}
            </div>
            <h1 style="font-family:{FONT_DISPLAY};font-size:120px;
                       line-height:0.96;letter-spacing:-0.025em;margin:0;
                       font-weight:500;color:{C['ink']};max-width:1180px;">
                <!-- TODO: replace with the audit's actual argument.
                     2-4 words. One italic. End with a period. -->
                Pitch versus {italic("data")}.
            </h1>
            <p style="margin-top:28px;font-size:{TYPE['body_lg']}px;
                      line-height:1.55;color:{C['mutedOnCream']};max-width:760px;">
                <!-- TODO: 2-3 sentence summary in the strategy memo's voice. -->
                Two tools audited. N findings. M critical. The pattern across
                them is ___, not ___.
            </p>
            <div style="margin-top:18px;font-size:{TYPE['body_xs']}px;
                        color:{C['mutedOnCream']};">
                Audit by GTM Audit Engine v0.7.2 · for &lt;user@example.com&gt;
            </div>
        </div>
    '''
    metrics_row = metric_tile_row(metrics, on_cream=True)

    return page(
        f'<div style="height:100%;display:flex;flex-direction:column;'
        f'justify-content:space-between;">{hero}{metrics_row}</div>',
        background=C['cream'],
    )


# ============================================================
# PAGE 2 — Critical Findings (4 detail tiles on ink)
# ============================================================
def make_critical_findings_page():
    findings = [
        {
            'eyebrow': 'F-001', 'eyebrow_aux': 'CRITICAL',
            'title': '<2-3 word punchy title>',
            'value': '<biggest number>', 'value_caption': '<what it means>',
            'ratio': '<one-line memorable summary, italic-ready>',
            'bullets': [
                '<evidence row 1>',
                '<evidence row 2>',
                '<evidence row 3>',
                '<evidence row 4>',
            ],
        },
        # ... 3 more critical findings
    ]
    tiles_html = [
        detail_tile(**f, on_cream=False, accent=C['lime'] if i == 0 else C['indigoLight'])
        for i, f in enumerate(findings)
    ]
    grid = tile_grid(tiles_html, columns=4, on_cream=False)

    headline = f'Where the {italic("gap", C["lime"])} is.'   # TODO adjust
    body = '<1-2 sentence framing>'

    return page(
        section_header('01 · Critical Findings', headline, body, on_cream=False) + grid,
        background=C['ink'],
    )


# ============================================================
# PAGE 3 — Tool Inventory (custom 2-column tool cards)
# ============================================================
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
        chip_fg = C['cream'] if status_color == C['crimson'] else C['ink']
        return f'''
            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                <div>
                    <div style="{label_style(True)}">{category}</div>
                    <div style="font-family:{FONT_DISPLAY};font-size:42px;line-height:1;
                                margin-top:8px;font-weight:500;color:{C["ink"]};">{name}</div>
                </div>
                <div style="display:inline-flex;align-items:center;gap:6px;
                            padding:5px 10px;background:{status_color};color:{chip_fg};
                            font-family:{FONT_BODY};font-size:9px;letter-spacing:0.18em;
                            text-transform:uppercase;font-weight:600;">
                    <span style="width:5px;height:5px;background:{chip_fg};
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

    cards = [
        tool_card(
            name='<Tool A>', category='<Category · Production>',
            status='<Needs attention>', status_color=C['amber'],
            stats=[
                ('<stat 1>', '<value 1>'),
                ('<stat 2>', '<value 2>'),
                # ... up to 7 rows
            ],
            healthNote='<1-2 sentence diagnosis>',
            accent=C['amber'],
        ),
        # ... one per audited tool (typically 2-3)
    ]
    grid = tile_grid(cards, columns=2, on_cream=True)

    headline = f'Two systems, {italic("one functioning")}.'   # TODO adjust
    body = '<framing>'

    return page(
        section_header('02 · Tool Inventory', headline, body) + grid,
        background=C['cream'],
    )


# ============================================================
# PAGE 4 — Findings Ledger (custom dense rows)
# ============================================================
def make_findings_ledger_page():
    findings = [
        ('F-001', 'critical', '<full title from findings.json>', 'Tool A + Tool B'),
        # ... one per finding, sorted by severity
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
    rows_html += f'<div style="border-top:1px solid {C["ink"]};"></div>'

    headline = f'The ledger of {italic("<count>")}.'   # TODO adjust to actual count
    body = '<framing>'

    return page(
        section_header('03 · Findings Ledger', headline, body) + rows_html,
        background=C['cream'],
    )


# ============================================================
# PAGE 5 — Three Strategic Shifts (3 scenario cards on ink)
# ============================================================
def make_shifts_page():
    shifts = [
        scenario_card(
            eyebrow='SHIFT 01',
            headline_value='<key word>', headline_unit='<tagline>',
            metric_a_label='<label A>', metric_a_value='<value A>',
            metric_b_label='<label B>', metric_b_value='<value B>',
            body='<main paragraph>',
            implication='<italic closing line>',
            accent=C['lime'],
            is_highlight=True,
        ),
        scenario_card(
            eyebrow='SHIFT 02',
            headline_value='<key word>', headline_unit='<tagline>',
            metric_a_label='<label A>', metric_a_value='<value A>',
            metric_b_label='<label B>', metric_b_value='<value B>',
            body='<main paragraph>',
            implication='<italic closing line>',
            accent=C['indigoLight'],
            is_highlight=False,
        ),
        scenario_card(
            eyebrow='SHIFT 03',
            headline_value='<key word>', headline_unit='<tagline>',
            metric_a_label='<label A>', metric_a_value='<value A>',
            metric_b_label='<label B>', metric_b_value='<value B>',
            body='<main paragraph>',
            implication='<italic closing line>',
            accent=C['rose'],
            is_highlight=False,
        ),
    ]
    grid = (f'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;'
            f'background:{C["inkLine"]};">{"".join(shifts)}</div>')

    headline = f'Decide in {italic("30 days", C["lime"])}.'   # TODO adjust
    body = '<framing of why this is a 30-day decision>'

    return page(
        section_header('04 · The Three Shifts', headline, body, on_cream=False) + grid,
        background=C['ink'],
    )


# ============================================================
# PAGE 6 — Tactics, Ranked (top 9 only — more overflows)
# ============================================================
def make_tactics_page():
    tactics = [
        ('T-001', 9.5, 'S', '<title>', '<Tool tags>'),
        # ... top 9 by priority_score
    ]
    rows_html = ''
    for i, (tid, prio, effort, title, tools) in enumerate(tactics[:9]):
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

    headline = f'<N> moves, ranked by {italic("impact ÷ effort")}.'   # TODO adjust count
    body = '<framing — typically: top 9 shown, first 5 are the 30-day slate>'

    return page(
        section_header('05 · Tactics, Ranked', headline, body) + rows_html,
        background=C['cream'],
    )


# ============================================================
# PAGE 7 — Risks Q&A
# ============================================================
def make_risks_page():
    qa_items = [
        ('Investor narrative risk', '<body>'),
        ('Concentration risk', '<body>'),
        ('Domain reputation risk', '<body>'),  # or technical-debt risk
        ('Hire-time risk', '<body>'),
    ]
    qa_html = ''.join(qa_row(i + 1, q, a) for i, (q, a) in enumerate(qa_items))

    callout_html = callout(
        eyebrow='The cheapest fix',
        body=(f'<1-sentence quantification of the recommended path. Use '
              f'{mono("numbers", C["ink"])} for any quantification and '
              f'{italic("italics")} for the conceptual win.>'),
        accent=C['indigo'],   # NOT crimson — callout is constructive
    )

    headline = f'What it costs to {italic("not act")}.'   # TODO adjust
    body = '<framing — risks individually survivable but compound>'

    return page(
        section_header('06 · Risks if Status Quo Persists', headline, body)
        + qa_html + callout_html,
        background=C['cream'],
    )


# ============================================================
# PAGE 8 — Closing
# ============================================================
def make_closing_page():
    closing_metrics = [
        {'label': '30-day slate', 'value': '<N>', 'sub': 'Tactics that ship by <date>'},
        {'label': 'Decision needed', 'value': '<M>', 'sub': '<binary decisions>'},
        {'label': 'Hours to value', 'value': '~<H>', 'sub': 'Sprint-1 tactics combined'},
    ]
    metrics_row = metric_tile_row(closing_metrics, on_cream=False)

    tagline = closing_tagline(
        headline=(f'<closing line — short, with one or two italic words, '
                  f'optionally with a {italic("lime", C["lime"])} accent>'),
        lines=[
            f'AUDIT ENGINE · v0.7.2 · {RUN_DATE.upper()}',
            '<scope summary line>',
            '<who ran it · workspace>',
        ],
    )

    return page(
        f'<div style="height:100%;display:flex;flex-direction:column;'
        f'justify-content:space-between;">{metrics_row}{tagline}</div>',
        background=C['ink'],
    )


# ============================================================
# Build + verify
# ============================================================
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
    output = Path(f'/mnt/user-data/outputs/{CLIENT_SLUG}_gtm_audit.pdf')
    output.parent.mkdir(parents=True, exist_ok=True)
    build_deck(pages, output_path=output,
               title=f'{CLIENT_NAME} · GTM Stack Audit · {RUN_DATE}')
    print(f'Wrote {output} ({output.stat().st_size:,} bytes)')

    # MANDATORY visual inspection
    import pypdfium2 as pdfium
    pdf = pdfium.PdfDocument(output)
    preview_dir = Path('/tmp/audit_pdf_preview')
    preview_dir.mkdir(exist_ok=True)
    for i, p in enumerate(pdf):
        p.render(scale=0.7).to_pil().save(preview_dir / f'p{i+1}.png')
    print(f'Previews in {preview_dir} — VIEW EACH ONE before declaring done.')


if __name__ == '__main__':
    main()
