# PDF Report Template

This file contains the reportlab code template for generating the funnel analysis PDF. All values marked with `{PLACEHOLDER}` should be replaced with computed values from the Mixpanel query results.

## Dependencies

```python
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, HRFlowable
)
from reportlab.lib.enums import TA_CENTER
```

## Color Palette

```python
INDIGO = HexColor("#6366f1")
WHITE = HexColor("#ffffff")
SLATE_700 = HexColor("#334155")
SLATE_600 = HexColor("#475569")
SLATE_500 = HexColor("#64748b")
LIGHT_BG = HexColor("#f1f5f9")
CARD_BG = HexColor("#f8fafc")
BORDER = HexColor("#e2e8f0")
RED_BG = HexColor("#fef2f2")
ORANGE_BG = HexColor("#fff7ed")
```

## Style Definitions

```python
styles = getSampleStyleSheet()

title_style = ParagraphStyle('CustomTitle', parent=styles['Title'],
    fontSize=22, leading=26, textColor=SLATE_700, spaceAfter=4, fontName='Helvetica-Bold')
subtitle_style = ParagraphStyle('Subtitle', parent=styles['Normal'],
    fontSize=10, leading=14, textColor=SLATE_500, spaceAfter=20, fontName='Helvetica')
h1_style = ParagraphStyle('H1', parent=styles['Heading1'],
    fontSize=16, leading=20, textColor=SLATE_700, spaceBefore=16, spaceAfter=8, fontName='Helvetica-Bold')
h2_style = ParagraphStyle('H2', parent=styles['Heading2'],
    fontSize=13, leading=17, textColor=INDIGO, spaceBefore=12, spaceAfter=6, fontName='Helvetica-Bold')
body_style = ParagraphStyle('Body', parent=styles['Normal'],
    fontSize=10, leading=15, textColor=SLATE_600, spaceAfter=8, fontName='Helvetica')
note_style = ParagraphStyle('Note', parent=styles['Normal'],
    fontSize=9, leading=13, textColor=SLATE_500, fontName='Helvetica-Oblique', spaceAfter=6)
small_style = ParagraphStyle('Small', parent=styles['Normal'],
    fontSize=8, leading=11, textColor=SLATE_500, fontName='Helvetica')
alert_red_style = ParagraphStyle('AlertRed', parent=styles['Normal'],
    fontSize=9, leading=13, textColor=HexColor("#991b1b"), fontName='Helvetica', spaceAfter=4,
    backColor=RED_BG, borderPadding=8)
alert_orange_style = ParagraphStyle('AlertOrange', parent=styles['Normal'],
    fontSize=9, leading=13, textColor=HexColor("#9a3412"), fontName='Helvetica', spaceAfter=4,
    backColor=ORANGE_BG, borderPadding=8)
```

## Helper Functions

### make_table(headers, rows, col_widths)
Creates a styled table with INDIGO header row, alternating row backgrounds, and border grid.

```python
def make_table(headers, rows, col_widths=None):
    data = [headers] + rows
    t = Table(data, colWidths=col_widths, hAlign='LEFT')
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), INDIGO),
        ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('TEXTCOLOR', (0, 1), (-1, -1), SLATE_700),
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, LIGHT_BG]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    return t
```

### make_stat_table(stats)
Creates the top-level 4-stat summary row. `stats` is a list of `(value, label, color_hex)` tuples.

```python
def make_stat_table(stats):
    header_row = []
    value_row = []
    for val, label, color in stats:
        header_row.append(Paragraph(
            f'<font color="{color}" size="16"><b>{val}</b></font>',
            ParagraphStyle('sc', alignment=TA_CENTER, fontSize=16)))
        value_row.append(Paragraph(
            f'<font color="#64748b" size="7">{label}</font>',
            ParagraphStyle('sl', alignment=TA_CENTER, fontSize=7)))
    t = Table([header_row, value_row], colWidths=[130]*len(stats), hAlign='CENTER')
    t.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOX', (0, 0), (0, -1), 0.5, BORDER),
        ('BOX', (1, 0), (1, -1), 0.5, BORDER),
        ('BOX', (2, 0), (2, -1), 0.5, BORDER),
        ('BOX', (3, 0), (3, -1), 0.5, BORDER),
        ('BACKGROUND', (0, 0), (-1, -1), CARD_BG),
        ('TOPPADDING', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 10),
    ]))
    return t
```

