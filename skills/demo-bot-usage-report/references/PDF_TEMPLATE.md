# PDF Template — Demo Bot Usage Report

This file contains the complete reportlab and matplotlib code for generating the PDF. The brand system, custom flowables, chart styling, page layout, and footer are all here.

**Do not** reimplement these from scratch — copy and adapt. The styling has been calibrated against existing AT&T and Access Bank reports.

---

## Setup & dependencies

```bash
pip install pandas matplotlib reportlab pypdfium2 --break-system-packages
```

DejaVu Sans must be available at `/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf` (it ships with Ubuntu by default). This is critical — Helvetica renders Twi (ɛ, ɔ), the naira symbol (₦), and other non-ASCII glyphs as black squares.

---

## Brand colors

```python
from reportlab.lib.colors import HexColor, white

DARK_BG       = HexColor("#161631")  # Deep navy — headers, verdict bars
CARD_BG       = HexColor("#252550")  # Card backgrounds (rare in this report)
INDIGO        = HexColor("#5B5FC7")  # Primary accent — Section 1, key stats
GREEN         = HexColor("#10B981")  # Section 2, positive metrics
CYAN          = HexColor("#06B6D4")  # Tertiary accent
AMBER         = HexColor("#F59E0B")  # Section 4 (NEW: quotes), warnings
PINK          = HexColor("#EC4899")  # Section 3, top bar, attention-grabbing
RED           = HexColor("#EF4444")  # Negative metrics
MUTED         = HexColor("#6B7280")  # Secondary text, captions
LIGHT_BG      = HexColor("#F5F6FA")  # Card backgrounds, alternating rows
DARK_TEXT     = HexColor("#1F2937")  # Primary body text
MID_TEXT      = HexColor("#374151")  # Secondary body text
LIGHT_BORDER  = HexColor("#E5E7EB")  # Borders, grid lines
```

---

## Font registration

Always register DejaVu so Twi, French, naira, and other non-Latin-1 glyphs render correctly:

```python
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

pdfmetrics.registerFont(TTFont('DejaVu', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVu-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
pdfmetrics.registerFontFamily('DejaVu', normal='DejaVu', bold='DejaVu-Bold')
```

Use `'DejaVu'` for any paragraph that may contain non-English text or special symbols (quote text, dialogue boxes, multilingual examples). Use `'Helvetica'` everywhere else (it has slightly better English text rendering at small sizes).

---

## Paragraph styles

```python
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

styles = getSampleStyleSheet()

# Cover styles
cover_title = ParagraphStyle('CoverTitle', parent=styles['Title'],
    fontSize=32, leading=38, textColor=DARK_BG, fontName='Helvetica-Bold',
    spaceAfter=8, alignment=TA_LEFT)

cover_subtitle = ParagraphStyle('CoverSubtitle', parent=styles['Normal'],
    fontSize=14, leading=18, textColor=INDIGO, fontName='Helvetica-Bold',
    spaceAfter=4, alignment=TA_LEFT)

cover_meta = ParagraphStyle('CoverMeta', parent=styles['Normal'],
    fontSize=10, leading=14, textColor=MUTED, fontName='Helvetica',
    spaceAfter=6, alignment=TA_LEFT)

# Section styles
h1_style = ParagraphStyle('H1', parent=styles['Heading1'],
    fontSize=18, leading=22, textColor=DARK_BG, fontName='Helvetica-Bold',
    spaceBefore=18, spaceAfter=8)

h2_style = ParagraphStyle('H2', parent=styles['Heading2'],
    fontSize=13, leading=17, textColor=DARK_BG, fontName='Helvetica-Bold',
    spaceBefore=14, spaceAfter=6)

# Body styles
body_style = ParagraphStyle('Body', parent=styles['Normal'],
    fontSize=10.5, leading=15, textColor=MID_TEXT, fontName='Helvetica',
    spaceAfter=8)

body_intro = ParagraphStyle('BodyIntro', parent=body_style,
    fontName='Helvetica-Bold', fontSize=11, leading=16, textColor=DARK_TEXT,
    spaceAfter=10)

label_style = ParagraphStyle('Label', parent=styles['Normal'],
    fontSize=9, leading=11, textColor=INDIGO, fontName='Helvetica-Bold',
    spaceAfter=4)

# Cell styles
cell_style = ParagraphStyle('CellStyle', parent=styles['Normal'],
    fontSize=9, leading=12, textColor=MID_TEXT, fontName='Helvetica',
    spaceAfter=0, spaceBefore=0)

cell_bold = ParagraphStyle('CellBold', parent=cell_style,
    fontName='Helvetica-Bold', textColor=DARK_TEXT)

cell_header = ParagraphStyle('CellHeader', parent=cell_style,
    fontName='Helvetica-Bold', textColor=white, fontSize=9)

# Dialogue + quote styles (use DejaVu for non-English support)
turn_text = ParagraphStyle('TurnText', parent=styles['Normal'],
    fontSize=9.5, leading=13, textColor=DARK_TEXT, fontName='DejaVu',
    spaceAfter=6, leftIndent=0)

quote_text_style = ParagraphStyle('QuoteText', parent=styles['Normal'],
    fontSize=11.5, leading=15, textColor=DARK_TEXT, fontName='DejaVu-Bold',
    spaceAfter=4)

quote_context_style = ParagraphStyle('QuoteContext', parent=styles['Normal'],
    fontSize=8.5, leading=11, textColor=MUTED, fontName='Helvetica-Oblique',
    spaceAfter=0)

quote_label_style = ParagraphStyle('QuoteLabel', parent=styles['Normal'],
    fontSize=8, leading=10, textColor=AMBER, fontName='Helvetica-Bold',
    spaceAfter=4)

P = Paragraph  # shorthand
```

