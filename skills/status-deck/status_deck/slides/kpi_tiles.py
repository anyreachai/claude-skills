from .. import blocks
from ..geometry import TITLE_TOP

LEFT = 342909

def render(slide, content, theme):
    blocks.text_box(slide, left=LEFT, top=TITLE_TOP, width=11500000, height=430000, text=content["title"],
                    size=theme.size_title, color=theme.color("ink"), bold=True, font=theme.font_head)
    tiles = content["tiles"]
    per_row = min(4, max(1, len(tiles)))
    gap = 200000
    total = 11540700
    tile_w = (total - gap * (per_row - 1)) // per_row
    tile_h = 1500000
    y = 1300000
    for i, t in enumerate(tiles):
        col = i % per_row
        row = i // per_row
        x = 325650 + col * (tile_w + gap)
        ty = y + row * (tile_h + gap)
        blocks.filled_rect(slide, x, ty, tile_w, tile_h, theme.zebra)
        blocks.text_box(slide, left=x + 120000, top=ty + 150000, width=tile_w - 240000, height=600000, text=str(t["value"]),
                        size=theme.size_display, color=theme.color("indigo"), bold=True, font=theme.font_head)
        blocks.text_box(slide, left=x + 120000, top=ty + 760000, width=tile_w - 240000, height=350000, text=t["label"],
                        size=theme.size_body, color=theme.color("ink"), bold=True, font=theme.font_head)
        if t.get("sub"):
            blocks.text_box(slide, left=x + 120000, top=ty + 1120000, width=tile_w - 240000, height=300000, text=t["sub"],
                            size=theme.size_subtext, color=theme.color("muted"), font=theme.font_body)
