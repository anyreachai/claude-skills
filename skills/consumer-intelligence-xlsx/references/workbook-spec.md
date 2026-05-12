# Workbook Spec — Per-Sheet Structure

This reference documents the exact structure of every sheet in the Consumer Intelligence XLSX. Read it before building or modifying the builder script.

---

## Top-level config JSON schema

```json
{
  "company_name": "Acme Corp",
  "prepared_by": "Anyreach, Inc.",
  "report_date": "Nov 12, 2025",
  "focus_area": "Foreign Language Support",
  "focus_area_description": "Analysis of multilingual customer support across independent platforms",

  "platforms": [
    { "name": "Trustpilot", "avg_rating": 3.1, "review_count": 247, "notes": "Based on 247 of 1,432 total reviews on Trustpilot, focus-area complaints concentrate in billing and language barriers." }
  ],

  "themes": [
    { "name": "Long hold times", "sentiment": "Negative", "frequency_pct": 42, "confidence": "HIGH (n=104)" }
  ],

  "sentiment_timeline": [
    { "period": "Q3 2022", "total": 38, "positive": 14, "negative": 18 }
  ],

  "competitor_comparison_in_summary": {
    "headers": ["Metric", "Acme Corp", "Comp A", "Comp B"],
    "rows": [
      ["Avg rating across independent platforms", "3.1", "2.4", "3.6"]
    ]
  },

  "third_party_reviews": [
    {
      "platform": "Trustpilot",
      "reviewer": "Jane D.",
      "rating": "1 Star",
      "sentiment": "Negative",
      "text": "Full review text here...",
      "date": "Feb 2025",
      "source_url": "https://..."
    }
  ],

  "employee_reviews": [
    {
      "platform": "Glassdoor",
      "reviewer": "Anonymous",
      "sentiment": "Mixed",
      "rating": "3/5",
      "text": "Full review text...",
      "date": "Jan 2025",
      "source_url": "https://..."
    }
  ],

  "competitors": ["Comp A", "Comp B", "Comp C"],

  "competitive_benchmarking": [
    {
      "title": "A — Platform-by-Platform Ratings Comparison",
      "headers": ["Platform", "Acme Corp", "Comp A", "Comp B", "Comp C", "Notes"],
      "rows": [
        ["Trustpilot", "3.1", "2.4", "3.6", "1.9", "Acme leads on volume, lags on recent sentiment"]
      ]
    }
  ],

  "competitor_deep_dives": [
    {
      "competitor": "Comp A",
      "summary_line": "Blended Independent: ~1.9/5 | NPS: 32 | Neg Sentiment: ~70-75%",
      "quotes": [
        {
          "reviewer": "Mark T.",
          "platform": "Trustpilot",
          "rating": "1 Star",
          "theme": "Billing dispute",
          "excerpt": "1-3 sentence excerpt from the original review.",
          "date": "Mar 2025"
        }
      ]
    }
  ]
}
```

---

## Sheet 1: Review Summary

**Purpose:** Executive dashboard — platform ratings, themes, sentiment over time, and (optional) competitor comparison.

**Column widths:** A=35, B=18, C=20, D=55

**Layout (top to bottom):**

| Row | Content | Style |
|-----|---------|-------|
| 1 | Workbook title, merged A1:D1. Text: `"{Company Name} — {Focus Area} Review Intelligence Report"` (or `"{Company Name} Review Intelligence Report"` if no focus area) | TITLE |
| 2 | Subtitle, merged A2:D2. Text: `"Prepared by: {Prepared By} \| {Focus Area Description}"` | SECTION |
| 3 | Section header, merged A3:D3. Text: `"Review Ratings by Platform"` | SECTION |
| 4 | Column headers: `[Platform, Rating, # of Reviews, Notes]` | HEADER |
| 5..N | Platform data — one row per platform | DATA |

Platform row contents:
- `Platform` (col A): name string (e.g., `"Trustpilot"`)
- `Rating` (col B): float, e.g., `3.1`. Use `None` if not rated.
- `# of Reviews` (col C): int
- `Notes` (col D): 1–2 sentence platform summary. Format: `"Based on {n} of {total} total reviews on {platform}, {key finding}."` Wrap text.

