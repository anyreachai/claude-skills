from .deck import Deck
from .theme import Theme
from .brief import validate_brief
from .verify import lint_brief, has_blocking
from .slides import (exec_summary, gantt, milestone_path, progress_bars, bar, pie,
                     kpi_tiles, heatmap, decisions, table)

REGISTRY={"gantt":gantt.render,"milestone_path":milestone_path.render,"progress_bars":progress_bars.render,
          "bar":bar.render,"pie":pie.render,"progress_pie":pie.render_progress,"kpi_tiles":kpi_tiles.render,
          "heatmap":heatmap.render,"decisions":decisions.render,"table":table.render,"exec_summary":exec_summary.render}

def theme_from_meta(meta):
    return Theme.anyreach(org_parties=tuple(meta.get("parties",[])),
                          footer=meta.get("footer",""), date=meta.get("date",""),
                          status=meta.get("status","green"), confidential=meta.get("confidential",True))

def build_deck(brief, out_path, strict=True):
    validate_brief(brief)
    issues=lint_brief(brief)
    if strict and has_blocking(issues):
        raise ValueError("blocking copy issues: "+"; ".join(f"{i.where}: {i.reason}" for i in issues if i.level=="block"))
    deck=Deck(theme_from_meta(brief.get("meta",{})))
    es=deck.add_slide(); exec_summary.render(es, brief["executive_summary"], deck.theme); deck.footer(es)
    for s in brief.get("slides",[]):
        sl=deck.add_slide(); REGISTRY[s["type"]](sl, s, deck.theme); deck.footer(sl)
    if brief.get("appendix"):
        divider=deck.appendix_divider(); deck.footer(divider)
        for s in brief["appendix"]:
            sl=deck.add_slide(); REGISTRY[s["type"]](sl, s, deck.theme); deck.footer(sl)
    return deck.save(out_path)
