---
name: cx-intel-report-pdf
description: "Generate a McKinsey-caliber Consumer Experience Intelligence Report as a professionally designed PDF using reportlab. Trigger on: 'generate CX report', 'consumer intelligence report', 'review analysis PDF', 'customer experience report', 'create the intel report', 'generate the PDF report', or when review data (scraped reviews, XLSX companion file) is available and a branded PDF deliverable is needed. Covers 12 sections: executive summary, methodology, quantitative analysis, thematic analysis, critical findings, employee sentiment, competitive benchmarking, competitor deep dives, AI opportunity matrix, perception gap, strategic recommendations, and conclusion."
---

# Consumer Intelligence PDF Report Generator — Generic Template

## SYSTEM PROMPT

You are a report generation engine. You produce McKinsey-caliber Consumer Experience Intelligence Reports as professionally designed PDFs using Python's `reportlab` library. The report can be white-labeled for any consulting firm or delivered unbranded.

---

## INPUTS REQUIRED

Before generating, collect or confirm:

1. **Company Name**: Full legal name of the company being analyzed (e.g., "Acme Corporation, Inc.")
2. **Company Logo**: PNG file path (transparent background preferred; if black/solid background, auto-remove using PIL — threshold R,G,B < 30 → alpha=0)
3. **Prepared By**: Name of the consulting firm or team producing the report (used in cover page, footers, and sign-off)
4. **Report Date**: Date of report delivery
5. **Data Period**: Date range of review data (e.g., "August 2022 - March 2026")
6. **Review Data Source**: Path to the companion XLSX file OR raw review data
7. **Total Reviews Analyzed**: Integer count of reviews in the dataset
8. **Total Market Reviews**: Estimated total reviews available across all platforms (e.g., "96,131+")
9. **Platforms Scraped**: List of independent review platforms with review counts per platform
10. **Focus Area** (optional): If the report has a specific lens (e.g., "Foreign Language Support", "Billing Disputes", "Mobile App Experience"). If none, default to general Consumer Experience.
11. **Competitor Names**: 2-4 direct competitors to benchmark against
12. **Industry**: Company's industry for context-appropriate analysis

---

## REPORT STRUCTURE (12 Sections)

Every report follows this exact structure. Each section is mandatory.

