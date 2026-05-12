"""
Anyreach Deck (PPTX) — Example.

A 4-slide example deck demonstrating every component pattern in the
library. Mirrors examples/example_deck.py from the PDF version of the
skill so you can see the same content rendered as native PPTX.

Run from the skill root:
    cd /path/to/anyreach-deck-pptx
    python -m examples.example_deck

Output: examples/example_deck.pptx
"""

from pathlib import Path
import sys

# Make the skill root importable from anywhere
SKILL_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SKILL_ROOT))

from lib.tokens import C, TYPE, SPACE, PAGE_W, PAGE_H
from lib.components import (
    blank_slide, hero_block, section_header,
    tile_grid, metric_tile, metric_tile_row, detail_tile,
    qa_row, scenario_card, callout, closing_tagline,
    italic, mono, label, add_rect, rich_text,
)
from lib.charts import donut, donut_legend, stacked_area, bridge_bars, comparison_bars
from lib.render import build_deck


# ============================================================
# SLIDE 1 — Hero / cover
# ============================================================
def make_hero_slide(prs):
    slide = blank_slide(prs, background='cream')

    hero_block(
        slide,
        eyebrow='Example Deck · Anyreach Design System',
        headline_runs=[
            'Why ',
            italic('$15M'),
            '.',
        ],
        subhead=('The number is not aspirational. It is the smallest raise '
                 'that funds the embed motion at scale, and the largest '
                 'that defends best-in-class capital efficiency.'),
        byline='Prepared by Richard Lin · CEO · richard@anyreach.ai',
        on_cream=True,
    )

    # Metric tile row pinned near the bottom — sized big to use the
    # vertical space available below the hero block.
    metrics = [
        {'label': 'Raise',     'value': '$15M',  'sub': 'Series A · Q4 2026'},
        {'label': 'Runway',    'value': '24 mo', 'sub': 'Base case · to Series B'},
        {'label': 'ARR Target','value': '$50M',  'sub': '44× from $1.13M today'},
        {'label': 'Burn Mult.','value': '0.31x', 'sub': 'vs. 1.6x cloud median'},
    ]
    tile_h = 240
    metric_tile_row(
        slide,
        x=SPACE['page_pad_x'],
        y=PAGE_H - SPACE['page_pad_y'] - tile_h,
        w=PAGE_W - 2 * SPACE['page_pad_x'],
        h=tile_h,
        metrics=metrics,
        on_cream=True,
    )


# ============================================================
# SLIDE 2 — Donut + legend + rollup
# ============================================================
def make_donut_slide(prs):
    slide = blank_slide(prs, background='ink')

    cursor_y = section_header(
        slide,
        label_text='01 · Use of Funds',
        headline_runs=[
            'Where the ',
            italic('money goes', color='lime'),
            '.',
        ],
        body=('Total 24-month spend is $28.4M. Revenue collected covers '
              '$13–15M of it. The $15M raise closes the gap.'),
        on_cream=False,
    )

    fund_data = [
        {'name': 'People · R&D',           'value': 8.4, 'pct': 30, 'color': 'indigo'},
        {'name': 'People · GTM + Delivery','value': 9.6, 'pct': 34, 'color': 'indigoLight'},
        {'name': 'People · G&A',           'value': 3.8, 'pct': 13, 'color': 'indigoDeep'},
        {'name': 'Compute & Infra',        'value': 3.0, 'pct': 10, 'color': 'lime'},
        {'name': 'Programs · Tools',       'value': 2.5, 'pct':  9, 'color': 'amber'},
        {'name': 'Contingency',            'value': 1.1, 'pct':  4, 'color': 'rose'},
    ]
    total = sum(d['value'] for d in fund_data)

    # Donut on the left — sized large to be the visual anchor of the slide
    donut_x = SPACE['page_pad_x']
    donut_size = 380
    donut(
        slide,
        x=donut_x, y=cursor_y,
        size=donut_size,
        data=fund_data,
        center_label='Gross Spend · 24mo',
        center_value=f'${total:.1f}M',
        on_cream=False,
    )

    # Legend on the right — taller rows + tighter spacing to fill horizontally
    legend_x = donut_x + donut_size + 60
    legend_w = PAGE_W - legend_x - SPACE['page_pad_x']
    donut_legend(
        slide,
        x=legend_x, y=cursor_y + 30,
        w=legend_w,
        data=fund_data,
        on_cream=False,
        row_h=42,
    )

    # Bottom rollup row — pinned to bottom margin
    rollup_h = 180
    rollup_y = PAGE_H - SPACE['page_pad_y'] - rollup_h
    metric_tile_row(
        slide,
        x=SPACE['page_pad_x'], y=rollup_y,
        w=PAGE_W - 2 * SPACE['page_pad_x'], h=rollup_h,
        metrics=[
            {'label': 'People · 77%',    'value': '$21.8M',
             'sub': '66 avg FTEs · blended $165K loaded',
             'size': TYPE['metric_md']},
            {'label': 'Compute · 10%',   'value': '$3.0M',
             'sub': 'Inference + reserved GPU · 10× scale',
             'size': TYPE['metric_md']},
            {'label': 'Programs · 13%',  'value': '$3.6M',
             'sub': 'Legal, S&M, tooling, audits, contingency',
             'size': TYPE['metric_md']},
        ],
        on_cream=False,
    )


