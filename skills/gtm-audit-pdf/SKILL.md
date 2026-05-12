---
name: gtm-audit-pdf
description: Generate a polished editorial-style multi-page PDF brief from the JSON output of a GTM stack audit — produces an 8-page landscape board memo using the Anyreach editorial design system (Fraunces serif, cream + ink alternation, indigo + lime accents). Use whenever the user wants a static PDF, deck, brief, or shareable document version of a GTM audit run. Trigger on "generate the audit PDF", "build a deck for the audit", "turn this into a brief", "make a PDF version of the audit", "shareable doc for the audit findings", "investor doc for the audit", "board memo for the GTM audit", or whenever GTM audit JSON output (findings.json, tactics.json, run_summary.json, strategy.md) is provided with a request for a static deliverable. Trigger even for partial requests like "put this in a doc". Do NOT trigger for interactive/JSX prototypes — use gtm-audit-app for those. Depends on the anyreach-deck skill being installed; imports tokens, components, and rendering pipeline from there.
---

# GTM Audit PDF

Turn the JSON output of a GTM stack audit into an 8-page landscape PDF
brief that reads like a magazine feature crossed with a board memo.
Built on the Anyreach editorial design system: Fraunces serif headlines,
DM Sans body, JetBrains Mono numerics, cream + ink page alternation,
indigo + lime accents.

## When To Use This Skill

Use this skill when the deliverable is a **static PDF** — something the
user will share with their board, an advisor, or a partner. Typical
triggers:

- "generate the audit PDF"
- "turn this into a deck/brief/memo"
- "put this in a doc I can send"
- "make a PDF version of the findings"

For interactive product UI prototypes, use `gtm-audit-app` instead.

## Dependency

This skill depends on the **anyreach-deck** skill, which provides the
design tokens, component library, and HTML→PDF rendering pipeline. The
script in `templates/audit_deck_template.py` imports from
`/mnt/skills/user/anyreach-deck/lib/`. If anyreach-deck is not
installed, this skill cannot render.

