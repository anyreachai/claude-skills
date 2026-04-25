# Voice from the Transcripts — Quote Extraction Methodology

This is the **NEW section** added to the demo bot usage report. It surfaces verbatim user quotes plus qualitative observations that don't fit cleanly into the metrics charts.

The goal: give the reader a feel for *what it's actually like to use this bot*, beyond the aggregate stats.

---

## Section structure

The "Voice from the transcripts" section (Section 4 in the report) has two parts:

1. **Quote grid** — 6-9 verbatim user quotes in styled cards, organized by category
2. **Other qualitative observations** — a short subsection (2-4 paragraphs OR a bulleted observation list) covering patterns visible across the corpus that aren't captured in any chart

---

## Part 1: Quote extraction

### Quote categories

For each report, try to surface quotes from at least 4 of these 7 categories. Aim for 6-9 quotes total. Don't include a category if the corpus doesn't have a strong example — fewer high-quality quotes beat more weak ones.

| Category | Heuristic | What it proves |
|----------|-----------|----------------|
| **Spontaneous praise** | Mid-flow positive language: "wow", "that's awesome", "perfect", "amazing", "love this", "thank you so much" — NOT just sign-off pleasantries | The bot is producing genuine delight, not just completing tasks |
| **Edge case / unusual ask** | Off-script requests: visual queries, multi-part complex asks, unexpected topics, jokes, hypothetical scenarios | The bot can handle ambiguity and unusual inputs gracefully |
| **Native-language / cultural moment** | User asks for or speaks in non-English; cultural context references (e.g., regional product names, life events specific to a culture) | Capability proof for multilingual deployment |
| **Emotional / life-event context** | User shares life context (bereavement, financial stress, urgency, family change) | The bot handles tone-sensitive moments without being robotic |
| **Specific product knowledge ask** | User asks for exact pricing, rates, model numbers, eligibility criteria | The bot returns accurate, current product information |
| **Self-correction / clarification** | User course-corrects mid-flow ("wait no", "actually", "I meant"), or bot recovers from a misunderstanding | The bot is robust to natural conversation messiness |
| **Meta-conversation moment** | User comments on the experience itself ("you're really good at this", "this is so much faster than", "I didn't expect that") | Highest-value content — direct user judgment of the bot |

### Extraction process

For a CSV with 50-100 sessions, expect to scan ~500-1000 user turns. Use this filter cascade:

```python
import pandas as pd
import json

df = pd.read_csv(csv_path)

quote_candidates = {
    'praise': [],
    'edge_case': [],
    'language': [],
    'emotional': [],
    'product_specific': [],
    'self_correction': [],
    'meta': [],
}

PRAISE_KEYWORDS = ['awesome', 'perfect', 'amazing', 'love', 'wonderful',
                   'fantastic', 'excellent', "that's great", "so helpful",
                   "thank you so much", "this is great"]
EDGE_KEYWORDS = ['can you see', 'what do you see', 'tell me what', 'I bet you',
                 'do you know', 'I was wondering', "weird question",
                 'this might sound', "let's try"]
LANG_PATTERNS = ['in spanish', 'in french', 'in twi', 'en español',
                 'en français', 'switch to', 'speak in']
EMOTIONAL_KEYWORDS = ['passed away', 'lost my', 'urgent', 'emergency',
                      'in trouble', 'in debt', 'desperate', 'serious',
                      'I just need', 'help me']
PRODUCT_KEYWORDS = ['how much', 'what's the rate', 'how many', 'what's the price',
                    'minimum', 'maximum', 'eligibility', 'qualify']
META_KEYWORDS = ["you're really", "this is so", "didn't expect",
                 'better than', 'faster than', 'I expected', 'you handled',
                 "I'm impressed"]
CORRECTION_KEYWORDS = ['wait no', 'actually no', 'sorry I meant',
                       'I mean', 'let me rephrase', 'no I said',
                       'that's not what']

for idx, row in df.iterrows():
    if pd.isna(row['Conversation']):
        continue
    conv = json.loads(row['Conversation'])
    items = conv['items']
    
    for i, item in enumerate(items):
        if item.get('type') != 'message' or item.get('role') != 'user':
            continue
        content = item.get('content', [])
        text = ' '.join([str(c) for c in content]) if isinstance(content, list) else str(content)
        if not text.strip() or text.startswith('[widget'):
            continue
        
        t_low = text.lower()
        ctx = {'session_id': row['ID'][:8], 'text': text.strip(), 'index': i}
        
        # Find the bot response that came right before (for context)
        prior_bot = ''
        for j in range(i-1, max(-1, i-3), -1):
            p = items[j]
            if p.get('type') == 'message' and p.get('role') == 'assistant':
                pc = p.get('content', [])
                prior_bot = ' '.join([str(c) for c in pc]) if isinstance(pc, list) else str(pc)
                break
        ctx['prior_bot'] = prior_bot[:200]
        
        # Categorize
        if any(k in t_low for k in PRAISE_KEYWORDS) and len(text) < 80:
            quote_candidates['praise'].append(ctx)
        if any(k in t_low for k in EDGE_KEYWORDS):
            quote_candidates['edge_case'].append(ctx)
        if any(k in t_low for k in LANG_PATTERNS):
            quote_candidates['language'].append(ctx)
        if any(k in t_low for k in EMOTIONAL_KEYWORDS):
            quote_candidates['emotional'].append(ctx)
        if any(k in t_low for k in PRODUCT_KEYWORDS):
            quote_candidates['product_specific'].append(ctx)
        if any(k in t_low for k in CORRECTION_KEYWORDS):
            quote_candidates['self_correction'].append(ctx)
        if any(k in t_low for k in META_KEYWORDS):
            quote_candidates['meta'].append(ctx)
```

