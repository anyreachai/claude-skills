from pptx.util import Emu
from pptx.enum.shapes import MSO_SHAPE

from .. import blocks
from ..geometry import TITLE_TOP

LEFT = 342909
RIGHT = 11849400
GRID_X = 2100000
GRID_R = 11849400

CHART_TOP = 1150000
PHASES_BOT = 5100000
GATE_Y = 5230000
AXIS_Y = 5560000
CAPTION_Y = 5820000
LEGEND_Y = 6320000

_BAND_PAD = 30000
_SUB_GAP = 22000
_GANTT_BAR_H = 300000
_DEFAULT_LEGEND = "Solid bars are development, pale bars are testing, green bars are live"


def _bar(slide, theme, left, top, width, height, kind, label):
    if kind == "test":
        sp = blocks.filled_rect(slide, int(left), int(top), int(width), int(height), theme.zebra)
        sp.line.color.rgb = theme.color("indigo")
        sp.line.width = Emu(9525)
        text_color = theme.color("ink")
    else:
        fill = theme.rag_green if kind == "live" else theme.indigo
        blocks.filled_rect(slide, int(left), int(top), int(width), int(height), fill)
        text_color = theme.color("band_text")
    if label:
        blocks.text_box(slide, left=int(left + 40000), top=int(top),
                        width=int(max(60000, width - 80000)), height=int(height), text=label,
                        size=theme.size_subtext, color=text_color, bold=True, valign="middle",
                        font=theme.font_head)


def render(slide, content, theme):
    if content.get("eyebrow"):
        blocks.text_box(slide, left=LEFT, top=150000, width=11500000, height=170000,
                        text=content["eyebrow"].upper(), size=theme.size_label,
                        color=theme.color("purple"), bold=True, font=theme.font_head)
    blocks.text_box(slide, left=LEFT, top=TITLE_TOP, width=11500000, height=430000, text=content["title"],
                    size=theme.size_title, color=theme.color("ink"), bold=True, font=theme.font_head)

    labels = content["week_axis"]["labels"]
    n = max(1, len(labels))
    per = (GRID_R - GRID_X) // n

    # week gridlines and axis labels
    for i, lab in enumerate(labels):
        x = GRID_X + i * per
        blocks.filled_rect(slide, x, CHART_TOP, 5400, PHASES_BOT - CHART_TOP, theme.border)
        blocks.text_box(slide, left=x, top=AXIS_Y, width=per, height=240000, text=lab,
                        size=theme.size_label, color=theme.color("muted"), align="center", font=theme.font_body)
    blocks.text_box(slide, left=GRID_X, top=CAPTION_Y, width=GRID_R - GRID_X, height=200000,
                    text="week commencing", size=theme.size_subtext, color=theme.color("muted"),
                    align="center", font=theme.font_body)

    # phase bands
    phases = content["phases"]
    n_ph = max(1, len(phases))
    band_h = (PHASES_BOT - CHART_TOP) // n_ph
    for pi, ph in enumerate(phases):
        py = CHART_TOP + pi * band_h
        if pi % 2 == 0:
            blocks.filled_rect(slide, LEFT, py, RIGHT - LEFT, band_h, theme.zebra)
        blocks.text_box(slide, left=LEFT, top=py + band_h // 2 - 300000, width=GRID_X - LEFT - 40000,
                        height=300000, text=ph["name"], size=theme.size_body, color=theme.color("ink"),
                        bold=True, valign="bottom", font=theme.font_head)
        if ph.get("note"):
            blocks.text_box(slide, left=LEFT, top=py + band_h // 2 + 10000, width=GRID_X - LEFT - 40000,
                            height=300000, text=ph["note"], size=theme.size_subtext,
                            color=theme.color("muted"), font=theme.font_body)
        bars = ph.get("bars", [])
        n_bars = max(1, len(bars))
        usable = band_h - 2 * _BAND_PAD
        sub_h = usable // n_bars
        bar_h = min(_GANTT_BAR_H, sub_h - _SUB_GAP)
        for bi, b in enumerate(bars):
            bx = GRID_X + b["start_week"] * per
            bw = b["span"] * per - 40000
            by = py + _BAND_PAD + bi * sub_h
            _bar(slide, theme, bx, by, bw, bar_h, b["kind"], b.get("label", ""))

    # gates
    prev_end = -1
    prev_line = 1
    for g in sorted(content.get("gates", []), key=lambda x: x["week"]):
        gx = GRID_X + g["week"] * per
        d = slide.shapes.add_shape(MSO_SHAPE.DIAMOND, Emu(gx - 55000), Emu(GATE_Y), Emu(120000), Emu(120000))
        d.fill.solid()
        d.fill.fore_color.rgb = theme.color("ink")
        d.line.fill.background()
        d.shadow.inherit = False
        label_left = gx + 90000
        line = 0 if label_left > prev_end else 1 - prev_line
        lab_top = GATE_Y - 10000 + line * 210000
        est_w = 2000000
        blocks.text_box(slide, left=label_left, top=lab_top, width=est_w, height=200000,
                        text=g["label"], size=theme.size_label, color=theme.color("ink"),
                        bold=True, font=theme.font_head)
        prev_end = label_left + len(g["label"]) * 78000
        prev_line = line

    # here marker
    if content.get("here_week") is not None:
        hx = GRID_X + content["here_week"] * per
        blocks.filled_rect(slide, hx - 4800, CHART_TOP - 130000, 9600, PHASES_BOT - CHART_TOP + 130000, theme.rag_red)
        blocks.text_box(slide, left=hx - 700000, top=CHART_TOP - 360000, width=1400000, height=240000,
                        text="we are here", size=theme.size_label, color=theme.rag("red"),
                        bold=True, align="center", font=theme.font_head)

    # legend
    legend = content.get("legend", _DEFAULT_LEGEND)
    blocks.text_box(slide, left=LEFT, top=LEGEND_Y, width=RIGHT - LEFT, height=220000, text=legend,
                    size=theme.size_subtext, color=theme.color("muted"), font=theme.font_body)
