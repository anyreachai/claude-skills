"""
Orchestrator for the BPO outcomes-based ROI brief.

Usage:
    python render_brief.py <config.json> <output.pdf>
    python render_brief.py <config.json> <output.pdf> --html-only   # skip PDF render

The config JSON drives every part of the brief — see SKILL.md for the full
schema. The math layer (`roi_math.py`) computes derived numbers; this script
formats them, renders the Jinja template, and shells out to Playwright for PDF.

Brand colors and the BPO logo come from the config. The end-client never sees
this file directly; they see the rendered PDF.
"""

import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

import roi_math as rm


# ── Color shading helpers ──────────────────────────────────────
# When a BPO supplies only a single brand "navy" hex code, we derive the
# darker variants used in hero blocks.

def _hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def _rgb_to_hex(r, g, b):
    return '#{:02X}{:02X}{:02X}'.format(
        max(0, min(255, int(r))),
        max(0, min(255, int(g))),
        max(0, min(255, int(b))),
    )


def _darken(hex_color, factor=0.6):
    r, g, b = _hex_to_rgb(hex_color)
    return _rgb_to_hex(r * factor, g * factor, b * factor)


def _hex_to_rgba_string(hex_color, alpha=0.15):
    """Returns a string like 'rgba(15, 32, 50, 0.15)'."""
    r, g, b = _hex_to_rgb(hex_color)
    return f'rgba({r}, {g}, {b}, {alpha})'


def _lighten_to_pastel(hex_color, mix=0.92):
    """Return a very-light tint of the color (used for callout backgrounds)."""
    r, g, b = _hex_to_rgb(hex_color)
    r = int(r + (255 - r) * mix)
    g = int(g + (255 - g) * mix)
    b = int(b + (255 - b) * mix)
    return _rgb_to_hex(r, g, b)


# ── Format derivations from raw numbers ────────────────────────

