# PDF Template Reference — Proposal & SoW

This file contains the complete PDF generation code for the Proposal & Statement of Work. Copy this structure and adapt the content based on the transcript analysis.

## Complete Python Template

```python
import os
from datetime import date
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.graphics.shapes import Drawing, Rect, String, Line
from reportlab.platypus.flowables import Flowable

# ══════════════════════════════════════
# COLORS (Anyreach brand)
# ══════════════════════════════════════
DARK_BG = HexColor("#161631")
INDIGO = HexColor("#5B5FC7")
GREEN = HexColor("#10B981")
CYAN = HexColor("#06B6D4")
AMBER = HexColor("#F59E0B")
PINK = HexColor("#EC4899")
RED = HexColor("#EF4444")
MUTED = HexColor("#6B7280")
LIGHT_BG = HexColor("#F5F6FA")
DARK_TEXT = HexColor("#1F2937")
MID_TEXT = HexColor("#374151")
LIGHT_BORDER = HexColor("#E5E7EB")
SECTION_BG = HexColor("#F0F1FF")
WHITE_BG = HexColor("#FFFFFF")

# ══════════════════════════════════════
# STYLES
# ══════════════════════════════════════
styles = getSampleStyleSheet()

cover_title_style = ParagraphStyle('CoverTitle', parent=styles['Title'],
    fontSize=28, leading=34, textColor=DARK_BG, fontName='Helvetica-Bold', spaceAfter=8)

cover_subtitle_style = ParagraphStyle('CoverSubtitle', parent=styles['Normal'],
    fontSize=14, leading=18, textColor=INDIGO, fontName='Helvetica', spaceAfter=6)

cover_meta_style = ParagraphStyle('CoverMeta', parent=styles['Normal'],
    fontSize=11, leading=14, textColor=MUTED, fontName='Helvetica', spaceAfter=4)

h1_style = ParagraphStyle('H1', parent=styles['Heading1'],
    fontSize=18, leading=22, textColor=DARK_BG, fontName='Helvetica-Bold', spaceBefore=16, spaceAfter=10)

h2_style = ParagraphStyle('H2', parent=styles['Heading2'],
    fontSize=13, leading=17, textColor=INDIGO, fontName='Helvetica-Bold', spaceBefore=12, spaceAfter=6)

body_style = ParagraphStyle('Body', parent=styles['Normal'],
    fontSize=10, leading=14, textColor=MID_TEXT, fontName='Helvetica', spaceAfter=6)

body_bold = ParagraphStyle('BodyBold', parent=body_style,
    fontName='Helvetica-Bold', textColor=DARK_TEXT)

label_style = ParagraphStyle('Label', parent=styles['Normal'],
    fontSize=9, leading=11, textColor=INDIGO, fontName='Helvetica-Bold',
    spaceAfter=2, spaceBefore=8)

footer_style = ParagraphStyle('Footer', parent=styles['Normal'],
    fontSize=7, leading=9, textColor=MUTED, fontName='Helvetica', alignment=TA_CENTER)

# ══════════════════════════════════════
# CELL STYLES (critical — ALL table cells must use these)
# ══════════════════════════════════════
cell_style = ParagraphStyle('CellStyle', parent=styles['Normal'],
    fontSize=8, leading=11, textColor=MID_TEXT, fontName='Helvetica', spaceAfter=0, spaceBefore=0)

cell_bold = ParagraphStyle('CellBold', parent=cell_style,
    fontName='Helvetica-Bold', textColor=DARK_TEXT)

cell_header_white = ParagraphStyle('CellHeaderWhite', parent=cell_style,
    fontName='Helvetica-Bold', textColor=white, fontSize=8)

cell_header_dark = ParagraphStyle('CellHeaderDark', parent=cell_style,
    fontName='Helvetica-Bold', textColor=DARK_BG, fontSize=8)

cell_indigo = ParagraphStyle('CellIndigo', parent=cell_style,
    fontName='Helvetica-Bold', textColor=INDIGO)

cell_green = ParagraphStyle('CellGreen', parent=cell_style,
    fontName='Helvetica-Bold', textColor=GREEN)

cell_amber = ParagraphStyle('CellAmber', parent=cell_style,
    fontName='Helvetica-Bold', textColor=AMBER)

cell_pink = ParagraphStyle('CellPink', parent=cell_style,
    fontName='Helvetica-Bold', textColor=PINK)

cell_cyan = ParagraphStyle('CellCyan', parent=cell_style,
    fontName='Helvetica-Bold', textColor=CYAN)

cell_red = ParagraphStyle('CellRed', parent=cell_style,
    fontName='Helvetica-Bold', textColor=RED)

cell_muted = ParagraphStyle('CellMuted', parent=cell_style,
    textColor=MUTED, fontSize=7.5)

# Shorthand
P = Paragraph
```

