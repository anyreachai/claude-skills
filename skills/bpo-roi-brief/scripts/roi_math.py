"""
ROI math for the BPO outcomes-based pricing model.

Takes raw current-state inputs from the brief config (volumes, FTEs, hourly rate,
AI containment, optional AI vendor spend) and produces all the derived numbers
the template needs: blended cost per outcome, phased pricing cascade, year-1
and year-2+ savings, lighthouse pilot value, etc.

The math mirrors the Fabletics ROI model exactly — same per-outcome pricing
philosophy, same containment ramp (Phase 1: 55%, Phase 2: 75%, Phase 3: 90%
unless overridden), same savings calculation.

All currency values are in millions for display, but stored as full numbers
internally so rounding only happens at the format step.
"""

import math


# ── Default pricing curve ──────────────────────────────────────
# These are the same defaults Anyreach proposed to Fabletics. Override by
# passing `pricing_phases` to compute_roi() if a particular deal needs
# different prices or containment milestones.
DEFAULT_PHASES = [
    {'name': 'Phase 1', 'months': '1-6', 'duration': 6,
     'containment': 0.55, 'price_per_outcome': 3.00},
    {'name': 'Phase 2', 'months': '7-9', 'duration': 3,
     'containment': 0.75, 'price_per_outcome': 2.75},
    {'name': 'Phase 3', 'months': '10+', 'duration': 3,
     'containment': 0.90, 'price_per_outcome': 2.50},
]

# Standard FTE working hours per year (40 hrs/wk * 52 weeks)
ANNUAL_HOURS_PER_FTE = 2080


# ── AI vendor spend estimation (Cognigy-style derivation) ──────
# When the AI vendor spend is unknown, we estimate from public per-conversation
# pricing. These are reasonable industry defaults — the actual rates can be
# overridden in the config under `ai_vendor.estimated_rates`.
DEFAULT_AI_RATES = {
    'voice': 0.55,         # $/conversation — voice typically lower at scale
    'chat': 0.60,          # $/conversation — discounted from public ~$0.99
    'social': 0.65,        # $/conversation — same tier as chat
    'platform_base': 150_000,  # annual platform license + LLM tokens
}


def estimate_ai_vendor_spend(volumes, rates=None):
    """
    Back-of-envelope estimate of AI vendor annual spend from contact volumes.

    Use when `current_state.ai_vendor.annual_spend` isn't provided in the config.
    Returns a dict with the breakdown so the brief can show the math in a
    methodology footnote.
    """
    rates = {**DEFAULT_AI_RATES, **(rates or {})}
    breakdown = {
        'voice': volumes.get('voice', 0) * rates['voice'],
        'chat': volumes.get('chat', 0) * rates['chat'],
        'social': volumes.get('social', 0) * rates['social'],
        'platform_base': rates['platform_base'],
    }
    breakdown['total'] = sum(breakdown.values())
    breakdown['rates_used'] = rates
    return breakdown


# ── Main ROI calculation ───────────────────────────────────────