def build_template_context(config, results):
    """
    Convert config + ROI math output into the flat dict the Jinja template
    expects. This is where rounding, formatting, and human-friendly text
    happens — keep all formatting decisions here, not in the template.
    """
    bpo = config['bpo']
    end_client = config['end_client']
    ai_partner = config.get('ai_partner', {'name': 'Anyreach AI'})

    # Derive brand color variants if not explicitly set
    brand = config['bpo'].get('brand', {})
    navy = brand.get('navy', '#003D6B')
    accent = brand.get('accent', '#E92983')
    brand_full = {
        'navy': navy,
        'navy_dark': brand.get('navy_dark', _darken(navy, 0.55)),
        'navy_deep': brand.get('navy_deep', _darken(navy, 0.40)),
        'accent': accent,
        'accent_soft': brand.get('accent_soft', _lighten_to_pastel(accent, 0.92)),
    }

    # ── Channel display ──
    # If config provides an explicit `current_state.channels_display` string,
    # use it (e.g., "chat · voice · WhatsApp" matches how Cognigy markets).
    # Otherwise auto-build from the volumes dict.
    explicit_channels = config.get('current_state', {}).get('channels_display')
    if explicit_channels:
        channels_display = explicit_channels
    else:
        volumes = results['volumes']
        channel_names = []
        if volumes.get('chat'): channel_names.append('chat')
        if volumes.get('voice'): channel_names.append('voice')
        if volumes.get('social'): channel_names.append('social')
        if volumes.get('email'): channel_names.append('email')
        if volumes.get('whatsapp') and 'social' not in channel_names: channel_names.append('WhatsApp')
        channels_display = ' · '.join(channel_names) or 'omni-channel'

    volumes = results['volumes']

    # Volume breakdown for the methodology footnote
    vol_parts = []
    for k in ('chat', 'voice', 'social', 'email', 'whatsapp'):
        if volumes.get(k):
            vol_parts.append(f'{rm.fmt_volume(volumes[k])} {k}')
    volume_breakdown_text = ' · '.join(vol_parts)

    # ── Compose phases for template ──
    phases_for_template = []
    for ph in results['phases']:
        phases_for_template.append({
            'name': ph['name'],
            'months': ph['months'],
            'containment_display': rm.fmt_pct(ph['containment'], decimals=0),
            'price_display': rm.fmt_price(ph['price_per_outcome']),
            'annualized_cost_display': rm.fmt_money_m(ph['annualized_cost']),
            'savings_pct_display': '−' + rm.fmt_pct(ph['savings_pct']),
        })

    # ── Total annual value calculation ──
    total_value = results['year1_savings']
    if results['retained_revenue']:
        total_value += results['retained_revenue']
    revenue_gen = config.get('revenue_generation', {}).get('annual_estimate')
    if revenue_gen:
        total_value += revenue_gen

    # ── Pilot total value display ──
    pilot_total = results['lh_savings_low']
    pilot_total_high = results['lh_savings_high']
    if results['lh_retained_revenue']:
        pilot_total += results['lh_retained_revenue']
        pilot_total_high += results['lh_retained_revenue']
    pilot_total_value_display = (
        f'{rm.fmt_money_m(pilot_total)}–{rm.fmt_money_m(pilot_total_high)}'
        if results['lh_retained_revenue']
        else f'{rm.fmt_money_m(results["lh_savings_low"])}–{rm.fmt_money_m(results["lh_savings_high"])}'
    )

    # ── Day-1 savings percentage (for message card A) ──
    phase1 = results['phases'][0]
    day1_savings_pct = (
        rm.fmt_pct((results['blended_cost'] - phase1['price_per_outcome']) / results['blended_cost'], decimals=0)
        if results['blended_cost']
        else '—'
    )

    # ── Footnotes ──
    containment_footnote = config.get('current_state', {}).get('containment_source')
    revenue_gen_footnote = config.get('revenue_generation', {}).get('source_note')

    # ── AI vendor name display ──
    ai_vendor_name = config.get('current_state', {}).get('ai_vendor', {}).get('name', 'Cognigy')

    # ── Path forward steps with sensible defaults ──
    path_forward = config.get('path_forward', [
        f'30-min ROI walk-through with {end_client["name"]} stakeholders',
        'Discovery workshop to validate outcome definitions',
        f'{end_client["short_name"]} names IT POC for system access',
        f'{bpo["name"]} prepares SOW for lighthouse pilot',
    ])

    # ── Decision steps with sensible defaults ──
    decision_steps = config.get('decision_steps', [
        {'title': '30-min alignment call', 'detail': 'Key stakeholders'},
        {'title': 'One IT contact named', 'detail': 'CCaaS + CRM + KB'},
        {'title': f'SOW signed → {results.get("pilot_timeline_short", "6–8")} wk pilot build',
         'detail': 'Within standard eval window'},
    ])

    return {
        # Brand & identity
        'brand': brand_full,
        'bpo': {**bpo, 'label': bpo.get('label', 'BPO')},
        'end_client': end_client,
        'ai_partner': ai_partner,
        'ai_vendor_name': ai_vendor_name,
        'engagement_label': config.get('engagement_label', 'Member Experience Partnership'),
        'channels_display': channels_display,
        'volume_breakdown_text': volume_breakdown_text,
        'tech_stack': config.get('tech_stack'),
        'voc_tool_footnote': config.get('voc_tool_footnote'),

        # Page 1 hero text (overridable)
        'page1': {
            'title': config.get('page1', {}).get('title', 'Outcomes-Based Member Experience'),
            'subtitle': config.get('page1', {}).get('subtitle', 'AI + Human, One Vendor, One Price'),
        },

        # Headline numbers (formatted)
        'total_volume_display': rm.fmt_volume(results['total_volume']),
        'fte_count_display': f'{results["fte_count"]:,.0f}',
        'fte_rate': f'{results["fte_rate"]:.0f}',
        'containment_display': rm.fmt_pct(results['containment'], decimals=1),
        'containment_footnote': containment_footnote,
        'ai_spend_display': rm.fmt_money_m(results['ai_spend']),
        'ai_spend_is_estimated': results['ai_spend_is_estimated'],
        'bpo_spend_display': rm.fmt_money_m(results['bpo_spend']),
        'total_cx_display': rm.fmt_money_m(results['total_cx_spend']),
        'blended_cost_display': f'${results["blended_cost"]:.2f}',
        'human_share_display': rm.fmt_pct(1 - results['containment'], decimals=1),
        'cx_pct_display': rm.fmt_pct(results['cx_pct_of_revenue'], decimals=1) if results['cx_pct_of_revenue'] else None,

        # Pricing cascade
        'phases': phases_for_template,
        'phase_fte_counts': results['phase_fte_counts'],
        'phase1_price_display': rm.fmt_price(results['phases'][0]['price_per_outcome']),
        'phase1_containment': rm.fmt_pct(results['phases'][0]['containment'], decimals=0),
        'phase3_containment': rm.fmt_pct(results['phases'][-1]['containment'], decimals=0),
        'day1_savings_pct': day1_savings_pct,

        # Year-1 / value strip
        'year1_savings_display': rm.fmt_money_m(results['year1_savings']),
        'retained_revenue_display': rm.fmt_money_m(results['retained_revenue']) if results['retained_revenue'] else None,
        'retention_lift_label': f'{results["retention_lift_pct"] * 100:g}%',
        'revenue_gen_display': rm.fmt_money_m(revenue_gen) if revenue_gen else None,
        'revenue_gen_footnote': revenue_gen_footnote,
        'total_value_display': rm.fmt_money_m(total_value) + '+' if revenue_gen else rm.fmt_money_m(total_value),

        # Page 2 content
        'use_cases': config.get('use_cases', []),
        'priorities': config.get('priorities', []),
        'target_kpis': config.get('target_kpis'),
        'target_kpis_footnote': config.get('target_kpis_footnote'),
        'path_forward': path_forward,

        # Page 3 — pilot
        'pilot': config.get('pilot', {}),
        'lh_volume_share_display': rm.fmt_pct(results['lh_volume_share'], decimals=0),
        'lh_volume_display': rm.fmt_volume(results['lh_volume']),
        'lh_target_containment_display': rm.fmt_pct(results['lh_target_containment'], decimals=0),
        'lh_savings_low_display': rm.fmt_money_m(results['lh_savings_low']),
        'lh_savings_high_display': rm.fmt_money_m(results['lh_savings_high']),
        'lh_retained_revenue_display': rm.fmt_money_m(results['lh_retained_revenue']) if results['lh_retained_revenue'] else None,
        'pilot_total_value_display': pilot_total_value_display,
        'decision_steps': decision_steps,
    }