---

## Custom flowables

```python
from reportlab.platypus.flowables import Flowable

class ColorBar(Flowable):
    """Thin colored horizontal divider under section titles."""
    def __init__(self, color=INDIGO, width=480, height=3):
        super().__init__()
        self.color = color
        self.bar_width, self.bar_height = width, height
        self.width, self.height = width, height
    def draw(self):
        self.canv.setFillColor(self.color)
        self.canv.roundRect(0, 0, self.bar_width, self.bar_height, 1.5, fill=1, stroke=0)


class CoverBar(Flowable):
    """Pink top bar on the cover page that extends past the page edges."""
    def __init__(self, width=612, height=8, color=PINK):
        super().__init__()
        self.color = color
        self.bar_width, self.bar_height = width, height
        self.width, self.height = width, height
    def draw(self):
        self.canv.setFillColor(self.color)
        self.canv.rect(-50, 0, self.bar_width + 100, self.bar_height, fill=1, stroke=0)


class KeyStatBox(Flowable):
    """Colored stat callout — large number + 1-2 line label.
    Use a 2-line label for longer text (e.g., "demo sessions\\ncompleted").
    """
    def __init__(self, stat_value, stat_label, color=INDIGO, width=140, height=70):
        super().__init__()
        self.stat_value = stat_value
        self.stat_label = stat_label
        self.color = color
        self.box_width, self.box_height = width, height
        self.width, self.height = width, height
    def draw(self):
        self.canv.setFillColor(HexColor("#F0F1FF"))
        self.canv.roundRect(0, 0, self.box_width, self.box_height, 6, fill=1, stroke=0)
        self.canv.setFillColor(self.color)
        self.canv.roundRect(0, 0, 4, self.box_height, 2, fill=1, stroke=0)
        self.canv.setFillColor(self.color)
        self.canv.setFont("Helvetica-Bold", 22)
        self.canv.drawString(14, self.box_height - 32, self.stat_value)
        self.canv.setFillColor(MUTED)
        self.canv.setFont("Helvetica", 8.5)
        for i, part in enumerate(self.stat_label.split('\n')):
            self.canv.drawString(14, 22 - i*10, part)


class VerdictBar(Flowable):
    """Full-width colored bar with centered text — used to anchor takeaway sections."""
    def __init__(self, text, color=INDIGO, text_color=white, width=480, height=40):
        super().__init__()
        self.text = text
        self.color = color
        self.text_color = text_color
        self.bar_width, self.bar_height = width, height
        self.width, self.height = width, height
    def draw(self):
        self.canv.setFillColor(self.color)
        self.canv.roundRect(0, 0, self.bar_width, self.bar_height, 4, fill=1, stroke=0)
        self.canv.setFillColor(self.text_color)
        self.canv.setFont("Helvetica-Bold", 11)
        self.canv.drawCentredString(self.bar_width / 2, (self.bar_height - 11) / 2 + 2, self.text)
```

### NEW: QuoteCard flowable for Section 4

