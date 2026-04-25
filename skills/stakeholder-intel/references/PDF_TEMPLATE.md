# PDF Template — Stakeholder Intelligence Brief

Complete ReportLab code reference for generating branded stakeholder PDFs. All components below were tested and proven in production builds.

---

## Setup

```python
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY

# ── Anyreach Brand Colors ──
DARK_BG    = HexColor('#161631')
INDIGO     = HexColor('#5B5FC7')
GREEN      = HexColor('#10B981')
CYAN       = HexColor('#06B6D4')
AMBER      = HexColor('#F59E0B')
PINK       = HexColor('#EC4899')
SECTION_BG = HexColor('#F5F6FA')
MUTED      = HexColor('#6B7280')
DARK_TEXT   = HexColor('#1A1A2E')
BORDER     = HexColor('#D1D5DB')
RED        = HexColor('#DC2626')
RED_LIGHT  = HexColor('#FFF5F5')
GREEN_LIGHT = HexColor('#E6FFF5')

W, H = letter
```

---

## Styles

```python
s_tag      = ParagraphStyle('Tag',      fontName='Helvetica-Bold',    fontSize=9,   textColor=PINK, spaceAfter=6)
s_title    = ParagraphStyle('Title',    fontName='Helvetica-Bold',    fontSize=22,  leading=28, textColor=DARK_TEXT)
s_subtitle = ParagraphStyle('Subtitle', fontName='Helvetica',         fontSize=11,  leading=15, textColor=MUTED)
s_h1       = ParagraphStyle('H1',       fontName='Helvetica-Bold',    fontSize=16,  leading=22, textColor=INDIGO, spaceBefore=20, spaceAfter=8)
s_h2       = ParagraphStyle('H2',       fontName='Helvetica-Bold',    fontSize=12,  leading=16, textColor=DARK_TEXT, spaceBefore=14, spaceAfter=6)
s_body     = ParagraphStyle('Body',     fontName='Helvetica',         fontSize=9.5, leading=14, textColor=DARK_TEXT, alignment=TA_JUSTIFY, spaceAfter=6)
s_quote    = ParagraphStyle('Quote',    fontName='Helvetica-Oblique', fontSize=9.5, leading=14, textColor=INDIGO, leftIndent=20, rightIndent=20, spaceBefore=6, spaceAfter=6)
s_bullet   = ParagraphStyle('Bullet',   fontName='Helvetica',         fontSize=9.5, leading=14, textColor=DARK_TEXT, leftIndent=20, bulletIndent=8, spaceBefore=2, spaceAfter=2)
s_label    = ParagraphStyle('Label',    fontName='Helvetica-Bold',    fontSize=8,   leading=10, textColor=INDIGO, spaceAfter=2)
s_card     = ParagraphStyle('Card',     fontName='Helvetica',         fontSize=9,   leading=13, textColor=DARK_TEXT)
s_th       = ParagraphStyle('TH',       fontName='Helvetica-Bold',    fontSize=8,   leading=11, textColor=white)
s_td       = ParagraphStyle('TD',       fontName='Helvetica',         fontSize=8.5, leading=12, textColor=DARK_TEXT)
s_callout_t = ParagraphStyle('CT',      fontName='Helvetica-Bold',    fontSize=10,  leading=13, textColor=white)
s_callout_b = ParagraphStyle('CB',      fontName='Helvetica',         fontSize=9,   leading=13, textColor=HexColor('#E0E0FF'))
```

---

## Header / Footer

```python
def header_footer(canvas, doc):
    canvas.saveState()
    # Pink top bar
    canvas.setFillColor(PINK)
    canvas.rect(0, H - 4, W, 4, fill=1, stroke=0)
    # Footer
    canvas.setFillColor(MUTED)
    canvas.setFont('Helvetica', 7)
    canvas.drawString(0.75*inch, 0.4*inch,
        "CONFIDENTIAL  |  Prepared by Anyreach Intelligence Lab  |  anyreach.ai")
    canvas.drawRightString(W - 0.75*inch, 0.4*inch, f"Page {doc.page}")
    # Footer rule
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(0.75*inch, 0.55*inch, W - 0.75*inch, 0.55*inch)
    canvas.restoreState()
```

---

## Document Setup

```python
doc = SimpleDocTemplate(
    "/home/claude/output.pdf", pagesize=letter,
    topMargin=0.8*inch, bottomMargin=0.75*inch,
    leftMargin=0.75*inch, rightMargin=0.75*inch
)
CW = W - 1.5*inch  # full content width for tables

story = []
# ... build story ...
doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
```

