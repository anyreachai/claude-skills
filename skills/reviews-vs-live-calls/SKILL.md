---
name: "reviews-vs-live-calls"
description: "Build the 'Reviews vs. Live Calls' artifact from a CX Intel reviews report and an IVR Swarm report: animated method strip, per-company flow, rating-vs-resolution map, mirrored ledger."
---

# Reviews vs. Live Calls

Turns two static Anyreach reports into one visual page whose narrative is: **customers said it, we called to check.** Use when Richard provides (or points at) a CX Intel / consumer-review report and an IVR Swarm final report for the same set of companies and wants the relationship between the two shown visually — for a BPO partner, a referral partner (e.g. SSG), a prospect, or a deck appendix. Also use to refresh an existing one with new companies.

The reference build (33 companies, Oct 2026, prepared for Michael Replogle) is published at https://claude.ai/artifact/GjinKfHXLG1RBHnUFMPLZS. **Read it first with the Artifact tool (`action: "read"`)** and reuse its HTML as the template: swap the `CO` array, the hero copy, the readings and takeaways, and the footer. Only rebuild from the spec below if that artifact is gone.

## 1. Inputs

Two PDFs, usually in uploads:

- **Reviews report** ("Reviews vs Live Calls" or a CX Intel export). Per company: review count, average rating, top service complaint and its share, other top complaints, churn drivers with percentages.
- **IVR Swarm final report.** Per company: line dialed, number of AI callers, resolution rate, where calls ended (ID, menu, waiting, website, person, answered), ID friction (key presses, seconds), notable observations.

Read PDFs with the Read tool in page ranges (max 20/pages per call). Pull every company into the record schema in §2 before writing any HTML. Do not invent figures; if a field is missing, leave it null and say so in the footer.

## 2. Data model — one record per company

```js
{n:"Fifth Third Bank", s:"finance", r:455, st:3.6, c:10, res:0, v:"confirmed", L:"L1", R:"R1",
 say:"Hard-to-reach service", sh:9, b:"reviews",          // top service complaint, its share, basis
 show:"0 of 10 reached a person",                        // what the calls showed, one line
 or:["Overdraft and hidden fees (30% of churn)", ...],    // only in reviews (3 max)
 oc:["Account + SSN asked even for routing number", ...], // only in calls (2 max)
 ph:"+1 800 972 3030",
 head:"Reviews say customers can’t reach anyone; 0 of 10 calls got past ID."}
```

- `s` ∈ finance | healthcare | consumer | suppliers (add a sector only if the set needs it).
- `r` reviews read; `st` rating or null; `c` callers; `res` resolution % from IVR Swarm (reaching a person alone does not count).
- `say` is the **top service complaint** (not the top product complaint); `sh` its share; `b` = "reviews" (share of reviews) or "churn" (share of churn-driver mentions). Keep both bases; label them.
- `head` is one sentence pairing the two sides. Written plainly, no em-dashes.

### Verdict rules (`v`)
- **confirmed** — the top review complaint is about reaching/resolving by phone AND the calls reproduced that failure (0–30% resolved, dropped at ID/menu/waiting).
- **related** — same area but a different failure, or the calls failed for a reason reviews didn’t name (e.g. billing complaint; calls pushed to web), or calls "resolved" mostly by sending callers to the website.
- **notseen** — reviews complain, calls resolved ≥70% with real answers.
- **data** — review data unusable (wrong company matched, <15 reviews with off-topic content) or the line didn’t identify as the company. Never claim a match for these.

### Flow groups (`L`, `R`)
Left = what the top complaint is about; right = what callers hit. Keep these labels unless the data needs a new one.

| L | label | R | label |
|---|---|---|---|
| L1 | Can’t reach a person | R1 | Dropped at ID |
| L2 | Holds, loops and transfers | R2 | Lost in the menu |
| L3 | Bad or conflicting answers | R3 | Left waiting for a person |
| L4 | Billing disputes | R4 | Sent to the website |
| L5 | Bots and logins | R5 | Couldn’t do the task |
| L6 | Can’t cancel | R6 | A person picked up |
| L7 | No usable review data | R7 | Answered |

## 3. Page structure (in order)