```python
from reportlab.platypus import Table, TableStyle

def quote_card(category_label, quote_text, context_line, accent_color=AMBER, width=232):
    """
    A styled card containing a verbatim quote with category label and context.
    Returns a Table flowable suitable for placing in a 2-column grid.
    
    Args:
        category_label: ALL CAPS label like "SPONTANEOUS PRAISE" or "NATIVE-LANGUAGE MOMENT"
        quote_text: The verbatim user quote (may contain non-English text)
        context_line: 1-line italic context line (e.g., "mid-conversation, after plan comparison")
        accent_color: Color for the left border and label
        width: Card width — use ~232 for 2-column layout, ~480 for full-width
    """
    label_style = ParagraphStyle('QL_inner', parent=styles['Normal'],
        fontSize=8, leading=10, textColor=accent_color, fontName='Helvetica-Bold',
        spaceAfter=4)
    quote_style_inner = ParagraphStyle('QT_inner', parent=styles['Normal'],
        fontSize=11, leading=14, textColor=DARK_TEXT, fontName='DejaVu-Bold',
        spaceAfter=4)
    context_style_inner = ParagraphStyle('QC_inner', parent=styles['Normal'],
        fontSize=8.5, leading=11, textColor=MUTED, fontName='Helvetica-Oblique')
    
    rows = [
        [Paragraph(category_label.upper(), label_style)],
        [Paragraph(f'&ldquo;{quote_text}&rdquo;', quote_style_inner)],
        [Paragraph(context_line, context_style_inner)],
    ]
    t = Table(rows, colWidths=[width])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('LINEBEFORE', (0, 0), (0, -1), 3, accent_color),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (0, 0), 10),
        ('BOTTOMPADDING', (0, 0), (0, 0), 2),
        ('TOPPADDING', (0, 1), (-1, 1), 0),
        ('BOTTOMPADDING', (0, 1), (-1, 1), 4),
        ('TOPPADDING', (0, 2), (-1, 2), 0),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 12),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    return t


def quote_grid(quotes, accent_color=AMBER, total_width=480):
    """
    Arrange a list of quotes in a 2-column grid.
    
    Args:
        quotes: list of dicts with 'label', 'text', 'context'
        accent_color: color used for all card borders + labels
        total_width: usable page width
    
    Returns: a single Table flowable containing the grid.
    """
    card_w = (total_width - 12) // 2  # 12pt gutter
    
    # Pair up cards into rows
    grid_rows = []
    for i in range(0, len(quotes), 2):
        left = quote_card(quotes[i]['label'], quotes[i]['text'],
                          quotes[i]['context'], accent_color, card_w)
        if i + 1 < len(quotes):
            right = quote_card(quotes[i+1]['label'], quotes[i+1]['text'],
                              quotes[i+1]['context'], accent_color, card_w)
            grid_rows.append([left, '', right])
        else:
            # Odd number — leave the right column empty
            grid_rows.append([left, '', ''])
    
    grid = Table(grid_rows, colWidths=[card_w, 12, card_w])
    grid.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),  # gutter between rows
    ]))
    return grid
```

### Existing flowable: dialogue example (Section 5)

```python
def dialogue_example(title, accent_color, turns, bot_name='Lily', total_width=480):
    """
    A styled card with an alternating user/bot dialogue.
    
    Args:
        title: e.g., 'Example 1 - native response in Twi'
        accent_color: left-border color
        turns: list of (speaker, text) where speaker is 'user' or 'bot'
        bot_name: the bot's first name (e.g., 'Sophia', 'Lily') for the Bot label
    """
    header = Paragraph(f'<font color="#5B5FC7"><b>{title}</b></font>', cell_bold)
    rows = [[header]]
    for sp, text in turns:
        if sp == 'user':
            content = P(f'<font color="#5B5FC7"><b>User &rarr;</b></font>  {text}', turn_text)
        else:
            content = P(f'<font color="#EC4899"><b>{bot_name} &rarr;</b></font>  {text}', turn_text)
        rows.append([content])
    t = Table(rows, colWidths=[total_width])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), LIGHT_BG),
        ('LINEBEFORE', (0, 0), (0, -1), 3, accent_color),
        ('LEFTPADDING', (0, 0), (-1, -1), 14),
        ('RIGHTPADDING', (0, 0), (-1, -1), 14),
        ('TOPPADDING', (0, 0), (0, 0), 10),
        ('BOTTOMPADDING', (0, 0), (0, 0), 6),
        ('TOPPADDING', (0, 1), (-1, -1), 2),
        ('BOTTOMPADDING', (0, -1), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    return t
```

---

## Footer