### Filtering & selection

After extraction, select the strongest examples:

1. **Read every candidate, even if there are dozens** — the heuristics catch noise. Some "thank you so much" hits are just sign-off pleasantries; some "can you see" hits are video glitches. Pick the genuinely interesting ones.
2. **Deduplicate near-identical phrasings** — if 3 different sessions had a user say variations of "tell me about your products," include the most evocative one and skip the rest.
3. **Prefer mid-conversation over opening or closing turns** — a "this is great!" mid-flow proves more than a "thanks bye" at the end.
4. **Require minimum length** for substantive quotes (~5+ words), but very short reactions can stand on their own if they're punchy ("Wow!", "Mind blown.", "That fast?").
5. **Never fabricate or paraphrase** — every quote in the report must appear verbatim in the transcripts. If you wouldn't put it in quotation marks under oath, don't put it in the PDF.
6. **Cap at 9 total quotes** — beyond that the section becomes a list dump rather than a curated highlight reel.

### Layout pattern in the PDF

Use a `QuoteCard` flowable (defined in PDF_TEMPLATE.md) — a styled box with:

- **Category label** at top in the section's accent color, ALL CAPS, small (e.g., "SPONTANEOUS PRAISE", "NATIVE-LANGUAGE MOMENT")
- **The quote in bold** as the primary visual element, larger font (12-13pt)
- **Context line** in muted gray below (e.g., "User mid-conversation, after seeing plan comparison" — short, maximum 1 line)

Two cards per row works well; use a 2-column table layout. Render 6-9 cards across 3-5 rows.

If you have fewer than 6 strong quotes, switch to a single-column "blockquote" layout with longer cards (3-5 cards instead).

---

## Part 2: Other qualitative observations

A short subsection at the bottom of Section 4 — title it "What we noticed across the corpus" or "Other qualitative observations." This is for patterns that aren't captured in any chart.

### Observation framework

Think through each of these and surface 3-5 observations that are genuinely interesting for THIS bot:

| Pattern | What to look for | Example finding |
|---------|------------------|-----------------|
| **Interruption clustering** | Where in the bot's responses do users tend to cut in? | "Users interrupt most often during post-verification recap and during empathy responses — the bot over-explains after emotional moments" |
| **Repetition pattern** | How often do users have to say the same thing twice? | "Users repeated their account email an average of 1.3 times — usually because the first attempt was during background noise" |
| **Off-script handling** | When users went outside the expected flow, did the bot recover? | "When a user asked Sophia to identify a shirt on camera, the bot politely redirected to AT&T services rather than refusing" |
| **Topic transition smoothness** | Do users segue topics, and does the bot keep up? | "60% of multi-topic sessions transitioned with no rephrasing — the bot picks up cross-topic context cleanly" |
| **Filler / thinking moments** | How often does the bot use "thinking hint" widgets? Does it slow the conversation? | "Thinking hints fired 57 times across 60 sessions — they always preceded a tool call, never random pauses" |
| **Language switching mechanics** | How does the bot detect & honor language requests? | "Three users requested Spanish via different phrasings (en español, switch to Spanish, hablamos en español); all three were honored on the next turn" |
| **Empathy framing** | Does the bot pivot from emotional acknowledgment to task quickly enough? | "Empathy turns averaged 28 words before pivoting to action — appropriately brief, doesn't dwell" |
| **Product specificity** | Does the bot give exact numbers or hedge? | "Lily quoted exact rates 11/11 times when asked — never used vague phrases like 'competitive rates' or 'around X%'" |
| **Escalation behavior** | Does the bot know when to hand off, and how cleanly? | "Web-to-phone handoffs included a phone-number widget every time, never asking verbally — reduces transcription errors" |

