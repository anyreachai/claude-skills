# PDF Template Reference — Competitor Deep Dive

This file contains the complete PDF generation code for competitor analysis reports. The template supports two formats: **Format A (Investigative Report)** and **Format B (Head-to-Head Comparison)**. Default to Format A.

---

## Complete Python Template — Format A (Investigative Report)

This is the primary format. It produces a long-form editorial-style report with inline citations, bold key findings, and section dividers.

```python
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Circle
from reportlab.platypus.flowables import Flowable

# ══════════════════════════════════════════════════
# COLORS — Anyreach brand system
# ══════════════════════════════════════════════════
DARK_BG       = HexColor("#161631")
CARD_BG       = HexColor("#252550")
INDIGO        = HexColor("#5B5FC7")
GREEN         = HexColor("#10B981")
CYAN          = HexColor("#06B6D4")
AMBER         = HexColor("#F59E0B")
PINK          = HexColor("#EC4899")
RED           = HexColor("#EF4444")
MUTED         = HexColor("#6B7280")
LIGHT_BG      = HexColor("#F5F6FA")
DARK_TEXT      = HexColor("#1F2937")
MID_TEXT       = HexColor("#374151")
LIGHT_BORDER   = HexColor("#E5E7EB")
SECTION_BG     = HexColor("#F0F1FF")
WHITE          = white

# ══════════════════════════════════════════════════
# STYLES
# ══════════════════════════════════════════════════
styles = getSampleStyleSheet()

# Cover page styles
cover_title = ParagraphStyle('CoverTitle', parent=styles['Title'],
    fontSize=32, leading=38, textColor=DARK_BG, fontName='Helvetica-Bold',
    spaceAfter=8, alignment=TA_LEFT)

cover_subtitle = ParagraphStyle('CoverSubtitle', parent=styles['Normal'],
    fontSize=14, leading=18, textColor=INDIGO, fontName='Helvetica-Bold',
    spaceAfter=4, alignment=TA_LEFT)

cover_meta = ParagraphStyle('CoverMeta', parent=styles['Normal'],
    fontSize=10, leading=14, textColor=MUTED, fontName='Helvetica',
    spaceAfter=20, alignment=TA_LEFT)

# Section headers
h1_style = ParagraphStyle('H1', parent=styles['Heading1'],
    fontSize=20, leading=24, textColor=DARK_BG, fontName='Helvetica-Bold',
    spaceBefore=24, spaceAfter=12)

h2_style = ParagraphStyle('H2', parent=styles['Heading2'],
    fontSize=15, leading=19, textColor=DARK_BG, fontName='Helvetica-Bold',
    spaceBefore=16, spaceAfter=8)

h3_style = ParagraphStyle('H3', parent=styles['Heading3'],
    fontSize=12, leading=16, textColor=INDIGO, fontName='Helvetica-Bold',
    spaceBefore=12, spaceAfter=6)

# Body text
body_style = ParagraphStyle('Body', parent=styles['Normal'],
    fontSize=10.5, leading=15, textColor=MID_TEXT, fontName='Helvetica',
    spaceAfter=8)

body_bold = ParagraphStyle('BodyBold', parent=body_style,
    fontName='Helvetica-Bold', textColor=DARK_TEXT)

# Bold intro paragraph (for section openers)
body_intro = ParagraphStyle('BodyIntro', parent=body_style,
    fontName='Helvetica-Bold', fontSize=11, leading=16, textColor=DARK_TEXT,
    spaceAfter=10)

# Blockquote style (for user quotes)
quote_style = ParagraphStyle('Quote', parent=styles['Normal'],
    fontSize=10, leading=14, textColor=MID_TEXT, fontName='Helvetica-Oblique',
    leftIndent=20, rightIndent=20, spaceBefore=6, spaceAfter=6,
    borderPadding=8)

# Source citation style
cite_style = ParagraphStyle('Cite', parent=styles['Normal'],
    fontSize=8, leading=10, textColor=MUTED, fontName='Helvetica',
    spaceAfter=4)

# Label (section category tags like "REVIEW ANALYSIS")
label_style = ParagraphStyle('Label', parent=styles['Normal'],
    fontSize=9, leading=11, textColor=INDIGO, fontName='Helvetica-Bold',
    spaceAfter=2, tracking=80)

# Footer
footer_style = ParagraphStyle('Footer', parent=styles['Normal'],
    fontSize=7, leading=9, textColor=MUTED, fontName='Helvetica', alignment=TA_CENTER)

# Verdict / key finding callout
verdict_style = ParagraphStyle('Verdict', parent=styles['Normal'],
    fontSize=12, leading=17, textColor=DARK_BG, fontName='Helvetica-Bold',
    spaceBefore=12, spaceAfter=12, leftIndent=16,
    borderPadding=(10, 10, 10, 10))

# ══════════════════════════════════════════════════
# CELL STYLES — for all table content
# ══════════════════════════════════════════════════
# CRITICAL: ALL table cells MUST use Paragraph objects, never plain strings.

cell_style = ParagraphStyle('CellStyle', parent=styles['Normal'],
    fontSize=8, leading=11, textColor=MID_TEXT, fontName='Helvetica',
    spaceAfter=0, spaceBefore=0)

cell_bold = ParagraphStyle('CellBold', parent=cell_style,
    fontName='Helvetica-Bold', textColor=DARK_TEXT)

cell_header = ParagraphStyle('CellHeader', parent=cell_style,
    fontName='Helvetica-Bold', textColor=white, fontSize=8)

cell_green = ParagraphStyle('CellGreen', parent=cell_style,
    fontName='Helvetica-Bold', textColor=GREEN)

cell_red = ParagraphStyle('CellRed', parent=cell_style,
    fontName='Helvetica-Bold', textColor=RED)

cell_amber = ParagraphStyle('CellAmber', parent=cell_style,
    fontName='Helvetica-Bold', textColor=AMBER)

cell_indigo = ParagraphStyle('CellIndigo', parent=cell_style,
    fontName='Helvetica-Bold', textColor=INDIGO)

cell_pink = ParagraphStyle('CellPink', parent=cell_style,
    fontName='Helvetica-Bold', textColor=PINK)

# Shorthand
P = Paragraph


# ══════════════════════════════════════════════════
# CUSTOM FLOWABLES
# ══════════════════════════════════════════════════

class ColorBar(Flowable):
    """Thin colored horizontal bar for section dividers."""
    def __init__(self, color=INDIGO, width=480, height=3):
        super().__init__()
        self.color = color
        self.bar_width = width
        self.bar_height = height
        self.width = width
        self.height = height

    def draw(self):
        self.canv.setFillColor(self.color)
        self.canv.roundRect(0, 0, self.bar_width, self.bar_height, 1.5, fill=1, stroke=0)


class CoverBar(Flowable):
    """Wide accent bar for cover page — pink top bar matching Anyreach deck style."""
    def __init__(self, width=612, height=6, color=PINK):
        super().__init__()
        self.color = color
        self.bar_width = width
        self.bar_height = height
        self.width = width
        self.height = height

    def draw(self):
        self.canv.setFillColor(self.color)
        self.canv.rect(-72, 0, self.bar_width, self.bar_height, fill=1, stroke=0)


class KeyStatBox(Flowable):
    """Colored stat callout box — large number + label."""
    def __init__(self, stat_value, stat_label, color=INDIGO, width=140, height=60):
        super().__init__()
        self.stat_value = stat_value
        self.stat_label = stat_label
        self.color = color
        self.box_width = width
        self.box_height = height
        self.width = width
        self.height = height

    def draw(self):
        self.canv.setFillColor(HexColor("#F0F1FF"))
        self.canv.roundRect(0, 0, self.box_width, self.box_height, 6, fill=1, stroke=0)
        # Colored left border
        self.canv.setFillColor(self.color)
        self.canv.roundRect(0, 0, 4, self.box_height, 2, fill=1, stroke=0)
        # Stat value
        self.canv.setFillColor(self.color)
        self.canv.setFont("Helvetica-Bold", 22)
        self.canv.drawString(14, self.box_height - 30, self.stat_value)
        # Label
        self.canv.setFillColor(MUTED)
        self.canv.setFont("Helvetica", 8)
        self.canv.drawString(14, 10, self.stat_label)


class VerdictBar(Flowable):
    """Full-width colored verdict bar with text."""
    def __init__(self, text, color=INDIGO, text_color=white, width=480, height=40):
        super().__init__()
        self.text = text
        self.color = color
        self.text_color = text_color
        self.bar_width = width
        self.bar_height = height
        self.width = width
        self.height = height

    def draw(self):
        self.canv.setFillColor(self.color)
        self.canv.roundRect(0, 0, self.bar_width, self.bar_height, 4, fill=1, stroke=0)
        self.canv.setFillColor(self.text_color)
        self.canv.setFont("Helvetica-Bold", 11)
        self.canv.drawCentredString(self.bar_width / 2, (self.bar_height - 11) / 2 + 2, self.text)


class ScoreRow(Flowable):
    """Single row showing a dimension score with colored bar."""
    def __init__(self, label, score, max_score=10, color=INDIGO, width=480, height=24):
        super().__init__()
        self.label = label
        self.score = score
        self.max_score = max_score
        self.color = color
        self.row_width = width
        self.row_height = height
        self.width = width
        self.height = height

    def draw(self):
        label_width = 160
        bar_start = label_width + 10
        bar_max_width = self.row_width - bar_start - 50
        bar_width = (self.score / self.max_score) * bar_max_width

        # Label
        self.canv.setFillColor(DARK_TEXT)
        self.canv.setFont("Helvetica", 9)
        self.canv.drawString(0, (self.row_height - 9) / 2, self.label)

        # Background track
        self.canv.setFillColor(LIGHT_BORDER)
        self.canv.roundRect(bar_start, (self.row_height - 12) / 2, bar_max_width, 12, 3, fill=1, stroke=0)

        # Filled bar
        if bar_width > 0:
            self.canv.setFillColor(self.color)
            self.canv.roundRect(bar_start, (self.row_height - 12) / 2, bar_width, 12, 3, fill=1, stroke=0)

        # Score text
        self.canv.setFillColor(self.color)
        self.canv.setFont("Helvetica-Bold", 10)
        self.canv.drawString(self.row_width - 35, (self.row_height - 10) / 2, f"{self.score}/10")


# ══════════════════════════════════════════════════
# FOOTER FUNCTION
# ══════════════════════════════════════════════════

def add_footer(canvas, doc):
    """Add branded footer to every page."""
    canvas.saveState()
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7)
    canvas.drawString(0.7 * inch, 0.4 * inch, "CONFIDENTIAL")
    canvas.drawRightString(7.8 * inch, 0.4 * inch, "anyreach.ai")
    canvas.drawCentredString(4.25 * inch, 0.4 * inch, f"Page {doc.page}")
    # Thin line above footer
    canvas.setStrokeColor(LIGHT_BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(0.7 * inch, 0.55 * inch, 7.8 * inch, 0.55 * inch)
    canvas.restoreState()


# ══════════════════════════════════════════════════
# HELPER FUNCTIONS
# ══════════════════════════════════════════════════

def section_divider():
    """Return a horizontal rule flowable."""
    return HRFlowable(width="100%", thickness=1, color=LIGHT_BORDER,
                      spaceBefore=16, spaceAfter=16)

def stat_row(stats_list, total_width=480):
    """
    Create a row of KeyStatBox flowables as a table.
    stats_list: list of (value, label, color) tuples
    """
    n = len(stats_list)
    box_width = (total_width - (n - 1) * 10) // n
    boxes = [KeyStatBox(v, l, c, width=box_width) for v, l, c in stats_list]
    col_widths = []
    for i in range(n):
        col_widths.append(box_width)
        if i < n - 1:
            col_widths.append(10)  # spacer

    row = []
    for i, box in enumerate(boxes):
        row.append(box)
        if i < n - 1:
            row.append("")  # spacer cell

    t = Table([row], colWidths=col_widths)
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    return t


def comparison_table(headers, rows, col_widths=None, total_width=480):
    """
    Build a styled comparison table.
    headers: list of header strings
    rows: list of lists — each inner list is a row of (text, style) tuples or plain strings
    col_widths: optional list of column widths (must sum to ~total_width)
    """
    if col_widths is None:
        col_widths = [total_width // len(headers)] * len(headers)

    # Build header row
    header_row = [P(h, cell_header) for h in headers]

    # Build data rows
    data_rows = []
    for row in rows:
        data_row = []
        for cell in row:
            if isinstance(cell, tuple):
                text, style = cell
                data_row.append(P(text, style))
            else:
                data_row.append(P(str(cell), cell_style))
        data_rows.append(data_row)

    table_data = [header_row] + data_rows
    t = Table(table_data, colWidths=col_widths)

    style_commands = [
        # Header
        ('BACKGROUND', (0, 0), (-1, 0), DARK_BG),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        # Alternating rows
        ('BACKGROUND', (0, 1), (-1, -1), white),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_BG]),
        # Grid
        ('GRID', (0, 0), (-1, -1), 0.5, LIGHT_BORDER),
        ('LINEBELOW', (0, 0), (-1, 0), 1.5, INDIGO),
        # Padding
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        # Alignment
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]

    t.setStyle(TableStyle(style_commands))
    return t


def winner_table(headers, rows, winner_col_idx=None, col_widths=None, total_width=480):
    """
    Build a comparison table with winner highlighting.
    winner_col_idx: which column index to highlight as winner (green)
    """
    if col_widths is None:
        col_widths = [total_width // len(headers)] * len(headers)

    header_row = [P(h, cell_header) for h in headers]

    data_rows = []
    for row in rows:
        data_row = []
        for i, cell in enumerate(row):
            if isinstance(cell, tuple):
                text, style = cell
                data_row.append(P(text, style))
            else:
                data_row.append(P(str(cell), cell_style))
        data_rows.append(data_row)

    table_data = [header_row] + data_rows
    t = Table(table_data, colWidths=col_widths)

    style_commands = [
        ('BACKGROUND', (0, 0), (-1, 0), DARK_BG),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_BG]),
        ('GRID', (0, 0), (-1, -1), 0.5, LIGHT_BORDER),
        ('LINEBELOW', (0, 0), (-1, 0), 1.5, INDIGO),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]

    # Highlight winner column
    if winner_col_idx is not None:
        style_commands.append(
            ('BACKGROUND', (winner_col_idx, 0), (winner_col_idx, 0), GREEN)
        )

    t.setStyle(TableStyle(style_commands))
    return t
```