## Custom Flowables

```python
class ColorBar(Flowable):
    """Thin colored horizontal bar for section dividers"""
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


class CoverAccentBar(Flowable):
    """Wide pink accent bar for cover page top"""
    def __init__(self, width=480, height=6):
        super().__init__()
        self.bar_width = width
        self.bar_height = height
        self.width = width
        self.height = height

    def draw(self):
        self.canv.setFillColor(PINK)
        self.canv.roundRect(0, 0, self.bar_width, self.bar_height, 3, fill=1, stroke=0)


class SectionHeader(Flowable):
    """Section number badge + title combo"""
    def __init__(self, number, title, color=INDIGO, width=480):
        super().__init__()
        self.number = number
        self.title = title
        self.color = color
        self.width = width
        self.height = 30

    def draw(self):
        c = self.canv
        # Number badge
        c.setFillColor(self.color)
        c.circle(12, 12, 12, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 11)
        c.drawCentredString(12, 7, str(self.number))
        # Title
        c.setFillColor(DARK_BG)
        c.setFont("Helvetica-Bold", 16)
        c.drawString(32, 5, self.title)
        # Underline
        c.setStrokeColor(self.color)
        c.setLineWidth(1.5)
        c.line(0, -4, self.width, -4)
```

## Standard Table Style Helpers

```python
def std_table_style(header_color=INDIGO):
    return TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), header_color),
        ('BACKGROUND', (0, 1), (-1, -1), HexColor("#FAFBFF")),
        ('BOX', (0, 0), (-1, -1), 0.5, LIGHT_BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.3, LIGHT_BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ])


def alt_row_style(header_color=INDIGO):
    """Table style with alternating row backgrounds"""
    return TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), header_color),
        ('BOX', (0, 0), (-1, -1), 0.5, LIGHT_BORDER),
        ('INNERGRID', (0, 0), (-1, -1), 0.3, LIGHT_BORDER),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ])


def add_alt_rows(style, num_rows):
    """Add alternating row colors to an existing TableStyle"""
    for i in range(1, num_rows):
        bg = WHITE_BG if i % 2 == 0 else HexColor("#FAFBFF")
        style.add('BACKGROUND', (0, i), (-1, i), bg)
    return style
```

## Document Setup

```python
doc = SimpleDocTemplate(
    "/home/claude/proposal_sow.pdf",
    pagesize=letter,
    topMargin=0.6*inch, bottomMargin=0.7*inch,
    leftMargin=0.7*inch, rightMargin=0.7*inch
)
PAGE_W = 480  # usable width with these margins
story = []
```

## Page-by-Page Layout

### Page 1: Cover Page

