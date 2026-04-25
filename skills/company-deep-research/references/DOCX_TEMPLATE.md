# DOCX Template Reference

Complete code template for generating professionally designed Word documents for company deep research reports. Uses `docx-js` (npm package `docx`).

## Setup

```bash
npm install -g docx
```

## Color System

```javascript
const NAVY = "1B2A4A";      // Primary headings, cover title, table headers
const ACCENT = "2E75B6";    // H2 headings, divider lines, cover subtitle
const LIGHT_BG = "EDF2F7";  // Alternating table rows, KV table label column
const LIGHT_ACCENT = "D5E8F0"; // Optional highlight backgrounds
const MEDIUM_GRAY = "666666"; // Dates, subtitles, footer text
const LIGHT_GRAY = "CCCCCC"; // Table borders
const WHITE = "FFFFFF";      // Table header text
const BLACK = "000000";      // Body text (default)
```

## Complete Code Template

Adapt the content sections (marked with comments) to the specific company being researched. The structure, helpers, and styling should remain consistent across all reports.

```javascript
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageBreak, PageNumber, LevelFormat, TabStopType, TabStopPosition,
  TableOfContents
} = require("docx");

// ===== COLOR SYSTEM =====
const NAVY = "1B2A4A";
const ACCENT = "2E75B6";
const LIGHT_BG = "EDF2F7";
const MEDIUM_GRAY = "666666";
const LIGHT_GRAY = "CCCCCC";
const WHITE = "FFFFFF";

// ===== BORDER PRESETS =====
const noBorder = { style: BorderStyle.NONE, size: 0 };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GRAY };
const thinBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const cellMargins = { top: 60, bottom: 60, left: 100, right: 100 };

// ===== HELPER FUNCTIONS =====

// Shortcut for heading paragraphs
function heading(text, level) {
  return new Paragraph({ heading: level, children: [new TextRun(text)] });
}

// Shortcut for body paragraphs — accepts string or array of TextRuns
function para(runs, opts = {}) {
  const children = typeof runs === "string" ? [new TextRun(runs)] : runs;
  return new Paragraph({ children, ...opts });
}

function bold(text) { return new TextRun({ text, bold: true }); }
function normal(text) { return new TextRun(text); }
function italic(text) { return new TextRun({ text, italics: true }); }

// Vertical whitespace
function spacer(pts = 120) {
  return new Paragraph({ spacing: { after: pts }, children: [] });
}

// Blue horizontal rule between sections
function divider() {
  return new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ACCENT, space: 8 } },
    spacing: { after: 200 },
    children: [],
  });
}

// Key-value info table (no header, colored label column)
// Usage: kvTable([["Label", "Value"], ["Label2", "Value2"]])
function kvTable(rows) {
  const colW = [2800, 6560];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: colW,
    rows: rows.map(([k, v]) =>
      new TableRow({
        children: [
          new TableCell({
            width: { size: colW[0], type: WidthType.DXA }, borders: noBorders, margins: cellMargins,
            shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
            children: [para([bold(k)])],
          }),
          new TableCell({
            width: { size: colW[1], type: WidthType.DXA }, borders: noBorders, margins: cellMargins,
            children: [para(v)],
          }),
        ],
      })
    ),
  });
}

// Data table with navy header row and alternating row shading
// Usage: dataTable(["Col1", "Col2"], [["a", "b"], ["c", "d"]], [4680, 4680])
// Column widths MUST sum to 9360 (US Letter with 1" margins)
function dataTable(headers, rows, colWidths) {
  const total = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h, i) =>
          new TableCell({
            width: { size: colWidths[i], type: WidthType.DXA },
            borders: thinBorders, margins: cellMargins,
            shading: { fill: NAVY, type: ShadingType.CLEAR },
            children: [para([new TextRun({ text: h, bold: true, color: WHITE, font: "Arial", size: 20 })])],
          })
        ),
      }),
      ...rows.map((row, ri) =>
        new TableRow({
          children: row.map((cell, ci) =>
            new TableCell({
              width: { size: colWidths[ci], type: WidthType.DXA },
              borders: thinBorders, margins: cellMargins,
              shading: ri % 2 === 0 ? { fill: LIGHT_BG, type: ShadingType.CLEAR } : undefined,
              children: [para(typeof cell === "string" ? cell : cell, { spacing: { after: 40 } })],
            })
          ),
        })
      ),
    ],
  });
}

// ===== DOCUMENT STRUCTURE =====

const doc = new Document({
  // Style overrides for headings
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } }, // 11pt body
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: ACCENT },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: NAVY },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 },
      },
    ],
  },
  // Bullet list config (NEVER use unicode bullets)
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } },
      }],
    }],
  },
  sections: [
    // ===== SECTION 1: COVER PAGE (no header/footer) =====
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        spacer(600), spacer(600), spacer(600),
        // Title with bottom border
        new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: ACCENT, space: 12 } },
          spacing: { after: 300 },
          children: [new TextRun({ text: "COMPANY NAME", font: "Arial", size: 60, bold: true, color: NAVY })],
        }),
        // Subtitle
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: "Deep Research & GTM Analysis", font: "Arial", size: 36, color: ACCENT })],
        }),
        // Tagline
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({
            text: "A descriptive tagline about the company",
            font: "Arial", size: 26, italics: true, color: MEDIUM_GRAY,
          })],
        }),
        spacer(400),
        // Metadata table
        kvTable([
          ["Prepared for", "AnyReach Internal"],
          ["Date", "April 2026"],        // Use current month/year
          ["Classification", "Confidential"],
          ["Sources", "Public web, call transcripts, corporate filings"],
        ]),
        spacer(600), spacer(600),
        new Paragraph({
          children: [new TextRun({ text: "Prepared by AnyReach AI Intelligence", size: 20, color: MEDIUM_GRAY, italics: true })],
        }),
      ],
    },

    // ===== SECTION 2: BODY (with header/footer) =====
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: ACCENT, space: 4 } },
            children: [new TextRun({
              text: "COMPANY NAME \u2014 Deep Research & GTM Analysis",
              font: "Arial", size: 16, color: MEDIUM_GRAY
            })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 1, color: LIGHT_GRAY, space: 4 } },
            children: [
              new TextRun({ text: "Page ", size: 16, color: MEDIUM_GRAY }),
              new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MEDIUM_GRAY }),
            ],
          })],
        }),
      },
      children: [
        // Table of Contents
        heading("Table of Contents", HeadingLevel.HEADING_1),
        new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-3" }),
        new Paragraph({ children: [new PageBreak()] }),

        // ===== CONTENT SECTIONS =====
        // Adapt all content below to the specific company.
        // Use these patterns:

        // H1 for major sections
        heading("Executive Summary", HeadingLevel.HEADING_1),
        para([
          bold("Company Name"),
          normal(" is a ... [2-3 paragraph summary of the essential story]."),
        ], { spacing: { after: 160 } }),
        divider(),

        // H2 for subsections
        heading("Company Overview & History", HeadingLevel.HEADING_1),
        heading("Origins", HeadingLevel.HEADING_2),
        para("Narrative text here...", { spacing: { after: 160 } }),

        // Data table for structured info
        heading("Key Milestones", HeadingLevel.HEADING_2),
        dataTable(
          ["Year", "Event", "Significance"],
          [
            ["2010", "Founded", "Initial product launch"],
            ["2015", "Series B", "Expanded to EMEA"],
          ],
          [1000, 4160, 4200], // Must sum to 9360
        ),
        spacer(),

        // KV table for snapshot
        heading("Company Snapshot", HeadingLevel.HEADING_2),
        kvTable([
          ["Headquarters", "City, State"],
          ["Founded", "Year"],
          ["Employees", "~X,XXX"],
          ["Revenue (est.)", "$XXM\u2013$XXXM"],
        ]),
        spacer(),
        divider(),

        // Bullet lists for capabilities
        heading("Platform Capabilities", HeadingLevel.HEADING_3),
        ...["Capability one", "Capability two", "Capability three"].map(item =>
          para(item, { numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 } })
        ),
        spacer(),

        // Page break before major new topic
        new Paragraph({ children: [new PageBreak()] }),
        heading("Next Major Section", HeadingLevel.HEADING_1),
        // ... continue pattern
      ],
    },
  ],
});

// ===== GENERATE & SAVE =====
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/claude/output.docx", buffer);
  console.log("Done");
});
```

## Validation

Always validate after generation:

```bash
python /mnt/skills/public/docx/scripts/office/validate.py output.docx
```

## Design Rules

1. **Tables**: Always use `WidthType.DXA` (never percentage). Column widths must sum to 9360 for US Letter with 1" margins. Set both `columnWidths` on the table AND `width` on each cell.
2. **Shading**: Always use `ShadingType.CLEAR` (never SOLID — SOLID causes black backgrounds).
3. **Bullets**: Always use `LevelFormat.BULLET` with numbering config. NEVER use unicode bullet characters.
4. **Page breaks**: Must be inside a Paragraph: `new Paragraph({ children: [new PageBreak()] })`.
5. **No `\n`**: Use separate Paragraph elements for line breaks.
6. **Smart quotes**: Use `\u201C` / `\u201D` for double quotes, `\u2019` for apostrophes.
7. **Font**: Arial throughout. 11pt (size: 22) body, 18pt H1, 14pt H2, 12pt H3.
8. **Cell margins**: Always add `margins: { top: 60, bottom: 60, left: 100, right: 100 }` for readable padding.