---

## Document Structure — Format A (Investigative Report)

Use this structure as the skeleton. Adapt section headers and content based on research findings.

```python
def build_report(competitor_name, findings, output_path):
    """
    Build the complete competitive analysis PDF.

    competitor_name: str — name of the competitor
    findings: dict — structured research findings (see below)
    output_path: str — where to save the PDF
    """

    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        topMargin=0.7 * inch,
        bottomMargin=0.7 * inch,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch
    )

    story = []
    usable_width = letter[0] - 1.4 * inch  # ~480 points

    # ── COVER PAGE ──────────────────────────────
    story.append(CoverBar())
    story.append(Spacer(1, 40))
    story.append(P(f"{competitor_name} unfiltered:", cover_title))
    story.append(P("what users actually say behind the marketing", cover_subtitle))
    story.append(Spacer(1, 20))
    story.append(ColorBar(INDIGO, usable_width, 3))
    story.append(Spacer(1, 16))
    story.append(P(f"Independent competitive analysis | {findings.get('date', 'April 2026')}", cover_meta))
    story.append(P("CONFIDENTIAL | Prepared for Anyreach internal use & partner distribution", cover_meta))
    story.append(P(f"Sources: {findings.get('sources_summary', 'G2, Gartner, Glassdoor, Reddit, independent benchmarks, developer forums')}", cover_meta))
    story.append(Spacer(1, 30))

    # Key stats row
    key_stats = findings.get('key_stats', [])
    if key_stats:
        story.append(stat_row(key_stats, usable_width))
        story.append(Spacer(1, 20))

    # Executive summary paragraph
    if findings.get('executive_summary'):
        story.append(P(findings['executive_summary'], body_intro))
        story.append(Spacer(1, 8))

    story.append(PageBreak())

    # ── MAIN SECTIONS ──────────────────────────────
    # Each section follows this pattern:
    #   1. Section label (ALL CAPS, colored)
    #   2. Provocative header
    #   3. Bold intro paragraph
    #   4. Supporting evidence with inline citations
    #   5. Section divider

    for section in findings.get('sections', []):
        # Section label
        if section.get('label'):
            story.append(P(section['label'].upper(), label_style))

        # Section header
        story.append(P(section['title'], h1_style))
        story.append(ColorBar(section.get('color', INDIGO), usable_width, 2))
        story.append(Spacer(1, 8))

        # Content paragraphs
        for content in section.get('content', []):
            if content['type'] == 'intro':
                story.append(P(content['text'], body_intro))
            elif content['type'] == 'body':
                story.append(P(content['text'], body_style))
            elif content['type'] == 'quote':
                story.append(P(f'"{content["text"]}"', quote_style))
                if content.get('source'):
                    story.append(P(f"— {content['source']}", cite_style))
            elif content['type'] == 'subheading':
                story.append(P(content['text'], h2_style))
            elif content['type'] == 'table':
                story.append(Spacer(1, 8))
                story.append(comparison_table(
                    content['headers'],
                    content['rows'],
                    content.get('col_widths')
                ))
                story.append(Spacer(1, 8))
            elif content['type'] == 'verdict':
                story.append(Spacer(1, 8))
                story.append(VerdictBar(content['text'],
                    color=content.get('color', INDIGO)))
                story.append(Spacer(1, 8))
            elif content['type'] == 'score_bars':
                for score_item in content['scores']:
                    story.append(ScoreRow(
                        score_item['label'],
                        score_item['score'],
                        color=score_item.get('color', INDIGO)
                    ))
                story.append(Spacer(1, 8))
            elif content['type'] == 'stats':
                story.append(stat_row(content['stats'], usable_width))
                story.append(Spacer(1, 8))
            elif content['type'] == 'spacer':
                story.append(Spacer(1, content.get('height', 12)))

        # Section divider
        story.append(section_divider())

    # ── CONCLUSION ──────────────────────────────
    if findings.get('conclusion'):
        story.append(P("CONCLUSION", label_style))
        story.append(P(findings['conclusion']['title'], h1_style))
        story.append(ColorBar(PINK, usable_width, 2))
        story.append(Spacer(1, 12))
        for para in findings['conclusion'].get('paragraphs', []):
            story.append(P(para, body_style))
        if findings['conclusion'].get('verdict'):
            story.append(Spacer(1, 8))
            story.append(VerdictBar(findings['conclusion']['verdict'], color=DARK_BG))

    # ── SOURCES PAGE ──────────────────────────────
    story.append(PageBreak())
    story.append(P("SOURCES", label_style))
    story.append(P("Sources & References", h1_style))
    story.append(ColorBar(MUTED, usable_width, 2))
    story.append(Spacer(1, 12))
    for i, source in enumerate(findings.get('sources', []), 1):
        story.append(P(f"{i}. {source}", body_style))

    # ── BUILD ──────────────────────────────
    doc.build(story, onFirstPage=add_footer, onLaterPages=add_footer)
    print(f"Report saved to {output_path}")
```

