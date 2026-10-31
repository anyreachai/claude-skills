---
name: "anyreach-web-design"
description: "Design and build Anyreach marketing sites (anyreach.ai, anycrm.anyreach.ai, anycos.ai) in the established anyreach.ai redesign system: brand tokens, shared header/footer, motion patterns, reusable assets."
---

# Anyreach web design system (from the Oct 2026 anyreach.ai redesign)

Reference build: Design artifact "Anyreach.ai Website" — https://claude.ai/artifact/EdqBwdL5KQW8dkcQN4gMSB (6 artboards: Main/Homepage, Anyreach core platform, HowWeWork, Research, About, Legal). Read it with the Artifact tool (`action: read`, `path: project/<Page>.dc.html`) whenever you need exact markup, CSS or JS to reuse. Copy its uploaded images into a new artifact with `publish` + `asset: true` + `from_url` + `asset_ids` (max 10 per call) instead of asking Richard to re-upload.

## How Richard works (follow these)
- Not wordy. Short, scannable copy and replies. Every section highly visual and motion-driven; avoid "vanilla" text-and-card layouts.
- Never delete sections he has approved unless he asks. Make targeted changes.
- He reviews on the Design canvas and in focused view. Verify every change in a real browser (Playwright + the artifact's dc-runtime as support.js, served over http) before publishing; check for page errors and visually inspect screenshots.
- Flag claims honestly: sample data labelled "Sample data", fictional demo brands labelled illustrative, unverified numbers called out.
- Forms are not wired: never fake a success state without labelling it "Prototype".

## Brand tokens
- Fonts: Literata (headings 600–700, tracking −0.02/−0.03em), Inter (body/UI), ui-monospace for small labels. Google Fonts link: Literata:wght@400;500;600;700 + Inter:wght@400;500;600;700.
- Colors: ink #09090B (also dark section bg), zinc text #3F3F46 / #52525B / #71717A / #A1A1AA, borders #E4E4E7 / #F4F4F5, surfaces #FFFFFF / #FAFAFA. Indigo: 700 #4338CA, 600 #4F46E5 (primary), 500 #6366F1, 400 #818CF8, 300 #A5B4FC, 200 #C7D2FE, 50 #EEF2FF. Status: green #22C55E/#16A34A, amber #F59E0B, red #EF4444.
- Type scale: .h1 clamp(40px,5.2vw,72px)/1.04; .h2 clamp(32px,3.8vw,52px)/1.1; .sub clamp(17px,1.4vw,20px)/1.6; eyebrow 13px 600 uppercase .12em indigo (#818CF8 on dark).
- Layout: .wrap max-width 1280px, 24px gutters; sections 104–112px vertical padding; cards 16–24px radius, 1px #E4E4E7 border, hover lift translateY(-4px) + indigo-tinted shadow 0 30px 60px -34px rgba(79,70,229,.45).
- Dark sections: #09090B + radial indigo glow (radial-gradient(closest-side, rgba(99,102,241,.26), transparent)) + optional faint 64px grid masked radially.
- Buttons: primary bg #4F46E5 (or ink #09090B hover indigo), white text, 12px radius, 48–52px tall; secondary 1px border.

## Shared chrome (keep identical across Anyreach sites)
- Header: sticky glass bar (white/70 + backdrop-blur), logo lockup left; nav: Products ▾ (megamenu: Anyreach, AnyCRM → https://anycrm.anyreach.ai/, AnyCOS → https://anycos.ai/, each with a one-line description) · How we work · Research · About · Documentation (https://docs.anyreach.ai/getting-started/introduction) · Log in (https://app.anyreach.ai) · Talk to Sales.
- Talk to Sales / Book a demo → https://calendar.app.google/GSqJ2h6JJouB9Ub58 (new tab).
- Footer: light #FAFAFA panel with 3px indigo gradient hairline on top (must contrast with dark CTA above). Columns: brand + "Visit Trust Center" button (https://anyreach.trust.site/) | Company | Products | Trust (Trust Center, GDPR portal https://app.prighter.com/portal/14558697436) | Legal (Terms, Privacy, SMS Consent). Compliance pills in three rows: Audited (SOC 2 Type II, HIPAA, PCI DSS, GDPR), Aligned (NIST AI RMF, OWASP LLM Top 10, AIUC-1, SAFE AI / CoSAI), In progress (ISO 27001, ISO 42001, HITRUST). No FedRAMP in footer.

## Product language
- Products: Anyreach (a.k.a. Anyreach Core, omnichannel agentic AI), AnyCRM ("the agentic CRM built for how BPOs sell, from buying signal to signed outcome"), AnyCOS ("the operating layer for your floor: every call scored, coaching drafted, staffing forecast").
- Audience: BPO leaders. Address the BPO as "you", the enterprise as "your client". "Under your brand" = white-label branding, not IP ownership.
- Homepage H1: "Become the AI-native BPO." Platform line: "The operating system behind the AI-native BPO."

## Motion patterns that worked (reuse)
1. Static vs live mode: on the canvas (no scroll, or innerHeight ≥ 2000) or prefers-reduced-motion, render final states; otherwise animate. Re-check the mode every ~600ms (frames resize after mount) — a one-time check at mount caused "motion stopped working" bugs.
2. Reveal-on-scroll via IntersectionObserver (.rvs.in .rvi: opacity + 12–18px translate, staggered transition-delay) plus rAF count-ups.
3. Pinned scroll story (homepage Why now): sticky stage, progress P = clamp((64 − rect.top)/(height − (innerHeight − 64))), 3D glass slabs rotateX(58deg) rotateZ(−32deg) stacking with translateZ.
4. Recreated dark product screens (no screenshots needed): fixed 960×600 design canvas scaled with transform scale(k) where k = container width / 960; zoom-and-focus by computing a [data-focus] element's offset rect, then translate/scale toward it with a box-shadow spotlight (0 0 0 3000px rgba(5,5,8,.62·z)) and a glass callout fading in.
5. Product tour as auto-advancing coverflow carousel: active slide centered, neighbors ±74% translateX, scale .8, rotateY ±14deg, opacity .38; 6.5s per slide with zoom running inside; pauses on hover, off-screen, and 9s after manual click; chapter pill tabs with progress fill.
6. Hero product window tilting from rotateX(16deg) to flat on scroll, with 2–3 floating glass toast cards.
7. Integrations hub: center Anyreach mark, two rings of white logo tiles (inner contact center, outer CRM) with animated dashed beams; tabbed, searchable logo-card grid beside it.
8. Face orbit hero, logo marquee, drifting quote wall, toggles that flip whole visuals (traditional → AI-native).

## DC (Design artifact) gotchas — learned the hard way
- Template holes render inside <span class="sc-interp">. Any CSS like `.card span{font-size:13px}` shrinks numbers inside <b>{{x}}</b>. Always include: `.sc-interp{font:inherit !important;color:inherit !important;letter-spacing:inherit !important;text-transform:inherit !important;line-height:inherit !important}`.
- Never put boolean attributes on holes (disabled="{{x}}" disables even when false). Use aria-disabled + a class.
- Event handlers like onError="{{item.fn}}" inside sc-for can throw "item is not defined"; avoid per-item onError.
- A span child selector can catch decorative elements (e.g., `.row span` styled an absolutely positioned dot); use <i> or specific classes.
- Holes cannot carry HTML; switch content with sc-if blocks or CSS-mask icons.
- `required` must be `required="required"`; data-props JSON single-quoted.
- Generate pages from a Python generator (shared header/footer/CSS/base JS) rather than hand-editing; regenerate all pages after a shared change.

## Reusable assets in the reference artifact (copy by id)
- Lockup light d017f8de551221aed10d11bf09cb208d · lockup dark 87a281595d34c979ee721a56e943d293 · AnyCRM mark e6bdbb68b155a98c96c869ae04a5e614
- Product screenshots: AnyCRM 17dee46779d99ce44634c909215cd5e7 · Anyreach Core ab91c1c47cecf55f250b296f2eee8137 · AnyCOS 5849aeef280ebc5cdbfced52e6a60923
- Client logos: Walmart 135d47cc5df01ad72dd91c147cfa4ca5, AT&T 0152f466c1e71b67b2ae7f2d5ad29748, Centene 6f6968fbea0c2773e57217b1ffdd2727, Best Buy 5e668464d7ff99886fc4797a66c2dff4, GCB 3521be063c87f2befa1f169ce88fb523, Marriott 4742daaff945af255d79f36e9c6a92db, The Home Depot 19a8d141551be6158691e3f8ce82da3c, Wells Fargo 11b90491ab2091986e648c68a06091b7, Cloudflare c9e4c13fd5a0a23aa8f403d4b6e13d2e, TikTok 6738bf58692ea93f83c09b861bfa4301, Labcorp cfdd6e51c53c4d50fbf05403f0feea25
- Compliance logos: SOC 2 715d0e9d7936ddb0aa5b995a34b8b1c0, HIPAA e0d064119bf7a74eaad5adb95c339ea1, PCI DSS 063929774e87a0fda31a87568e7be7d8, GDPR 04710560239fa7e0fd618559e16e9988, NIST AI RMF 842ae0044362f27a3a85cad2f48e547b, OWASP e0d0e9883695bb9c8feab6353c4bf20e, AIUC-1 299c3c1ce82f95b7b34a6030295a8d46, SAFE AI/CoSAI 87a2445eaa236fb8ab2e25d8eccead7a, ISO 27001 953af6c924c04875f5fefb9980024c92, ISO 42001 ffc07bb8199f51a0ddd521ea3b67c64b, HITRUST c9466b4a9f0ee528c9c321b469c2cc30, FedRAMP 1a1c33d94c511065dfe0c7e4339533e5
- Contact center logos: Five9 8aa27cc864d197978eb8745668299bdd, Genesys 003537563519c1b6ab10aa861f1fa890, NICE CXone 8ca3356b00345a3ca9de7bdf6600ab2e, Talkdesk bfe461ad0cf1c7372b38e27b2c335c0b, Amazon Connect 0a651685f9305858ad773fb5817ccf02, Webex CC 97a21cfd294e04b9fbafb41398f40de4, RingCentral 8872fabcedac1b3b8bd696239786b097, Dialpad f1d8fde4b694f2310dea42e8a72c78c3, Zoom CC 3ab3b252aa4a0d2eb5c342f831f1a679
- CRM logos: Salesforce 184ec6d43e8b2d52c200376b854bdf2f, HubSpot 15a39ac1a2dee1b15f771536e0560206, Dynamics 365 4200255a000d9fe88eec7393c9aff6a5, Zoho 1fdfa3f7eb6d372f81ced5f1c0e5cdf1, Pipedrive b7e25890a3190b70451dc36eb6d581cd, Zendesk Sell 908c8f93de30ab7f9e429187f0bf8d4a, Freshsales 3fb9c9932ac347593d310619d9bc23d3, SugarCRM 71acc3d269b1556e0d9c3702bdf4c619, Insightly 231720feb114822b7ba738e05eb7acbf, Copper 124925c20b947f492751b5c8f02f1b20, Monday 7ef41f7dbb743a1ece3b90b2667453fe, NetSuite b9e9e8f645a111538f623725d14a9efb, SAP c1d87afaef95c8183a8427612d7ec2d4 (CRM connectors are labelled "Preview")
- Team photos (About): Richard 18cad222a2be454751e5435573921c7a, Mukunth 2d49365687b9e0f3aca8b9845e41f4de, Akarsh af41a7f4d41cfa70eab941593880d0e5, Gaurav 7952f1c7251afe107fd314d03b1b1a2c, Kanika 53ad0ce67e34416471e475ff940a4e3e, Shyam 3657e82f76f6291945f2add6274be157, Sakshit ff8522c0251aed50db58ca405b98852f, Jaskeerat e596579266726b1c28e48868a60f53dd, Joel ebbea8bb9094ff0746e4411afdafc558, Juan Manuel fe6a6d75fa62c0fbf45969f9df8f03b2

## Workflow for a new site (e.g., anycrm.anyreach.ai)
1. Read the current live site and any spec Richard supplies; read the reference artifact's Main and Anyreach pages for patterns.
2. Start a Design artifact; copy needed assets by id from the reference artifact.
3. Build with the shared header/footer and tokens above; product-specific hero + recreated dark product screens with zoom/focus; integrations hub if relevant; dark closing CTA (pursuit/demo form) above the light footer.
4. Verify in a real browser at 1440×900 and in static mode (1440×2400); then publish.
5. For engineering handoff: export pages + runtime + local assets as a static bundle with a HANDOFF.md (routes, must-wire list, content flags, tokens, motion spec, QA checklist).