from pptx.util import Emu
from pptx.enum.shapes import MSO_SHAPE
from .. import blocks

LEFT = 342909

def render(slide, content, theme):
    blocks.text_box(slide, left=LEFT, top=330000, width=11500000, height=430000, text=content["title"],
                    size=theme.size_title, color=theme.color("ink"), bold=True, font=theme.font_head)
    ms = content["milestones"]
    n = max(1, len(ms))
    x0 = 900000
    x1 = 11300000
    y = 3300000
    span = (x1 - x0) // max(1, n - 1) if n > 1 else 0
    blocks.filled_rect(slide, x0, y + 40000, x1 - x0, 26000, theme.border)
    for i, m in enumerate(ms):
        cx = x0 + i * span
        d = slide.shapes.add_shape(MSO_SHAPE.DIAMOND, Emu(cx - 70000), Emu(y - 40000), Emu(180000), Emu(180000))
        d.line.color.rgb = theme.color("indigo")
        d.shadow.inherit = False
        if m.get("done"):
            d.fill.solid()
            d.fill.fore_color.rgb = theme.color("indigo")
        else:
            d.fill.solid()
            d.fill.fore_color.rgb = theme.color("band_text")
        blocks.text_box(slide, left=cx - 800000, top=y - 520000, width=1600000, height=300000, text=m["date"],
                        size=theme.size_subtext, color=theme.color("muted"), bold=True, align="center", font=theme.font_head)
        blocks.text_box(slide, left=cx - 900000, top=y + 220000, width=1800000, height=500000, text=m["label"],
                        size=theme.size_subtext, color=theme.color("ink"), align="center", font=theme.font_body)
