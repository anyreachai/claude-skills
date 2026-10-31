---
name: "bpo-partner-pitch-deck"
description: "Build the Anyreach 3-play partner pitch deck (IVR Swarm, AnyCRM, BPOIndex) for any BPO: plug in their name, execs and top 10 competitors."
---

# BPO partner pitch deck

A 21-slide Slides artifact pitching a BPO's leadership on sales and competitive advantage through three plays:
1. **IVR Swarm**: win the pursuit
2. **AnyCRM**: run the funnel
3. **BPOIndex**: steal the rest

The master is the Startek | CCI deck: https://claude.ai/artifact/Amv3suWeuXBU7AChKzsAPf. Every new deck is a copy of that master with the BPO-specific parts swapped. Never edit the master itself.

## 1. Collect inputs

Ask in one short message for what's missing. Default anything not given and say what you defaulted.

- **BPO display name.** Use a combined name if merged, e.g. "Startek | CCI". Also get the short name used in body copy.
- **Attending execs**, with names and titles, for the cover.
- **Slug** for the CTAs:
  - `https://app.anyreach.ai/<slug>`
  - `https://anycrm.anyreach.ai/<slug>/dashboard`
  - Default the slug to the lowercase short name.
- **Top 10 competitors** with domains. If not given, research them: peers by size, geography and verticals.
  - Flag any competitor that is an Anyreach partner or prospect (iQor, ResultsCX, EGS, Startek, CCI, eSAL). Ask before naming a partner as a competitor in front of another partner.
- **Search data:**
  - Google Keyword Planner CSV for the 10 competitor brand terms plus the BPO's own brand. The file is UTF-16 and tab-separated, so decode with `iconv -f utf-16`.
  - Organic traffic per competitor (Ahrefs MCP or a research .md). If either is missing, pull it with Ahrefs, or ask Richard for the export.
- **Screenshots, optional:**
  - The BPO's BPOIndex profile page.
  - Their AnyCRM workspace: prospecting run, leads, lead funnel, contacts, activity, deals, pipeline, forecast.
  - A fresh IVR Swarm or Compare run on one of their clients' lines.

## 2. Confidentiality: never carry another partner's data across

- **AnyCRM screenshots in the master are Startek's live workspace.** They show Startek accounts, deals (AT&T, Sharper Image, Fabletics, GameStop) and contacts. Never reuse them for another BPO. Use the new BPO's own workspace screenshots. If there are none, use the dashed placeholder frames and tell Richard which screens to capture.
- **The Startek BPOIndex profile screenshot** is for Startek only. Replace it with the new BPO's profile, or fall back to the BPOIndex homepage screenshot alone.
- **The IVR Compare and Swarm screenshots** are EyeMed (a ResultsCX client) and a benefits line. Ask Richard before showing them to a ResultsCX competitor. Prefer a fresh run on the prospect's own client line.
- Strip master speaker notes that name Startek programs, War Room files or Startek deals.

## 3. Create the deck

1. Create a new Artifact from the Slides type, titled `Anyreach × <BPO>`, with `auto_open: "after_first_write"`.
2. Read the master's files in one call: `action: "read"`, `url`: the master, `paths`: `project/deck.json` and every `project/slides/<id>.html` in its `order`.
3. Copy files to one local root and make the edits in section 4 with the file tools.
4. Copy reusable assets server-side, without re-uploading: `publish`, `url`: new deck, `asset: true`, `from_url`: master, `asset_ids`: the ones you keep. Then swap each `/_blob/<old>` src for the url the copy returns. Reusable IDs:
   - `c2a9c1368eff751b67dee01481a105a1`: BPOIndex conquest ad mockup (search for "teleperformance")
   - `91a0b370686b40b67ee2964a88adc491`: BPOIndex homepage
   - `eb7ae2aa431fcbd8fe1df76d0bff2b91`, `46598693f033ae4db775b8e1c1252548`: IVR Compare views, EyeMed (see section 2)
   - `244cd03f7ffb20b58623afb85686d8ac`, `1424a577def26a1c833eca5527fababf`: IVR Swarm report views (see section 2)
