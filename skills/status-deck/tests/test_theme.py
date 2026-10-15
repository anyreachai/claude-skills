from status_deck.theme import Theme, hex_to_rgb
from pptx.dml.color import RGBColor

def test_defaults_and_override():
    t = Theme.anyreach()
    assert t.ink == "1F2547"
    assert t.font_body == "Arial"
    assert t.size_title == 24
    assert t.color("rag_green") == RGBColor(0x2E, 0x7D, 0x32)
    t2 = Theme.anyreach(footer="Acme x Anyreach", status="red")
    assert t2.footer == "Acme x Anyreach"
    assert t2.ink == "1F2547"  # unchanged

def test_hex_helper():
    assert hex_to_rgb("FFFFFF") == RGBColor(0xFF, 0xFF, 0xFF)

def test_size_display_token():
    t = Theme.anyreach()
    assert t.size_display == 32

def test_series_color_is_single_source():
    t = Theme.anyreach()
    # ordered data palette: indigo, purple, gold, muted, then it wraps
    assert t.data_palette == ("indigo", "purple", "gold", "muted")
    assert t.series_color(0) == t.color("indigo")
    assert t.series_color(1) == t.color("purple")
    assert t.series_color(2) == t.color("gold")
    assert t.series_color(3) == t.color("muted")
    # same index is the same colour every time (wraps by modulo)
    assert t.series_color(4) == t.series_color(0)
