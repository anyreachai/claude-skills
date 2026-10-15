# CXO deck guidelines

How to build a steering committee or CXO level status deck that is infographic led, where every
number holds up when the people who run the operation check it against their own reports. These
rules apply on top of `SKILL.md`. Where a rule here is stricter, this file wins.

## 1. Agree the story and the numbers before building

1. Read the previous deck in the series and the latest status deck first. Reuse their design and
   their measure definitions, so this deck reads as the next page of the same story.
2. Compute every figure first (section 3), then put two things to the deck owner in one message:
   - the figures, as a table with the formula and base for each row;
   - the slide list, one line per slide, with the action title each slide will carry.
3. Name each open decision in one line, for example which basis to show or which data to leave out.
   Wait for a yes before building. A deck built on unconfirmed numbers is a wasted build.
4. When the owner questions a metric, re-derive it from source. Do not defend it from memory.

## 2. Storyline: answer first, one message per slide

- **Action titles.** Every slide title is the conclusion of that slide, written as a full sentence
  with its number: "The agent delivers nearly nine in ten of the requests it is built for", not
  "Performance". A reader who reads only the titles gets the whole story.
- **One message per slide.** If a slide needs two titles, it is two slides.
- **Order.**
  1. An executive summary, with three headline number tiles and two short context panels.
  2. The plan, as a schedule with a "we are here" marker. Every status deck carries it.
  3. Three to five body slides, one message each. Usually these are volume, quality or outcome,
     demand mix, and the next release.
  4. An appendix with the formula table and the definitions.
- **Short body.** Six to eight slides in all. Detail, proof and method go to the appendix.
- **Subtitle line.** Under each title, one muted sentence that says what is counted and over what
  period. It never repeats the title.
- **Footnote.** One line at the foot of the slide with the definitions the slide depends on.

## 3. Numbers discipline

These rules prevent the errors a CXO audience catches in the room.

### One script owns every figure

- One script reads the source data (exports, review sheets, carrier logs) and writes one JSON file
  of figures.
- The deck builder reads only that file. No number is typed into a slide by hand.
- Where a source can change before the meeting, for example a review sheet still being ruled on,
  the script re-reads the live source on every run. A refresh script reruns the data step, the
  build, the lint and the upload in one command, keeping the same file id.

### Every metric shows its base

- Write a share as "87 of 99 (88%)", never "88%" alone, in tables and in the appendix.
- The label names the base: "of calls counted", "of built-for calls".
- The appendix formula table shows each metric's formula with its numbers substituted, for example
  "182 - 8 - 7 = 167" and "102 / 3 = 34.0". Anyone can recompute any row in front of the client.

### Add-up checks, asserted in code

- Parts sum to their total: built-for plus later-phase-only plus person-only equals calls counted,
  in every period.
- A subset never exceeds its superset: delivered is within built-for, and contained within
  delivered.
- Two sources that cover the same items agree. Where they overlap, compare them item by item.
- A failed check stops the build. Print every check with its numbers, and read the output before
  quoting any figure.

### Never draw a trend across a change of basis

- When a definition, a review rule or a data source changes between periods, the series breaks.
- Show the earlier periods on the old basis, and the new period beside them on the new basis.
- Quantify the shift on the overlap, for example: "on the same 165 calls, the new rule moves 11
  calls from built-for to later phase".
- Give the same-basis comparison for the new period, for example "8 to 11 October on the same rule
  was 42%". If that comparison runs the other way from the headline, the headline changes.

### Compare like with like

- A partial period is compared with the same days of earlier periods: Monday to Wednesday against
  Monday to Wednesday, never a three-day average against a five-day week.
- Every row of a table uses the same exclusions. If one row counts test and invalid calls and the
  next does not, the table is wrong.
- Before using a duration or handle time, confirm what it measures against a second source, for
  example the platform duration against the carrier leg.

### Claims in titles are checked against the numbers

- A word claim in a title is asserted in the builder against the figure behind it. For example,
  "a third more" asserts an increase between 30% and 36%. Rounding words ("nearly nine in ten")
  must hold for every number they cover.
- Facts only. Two things happening in the same week is not a cause. If a cause is offered, it is
  labelled as an inference and kept out of the title.
- A metric that cannot be justified from source is dropped, not estimated.

### Qualitative feedback becomes countable