---

## Usage Pattern

**IMPORTANT**: Do NOT use the `build_report` function as-is with a data structure. Instead, use the components (styles, flowables, helpers) to build the report **inline** as you write it. This gives you full control over the content and layout.

The recommended pattern is:

```python
# 1. Set up the document
doc = SimpleDocTemplate(output_path, pagesize=letter,
    topMargin=0.7*inch, bottomMargin=0.7*inch,
    leftMargin=0.7*inch, rightMargin=0.7*inch)
story = []
W = letter[0] - 1.4 * inch  # usable width ~480

# 2. Build cover page
story.append(CoverBar())
story.append(Spacer(1, 40))
story.append(P("Competitor Name unfiltered:", cover_title))
story.append(P("what users actually say behind the marketing", cover_subtitle))
# ... etc

# 3. Build each section inline with the actual research content
story.append(P("REVIEW ANALYSIS", label_style))
story.append(P("The suspicious cleanliness of [Competitor]'s review scores", h1_style))
story.append(ColorBar(INDIGO, W, 2))
story.append(Spacer(1, 8))
story.append(P("<b>[Competitor] earns top analyst rankings but faces a credibility gap</b> between its "
               "Gartner Leader status and the reality described by users, employees, and independent "
               "benchmarks.", body_style))
# ... continue with actual content from research

# 4. Build and save
doc.build(story, onFirstPage=add_footer, onLaterPages=add_footer)
```