def compute_roi(config):
    """
    Compute every number the brief template needs.

    Args:
        config: parsed brief config dict (see SKILL.md for schema)

    Returns:
        dict with all derived values, structured for direct template use.
    """
    cs = config['current_state']

    # ── Volumes ──
    volumes = cs['volumes']
    total_volume = sum(volumes.values())

    # ── AI vendor spend (use given or estimate) ──
    ai_vendor = cs.get('ai_vendor', {})
    if ai_vendor.get('annual_spend') is not None:
        ai_spend = float(ai_vendor['annual_spend'])
        ai_breakdown = None  # provided directly, no derivation needed
        ai_spend_is_estimated = False
    else:
        ai_breakdown = estimate_ai_vendor_spend(
            volumes,
            rates=ai_vendor.get('estimated_rates'),
        )
        ai_spend = ai_breakdown['total']
        ai_spend_is_estimated = True

    # ── BPO labor cost ──
    fte_count = cs['fte_count']
    fte_rate = cs['fte_hourly_rate']
    bpo_spend = fte_count * fte_rate * ANNUAL_HOURS_PER_FTE

    # ── Total CX spend + blended cost per outcome ──
    total_cx_spend = ai_spend + bpo_spend
    blended_cost = total_cx_spend / total_volume if total_volume else 0

    # ── Current containment math ──
    containment = cs['ai_containment_rate']
    ai_resolved = total_volume * containment
    human_resolved = total_volume - ai_resolved
    cost_per_ai_outcome = ai_spend / ai_resolved if ai_resolved else 0
    cost_per_human_outcome = bpo_spend / human_resolved if human_resolved else 0

    # ── Revenue benchmark ──
    annual_revenue = cs.get('annual_revenue')
    cx_pct_of_revenue = (
        total_cx_spend / annual_revenue if annual_revenue else None
    )

    # ── Phased pricing cascade ──
    phases_input = config.get('pricing_phases', DEFAULT_PHASES)
    monthly_volume = total_volume / 12

    phases = []
    for ph in phases_input:
        phase_volume = monthly_volume * ph['duration']
        phase_cost = ph['price_per_outcome'] * phase_volume
        # Annualized cost = price × annual volume (what Fabletics would pay if this rate held all year)
        annualized_cost = ph['price_per_outcome'] * total_volume
        phases.append({
            'name': ph['name'],
            'months': ph['months'],
            'duration': ph['duration'],
            'containment': ph['containment'],
            'price_per_outcome': ph['price_per_outcome'],
            'phase_cost': phase_cost,
            'annualized_cost': annualized_cost,
            'savings_vs_current': total_cx_spend - annualized_cost,
            'savings_pct': (total_cx_spend - annualized_cost) / total_cx_spend if total_cx_spend else 0,
        })

    # ── Year 1 / Year 2+ totals ──
    year1_total_cost = sum(ph['phase_cost'] for ph in phases)
    year1_blended_price = year1_total_cost / total_volume if total_volume else 0
    # Year 2+ assumed steady at the final phase price
    year2_price = phases[-1]['price_per_outcome']
    year2_total_cost = year2_price * total_volume

    year1_savings = total_cx_spend - year1_total_cost
    year1_savings_pct = year1_savings / total_cx_spend if total_cx_spend else 0
    year2_savings = total_cx_spend - year2_total_cost
    year2_savings_pct = year2_savings / total_cx_spend if total_cx_spend else 0

    # ── Phase-end FTE counts (for the "FTEs scale down" row) ──
    # Pure containment math (residual_volume / productivity_per_fte) is too
    # aggressive — real ops keeps Tier 2/3, supervisors, surge buffer, and
    # tenured agents on complex residual volume. We use a "complexity
    # multiplier" that retains more FTEs than pure containment implies.
    # The default curve roughly matches what Anyreach proposed to Fabletics:
    # Phase 1 (55% AI) → ~60% of FTEs retained
    # Phase 2 (75% AI) → ~32% retained
    # Phase 3 (90% AI) → ~13% retained
    # Override by passing per-phase fte_share in config.pricing_phases[*].fte_share
    fte_default_curve = {0.55: 0.60, 0.75: 0.32, 0.90: 0.13}
    phase_fte_counts = []
    for ph in phases_input:
        if 'fte_share' in ph:
            share = ph['fte_share']
        elif ph['containment'] in fte_default_curve:
            share = fte_default_curve[ph['containment']]
        else:
            # Linear interpolation: at 0% AI keep 100%, at 100% AI keep 0%, with retention buffer
            # Real curve: residual = (1 - containment) × complexity_multiplier
            # complexity_multiplier rises as containment grows (residual gets harder)
            residual = 1 - ph['containment']
            complexity = 1.0 + (1 - residual) * 0.5  # up to 1.5x for high-containment residual
            share = residual * complexity
            share = min(share, 1.0)
        ftes_needed = fte_count * share
        # Round to nearest 5 for readability
        phase_fte_counts.append(round(ftes_needed / 5) * 5)

    # ── Retained revenue (configurable CX lift on revenue) ──
    # Default 0.5% works for mid-market subscription brands. For very large
    # enterprises (>$10B revenue), 0.5% can dwarf the direct savings —
    # consider lowering to 0.1–0.2% via config.retention_lift_pct.
    retention_lift_pct = config.get('retention_lift_pct', 0.005)
    retained_revenue = (
        annual_revenue * retention_lift_pct if annual_revenue else None
    )

    # ── Lighthouse pilot math ──
    # Defaults to 35% of contact volume (typical for a "billing/skip/credit"
    # category in subscription retail). Configurable in config['lighthouse'].
    lh = config.get('lighthouse', {})
    lh_volume_share = lh.get('volume_share', 0.35)
    lh_volume = total_volume * lh_volume_share
    lh_target_containment = lh.get('target_containment', 0.65)
    # Cost savings range: 50%–80% of category-attributable spend
    category_current_spend = blended_cost * lh_volume
    lh_savings_low = category_current_spend * 0.50
    lh_savings_high = category_current_spend * 0.80
    # Retained revenue contribution (if revenue is known)
    lh_retained_revenue = retained_revenue * 0.9 if retained_revenue else None

    return {
        # Inputs surfaced for the template
        'total_volume': total_volume,
        'volumes': volumes,
        'ai_spend': ai_spend,
        'ai_spend_is_estimated': ai_spend_is_estimated,
        'ai_breakdown': ai_breakdown,
        'fte_count': fte_count,
        'fte_rate': fte_rate,
        'bpo_spend': bpo_spend,
        'containment': containment,
        # Derived
        'total_cx_spend': total_cx_spend,
        'blended_cost': blended_cost,
        'cost_per_ai_outcome': cost_per_ai_outcome,
        'cost_per_human_outcome': cost_per_human_outcome,
        'ai_resolved': ai_resolved,
        'human_resolved': human_resolved,
        'cx_pct_of_revenue': cx_pct_of_revenue,
        'annual_revenue': annual_revenue,
        # Phases
        'phases': phases,
        'phase_fte_counts': phase_fte_counts,
        # Y1/Y2+
        'year1_total_cost': year1_total_cost,
        'year1_blended_price': year1_blended_price,
        'year1_savings': year1_savings,
        'year1_savings_pct': year1_savings_pct,
        'year2_total_cost': year2_total_cost,
        'year2_price': year2_price,
        'year2_savings': year2_savings,
        'year2_savings_pct': year2_savings_pct,
        # Retention
        'retained_revenue': retained_revenue,
        'retention_lift_pct': retention_lift_pct,
        # Lighthouse
        'lh_volume_share': lh_volume_share,
        'lh_volume': lh_volume,
        'lh_target_containment': lh_target_containment,
        'lh_savings_low': lh_savings_low,
        'lh_savings_high': lh_savings_high,
        'lh_retained_revenue': lh_retained_revenue,
    }


