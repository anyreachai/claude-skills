from pptx.util import Emu
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION
from .. import blocks
from ..geometry import CONTENT_TOP, TITLE_TOP

LEFT = 342909

def render(slide, content, theme):
    blocks.text_box(slide, left=LEFT, top=TITLE_TOP, width=11500000, height=430000, text=content["title"],
                    size=theme.size_title, color=theme.color("ink"), bold=True, font=theme.font_head)
    data = CategoryChartData()
    data.categories = content["categories"]
    for ser in content["series"]:
        data.add_series(ser["name"], ser["values"])
    ctype = {"stacked": XL_CHART_TYPE.COLUMN_STACKED}.get(content.get("mode"), XL_CHART_TYPE.COLUMN_CLUSTERED)
    gf = slide.shapes.add_chart(ctype, Emu(LEFT), Emu(CONTENT_TOP), Emu(7800000), Emu(3700000), data)
    ch = gf.chart
    ch.has_legend = len(content["series"]) > 1
    if ch.has_legend:
        ch.legend.position = XL_LEGEND_POSITION.BOTTOM
        ch.legend.include_in_layout = False
    for i, plot_ser in enumerate(ch.series):
        plot_ser.format.fill.solid()
        plot_ser.format.fill.fore_color.rgb = theme.series_color(i)