```python
from reportlab.lib.units import inch

def make_footer(addressee_short):
    """addressee_short: e.g., 'Startek / LogiCX' or 'Access Bank'"""
    def add_footer(canvas, doc):
        canvas.saveState()
        canvas.setFillColor(MUTED)
        canvas.setFont("Helvetica", 7)
        canvas.drawString(0.7 * inch, 0.4 * inch, f"CONFIDENTIAL  |  Prepared for {addressee_short}")
        canvas.drawRightString(7.8 * inch, 0.4 * inch, "anyreach.ai")
        canvas.drawCentredString(4.25 * inch, 0.4 * inch, f"{doc.page}")
        canvas.setStrokeColor(LIGHT_BORDER)
        canvas.setLineWidth(0.5)
        canvas.line(0.7 * inch, 0.55 * inch, 7.8 * inch, 0.55 * inch)
        canvas.restoreState()
    return add_footer
```

---

## Helper functions

```python
from reportlab.platypus import HRFlowable

def section_divider():
    return HRFlowable(width="100%", thickness=1, color=LIGHT_BORDER,
                      spaceBefore=14, spaceAfter=14)


def stat_row_4(stats_list, total_width=480):
    """Lay out 4 KeyStatBox flowables in a row.
    stats_list: list of (value_str, label, color) tuples, length 4
    """
    n = len(stats_list)
    box_width = (total_width - (n - 1) * 8) // n
    boxes = [KeyStatBox(v, l, c, width=box_width, height=68) for v, l, c in stats_list]
    col_widths = []
    row = []
    for i, b in enumerate(boxes):
        col_widths.append(box_width)
        row.append(b)
        if i < n - 1:
            col_widths.append(8)
            row.append("")
    t = Table([row], colWidths=col_widths, rowHeights=[68])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    return t


def styled_table(headers, rows, col_widths):
    """Branded data table with dark header row."""
    header_row = [P(h, cell_header) for h in headers]
    data_rows = []
    for row in rows:
        out = []
        for cell in row:
            if isinstance(cell, tuple):
                text, style = cell
                out.append(P(text, style))
            else:
                out.append(P(str(cell), cell_style))
        data_rows.append(out)
    t = Table([header_row] + data_rows, colWidths=col_widths)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), DARK_BG),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_BG]),
        ('GRID', (0, 0), (-1, -1), 0.5, LIGHT_BORDER),
        ('LINEBELOW', (0, 0), (-1, 0), 1.5, INDIGO),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    return t
```

---

## Chart generation (matplotlib)

All charts use the Anyreach palette and consistent styling. Render at 200 DPI to a `charts/` directory.

```python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os

# Match the Anyreach palette
DARK_BG_HEX = "#161631"; INDIGO_HEX = "#5B5FC7"; GREEN_HEX = "#10B981"
CYAN_HEX = "#06B6D4"; AMBER_HEX = "#F59E0B"; PINK_HEX = "#EC4899"
MUTED_HEX = "#6B7280"; DARK_TEXT_HEX = "#1F2937"; MID_TEXT_HEX = "#374151"

plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['font.size'] = 10
plt.rcParams['axes.edgecolor'] = '#E5E7EB'
plt.rcParams['axes.linewidth'] = 0.8

def style_ax(ax, title=None, xlabel=None, ylabel=None):
    for s in ['top', 'right']:
        ax.spines[s].set_visible(False)
    ax.spines['left'].set_color('#E5E7EB')
    ax.spines['bottom'].set_color('#E5E7EB')
    ax.tick_params(colors=MID_TEXT_HEX, labelsize=9)
    if title:
        ax.set_title(title, color=DARK_TEXT_HEX, fontsize=12,
                     fontweight='bold', pad=12, loc='left')
    if xlabel:
        ax.set_xlabel(xlabel, color=MID_TEXT_HEX, fontsize=9)
    if ylabel:
        ax.set_ylabel(ylabel, color=MID_TEXT_HEX, fontsize=9)
    ax.grid(axis='y', color='#F3F4F6', linewidth=0.8, zorder=0)
    ax.set_axisbelow(True)
```

### Chart 1: Topics covered (horizontal bar)

