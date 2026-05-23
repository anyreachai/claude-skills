# PDF Report Template (ReportLab)

## Setup & Styles

```python
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable

styles = getSampleStyleSheet()
ts = ParagraphStyle('T2', parent=styles['Title'], fontSize=18, spaceAfter=2, textColor=colors.HexColor('#1a1a2e'))
ss = ParagraphStyle('Sub', parent=styles['Normal'], fontSize=10, textColor=colors.grey, spaceAfter=12)
h2 = ParagraphStyle('H2', parent=styles['Heading2'], fontSize=13, textColor=colors.HexColor('#1a1a2e'), spaceBefore=16, spaceAfter=6)
h3 = ParagraphStyle('H3', parent=styles['Heading3'], fontSize=11, textColor=colors.HexColor('#2d3436'), spaceBefore=10, spaceAfter=4)
bd = ParagraphStyle('Bd', parent=styles['Normal'], fontSize=9, leading=13, spaceAfter=6)
ns = ParagraphStyle('Ns', parent=styles['Normal'], fontSize=8, leading=10, textColor=colors.HexColor('#636e72'), fontName='Helvetica-Oblique', spaceBefore=8)
bl = ParagraphStyle('Bl', parent=bd, leftIndent=18, bulletIndent=6, spaceBefore=2, spaceAfter=2)
DK = colors.HexColor('#1a1a2e')
LB = colors.HexColor('#f8f9fa')
```

## Document Setup

```python
doc = SimpleDocTemplate(
    '/mnt/user-data/outputs/anyreach_MONTH_YEAR_report.pdf',
    pagesize=letter,
    topMargin=0.6*inch, bottomMargin=0.6*inch,
    leftMargin=0.7*inch, rightMargin=0.7*inch
)
st = []
W = letter[0] - 1.4*inch  # usable width
```

## Standard Table Builder

```python
def mt(data, cw=None):
    """Standard data table with dark header, alternating rows"""
    t = Table(data, colWidths=cw, hAlign='LEFT')
    s = [
        ('FONTSIZE',(0,0),(-1,-1),8), ('LEADING',(0,0),(-1,-1),11),
        ('TOPPADDING',(0,0),(-1,-1),4), ('BOTTOMPADDING',(0,0),(-1,-1),4),
        ('LEFTPADDING',(0,0),(-1,-1),6), ('RIGHTPADDING',(0,0),(-1,-1),6),
        ('GRID',(0,0),(-1,-1),0.5,colors.HexColor('#dee2e6')),
        ('VALIGN',(0,0),(-1,-1),'MIDDLE'),
        ('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white, LB]),
        ('BACKGROUND',(0,0),(-1,0),DK),
        ('TEXTCOLOR',(0,0),(-1,0),colors.white),
        ('FONTNAME',(0,0),(-1,0),'Helvetica-Bold')
    ]
    t.setStyle(TableStyle(s))
    return t
```

## Cash Flow Table Builder

```python
def cf_table(data, cw):
    """Cash flow table with highlighted Net Cash Flow and Ending Cash rows"""
    t = Table(data, colWidths=cw, hAlign='LEFT')
    s = [
        ('FONTSIZE',(0,0),(-1,-1),7.5), ('LEADING',(0,0),(-1,-1),10),
        ('TOPPADDING',(0,0),(-1,-1),3), ('BOTTOMPADDING',(0,0),(-1,-1),3),
        ('LEFTPADDING',(0,0),(-1,-1),4), ('RIGHTPADDING',(0,0),(-1,-1),4),
        ('GRID',(0,0),(-1,-1),0.5,colors.HexColor('#dee2e6')),
        ('VALIGN',(0,0),(-1,-1),'MIDDLE'),
        ('BACKGROUND',(0,0),(-1,0),DK),
        ('TEXTCOLOR',(0,0),(-1,0),colors.white),
        ('FONTNAME',(0,0),(-1,0),'Helvetica-Bold')
    ]
    for i, row in enumerate(data):
        if row and row[0] in ('Total Inflows', 'Total Expenses'):
            s.append(('FONTNAME',(0,i),(-1,i),'Helvetica-Bold'))
        if row and row[0] == 'Net Cash Flow':
            s += [('FONTNAME',(0,i),(-1,i),'Helvetica-Bold'),
                  ('BACKGROUND',(0,i),(-1,i),colors.HexColor('#fff3cd'))]
        if row and row[0] == 'Ending Cash':
            s += [('FONTNAME',(0,i),(-1,i),'Helvetica-Bold'),
                  ('BACKGROUND',(0,i),(-1,i),colors.HexColor('#d4edda'))]
    t.setStyle(TableStyle(s))
    return t
```

## Common Patterns

### Title Block
```python
st.append(Paragraph('Anyreach Inc. — Financial Health Report', ts))
st.append(Paragraph('Month Year | Updated Date', ss))
st.append(HRFlowable(width='100%', thickness=1, color=DK))
st.append(Spacer(1, 8))
```

### Status Banner
```python
# Green = cash positive, Amber = manageable burn, Red = elevated risk
st.append(Paragraph(
    '<font color="#1D9E75" size="11"><b>CASH-FLOW POSITIVE: +$X/mo</b></font>', bd
))
# OR
st.append(Paragraph(
    '<font color="#BA7517" size="11"><b>POST-CHURN | 17 mo runway | forecast critical</b></font>', bd
))
```

### Bullet Points
```python
for p in [
    '<b>April:</b> Net -$31K. Cash: $465K.',
    '<b>May:</b> Pilot cash lands. Net +$186K. Cash: $648K.',
]:
    st.append(Paragraph(f'\u2022 {p}', bl))
```

### Format Helpers
```python
def ff(v):
    """Format positive/negative dollar amounts"""
    return f'+${v:,}' if v >= 0 else f'-${abs(v):,}'
```

### Cash Flow Table Column Widths
```python
cfw = [W*0.22, W*0.13, W*0.13, W*0.13, W*0.13, W*0.13, W*0.13]  # 6-month
```

### Page Breaks
```python
st.append(PageBreak())
```

### Footer
```python
st.append(Spacer(1, 20))
st.append(HRFlowable(width='100%', thickness=0.5, color=colors.grey))
st.append(Paragraph('Date. Key assumptions. Team size. Buffer rate. Data sources.', ns))
```

### Build
```python
doc.build(st)
```

## Output
Save to: `/mnt/user-data/outputs/anyreach_MONTH_YEAR_report.pdf`
Present via `present_files`.
