from .. import blocks
from ..geometry import pct_to_emu, BAR_H, CONTENT_TOP, CONTENT_RIGHT, TITLE_TOP

LEFT = 342909

def _bar(slide, theme, x, y, full, pct, fill):
    blocks.filled_rect(slide, x, y, full, BAR_H, theme.zebra)
    blocks.filled_rect(slide, x, y, pct_to_emu(pct, full), BAR_H, fill)

RIGHT_MARGIN = CONTENT_RIGHT

def render(slide, content, theme):
    blocks.text_box(slide, left=LEFT, top=TITLE_TOP, width=11500000, height=430000, text=content["title"],
                    size=theme.size_title, color=theme.color("ink"), bold=True, font=theme.font_head)
    label_w = 2000000
    bar_full = 2500000
    pct_w = 600000
    pct_pad = 40000
    mid_gap = 300000
    note_pad = 300000
    y = CONTENT_TOP
    bx = LEFT + label_w
    tx = bx + bar_full + pct_pad + pct_w + mid_gap
    note_x = tx + bar_full + pct_pad + pct_w + note_pad
    note_w = RIGHT_MARGIN - note_x
    for it in content["items"]:
        blocks.text_box(slide, left=LEFT, top=y, width=label_w - 60000, height=320000, text=it["label"],
                        size=theme.size_body, color=theme.color("ink"), bold=True, font=theme.font_head)
        _bar(slide, theme, bx, y + 30000, bar_full, it["build"], theme.series_color(0))
        blocks.text_box(slide, left=bx + bar_full + pct_pad, top=y, width=pct_w, height=300000, text=f"{it['build']}%",
                        size=theme.size_body, color=theme.color("ink"), bold=True, font=theme.font_head)
        _bar(slide, theme, tx, y + 30000, bar_full, it["tested"], theme.series_color(1))
        blocks.text_box(slide, left=tx + bar_full + pct_pad, top=y, width=pct_w, height=300000, text=f"{it['tested']}%",
                        size=theme.size_body, color=theme.color("ink"), bold=True, font=theme.font_head)
        if it.get("note"):
            blocks.text_box(slide, left=note_x, top=y, width=note_w, height=320000, text=it["note"],
                            size=theme.size_subtext, color=theme.color("muted"), font=theme.font_body)
        y += 430000