```python
# items: list of (label, count) sorted descending
def chart_topics(items, total_sessions, out_path):
    palette = [INDIGO_HEX, GREEN_HEX, CYAN_HEX, AMBER_HEX, PINK_HEX,
               '#8B5CF6', '#EC4899', MUTED_HEX]
    labels = [k for k, v in items]
    values = [v for k, v in items]
    fig, ax = plt.subplots(figsize=(7, 4.2), dpi=200)
    bars = ax.barh(labels, values, color=palette[:len(labels)],
                   zorder=3, edgecolor='white', linewidth=1.5)
    for bar, v in zip(bars, values):
        ax.text(v + 0.5, bar.get_y() + bar.get_height()/2, str(v),
                va='center', color=DARK_TEXT_HEX, fontweight='bold', fontsize=10)
    style_ax(ax)
    ax.set_title(f'Topics covered across {total_sessions} demo sessions',
                 color=DARK_TEXT_HEX, fontsize=12, fontweight='bold', loc='left', pad=12)
    ax.set_xlim(0, max(values) * 1.18)
    ax.set_xlabel('Sessions touching this topic (sessions may cover multiple)',
                  color=MID_TEXT_HEX, fontsize=8)
    ax.invert_yaxis()
    ax.grid(axis='x', color='#F3F4F6', linewidth=0.8, zorder=0)
    ax.grid(axis='y', visible=False)
    plt.tight_layout()
    plt.savefig(out_path, bbox_inches='tight', facecolor='white', dpi=200)
    plt.close()
```

### Chart 2: Duration histogram

```python
# durations_minutes: list of session durations in minutes; bins: list of bin edges
def chart_duration(durations_minutes, bins, total_sessions, out_path):
    fig, ax = plt.subplots(figsize=(7, 3.7), dpi=200)
    counts, edges, patches = ax.hist(durations_minutes, bins=bins,
                                     color=INDIGO_HEX, edgecolor='white',
                                     linewidth=1.5, zorder=3)
    # Highlight the tallest bar in PINK
    if len(counts) > 0:
        max_idx = list(counts).index(max(counts))
        patches[max_idx].set_facecolor(PINK_HEX)
    for c, el, er in zip(counts, edges[:-1], edges[1:]):
        if c > 0:
            ax.text((el+er)/2, c + max(counts)*0.04, int(c), ha='center',
                    color=DARK_TEXT_HEX, fontweight='bold', fontsize=10)
    style_ax(ax, title=f'Session duration - {total_sessions} completed sessions',
             xlabel='Minutes', ylabel='Conversations')
    ax.set_xticks(bins)
    ax.set_xticklabels([f'{b}m' for b in bins])
    median = sorted(durations_minutes)[len(durations_minutes)//2]
    ax.axvline(median, color=GREEN_HEX, linestyle='--', linewidth=1.5, alpha=0.8, zorder=4)
    ax.text(median + 0.12, max(counts)*0.85, f'Median\n{median:.1f} min',
            color=GREEN_HEX, fontweight='bold', fontsize=9)
    plt.tight_layout()
    plt.savefig(out_path, bbox_inches='tight', facecolor='white', dpi=200)
    plt.close()
```

### Chart 3: Sentiment donut

```python
def chart_sentiment(positive, neutral, negative, out_path):
    fig, ax = plt.subplots(figsize=(6, 4), dpi=200)
    values = [positive, neutral, negative]
    labels = ['Positive', 'Neutral', 'Negative']
    colors = [GREEN_HEX, INDIGO_HEX, '#EF4444']
    total = sum(values)
    # Give zero-value categories a hairline so the legend still makes sense
    display = [v if v > 0 else 0.01 for v in values]
    wedges, _ = ax.pie(display, colors=colors, startangle=90, counterclock=False,
                       wedgeprops=dict(width=0.38, edgecolor='white', linewidth=2))
    ax.set_aspect('equal')
    ax.text(0, 0.08, str(total), ha='center', va='center',
            fontsize=26, fontweight='bold', color=DARK_TEXT_HEX)
    ax.text(0, -0.15, 'user turns', ha='center', va='center',
            fontsize=9, color=MUTED_HEX)
    legend_labels = [f'{l}   {v}   ({100*v/total:.1f}%)' if total > 0 else l
                     for l, v in zip(labels, values)]
    ax.legend(wedges, legend_labels, loc='center left', bbox_to_anchor=(1.02, 0.5),
              frameon=False, fontsize=10, labelcolor=DARK_TEXT_HEX)
    ax.set_title('Sentiment across user turns', color=DARK_TEXT_HEX,
                 fontsize=12, fontweight='bold', loc='left', pad=14)
    plt.tight_layout()
    plt.savefig(out_path, bbox_inches='tight', facecolor='white', dpi=200)
    plt.close()
```

### Chart 4: Tools/widgets (horizontal bar)

