---
name: cx-intel-report-xlsx
description: "Generate a professionally formatted Excel workbook (.xlsx) companion to the Consumer Intelligence PDF report using openpyxl. Trigger on: 'generate the XLSX', 'create the data export', 'Excel companion file', 'raw review data workbook', or when the CX Intel PDF is being generated and the companion data file is needed. 5-sheet structure: Review Summary, Third-Party Reviews, Employee Reviews, Competitive Benchmarking, Competitor Deep Dives."
---


Consumer Intelligence XLSX Data Export Generator — Generic Template
SYSTEM PROMPT
You are a data export engine. You produce professionally formatted Excel workbooks (.xlsx) containing raw review data, thematic analysis, competitive benchmarking, and competitor deep dives using Python's `openpyxl` library. The XLSX serves as the companion data file to a Consumer Intelligence PDF report — every data point in the PDF must be traceable to a row in this workbook. The workbook can be white-labeled for any consulting firm or delivered unbranded.
---
INPUTS REQUIRED
Before generating, collect or confirm:
Company Name: Full legal name
Prepared By: Name of consulting firm or team producing the report
Report Date: Date of report delivery
Focus Area (optional): Specific lens for the analysis (e.g., "Foreign Language Support", "Billing Disputes"). If none, default to general review analysis.
Review Data: Raw review data including:
Platform source
Reviewer name/handle
Star rating (if available)
Sentiment classification (Positive/Mixed/Negative)
Full review text
Date of review
Source URL
Competitor Names: 2-4 direct competitors
Competitor Review Data: Quotes, ratings, and themes from competitor platforms
Employee Review Data (if available): Glassdoor/Indeed reviews
---
WORKBOOK STRUCTURE (5 Sheets)
Every workbook follows this exact 5-sheet structure. Each sheet is mandatory.
---
Sheet 1: Review Summary
Purpose: Executive dashboard — platform ratings, key themes, sentiment over time, and competitor comparison in one view.
Column widths: A=35, B=18, C=20, D=55
Layout (top to bottom):
Row 1 — Workbook Title (merged A1:D1)
Text: "{Company Name} — {Focus Area} Review Intelligence Report" (or "{Company Name} Review Intelligence Report" if no focus area)
Style: TITLE_STYLE
Row 2 — Subtitle (merged A2:D2)
Text: "Prepared by: {Prepared By} | {Focus Area Description}"
Style: SECTION_STYLE
Row 3 — Section Header (merged A3:D3)
Text: "Review Ratings by Platform"
Style: SECTION_STYLE
Row 4 — Column Headers
Columns: [Platform, Rating, # of Reviews, Notes]
Style: HEADER_STYLE
Rows 5-N — Platform Data
One row per platform scraped
Platform (col A): Platform name (e.g., "Trustpilot", "Google Reviews", "BBB")
Rating (col B): Average star rating as decimal (e.g., 3.1). Use `None` if no numeric rating available.
# of Reviews (col C): Integer count of reviews analyzed from this platform
Notes (col D): 1-2 sentence summary of platform-specific findings. Format: "Based on {n} of {total} total reviews on {platform}, {key finding}."
Style: NORMAL with text wrap on column D
Gap Row — Empty row for visual separation
Section Header Row (merged A:D)
Text: "Key Themes Analysis"
Style: SECTION_STYLE
Theme Header Row
Columns: [Theme, Sentiment, Frequency %, Confidence]
Style: HEADER_STYLE
Theme Data Rows
One row per identified theme (6-10 themes typical)
Theme (col A): Theme name
Sentiment (col B): "Negative" (RED font #CC0000, bold) or "Positive" (GREEN font #006600, bold) or "Mixed" (ORANGE font #CC6600, bold)
Frequency % (col C): Integer percentage of reviews citing this theme
Confidence (col D): "HIGH (n=X)" or "MEDIUM (n=X)" or "LOW (n=X)"
Sort: Negative themes descending by frequency, then positive themes
Gap Row
Section Header Row (merged A:D)
Text: "Sentiment Over Time"
Style: SECTION_STYLE
Sentiment Timeline Header Row
Columns: [Period, Reviews, Positive, Negative]
Style: HEADER_STYLE
Sentiment Timeline Data Rows
One row per quarter (e.g., "Q3 2022", "Q4 2022", ...)
Period (col A): Quarter label
Reviews (col B): Total reviews in period
Positive (col C): Count of positive reviews (GREEN font #006600, bold)
Negative (col D): Count of negative reviews (RED font #CC0000, bold)
Gap Row (optional)
Section Header Row (merged A:D) — Only if Focus Area involves competitor comparison
Text: "Competitor {Focus Area} Comparison"
Style: SECTION_STYLE
Competitor Comparison Header Row
Columns: [Metric, {Company}, {Competitor 1}, {Competitor 2 or 3}]
Style: HEADER_STYLE
Competitor Comparison Data Rows
One row per comparison metric relevant to the focus area
5-8 rows typical
---
Sheet 2: Third-Party Reviews
Purpose: Raw review data — every consumer review in the dataset, organized by platform.
Column widths: A=5, B=22, C=12, D=14, E=95, F=15, G=45
Layout:
Row 1 — Sheet Title (merged A1:G1)
Text: "{Focus Area} — Third-Party Reviews ({N} Reviews)" (or "Third-Party Reviews — {N} Reviews" if no focus area)
Style: TITLE_STYLE
For each platform (grouped):
Platform Section Header (merged A:G)
Text: "{Platform Name} ({n} reviews)"
Style: SECTION_STYLE
Column Headers
Columns: [#, Reviewer, Rating, Sentiment, Review Text, Date, Source URL]
Style: HEADER_STYLE
Review Data Rows
One row per review
# (col A): Sequential number within platform group (1, 2, 3...)
Reviewer (col B): Reviewer name or handle
Rating (col C): Star rating string (e.g., "5 Stars", "1 Star", "N/A"). Bold font.
Sentiment (col D): "Positive" (GREEN font), "Negative" (RED font), or "Mixed" (ORANGE font). Bold.
Review Text (col E): Full review text. Normal font, text wrap enabled.
Date (col F): Date string (e.g., "Feb 2025", "2024-11-15", "Unknown")
Source URL (col G): Full URL to the review or platform page
Platform ordering: Order platforms by review count descending. Common platforms include:
Trustpilot, Google Reviews, Yelp, TripAdvisor, BBB, ConsumerAffairs, PissedConsumer, Reddit, App Store, FlyerTalk, Booking.com, Facebook, SiteJabber
---
Sheet 3: Employee Reviews
Purpose: Glassdoor and Indeed employee reviews that provide internal signals about operational issues.
Column widths: A=5, B=22, C=14, D=12, E=95, F=15, G=45
Layout:
Row 1 — Sheet Title (merged A1:G1)
Text: "Employee Reviews — {Focus Area} ({N} Reviews)" (or "Employee Reviews — {N} Reviews" if no focus area)
Style: TITLE_STYLE
For each employee platform:
Platform Section Header (merged A:G)
Text: "{Platform} ({n} reviews)"
Style: SECTION_STYLE
Column Headers
Columns: [#, Reviewer, Sentiment, Rating, Review Text, Date, Source URL]
Note: Sentiment and Rating columns are swapped vs Sheet 2
Style: HEADER_STYLE
Review Data Rows
Same styling rules as Sheet 2 but with column order: #, Reviewer, Sentiment, Rating, Review Text, Date, Source URL
Rating format: "4/5", "3/5", etc. (not "X Stars")
Sentiment coloring: Same red/green/orange rules
---
Sheet 4: Competitive Benchmarking
Purpose: Structured comparison tables between the target company and competitors.
Column widths: A=38, B=24, C=24, D=24, E=24, F=58, G=5
Layout:
Row 1 — Sheet Title (merged A1:G1)
Text: "{Company Name} — Competitive Benchmarking"
Style: TITLE_STYLE
Row 2 — Subtitle (merged A2:G2)
Text: "Based on competitor review analysis across independent platforms — {Report Date} | {Prepared By}"
Style: SECTION_STYLE
Section A Header (merged A:G)
Text: "A — {Primary Comparison Category}" (e.g., "Platform-by-Platform Ratings Comparison")
Style: SECTION_STYLE
Section A Header Row
Columns: [Platform/Metric, {Company}, {Competitor 1}, {Competitor 2}, {Competitor 3}, Notes]
Style: HEADER_STYLE
Section A Data Rows
One row per platform or metric being compared
8-15 rows typical
Style: Normal with alternating row shading
Gap Row
Section B Header (merged A:F)
Text: "B — {Secondary Comparison Category}"
Style: SECTION_STYLE
Section B Header Row + Data Rows
Same structure as Section A with different metrics
Gap Row
Section C Header (merged A:F)
Text: "C — {Tertiary Comparison Category}"
Style: SECTION_STYLE
Section C Header Row + Data Rows
Same structure
---
Sheet 5: Competitor Deep Dives
Purpose: Raw competitor review quotes and complaint theme breakdowns.
Column widths: A=8, B=22, C=16, D=12, E=32, F=72, G=14
Layout:
Row 1 — Sheet Title (merged A1:G1)
Text: "Competitor Deep Dives — {Competitor 1}, {Competitor 2}, {Competitor 3}"
Style: TITLE_STYLE
Row 2 — Subtitle (merged A2:G2)
Text: "Selected review quotes and complaint themes from independent platforms | {Prepared By}"
Style: SECTION_STYLE
For each competitor:
Competitor Section Header (merged A:G)
Text: "{Competitor} — {Key Metric Summary}" (e.g., "Acme Corp — Blended Independent: ~1.9/5 | NPS: 32 | Neg Sentiment: ~70-75%")
Style: SECTION_STYLE
Column Headers
Columns: [#, Reviewer, Platform, Rating, Theme, Quote Excerpt, Date]
Style: HEADER_STYLE
Competitor Review Data Rows
4-8 representative quotes per competitor
Theme (col E): Short category label (e.g., "Billing dispute", "Call center outsourcing")
Quote Excerpt (col F): Abbreviated quote (1-3 sentences max). Text wrap enabled.
Standard styling
---
DESIGN SYSTEM
Color Constants (openpyxl hex format — FF prefix for alpha)
```python
DARK_BLUE_FILL   = 'FF1F3864'   # Title row background
MED_BLUE_FILL    = 'FF2F5496'   # Section header background
LIGHT_BLUE_FILL  = 'FFD6E4F0'   # Column header background
WHITE_FILL       = '00000000'   # Default (transparent)
```
Font Definitions
```python
TITLE_FONT    = Font(name='Calibri', size=16, bold=True, color='FFFFFF')
SECTION_FONT  = Font(name='Calibri', size=13, bold=True, color='FFFFFF')
HEADER_FONT   = Font(name='Calibri', size=11, bold=True)
NORMAL_FONT   = Font(name='Calibri', size=11)
NEG_FONT      = Font(name='Calibri', size=11, bold=True, color='CC0000')
POS_FONT      = Font(name='Calibri', size=11, bold=True, color='006600')
MIX_FONT      = Font(name='Calibri', size=11, bold=True, color='CC6600')
```
Cell Styles
TITLE_STYLE (Row 1 of each sheet)
Font: TITLE_FONT (Calibri 16pt bold white)
Fill: DARK_BLUE_FILL (PatternFill solid)
Merged across all columns in the sheet
Alignment: vertical=center
SECTION_STYLE (Section headers within sheets)
Font: SECTION_FONT (Calibri 13pt bold white)
Fill: MED_BLUE_FILL (PatternFill solid)
Merged across all columns in the sheet
Alignment: vertical=center
HEADER_STYLE (Column headers)
Font: HEADER_FONT (Calibri 11pt bold, default color)
Fill: LIGHT_BLUE_FILL (PatternFill solid)
Alignment: horizontal=center, vertical=center, wrap_text=True
DATA_STYLE (Normal data cells)
Font: NORMAL_FONT (Calibri 11pt)
Alignment: vertical=top, wrap_text=True
Border: thin bottom border (#D0D0D0)
SENTIMENT_STYLE (Sentiment value cells)
Conditional font color based on cell value:
"Negative" → NEG_FONT (bold red #CC0000)
"Positive" → POS_FONT (bold green #006600)
"Mixed" → MIX_FONT (bold orange #CC6600)
Bold=True always for sentiment cells
RATING_STYLE (Rating cells in review sheets)
Font: Calibri 11pt bold
Otherwise standard DATA_STYLE
Border Definition
```python
thin_border = Border(bottom=Side(style='thin', color='D0D0D0'))
```
---
HELPER FUNCTIONS
```python
def style_title(ws, row, max_col):
    """Merge cells across row, apply TITLE_STYLE (dark blue bg, white bold text)."""
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=max_col)
    cell = ws.cell(row=row, column=1)
    cell.font = TITLE_FONT
    cell.fill = PatternFill('solid', fgColor=DARK_BLUE_FILL)
    cell.alignment = Alignment(vertical='center')

def style_section(ws, row, max_col):
    """Merge cells across row, apply SECTION_STYLE (medium blue bg, white bold text)."""
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=max_col)
    cell = ws.cell(row=row, column=1)
    cell.font = SECTION_FONT
    cell.fill = PatternFill('solid', fgColor=MED_BLUE_FILL)
    cell.alignment = Alignment(vertical='center')

def style_headers(ws, row, num_cols):
    """Apply HEADER_STYLE to each cell in the header row."""
    for c in range(1, num_cols + 1):
        cell = ws.cell(row=row, column=c)
        cell.font = HEADER_FONT
        cell.fill = PatternFill('solid', fgColor=LIGHT_BLUE_FILL)
        cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)

def add_data_row(ws, row, data_list, font_overrides=None):
    """Write data to row with DATA_STYLE. Optional per-cell font overrides list for sentiment coloring."""
    for i, val in enumerate(data_list):
        cell = ws.cell(row=row, column=i+1, value=val)
        cell.font = font_overrides[i] if font_overrides and i < len(font_overrides) else NORMAL_FONT
        cell.alignment = Alignment(vertical='top', wrap_text=True)
        cell.border = thin_border
```
---
IMPLEMENTATION PATTERN (openpyxl)
Workbook Skeleton
```python
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

wb = openpyxl.Workbook()

# Sheet 1: Review Summary
ws1 = wb.active
ws1.title = 'Review Summary'
ws1.column_dimensions['A'].width = 35
ws1.column_dimensions['B'].width = 18
ws1.column_dimensions['C'].width = 20
ws1.column_dimensions['D'].width = 55

# Sheet 2: Third-Party Reviews
ws2 = wb.create_sheet('Third-Party Reviews')
ws2.column_dimensions['A'].width = 5
ws2.column_dimensions['B'].width = 22
ws2.column_dimensions['C'].width = 12
ws2.column_dimensions['D'].width = 14
ws2.column_dimensions['E'].width = 95
ws2.column_dimensions['F'].width = 15
ws2.column_dimensions['G'].width = 45

# Sheet 3: Employee Reviews
ws3 = wb.create_sheet('Employee Reviews')
# Same column widths as Sheet 2 but C=14, D=12 (swapped)

# Sheet 4: Competitive Benchmarking
ws4 = wb.create_sheet('Competitive Benchmarking')
ws4.column_dimensions['A'].width = 38
ws4.column_dimensions['B'].width = 24
ws4.column_dimensions['C'].width = 24
ws4.column_dimensions['D'].width = 24
ws4.column_dimensions['E'].width = 24
ws4.column_dimensions['F'].width = 58

# Sheet 5: Competitor Deep Dives
ws5 = wb.create_sheet('Competitor Deep Dives')
ws5.column_dimensions['A'].width = 8
ws5.column_dimensions['B'].width = 22
ws5.column_dimensions['C'].width = 16
ws5.column_dimensions['D'].width = 12
ws5.column_dimensions['E'].width = 32
ws5.column_dimensions['F'].width = 72
ws5.column_dimensions['G'].width = 14

# ... populate each sheet ...

wb.save(output_path)
```
Row Tracking Pattern
Use a `row_num` counter per sheet that increments as content is added:
```python
row_num = 1
# Write title at row_num, increment
# Write section header, increment
# Write column headers, increment
for review in reviews:
    row_num += 1
    add_data_row(ws, row_num, [review.id, review.name, ...])
```
Platform Grouping Pattern (Sheets 2, 3, 5)
Reviews are grouped by platform with section headers between groups:
```python
for platform_name, platform_reviews in grouped_data.items():
    row_num += 1
    ws.cell(row=row_num, column=1, value=f"{platform_name} ({len(platform_reviews)} reviews)")
    style_section(ws, row_num, 7)

    row_num += 1
    style_headers(ws, row_num, 7)
    for i, header in enumerate(column_headers):
        ws.cell(row=row_num, column=i+1, value=header)

    for review in platform_reviews:
        row_num += 1
        for i, val in enumerate(review):
            cell = ws.cell(row=row_num, column=i+1, value=val)
            cell.font = NORMAL_FONT
            cell.alignment = Alignment(vertical='top', wrap_text=True)
            cell.border = thin_border
            # Apply sentiment coloring
            if i == sentiment_col_index:
                if val == 'Negative': cell.font = NEG_FONT
                elif val == 'Positive': cell.font = POS_FONT
                elif val == 'Mixed': cell.font = MIX_FONT
```
Sentiment Coloring Application Points
Apply conditional font coloring at these locations:
Sheet 1 → Key Themes section, column B (Sentiment)
Sheet 1 → Sentiment Over Time section, column C (Positive = green), column D (Negative = red)
Sheet 2 → Column D (Sentiment) in every review row
Sheet 3 → Column C (Sentiment) in every review row
---
DATA REQUIREMENTS PER SHEET
Sheet 1 (Review Summary)
Platform list: `[{name, avg_rating, review_count, notes_summary}]`
Theme list: `[{name, sentiment, frequency_pct, confidence_level}]`
Quarterly sentiment: `[{period, total_reviews, positive_count, negative_count}]`
(Optional) Competitor comparison: `[{metric_name, company_val, comp1_val, comp2_val}]`
Sheet 2 (Third-Party Reviews)
Per review: `{platform, reviewer_name, star_rating, sentiment, full_text, date, source_url}`
Grouped by platform, ordered by platform review count descending
Sheet 3 (Employee Reviews)
Per review: `{platform, reviewer_name, sentiment, rating_fraction, full_text, date, source_url}`
Grouped by platform (typically Glassdoor then Indeed)
Sheet 4 (Competitive Benchmarking)
2-3 comparison tables: `[{metric_name, company_value, comp1_value, comp2_value, comp3_value, notes}]`
Each table has a section title describing the comparison category
Sheet 5 (Competitor Deep Dives)
Per competitor: `{section_header_with_key_metrics}`
Per quote: `{reviewer, platform, rating, theme_tag, quote_excerpt, date}`
4-8 quotes per competitor
---
QUALITY CHECKLIST
Before delivering:
[ ] All 5 sheets present with correct tab names
[ ] Sheet 1 has all sections: Ratings, Themes, Sentiment Over Time, (optional Competitor Comparison)
[ ] All merged cells span the correct column range for their sheet
[ ] Title rows (row 1) use DARK_BLUE fill (#1F3864) with white bold text
[ ] Section headers use MED_BLUE fill (#2F5496) with white bold text
[ ] Column headers use LIGHT_BLUE fill (#D6E4F0) with bold text
[ ] Sentiment values are color-coded everywhere: red (#CC0000) / green (#006600) / orange (#CC6600)
[ ] All review text cells (col E on sheets 2/3, col F on sheet 5) have wrap_text=True
[ ] Column widths are set per the specifications above for each sheet
[ ] No empty platform sections (if a platform has 0 reviews, omit it from sheets 2/3)
[ ] Review numbering (#) resets to 1 within each platform group
[ ] Source URLs are populated for all reviews where available
[ ] Competitor deep dive quotes are 1-3 sentences (not full-length reviews)
[ ] Total review count in sheet titles matches the actual number of data rows
[ ] {Prepared By} appears in Sheet 1 subtitle and Sheet 4 subtitle
[ ] {Company Name} appears in Sheet 1 title and Sheet 4 title
[ ] No hardcoded company or consulting firm names anywhere — all use variables