```python
# Pink accent bar
story.append(CoverAccentBar(PAGE_W, 6))
story.append(Spacer(1, 30))

# Label
story.append(P("PROPOSAL", ParagraphStyle('CoverLabel', parent=label_style,
    fontSize=11, textColor=PINK, fontName='Helvetica-Bold', spaceAfter=8)))

# Title — use the company name and use case
story.append(P(f"Anyreach × {COMPANY_NAME}", cover_title_style))
story.append(P(USE_CASE, cover_subtitle_style))
story.append(Spacer(1, 20))

# Metadata block
meta_data = [
    [P("Prepared for:", cell_bold), P(COMPANY_NAME, cell_style),
     P("Date:", cell_bold), P(date.today().strftime("%B %d, %Y"), cell_style)],
    [P("Prepared by:", cell_bold), P("Anyreach, Inc.", cell_style),
     P("Contact:", cell_bold), P("Richard Lin — richard@anyreach.ai", cell_style)],
]
meta_table = Table(meta_data, colWidths=[85, 155, 80, 160])
meta_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), SECTION_BG),
    ('BOX', (0, 0), (-1, -1), 0.5, LIGHT_BORDER),
    ('INNERGRID', (0, 0), (-1, -1), 0.3, LIGHT_BORDER),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
]))
story.append(meta_table)
story.append(Spacer(1, 20))

# Confidential footer on cover
story.append(P("CONFIDENTIAL — For intended recipient only", ParagraphStyle(
    'Conf', parent=footer_style, textColor=MUTED, fontSize=8)))
story.append(Spacer(1, 10))

# Divider
story.append(ColorBar(INDIGO, PAGE_W, 2))
story.append(Spacer(1, 15))

# Table of contents (simple)
toc_items = [
    "1. Introduction & Background",
    "2. Objectives",
    "3. Scope & Deliverables",
    "4. Integration & Data Schema",
    "5. Key Risks & Assumptions",
    "6. Roles & Responsibilities",
    "7. Timeline & Milestones",
    "8. Commercial Terms",
    "9. Signature Block",
]
story.append(P("CONTENTS", label_style))
story.append(Spacer(1, 4))
for item in toc_items:
    story.append(P(item, ParagraphStyle('TOCItem', parent=body_style, fontSize=10, spaceAfter=3)))
story.append(PageBreak())
```

### Pages 2+: Content Sections

Use `SectionHeader` flowable for each section, followed by content:

```python
# Section pattern
story.append(SectionHeader(1, "Introduction & Background", INDIGO))
story.append(Spacer(1, 12))
story.append(P(intro_text, body_style))  # Flowing prose from analysis
story.append(Spacer(1, 8))

# Stakeholders table
stakeholder_header = [P("Name", cell_header_white), P("Title", cell_header_white),
                      P("Role", cell_header_white), P("Authority", cell_header_white)]
stakeholder_rows = [stakeholder_header]
# Add rows from transcript analysis...
stakeholder_rows.append([P(name, cell_bold), P(title, cell_style),
                         P(role, cell_indigo), P(authority, cell_style)])

stakeholder_table = Table(stakeholder_rows, colWidths=[120, 140, 110, 110])
stakeholder_table.setStyle(std_table_style(INDIGO))
story.append(stakeholder_table)
```

### Objectives Section

```python
story.append(SectionHeader(2, "Objectives", GREEN))
story.append(Spacer(1, 12))

# Primary goals table
story.append(P("PRIMARY GOALS", label_style))
story.append(Spacer(1, 4))
obj_header = [P("Objective", cell_header_white), P("Success Metric", cell_header_white),
              P("Baseline", cell_header_white), P("Target", cell_header_white)]
obj_rows = [obj_header]
# Add rows...
obj_table = Table(obj_rows, colWidths=[160, 140, 90, 90])
obj_table.setStyle(std_table_style(GREEN))
story.append(obj_table)
story.append(Spacer(1, 10))

# Secondary goals
story.append(P("SECONDARY GOALS", label_style))
# Similar table with CYAN header...
```

### Scope & Deliverables Section

