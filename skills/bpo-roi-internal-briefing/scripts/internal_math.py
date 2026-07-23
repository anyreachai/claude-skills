"""
ROI math extensions for the internal briefing.

The internal briefing reuses everything from the brief config schema and adds
one critical internal-only computation: the actual blended margin profile
(FTE labor cost + AI platform cost) per phase, vs. what the customer pays.

This is the "honest" margin math — Phase 1 typically lands in the single
digits because we're absorbing full FTE delivery cost on residual volume
while charging a discounted per-outcome price. Margins improve as containment
ramps. This is internal data only — never share with the end client.
"""

import sys
from pathlib import Path

# Import the shared math layer from the bpo-roi-brief skill
# The brief skill is the source of truth for current-state, phases, etc.
HERE = Path(__file__).resolve().parent
BRIEF_SCRIPTS = HERE.parent.parent / 'bpo-roi-brief' / 'scripts'
if BRIEF_SCRIPTS.exists():
    sys.path.insert(0, str(BRIEF_SCRIPTS))
import roi_math as rm  # noqa: E402


# Default platform cost estimates per phase (in dollars).
# These are rough Anyreach platform costs — the reality is workload-dependent
# but for back-of-envelope margin planning these defaults are close enough.
# Override per-phase via config.pricing_phases[*].platform_cost_estimate.
DEFAULT_PLATFORM_COSTS = {
    'Phase 1': 1_500_000,
    'Phase 2': 1_000_000,
    'Phase 3': 700_000,
}


def compute_margin_profile(config, brief_results):
    """
    Compute the per-phase blended cost and gross margin.

    Returns a list of dicts (one per phase) with the labor cost, platform cost,
    total cost, customer-paid annualized cost, and gross margin in $ and %.
    """
    fte_count_base = brief_results['fte_count']

    margins = []
    for i, ph in enumerate(brief_results['phases']):
        # FTE count for this phase (from the share applied to the base count)
        fte_share = config.get('pricing_phases', [{}] * 3)[i].get('fte_share') if i < len(config.get('pricing_phases', [])) else None
        if fte_share is None:
            fte_share = brief_results['phase_fte_counts'][i] / fte_count_base
        ftes = brief_results['phase_fte_counts'][i]
        labor_cost = ftes * ph['fte_rate'] * rm.ANNUAL_HOURS_PER_FTE
        platform_cost = (
            config.get('pricing_phases', [{}] * 3)[i].get('platform_cost_estimate')
            if i < len(config.get('pricing_phases', []))
            else None
        )
        if platform_cost is None:
            platform_cost = DEFAULT_PLATFORM_COSTS.get(ph['name'], 1_000_000)

        total_cost = labor_cost + platform_cost
        customer_cost = ph['annualized_cost']
        gross_margin = customer_cost - total_cost
        margin_pct = gross_margin / customer_cost if customer_cost else 0

        margins.append({
            'phase_name': ph['name'],
            'price_per_outcome': ph['price_per_outcome'],
            'containment': ph['containment'],
            'ftes': ftes,
            'fte_rate': ph['fte_rate'],
            'labor_cost': labor_cost,
            'platform_cost': platform_cost,
            'total_cost': total_cost,
            'customer_cost': customer_cost,
            'gross_margin': gross_margin,
            'margin_pct': margin_pct,
        })

    return margins


def compute_internal_extras(config):
    """
    Run the brief math + the margin overlay. Returns one combined results dict.
    """
    brief = rm.compute_roi(config)
    margins = compute_margin_profile(config, brief)
    return {**brief, 'margins': margins}