## Report Sections

### Section 1: Header
```
Title: "Anyreach End-to-End Funnel Analysis"
Subtitle: "Nov 1, 2025 — {TODAY} | 30-day conversion window | Data from Mixpanel"
Horizontal rule in INDIGO
```

### Section 2: Key Metrics (4 stat cards)
```
Stats: [
    ("{end_to_end_pct}%", "END-TO-END", "#ef4444"),
    ("{agent_created_pct}%", "AGENT CREATED", "#ef4444"),
    ("{onb_completion_pct}%", "ONB COMPLETION", "#f97316"),
    ("{trial_start_pct}%", "TRIAL START", "#22c55e"),
]
```

### Section 3: Acquisition Funnel
Table with columns: Step, Count, Step Conv, Notes
- Row 1: CTA Clicked, {cta_count}, —, "All CTA locations combined"
- Row 2: Signup Started, {started_count}, {started_conv}%, "⚠️ Definition changed Feb 13"
- Row 3: Signup Completed, {completed_count}, {completed_conv}%*, "*Mixed event definitions — unreliable"

Include orange alert about the Signup Started definition change.

### Section 4: Auth Page Pre/Post Comparison
Table with columns: Metric, Pre-Update, Post-Update, Delta
- Days measured
- Signup Started total/daily (⚠️ different definitions)
- Signup Completed total/daily (✅ same definition, this is the valid comparison)
- Started → Completed % (❌ not comparable)
- Paid channels status

### Section 5: Onboarding Funnel
Table: Step, Count, Step Conv, Cumulative
- Onboarding Page Viewed
- Analysis Started (loading)
- Analysis Complete
- Onboarding Completed

Plus side table: Abandoned count, Skipped count

### Section 6: In-App Feature Activation
Full table ranked by % of signups, all features from Trial Started down to KB Collection Created.

### Section 7: Hidden Insights (6 insights)
Each with h2 header, supporting data table where applicable, and narrative paragraph.

### Section 8: Top Leaks
Table: Rank, Leak Point, Impact, Diagnosis (5 rows)

### Section 9: Changes Since Last Analysis
Table: Metric, Previous Value, Current Value, Change
(Include if previous analysis data is available in context)

### Section 10: Recommended Actions
Table: Priority, Action, Rationale (P0/P1/P2)

### Footer
```
"Generated {TODAY} | Data source: Mixpanel Project 3699924 | Conversion window: 30 days"
```

## Standard Column Widths

```python
# Acquisition / Onboarding tables
col_widths_4col = [150, 60, 70, 230]   # Step, Count, Conv, Notes
col_widths_onb = [170, 60, 80, 80]     # Step, Count, Step Conv, Cumulative

# Auth comparison
col_widths_auth = [140, 130, 130, 110]  # Metric, Pre, Post, Delta

# In-app activation
col_widths_activation = [150, 55, 80, 220]  # Feature, Count, % Signups, Step Conv

# Leaks
col_widths_leaks = [35, 120, 90, 265]  # Rank, Leak, Impact, Diagnosis

# Recommendations
col_widths_recs = [40, 200, 270]  # Priority, Action, Rationale

# Changes
col_widths_changes = [180, 80, 80, 170]  # Metric, Previous, Current, Change
```

## Output Path

```python
from datetime import date
OUTPUT_PATH = f"/mnt/user-data/outputs/anyreach-funnel-analysis-{date.today().strftime('%b%d').lower()}.pdf"
```
