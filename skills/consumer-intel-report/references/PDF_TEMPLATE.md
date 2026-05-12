# PDF Template Reference — Consumer Experience Intelligence Report

This file contains the complete reportlab code template and section-by-section content rules for the 12-section Consumer Experience Intelligence Report. Read this before generating any report.

---

## Table of Contents

1. [Imports & Setup](#imports--setup)
2. [Color Palette & Typography](#color-palette--typography)
3. [Logo Preprocessing](#logo-preprocessing)
4. [Custom Flowables](#custom-flowables) — StatCard, CalloutBox, QuoteBlock
5. [Page Templates](#page-templates) — cover_page, normal_page
6. [Section-by-Section Content Rules](#section-by-section-content-rules)
7. [Build Pattern](#build-pattern)
8. [Quality Checklist](#quality-checklist)

---

## Imports & Setup

```python
import os
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, HRFlowable, Image
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus.flowables import Flowable
from PIL import Image as PILImage
import numpy as np

# Page dimensions
W, H = letter  # 612 x 792 points
MARGIN_LR = 54
MARGIN_TB = 60
USABLE_W = W - 2 * MARGIN_LR  # 504 pt
```

---

## Color Palette & Typography

```python
# ══════════════════════════════════════════════════
# COLORS
# ══════════════════════════════════════════════════
DARK_NAVY         = HexColor("#1A1F3D")  # cover bg, primary headers
MEDIUM_BLUE       = HexColor("#2F5496")  # section headers, table headers
ACCENT_BLUE       = HexColor("#3B7DD8")  # accent lines, stat card borders, quote borders
LIGHT_BG          = HexColor("#F5F6FA")  # quote backgrounds, alternating rows
LIGHT_BLUE_BG     = HexColor("#E8EFF8")  # total rows, highlighted cells
DBEAFE            = HexColor("#DBEAFE")  # section banners in priority matrix
CARD_BORDER       = HexColor("#D6E4F0")  # table borders, card outlines
TEXT_DARK         = HexColor("#1A1A2E")  # body text
TEXT_MUTED        = HexColor("#6B7280")  # captions, footnotes, labels
SUBTLE_GRAY       = HexColor("#8890A8")  # meta block on cover
CARD_LABEL_GRAY   = HexColor("#B8BCD0")  # spaced-letter header on cover
CRITICAL_RED      = HexColor("#DC2626")
WARNING_AMBER     = HexColor("#F59E0B")
OPPORTUNITY_GREEN = HexColor("#10B981")

# Callout backgrounds
RED_BG    = HexColor("#FEF2F2")
AMBER_BG  = HexColor("#FFFBEB")
GREEN_BG  = HexColor("#F0FDF4")

# ══════════════════════════════════════════════════
# TYPOGRAPHY (Helvetica family — built into reportlab)
# ══════════════════════════════════════════════════
styles = getSampleStyleSheet()

# Section header (e.g., "Executive Summary")
section_title = ParagraphStyle('SectionTitle', parent=styles['Normal'],
    fontSize=20, leading=24, textColor=DARK_NAVY, fontName='Helvetica-Bold',
    spaceAfter=4, alignment=TA_LEFT)

# Subsection header (e.g., "3.1 Average Rating by Platform")
subsection = ParagraphStyle('Subsection', parent=styles['Normal'],
    fontSize=12, leading=16, textColor=MEDIUM_BLUE, fontName='Helvetica-Bold',
    spaceBefore=10, spaceAfter=6, alignment=TA_LEFT)

# Body text
body = ParagraphStyle('Body', parent=styles['Normal'],
    fontSize=10, leading=15, textColor=TEXT_DARK, fontName='Helvetica',
    spaceAfter=8, alignment=TA_JUSTIFY)

# Caption / footnote
caption = ParagraphStyle('Caption', parent=styles['Normal'],
    fontSize=8, leading=11, textColor=TEXT_MUTED, fontName='Helvetica-Oblique',
    spaceAfter=4, alignment=TA_LEFT)

# Cover styles
cover_spaced_header = ParagraphStyle('CoverSpacedHeader', parent=styles['Normal'],
    fontSize=8, leading=12, textColor=CARD_LABEL_GRAY, fontName='Helvetica',
    alignment=TA_CENTER)

cover_title_style = ParagraphStyle('CoverTitle', parent=styles['Title'],
    fontSize=32, leading=38, textColor=white, fontName='Helvetica-Bold',
    spaceAfter=4, alignment=TA_CENTER)

cover_subtitle_style = ParagraphStyle('CoverSubtitle', parent=styles['Normal'],
    fontSize=22, leading=26, textColor=white, fontName='Helvetica-Bold',
    spaceAfter=10, alignment=TA_CENTER)

cover_tagline_style = ParagraphStyle('CoverTagline', parent=styles['Normal'],
    fontSize=12, leading=16, textColor=CARD_LABEL_GRAY, fontName='Helvetica',
    spaceAfter=20, alignment=TA_CENTER)

cover_meta_style = ParagraphStyle('CoverMeta', parent=styles['Normal'],
    fontSize=9, leading=14, textColor=SUBTLE_GRAY, fontName='Helvetica',
    alignment=TA_CENTER)

cover_conf_style = ParagraphStyle('CoverConfidential', parent=styles['Normal'],
    fontSize=10, leading=14, textColor=TEXT_MUTED, fontName='Helvetica-Bold',
    alignment=TA_CENTER)
```

---

## Logo Preprocessing

Many client logos arrive as PNGs with solid black or colored backgrounds rather than transparent ones. To make them float cleanly on the dark navy cover, auto-strip the background:

```python
def preprocess_logo(logo_path, out_path, threshold=30):
    """
    Read a logo PNG and make near-black pixels transparent.
    Threshold: pixels where R, G, B all < threshold become alpha=0.
    Adjust threshold up if logo has dark gray elements to preserve;
    adjust down if too-aggressive transparency is bleeding the mark.
    """
    img = PILImage.open(logo_path).convert('RGBA')
    data = np.array(img)
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    mask = (r < threshold) & (g < threshold) & (b < threshold)
    data[mask, 3] = 0
    PILImage.fromarray(data).save(out_path)
    return out_path

# Usage:
clean_logo = preprocess_logo(input_logo_path, '/tmp/clean_logo.png')
```

**If the logo is on a non-black solid color** (e.g., a teal brand background), use the dominant-corner pixel as the key color and mask within a tolerance instead.

**If no logo is available**, fall back to a centered white wordmark on the cover (Helvetica-Bold, 32pt) where the logo would have been. Do NOT invent or generate a logo.

---

## Custom Flowables

### StatCard

Big-number card with colored left accent. Used 4-across in stat-card rows (§01, §07, §10).

```python
class StatCard(Flowable):
    def __init__(self, number, label, width=120, height=70, accent=ACCENT_BLUE):
        Flowable.__init__(self)
        self.number = str(number)
        self.label = label
        self.width = width
        self.height = height
        self.accent = accent

    def wrap(self, *args):
        return self.width, self.height

    def draw(self):
        c = self.canv
        # White card with subtle border
        c.setFillColor(white)
        c.setStrokeColor(CARD_BORDER)
        c.setLineWidth(0.5)
        c.roundRect(0, 0, self.width, self.height, 6, fill=1, stroke=1)
        # Colored left accent strip
        c.setFillColor(self.accent)
        c.setStrokeColor(self.accent)
        c.roundRect(0, 4, 4, self.height - 8, 2, fill=1, stroke=1)
        # Big number
        c.setFillColor(self.accent)
        c.setFont('Helvetica-Bold', 22)
        c.drawString(14, self.height - 32, self.number)
        # Label (auto-wrap if too long)
        c.setFillColor(TEXT_MUTED)
        c.setFont('Helvetica', 9)
        label_max_w = self.width - 20
        # Naive word-wrap
        words = self.label.split()
        lines, cur = [], ''
        for w in words:
            test = (cur + ' ' + w).strip()
            if c.stringWidth(test, 'Helvetica', 9) <= label_max_w:
                cur = test
            else:
                if cur:
                    lines.append(cur)
                cur = w
        if cur:
            lines.append(cur)
        for i, ln in enumerate(lines[:3]):
            c.drawString(14, self.height - 50 - i * 11, ln)
```

### CalloutBox

Highlighted callout with colored left border and tinted background. Used for KEY FINDING, INSIGHT, WARNING, etc.

```python
class CalloutBox(Flowable):
    def __init__(self, title, text, width=USABLE_W, accent=CRITICAL_RED):
        Flowable.__init__(self)
        self.title = title
        self.text = text
        self.width = width
        self.accent = accent
        # Pick the right tinted background
        if accent == CRITICAL_RED:
            self.bg = RED_BG
        elif accent == WARNING_AMBER:
            self.bg = AMBER_BG
        elif accent == OPPORTUNITY_GREEN:
            self.bg = GREEN_BG
        else:
            self.bg = LIGHT_BG
        # Auto-calculate height from text length (rough)
        text_w = self.width - 30
        # Approximate chars-per-line at 9pt Helvetica
        chars_per_line = int(text_w / 4.8)
        lines = max(2, len(self.text) // chars_per_line + self.text.count('\n') + 2)
        self.height = 22 + lines * 12 + 6

    def wrap(self, *args):
        return self.width, self.height

    def draw(self):
        c = self.canv
        # Tinted background
        c.setFillColor(self.bg)
        c.setStrokeColor(self.bg)
        c.roundRect(0, 0, self.width, self.height, 4, fill=1, stroke=1)
        # Colored left strip
        c.setFillColor(self.accent)
        c.setStrokeColor(self.accent)
        c.roundRect(0, 4, 4, self.height - 8, 2, fill=1, stroke=1)
        # Title in accent color
        c.setFillColor(self.accent)
        c.setFont('Helvetica-Bold', 9)
        c.drawString(14, self.height - 16, self.title.upper())
        # Body text in TEXT_DARK — manual wrap
        c.setFillColor(TEXT_DARK)
        c.setFont('Helvetica', 9)
        text_w = self.width - 28
        words = self.text.split()
        lines, cur = [], ''
        for w in words:
            test = (cur + ' ' + w).strip()
            if c.stringWidth(test, 'Helvetica', 9) <= text_w:
                cur = test
            else:
                if cur:
                    lines.append(cur)
                cur = w
        if cur:
            lines.append(cur)
        for i, ln in enumerate(lines):
            c.drawString(14, self.height - 30 - i * 12, ln)
```

### QuoteBlock

Styled customer/employee review quote with attribution. Used in §05, §06, §08.

```python
class QuoteBlock(Flowable):
    def __init__(self, quote, attribution, width=440):
        Flowable.__init__(self)
        self.quote = quote
        self.attribution = attribution
        self.width = width
        # Calculate height
        text_w = self.width - 28
        chars_per_line = int(text_w / 4.6)
        lines = max(2, len(self.quote) // chars_per_line + 1)
        self.height = max(40, 10 + lines * 13 + 18)
        self.line_count = lines

    def wrap(self, *args):
        return self.width, self.height

    def draw(self):
        c = self.canv
        # Light background
        c.setFillColor(LIGHT_BG)
        c.setStrokeColor(LIGHT_BG)
        c.roundRect(0, 0, self.width, self.height, 4, fill=1, stroke=1)
        # Accent left strip
        c.setFillColor(ACCENT_BLUE)
        c.setStrokeColor(ACCENT_BLUE)
        c.roundRect(0, 4, 3, self.height - 8, 1.5, fill=1, stroke=1)
        # Quote text (italic)
        c.setFillColor(TEXT_DARK)
        c.setFont('Helvetica-Oblique', 9.5)
        text_w = self.width - 28
        words = self.quote.split()
        lines, cur = [], ''
        for w in words:
            test = (cur + ' ' + w).strip()
            if c.stringWidth(test, 'Helvetica-Oblique', 9.5) <= text_w:
                cur = test
            else:
                if cur:
                    lines.append(cur)
                cur = w
        if cur:
            lines.append(cur)
        for i, ln in enumerate(lines):
            c.drawString(14, self.height - 16 - i * 13, ln)
        # Attribution
        c.setFillColor(TEXT_MUTED)
        c.setFont('Helvetica', 8)
        c.drawString(14, 8, f'— {self.attribution}')
```

---

## Page Templates

```python
# Globals set at module level so page templates can read them
COMPANY_NAME = "Acme Corporation"      # injected by build script
PREPARED_BY  = "Anyreach"              # injected by build script
REPORT_TITLE = "Consumer Intelligence Report"  # injected by build script

def cover_page(canvas_obj, doc):
    """Full-bleed dark navy cover with top accent line."""
    canvas_obj.saveState()
    # Full background fill
    canvas_obj.setFillColor(DARK_NAVY)
    canvas_obj.rect(0, 0, W, H, fill=1, stroke=0)
    # Top accent line
    canvas_obj.setFillColor(ACCENT_BLUE)
    canvas_obj.rect(0, H - 6, W, 6, fill=1, stroke=0)
    canvas_obj.restoreState()

def normal_page(canvas_obj, doc):
    """Internal pages: thin top accent, footer with confidential notice + page number."""
    canvas_obj.saveState()
    # Top accent
    canvas_obj.setFillColor(ACCENT_BLUE)
    canvas_obj.rect(0, H - 3, W, 3, fill=1, stroke=0)
    # Footer text
    canvas_obj.setFillColor(TEXT_MUTED)
    canvas_obj.setFont('Helvetica', 7)
    canvas_obj.drawString(54, 28, f'{COMPANY_NAME} {REPORT_TITLE} | CONFIDENTIAL')
    canvas_obj.drawRightString(W - 54, 28, PREPARED_BY)
    canvas_obj.drawCentredString(W / 2, 28, str(doc.page))
    # Hairline divider above footer
    canvas_obj.setStrokeColor(CARD_BORDER)
    canvas_obj.setLineWidth(0.5)
    canvas_obj.line(54, 42, W - 54, 42)
    canvas_obj.restoreState()
```

---

## Section-by-Section Content Rules

### Cover Page

- Background: full DARK_NAVY rect via `cover_page` template
- Top: 6px ACCENT_BLUE accent line (handled by template)
- Spaced-letter header: `f"{PREPARED_BY} — C O N S U M E R  I N T E L L I G E N C E"` in `cover_spaced_header` style, ~120pt from top
- Logo: centered, max 220×220, transparent bg — **must float directly on dark navy with no container or box around it**
- Title: report focus area in `cover_title_style` (white, 32pt bold, centered)
- Subtitle: "Consumer Experience Intelligence Report" in `cover_subtitle_style` (white, 22pt bold)
- Accent divider: 40%-width horizontal rule in ACCENT_BLUE, centered (use `HRFlowable(width="40%", color=ACCENT_BLUE, thickness=1.5, hAlign='CENTER')`)
- Tagline: "Multi-Platform Review Analysis & Strategic Assessment" in `cover_tagline_style`
- Meta block (all in `cover_meta_style`):
  - `Prepared by: {PREPARED_BY}`
  - `Prepared Exclusively for: {COMPANY_NAME}`
  - `Date: {REPORT_DATE}`
  - `Data Period: {DATA_PERIOD}`
  - `Sources: {N} Independent Review Platforms`
  - `Focus: {FOCUS_AREA}` (if applicable)
- Confidential marker: `"C O N F I D E N T I A L"` in `cover_conf_style`, near bottom

### Section 01 — Executive Summary

- Section number "01" in 36pt bold ACCENT_BLUE
- Section title "Executive Summary" in `section_title`
- Accent underline: `HRFlowable(width=USABLE_W, color=ACCENT_BLUE, thickness=2)`
- **4 StatCards in single row** (build as a 4-column Table):
  - [Reviews Analyzed, Platforms Scraped, Key Metric 1, Key Metric 2]
  - Common Key Metrics: Average Rating Across Independent Platforms, % Negative Sentiment, Bimodal Indicator
- **CalloutBox(title="KEY FINDING", text=..., accent=CRITICAL_RED)** — primary critical finding in 1-2 sentences
- **CalloutBox(title="INSIGHT", text=..., accent=WARNING_AMBER)** — strategic insight about perception gap or hidden pattern
- Summary paragraph: 3-5 sentences covering top 3 themes, methodology overview, and AI automation thesis

### Section 02 — Methodology

Subsections:
- **2.1 Data Collection** — How review data was gathered, which platforms, scraping cadence
- **2.2 Data Quality & Deduplication** — Cross-platform dedup, language detection, spam filtering
- **2.3 AI Analysis Engine** — Sentiment scoring, theme extraction model
- **2.4 Validation Pipeline** — Manual spot-checks, inter-rater reliability if applicable
- **2.5 Platform Breakdown** — The table below
- **2.6 Analytical Framework** — How themes are scored on severity / confidence / automation potential
- **2.7 Platform Classification** — Curated vs Independent definitions (drives §10)

**Platform Breakdown table:**
| Platform | Reviews Analyzed | Total Available | Review Type |
|---|---|---|---|
| Trustpilot | 8,432 | 12,500 | Curated |
| BBB | 1,205 | 1,205 | Curated |
| Reddit | 3,890 | ~5,000 | Independent |
| ... | | | |
| **TOTAL** | **{sum}** | **{sum}+** | |

- Header row: MEDIUM_BLUE bg, white bold text
- Alternating rows: white / LIGHT_BG
- TOTAL row: bold, LIGHT_BLUE_BG
- **CalloutBox(title="METHODOLOGY NOTE", accent=WARNING_AMBER)** — Disclaimer that curated platforms allow vendor responses/curation while independent platforms are unmoderated

### Section 03 — Quantitative Analysis

- **3.1 Average Rating by Platform** — Table `[Platform, Avg Rating, Reviews, Notes]`, add caption "Dashed threshold at 3.0 represents industry neutral"
- **3.2 Star Rating Distribution** — Table or description of 1-5 star %; **explicitly flag bimodal distribution** (high 1-star AND high 5-star) if present — this is a signature finding
- **3.3 Sentiment Distribution** — Table `[Sentiment, Count, %]` for Positive / Mixed / Negative; **include data-integrity note** if star ratings and AI sentiment % disagree (e.g., 4-star avg but 60% negative sentiment → reviewers giving stars on different dimensions than they're describing)
- **3.4 Sentiment Over Time** — Quarterly table `[Period, Reviews, Positive, Negative, Neg%]`, note trend (Improving / Declining / Stable)

### Section 04 — Thematic Analysis

**Issue Frequency table** with columns:
`[Theme, Frequency %, Severity, Confidence, Automation Potential]`

- Severity values: CRITICAL / HIGH / MEDIUM / LOW / OPPORTUNITY
- Confidence: HIGH / MEDIUM / LOW with `(n=X)` suffix
- Automation: HIGH / MEDIUM / LOW
- Sort by frequency descending, 6-10 themes typical
- Color-code severity cells: CRITICAL=red text, HIGH=amber, OPPORTUNITY=green

**CalloutBox(title="AUTOMATION OPPORTUNITY", accent=OPPORTUNITY_GREEN)** — Count of themes with HIGH automation potential and 1-sentence summary of addressable surface

### Section 05 — Deep Dive: Critical Findings

One subsection per CRITICAL or HIGH theme (4-6 subsections typical). Each:

- Subsection header: `"5.X: {Theme Name}"` using `subsection` style
- Description paragraph: 2-4 sentences in `body` style explaining the pattern, what triggers it, who's most affected
- **CalloutBox** — CRITICAL PATTERN (red) or WARNING (amber) summarizing systemic nature
- **2-3 QuoteBlocks** — direct customer quotes illustrating the issue, with `— {Name}, {Platform}, {Date}` attribution

Quote selection rules: pick quotes that show pattern, not extremes. A single rage-quote is less powerful than three calm reports of the same friction.

### Section 06 — Internal Signal: Employee Sentiment

- Display Glassdoor/Indeed average ratings as text or compact stat row
- **CalloutBox(title="EMPLOYEE SIGNAL", accent=WARNING_AMBER)** — How employee experience connects to customer experience
- 3-4 employee QuoteBlocks (attribution: role, platform, date — names usually masked as "Customer Service Rep", "Former Manager", etc.)
- Analysis paragraph: tie employee pain points to customer-facing failures (e.g., understaffing → hold times → 1-star reviews)

If no employee data is available, replace this section with a one-paragraph "Employee Signal Not Available" note and move on. Do NOT pad.

### Section 07 — Competitive Context & Benchmarking

- **4-StatCard row**: `[Competitors Analyzed, Key Metric Range, Universal Pain Points, Key Differentiator]`
- **Platform-by-Platform Ratings Comparison table** — columns: `[Platform, {Company}, {Comp1}, {Comp2}, {Comp3}, Notes]`
- **Portfolio/Scale Comparison table** — industry-appropriate metrics: locations, customers, revenue, awards, headcount
- **Switching Signals** — count of reviews mentioning intent to leave, competitor mentions; display as a small inline stat
- **Competitive Threat Summary** — brief paragraph per competitor with threat level (HIGH / MEDIUM / LOW)

### Section 08 — Competitor Deep Dives

One subsection per competitor (typically 3):

- Header: `"{Competitor} — {Key Metric} | {Rating} | {Neg Sentiment %}"`
- Overview paragraph: 2-3 sentences on competitor positioning
- 2-3 QuoteBlocks from that competitor's customers on independent platforms
- "Top Complaint Themes" — brief theme list with percentages

### Section 09 — AI Opportunity Matrix

Cross-competitor pain-point matrix:

| Pain Point | {Company} | {Comp1} | {Comp2} | {Comp3} | AI Opportunity |
|---|---|---|---|---|---|
| Long hold times | X | X | X | X | 24/7 voice agent with intelligent routing |
| Inconsistent staff knowledge | X | X | | X | Agent assist with retrieval-augmented answers |
| ... | | | | | |

- "X" marks where the pain point is documented in reviews
- AI Opportunity column describes specific solution

**CalloutBox(title="AUTOMATION OPPORTUNITY", accent=OPPORTUNITY_GREEN)** — Summary of addressable surface area across competitors

### Section 10 — The Perception Gap

- **2-StatCard row**: `[Curated Platform Rating, Independent Platform Rating]` — show the numerical gap (e.g., "2.6-star gap") as a third visual element or in the callout
- **CalloutBox(title="PERCEPTION GAP", accent=CRITICAL_RED)** — Explanation that managed reputation channels mask frustration documented on independent forums
- Strategic implications paragraph: how this affects internal decision-making, board reporting, and root-cause prioritization

### Section 11 — Strategic Recommendations

**6-8 recommendation tables**, each structured:

| | |
|---|---|
| **PROBLEM** | Concrete description of the issue |
| **SOLUTION** | What to deploy |
| **EXPECTED IMPACT** | Quantified expected lift |
| **AI SOLUTION** | Specific AI/automation component |

- Left column: bold in MEDIUM_BLUE, LIGHT_BG background
- Right column: description text in TEXT_DARK

**Implementation Priority Matrix table:**

Grouped into three time horizons with section banners (DBEAFE bg, MEDIUM_BLUE text spanning all columns):
- **QUICK WINS (0-6 months)**
- **NEAR-TERM (6-12 months)**
- **STRATEGIC (12-24 months)**

Columns within each section: `[Recommendation, Timeframe, Primary Metric]`

**CalloutBox(title="PROJECTED IMPACT", accent=OPPORTUNITY_GREEN)** — Quantified summary of expected improvements if recommendations are executed

### Section 12 — Conclusion

- Summary paragraph: 2-3 sentences restating the core finding and bridging to the path forward
- **Transformation Summary table** — `[Dimension, Current State, With AI Automation]`
  - 6-10 rows showing before/after on key metrics: hold time, FCR, CSAT, hours of operation, language coverage, cost per contact, etc.
  - Header row: DARK_NAVY bg, white bold text
- **CalloutBox(title="THE PATH FORWARD", accent=OPPORTUNITY_GREEN)** — Urgency statement and call to action
- **Sign-off block** (centered):
  - `{PREPARED_BY}` in 11pt bold DARK_NAVY
  - `{REPORT_DATE} | CONFIDENTIAL` in 9pt TEXT_MUTED
  - Distribution disclaimer in 8pt italic TEXT_MUTED (e.g., "This document is intended exclusively for {COMPANY_NAME}. Distribution outside the recipient organization is prohibited.")

---

## Build Pattern

```python
def build_report(
    company_name,
    logo_path,
    prepared_by,
    report_date,
    data_period,
    total_reviews,
    total_market_reviews,
    platforms,            # list of (name, count, type)
    focus_area,           # or None
    competitors,          # list of names
    industry,
    analysis,             # dict of analyzed content (themes, quotes, etc.)
    out_path
):
    # Set module-level globals for page templates
    global COMPANY_NAME, PREPARED_BY, REPORT_TITLE
    COMPANY_NAME = company_name
    PREPARED_BY = prepared_by
    REPORT_TITLE = f"{focus_area} Report" if focus_area else "Consumer Intelligence Report"

    # Preprocess logo
    clean_logo = preprocess_logo(logo_path, '/tmp/clean_logo.png')

    doc = SimpleDocTemplate(
        out_path, pagesize=letter,
        topMargin=MARGIN_TB, bottomMargin=MARGIN_TB,
        leftMargin=MARGIN_LR, rightMargin=MARGIN_LR
    )
    story = []

    # ===== COVER =====
    story.append(Spacer(1, 60))
    story.append(Paragraph(
        f"{prepared_by.upper()} &mdash; C O N S U M E R  I N T E L L I G E N C E",
        cover_spaced_header
    ))
    story.append(Spacer(1, 80))
    # Logo — floats on dark bg, no wrapper
    logo_img = Image(clean_logo, width=160, height=160, hAlign='CENTER')
    story.append(logo_img)
    story.append(Spacer(1, 30))
    story.append(Paragraph(focus_area or "Consumer Experience", cover_title_style))
    story.append(Paragraph("Intelligence Report", cover_subtitle_style))
    story.append(HRFlowable(width="40%", color=ACCENT_BLUE, thickness=1.5, hAlign='CENTER'))
    story.append(Spacer(1, 12))
    story.append(Paragraph("Multi-Platform Review Analysis & Strategic Assessment", cover_tagline_style))
    story.append(Spacer(1, 40))
    meta_lines = [
        f"Prepared by: {prepared_by}",
        f"Prepared Exclusively for: {company_name}",
        f"Date: {report_date}",
        f"Data Period: {data_period}",
        f"Sources: {len(platforms)} Independent Review Platforms",
    ]
    if focus_area:
        meta_lines.append(f"Focus: {focus_area}")
    for line in meta_lines:
        story.append(Paragraph(line, cover_meta_style))
    story.append(Spacer(1, 80))
    story.append(Paragraph("C O N F I D E N T I A L", cover_conf_style))

    story.append(PageBreak())

    # ===== SECTION 01: EXECUTIVE SUMMARY =====
    story.append(_section_header("01", "Executive Summary"))
    # 4 stat cards in a row
    stat_row = Table(
        [[
            StatCard(f"{total_reviews:,}", "Reviews Analyzed", accent=ACCENT_BLUE),
            StatCard(str(len(platforms)), "Platforms Scraped", accent=MEDIUM_BLUE),
            StatCard(analysis['avg_rating_independent'], "Avg Rating (Indep.)", accent=CRITICAL_RED),
            StatCard(f"{analysis['neg_sentiment_pct']}%", "Negative Sentiment", accent=WARNING_AMBER),
        ]],
        colWidths=[USABLE_W / 4] * 4
    )
    stat_row.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(stat_row)
    story.append(Spacer(1, 12))
    story.append(CalloutBox("KEY FINDING", analysis['key_finding'], accent=CRITICAL_RED))
    story.append(Spacer(1, 8))
    story.append(CalloutBox("INSIGHT", analysis['insight'], accent=WARNING_AMBER))
    story.append(Spacer(1, 10))
    story.append(Paragraph(analysis['exec_summary_paragraph'], body))

    story.append(PageBreak())

    # ===== SECTIONS 02-12: build similarly =====
    # _build_section_02_methodology(story, analysis)
    # _build_section_03_quantitative(story, analysis)
    # ... etc

    doc.build(story, onFirstPage=cover_page, onLaterPages=normal_page)


def _section_header(num, title):
    """Returns a flowable group: section number + title + accent underline."""
    num_style = ParagraphStyle('SecNum', parent=styles['Normal'],
        fontSize=36, leading=40, textColor=ACCENT_BLUE, fontName='Helvetica-Bold',
        spaceAfter=0)
    return KeepTogether([
        Paragraph(num, num_style),
        Paragraph(title, section_title),
        HRFlowable(width=USABLE_W, color=ACCENT_BLUE, thickness=2, spaceAfter=12),
    ])
```

**Helper for table styling** — most data tables share the same TableStyle:

```python
def standard_table_style(n_rows, n_cols, total_row=False):
    style = [
        # Header row
        ('BACKGROUND', (0,0), (-1,0), MEDIUM_BLUE),
        ('TEXTCOLOR', (0,0), (-1,0), white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 9),
        ('ALIGN', (0,0), (-1,0), 'CENTER'),
        # Body
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 8.5),
        ('TEXTCOLOR', (0,1), (-1,-1), TEXT_DARK),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('GRID', (0,0), (-1,-1), 0.5, CARD_BORDER),
    ]
    # Alternating row shading
    for i in range(1, n_rows):
        if i % 2 == 1:
            style.append(('BACKGROUND', (0,i), (-1,i), LIGHT_BG))
    # Total row
    if total_row:
        style.extend([
            ('BACKGROUND', (0,-1), (-1,-1), LIGHT_BLUE_BG),
            ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
        ])
    return TableStyle(style)
```

---

## Quality Checklist

Before delivering, verify each item:

**Cover page**
- [ ] Logo displays with transparent background — no black/colored box around it
- [ ] Spaced-letter header uses `{PREPARED_BY}` correctly
- [ ] All meta lines populated; no `{...}` placeholders left
- [ ] "C O N F I D E N T I A L" footer present

**Structure**
- [ ] All 12 sections present in correct order with section numbers (01-12)
- [ ] No orphaned section headers — section number + title + accent line stay with first content block (use `KeepTogether`)
- [ ] Page numbers sequential and correct
- [ ] Footer appears on all pages except cover

**Styling**
- [ ] All tables have proper header styling (MEDIUM_BLUE bg, white bold centered text)
- [ ] Alternating row shading (white / LIGHT_BG) on all data tables
- [ ] Total/summary rows bold with LIGHT_BLUE_BG
- [ ] All callout boxes correctly color-coded (red=critical, amber=warning, green=opportunity)
- [ ] All quote blocks have ACCENT_BLUE left border and "— Name, Platform, Date" attribution
- [ ] Stat cards display in 4-across layout with colored left accent borders
- [ ] Implementation Priority Matrix has section banners (QUICK WINS / NEAR-TERM / STRATEGIC) in DBEAFE
- [ ] Transformation Summary table uses DARK_NAVY header bg

**Content integrity**
- [ ] No hardcoded company names — every reference uses `{COMPANY_NAME}`
- [ ] `{PREPARED_BY}` appears on cover, all internal-page footers, and sign-off block
- [ ] Every theme in §04 has a corresponding deep-dive subsection in §05 (for CRITICAL/HIGH)
- [ ] Every CRITICAL/HIGH theme in §04 has 2-3 quotes in §05
- [ ] Every theme in §04 maps to at least one recommendation in §11
- [ ] §10 perception gap math is consistent with §03 platform ratings
- [ ] Quote attributions are plausible (real-looking names, real platforms, dates within the data period)

**Final**
- [ ] PDF opens cleanly without errors
- [ ] No console warnings about flowable overflow or page-break issues
- [ ] File size reasonable (typically 800KB - 2MB)
- [ ] Saved to `/mnt/user-data/outputs/{company_name}_consumer_intelligence_report.pdf`
- [ ] `present_files` called with the output path