# ── Rendering ─────────────────────────────────────────────────

def render_html(config_path, output_html):
    """Render config to HTML string. Pure function — no side effects beyond write."""
    try:
        from jinja2 import Environment, FileSystemLoader, select_autoescape
    except ImportError:
        print('Installing jinja2...', file=sys.stderr)
        subprocess.check_call(['pip', 'install', 'jinja2', '--break-system-packages', '--quiet'])
        from jinja2 import Environment, FileSystemLoader, select_autoescape

    config = json.loads(Path(config_path).read_text())
    results = rm.compute_roi(config)
    ctx = build_template_context(config, results)

    # Stage logo into the working directory
    output_dir = Path(output_html).parent
    output_dir.mkdir(parents=True, exist_ok=True)
    logo_src = Path(config['bpo']['logo_path'])
    if not logo_src.is_absolute():
        # Resolve relative to the config file
        logo_src = (Path(config_path).parent / logo_src).resolve()
    logo_dst = output_dir / logo_src.name
    if logo_src.exists() and logo_src != logo_dst:
        shutil.copy(logo_src, logo_dst)
    # Update context to use bare filename (relative to HTML location)
    ctx['bpo']['logo_path'] = logo_src.name

    # Load template
    skill_dir = Path(__file__).resolve().parent.parent
    template_dir = skill_dir / 'assets'
    env = Environment(
        loader=FileSystemLoader(str(template_dir)),
        autoescape=select_autoescape(['html']),
    )
    # Smart possessive: case-aware
    # "Fabletics" → "Fabletics'", "Walmart" → "Walmart's"
    # "FABLETICS" → "FABLETICS'", "VERIZON" → "VERIZON'S"
    def _possessive(name):
        if not name:
            return name
        last = name[-1]
        if last.lower() == 's':
            return name + "'"
        return name + ("'S" if name.isupper() else "'s")
    env.filters['possessive'] = _possessive
    tpl = env.get_template('template.html')
    html = tpl.render(**ctx)

    Path(output_html).write_text(html)
    return ctx, results