```python
story.append(SectionHeader(3, "Scope & Deliverables", INDIGO))
story.append(Spacer(1, 12))

# Each deliverable as a mini card-style table
for i, (title, description) in enumerate(deliverables):
    card_data = [[P(f"{chr(65+i)}. {title}", cell_bold)], [P(description, cell_style)]]
    card = Table(card_data, colWidths=[PAGE_W])
    card.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), HexColor("#FAFBFF")),
        ('BOX', (0, 0), (-1, -1), 0.5, LIGHT_BORDER),
        ('LEFTPADDING', (0, 0), (0, 0), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        # Colored left border effect
        ('LINEBEFOREKIND', (0, 0), (0, -1)),
    ]))
    story.append(card)
    story.append(Spacer(1, 4))
```

### Integration & Data Schema Section

```python
story.append(SectionHeader(4, "Integration & Data Schema", CYAN))
story.append(Spacer(1, 12))

# System architecture table
story.append(P("SYSTEM ARCHITECTURE", label_style))
sys_header = [P("System", cell_header_white), P("Type", cell_header_white),
              P("Integration Method", cell_header_white), P("Direction", cell_header_white)]
# Add rows for each system...

# Data flow table
story.append(P("DATA FLOWS", label_style))
flow_header = [P("Source", cell_header_white), P("Destination", cell_header_white),
               P("Data Elements", cell_header_white), P("Protocol", cell_header_white)]

# Schema table
story.append(P("CORE DATA SCHEMA", label_style))
schema_header = [P("Field", cell_header_white), P("Type", cell_header_white),
                 P("Source", cell_header_white), P("Required", cell_header_white)]
```

### Risks & Assumptions Section

```python
story.append(SectionHeader(5, "Key Risks & Assumptions", AMBER))
story.append(Spacer(1, 12))

risk_header = [P("Category", cell_header_white), P("Risk / Assumption", cell_header_white),
               P("Mitigation / Next Step", cell_header_white)]
# Add rows — use cell_amber for category labels
# Categories: Technical, Data, Process, Timeline, Compliance, Change Management
risk_table = Table(risk_rows, colWidths=[80, 200, 200])
risk_table.setStyle(std_table_style(AMBER))
```

### Roles & Responsibilities Section

```python
story.append(SectionHeader(6, "Roles & Responsibilities", PINK))
story.append(Spacer(1, 12))

# Two-column layout: Anyreach side | Prospect side
raci_header = [P("Role", cell_header_white), P("Anyreach", cell_header_white),
               P(COMPANY_NAME, cell_header_white), P("Est. Time", cell_header_white)]
# Roles: Project Lead/DRI, Technical Lead, Executive Sponsor, SME, QA
raci_table = Table(raci_rows, colWidths=[90, 165, 165, 60])
raci_table.setStyle(std_table_style(PINK))
```

### Timeline Section

```python
story.append(SectionHeader(7, "Timeline & Milestones", INDIGO))
story.append(Spacer(1, 12))

# Timeline bar visual
def make_timeline_bar(phases):
    """phases: list of (name, weeks, color)"""
    d = Drawing(PAGE_W, 65)
    d.add(Rect(0, 0, PAGE_W, 65, fillColor=HexColor("#FAFBFF"),
               strokeColor=LIGHT_BORDER, strokeWidth=0.5, rx=6))
    total = sum(p[1] for p in phases)
    x, y, bar_h, total_w = 15, 22, 22, PAGE_W - 30
    for name, weeks, color in phases:
        w = weeks / total * total_w
        d.add(Rect(x, y, w - 3, bar_h, fillColor=color, strokeColor=None, rx=3))
        if w > 40:
            d.add(String(x + w/2, y + 6, name, fontSize=6.5, fillColor=white,
                        textAnchor='middle', fontName='Helvetica-Bold'))
            d.add(String(x + w/2, y + bar_h + 5, f"Wk {weeks}",
                        fontSize=6, fillColor=MUTED, textAnchor='middle', fontName='Helvetica'))
        x += w
    return d

story.append(make_timeline_bar(timeline_phases))
story.append(Spacer(1, 10))

# Detail table
timeline_header = [P("Phase", cell_header_white), P("Duration", cell_header_white),
                   P("Key Activities", cell_header_white), P("Milestone", cell_header_white)]
timeline_table = Table(timeline_rows, colWidths=[100, 60, 200, 120])
timeline_table.setStyle(std_table_style(INDIGO))
```