Then a gap row, then:

| Row | Content | Style |
|-----|---------|-------|
| — | Section header, merged A:D. Text: `"Key Themes Analysis"` | SECTION |
| — | Column headers: `[Theme, Sentiment, Frequency %, Confidence]` | HEADER |
| — | Theme rows (6–10) | DATA + SENTIMENT coloring on col B |

Theme row contents:
- `Theme` (col A): string
- `Sentiment` (col B): `"Negative"` / `"Positive"` / `"Mixed"` — apply color
- `Frequency %` (col C): int
- `Confidence` (col D): `"HIGH (n=X)"` / `"MEDIUM (n=X)"` / `"LOW (n=X)"`

Sort: negative themes descending by frequency, then positive themes.

Then a gap row, then:

| Row | Content | Style |
|-----|---------|-------|
| — | Section header, merged A:D. Text: `"Sentiment Over Time"` | SECTION |
| — | Column headers: `[Period, Reviews, Positive, Negative]` | HEADER |
| — | Quarterly rows | DATA + green col C, red col D |

Quarter row contents:
- `Period` (col A): `"Q3 2022"` etc.
- `Reviews` (col B): int
- `Positive` (col C): int, green bold
- `Negative` (col D): int, red bold

Then (optional, only if `competitor_comparison_in_summary` provided):

| Row | Content | Style |
|-----|---------|-------|
| — | Section header, merged A:D. Text: `"Competitor {Focus Area} Comparison"` | SECTION |
| — | Headers from config | HEADER |
| — | Data rows from config | DATA |

5–8 rows typical.

---

## Sheet 2: Third-Party Reviews

**Purpose:** Every consumer review, grouped by platform.

**Column widths:** A=5, B=22, C=12, D=14, E=95, F=15, G=45

**Row 1:** Sheet title, merged A1:G1. Text: `"{Focus Area} — Third-Party Reviews ({N} Reviews)"` (or `"Third-Party Reviews — {N} Reviews"` if no focus area). TITLE style.

**For each platform (grouped, ordered by review count descending):**

| Row | Content | Style |
|-----|---------|-------|
| — | Platform section header, merged A:G. Text: `"{Platform} ({n} reviews)"` | SECTION |
| — | Column headers: `[#, Reviewer, Rating, Sentiment, Review Text, Date, Source URL]` | HEADER |
| — | Review rows | DATA + SENTIMENT coloring on col D, bold on col C |

Review row contents:
- `#` (col A): sequential within platform group, reset to 1 per platform
- `Reviewer` (col B): name/handle
- `Rating` (col C): e.g., `"5 Stars"`, `"1 Star"`, `"N/A"` — bold
- `Sentiment` (col D): `"Positive"` / `"Negative"` / `"Mixed"` — bold + color
- `Review Text` (col E): full text, wrap
- `Date` (col F): date string, e.g., `"Feb 2025"`, `"2024-11-15"`, `"Unknown"`
- `Source URL` (col G): full URL

**Platform ordering:** by review count descending. Common platforms: Trustpilot, Google Reviews, Yelp, TripAdvisor, BBB, ConsumerAffairs, PissedConsumer, Reddit, App Store, FlyerTalk, Booking.com, Facebook, SiteJabber. Omit platforms with zero reviews.

---

## Sheet 3: Employee Reviews

**Purpose:** Glassdoor + Indeed reviews — internal signals about operational issues.

**Column widths:** A=5, B=22, C=14, D=12, E=95, F=15, G=45 (note C and D widths differ from Sheet 2)

**Row 1:** Sheet title, merged A1:G1. Text: `"Employee Reviews — {Focus Area} ({N} Reviews)"` (or `"Employee Reviews — {N} Reviews"` if no focus area). TITLE style.

**For each employee platform:**

| Row | Content | Style |
|-----|---------|-------|
| — | Platform section header, merged A:G. Text: `"{Platform} ({n} reviews)"` | SECTION |
| — | Column headers: `[#, Reviewer, Sentiment, Rating, Review Text, Date, Source URL]` (Sentiment + Rating swapped vs Sheet 2) | HEADER |
| — | Review rows | DATA + SENTIMENT coloring on col C, bold on col D |

