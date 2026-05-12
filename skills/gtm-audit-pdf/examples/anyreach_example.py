"""
Anyreach GTM Stack Audit — Editorial PDF brief.

Multi-page landscape PDF built on the anyreach-deck system. Reframes
the JSON audit output as an investor-quality strategy memo.

Pages:
  1. Hero — the audit's argument in one sentence + 4 hero metrics
  2. Where the gap is — the 4 critical findings as detail tiles (ink)
  3. Tools audited — Attio + Apollo state side-by-side (cream)
  4. The full findings ledger — all 12 findings in a table (cream)
  5. Three strategic shifts — what to do (ink)
  6. Tactics, ranked — the priority backlog (cream)
  7. Risks if status quo persists — Q&A style (cream)
  8. Closing — the audit's one-line bet (ink)
"""

from pathlib import Path
import sys

SKILL_ROOT = Path('/mnt/skills/user/anyreach-deck')
sys.path.insert(0, str(SKILL_ROOT))

from lib.tokens import C, TYPE, FONT_DISPLAY, FONT_BODY, FONT_MONO, label_style, SPACE
from lib.components import (
    page, hero_block, section_header, tile_grid, metric_tile,
    metric_tile_row, detail_tile, qa_row, scenario_card, callout,
    closing_tagline, italic, mono, label,
)
from lib.render import build_deck


