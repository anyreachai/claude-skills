---
name: "portfolio-cx-brief"
description: "Build a prospect-branded Portfolio CX Intelligence Brief deck for a multi-brand enterprise: CX Intel reviews + IVR Swarm benchmarks + live production AI demos, per brand."
---

# Portfolio CX Intelligence Brief

The AMB format ("Eight brands. One gap."), generalized to any F500 or global enterprise with multiple brands, divisions or regions, and extended with two proof layers AMB didn't have:

1. **CX Intel** (AnyCRM) tells them what their customers say, per brand.
2. **IVR Swarm** (Anyreach Core) shows what their call center actually does, per toll-free line, benchmarked against our AI.
3. **Production AI** is the agent we already built from their own site and their own IVR flow, live per brand.

The story always runs: *your brands are strong → the infrastructure under them isn't → we measured it (reviews + phone lines) → we already built the fix → phased plan.*

Usually delivered by a BPO partner to its enterprise prospect, so white-labeling matters (see Step 0).

---

## Step 0: Inputs

| Input | Required | Notes |
|---|---|---|
| Parent enterprise name + URL | yes | e.g. AMB / blankfamilyofbusinesses.com |
| Entity list (brands, regions, divisions) | no | If absent, discover it in Step 1 |
| Presenting party | yes | `anyreach` or a BPO partner (Startek, ResultsCX, iQor, eSAL, CCI…). If a partner: cover reads "Prepared by {Partner} × Anyreach", CX Intel is branded "{Partner} CX Intelligence Labs" |
| Toll-free numbers per entity | no | Needed for the IVR section. If none, look them up on each entity's contact page and confirm with Richard before dialing |
| Existing CX Intel deliverables | no | PDF / XLSX / PPTX already generated (like the Vistra set). Use them instead of re-running |
| Existing IVR Swarm / Compare reports | no | Screenshots or exports. Use them instead of re-running |
| Demo links per entity | no | AnyCRM auto-provisioned demos or Anyreach agent links |
| Urgency hooks | no | Events, launches, leadership changes, seasonality (AMB's was FIFA 2026) |
| Output format | no | Default: editable .pptx in the Anyreach editorial system. Use a Slides artifact if asked |

Ask only for what blocks you: the presenting party, and permission to dial numbers. Everything else, discover and state what you assumed.

---

## Step 1: Map the portfolio

1. Pull the parent site, About/Our Brands pages, the 10-K or annual report (public cos), and press releases. List every customer-facing entity: brands, regional subsidiaries, divisions, venues, properties.
2. Group entities into **divisions** (AMB: Sports & Entertainment vs. West/Ranches). A division = entities that share a customer type or an operational model. Aim for 2–4 divisions, 5–12 entities total. If there are more than 12, take the ones with consumer-facing contact centers and real review volume, and list the rest in the appendix.
3. For each entity capture: name, slug, domain, division, one-line description, primary customer channel (phone / in-person / digital / app), toll-free number if public, and HQ region.
4. **Gate:** show Richard the entity list and divisions in one short table before spending API credits. Skip the gate if he has said to run unattended; state the list at the top of the deliverable instead.

Save as `work/{parent-slug}/entities.json` (schema at the bottom).

---

## Step 2: Brand assets via context.dev

The deck must look personally designed for them: real logos for every entity, the parent's mark on the cover, their language and values in the copy.

Auth: `Authorization: Bearer $CONTEXT_DEV_API_KEY` (ask Richard for the key if it isn't in the env). Base: `https://api.context.dev/v1`.

**Per entity: logos + colors**
```
POST /v1/brand/retrieve
{"type": "by_domain", "domain": "<entity domain>"}
```
Use `brand.logos[]`: pick `type: "logo"` for wordmarks and `type: "icon"` for the small logo strip. Pick by `mode`: `dark` logos on cream slides, `light` logos on ink slides; use `has_opaque_background` logos only inside a white rounded tile. Also keep `brand.colors[]`, `brand.description` and `brand.socials`.

**Parent: full style guide**
```
GET /v1/web/styleguide?domain=<parent domain>
```
Use `styleguide.colors`, `typography` and `fontLinks`.

Download every logo to `work/{parent-slug}/brand/{entity-slug}/`. Convert SVG to PNG at 4x (cairosvg) and trim transparent padding so logos align on a common baseline. If context.dev misses an entity, fall back to the `brand-style-extractor` skill or the site's favicon / og:image, and flag it.

**How the prospect brand is applied** (AMB rule: personalization comes from *their* assets and words, not from repainting our system):
- The Anyreach editorial system stays primary: cream + ink alternation, indigo / lime / coral accents, hairline tile grids, small-caps eyebrows.
- Parent logo sits top-left on the cover. A logo strip of every entity goes on the cover. Entity logos head every entity card.
- The parent's primary color appears in **one** place only: the cover rule and the closing CTA accent. Never in data encodings.
- Copy mirrors their own language: brand values ("People First"), founder name, property and venue names, and their own taglines quoted back.
- Agent persona names are human and brand-appropriate ("Emily").

---

## Step 3: CX Intel per entity (AnyCRM API)

If Richard attached finished deliverables, parse those instead (PDF via `pdftotext -layout`, XLSX via openpyxl: sheets `Review Summary`, `Reviews`, `Market & Journey`, `Competitive Context`, `Recommendations`).

Otherwise run one CX Intel run covering every entity. Docs: https://docs.anycrm.anyreach.ai/concepts/customer-intelligence. The full endpoint list is at https://docs.anycrm.anyreach.ai/llms.txt. Auth is a Bearer PAT / org key (see `/authentication.md`). Get the API base host from Richard or the authentication page; don't guess it.

```
POST /customer-intelligence/runs
{
  "name": "{Parent} portfolio brief",
  "company_websites": ["<entity domain>", ...],
  "deliverables": {"kinds": ["cx_intelligence_report_pdf", "review_analysis_xlsx", "roi_model_xlsx"]},
  "phases": {"deep_enrichment": true, "stakeholder_mapping": true, "network_search": false},
  "requester_email": "<richard's email>"
}
```
- Poll `GET /customer-intelligence/runs/{id}/status`.
- At the resolution gate, `POST .../resolution`: confirm each entity resolved to the right company. Sub-brands often resolve to the parent; correct them.
- At the shortlist gate, `POST .../shortlist`: select **all** entities. Pain score doesn't filter this deck, because a low-pain entity becomes the "benchmark" archetype.
- Results with `gate_3_research_signal` (no review signal) stay in the deck as "greenfield / no CX footprint yet". That is a finding, not a gap in the data.
- Pull structured content with `get-cx-report-content`, files with `get-result-file-url`, and the public share link via the public-report endpoint (gated landing page: "Your customer-experience brief is ready"). Put each entity's share link in the appendix.

**Per entity, extract:** blended rating; reviews analyzed; platforms with ratings; positive / negative %; top themes with %; churn drivers with %; 2–3 verbatims with source; journey-stage breakdown; competitors and threat level; recommendations with deflection %; ROI estimate; Glassdoor / Indeed employee rating if present.

**The gap metric.** This is the core of the deck. For each entity compute the split that matches the business:
- in-person / product rating vs. digital / service rating (AMB: TripAdvisor or venue reviews vs. app, phone and service complaints), or
- consumer rating vs. employee rating (Glassdoor) when the employee score is lower. Low employee scores predict a consumer decline in 12–18 months.

State which split you used in the methodology footnote. Average the gaps for the cover stat.

**Data hygiene** (the Vistra output shows why):
- Drop platform rows with 0 analyzed or N/A ratings from slides.
- Reconcile counts: if the star distribution sums to more than the reviews analyzed, it's the platform total, so label it that way.
- Theme percentages are share of reviews citing the theme; they can sum past 100%. Say so.
- Market-share and market-position figures are AI-researched. Verify each against its source or cut it. Never present an unverified number.
- If an entity has fewer than 30 reviews, mark the rating "directional".

---

## Step 4: IVR Swarm per entity (Anyreach Core)

Only for entities with a toll-free line. Get Richard's OK before dialing a prospect's production line.

To run it, use the Anyreach MCP: `search_tools("ivr")` / `search_tools("swarm")`, `describe_tool`, then `call_tool`. If no tool exposes it, ask Richard for exports or screenshots of the runs.

**Swarm config per line:** caller goals matched to that entity's top review themes (e.g. a bill-spike theme → "explain my bill"), 25–50 agents, Balanced persona mix plus one Hard-mode run (elderly, accented, noisy, Spanish-first) when the entity is multilingual or international.

**Per line, extract:**
- one-line verdict
- outcome split: resolved / dropped / reached human / callback
- KPI grid with target status: AHT, FCR, CSAT, sentiment, hold, steps to answer, key presses, prompt time, intents understood, drop rate, reached-a-human, resolution rate
- IVR path funnel drop-offs
- top 3 friction hotspots with severity

**Hero Compare.** Pick the line with the worst friction and the most volume. Run Compare with IVR (old way vs. Anyreach agent, same scenario) and capture the scorecard: steps, key presses, identifiers demanded, prompt time, hold, intents understood, outcome, end sentiment. Capture the scale row too (annual calls, % reaching an agent, minutes, loaded $/min, IVR $/min vs. Anyreach $/min). Scale-row assumptions are editable; show them on the slide footer and source each one.

The swarm is also how the AI gets designed. Keep the mapped flow, intents, identifiers and friction points; they feed Step 5.

---

## Step 5: The designed production AI

- For each entity: a live demo link (AnyCRM auto-provisioned demo via `regenerate-demo` / `set-manual-demo`, or an Anyreach agent build), a screenshot of the agent on their site clone, languages, and the intents it handles.
- If one agent covers the whole portfolio (AMB's Emily on the parent site), lead with that. "One agent. One site. N brands."
- "Built on your call center": show the swarm-mapped IVR tree on the left and the Anyreach agent's single front door on the right. Show how many intents it already handles and which friction points are designed out (e.g. 8 identifiers → 1 verification).
- Proof stats: get current numbers from Richard (AMB used <3% agent attrition, 20+ yrs CX, 1.5M+ interactions, <1s latency). Don't reuse old numbers without checking.

---

## Step 6: Synthesize the narrative

Before building, write `work/{parent-slug}/narrative.md` with:

1. **The thesis line**, in the pattern "{N} brands. One gap." plus a one-sentence claim like "The brand is not the problem. The infrastructure is." It must be supported by the gap data. If the data doesn't support a single gap, find the true common thread and say that instead.
2. **Entity archetypes.** Assign each entity one: *Benchmark* (best-in-portfolio, proves the model; AMB's Mountain Sky), *Greenfield* (new, no CX debt; Drive GC), *Emergency* (employee or consumer collapse; PGA TS), *Scaling* (good, below benchmark), *Shared-infrastructure* (entities under one roof or audience; MBS / Falcons / United). The archetypes give the division slides their tension.
3. **Urgency hook**: an event, season, launch or reset window, with a date.
4. **5–7 interventions** sequenced in 3 phases (0–3 months quick wins tied to the urgency hook; 3–12 months operational layer; 12–18 months connect the portfolio, i.e. cross-entity CRM / one relationship across brands). Each intervention: which entities, which evidence (review theme or IVR friction), which Anyreach surface, and the metric it moves. Use the AnyCRM recommendation deflection % and ROI where available.

---

## Step 7: Deck structure

Build with the **anyreach-deck-pptx** skill (read its DESIGN_SYSTEM.md, PIPELINE.md and example_deck.py first). 16:9, alternating cream and ink slides. Headlines use the AMB pattern: a plain statement followed by an *italic accent phrase*. Every slide gets a small-caps eyebrow ("01 · CORE FINDING") and the Anyreach mark top-right. If a partner presents, add the partner mark top-right instead and put "× Anyreach" in the footer.

| # | Slide | Content |
|---|---|---|
| 1 | Cover (cream) | Eyebrow "PORTFOLIO CX INTELLIGENCE BRIEF · {MON YYYY} · CONFIDENTIAL"; parent logo; thesis headline; one-line subhead; entity logo strip; 4 stat tiles: entities analyzed, verified reviews, platforms, avg star gap (or lines dialed); "Prepared by … · For {Parent}" |
| 2 | Core finding (ink) | Paired horizontal bars per entity (strong side in indigo, weak side in coral) with gap column; "The pattern" callout |
| 3..k | One per division (alternate) | Entity cards: logo, rating, basis, one-line posture; urgency callout on the division that has it |
| + | Archetype deep dives (1–3 slides) | Pick from: Shared-infrastructure (one roof, N audiences); The opening and the emergency (greenfield vs. emergency, consumer vs. Glassdoor); The Benchmark numbers (8-tile stat grid + verbatim); Comparative table (benchmark vs. siblings, same rows) |
| + | "We called your lines" (ink) | IVR Swarm summary table: entity, line, agents, resolved %, drop %, AHT, identifiers asked, hold, top friction |
| + | Hero Compare (cream) | Side-by-side scorecard: their IVR / Anyreach / difference in plain words; scale row footer with annualized $ |
| + | Where the IVR loses them | Friction hotspots + IVR path funnel for the hero line; one verbatim from reviews that matches the friction (close the loop between Steps 3 and 4) |
| + | Built on your call center | Mapped IVR tree → single-front-door agent; intents covered; friction designed out |
| + | Recommendations | 5–7 interventions in a phased tile grid plus a "Sequenced outcome" tile |
| + | The solution (ink) | Product surfaces mapped to the interventions (Anyreach Core voice/chat/SMS/email agents, AnyCRM, AnyCOS where relevant); 4 proof-stat tiles; "Already live" callout |
| + | Demo · see it live | Site-clone screenshot + entity logo grid, each with a ▶ SEE LIVE hyperlink to its demo |
| last | Roadmap + close (cream) | 3 phase columns; benchmark line ("The Mountain Sky standard, *portfolio-wide*."); CTA ("Let's scope Phase 1 together.") |
| appx | Methodology & sources | Platforms, review counts per entity, gap definition, swarm config, scale-row assumptions, CX Intel share links, verification notes |

Aim for 14–20 slides. Cut a section rather than cram it. With no toll-free lines, drop the four IVR slides and make the Demo slide carry the proof. With one division, skip the division slides and go straight to archetypes.

**Copy rules:** short declaratives; numbers over adjectives; each slide makes one claim; verbatims are exact quotes with platform and handle; no generic AI filler. Nothing says "leverage", "seamless" or "revolutionize".

---

## Step 8: QA

- Render PPTX → PDF → PNG (per the anyreach-deck-pptx pipeline) and look at every slide: overflow, logo contrast on cream vs. ink, logo baseline alignment, and no text colliding with logos (the AMB division slides had subheads running into the logo row; watch for that).
- Every number traces to entities.json, a CX Intel result, or a swarm report. Spot-check 5 numbers against the source files.
- Cover stats equal the sums and averages of the per-entity data.
- All SEE LIVE links and share links resolve.
- Partner white-label is consistent: no stray "Startek" in an iQor deck, and no "Anyreach CX Intelligence Labs" in a partner deck.
- For high-stakes decks, have a fresh subagent re-check the numbers against the source files without seeing the deck copy.

---

## Outputs

- `{Parent}_Portfolio_CX_Brief_{YYYY-MM-DD}.pptx` (or `{Parent}_{Partner}_…` when a partner presents)
- `entities.json` and `narrative.md` (kept for re-runs and the follow-up deliverables)
- Optional: one combined review workbook across entities (consumer-intelligence-xlsx), and per-entity CX Intel share links in a short list for the follow-up email

Related skills: `bpo-roi-brief` / `bpo-roi-model` for the outcomes-pricing follow-up; `stakeholder-intel` for the exec map; `personalized-sales-deck` for a single-brand first-call deck.

---

## entities.json schema

```json
{
  "parent": {"name": "", "domain": "", "logo": "brand/parent/logo-dark.png", "values_language": [], "urgency_hook": {"label": "", "date": ""}},
  "presenter": {"type": "anyreach|partner", "partner_name": "", "partner_logo": ""},
  "gap_definition": "in_person_vs_digital|consumer_vs_employee",
  "divisions": [{"name": "", "entities": ["slug"]}],
  "entities": [{
    "slug": "", "name": "", "domain": "", "division": "", "archetype": "benchmark|greenfield|emergency|scaling|shared_infra",
    "logos": {"on_cream": "", "on_ink": "", "icon": ""},
    "cx": {"blended_rating": 0, "strong_side_rating": 0, "weak_side_rating": 0, "gap": 0, "reviews": 0, "platforms": [{"name": "", "rating": 0, "n": 0}], "employee_rating": null, "themes": [{"label": "", "pct": 0}], "churn_drivers": [{"label": "", "pct": 0}], "verbatims": [{"quote": "", "source": ""}], "share_link": "", "directional": false},
    "ivr": {"number": "", "swarm": {"agents": 0, "goal": "", "resolved_pct": 0, "drop_pct": 0, "aht": "", "hold": "", "identifiers": 0, "key_presses": 0, "verdict": "", "friction": [{"label": "", "severity": "", "detail": ""}]}, "compare": null},
    "ai": {"agent_name": "", "demo_url": "", "screenshot": "", "languages": [], "intents": []}
  }]
}
```