---

## Component Library

### Cover Summary Table

Key-value pairs for the quick-reference block on page 1.

```python
summary_data = [
    [Paragraph("<b>Role</b>", s_label),
     Paragraph("[Title at Company]", s_card)],
    [Paragraph("<b>Tenure</b>", s_label),
     Paragraph("[X years. Previously Y, Z]", s_card)],
    [Paragraph("<b>Education</b>", s_label),
     Paragraph("[Degrees — Schools]", s_card)],
    [Paragraph("<b>Controls</b>", s_label),
     Paragraph("[Scope of responsibility]", s_card)],
    [Paragraph("<b>AI Stance</b>", s_label),
     Paragraph("[One-line summary]", s_card)],
    [Paragraph("<b>Decision Style</b>", s_label),
     Paragraph("[One-line summary]", s_card)],
]
t = Table(summary_data, colWidths=[1.1*inch, CW - 1.1*inch])
t.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), SECTION_BG),
    ('BOX', (0,0), (-1,-1), 0.5, BORDER),
    ('INNERGRID', (0,0), (-1,-1), 0.25, BORDER),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 6),
    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('RIGHTPADDING', (0,0), (-1,-1), 8),
]))
```

### Dark Callout Box

For key implications and critical insights. White/light text on dark navy.

```python
callout_data = [
    [Paragraph("KEY IMPLICATION FOR THE PITCH", s_callout_t)],
    [Paragraph("[body text here]", s_callout_b)],
]
ct = Table(callout_data, colWidths=[CW])
ct.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), DARK_BG),
    ('TOPPADDING', (0,0), (0,0), 10),
    ('BOTTOMPADDING', (-1,-1), (-1,-1), 10),
    ('LEFTPADDING', (0,0), (-1,-1), 14),
    ('RIGHTPADDING', (0,0), (-1,-1), 14),
    ('TOPPADDING', (1,0), (1,-1), 2),
]))
```

### Orbit / Network Table

Companies or people in their sphere. Indigo header row.

```python
orbit_data = [
    [Paragraph("<b>Company</b>", s_th), Paragraph("<b>Signal</b>", s_th)]
]
for company, signal in items:
    orbit_data.append([
        Paragraph(f"<b>{company}</b>", s_card),
        Paragraph(signal, s_card)
    ])

ot = Table(orbit_data, colWidths=[1.4*inch, CW - 1.4*inch])
ot.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), INDIGO),
    ('TEXTCOLOR', (0,0), (-1,0), white),
    ('BACKGROUND', (0,1), (-1,-1), SECTION_BG),
    ('BOX', (0,0), (-1,-1), 0.5, BORDER),
    ('INNERGRID', (0,0), (-1,-1), 0.25, BORDER),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('RIGHTPADDING', (0,0), (-1,-1), 8),
]))
```

### Leadership Churn Table

For company context section — shows recent departures/appointments.

```python
churn_data = [
    [Paragraph("<b>Name</b>", s_th),
     Paragraph("<b>Role</b>", s_th),
     Paragraph("<b>Status</b>", s_th)]
]
for name, role, status in departures:
    churn_data.append([
        Paragraph(name, s_card),
        Paragraph(role, s_card),
        Paragraph(status, s_card)
    ])

cht = Table(churn_data, colWidths=[1.5*inch, 2.8*inch, 2.2*inch])
cht.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), DARK_TEXT),
    ('BACKGROUND', (0,1), (-1,-1), SECTION_BG),
    ('BOX', (0,0), (-1,-1), 0.5, BORDER),
    ('INNERGRID', (0,0), (-1,-1), 0.25, BORDER),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
]))
```

### Green Split Box — Risk Tolerance / Workshop Triggers

Two-column comparison with green border.

```python
risk_data = [
    [Paragraph("<b>RISK TOLERANCE</b>",
        ParagraphStyle('', fontName='Helvetica-Bold', fontSize=9, textColor=GREEN)),
     Paragraph("<b>WHAT MAKES THEM SAY YES</b>",
        ParagraphStyle('', fontName='Helvetica-Bold', fontSize=9, textColor=GREEN))],
    [Paragraph("[risk tolerance analysis]", s_card),
     Paragraph("[triggers for saying yes to a workshop/next step]", s_card)],
]
rt = Table(risk_data, colWidths=[CW/2, CW/2])
rt.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), GREEN_LIGHT),
    ('BACKGROUND', (0,1), (-1,1), SECTION_BG),
    ('BOX', (0,0), (-1,-1), 0.5, GREEN),
    ('INNERGRID', (0,0), (-1,-1), 0.25, BORDER),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ('LEFTPADDING', (0,0), (-1,-1), 10),
    ('RIGHTPADDING', (0,0), (-1,-1), 10),
]))
```