# ============================================================
# SLIDE 3 — detail_tile grid + rollup metrics
# ============================================================
def make_detail_slide(prs):
    slide = blank_slide(prs, background='cream')

    cursor_y = section_header(
        slide,
        label_text='02 · Headcount Logic',
        headline_runs=[
            'The company is ',
            italic('four shapes'),
            ' at once.',
        ],
        body=('The embed motion stacks four distinct staffing curves: BPO '
              'partnership coverage, end-client delivery, the proprietary '
              'stack, and internal scaffolding. Each layer has its own ratio.'),
        on_cream=True,
    )

    layers = [
        {'eyebrow': '01', 'eyebrow_aux': '14 avg', 'title': 'BPO Partnership',
         'value': '23', 'value_caption': 'FTEs · M24',
         'ratio': '1 pod (Lead + SA) per 3 BPOs',
         'bullets': ['6 internal teams per BPO',
                     'MSA · BAA · revenue share',
                     'Co-selling motion w/ BPO Sales']},
        {'eyebrow': '02', 'eyebrow_aux': '18 avg', 'title': 'End-Client',
         'value': '31', 'value_caption': 'FTEs · M24',
         'ratio': '1 pod per 5–25 clients (by tier)',
         'bullets': ['Tier 1: 1 TAM + 1 eng per 5',
                     'Tier 2: 1 TAM + 0.5 eng per 10',
                     'Tier 3: 1 CSM per 25']},
        {'eyebrow': '03', 'eyebrow_aux': '22 avg', 'title': 'Product · R&D',
         'value': '35', 'value_caption': 'FTEs · M24',
         'ratio': 'The moat — ML, platform, product',
         'bullets': ['8 ML/Speech (DualTurn, ASR, TTS)',
                     '7 Platform · 8 Product eng',
                     '3 Voice UX · 4 PMs · 2 Design']},
        {'eyebrow': '04', 'eyebrow_aux': '12 avg', 'title': 'Internal · GTM',
         'value': '17', 'value_caption': 'FTEs · M24',
         'ratio': 'Net-new BPO sales + scaffolding',
         'bullets': ['4 AEs hunting net-new BPOs',
                     '3 Marketing · 3 Finance/RevOps',
                     '2 People · 1 Legal · 1 IT']},
    ]
    tile_fns = [
        detail_tile(**l, on_cream=True, accent='indigo')
        for l in layers
    ]

    grid_x = SPACE['page_pad_x']
    grid_w = PAGE_W - 2 * SPACE['page_pad_x']
    grid_y = cursor_y
    grid_h = 320
    tile_grid(slide, grid_x, grid_y, grid_w, grid_h, tile_fns,
              columns=4, on_cream=True)

    # Rollup row pinned to bottom margin
    rollup_h = 160
    rollup_y = PAGE_H - SPACE['page_pad_y'] - rollup_h
    add_rect(slide, grid_x, rollup_y - 14, grid_w, 1, fill_token='creamLine')
    metric_tile_row(
        slide,
        x=grid_x, y=rollup_y,
        w=grid_w, h=rollup_h,
        metrics=[
            {'label': 'Total M24',     'value': '106',   'sub': 'up from 9 today',
             'size': TYPE['metric_md']},
            {'label': '24-mo avg',     'value': '66',    'sub': 'weighted by ramp',
             'size': TYPE['metric_md']},
            {'label': 'Revenue / FTE', 'value': '$472K', 'sub': 'vs. $300–400K SaaS norm',
             'size': TYPE['metric_md']},
            {'label': 'US / Intl mix', 'value': '55/45', 'sub': 'India · Mexico · Ghana',
             'size': TYPE['metric_md']},
        ],
        on_cream=True,
    )