# ============================================================
# PAGE 1 — Hero / cover
# ============================================================
def make_hero_page():
    metrics = [
        {'label': 'Findings',          'value': '12',     'sub': '4 critical · 5 high · 3 medium'},
        {'label': 'Tactics',           'value': '12',     'sub': 'Effort: 4 XS · 5 S · 3 M'},
        {'label': 'Tools audited',     'value': '02',     'sub': 'Attio · Apollo'},
        {'label': 'Audit runtime',     'value': '30 min', 'sub': 'MCP-orchestrated · all-time data'},
    ]

    # Custom hero — the standard hero_block uses 170px which forces a 4-line
    # break for our headline. Use 120px for a 2-line balanced layout.
    hero = f'''
        <div style="padding-top:0;">
            <div style="{label_style(True)}margin-bottom:24px;">
                GTM Stack Audit · Anyreach Inc · 09 May 2026
            </div>
            <h1 style="font-family:{FONT_DISPLAY};font-size:120px;
                       line-height:0.96;letter-spacing:-0.025em;margin:0;
                       font-weight:500;color:{C['ink']};max-width:1180px;">
                Pitch versus {italic("data")}.
            </h1>
            <p style="margin-top:28px;font-size:{TYPE['body_lg']}px;
                      line-height:1.55;color:{C['mutedOnCream']};max-width:760px;">
                Two tools audited. Twelve findings. Four critical. The pattern
                across them is not complexity — it is drift between what Anyreach
                sells, what its CRM is measuring, and what its outbound is doing.
            </p>
            <div style="margin-top:18px;font-size:{TYPE['body_xs']}px;
                        color:{C['mutedOnCream']};">
                Audit by Anyreach Audit Engine v0.7.2 · for richard@anyreach.ai
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
# PAGE 2 — Critical findings as detail tiles (ink bg)
# ============================================================
def make_critical_findings_page():
    findings = [
        {
            'eyebrow': 'F-001', 'eyebrow_aux': 'CRITICAL',
            'title': 'ICP drift',
            'value': '0/5', 'value_caption': 'won deals are BPOs',
            'ratio': 'The pitch is BPOs. The bookings are healthcare.',
            'bullets': [
                '11 Apollo sequences · 0 target BPOs',
                '50% of 146 deals tagged Low ICP fit',
                'Only 2.1% of deals source from the BPO channel',
                '3 of 5 won deals are healthcare end-customers',
            ],
        },
        {
            'eyebrow': 'F-002', 'eyebrow_aux': 'CRITICAL',
            'title': 'Apollo cannot send',
            'value': '0', 'value_caption': 'linked email accounts',
            'ratio': '12 weeks of dormancy on a paid plan.',
            'bullets': [
                '10 of 11 sequences active · all unable to send',
                'Single user owning sequences not present in CRM',
                '9.6M AI · 59K lead · 58K dial credits at 0% used',
                'Last send: 16 February · 82 days ago',
            ],
        },
        {
            'eyebrow': 'F-003', 'eyebrow_aux': 'CRITICAL',
            'title': 'No team in CRM',
            'value': '100%', 'value_caption': 'deals owned by CEO',
            'ratio': 'One calendar caps every growth lever.',
            'bullets': [
                '146 deals · 1 owner · gini 1.0',
                '8 of 10 Attio seats suspended',
                '"demo@anyreach.ai" is the only other active seat',
                'Succession risk: any 2-week absence stalls every deal',
            ],
        },
        {
            'eyebrow': 'F-004', 'eyebrow_aux': 'CRITICAL',
            'title': 'Pipeline math broken',
            'value': '<20%', 'value_caption': 'deals with deal value set',
            'ratio': 'Forecasting is foreclosed until this is fixed.',
            'bullets': [
                'Status set on 6.2% · AI-type on 4.8%',
                'ARR set on ~15% · value on ~20%',
                'No structured loss-reason field exists',
                'A 2-hour Saturday unlocks every other analysis',
            ],
        },
    ]

    tiles_html = [
        detail_tile(**f, on_cream=False, accent=C['lime'] if i == 0 else C['indigoLight'])
        for i, f in enumerate(findings)
    ]
    grid = tile_grid(tiles_html, columns=4, on_cream=False)

    headline = (f'Where the {italic("gap", C["lime"])} is.')
    body = (f'Four critical findings, four different roots — but the same diagnosis. '
            f'Each is independently fixable. Together they describe a GTM machine '
            f'that is mostly off, and the parts that run, run on the wrong target.')

    return page(
        section_header('01 · Critical Findings', headline, body, on_cream=False)
        + grid,
        background=C['ink'],
    )


# ============================================================
# PAGE 3 — Tools audited side-by-side
# ============================================================
def make_tools_page():
    # Build the two tool cards manually as inner HTML for tile_grid
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

    attio_card = tool_card(
        'Attio', 'CRM · Production',
        'Needs attention', C['amber'],
        [
            ('Companies', '46,191'),
            ('People', '111,116'),
            ('Deals', '146'),
            ('Active users', '2 of 10'),
            ('% companies classified', '0.8%'),
            ('Owner concentration', '100% (CEO)'),
            ('Pipeline stages', '17'),
        ],
        'Single-owner pipeline with 99.2% of companies unclassified. 17 stages, 5 of them duplicate scheduling states. Parallel pipeline tracked on companies object contradicts the deals object.',
        C['amber'],
    )

    apollo_card = tool_card(
        'Apollo', 'Sales engagement · Production',
        'Critical', C['crimson'],
        [
            ('Sequences active', '10 of 11'),
            ('Linked email accounts', '0'),
            ('Days since last send', '82'),
            ('AI credits used', '0% of 9.6M'),
            ('Lead credits used', '0% of 59K'),
            ('Aggregate bounce rate', '9.2%'),
            ('Reply rate', '0.73%'),
        ],
        'Cannot send a single email today. Owner of all sequences does not exist in Attio — likely a former employee. 6.8% hard bounce rate has already damaged sender reputation.',
        C['crimson'],
    )

    grid = tile_grid([attio_card, apollo_card], columns=2, on_cream=True)

    headline = (f'Two systems, {italic("one functioning")}.')
    body = (f'Attio is a populated database with low classification and one user. '
            f'Apollo is a paid plan that cannot send mail. Each tool individually '
            f'looks recoverable; together, the GTM stack delivers no compounding outcome.')

    return page(
        section_header('02 · Tool Inventory', headline, body)
        + grid,
        background=C['cream'],
    )


# ============================================================
# PAGE 4 — Findings ledger (all 12)
# ============================================================
def make_findings_ledger_page():
    findings = [
        ('F-001', 'critical', 'ICP drift: stated BPO, actual healthcare', 'Attio + Apollo'),
        ('F-002', 'critical', 'Zero pipeline coverage from Apollo (0 inboxes)', 'Apollo'),
        ('F-003', 'critical', 'Single-owner pipeline · 100% on CEO', 'Attio'),
        ('F-004', 'critical', 'Pipeline math broken · >80% of deals lack value', 'Attio'),
        ('F-005', 'high',     'Stage sprawl · 17 stages + parallel pipeline', 'Attio'),
        ('F-006', 'high',     'EGS Global concentration · top revenue + top churn', 'Attio'),
        ('F-007', 'high',     '46K-company graveyard · 99.2% unclassified', 'Attio'),
        ('F-008', 'high',     'Zombie spend on Apollo · 0% credit utilization', 'Apollo'),
        ('F-009', 'high',     'Deliverability failing · 6.8% hard bounce', 'Apollo'),
        ('F-010', 'medium',   'Stage/Status inconsistency on 3 churn deals', 'Attio'),
        ('F-011', 'medium',   'Prospects list 14 months stale', 'Attio'),
        ('F-012', 'medium',   'Loss/churn taxonomy missing', 'Attio'),
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

    headline = (f'The ledger of {italic("twelve")}.')
    body = (f'Every finding, sorted by severity. Each links to evidence in the audit JSON, '
            f'and to a tactic with a priority score and effort estimate.')

    return page(
        section_header('03 · Findings Ledger', headline, body)
        + rows_html,
        background=C['cream'],
    )


# ============================================================
# PAGE 5 — Three strategic shifts (ink bg, scenario cards)
# ============================================================
def make_shifts_page():
    shifts = [
        scenario_card(
            eyebrow='SHIFT 01',
            headline_value='ICP', headline_unit='align CRM, brand, outbound',
            metric_a_label='Companies to triage', metric_a_value='~5K of 46K',
            metric_b_label='Sequences to rebuild', metric_b_value='all 11',
            body=('Pick BPO or healthcare-services. Filter Attio to ~5K ICP-fit '
                  'companies. Rebuild Apollo sequences for the chosen ICP. '
                  'Verify the list before sending.'),
            implication='The hybrid state is the most expensive of the three options.',
            accent=C['lime'],
            is_highlight=True,
        ),
        scenario_card(
            eyebrow='SHIFT 02',
            headline_value='Hygiene', headline_unit='write-once data asset',
            metric_a_label='Required fields', metric_a_value='value · ARR · stage · source',
            metric_b_label='Stages to collapse', metric_b_value='17 → 6',
            body=('Make value+ARR+stage+source required at deal creation. '
                  'Add structured loss_reason and churn_reason. Delete the '
                  'duplicate bpo_deals field on companies.'),
            implication='A few hours of work that unlocks every other analysis.',
            accent=C['indigoLight'],
            is_highlight=False,
        ),
        scenario_card(
            eyebrow='SHIFT 03',
            headline_value='Apollo', headline_unit='go or goes, this sprint',
            metric_a_label='Go path', metric_a_value='Inbox · domain · sequence',
            metric_b_label='Goes path', metric_b_value='Downgrade · cancel',
            body=('Either link an inbox this week, transfer ownership, warm a fresh '
                  'domain, ship one BPO sequence at <50/day — or downgrade and '
                  'rely on advisors and inbound.'),
            implication='The third option (zombie spend) is not acceptable.',
            accent=C['rose'],
            is_highlight=False,
        ),
    ]

    grid = (f'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1px;'
            f'background:{C["inkLine"]};">{"".join(shifts)}</div>')

    headline = (f'Decide in {italic("30 days", C["lime"])}.')
    body = (f'The right posture is not to optimize this stack. It is to decide whether '
            f'Anyreach is in founder-led-sales mode (turn the machinery off) or rebuilding '
            f'a real sales motion (turn it on, properly). Three shifts, in order.')

    return page(
        section_header('04 · The Three Shifts', headline, body, on_cream=False)
        + grid,
        background=C['ink'],
    )


# ============================================================
# PAGE 6 — Tactics ranked
# ============================================================
def make_tactics_page():
    tactics = [
        ('T-001', 9.5, 'S',  "Decide Apollo's fate this sprint", 'Apollo'),
        ('T-002', 9.2, 'S',  'Make value/ARR/stage/source required at deal creation', 'Attio'),
        ('T-003', 9.0, 'M',  'Pick one ICP and align CRM, Apollo, brand', 'Attio · Apollo'),
        ('T-004', 8.5, 'S',  'Collapse Attio pipeline 17→6 · delete parallel pipeline', 'Attio'),
        ('T-005', 8.4, 'S',  'Reconcile EGS state · publish canonical retention number', 'Attio'),
        ('T-006', 8.0, 'M',  'Triage 46K companies · tag ~5K ICP · archive rest', 'Attio'),
        ('T-007', 7.8, 'XS', 'Add structured loss_reason / churn_reason picklists', 'Attio'),
        ('T-008', 7.5, 'M',  'Verify list, warm fresh domain, throttle volume', 'Apollo · DNS'),
        ('T-009', 7.0, 'S',  'Decide founder-led-sales vs first-AE-hire', 'Attio · HR'),
    ]

    rows_html = ''
    for i, (tid, prio, effort, title, tools) in enumerate(tactics):
        is_first = i == 0
        # effort bars
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
    body = ('Top 9 shown. The first five — T-001 through T-005 — are the 30-day '
            'execution slate. Three more (T-006 through T-008) ship in days 30–60. '
            'The full backlog is roughly 12 working days of focused effort.')

    return page(
        section_header('05 · Tactics, Ranked', headline, body)
        + rows_html,
        background=C['cream'],
    )


# ============================================================
# PAGE 7 — Risks if status quo persists (Q&A)
# ============================================================
def make_risks_page():
    qa_items = [
        ('Investor narrative risk',
         'Saying "we have a sales motion" while the CRM shows 1 active user, '
         '5 won deals in 14 months, and a broken Apollo will not survive '
         'diligence. Better to surface this voluntarily and frame the rebuild.'),
        ('Concentration risk',
         'EGS represents 47% of won ARR. Any further EGS deterioration drops '
         'Anyreach below $500K of clean won ARR. Two more advisor relationships '
         'in 90 days is the cheapest mitigation.'),
        ('Domain reputation risk',
         'A 6.8% hard bounce rate on existing sends has already damaged the '
         'sending domain. If outbound restarts on the same lists from the same '
         'domain, deliverability will collapse before any campaign matters.'),
        ('Hire-time risk',
         'When Anyreach hires its first AE, they will see 46K unclassified '
         'companies, 17 stages, all deals on the CEO, and a Prospects list '
         '14 months stale. Their first 30 days will go to cleanup, not selling.'),
    ]
    qa_html = ''.join(qa_row(i + 1, q, a) for i, (q, a) in enumerate(qa_items))

    callout_html = callout(
        eyebrow='The cheapest fix',
        body=(f'The five sprint-1 tactics combined are {mono("under 12 hours", C["ink"])} '
              f'of focused work and produce {italic("a canonical retention number, "
              "a CRM that answers pipeline-coverage truthfully, an honest Apollo state, "
              "and a single named ICP")} — together, the basis for a clean fundraise '
              f'narrative.'),
        accent=C['indigo'],
    )

    headline = f'What it costs to {italic("not act")}.'
    body = ('Each risk below is independently survivable. Together, they '
            'compound — and the compounding is what changes whether the next '
            'fundraise gets a clean diligence pass or a long set of follow-up emails.')

    return page(
        section_header('06 · Risks if Status Quo Persists', headline, body)
        + qa_html + callout_html,
        background=C['cream'],
    )


# ============================================================
# PAGE 8 — Closing
# ============================================================
def make_closing_page():
    # Three closing stat tiles
    closing_metrics = [
        {'label': '30-day slate', 'value': '5',  'sub': 'Tactics that ship by 09 June'},
        {'label': 'Decision needed','value': '2',  'sub': 'ICP commitment · Apollo go/goes'},
        {'label': 'Hours to value','value': '~12', 'sub': 'Sprint-1 tactics combined'},
    ]
    metrics_row = metric_tile_row(closing_metrics, on_cream=False)

    tagline = closing_tagline(
        headline=(f'The audit is not a {italic("verdict")}. '
                  f'It is a {italic("checklist", C["lime"])}.'),
        lines=[
            'AUDIT ENGINE · v0.7.2 · 09 MAY 2026',
            'Two tools · twelve findings · twelve tactics · thirty minutes runtime',
            'Run by richard@anyreach.ai · Anyreach workspace',
        ],
    )

    return page(
        f'<div style="height:100%;display:flex;flex-direction:column;'
        f'justify-content:space-between;">{metrics_row}{tagline}</div>',
        background=C['ink'],
    )


# ============================================================
# Build
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
    output = Path('/home/claude/anyreach_gtm_audit.pdf')
    build_deck(pages, output_path=output, title='Anyreach · GTM Stack Audit · May 2026')
    print(f'Wrote {output} ({output.stat().st_size:,} bytes)')


if __name__ == '__main__':
    main()
