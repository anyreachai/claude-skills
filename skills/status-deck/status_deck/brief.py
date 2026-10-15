KNOWN_TYPES = {
    "exec_summary",
    "gantt",
    "milestone_path",
    "progress_bars",
    "bar",
    "pie",
    "progress_pie",
    "kpi_tiles",
    "heatmap",
    "decisions",
    "table",
}
_RAG = {"red", "amber", "green"}


class BriefError(ValueError):
    pass


def load_brief(src):
    if isinstance(src, dict):
        return src
    import yaml

    with open(src) as f:
        return yaml.safe_load(f)


def validate_brief(b):
    if not isinstance(b, dict):
        raise BriefError("brief must be a mapping")
    m = b.get("meta") or {}
    if not m.get("title"):
        raise BriefError("meta.title is required")
    if m.get("status") and m["status"] not in _RAG:
        raise BriefError(f"meta.status must be one of {_RAG}")
    es = b.get("executive_summary")
    if not isinstance(es, dict) or not es.get("headline"):
        raise BriefError("executive_summary.headline is required")
    for key in ("slides", "appendix"):
        for i, s in enumerate(b.get(key) or []):
            t = s.get("type")
            if t not in KNOWN_TYPES:
                raise BriefError(
                    f"{key}[{i}].type '{t}' unknown; known: {sorted(KNOWN_TYPES)}"
                )
            if not s.get("title"):
                raise BriefError(f"{key}[{i}] missing title")