# ============================================================
# SLIDE 4 — Q&A + closing callout
# ============================================================
def make_qa_slide(prs):
    slide = blank_slide(prs, background='cream')

    cursor_y = section_header(
        slide,
        label_text='03 · The Strategic Case',
        headline_runs=[
            'Why ', italic('not less'),
            '. Why ', italic('not more'),
            '.',
        ],
        body=('The financial model is the floor. The strategic case is the '
              'reason it deserves a Series A. Each argument below is what '
              'an investor will ask, and the answer.'),
        on_cream=True,
    )

    qa_items = [
        ('Why not raise $10M?',
         'A $10M raise covers base case for 16 months — too short to prove '
         '$50M ARR for a Series B. The R&D layer (the moat) gets cut.'),
        ('Why not raise $25M?',
         'Adds $10M of dilution for capacity we cannot deploy efficiently. '
         'Pushes burn multiple from 0.31x to ~0.55x — out of top decile.'),
        ('Why is this Series A and not seed extension?',
         '7 BPO partners, $5M+ qualified pipeline, unprompted validation '
         'from $26B in combined BPO revenue. Risk has shifted from product '
         'to distribution at scale.'),
    ]

    qa_x = SPACE['page_pad_x']
    qa_w = PAGE_W - 2 * SPACE['page_pad_x']
    cy = cursor_y
    for i, (q, a) in enumerate(qa_items):
        cy = qa_row(slide, qa_x, cy, qa_w, i + 1, q, a, on_cream=True)

    # Sensitivity callout — pinned near the bottom margin, sized
    # to fill remaining vertical space below the Q&A rows.
    callout_h = 130
    callout_y = PAGE_H - SPACE['page_pad_y'] - callout_h
    callout(
        slide,
        x=qa_x, y=callout_y, w=qa_w, h=callout_h,
        eyebrow='Sensitivity',
        body_runs=[
            'If the mix skews ', italic('Tier 1'),
            ', delivery headcount rises to ', mono('~50 FTEs'),
            ' and the raise needs to be ', mono('$20M+'),
            '. Current pipeline maps to the base case.',
        ],
        accent='crimson',
        on_cream=True,
    )


# ============================================================
# Assemble the deck
# ============================================================
def main():
    output = SKILL_ROOT / 'examples' / 'example_deck.pptx'
    build_deck(
        slide_fns=[
            make_hero_slide,
            make_donut_slide,
            make_detail_slide,
            make_qa_slide,
        ],
        output_path=output,
        title='Anyreach Deck (PPTX) — Example',
    )
    print(f'Wrote {output} ({output.stat().st_size:,} bytes)')


if __name__ == '__main__':
    main()