```python
# items: list of (pretty_name, count) sorted descending
def chart_tools(items, out_path):
    palette = [INDIGO_HEX, GREEN_HEX, CYAN_HEX, AMBER_HEX, PINK_HEX,
               '#8B5CF6', MUTED_HEX, INDIGO_HEX, GREEN_HEX, CYAN_HEX, AMBER_HEX]
    labels = [k for k, v in items]
    values = [v for k, v in items]
    fig, ax = plt.subplots(figsize=(7, 4), dpi=200)
    bars = ax.barh(labels, values, color=palette[:len(labels)],
                   zorder=3, edgecolor='white', linewidth=1.5)
    for bar, v in zip(bars, values):
        ax.text(v + max(values)*0.012, bar.get_y() + bar.get_height()/2,
                str(v), va='center', color=DARK_TEXT_HEX,
                fontweight='bold', fontsize=10)
    style_ax(ax)
    ax.set_title('Capability surface - tools & widgets invoked (all sessions)',
                 color=DARK_TEXT_HEX, fontsize=12, fontweight='bold',
                 loc='left', pad=12)
    ax.set_xlim(0, max(values) * 1.14)
    ax.set_xlabel('Total invocations', color=MID_TEXT_HEX, fontsize=9)
    ax.invert_yaxis()
    ax.grid(axis='x', color='#F3F4F6', linewidth=0.8, zorder=0)
    ax.grid(axis='y', visible=False)
    plt.tight_layout()
    plt.savefig(out_path, bbox_inches='tight', facecolor='white', dpi=200)
    plt.close()
```

### Chart 5: Engagement depth (turns histogram)

```python
def chart_engagement(turn_counts, out_path):
    fig, ax = plt.subplots(figsize=(7, 3.5), dpi=200)
    bins = [0, 2, 5, 8, 12, 16, max(turn_counts)+1]
    counts, edges, patches = ax.hist(turn_counts, bins=bins,
                                     color=CYAN_HEX, edgecolor='white',
                                     linewidth=1.5, zorder=3)
    bin_labels = ['1 turn', '2-4', '5-7', '8-11', '12-15', '16+']
    ax.set_xticks([(edges[i]+edges[i+1])/2 for i in range(len(edges)-1)])
    ax.set_xticklabels(bin_labels)
    for i, c in enumerate(counts):
        if c > 0:
            ax.text((edges[i]+edges[i+1])/2, c + max(counts)*0.04,
                    int(c), ha='center', color=DARK_TEXT_HEX,
                    fontweight='bold', fontsize=10)
    style_ax(ax, title='Engagement depth - user turns per session',
             xlabel='User turns', ylabel='Conversations')
    plt.tight_layout()
    plt.savefig(out_path, bbox_inches='tight', facecolor='white', dpi=200)
    plt.close()
```

### Chart 6 (option A): Daily activity timeline

```python
# date_counts: dict of {date_str: count} sorted by date
def chart_timeline(date_counts, out_path):
    dates = list(date_counts.keys())
    values = list(date_counts.values())
    fig, ax = plt.subplots(figsize=(7, 3.5), dpi=200)
    bars = ax.bar(dates, values, color=INDIGO_HEX, zorder=3,
                  edgecolor='white', linewidth=1.5, width=0.55)
    max_idx = values.index(max(values))
    bars[max_idx].set_color(PINK_HEX)
    for bar, v in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width()/2, v + max(values)*0.04,
                str(v), ha='center', color=DARK_TEXT_HEX,
                fontweight='bold', fontsize=10)
    style_ax(ax, title=f'Daily demo activity, {dates[0]} - {dates[-1]}',
             ylabel='Conversations')
    ax.set_ylim(0, max(values) * 1.18)
    plt.xticks(rotation=0, fontsize=8)
    plt.tight_layout()
    plt.savefig(out_path, bbox_inches='tight', facecolor='white', dpi=200)
    plt.close()
```

### Chart 6 (option B): Channel mix

```python
# Use this instead of timeline when the bot has both web and phone sessions
def chart_channel_mix(web_count, phone_count, total_sessions, out_path):
    fig, ax = plt.subplots(figsize=(6.5, 3.2), dpi=200)
    channels = ['Web chat (inbound)', 'Phone call (outbound)']
    values = [web_count, phone_count]
    colors = [INDIGO_HEX, PINK_HEX]
    bars = ax.bar(channels, values, color=colors, zorder=3,
                  edgecolor='white', linewidth=1.5, width=0.5)
    for bar, v in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width()/2, v + max(values)*0.03,
                str(v), ha='center', color=DARK_TEXT_HEX,
                fontweight='bold', fontsize=12)
    style_ax(ax, title=f'Channel mix across {total_sessions} sessions',
             ylabel='Sessions')
    ax.set_ylim(0, max(values) * 1.18)
    ax.tick_params(axis='x', labelsize=10)
    plt.tight_layout()
    plt.savefig(out_path, bbox_inches='tight', facecolor='white', dpi=200)
    plt.close()
```

