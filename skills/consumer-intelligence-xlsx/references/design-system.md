# Design System — Colors, Fonts, Styles, Helpers

Read this when editing the builder script or producing a one-off styling variant.

---

## Color tokens (openpyxl PatternFill hex format)

```python
DARK_BLUE_FILL   = 'FF1F3864'   # Title row background
MED_BLUE_FILL    = 'FF2F5496'   # Section header background
LIGHT_BLUE_FILL  = 'FFD6E4F0'   # Column header background
WHITE_FILL       = '00000000'   # Default (transparent)
```

Sentiment colors (font colors, no fill):

```python
NEG_COLOR = 'CC0000'   # Negative — red
POS_COLOR = '006600'   # Positive — green
MIX_COLOR = 'CC6600'   # Mixed — orange
```

---

## Font definitions

```python
from openpyxl.styles import Font

TITLE_FONT    = Font(name='Calibri', size=16, bold=True, color='FFFFFF')
SECTION_FONT  = Font(name='Calibri', size=13, bold=True, color='FFFFFF')
HEADER_FONT   = Font(name='Calibri', size=11, bold=True)
NORMAL_FONT   = Font(name='Calibri', size=11)
NEG_FONT      = Font(name='Calibri', size=11, bold=True, color='CC0000')
POS_FONT      = Font(name='Calibri', size=11, bold=True, color='006600')
MIX_FONT      = Font(name='Calibri', size=11, bold=True, color='CC6600')
BOLD_FONT     = Font(name='Calibri', size=11, bold=True)   # for rating cells
```

---

## Cell styles

**TITLE_STYLE** — row 1 of every sheet
- Font: `TITLE_FONT` (Calibri 16pt bold white)
- Fill: `DARK_BLUE_FILL`
- Merged across all columns in the sheet
- Alignment: vertical center

**SECTION_STYLE** — section headers within sheets
- Font: `SECTION_FONT` (Calibri 13pt bold white)
- Fill: `MED_BLUE_FILL`
- Merged across all columns in the sheet
- Alignment: vertical center

**HEADER_STYLE** — column headers
- Font: `HEADER_FONT` (Calibri 11pt bold)
- Fill: `LIGHT_BLUE_FILL`
- Alignment: horizontal center, vertical center, wrap_text=True

**DATA_STYLE** — normal data cells
- Font: `NORMAL_FONT` (Calibri 11pt)
- Alignment: vertical top, wrap_text=True
- Border: thin bottom border `#D0D0D0`

**SENTIMENT_STYLE** — sentiment value cells
- Conditional font color based on cell value:
  - `"Negative"` → `NEG_FONT`
  - `"Positive"` → `POS_FONT`
  - `"Mixed"` → `MIX_FONT`
- Bold always

**RATING_STYLE** — rating cells in review sheets
- Font: `BOLD_FONT` (Calibri 11pt bold)
- Otherwise standard DATA_STYLE

---

## Border definition

```python
from openpyxl.styles import Border, Side
thin_border = Border(bottom=Side(style='thin', color='D0D0D0'))
```

---

## Helper functions

```python
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side


def style_title(ws, row, max_col):
    """Merge cells across row, apply TITLE_STYLE (dark blue bg, white bold text)."""
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=max_col)
    cell = ws.cell(row=row, column=1)
    cell.font = TITLE_FONT
    cell.fill = PatternFill('solid', fgColor=DARK_BLUE_FILL)
    cell.alignment = Alignment(vertical='center')
    ws.row_dimensions[row].height = 28


def style_section(ws, row, max_col):
    """Merge cells across row, apply SECTION_STYLE (medium blue bg, white bold text)."""
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=max_col)
    cell = ws.cell(row=row, column=1)
    cell.font = SECTION_FONT
    cell.fill = PatternFill('solid', fgColor=MED_BLUE_FILL)
    cell.alignment = Alignment(vertical='center')
    ws.row_dimensions[row].height = 22


def style_headers(ws, row, num_cols):
    """Apply HEADER_STYLE to each cell in the header row."""
    for c in range(1, num_cols + 1):
        cell = ws.cell(row=row, column=c)
        cell.font = HEADER_FONT
        cell.fill = PatternFill('solid', fgColor=LIGHT_BLUE_FILL)
        cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)


def add_data_row(ws, row, data_list, font_overrides=None):
    """Write data to row with DATA_STYLE. Optional per-cell font overrides for sentiment / rating coloring."""
    for i, val in enumerate(data_list):
        cell = ws.cell(row=row, column=i+1, value=val)
        if font_overrides and i < len(font_overrides) and font_overrides[i] is not None:
            cell.font = font_overrides[i]
        else:
            cell.font = NORMAL_FONT
        cell.alignment = Alignment(vertical='top', wrap_text=True)
        cell.border = thin_border


def font_for_sentiment(value):
    """Return the correct font for a sentiment value string."""
    if value == 'Negative':
        return NEG_FONT
    if value == 'Positive':
        return POS_FONT
    if value == 'Mixed':
        return MIX_FONT
    return None
```

---

## Sentiment coloring — application points

Apply conditional font coloring at these locations:

| Sheet | Section | Column | Color rule |
|-------|---------|--------|------------|
| 1 | Key Themes | B (Sentiment) | red/green/orange by value |
| 1 | Sentiment Over Time | C (Positive) | green always |
| 1 | Sentiment Over Time | D (Negative) | red always |
| 2 | All review rows | D (Sentiment) | red/green/orange by value |
| 2 | All review rows | C (Rating) | bold only |
| 3 | All review rows | C (Sentiment) | red/green/orange by value |
| 3 | All review rows | D (Rating) | bold only |