Review row contents — same as Sheet 2 with col order: `#, Reviewer, Sentiment, Rating, Review Text, Date, Source URL`. Rating formatted as `"4/5"`, `"3/5"`, etc. (not `"X Stars"`).

**If no employee data exists:** still create the sheet with the title row, then a single notice row: `"No employee reviews collected for this report."` Do NOT delete the sheet.

---

## Sheet 4: Competitive Benchmarking

**Purpose:** Structured comparison tables between target company and competitors.

**Column widths:** A=38, B=24, C=24, D=24, E=24, F=58, G=5

**Row 1:** Sheet title, merged A1:G1. Text: `"{Company Name} — Competitive Benchmarking"`. TITLE style.

**Row 2:** Subtitle, merged A2:G2. Text: `"Based on competitor review analysis across independent platforms — {Report Date} \| {Prepared By}"`. SECTION style.

**For each comparison table in config (typically 2–3):**

| Row | Content | Style |
|-----|---------|-------|
| — | Section header, merged A:G. Text: table `title` (e.g., `"A — Platform-by-Platform Ratings Comparison"`) | SECTION |
| — | Column headers from config (typically: `[Platform/Metric, {Company}, {Comp 1}, {Comp 2}, {Comp 3}, Notes]`) | HEADER |
| — | Data rows from config (8–15 rows typical) | DATA |

Insert a gap row between tables.

---

## Sheet 5: Competitor Deep Dives

**Purpose:** Raw competitor review quotes with theme tags.

**Column widths:** A=8, B=22, C=16, D=12, E=32, F=72, G=14

**Row 1:** Sheet title, merged A1:G1. Text: `"Competitor Deep Dives — {Comp 1}, {Comp 2}, {Comp 3}"`. TITLE style.

**Row 2:** Subtitle, merged A2:G2. Text: `"Selected review quotes and complaint themes from independent platforms \| {Prepared By}"`. SECTION style.

**For each competitor:**

| Row | Content | Style |
|-----|---------|-------|
| — | Competitor section header, merged A:G. Text: `"{Competitor} — {summary_line}"` | SECTION |
| — | Column headers: `[#, Reviewer, Platform, Rating, Theme, Quote Excerpt, Date]` | HEADER |
| — | 4–8 quote rows | DATA |

Quote row contents:
- `#` (col A): sequential within competitor block
- `Reviewer` (col B): name/handle
- `Platform` (col C): source platform name
- `Rating` (col D): e.g., `"1 Star"`
- `Theme` (col E): short category label (e.g., `"Billing dispute"`, `"Call center outsourcing"`)
- `Quote Excerpt` (col F): 1–3 sentences, wrap text. NOT the full review.
- `Date` (col G): date string

---

## QA checklist

Before delivering:

- [ ] All 5 sheets present with exact tab names: `Review Summary`, `Third-Party Reviews`, `Employee Reviews`, `Competitive Benchmarking`, `Competitor Deep Dives`
- [ ] Sheet 1 has all sections: Ratings, Themes, Sentiment Over Time, (optional Competitor Comparison)
- [ ] All merged cells span the correct column range for their sheet
- [ ] Title rows use DARK_BLUE fill `#1F3864` with white bold text
- [ ] Section headers use MED_BLUE fill `#2F5496` with white bold text
- [ ] Column headers use LIGHT_BLUE fill `#D6E4F0` with bold text
- [ ] Sentiment color-coded: red `#CC0000` / green `#006600` / orange `#CC6600`
- [ ] All review text cells (col E on sheets 2/3, col F on sheet 5) have `wrap_text=True`
- [ ] Column widths match per-sheet spec
- [ ] No empty platform sections
- [ ] Review numbering resets to 1 within each platform group
- [ ] Source URLs populated where available
- [ ] Competitor deep-dive quotes are 1–3 sentences
- [ ] Total review count in sheet titles matches actual row count
- [ ] `prepared_by` appears in Sheet 1 + Sheet 4 subtitles
- [ ] `company_name` appears in Sheet 1 + Sheet 4 titles
- [ ] No hardcoded company or consulting firm names anywhere
