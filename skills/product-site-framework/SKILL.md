---
name: "product-site-framework"
description: "Build a full motion-driven marketing website for any product end to end (copy, layout, visuals, motion, build, QA) using Richard's site framework. Use for any new product site or redesign."
---

# Product site framework

The framework behind the anyreach.ai and AnyCRM sites, written so it builds the same quality of site for **any product**. Apply it to a new product site, a redesign, a single new page, or a full pass on an existing site.

Brand is an input, not part of the framework: for Anyreach products load `anyreach-web-design` (tokens, header/footer, assets, DC gotchas); for anything else use the product's own brand guide, or commit to a small system (1 serif display + 1 sans body, white/zinc neutrals, one accent, one dark ground). Reference build to read when you need exact markup: AnyCRM Website canvas https://claude.ai/artifact/ThsRCw3nVSDy6p2tMGqGJi.

## 0. Inputs (gather before building; ask only for what you can't find)
- Product name, one-line promise, who buys it (address them as "you").
- 3–5 capability areas → one **product page** each.
- 4–6 buyer roles → one **role page** each.
- Real proof: verified quotes (role, org descriptor, date, how captured), logos you may show, honest aggregate numbers.
- Integrations list, pricing model, primary CTA + link.
- The live site or docs to source capability claims from.
If a fact is missing, use a visible placeholder ([PRICE], [LOGO]) — never invent it.

## 1. Sitemap (default)
Home · product pages (one per capability) · role pages (one per buyer) · Integrations · Pricing. Shared sticky glass header (Product ▾, Solutions ▾, Integrations, Pricing, Docs, Log in, primary CTA) and a light footer with a thin accent hairline (Product / Solutions / Resources / Legal, trust/compliance row). On a Design canvas: one column per template, 1440-wide fill pages, 120px apart, heights measured.

## 2. Copy system
- **Not wordy.** H1 and H2 are two short lines (a claim, then a turn: "Price the outcome. / Defend the margin."). Subs 1–3 sentences. Proof bullets ≤8 words. Stats labels ≤ ~24 characters.
- **Pain in the buyer's voice**: problems are first-person quotes tied to a moment in their week ("Mon · 08:30 · Forecast call — 'I find out a deal slipped when the rep says so.'").
- **Specific nouns over adjectives**: show the record, the number, the artifact ("500 reviews · any language · 18-page report").
- **One CTA per hero** (Talk to sales / Request a demo). Page CTAs are concrete offers in the page's terms: "Send us one account. Get the report." + three steps with timing (Today → On the call → This week).
- **Honesty rules**: capability claims must exist in the product/docs; stats are product facts, never invented outcomes; every product screen says "Sample data"; demo companies are fictional; testimonials only verbatim from the verified list; forms not wired say "Prototype". Flag CTA promises and unverified claims back to Richard.
- Ban: generic SaaS filler ("supercharge", "seamless", "unlock"), stacked adjectives, emoji, triple-clause subs.

## 3. Page templates

### Home
1. **Video hero**: looping muted product/brand video behind a white left-to-right scrim; H1 + one-line sub; primary CTA + "Watch the overview" modal.
2. **Trust bar**: logo marquee ("Work our partners trust us with").
3. **Why now**: pinned scroll story with three 3D glass slabs stacking (three verbs, e.g. Detect · Win · Expand).
4. **Product tour** (dark): coverflow carousel of recreated product screens, auto-advancing chapters with zoom-and-focus spotlight on one element per slide.
5. **How it works** (light): second pinned story, three steps (e.g. Insights · Execute · Win).
6. **On the record**: full social proof (word-by-word hero quote, proof cards with small 3D scenes, drifting quote wall, count-up tally).
7. **Closing CTA** (dark) with a short intake form, then footer.

### Product page (one per capability)
1. **Video hero**, eyebrow `Product · <Name>`, two-line H1, one-sentence sub, one CTA.
2. **Showcase** (dark): centered H2 + a recreated app screen that tilts flat on scroll, counts its KPIs up, then lands a status card.
3. **Problem + Moments**: sticky stacking cards (each pins at the top, the previous scales back). Card 0 = the problem (H2, sub, three pain tags, a messy "before" scene). Cards 1–4 = standout features (H2, sub, one stat line, a two-stage scene: inputs fly in, then shrink back as the output lands). Alternate left/right.
4. **On the record** compact (page-specific H2, hero quote, wall, tally).
5. **Page CTA** (dark): concrete offer + 3 steps.