---

## Critical Implementation Rules

1. **ALL table cells must be Paragraph objects** — never plain strings. This ensures text wraps.
2. **Use inline HTML tags** for formatting within Paragraphs:
   - `<b>bold text</b>` for bold
   - `<i>italic text</i>` for italics
   - `<font color="#5B5FC7">colored text</font>` for colored text
   - `<br/>` for line breaks within a cell
3. **Source citations in body text** use bold + colored font:
   ```python
   P('The platform scores <b>4.6/5</b> on G2 <font color="#5B5FC7"><b>(G2)</b></font>', body_style)
   ```
4. **Column widths must sum to ~480** (usable width with 0.7in margins on letter).
5. **Use KeepTogether** to prevent awkward page breaks in the middle of a section:
   ```python
   story.append(KeepTogether([
       P("Section header", h2_style),
       P("First paragraph that should stay with header", body_style),
   ]))
   ```
6. **Section dividers** between major sections: `story.append(section_divider())`
7. **Key statistics** should be bold and large: use `stat_row()` or inline `<b>` tags
8. **Verdict bars** for section conclusions: `VerdictBar("Anyreach leads on all voice dimensions")`
9. **Color coding for scores**:
   - GREEN (≥7): strong performance
   - AMBER (4-6): adequate with limitations
   - RED (≤3): weak or missing

---

## Page Budget Guidelines

| Competitor Data Density | Recommended Pages |
|------------------------|-------------------|
| Minimal public data (startup, stealth) | 4-6 pages |
| Moderate data (mid-market, some reviews) | 6-10 pages |
| Rich data (enterprise, many reviews, analyst coverage) | 8-12 pages |
| Head-to-head with test data (Format B) | 10-17 pages |
