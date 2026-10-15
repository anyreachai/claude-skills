from .. import blocks

LEFT = 342909
RIGHT = 11849400  # left margin to right content edge

def render(slide, content, theme):
    cols = content["columns"]
    rows = content["rows"]
    zebra = content.get("zebra", True)
    blocker = set(content.get("blocker_rows", []))

    # Draw title inline
    blocks.text_box(slide, left=LEFT, top=330000, width=11500000, height=430000, text=content["title"],
                    size=theme.size_title, color=theme.color("ink"), bold=True, font=theme.font_head)

    top = 980000
    band_h = 300000
    row_h = 300000
    total_w = RIGHT - LEFT
    cw = total_w // len(cols)

    # Draw header band
    blocks.header_band(slide, theme, top=top, height=band_h)

    # Draw column labels
    for j, c in enumerate(cols):
        blocks.band_label(slide, theme, c.upper(), LEFT + j * cw, top + 55000, cw - 40000, band_h - 90000)

    # Draw rows
    y = top + band_h + 20000
    for i, row in enumerate(rows):
        if i in blocker:
            blocks.filled_rect(slide, 325650, y - 10000, 11540700, row_h, theme.blocker)
        elif zebra and i % 2 == 1:
            blocks.filled_rect(slide, 325650, y - 10000, 11540700, row_h, theme.zebra)

        for j, val in enumerate(row):
            col = theme.color("body")
            blocks.text_box(slide, left=LEFT + j * cw, top=y, width=cw - 40000, height=row_h - 30000, text=str(val),
                            size=theme.size_body, color=col, font=theme.font_body)
        y += row_h + 10000