def render_pdf(html_path, pdf_path):
    """Use Playwright to render HTML at 13.33×7.5in landscape pages."""
    # Lazy-install Playwright if missing
    try:
        from playwright.async_api import async_playwright  # noqa: F401
    except ImportError:
        print('Installing playwright (one-time setup)...', file=sys.stderr)
        subprocess.check_call(['pip', 'install', 'playwright', '--break-system-packages', '--quiet'])
        subprocess.check_call(['playwright', 'install', 'chromium'])

    import asyncio
    from playwright.async_api import async_playwright

    async def _render():
        abs_path = Path(html_path).resolve()
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            await page.goto(f'file://{abs_path}')
            await page.wait_for_load_state('networkidle')
            await page.pdf(
                path=pdf_path,
                width='13.33in',
                height='7.5in',
                margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'},
                print_background=True,
            )
            await browser.close()

    asyncio.run(_render())


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('config', help='Path to brief config JSON')
    ap.add_argument('output', help='Path to output PDF (or HTML if --html-only)')
    ap.add_argument('--html-only', action='store_true', help='Skip PDF render')
    ap.add_argument('--keep-html', action='store_true', help='Also keep the rendered HTML')
    args = ap.parse_args()

    out = Path(args.output)
    if args.html_only:
        ctx, results = render_html(args.config, out)
        print(f'HTML written: {out}')
    else:
        html_path = out.with_suffix('.html')
        ctx, results = render_html(args.config, html_path)
        render_pdf(html_path, str(out))
        if not args.keep_html:
            html_path.unlink()
        print(f'PDF written: {out}')

    # Print a quick summary so the user sees the cascade
    print()
    print('── Numbers cascade ──')
    print(f'  Total CX spend:        {rm.fmt_money_full(results["total_cx_spend"])}')
    print(f'  AI vendor:             {rm.fmt_money_full(results["ai_spend"])}'
          f' ({"estimated" if results["ai_spend_is_estimated"] else "provided"})')
    print(f'  BPO labor:             {rm.fmt_money_full(results["bpo_spend"])}')
    print(f'  Blended cost/outcome:  ${results["blended_cost"]:.2f}')
    print(f'  Year 1 savings:        {rm.fmt_money_full(results["year1_savings"])} '
          f'({rm.fmt_pct(results["year1_savings_pct"])})')
    print(f'  Year 2+ savings:       {rm.fmt_money_full(results["year2_savings"])} '
          f'({rm.fmt_pct(results["year2_savings_pct"])})')
    print(f'  Lighthouse savings:    {rm.fmt_money_full(results["lh_savings_low"])} – '
          f'{rm.fmt_money_full(results["lh_savings_high"])}')

    # ── Plausibility checks ──
    # The brief sells most credibly when Year 1 savings land in the 30–50% range.
    # >60% reads as "too good to be true" and slows the deal. <20% loses urgency.
    # When the current-state cost-per-outcome is very high (high-volume, high-rate ops),
    # the default $3/$2.75/$2.50 phases under-price the deal.
    warnings = []
    if results['year1_savings_pct'] > 0.60:
        warnings.append(
            f'Year 1 savings of {rm.fmt_pct(results["year1_savings_pct"])} is unusually high. '
            f'Current blended cost is ${results["blended_cost"]:.2f}/outcome — Phase 1 default of $3.00 '
            f'is leaving margin on the table. Consider raising the pricing curve under '
            f'`pricing_phases` to land Y1 savings in the 30–45% range (more credible). '
            f'For example, try Phase 1 = ${results["blended_cost"] * 0.65:.2f}, '
            f'Phase 2 = ${results["blended_cost"] * 0.55:.2f}, '
            f'Phase 3 = ${results["blended_cost"] * 0.50:.2f}.'
        )
    if results['year1_savings_pct'] < 0.20:
        warnings.append(
            f'Year 1 savings of {rm.fmt_pct(results["year1_savings_pct"])} is below the typical '
            f'30–45% range. The pitch loses urgency below 20%. Consider lowering Phase 1 price.'
        )
    if results['blended_cost'] < 1.50:
        warnings.append(
            f'Current blended cost ${results["blended_cost"]:.2f}/outcome is unusually low. '
            f'Verify FTE count, hourly rate, and AI vendor spend inputs.'
        )
    if results['blended_cost'] > 12:
        warnings.append(
            f'Current blended cost ${results["blended_cost"]:.2f}/outcome is unusually high. '
            f'The default pricing phases ($3.00 / $2.75 / $2.50) will produce >70% savings '
            f'which reads as "too good to be true". Override `pricing_phases` for this deal.'
        )
    # Retained revenue should not dwarf direct savings — it visually distorts the value strip
    if (results.get('retained_revenue') and results['year1_savings']
            and results['retained_revenue'] > 3 * results['year1_savings']):
        suggested = max(0.001, results['year1_savings'] / results['annual_revenue']) if results.get('annual_revenue') else 0.002
        warnings.append(
            f'Retained revenue ({rm.fmt_money_full(results["retained_revenue"])}) is '
            f'>3× direct savings ({rm.fmt_money_full(results["year1_savings"])}) — the value strip '
            f'will look unbalanced. For a {rm.fmt_money_full(results.get("annual_revenue", 0))} revenue base, '
            f'try lowering `retention_lift_pct` to {suggested:.3f} (or omit for very large enterprises).'
        )

    if warnings:
        print()
        print('⚠️  PLAUSIBILITY CHECKS')
        for w in warnings:
            print(f'   • {w}')


if __name__ == '__main__':
    main()