### Role page (one per buyer)
1. Hero + **film**: two-line H1 in the role's terms, sub, CTA, 3 product-fact stats; right side a 6-chapter coded walkthrough of the role's story (problem → why → evidence → action → human approves/sends → record updates), chapter pills with progress fill, caption bar, "Sample data · a coded walkthrough".
2. Role strip: every role as pills, current one dark.
3. Problem + Moments stack: "Your week today" then three "how your week changes" cards.
4. **Where this role lives**: the product's lifecycle as a numbered spine (e.g. Find · Price · Win · Deliver · Pilot · Run) with the role's stages lit and a travelling pulse; 6 use-case cards linking out.
5. On the record compact (a different quote per role). 6. Role CTA with an offer.

### Integrations
Hero with an orbit hub (product mark center, inner and outer rings of logo tiles, animated dashed beams) → tabbed, searchable logo catalog (unshipped connectors labelled Preview) → developer/API or MCP section with a typing terminal → CTA.

### Pricing
Hero → **ROI ledger** (the tools it replaces, struck through line by line, with cost bars and the total) → plans + trust → short FAQ → CTA form.

## 4. Visual system
- Light/dark rhythm: alternate white, #FAFAFA and near-black sections; never two dark sections with the same layout back to back.
- Dark sections: near-black ground, radial accent glow, faint 64px grid masked radially. Problem sections use a red-tinted glow.
- **Recreate product UI in code** instead of screenshots: fixed design canvases (600×400 feature, 380×190 mini, 960×600 tour) scaled to their container; glass cards, panels, status chips (info/ok/warn/bad/muted), avatars, bars, health rings, column charts, KPI tiles, message cards, timelines, terminals.
- Each screen tells one story with a before → after; never a static dashboard. Fill every frame; if a frame is "waiting", show a working skeleton.
- Type: serif display for H1/H2 (tight tracking), sans for body, small uppercase eyebrows in the accent. Cards 16–28px radius, 1px borders, hover lift with accent-tinted shadow.
- No AI tropes: no gradient-wash heroes, left-border cards, emoji icons, stock illustration. Inline stroke SVG icons only.

## 5. Motion system
- **Static vs live**: static when the page can't scroll, the viewport is ≥ 2000px tall (canvas) or prefers-reduced-motion → every scene at its final state, films on the last chapter, stacks unpinned. Re-check every 600ms.
- Reveal on scroll (IntersectionObserver → `.in`, staggered 12–18px rises), rAF count-ups, typing text, dashed beams, ping dots, ring fills, bars scaling in.
- Signature set pieces (reuse, don't reinvent): pinned 3D slab story, coverflow tour with spotlight zoom, sticky stacking moments, auto-advancing chapter film, orbit hub, logo marquee, drifting quote wall, tilting showcase window, word-by-word quote.
- Timing: 200–300ms UI transitions, 0.6–1.1s scene reveals, 5–6.5s per film/tour chapter; pause on hover, off-screen and ~9s after a manual click. Phones/short viewports: no pinning; scenes play as they enter.

## 6. Build pipeline
1. Read the existing site/canvas and sources; settle the inputs above and write all page copy first (it is the content map).
2. **Generate, don't hand-edit**: a Python generator (shared chrome + template + per-page content data + scene primitives) writes every page of a template. A shared change means regenerating all pages that use it.
3. On a Design canvas, follow the Design type's file rules (one `.dc.html` per page, `support.js` head line, `renderVals()` holes, `.sc-interp` inherit rule).
4. **Verify in a real browser** (Richard expects it): serve pages with the canvas runtime as `support.js`, Playwright Chromium; live at 1440×900 (scroll with `window.scrollBy`, capture every section, click every film/tab chapter), static at 1440×2400 full page, and 390px. Zero page errors. Tile screenshots into contact sheets and fix empty frames, wrapping chips, overflow, overlaps, long stat labels.
5. Publish only changed pages plus the canvas index when sizes or layout change. Reply in a few lines: what changed, then flags (sample data, placeholders, promises, unverified claims).

## 7. Gotchas
- Check new class names against the shared CSS before using them (e.g. `.roles` was already `display:none`).
- Chips in flex rows need `flex:none`; panels need `overflow:hidden`.
- Combine label and timing in one chip ("Email 1 · Day 0").
- Keep mini-scene cards clear of corner badges; keep side panels short rather than full height.

## 8. Handoff (when asked)
Static bundle + HANDOFF.md: routes, must-wire list (forms, videos, CTA, search), content flags with sources, tokens, motion spec, QA checklist.