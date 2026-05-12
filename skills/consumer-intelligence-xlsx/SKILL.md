---
name: consumer-intelligence-xlsx
description: "Generate the standard 5-sheet Consumer Intelligence Excel workbook (.xlsx) — review summary, third-party reviews, employee reviews, competitive benchmarking, competitor deep dives — with the dark-blue / med-blue / light-blue design system and red/green/orange sentiment coloring. Trigger whenever the user asks to build a 'consumer intelligence xlsx', 'review intelligence workbook', 'review data export', 'companion xlsx', 'reviews spreadsheet', 'competitor review workbook', or 'consumer reviews excel'. Also trigger when the user just produced a consumer/review intelligence PDF and asks for the data file, raw data export, source-of-truth spreadsheet, or backing data; or when they dump scraped multi-platform review data and ask for a structured workbook. Always use this skill instead of building from scratch — it contains the exact 5-sheet structure, column widths, design tokens, sentiment coloring rules, and a parameterized openpyxl builder that the PDF report cross-references row-for-row."
---

# Consumer Intelligence XLSX Data Export Generator

Produce the standard 5-sheet `.xlsx` workbook that accompanies a Consumer Intelligence PDF report. The workbook is the source-of-truth data file — every figure, theme, or quote in the PDF must be traceable to a row here.

The skill is white-label by design: it accepts a `prepared_by` field so the same builder produces unbranded workbooks, Anyreach-branded workbooks, or workbooks branded for any consulting firm.

## What this skill produces

A single `.xlsx` file with five sheets, in this exact order:

1. **Review Summary** — executive dashboard. Platform ratings table, key themes with sentiment + frequency, quarterly sentiment-over-time, and an optional competitor comparison block.
2. **Third-Party Reviews** — every consumer review in the dataset, grouped by platform (Trustpilot, Google, BBB, Yelp, TripAdvisor, ConsumerAffairs, Reddit, App Store, etc.), with full text, rating, sentiment, date, and source URL.
3. **Employee Reviews** — Glassdoor and Indeed reviews. Same row shape as sheet 2 with Sentiment and Rating columns swapped, and rating formatted as `4/5` rather than `4 Stars`.
4. **Competitive Benchmarking** — 2–3 structured comparison tables between the target company and 2–4 competitors (platform-by-platform ratings, theme overlap, etc.).
5. **Competitor Deep Dives** — 4–8 representative review quotes per competitor with theme tags, abbreviated to 1–3 sentences each.

Design system: dark-blue title rows (`#1F3864`, white bold 16pt), med-blue section headers (`#2F5496`, white bold 13pt), light-blue column headers (`#D6E4F0`, bold), Calibri throughout, sentiment color-coded red `#CC0000` / green `#006600` / orange `#CC6600` everywhere it appears.

## When to use this skill

Trigger on any of:

- "Build the consumer intelligence xlsx for [Company]"
- "Generate the review data export"
- "Create the companion workbook for the PDF report"
- "Turn these scraped reviews into the standard 5-sheet xlsx"
- "Make the source-of-truth spreadsheet"
- "Do the data file for [Company]'s review intelligence report"

Also trigger when a Consumer Intelligence / Review Intelligence PDF was just produced and the user asks for the backing data, or when the user dumps scraped review data across multiple platforms and asks for "the workbook."

Do **not** use this skill for:
- The PDF report itself (different skill / different generator)
- Generic spreadsheet creation unrelated to consumer reviews (use the public `xlsx` skill)
- Single-platform review analysis with no competitor or employee dimension (overkill — just make a simple table)

## How to run it

The workflow is: gather inputs → write a config JSON → run the builder.

### Step 1: Gather the inputs

Ask the user for (or infer from prior conversation):

**Required:**
- `company_name` — full legal name of the company being analyzed
- `prepared_by` — name of the consulting firm or team (appears in subtitles)
- `report_date` — date string for the report (e.g., `"Nov 12, 2025"`)
- `platforms` — list of `{name, avg_rating, review_count, notes}` for the platform ratings table
- `themes` — list of `{name, sentiment, frequency_pct, confidence}` (6–10 themes typical)
- `sentiment_timeline` — list of `{period, total, positive, negative}` (one entry per quarter)
- `third_party_reviews` — list of `{platform, reviewer, rating, sentiment, text, date, source_url}`
- `competitors` — list of 2–4 competitor names
- `competitive_benchmarking` — 2–3 comparison tables, each `{title, header_row, data_rows}`
- `competitor_deep_dives` — list of `{competitor, summary_line, quotes: [{reviewer, platform, rating, theme, excerpt, date}]}`

