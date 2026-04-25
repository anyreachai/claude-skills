Deep audit of all 130 BPO Insights blog posts for errors and consistency.

## Instructions

Run 3 parallel audit agents against the blog pipeline at `C:\Users\Lin Richard\Desktop\bpo features\`:

### Agent 1: Source File Format (26 Thursday posts)
1. Read all 26 files matching `content/Content/week*_thursday_*.md`
2. Check each file for 18 criteria:
   - Header: `# CONTENT SET #4 — THURSDAY: "The Operator's Playbook"`
   - Pillar line with correct quarterly arc (W1-8: Q1, W9-17: Q2, W18-26: Q3)
   - `---` separators in correct positions
   - `## LONG-FORM SEO/AEO BLOG POST` header present
   - `**Title:**`, `**Meta Description:**` (150-160 chars), `**Target Keywords:**`, `**Word Count Target:**` all present
   - 5-7 `### ` section headers in blog body
   - `*Published by the Anyreach editorial team.*` present
   - `## LINKEDIN POST` with Day: Thursday, Program/Pillar: The Operator's Playbook
   - `## VISUAL/INFOGRAPHIC DESCRIPTION` and `## ENGAGEMENT OPTIMIZATION` sections present
   - No Anyreach financials (no MRR, revenue, customer counts)
   - No first-person founder narrative in blog body
   - Blog word count 1,200-2,000 words

### Agent 2: Pipeline Outputs & Manifest
1. Validate `blog-pipeline/output/manifest.json`: valid JSON, 130 entries, 26 Thursday + 104 non-Thursday
2. All Thursday entries: `is_thursday: true`, `status: "completed"`, `images: []`, `markdown_output: true`, `html_output: true`
3. Zero old Thursday slugs (healthcare_beachhead, website_cloning, etc.)
4. Count files in `output/markdown/` (expect 130 .md) and `output/html/` (expect 130 .html)
5. Verify all 26 Thursday HTML files have `<!--kg-card-begin: html-->` wrapping and Ghost signup forms
6. Validate `output/schedule_progress.json`: completed array has 104 entries, failed is empty, no old Thursday titles
7. Verify `ghost_uploader.py` config: line ~41 has `"thursday": "04_the_operators_playbook.png"`, line ~50 has `"thursday": "The Operator's Playbook"`

### Agent 3: Full 130-Post Consistency
1. Verify 130 source files exist in `content/Content/` (5 per week x 26 weeks)
2. Cross-reference every source file has matching .md in `output/markdown/` and .html in `output/html/`
3. Check for orphaned output files with no source
4. Verify 5 feature images exist in `content/Feature Images/`
5. Count in-post images: expect 0 for Thursday, 3 per post for other days (312 total non-Thursday)
6. Spot-check parser compatibility: filename regex, pillar extraction, blog boundary markers

## Output

Present a consolidated summary table:

| Category | Status |
|----------|--------|
| Source files (format) | Pass/Fail + details |
| Manifest integrity | Pass/Fail + details |
| Output files (count) | Pass/Fail + details |
| Ghost config | Pass/Fail + details |
| Schedule progress | Pass/Fail + details |
| Feature images | Pass/Fail + details |
| In-post images | Pass/Fail + details |
| Cross-reference | Pass/Fail + details |

List all errors found with file paths and specific fix instructions.