- Map each feedback item (form, comment, ticket) to one or more themes by its id, in a table kept
  in the script.
- Every item maps to at least one theme. The script asserts that no item is left over.
- Report each theme with the number of items that raise it. Sort by count.
- A theme's state ("built, in testing", "partly built", "open") comes only from a build record
  checked in the same session. "Built" is never written as "fixed" until the people who raised it
  have retested it.

## 4. Infographic rules

- **Native shapes only.** Draw bars, funnels and tiles from shapes and text boxes, so the deck stays
  editable after conversion to Google Slides. Do not use images of charts.
- **Bars.**
  - Each bar's height or length is in proportion to its value, measured from a zero baseline.
  - The value label sits above the bar.
  - Leave headroom between the chart label and the tallest value label, so they never touch.
- **Current period stands out.** The current period takes the accent colour and earlier periods
  take a neutral grey.
- **Funnels** are horizontal bars scaled to the first bar, with the count at the end of each bar and
  the label on the left.
- **Tables.**
  - A dark header band with white bold headings, and a muted second line for the period dates.
  - Banded rows in a light fill. One row may take a soft highlight colour for the headline metric.
- **Status words carry colour.** Green for built or on track, amber for partly built, red for open.
  The word is always written; colour is never the only signal.
- **Clean shapes.** No shadows, gradients or 3D. A `python-pptx` auto shape carries a theme shadow
  through its `p:style` element: remove that element when the shape is created.
- **Note panels** in a soft yellow carry the one caveat a slide needs, such as a basis change.
  Use at most one per slide.

## 5. Text and type

- **Type scale.** Use the theme's type scale and keep its proportions. On a 10 by 5.625 inch slide,
  the scale that reads well is:

  | Element | Size |
  |---|---|
  | Eyebrow | 7pt, bold capitals, accent colour |
  | Title | 16pt bold; 20pt on the cover |
  | Subtitle | 9pt, muted |
  | Table body | 8 to 9pt |
  | Footnotes | 7pt |

  Body and table text are never below 8pt at that size.
- **Sentences.** Plain language, one idea per sentence, short sentences. No filler, reassurance or
  hype. No "this does not mean" framing: state what is true.
- **Punctuation.** No em dashes, en dashes, arrows or decorative glyphs. Write "to" for ranges and
  "becomes" or "then" for change.
- **Internal names stay out.** Test environments, internal tool names and version numbers stay out
  of a client deck. Speak of the product and its results.
- **No verdicts.** The deck states each item's verified state, its owner and what is outstanding.
  A go or no-go is for the client to decide. A decision is written as a question put to them.
- **Never truncate to fit.** If the clear wording needs more room, resize the cell or reflow the
  slide.

## 6. Build, render, read back

1. **Start from the design.** Copy the previous deck in the series and keep the slides whose design
   carries over: cover and plan. Edit their text in place. Rebuild the other slides with helpers
   that use the same colours, fonts and margins.
2. **Render.** Render to PDF, then to one image per slide. Read every slide image and look for:
   - text overlapping text, bars or panels;
   - a label colliding with a chart title;
   - a cell wrapping onto the row below;
   - a table running into the footnote;
   - text clipped at a box edge;
   - leftover text from the template.
3. **Fix and repeat.** Fix every finding, re-render, and read again.
4. **Lint.** Run the text linter on the built file. Every blocking issue is fixed.
5. **Publish as a new file.** Never overwrite an earlier deck in the series.
6. **Check the converted file.** Where the deck is converted to Google Slides, export the converted
   file to PDF and read every slide again. The conversion can move text.
7. **Keep the sources together.** The builder, the data script and the refresh script sit beside
   the deck, so a late data change is one command.

## 7. Final checklist

- [ ] Figures and slide list confirmed by the deck owner before the build.
- [ ] Every title is a conclusion with its number, and its word claims are asserted in code.
- [ ] Every share shows "x of y" and names its base.
- [ ] Add-up checks pass and were read.
- [ ] No trend crosses a change of basis; overlaps are shown on both bases.
- [ ] Partial periods are compared on the same days.
- [ ] Every feedback item maps to a theme; theme states come from checked build records.
- [ ] Plan slide present, with "we are here".
- [ ] Appendix carries the formula table and the definitions.
- [ ] Every slide image read back after the final render, including the converted copy.
- [ ] Lint passes. No internal names, no verdicts, no dashes or arrows.
