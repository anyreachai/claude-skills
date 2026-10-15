from .. import blocks

LEFT = 342909

def render(slide, content, theme):
    blocks.text_box(slide, left=LEFT, top=330000, width=11500000, height=430000, text=content["title"],
                    size=theme.size_title, color=theme.color("ink"), bold=True, font=theme.font_head)
    rows = content["row_labels"]
    cols = content["col_labels"]
    cells = content["cells"]
    label_w = 2600000
    cell_w = min(1500000, (11540700 - label_w) // max(1, len(cols)))
    cell_h = 430000
    x0 = 325650 + label_w
    y0 = 1100000
    for j, c in enumerate(cols):
        blocks.text_box(slide, left=x0 + j * cell_w, top=y0 - 360000, width=cell_w - 30000, height=320000, text=c,
                        size=theme.size_subtext, color=theme.color("muted"), bold=True, align="center", font=theme.font_head)
    for i, rl in enumerate(rows):
        y = y0 + i * (cell_h + 20000)
        blocks.text_box(slide, left=325650, top=y, width=label_w - 60000, height=cell_h, text=rl,
                        size=theme.size_body, color=theme.color("ink"), bold=True, valign="middle", font=theme.font_head)
        for j, st in enumerate(cells[i]):
            if not st:
                continue
            blocks.filled_rect(slide, x0 + j * cell_w, y, cell_w - 30000, cell_h,
                             {"red": theme.rag_red, "amber": theme.rag_amber, "green": theme.rag_green}[st])