# ── Number formatting helpers ──────────────────────────────────

def fmt_money_m(n):
    """Format a number as $X.XM or ~$XM. Used for headline figures."""
    if n is None:
        return '—'
    if abs(n) >= 1e6:
        m = n / 1e6
        if m >= 100:
            return f'${m:.0f}M'
        return f'${m:.1f}M'
    if abs(n) >= 1e3:
        return f'${n/1e3:.0f}K'
    return f'${n:.0f}'


def fmt_money_full(n):
    """Format with commas, no decimals. e.g. $21,605,600"""
    if n is None:
        return '—'
    return f'${n:,.0f}'


def fmt_pct(p, decimals=1):
    if p is None:
        return '—'
    return f'{p * 100:.{decimals}f}%'


def fmt_volume(v):
    """Format a volume count. <1M shows as 'XK', >=1M as 'X.XXM'."""
    if v is None:
        return '—'
    if v >= 1e6:
        return f'{v/1e6:.2f}M'
    if v >= 1e3:
        return f'{v/1e3:.0f}K'
    return f'{v:,.0f}'


def fmt_price(p):
    """Format a per-outcome price like $3.00."""
    if p is None:
        return '—'
    return f'${p:.2f}'


if __name__ == '__main__':
    # Quick sanity check using Fabletics numbers — should match v4 brief
    test = {
        'current_state': {
            'volumes': {'voice': 1_820_000, 'chat': 2_410_000, 'social': 444_000},
            'fte_count': 900,
            'fte_hourly_rate': 10,
            'ai_containment_rate': 0.225,
            'annual_revenue': 1_000_000_000,
        }
    }
    r = compute_roi(test)
    print(f'Total CX:       {fmt_money_full(r["total_cx_spend"])}')
    print(f'AI vendor:      {fmt_money_full(r["ai_spend"])}  (estimated: {r["ai_spend_is_estimated"]})')
    print(f'BPO:            {fmt_money_full(r["bpo_spend"])}')
    print(f'Blended cost:   ${r["blended_cost"]:.4f}')
    print(f'Y1 savings:     {fmt_money_full(r["year1_savings"])} ({fmt_pct(r["year1_savings_pct"])})')
    print(f'Y2+ savings:    {fmt_money_full(r["year2_savings"])} ({fmt_pct(r["year2_savings_pct"])})')
    print(f'CX %/revenue:   {fmt_pct(r["cx_pct_of_revenue"])}')
    print(f'LH volume:      {fmt_volume(r["lh_volume"])}')
    print(f'LH savings:     {fmt_money_full(r["lh_savings_low"])} – {fmt_money_full(r["lh_savings_high"])}')
