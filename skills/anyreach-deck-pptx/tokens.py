"""
Anyreach Deck (PPTX) — Design Tokens.

Single source of truth for the editorial design system, native-PPTX edition.
Same colors, same proportions, same type scale as the PDF version
(anyreach-deck) — but expressed in PowerPoint units (Pt, EMU).

WHY THE EXACT SAME PROPORTIONS?
The PDF version was authored at 1400 x 900 px. To preserve those
proportions exactly, we use a custom slide size of 14.583" x 9.375"
(= 1050pt x 675pt). That gives a clean 1px → 0.75pt → 9525 EMU mapping.
You can think and code in the original "px" coordinate space and the
converters will handle the EMU translation.

USE: from lib.tokens import C, FONT_DISPLAY, FONT_BODY, FONT_MONO, TYPE
"""

from pptx.util import Emu, Pt
from pptx.dml.color import RGBColor


# ============================================================
# COLORS — identical to PDF version
# ============================================================
# Editorial palette: cream + ink alternation, indigo + lime as primary
# accents, amber/rose/crimson as secondary accents.
# Hex values are stored WITHOUT the leading '#' so they can be passed
# directly to RGBColor.from_string().
C = {
    # Ink (dark) family
    'ink':         '0B0B1C',  # near-black with cool blue undertone
    'inkSoft':     '161630',  # for raised cards on dark backgrounds
    'inkLine':     '262642',  # hairline dividers on dark
    'mutedOnInk':  '9A95B0',  # secondary text on dark

    # Cream (light) family
    'cream':       'F1ECDF',  # primary light background
    'creamSoft':   'E8E2D2',  # raised cards / callouts on cream
    'creamLine':   'D8D2C0',  # hairline dividers on cream
    'mutedOnCream':'6E6A5C',  # secondary text on cream

    # Brand accents
    'indigo':      '5B5FC7',  # primary brand color
    'indigoLight': '8B8FE0',
    'indigoDeep':  '3D40A0',

    # Spotlight + secondary accents
    'lime':        'DCFA45',  # RESERVED for the single focal moment
    'amber':       'E8B048',
    'crimson':     'B84A56',
    'rose':        'D86878',
}


def rgb(token: str) -> RGBColor:
    """Convert a token name (or raw 6-hex string) to RGBColor.

        rgb('lime')      -> RGBColor(0xDC, 0xFA, 0x45)
        rgb('5B5FC7')    -> RGBColor(0x5B, 0x5F, 0xC7)
    """
    hex_str = C.get(token, token)
    return RGBColor.from_string(hex_str)


# ============================================================
# FONT STACKS
# ============================================================
# python-pptx accepts a single font face name (no fallback stacks).
# We pick the primary face; if the recipient's machine doesn't have it,
# PowerPoint will substitute. Recipients with Fraunces / DM Sans /
# JetBrains Mono installed will see the editorial design as intended.
FONT_DISPLAY = 'Fraunces'      # serif headlines; falls back to Times if absent
FONT_BODY    = 'DM Sans'       # body copy; falls back to system sans if absent
FONT_MONO    = 'JetBrains Mono'  # numerics; falls back to Consolas/Courier if absent


# ============================================================
# TYPE SCALE — same proportions as PDF version
# ============================================================
# Sizes are in POINTS (PowerPoint native unit). Equivalent to the PDF
# version's pixel sizes multiplied by 0.75 (the 72/96 dpi ratio).
# Where the conversion produced a fractional value, we kept the .5
# rather than rounding so the on-screen scale matches the PDF exactly.
TYPE = {
    # Sizes are tuned for PowerPoint viewed at fit-to-window on a typical
    # laptop. PowerPoint shrinks the slide ~75-80% relative to a 1:1
    # PDF view, so we bump everything ~25-30% over the equivalent PDF
    # sizes. The proportions between sizes are preserved.
    'hero':         135,  # the single biggest moment per deck
    'section_xl':    60,
    'section_lg':    54,  # default section headline
    'section_md':    48,
    'section_sm':    42,
    'card_title':    22,
    'metric_xl':     60,
    'metric_lg':     48,  # hero metric tile values
    'metric_md':     36,  # rollup metric tile values
    'metric_sm':     28,
    'body_lg':       17,  # hero subhead
    'body':        13.5,  # default body
    'body_sm':       12,
    'body_xs':       11,
    'caption':     10.5,
    'micro':        9.5,  # uppercase tracked labels
    'micro_xs':     8.5,
}


# ============================================================
# SPACING RHYTHM (in original "px" units; converted to EMU on draw)
# ============================================================
SPACE = {
    'page_pad_x':   80,   # horizontal page padding
    'page_pad_y':   64,   # vertical page padding
    'section_gap':  36,   # below section header before first content block
    'card_pad':     24,   # card interior padding
    'card_pad_lg':  32,
    'tile_gap':      2,   # gap between tiles (creates hairline divider effect)
    'block_gap':    16,
    'block_gap_lg': 24,
}


# ============================================================
# PAGE / SLIDE GEOMETRY
# ============================================================
# We work in a "px" coordinate space for parity with the PDF version,
# then convert to EMU on draw. 1 px = 0.75 pt = 9525 EMU.
#
# Default slide is 1400 x 900 "px" (= 1050pt x 675pt = 14.583" x 9.375").
# This is a 14:9 landscape ratio — the same as the PDF version. It is
# slightly taller than 16:9 widescreen but matches the original design
# proportions exactly.
PAGE_W = 1400   # px
PAGE_H = 900    # px

PX_TO_PT  = 0.75            # 72/96
PX_TO_EMU = 9525            # = 914400 EMU/inch * 0.75pt/px / 72pt/inch


def px_to_emu(px: float) -> int:
    """Convert a pixel value (from the original design system) to EMU
    for python-pptx positioning. 1 px = 9525 EMU."""
    return int(round(px * PX_TO_EMU))


def px_to_pt(px: float) -> float:
    """Convert a pixel value to points. Used for sizes that aren't fonts
    (most font sizes are pre-converted in TYPE)."""
    return px * PX_TO_PT


def slide_width_emu() -> int:
    return px_to_emu(PAGE_W)


def slide_height_emu() -> int:
    return px_to_emu(PAGE_H)


# ============================================================
# LABEL STYLE HELPER
# ============================================================
# The omnipresent uppercase tracked-out label style. ALWAYS use this for
# section labels, card eyebrow labels, mini headers — never invent a new
# label style.

# letter spacing in PowerPoint is awkward (it's expressed via XML
# spc attribute in 1/100 of a point). 0.22em at 9.5pt font ≈ 2.1pt
# = 210 in spc units.
LABEL_SPACING_HUNDREDTHS = 210   # ≈ 0.22em at 9.5pt — feeds into XML directly
LABEL_FONT_SIZE_PT = TYPE['micro']
LABEL_FONT_WEIGHT = 'bold'         # 500 in HTML maps to 'bold' in PPTX (no 500 weight)


def label_color(on_cream: bool = True) -> str:
    """Token name for label color in either context."""
    return 'mutedOnCream' if on_cream else 'mutedOnInk'