### Red Warning Box — What Turns Them Off

```python
off_data = [
    [Paragraph("<b>WHAT TURNS THEM OFF</b>",
        ParagraphStyle('', fontName='Helvetica-Bold', fontSize=9, textColor=RED))],
    [Paragraph(
        "• [item 1]<br/>• [item 2]<br/>• [item 3]<br/>• [item 4]<br/>• [item 5]",
        s_card)],
]
oft = Table(off_data, colWidths=[CW])
oft.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), RED_LIGHT),
    ('BOX', (0,0), (-1,-1), 0.5, RED),
    ('TOPPADDING', (0,0), (-1,-1), 8),
    ('BOTTOMPADDING', (0,0), (-1,-1), 8),
    ('LEFTPADDING', (0,0), (-1,-1), 10),
    ('RIGHTPADDING', (0,0), (-1,-1), 10),
]))
```

### Tactical Card — Colored Left Border

One per recommendation. Cycle through colors: INDIGO, CYAN, GREEN, AMBER, PINK.

```python
colors = [INDIGO, CYAN, GREEN, AMBER, PINK]

for i, (title, description) in enumerate(tactics):
    color = colors[i % len(colors)]
    tac_data = [
        [Paragraph(f"<b>{title.upper()}</b>",
            ParagraphStyle('', fontName='Helvetica-Bold', fontSize=9.5,
                           leading=13, textColor=color))],
        [Paragraph(description, s_card)],
    ]
    tt = Table(tac_data, colWidths=[CW])
    tt.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), SECTION_BG),
        ('LINEBEFORE', (0,0), (0,-1), 3, color),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(tt)
    story.append(Spacer(1, 6))
```

### Conclusion Box — Dark with Indigo Border

Final section. Navy background, white text, indigo border.

```python
conc_data = [[
    Paragraph(
        "[conclusion text — use <b>bold</b> for emphasis, <i>italics</i> for quotes, "
        "<br/><br/> for paragraph breaks]",
        ParagraphStyle('', fontName='Helvetica', fontSize=9.5, leading=14,
                       textColor=white, alignment=TA_JUSTIFY)),
]]
ct = Table(conc_data, colWidths=[CW])
ct.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), DARK_BG),
    ('BOX', (0,0), (-1,-1), 1, INDIGO),
    ('TOPPADDING', (0,0), (-1,-1), 16),
    ('BOTTOMPADDING', (0,0), (-1,-1), 16),
    ('LEFTPADDING', (0,0), (-1,-1), 16),
    ('RIGHTPADDING', (0,0), (-1,-1), 16),
]))
```

---

## Full Page Structure

```
Page 1: COVER
  Spacer(1, 40)
  "STAKEHOLDER INTELLIGENCE BRIEF" (s_tag)
  "[Person Name]" (s_title)
  "[Title — Company]" (s_subtitle)
  "Prepared for [context] — [Month Year]" (s_subtitle)
  Spacer(1, 16)
  Summary Table
  Spacer(1, 20)
  HRFlowable

Page 2+: SECTIONS
  "1. CAREER ARC" (s_h1)
  → Prose paragraphs (s_body)

  "2. WHAT THEY CONTROL" (s_h1)
  → Prose + bullet list
  → Dark callout box: key implication

  PageBreak()
  "3. LINKEDIN INTELLIGENCE" (s_h1)
  → Prose intro
  → Labeled quote blocks (s_h2 label + s_quote)
  → Hashtag map line

  "4. NETWORK & ORBIT" (s_h1)
  → Orbit table

  PageBreak()
  "5. [COMPANY] CONTEXT" (s_h1)
  → Leadership churn table
  → Prose analysis

  "6. PSYCHOLOGICAL PROFILE" (s_h1)
  → Core type paragraph (s_body with bold)
  → Decision driver bullets
  → Green split box
  → Red warning box

  PageBreak()
  "7. TACTICAL PLAYBOOK" (s_h1)
  → 5-6 tactical cards

  Spacer(1, 10)
  "8. CONCLUSION" (s_h1)
  → Conclusion box
```

---

## Notes

- Always `pip install reportlab --break-system-packages` before building
- Escape `&` as `&amp;` in all Paragraph text
- Never use Unicode subscript/superscript chars (render as black boxes)
- Test build before copying to outputs
- Target 4-6 pages depending on available data