### Writing style for observations

- **Lead with a number or specific finding** ("Users interrupted most during X" / "11 of 11 product asks got exact rates")
- **One paragraph per observation, max 3 sentences**
- **Skip observations that are negative or surface engineering issues** in partner-facing reports — those go in internal-only versions
- **Tie back to the partner's lens when possible** — "this matters for [partner] because..."

---

## Example: How this would look for AT&T (Sophia) report

If you were to add this section to the AT&T report, the quote cards might be:

```
SPONTANEOUS PRAISE                          NATIVE-LANGUAGE MOMENT
"That sounds awesome, thank you             "Could you provide a summary of this
so much for setting that up."                for me in Spanish?"
— mid-conversation, after plan recommendation — switching mid-flow with full context preserved

EMOTIONAL CONTEXT                            EDGE CASE / OFF-SCRIPT
"My two nieces just moved in with            "Yeah, listen, I got this shirt. I was
me because my sister passed away."           wondering if you can tell me what you see."
— opening turn, triggers full empathy + task pivot — user testing visual capability mid-call

META-CONVERSATION                            PRODUCT-SPECIFIC ASK
"That's perfect, exactly what                "It would be $250 a month for five
I needed."                                    lines, right?"
— after structured plan comparison shown — confirming exact pricing before commitment
```

Plus 3-4 qualitative observations like:
- *"Bilingual users switched languages an average of 1.2 times per session — typically once to test, then settling into Spanish for product details."*
- *"Empathy responses averaged 28 words before pivoting back to the task. Sessions with longer empathy preambles saw 2x the interruption rate."*
- *"All 32 plan comparison widgets resulted in a follow-up question from the user — proof the visuals are driving deeper engagement, not closing the conversation."*

---

## Example: How this would look for Access Bank (Lily) report

```
NATIVE-LANGUAGE MOMENT                       PRODUCT-SPECIFIC ASK
"Can you speak in Twi?"                      "I'm going to open a savings account
                                              with a maximum interest."
— triggers fluent Twi response with proper IPA — surfaces HIDA recommendation with 13% rate
  characters (ɛ, ɔ)                            quote

EDGE CASE / OFF-SCRIPT                       SPONTANEOUS PRAISE
"Yeah. Hey, Lily, can you tell me a          "Great, thank you so much."
little bit more about Adyane Campbell?"
— unusual proper-noun ask, bot graceful       — mid-flow after product education

META-CONVERSATION                            EMOTIONAL CONTEXT
"You should also make a sound. No,           "Hi Lily. I am in serious debt and
you shouldn't."                              I need a plan."
— user thinking out loud about UX             — opens the conversation with vulnerability,
                                                bot pivots to empathy + savings plan
```

Observations might include:
- *"6 of 8 multilingual requests came in the first 3 user turns — users test language capability early to decide whether to continue."*
- *"Web-to-phone handoff opening line was identical across all 10 outbound calls: 'Hi! This is Lily from Access Bank.' followed by a context-specific reference to the prior conversation. Consistent warm-handoff template."*
- *"Of 31 'open new savings account' inquiries, 27 surfaced a specific product recommendation (HIDA, Premier, Early Savers) within 2 turns — fast funnel from intent to product fit."*

---

## Implementation note

In the PDF code (`PDF_TEMPLATE.md`), the QuoteCard flowable should:
- Accept `(category_label, quote_text, context_line, accent_color)`
- Use the section's accent color (AMBER for Section 4) for the category label and left border
- Use DejaVu font for the quote text (handles Twi, French, special symbols)
- Sit in a 2-column table for the 6-9 card grid
- Render at ~225pt wide × ~85pt tall per card (when in 2-column layout)

The quote section should land on its own page (insert `PageBreak()` before "SECTION 4" label) and run 1-2 pages depending on quote count. Add the qualitative observations as a final sub-section using the existing `h2_style` heading.