If the user asks for a similar PDF but the editorial design system is
inappropriate (e.g. they want a different brand's visual language), use
the appropriate brand-specific skill (`anyreach-startek-deck` for
Anyreach × Startek partnership decks; `bpo-roi-brief` for BPO ROI
briefs) instead.

## Input Contract

Same as `gtm-audit-app`. Read `references/input_schema.md` for the
field-level details. Briefly:

| File | Required? | What's in it |
|---|---|---|
| `findings.json` | yes | Array of findings — title, severity, evidence, implication, action |
| `tactics.json` | yes | Array of tactics — priority_score, effort, title, outcome |
| `run_summary.json` | yes | Severity counts, runtime, top findings, tools |
| `00_inventory.json` | yes | Per-tool inventory with auth + record counts |
| `strategy.md` | recommended | Free-text strategy memo — source of headlines and shift definitions |
| Per-tool `<NN>_*.json` | optional | Deep stats for the Tools page |

## Required Page Structure

The PDF is exactly **8 landscape pages, 1400×900px**. The structure
is fixed because the editorial cadence (cream / ink alternation,
section numbering, closing rhythm) only works at this length. Don't
add or drop pages without redesigning the cadence.

```
PAGE 1 — Hero (cream)
  Eyebrow · "GTM Stack Audit · <client> · <date>"
  Headline (~120px Fraunces) — the audit's argument in 2-4 words,
    e.g. "Pitch versus *data*."
  Subhead — 2-3 sentences in 18px DM Sans
  Byline — small, "Audit by ..."
  Bottom: 4-tile metric_tile_row — Findings, Tactics, Tools, Runtime

PAGE 2 — Critical Findings (ink)
  Section header · "01 · Critical Findings"
  Headline — "Where the *gap* is." (or similar)
  Body — 1-2 sentences framing the four critical findings
  4-column tile_grid of detail_tile components, one per critical finding
    Each: F-id eyebrow + CRITICAL aux + title + big metric + ratio + bullets

PAGE 3 — Tool Inventory (cream)
  Section header · "02 · Tool Inventory"
  Headline — e.g. "Two systems, *one functioning*."
  2-column tile_grid of custom tool cards
    Each: category eyebrow + tool name + status chip + stats table + health note

PAGE 4 — Findings Ledger (cream)
  Section header · "03 · Findings Ledger"
  Headline — e.g. "The ledger of *twelve*."
  Custom 4-column row for every finding (F-id · severity chip · title · tools)
    Hairline dividers between rows

PAGE 5 — Three Shifts (ink)
  Section header · "04 · The Three Shifts"
  Headline — e.g. "Decide in *30 days*."
  3-column row of scenario_card components, each describing one shift
  First shift gets is_highlight=True (lime border)

PAGE 6 — Tactics, Ranked (cream)
  Section header · "05 · Tactics, Ranked"
  Headline — e.g. "Twelve moves, ranked by *impact ÷ effort*."
  Custom 5-column row for each of the top 9 tactics
    (rank · priority · effort bars · title/id · tools)

PAGE 7 — Risks (cream)
  Section header · "06 · Risks if Status Quo Persists"
  Headline — e.g. "What it costs to *not act*."
  Q&A rows (qa_row component) — 4 risks
  Closing callout — indigo accent, summarizing the cheapest path forward

PAGE 8 — Closing (ink)
  3-tile metric_tile_row — 30-day slate, decisions needed, hours-to-value
  closing_tagline — large centered headline + 3 metadata lines
```

## Workflow

1. **Read the input files** in `/mnt/project/`. Always start with
   `run_summary.json` and `strategy.md` — these set the voice.

2. **Read the anyreach-deck design system** at
   `/mnt/skills/user/anyreach-deck/DESIGN_SYSTEM.md`. The tokens,
   components, and rendering pipeline live there. Don't redefine them.

3. **Read `references/page_templates.md`** for the exact code patterns
   for each of the 8 pages.

4. **Read `references/input_schema.md`** for how to map the audit JSON
   into the page builders.

5. **Start from `templates/audit_deck_template.py`**. It has all 8
   page builders with placeholder data. Replace the placeholders with
   real audit data.

6. **Render the PDF** to `/mnt/user-data/outputs/<client>_gtm_audit.pdf`
   via `build_deck(pages, output_path=...)`.

7. **VERIFY by rendering preview PNGs** of every page using pypdfium2
   and visually inspect each one. Layout overflow is invisible in
   source. This step is mandatory:

   ```python
   import pypdfium2 as pdfium
   pdf = pdfium.PdfDocument('output.pdf')
   for i, page in enumerate(pdf):
       page.render(scale=0.7).to_pil().save(f'preview_p{i+1}.png')
   ```

   Then view each preview. Common overflow issues: page 1 hero too
   long, page 6 tactics list runs past page bottom, page 8 metric
   tiles bleed into the closing tagline. See "Common Pitfalls" below.

## Voice Guidance

The PDF lives or dies on its **headlines**. Generic SaaS-dashboard
copy ("Audit Findings", "Recommended Actions") collapses the editorial
feel. Read `strategy.md` carefully and steal phrases from it. The
Anyreach reference deck does this:

| Page | Generic | Editorial (use this) |
|---|---|---|
| 1 | "GTM Audit Summary" | "Pitch versus *data*." |
| 2 | "Critical Findings" | "Where the *gap* is." |
| 3 | "Tool Inventory" | "Two systems, *one functioning*." |
| 4 | "All Findings" | "The ledger of *twelve*." |
| 5 | "Strategic Recommendations" | "Decide in *30 days*." |
| 6 | "Tactical Backlog" | "Twelve moves, ranked by *impact ÷ effort*." |
| 7 | "Risk Analysis" | "What it costs to *not act*." |
| 8 | "Conclusion" | "The audit is not a *verdict*. It is a *checklist*." |

The pattern: short (3–5 word) Fraunces headline with one or two italic
words carrying the rhetorical weight. Sometimes the italic word is
also in lime — but **at most once per page**, and at most 2 lime
moments in the entire deck (typically page 1 hero and page 5 highlight).

## Output Format

A multi-page landscape PDF, written to
`/mnt/user-data/outputs/<client>_gtm_audit.pdf`. Filename convention:
lowercase client slug + `_gtm_audit.pdf`.

After rendering, present the file via `present_files`.

## Common Pitfalls

- **Page 1 hero too tall.** The default `hero_block` uses 170px
  Fraunces. A 4+ word headline at that size needs 4 lines and
  pushes the metrics row off the bottom. Use a custom hero with
  120px font and 2-line max, OR shorten the headline to 2-3 words.
- **Page 6 tactics list overflow.** 9 tactic rows at 40px each plus
  the section header consumes ~720px. Adding an effort summary at
  the bottom blows past 900px. Either drop the summary or limit to
  8 rows.
- **Page 8 closing layout collision.** The closing page uses
  `justify-content: space-between` to push metrics to top and tagline
  to bottom. If the metrics tile_grid is too tall (e.g. 4 tiles
  instead of 3), the tagline gets clipped. Stick to 3 tiles.
- **Lime overuse.** Each page should have at most one lime element.
  The whole deck should have at most 2-3 lime moments. If you find
  yourself reaching for lime on page 5 AND page 6, demote one to
  indigo.
- **Crimson misuse.** Crimson is for severity:critical chips and
  the risk-callout left border. Don't use it for "warning" copy or
  decorative accents — that role belongs to amber.
- **Missing italic emphasis.** A headline with no italic word
  reads corporate. Every section headline should have at least one
  italicized word.
- **Forgetting `verify` step.** Always render the preview PNGs and
  look at each page. The renderer's output is a PDF — you can't see
  layout bugs in source.

## File Layout

```
gtm-audit-pdf/
├── SKILL.md                       ← this file
├── references/
│   ├── input_schema.md            ← shape of audit JSON files (same as gtm-audit-app)
│   ├── page_templates.md          ← code patterns for each of the 8 pages
│   └── voice_guide.md             ← headline/copy patterns; how to steal voice from strategy.md
├── templates/
│   └── audit_deck_template.py     ← starter scaffold with all 8 pages
└── examples/
    ├── anyreach_example.py        ← Anyreach reference (working code)
    └── anyreach_example.pdf       ← rendered reference PDF
```