**Optional:**
- `focus_area` — narrows the lens (e.g., `"Foreign Language Support"`, `"Billing Disputes"`). If provided, it appears in sheet titles. If omitted, the workbook defaults to general review analysis.
- `employee_reviews` — same row shape as third-party reviews but with rating in `X/5` form. Omit the sheet entirely if no employee data exists.
- `competitor_comparison_in_summary` — optional block on Sheet 1 with focus-area-specific metrics.

If a required field is missing, ask before proceeding rather than fabricating data. If the user provides raw review text dumps without structure, parse them into the schema yourself before invoking the builder.

### Step 2: Write the config

Save the config as a JSON file at `/home/claude/<company-slug>-config.json`. See `references/workbook-spec.md` for the full schema and `examples/` if you need a shape reference.

### Step 3: Run the builder

```bash
python /home/claude/consumer-intelligence-xlsx/scripts/build_workbook.py \
  --config /home/claude/<company-slug>-config.json \
  --output /mnt/user-data/outputs/<company-slug>-review-intelligence.xlsx
```

The builder reads `references/design-system.md` constants internally and writes the 5-sheet workbook. After it succeeds, call `present_files` with the output path.

## Key invariants — must hold in every workbook

These are non-negotiable. Both the PDF and the XLSX cross-reference these conventions:

1. **Five sheets, in order**, with tab names exactly: `Review Summary`, `Third-Party Reviews`, `Employee Reviews`, `Competitive Benchmarking`, `Competitor Deep Dives`. If there's no employee data, still create the sheet but populate it with a single "No employee reviews collected" note row — do not delete the sheet, since the PDF references it.
2. **Sentiment is color-coded everywhere it appears.** Red `#CC0000` / green `#006600` / orange `#CC6600`, always bold. This applies to: Sheet 1 themes column, Sheet 1 quarterly positive/negative counts, Sheet 2 sentiment column, Sheet 3 sentiment column.
3. **Review numbering (`#` column) resets to 1 within each platform group** on Sheets 2 and 3.
4. **Platform ordering on Sheets 2 and 3 is by review count descending.** Most-reviewed platform first.
5. **Source URLs are populated** for every review where available. Empty string only if genuinely unknown.
6. **Total review count in each sheet title matches the actual number of data rows** — count after parsing, don't trust the input claim.
7. **Competitor deep-dive quotes are 1–3 sentences max.** Truncate longer reviews to a representative excerpt; the PDF cannot accommodate full quotes either.
8. **`prepared_by` and `company_name` are never hardcoded** anywhere. Every appearance comes from the config. White-labeling depends on this.
9. **Column widths match the spec exactly.** Different per sheet. See `references/workbook-spec.md`.
10. **Title rows always use the dark-blue fill; section headers always use med-blue; column headers always use light-blue.** Never invert.

## Reference files

- `references/workbook-spec.md` — the full per-sheet structure: row-by-row layout, column widths, column headers, data shape, ordering rules, the JSON config schema, and the QA checklist. Read this before building or modifying the builder script.
- `references/design-system.md` — the design tokens: hex colors, font definitions, cell styles (TITLE / SECTION / HEADER / DATA / SENTIMENT / RATING), border definitions, and the four helper functions (`style_title`, `style_section`, `style_headers`, `add_data_row`). Read this if you're editing the builder, adjusting styling, or producing a one-off variant.

## Scripts

- `scripts/build_workbook.py` — the parameterized builder. Takes `--config <path.json> --output <path.xlsx>` and produces a complete workbook. Handles all 5 sheets, all styling, sentiment coloring, platform grouping, and the QA-checklist invariants. Use this as the default execution path. If the user wants a one-off deviation (e.g., a custom 6th sheet), copy this script into the workspace and edit the copy rather than mutating the skill.

## Quality checklist (run before delivering)

- [ ] All 5 sheets present with the exact tab names listed above
- [ ] Sheet 1 has all sections: Ratings, Themes, Sentiment Over Time, (optional Competitor Comparison)
- [ ] Title rows (row 1) use `#1F3864` with white bold 16pt
- [ ] Section headers use `#2F5496` with white bold 13pt
- [ ] Column headers use `#D6E4F0` with bold 11pt
- [ ] Sentiment values are color-coded red/green/orange everywhere
- [ ] Review text cells have `wrap_text=True`
- [ ] Column widths match the per-sheet spec
- [ ] No empty platform sections (omit platforms with 0 reviews from sheets 2/3)
- [ ] Review numbering resets to 1 within each platform group
- [ ] Source URLs populated for all reviews where available
- [ ] Competitor deep-dive quotes are 1–3 sentences (not full reviews)
- [ ] Total review counts in sheet titles match actual row counts
- [ ] `prepared_by` and `company_name` appear in the right places (Sheet 1 + 4 subtitles, Sheet 1 + 4 titles)
- [ ] No hardcoded company or consulting firm names anywhere in the output