5. Upload any new screenshots with `asset: true` and `file_paths`.
6. Publish `project/deck.json` plus the cover first, then the remaining slides in a few calls.

## 4. What to change, slide by slide

Master order: `cover, agenda, div-ivr, ivr-what, ivr-motion, ivr-compare, ivr-swarm, ivr-why, div-crm, crm-intro, crm-motion, crm-top, crm-mid, crm-bottom, div-bpo, bpo-traffic, bpo-cost, bpo-forecast, bpo-flow, bpo-shelf, next`.

- **Everywhere:**
  - Replace "Startek | CCI" with the display name, and "Startek and CCI" / "Startek" with the short name.
  - Replace `/startek` CTAs with the slug.
  - Update the footer "Anyreach × … · Confidential".
  - Grep the slides afterwards for `Startek|CCI|Bharat|Martin|/startek`. Zero hits is required.
- **cover:** exec names and titles, and the month and year.
- **crm-intro, crm-bottom, div-crm:** the master leans on the "two companies, one forecast" merger angle. Keep it only if the BPO is merged or multi-brand. Otherwise retitle crm-bottom to "Every program, one forecast" and drop the merger lines.
- **crm-top, crm-mid, crm-bottom:** new screenshots or placeholders (section 2). Rewrite the speaker notes to describe what is actually on screen.
- **bpo-traffic:** a horizontal bar chart of the 10 competitors plus the BPO (two rows if merged), sorted descending.
  - Bar width is `760 × value / max` px.
  - Competitor bars are `#A5B4FC`. The BPO's rows are `#EA7A1A` with bold `#C2410C` labels marked "(you)".
  - Recompute the totals card (competitors' total vs. the BPO's total, "about 1 in N"). The orange "The opportunity" panel shows the competitors' total minus the BPO's.
  - The title is "<total> visits a month to capture".
  - Keep the "includes job-seeker traffic" caveat in the footer.
- **bpo-cost:** one row per competitor brand term, using searches and the low–high top-of-page bid from the CSV.
  - The bar track is 720px for $0–$9: bar `left = low/9 × 720`, `width = (high − low)/9 × 720`.
  - Footnote any outlier (e.g. ibex, the animal).
  - Keep the "Window of opportunity" banner and its "pennies on the dollar" message. The speaker note says whether anyone bids on the BPO's own brand.
- **bpo-forecast:** an animated embed.
  - Set `POOL` to the summed monthly brand searches: the low end of each Keyword Planner range, outliers excluded, +20% for Bing.
  - Keep `TI=[10000,25000,50000]`, `CPC=5`, `LR=.03` (visit→lead) and `WR=.15` (lead→win) unless Richard gives others.
  - Pipeline stays **$xM potential**. Never show a dollar ACV/TCV number we don't know.
  - Update the footnote to match.
- **bpo-flow:** "lands in the <BPO> pipeline" and the notes.
- **bpo-shelf:** the BPO's BPOIndex profile screenshot, or the homepage alone.
- **next:** three CTAs with the new slug, and bpoindex.com.
- **Motion slides (ivr-motion, crm-motion):** generic. Reuse them as they are.

## 5. House rules for this deck

- Visual over text: one idea per slide, illustrations or charts on every card, no paragraph a reader must read.
- Motion embeds keep a painted dark background (`#0C0C12`), never a transparent or white box.
- Brand: Literata headings, Inter body, indigo `#4F46E5` accent, orange `#EA7A1A` for BPOIndex and "you". Dark `#0C0C12` and light `#F7F7F4` slides alternate. Section dividers have big numerals 01/02/03.
- No numbers that will get called out:
  - Every figure traces to the CSV, the research or a labeled assumption.
  - Case-study stats (10×, 2 months, $3M→$15M) stay only if Richard confirms they're cleared for this audience.
- Be honest in the notes: most branded BPO search is job seekers, and the buyer slice is the prize.

## 6. Finish

Reply in 3–5 lines:
- which inputs were defaulted
- which screenshots are still placeholders
- any partner-as-competitor flag

Remind Richard the deck is private until he shares it.