1. **Hero.** Eyebrow `Prepared for <name> · N companies · dates`. H1 `Customers said it. We called to check.` Lede: one sentence on method, bold close `Here is how, and what we found.`
2. **Method strip** (animated, 3 panels, eyebrow `How the analysis was built · two tools, one day apart`): 1 Read the reviews (CX Intel) · 2 Swarm the line (IVR Swarm) · 3 Put them side by side. Each panel: SVG figure, numbered h3, 2-line description, stat line with the real totals.
3. **Flow** (`Where the two agree` / `Each ribbon is one company.`): sankey, one 13px ribbon per company from L-node to R-node, colored by verdict. Header row: reviews total left, `17 of 33 confirmed` + clickable legend center, calls total right. Hover ribbon/node dims the rest + tooltip; click opens the company row.
4. **Map** (`Every company on one map` / `The unhappier the reviews, the deader the phone line. Mostly.`): beeswarm. X = rating 4.5★→1★ (unhappier to the right) with a `no rating` column; three lanes = resolved nothing / 10–40% / 70%+; bubble radius `4+√r·0.5` capped 16; color = verdict. Label only the outliers. Below: three reading cards (looks fine online but dead on phone · unhappy online but line answers · the crowd).
5. **Ledger** (`Company by company` / `Red in the reviews, red on the calls.`): mirrored rows. Left: quoted complaint + share + red bar (scale max 50%). Spine: company, sector · reviews · rating, verdict chip. Right: one dot per caller (green = resolved count), `show`, `x of c resolved · %`. Toolbar: verdict chips with counts, sector select, sort (verdict/calls/rating/share). Row expands to `head`, only-in-reviews, only-in-calls, phone.
6. **Patterns** (`What only the phone could tell us` / `Reviews name the pain. The calls show where it starts.`): sector waffle (one square per line, green ≥70, amber 10–40, red 0) + three numbered takeaways from the IVR report (ID-before-intent, "resolved" = go to website, speech menus win) + amber caveat on synthetic profiles and small samples.
7. **Footer**: Reviews source, Calls source + what "resolved" means, Data issues.

## 4. Design

Anyreach web brand (see /topics/anyreach-brand.md): Literata for headings and big numbers, Inter body; white/zinc, indigo accent. Tokens, light then dark via `prefers-color-scheme` guarded `:root:not([data-theme="light"])` and `:root[data-theme="dark"]`:

```
--bg #FFFFFF/#09090B  --fg #09090B/#FAFAFA  --muted #71717A/#A1A1AA  --border #E4E4E7/#27272A  --surface #FAFAFA/#111113
--accent #4F46E5/#818CF8  --accent-chip #4F46E5/#6366F1  --accent-soft #EEF2FF/#1E1B4B  --accent-mid #A5B4FC/#4F46E5
--fail #DC2626/#F87171  --ok #16A34A/#4ADE80  --warn #D97706/#FBBF24  --neutral-blk #D4D4D8/#3F3F46
```

Color semantics are fixed: **indigo = the two sources agree** (confirmed solid, related mid), **red = pain on either side**, **green = call resolved**, **amber = data issue / partial**, grey = not seen. Text never takes a series color. Phone width: ledger rows stack (spine first), SVGs sit in `overflow-x:auto` wrappers with `min-width:760px`.

## 5. Build notes (only when rebuilding from spec)

Single self-contained HTML, no libraries. Title `Reviews vs. Live Calls`, icon `chart`. Key algorithms:

**Sankey** — nodes stacked top-down with `h = count·13`, 14px gap; ribbons sorted by target index then `res`; path `M x0,y0 C xm,y0 xm,y1 x1,y1 L x1,y1+t C xm,y1+t xm,y0+t x0,y0+t Z`. Dim = add `.dim` to svg, `.lit` on matched ribbons.

**Beeswarm** — per lane, sort items by x, place each at lane center then step ±3px until no overlap (`hypot ≥ r1+r2+2.5`), clamp inside lane. Labels via an explicit `{name: above|below|right}` map, not automatic.

**Method-strip animation** — Web Animations API, 12s loop shared by all elements, helper:
```js
const T=12, mAnims=[];
function tl(el, frames){ const kf=frames.map(f=>{const o={...f}; delete o.t; o.offset=f.t/T; return o;});
  if(kf[0].offset>0) kf.unshift({...kf[0],offset:0}); if(kf.at(-1).offset<1) kf.push({...kf.at(-1),offset:1});
  mAnims.push(el.animate(kf,{duration:T*1000,iterations:Infinity,easing:'linear'})); }
```
Timeline: 0.3–3.5s review cards drop in and fly into theme buckets, bars grow as each lands (`transform-box:fill-box; transform-origin:left center`), top bucket tagged at 3.8s · 3.6–7.5s line pulses, ten callers travel from the line node, fan out, lanes draw to Menu / ID check / Outcome, dots pop red/amber/green, tally at 7.5s · 8.0–9.8s complaint card and call card slide in (from 18% ghost, not from invisible), `=` appears, Confirmed chip pops · fade out 11.5–12s. Skip entirely under `prefers-reduced-motion`; pause via IntersectionObserver when off screen and restart from 0 when back.

## 6. Check, publish, reply

1. Headless render with Playwright (`require('playwright')` works): assert `scrollWidth` = viewport at 1280 and 400, zero page errors, `document.getAnimations().length > 0`. Screenshot the method strip at t ≈ 3.9s and 10s by pausing animations (`a.pause(); a.currentTime=…`). One pass of fixes, no loop.
2. Publish with the Artifact tool. New page: `icon: "chart"`, description one sentence. Refresh: same file path or the artifact `url`.
3. Reply in a few short paragraphs: what each big visual shows and the one judgment call (e.g. mixed % bases). No URL paste, no step recap.