### Cover Page (Full-bleed dark background)
- **Background**: Full page fill with DARK_NAVY (#1A1F3D)
- **Top accent**: 6px line in ACCENT_BLUE (#3B7DD8) across full width
- **Spaced letter header**: "{PREPARED_BY} — C O N S U M E R  I N T E L L I G E N C E" in #B8BCD0, 8pt, centered
- **Company logo**: Centered, 220x220px max, transparent background (no container/box around the logo — it must float directly on the dark background)
- **Title**: Report focus in white, 32pt bold, centered
- **Subtitle**: "Consumer Experience Intelligence Report" in white, 22pt bold, centered
- **Accent divider**: 40% width horizontal rule in ACCENT_BLUE, centered
- **Tagline**: "Multi-Platform Review Analysis & Strategic Assessment" in #B8BCD0, 12pt, centered
- **Meta block** (all centered, 9pt, #8890A8):
  - Prepared by: {Prepared By}
  - Prepared Exclusively for: {Company Name}
  - Date: {Report Date}
  - Data Period: {Data Period}
  - Sources: {N} Independent Review Platforms
  - Focus: {Focus Area} (if applicable)
- **Confidential marker**: "C O N F I D E N T I A L" in spaced letters, 10pt bold, #6B7280, centered

### Section 01: Executive Summary
- **Section number**: "01" in 36pt bold ACCENT_BLUE
- **Section title**: "Executive Summary" in 20pt bold DARK_NAVY
- **Accent underline**: Full-width 2px rule in ACCENT_BLUE
- **Stat cards row**: 4 cards in a single-row table, each with:
  - Left border accent (4px colored)
  - Large number (22pt bold, accent color)
  - Label below (9pt, #6B7280)
  - Cards: [Reviews Analyzed, Platforms Scraped, Key Metric 1, Key Metric 2]
- **KEY FINDING callout** (red): Primary critical finding in 1-2 sentences
- **INSIGHT callout** (amber): Strategic insight about perception gap or hidden pattern
- **Summary paragraph**: 3-5 sentences covering top 3 themes, methodology overview, and AI automation thesis

### Section 02: Methodology
- Subsections: 2.1 Data Collection, 2.2 Data Quality & Deduplication, 2.3 AI Analysis Engine, 2.4 Validation Pipeline, 2.5 Platform Breakdown, 2.6 Analytical Framework, 2.7 Platform Classification
- **Platform Breakdown table**: Columns = [Platform, Reviews Analyzed, Total Available, Review Type]
  - Header row: MEDIUM_BLUE background, white text
  - Alternating row shading: white / #F5F6FA
  - Final "TOTAL" row: bold, light blue background
- **Methodology Note callout** (amber): Disclaimer about independent vs curated platforms

### Section 03: Quantitative Analysis
- **3.1 Average Rating by Platform**: Table with [Platform, Avg Rating, Reviews, Notes]
  - Include note: "Dashed threshold at 3.0 represents industry neutral"
- **3.2 Star Rating Distribution**: Table or description of 1-5 star percentage breakdown
  - Note bimodal distribution if present (high 1-star AND high 5-star)
- **3.3 Sentiment Distribution**: Table with [Sentiment, Count, Percentage] for Positive/Mixed/Negative
  - Include data integrity note explaining any discrepancies between star ratings and sentiment %
- **3.4 Sentiment Over Time** (if data available): Quarterly breakdown table with [Period, Reviews, Positive, Negative, Neg%]
  - Note trend direction (Improving/Declining/Stable)

### Section 04: Thematic Analysis
- **4.1 Issue Frequency**: Table with columns:
  - [Theme, Frequency %, Severity (CRITICAL/HIGH/MEDIUM/LOW/OPPORTUNITY), Confidence (HIGH/MEDIUM/LOW with n=X), Automation Potential (HIGH/MEDIUM/LOW)]
  - Sort by frequency descending
  - 6-10 themes typical
- **Automation Opportunity callout** (green): Count of HIGH automation themes and summary

### Section 05: Deep Dive — Critical Findings
- One subsection per CRITICAL or HIGH severity theme (typically 4-6 subsections)
- Each subsection contains:
  - **Subsection header**: "5.X: {Theme Name}" in bold
  - **Description paragraph**: 2-4 sentences explaining the pattern
  - **Callout box**: CRITICAL PATTERN (red) or WARNING (amber) with summary of systemic nature
  - **2-3 Quote blocks**: Direct customer quotes with attribution
    - Style: Left accent border in ACCENT_BLUE, #F5F6FA background
    - Quote in 9.5pt italic
    - Attribution in 8pt #6B7280 with em-dash prefix

### Section 06: Internal Signal — Employee Sentiment
- **Glassdoor/Indeed rating display**: Average ratings from employee platforms
- **Employee Signal callout** (amber): Summary of how employee experience connects to customer experience
- **3-4 Employee quote blocks**: Same styling as Section 05 quotes
- **Analysis paragraph**: Connect employee pain points to customer-facing failures

### Section 07: Competitive Context & Benchmarking
- **Stat cards row**: [Competitors Analyzed, Key Metric Range, Universal Pain Points, Key Differentiator]
- **Platform-by-Platform Ratings Comparison table**: Columns = [Platform, {Company}, {Competitor 1}, {Competitor 2}, {Competitor 3}, Notes]
- **Portfolio/Scale Comparison table**: Industry-relevant metrics (e.g., locations, customers, revenue, awards)
- **Switching Signals**: Count of reviews mentioning intent to leave, competitor mentions
- **Competitive Threat Summary**: Brief paragraph per competitor with threat level

### Section 08: Competitor Deep Dives
- One subsection per competitor (typically 3)
- Each contains:
  - **Header**: "{Competitor} — Key Metric | Rating | Neg Sentiment %"
  - **Overview paragraph**: 2-3 sentences on competitor positioning
  - **2-3 quote blocks**: Competitor customer quotes from independent platforms
  - **Top Complaint Themes**: Brief theme breakdown with percentages

### Section 09: AI Opportunity Matrix
- **Cross-competitor matrix table**: Columns = [Pain Point, {Company}, {Comp1}, {Comp2}, {Comp3}, AI Opportunity]
  - "X" marks where pain point is documented in reviews
  - AI Opportunity column describes specific solution
- **Automation Opportunity callout** (green): Summary of addressable surface area

### Section 10: The Perception Gap
- **Stat cards**: Curated platform rating vs Independent platform rating
  - Show the numerical gap (e.g., "2.6-star gap")
- **Perception Gap callout** (red): Explanation of how managed reputation channels may mask real frustration
- **Strategic implications paragraph**: How this affects internal decision-making

### Section 11: Strategic Recommendations
- **6-8 recommendations**, each as a structured table with rows:
  - [PROBLEM, SOLUTION, EXPECTED IMPACT, AI SOLUTION]
  - Left column: Label in MEDIUM_BLUE bold, #F5F6FA background
  - Right column: Description text
- **Implementation Priority Matrix table**:
  - Grouped into: QUICK WINS (0-6 months), NEAR-TERM (6-12 months), STRATEGIC (12-24 months)
  - Section banners in #DBEAFE with MEDIUM_BLUE text
  - Columns: [Recommendation, Timeframe, Primary Metric]
- **Projected Impact callout** (green): Quantified summary of expected improvements

### Section 12: Conclusion
- **Summary paragraph**: 2-3 sentences restating the core finding
- **Transformation Summary table**: [Dimension, Current State, With AI Automation]
  - 6-10 rows showing before/after metrics
  - Header row: DARK_NAVY background
- **THE PATH FORWARD callout** (green): Urgency statement and call to action
- **Sign-off block** (centered):
  - "{Prepared By}" in 11pt bold DARK_NAVY
  - "{Report Date} | CONFIDENTIAL" in 9pt #6B7280
  - Distribution disclaimer in 8pt italic #6B7280

---

## DESIGN SYSTEM

### Color Palette
```
DARK_NAVY     = #1A1F3D   (cover background, primary headers)
MEDIUM_BLUE   = #2F5496   (section headers, table headers, labels)
ACCENT_BLUE   = #3B7DD8   (accent lines, stat card borders, quote borders)
LIGHT_BG      = #F5F6FA   (quote backgrounds, alternating rows)
LIGHT_BLUE_BG = #E8EFF8   (total rows, highlighted cells)
CARD_BORDER   = #D6E4F0   (table borders, card outlines)
TEXT_DARK      = #1A1A2E   (body text)
TEXT_MUTED     = #6B7280   (captions, footnotes, labels)
CRITICAL_RED   = #DC2626   (critical callouts)
WARNING_AMBER  = #F59E0B   (warning callouts)
OPPORTUNITY_GREEN = #10B981 (opportunity callouts)
```

### Callout Box Backgrounds
```
Red callout:    bg=#FEF2F2, left-border=#DC2626
Amber callout:  bg=#FFFBEB, left-border=#F59E0B
Green callout:  bg=#F0FDF4, left-border=#10B981
```

### Typography
- **Font**: Helvetica family (built into reportlab)
  - Helvetica-Bold for headers, labels, stats
  - Helvetica for body text
  - Helvetica-Oblique for quotes, captions
- **Sizes**:
  - Section numbers: 36pt bold
  - Section titles: 20pt bold
  - Subheaders: 12pt bold
  - Body text: 10pt, 15pt leading, justified
  - Table text: 8.5-9pt
  - Captions: 8pt italic
  - Callout title: 9pt bold
  - Callout body: 9pt
  - Quote text: 9.5pt italic
  - Quote attribution: 8pt
  - Footer: 7pt

### Page Layout
- **Page size**: US Letter (612 x 792 points)
- **Margins**: 54pt left/right, 60pt top/bottom
- **Usable width**: 504pt (W - 108)
- **Header**: 3px ACCENT_BLUE line at very top of page
- **Footer**: "{Company Name} {Report Title} | CONFIDENTIAL" left-aligned, "{Prepared By}" right-aligned, page number centered, 0.5pt hairline rule above at y=42

### Table Styling Rules
- Header row: MEDIUM_BLUE background, white bold text, centered
- Data rows: Alternating white / #F5F6FA
- Total/summary rows: bold, #E8EFF8 background
- Grid lines: 0.5pt #D6E4F0
- Cell padding: top=6pt, bottom=6pt
- Use `roundRect` with radius=4 for callout boxes

### Stat Card Specifications
- White background with CARD_BORDER stroke, roundRect radius=6
- Left accent border: 4px colored strip (roundRect radius=2)
- Number: 22pt bold in accent color, positioned at card_height - 32
- Label: 9pt in TEXT_MUTED, auto-wrap if exceeds card width - 20
- Overall dimensions: width=120, height=70
- Arranged 4-across in a single table row with equal column widths

### Quote Block Specifications
- Left accent border: 3px roundRect in ACCENT_BLUE
- Background: #F5F6FA roundRect radius=4
- Quote: Helvetica-Oblique, 9.5pt, TEXT_DARK, manually word-wrapped at (box_width - 28) pixels
- Attribution: "— {Name}, {Platform}, {Date}" in Helvetica 8pt, TEXT_MUTED
- Height: auto-calculated based on line count (max(40, 10 + lines*13 + 18))

---

## IMPLEMENTATION NOTES (reportlab)

### Custom Flowables Required

```python
class StatCard(Flowable):
    """Big number stat card with colored left accent border"""
    # Params: number, label, width=120, height=70, accent=ACCENT_BLUE
    # Draw: white roundRect, colored left strip, number text, label text (auto-wrap)

class CalloutBox(Flowable):
    """Highlighted callout box with colored left border and tinted background"""
    # Params: title, text, width=usable_w, accent=CRITICAL_RED
    # Background: red→#FEF2F2, amber→#FFFBEB, green→#F0FDF4
    # Draw: tinted roundRect, colored left strip, title in accent color, body in TEXT_DARK
    # Height: auto-calculated from text length (lines = len(text)//70 + 2)

class QuoteBlock(Flowable):
    """Styled review quote with attribution"""
    # Params: quote, attribution, width=440
    # Draw: #F5F6FA roundRect, ACCENT_BLUE left strip, italic quote, muted attribution
    # Height: auto-calculated from quote length
```

### Page Templates

```python
def cover_page(canvas_obj, doc):
    """Full dark navy background with top accent line"""
    canvas_obj.saveState()
    canvas_obj.setFillColor(DARK_NAVY)
    canvas_obj.rect(0, 0, W, H, fill=1, stroke=0)
    canvas_obj.setFillColor(ACCENT_BLUE)
    canvas_obj.rect(0, H - 6, W, 6, fill=1, stroke=0)
    canvas_obj.restoreState()

def normal_page(canvas_obj, doc):
    """Top accent line + footer with confidential notice and page number"""
    canvas_obj.saveState()
    canvas_obj.setFillColor(ACCENT_BLUE)
    canvas_obj.rect(0, H - 3, W, 3, fill=1, stroke=0)
    canvas_obj.setFillColor(TEXT_MUTED)
    canvas_obj.setFont('Helvetica', 7)
    canvas_obj.drawString(54, 28, f'{COMPANY_NAME} {REPORT_TITLE} | CONFIDENTIAL')
    canvas_obj.drawRightString(W - 54, 28, PREPARED_BY)
    canvas_obj.drawCentredString(W/2, 28, str(doc.page))
    canvas_obj.setStrokeColor(CARD_BORDER)
    canvas_obj.setLineWidth(0.5)
    canvas_obj.line(54, 42, W-54, 42)
    canvas_obj.restoreState()
```

### Build Pattern
```python
doc = SimpleDocTemplate(path, pagesize=letter,
    topMargin=60, bottomMargin=60, leftMargin=54, rightMargin=54)
story = []
# ... append all flowables in section order ...
doc.build(story, onFirstPage=cover_page, onLaterPages=normal_page)
```

### Logo Handling (auto-remove solid backgrounds)
```python
from PIL import Image
import numpy as np

img = Image.open(logo_path).convert('RGBA')
data = np.array(img)
r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
black_mask = (r < 30) & (g < 30) & (b < 30)
data[black_mask, 3] = 0  # Make black pixels transparent
Image.fromarray(data).save(transparent_logo_path)
```

---

## DATA FLOW

1. **Input**: Raw review data (from XLSX companion file or scraped data) + company info + competitor list
2. **Analysis**: AI engine processes reviews → themes, sentiment, quotes, competitor mentions
3. **Aggregation**: Calculate platform ratings, sentiment distribution, theme frequencies, perception gap
4. **Report Generation**: Populate all 12 sections with analyzed data
5. **Output**: Single PDF file matching this design system exactly

---

## QUALITY CHECKLIST

Before delivering:
- [ ] Cover page logo displays with transparent background (no black/colored box around it)
- [ ] All 12 sections present in correct order with section numbers
- [ ] All tables have proper header styling (MEDIUM_BLUE bg, white bold text)
- [ ] Alternating row shading (white / #F5F6FA) on all data tables
- [ ] All callout boxes have correct color coding (red=critical, amber=warning, green=opportunity)
- [ ] All quote blocks have ACCENT_BLUE left border and proper "— Name, Platform, Date" attribution
- [ ] Stat cards display in 4-across layout with left accent borders
- [ ] Footer appears on all pages except cover with company name, confidential notice, and page number
- [ ] Page numbers are sequential and correct
- [ ] No orphaned section headers (section number + title + accent line + first content on same page)
- [ ] Competitor comparison tables have consistent column widths across all columns
- [ ] Implementation Priority Matrix has section banners (QUICK WINS / NEAR-TERM / STRATEGIC)
- [ ] Transformation Summary table in conclusion uses DARK_NAVY header background
- [ ] {Prepared By} name appears in footer, cover page, and sign-off block
- [ ] All text content references {Company Name} consistently (no hardcoded company names)