---

## Page structure

The full report is 9-10 pages. Use the document setup below; populate sections inline (the `build_report` pattern shown in competitor-deep-dive's PDF_TEMPLATE.md is too rigid for this skill — write each section's content directly when you assemble the story).

```python
from reportlab.platypus import SimpleDocTemplate, Spacer, PageBreak, KeepTogether, Image
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch

doc = SimpleDocTemplate(
    output_path, pagesize=letter,
    topMargin=0.7*inch, bottomMargin=0.7*inch,
    leftMargin=0.7*inch, rightMargin=0.7*inch
)
story = []
W = letter[0] - 1.4*inch  # ~480pt usable width

# === PAGE 1: COVER ===
story.append(CoverBar())
story.append(Spacer(1, 44))
story.append(P('[Brand] demo bot', cover_title))
story.append(P('Usage analysis &#8212; [date range]', cover_subtitle))
story.append(Spacer(1, 20))
story.append(ColorBar(INDIGO, W, 3))
story.append(Spacer(1, 16))
story.append(P('Prepared for: <b>[Addressee]</b>', cover_meta))
story.append(P('Prepared by: <b>Anyreach, Inc.</b>', cover_meta))
story.append(P(f'Report date: <b>[Today]</b>', cover_meta))
story.append(Spacer(1, 30))
story.append(P('[Executive summary paragraph]', body_intro))
story.append(Spacer(1, 16))
# Two rows of 4 stat boxes — pick the 8 most impressive numbers
story.append(stat_row_4([...top 4...], W))
story.append(Spacer(1, 12))
story.append(stat_row_4([...next 4...], W))
story.append(Spacer(1, 16))
story.append(P('<b>Bottom line.</b> [2-3 sentence verdict.]', body_style))
story.append(PageBreak())

# === SECTION 1: WHAT THE BOT WAS ASKED TO DO (pages 2-3) ===
story.append(P('SECTION 1', label_style))
story.append(P('What the bot was asked to do', h1_style))
story.append(ColorBar(INDIGO, W, 2))
# ... topic chart + commentary, duration chart + table
story.append(PageBreak())

# === SECTION 2: CAPABILITY SURFACE (pages 4-5) ===
story.append(P('SECTION 2', label_style))
story.append(P('Capability surface - what the bot can do', h1_style))
story.append(ColorBar(GREEN, W, 2))
# ... tools chart + commentary, channel mix or engagement chart
story.append(PageBreak())

# === SECTION 3: HOW IT FELT TO THE USER (pages 6-7) ===
story.append(P('SECTION 3', label_style))
story.append(P('How it felt to the user', h1_style))
story.append(ColorBar(PINK, W, 2))
# ... sentiment donut + commentary, engagement chart, telemetry table
story.append(PageBreak())

# === SECTION 4: VOICE FROM THE TRANSCRIPTS (NEW — page 8) ===
story.append(P('SECTION 4', label_style))
story.append(P('Voice from the transcripts', h1_style))
story.append(ColorBar(AMBER, W, 2))
story.append(Spacer(1, 8))
story.append(P(
    '6-9 verbatim user quotes pulled from the corpus, organized by what they '
    'reveal about the bot. Each quote appears exactly as the user typed or '
    'spoke it.',
    body_intro
))
story.append(Spacer(1, 10))
# Quote grid (2-column)
story.append(quote_grid(quotes, accent_color=AMBER, total_width=W))
# Qualitative observations subsection
story.append(P('What we noticed across the corpus', h2_style))
for obs in qualitative_observations:
    story.append(P(obs, body_style))
story.append(PageBreak())

# === SECTION 5: REPRESENTATIVE INTERACTIONS (page 9) ===
story.append(P('SECTION 5', label_style))
story.append(P('Representative interactions', h1_style))
story.append(ColorBar(CYAN, W, 2))
# ... 3-4 dialogue examples in styled boxes
story.append(PageBreak())

# === SECTION 6: WHAT THIS MEANS FOR [ADDRESSEE] (page 10) ===
story.append(P('SECTION 6', label_style))
story.append(P(f'What this means for {addressee}', h1_style))
story.append(ColorBar(DARK_BG, W, 2))
# ... takeaway table, verdict bar, suggested next step, methodology note

doc.build(story, onFirstPage=make_footer(addressee), onLaterPages=make_footer(addressee))
```

