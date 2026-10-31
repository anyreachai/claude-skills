# Motion

Two patterns, both in `assets/template.html`. Use at most one of each per brief, and only where watching the mechanism beats reading it.

## Rules that apply to both

- **Complete at rest.** The first frame, the reduced-motion frame and the thumbnail all show a finished picture. The simulation draws its final counts statically under `prefers-reduced-motion`; the strip renders every element in its finished state before any keyframes are attached.
- **Loop, with a reseed.** 12–14 seconds. Fade out over the last 0.6–0.8s, reseed, start again. Randomness only in positions and jitter, never in the numbers.
- **Pause off-screen.** `IntersectionObserver` at 0.15–0.2 threshold. On return after being hidden, restart from zero so the viewer sees the story from the top.
- **Painted background.** Canvas and figure cards have an explicit dark or card background; never transparent.
- **No libraries.** Canvas 2D and the Web Animations API cover everything.
- **Real rates.** If the brief says 94 / 5.7 / 0.26, the simulation produces 940 / 57 / 3 of 1,000 every loop. The caption says "simulation at the program's reported rates".

## Pattern A: flow simulation (canvas)

What it is: a source node on the left pulses while units (dots) stream to lanes on the right. Each lane shows a label, a live count, a percentage and a fill bar on a shared scale. When the run completes the source says so; after a hold, everything fades and reseeds.

Configure, do not rewrite. In the template:

```js
const SIM = {
  N: 1000,                         // units per run
  loop: 14, spawn0: 0.6, spawn1: 10.0,
  source: { eyebrow:'SDR seat', title:'Televerde SDR', shortTitle:'Dialing', running:'Dialing…', done:'1,000 dials placed' },
  lanes: [
    { label:'No live answer', short:'No answer', sub:'voicemail, no answer, invalid number', color:C.grey2, dot:C.grey, per1000:940, r:2, alpha:.75 },
    { label:'A person, not the target', short:'Not the target', sub:'gatekeeper, wrong party', color:C.warn, dot:C.warn, per1000:57, r:3.2 },
    { label:'Right party', short:'Right party', sub:'the decision-maker, live', color:C.acc, dot:C.acc, per1000:3, r:5, ring:true }
  ]
};
```

How the order is built: the rarest lane's units are placed at fixed, spread positions in the 1,000-unit sequence (so every loop shows them, roughly evenly), the next lane is spread with a fixed stride, the rest is the bulk. This keeps the simulation faithful and makes the rare events land at predictable, watchable moments.

Layout is computed from the canvas width: `H = clamp(300, W × 0.44, 500)`, compact mode under 640px (shorter labels, narrower source box, no sub-labels). Canvas is rendered at `devicePixelRatio` up to 2. Text sizes are fixed CSS pixels (11–13px), so they stay readable at phone width.

Drawing order per frame: background → trunk and branch curves → source box (+ pulse rings while spawning) → lanes (box, label, count, percent, fill bar) → spawn due units → in-flight dots along a cubic from source to lane with ease-out → landing rings for the two rarer classes → fade.

Costs: at ~100 spawns/s and ~1.3s flight, ~130 dots are in flight; landed units are counted and dropped, not kept.

When to use it: any "of every N, this many end up here" story where the magnitudes are the point. Not for sequences (use the strip) and not for flows where which path each unit took matters (use a sankey).

## Pattern B: three-panel strip (Web Animations API)

What it is: three SVG figure cards in a row, one shared 13-second loop. Each panel tells one moment: before / during / after, or input / process / output. The viewer's eye moves left to right as the loop plays.

The helper:

```js
const T = 13, anims = [];
function tl(el, frames){
  if(!el) return;
  const kf = frames.map(f => { const o = {...f}; delete o.t; o.offset = Math.min(1, Math.max(0, f.t / T)); return o; });
  if(kf[0].offset > 0){ const first = {...kf[0], offset:0}; delete first.easing; kf.unshift(first); }
  if(kf[kf.length-1].offset < 1){ const last = {...kf[kf.length-1], offset:1}; delete last.easing; kf.push(last); }
  anims.push(el.animate(kf, { duration: T*1000, iterations: Infinity, easing: 'linear' }));
}
```

Frames are written in seconds (`t`) and converted to offsets, so timing reads like a storyboard. The helper pads the first and last keyframes so every element has a defined state across the whole loop.

Storyboard for the RUCKUS strip (reuse the shape, change the content):

| time | panel | what happens |
|---|---|---|
| 0–0.3 | all | panels fade in |
| 0.35–3.1 | 1 | six record cards drop in one by one and fly, shrinking, into "Call now / Later / Bad number" buckets; each bucket's bar grows by one share as a card lands |
| 3.2–3.5 | 1 | the tag pops ("Managers 2.6× VPs · refresh first") |
| 3.9–7.5 | 2 | a ring pulses on the first rail node; the dot walks six nodes every 0.72s; each node lights indigo as reached; the copilot card swaps its question per step |
| ~6.0 | 2 | the objection chip appears as the Timing step lights; the copilot shows the context-aware question |
| ~8.0 | 2 | "Meeting set" pops |
| 8.9–11.1 | 3 | eight empty fields fill left to right, each followed by a check; two were pre-filled in grey |
| ~11.5 | 3 | "10 of 10 captured · written to CRM" pops |
| 12.4–12.8 | all | panels fade out |

Mechanics that matter:
- Transform-origin via `transform-box: fill-box` (`.tb` centered, `.tl` left-center) so `scale`/`translate` on SVG groups behave.
- Bars grow in steps tied to arrivals: build the keyframe list from the arrival times, `scaleX(cur) → scaleX(next)` over 0.25s each.
- Elements that pop use `cubic-bezier(.2,.8,.2,1)` and overshoot to 1.08–1.12 before settling.
- Two animations on one element (transform and opacity) are fine; they compose.
- Resting state: before attaching animations, set the finished state inline (lit nodes, last question visible, dot at the last node). If reduced motion or no WAAPI support, return there.

When to use it: whenever the brief has a "what changes" story with distinct moments. Three panels, not four; if you need four, the story is two stories.

## What not to animate

Stat numerals, headlines, cards, chips, the waffle. Meters may grow once on entering view because their resting state is full. Anything else moving on the page competes with the two pieces that are supposed to carry the explanation.