### Commercial Terms Section

```python
story.append(SectionHeader(8, "Commercial Terms", GREEN))
story.append(Spacer(1, 12))

# Pricing card
pricing_data = [
    [P("PILOT PRICING", cell_header_white), P("", cell_header_white)],
    [P("Total Pilot Fee", cell_bold), P(f"${PILOT_PRICE:,.0f}", cell_green)],
    [P("Payment 1 — Upon SoW Execution", cell_style), P(f"${PILOT_PRICE/2:,.0f}", cell_style)],
    [P("Payment 2 — Upon Project Completion", cell_style), P(f"${PILOT_PRICE/2:,.0f}", cell_style)],
    [P("Pilot Duration", cell_bold), P(f"{PILOT_WEEKS} weeks", cell_style)],
]
pricing_table = Table(pricing_data, colWidths=[320, 160])
pricing_table.setStyle(std_table_style(GREEN))
story.append(pricing_table)
story.append(Spacer(1, 10))

# Inclusions / Exclusions
story.append(P("WHAT'S INCLUDED", label_style))
story.append(P(inclusions_text, body_style))
story.append(P("WHAT'S EXCLUDED", ParagraphStyle('ExLabel', parent=label_style, textColor=RED)))
story.append(P(exclusions_text, body_style))
```

### Signature Block

```python
story.append(SectionHeader(9, "Signature Block", DARK_BG))
story.append(Spacer(1, 16))

story.append(P("AGREED AND ACCEPTED:", body_bold))
story.append(Spacer(1, 16))

# Two signature blocks side by side
sig_data = [
    [P("<b>Anyreach, Inc.</b>", cell_bold), P(f"<b>{COMPANY_NAME}</b>", cell_bold)],
    [P("Richard Lin, CEO", cell_style), P(f"{DM_NAME}, {DM_TITLE}", cell_style)],
    [P("richard@anyreach.ai", cell_indigo), P(DM_EMAIL, cell_indigo)],
    [P("", cell_style), P("", cell_style)],  # spacer row
    [P("Signature: ____________________", cell_style),
     P("Signature: ____________________", cell_style)],
    [P("Date: ________________________", cell_style),
     P("Date: ________________________", cell_style)],
]
sig_table = Table(sig_data, colWidths=[240, 240])
sig_table.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 4),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ('LINEBELOW', (0, -1), (-1, -1), 0.5, LIGHT_BORDER),
]))
story.append(sig_table)
```

## Footer Function

```python
def add_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 7)
    canvas.setFillColor(MUTED)
    canvas.drawCentredString(letter[0]/2, 0.4*inch,
        f"CONFIDENTIAL  •  anyreach.ai  •  Page {doc.page}")
    canvas.restoreState()

# Build with footer
doc.build(story, onFirstPage=add_footer, onLaterPages=add_footer)
```

## Critical Rules

1. **ALL table cells must be Paragraph objects** — never plain strings
2. **Column widths must sum to PAGE_W (480)**
3. **Add RIGHTPADDING to all table styles** — prevents text touching borders
4. **Use KeepTogether** for tables that shouldn't split across pages
5. **Test text wrapping** — long content in narrow columns is the #1 failure mode
6. **Escape HTML entities** in Paragraph text: `&amp;` `&lt;` `&gt;`
7. **Use PageBreak** between major sections to keep layout clean

## Color Assignment Guide

| Element | Color |
|---------|-------|
| Cover accent bar | PINK |
| Section numbers / headers | Per section (rotate INDIGO, GREEN, CYAN, AMBER, PINK) |
| Table headers | Match section color |
| Body text | MID_TEXT |
| Labels | INDIGO |
| Pricing amounts | GREEN |
| Risk categories | AMBER |
| Excluded items | RED |
| Links / emails | INDIGO |
| Muted / footnotes | MUTED |