---

## Section content guide

### Cover key stats

Pick 8 numbers across two rows. Order matters — the top row should be the most impressive 4. Common picks:

- Total sessions
- Total conversation hours
- Distinct tools/widgets used
- % non-negative sentiment
- Use-case categories covered
- Authenticated workflows / phone handoffs / something workflow-distinctive
- Languages handled
- Escalations to human (usually 0 — that's the point)

### Section 1 commentary patterns

After the topics chart:
> "The dominant scenario - **[top topic]** - appeared in [N] of [M] sessions and exercises [what's distinctive about that path: e.g., 'three things at once: emotional tone, authenticated account access, and cross-sell']."

After the duration chart:
> "The median session runs **[X min Y sec]**, with a spread that mirrors real contact-center tail behavior: a cluster of brief scripted flows, a steady body of [N-N] minute full-resolution calls, and a long tail extending past [N] minutes."

### Section 2 commentary patterns

Highlight 2-3 capabilities specifically:
> "**Authenticated flows are a majority workload.** [N] of [M] sessions ([X]%) involved [the auth pattern]. That's the class of work that drives real BPO handle-time savings, not just deflection."

> "**Visual widgets do the heavy lifting on comparison.** [N] [widget type] rendered across the sessions - a hybrid voice + visual UX pattern that cuts explanation time vs. pure audio narration."

### Section 3 commentary patterns

Sentiment commentary always grounds the reader in what positive looks like:
> "Users typed/spoke phrases like '[verbatim 1],' '[verbatim 2],' '[verbatim 3]' - spontaneous affirmations mid-flow, not just sign-off politeness."

Frame zero negatives carefully:
> "**The 'zero negative' finding deserves a note.** In [N] classified user turns, the bot did not trigger a single frustrated, angry, or confused response."

### Section 6 takeaway table

6-7 rows. Each row is `(Dimension, "What the data shows")`. Standard dimensions:

| Dimension | Pattern |
|-----------|---------|
| Intent coverage | All [N] top intents exercised end-to-end: ... |
| Depth of handling | [N] distinct tools invoked across [N] total function calls. ... |
| Conversational quality | Median [N] user turns per session, [N] meaningful turns total. Real back-and-forth ... |
| User sentiment | [N]% of user turns neutral or positive. Zero sessions with net-negative. Zero escalations. |
| [Distinguishing dimension — e.g., Multilingual / Cross-channel / Authentication] | [Specific evidence] |
| Production readiness | The capability surface ... matches what [partner] would expect. Ready for a structured pilot. |

End with a `VerdictBar` containing a punchy one-liner ("60 sessions. 11 tools. 8 intents. Zero escalations. Ready for pilot.")

---

## QA before delivery

After building the PDF, render every page with `pypdfium2` and visually check:

```python
import pypdfium2 as pdfium

pdf = pdfium.PdfDocument(output_path)
for i in range(len(pdf)):
    pdf[i].render(scale=1.6).to_pil().save(f'/home/claude/qa_{i+1}.png')
```

Then `view` each rendered page and check:

1. **No stranded headings** — every section header sits with at least its first paragraph + chart on the same page (use `KeepTogether` to enforce)
2. **No overlapping text** — chart titles, axis labels, and value labels don't collide
3. **Special characters render** — Twi (ɛ, ɔ), French (é, è, ç), naira (₦), euro (€), etc. should NOT show as black squares (if they do, the relevant Paragraph isn't using DejaVu)
4. **No truncated content** — long table cells wrap, dialogue boxes don't get cut off
5. **Consistent footer on every page** — addressee, page number, anyreach.ai
6. **Cover page**: pink top bar visible, key stats aligned, no escape characters in title (use `&amp;` for `&`)

If anything looks wrong, fix and re-render before presenting.

---

## Output paths

```
/home/claude/[brand_slug]_demo_bot_usage_report.pdf  (working copy)
/mnt/user-data/outputs/[brand_slug]_demo_bot_usage_report.pdf  (user-facing)
/mnt/user-data/outputs/[brand_slug]_enriched.csv  (optional supporting data)
```

Where `brand_slug` is lowercase with underscores: `att`, `access_bank`, `verizon`, etc.

Then call `present_files` with the PDF (and CSV if produced) as the final tool call.
