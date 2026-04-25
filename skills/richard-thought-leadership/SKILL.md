---
name: richard-thought-leadership
description: "Generate thought leadership content in Richard Lin's voice and style — including long-form articles, LinkedIn posts, internal memos, and strategic narratives. Use this skill whenever Richard asks to write, brainstorm, draft, or ideate on thought leadership pieces, blog posts, LinkedIn content, strategic narratives, vision documents, founder letters, or any content meant to establish a point of view on the future of AI, agents, enterprise software, or related topics. Also trigger when Richard says things like 'help me write about', 'draft a post on', 'I want to share my thinking on', 'generate a piece about', 'turn this into an article', or references wanting to publish or share ideas externally or internally. This skill captures Richard's specific voice, rhetorical patterns, and content philosophy — always use it instead of generic writing approaches."
---

# Richard Lin — Thought Leadership Content

## Voice & Identity

Richard Lin is the CEO & Founder of Anyreach, an AI voice and chat automation platform. His writing voice has these characteristics:

### Tone
- **Direct and conviction-driven.** States positions clearly without hedging. Uses "I believe" and "I think" — not "it could be argued that."
- **Conversational authority.** Reads like a smart founder talking to peers, not a consultant presenting to a board. No corporate jargon.
- **Contrarian but grounded.** Makes bold claims but anchors them in specific product experience, market data, or historical pattern. Never contrarian for shock value.
- **Builder's perspective.** Always ties abstract ideas back to "what are we building" and "what does this mean for our product." Theory serves practice, never the reverse.

### Sentence Style
- Short, declarative sentences for emphasis. Longer sentences for narrative flow.
- Uses fragments intentionally: "No login. No onboarding. No dashboard."
- Rhetorical questions to create tension: "But what happens when the caller is also an agent?"
- Parallelism for emphasis: "Layer 1 is a race. Layer 2 is a land grab. Layer 3 is a fortress."

### What to AVOID
- Academic or consulting language ("stakeholders," "leverage synergies," "paradigm" used without irony)
- Excessive hedging ("it might perhaps be the case that")
- Generic AI hype language ("revolutionary," "game-changing," "transformative")
- Bullet-point listicles disguised as thought leadership
- Self-congratulatory tone about Anyreach — product references should feel like natural evidence, not marketing

---

## Content Architecture

Richard's thought leadership follows a specific structural pattern inspired by founders like Ivan Zhao (Notion) and the Cursor team. Read `references/style-influences.md` for detailed examples of this pattern.

### The Core Structure

1. **Historical anchor / Opening metaphor.** Every piece opens with a concrete historical story, analogy, or observation that grounds the abstract thesis in something tangible. The switchboard operator. Henry Ford's collapse. The steam engine replacing the waterwheel. This is NOT a decoration — it's the structural backbone that the entire piece refers back to.

2. **The product as proof point.** Early in the piece, introduce a specific Anyreach product experience (the Demo Bot, a customer deployment, a technical capability) that demonstrates the thesis in action. This should feel like "here's something we built that made me realize..."

3. **The thesis stated plainly.** After the anchor and proof point, state the core argument in 1-2 sentences. No buildup. No preamble. Just the claim.

4. **Implications explored through multiple lenses.** Unpack the thesis across 3-5 sections, each examining a different dimension: historical pattern, technical architecture, business model, competitive landscape, timeline. Each section should have its own mini-narrative, not just analysis.

5. **A framework or mental model.** Somewhere in the middle, introduce a framework that gives the reader a tool for thinking — not just information. Examples: "AEO — Agent Experience Optimization," the K-Cup vs. espresso machine spectrum, the git branching model for agent lifecycle. These are the parts people remember and repeat.

6. **Closing callback.** The final section returns to the opening metaphor and resolves it. The switchboard is gone; the skyline remains. This creates a complete narrative arc rather than just trailing off.

### Pull Quotes
Every piece should have 2-3 pull quotes — bold, standalone statements that work as social media excerpts. Place them at natural breaking points between sections. They should be strong enough to stand alone without context.

---

## Content Formats

### Long-form Article (1,500–3,000 words)
- The primary format. Follows the full structure above.
- 7-9 sections with section headers (not numbered, not hierarchical — editorial style)
- Historical photos + conceptual diagrams interspersed as breathing room
- Appendix with working notes if derived from a brainstorming session
- Examples: "Switchboards and Skylines"

### LinkedIn Post (80-150 words)
- Opens with a single punchy line that stops the scroll
- 3-5 short paragraphs, each 1-2 sentences
- Line breaks between every paragraph (LinkedIn formatting)
- Ends with a soft CTA: "Link below" or "Full piece in comments"
- NO hashtags unless Richard specifically asks
- NO emoji
- Two variants: one that hooks with the historical metaphor, one that hooks with the provocative claim

### Internal Slack/Memo (50-150 words)
- Casual but purposeful
- Names the piece, gives 2-sentence summary of the thesis
- Ends with specific CTA: "drop reactions in thread," "what should we build now"
- Tone: founder talking to their team, not CEO broadcasting

### Twitter/X Thread (if requested)
- Tweet 1: The hook — historical fact or contrarian claim
- Tweets 2-4: The thesis unpacked in plain language
- Tweet 5: The framework or mental model
- Tweet 6: The product proof point
- Tweet 7: Callback to opening + CTA

---

## Recurring Themes & Beliefs

These are Richard's core convictions that should inform all content. Don't repeat them verbatim — weave them in where relevant:

- **The future has no UI.** Agents are the new users. APIs are the product. Channels are interchangeable triggers.
- **AEO > SEO.** Agent Experience Optimization is the next table-stakes discipline for businesses.
- **Agent-to-agent is 12-18 months out.** Consumer agents from big tech will interact with business agents. Anyreach sits at the intersection.
- **Knowledge is the durable asset, not agents.** Agents are ephemeral; the knowledge base, compliance config, and protocol layer are what compound over time.
- **BPOs are the first agent-to-agent battleground.** They're already intermediaries; AI on both sides is the near-future.
- **Historical patterns repeat.** Switchboards → automatic switching. Waterwheels → steam engines. Florence → megacities. The current moment always disguises itself as permanent.
- **Build for the paradigm shift, not the current paradigm.** Ford optimized the Model T while GM invented the model year. Don't be Ford.

---

## Image & Visual Philosophy

When generating content that will include images:

- **Historical photos** for narrative anchors (switchboard rooms, factory floors, early technology). Black & white preferred. Should feel like editorial journalism, not stock photography.
- **Conceptual diagrams** for frameworks and architecture (timeline evolutions, flow diagrams, layer stacks). Clean, minimal, architectural. No 3D renders or AI-generated art.
- **Product screenshots** for proof points. Real product, not mockups.
- **NEVER** use: robot illustrations, glowing neural networks, circuit board backgrounds, generic "AI" imagery, stock photos of people pointing at screens.

### Image Generation Prompts

Every thought leadership piece must include **one image generation prompt per section** (including the cover/title page). These prompts are designed for use with image generation tools (e.g., Gemini, Midjourney, DALL-E) and should be embedded directly into the document output as clearly labeled callout boxes.

**Prompt style guidelines:**
- Write prompts in a descriptive, cinematic style — specify composition, lighting, color palette, mood, and medium.
- Match the visual philosophy above: historical photographs for narrative anchors, clean conceptual diagrams for frameworks, editorial-quality compositions throughout.
- Each prompt should specify the aspect ratio (default 16:9 for article headers, 1:1 for social).
- Avoid generic AI imagery in prompts — no glowing brains, circuit boards, robot hands, or neon grids.
- Prompts should feel like art direction briefs: specific enough to produce a usable image on the first generation, atmospheric enough to give the generator creative room.
- Use language like: "Editorial photograph," "Archival black and white," "Minimal conceptual diagram," "Cinematic wide shot," "Warm documentary style."

**Format in document output:**
Each image prompt should appear in the document as a visually distinct callout box (shaded background, italic text, labeled "IMAGE PROMPT") placed at the top of its corresponding section. This makes it easy for Richard or a designer to generate images section by section.

Example:
> **[IMAGE PROMPT — Cover]**
> *Editorial black and white photograph of an empty Catholic confessional booth, dramatic side lighting through a small window, dust particles visible in the light beam, shallow depth of field focusing on the latticed screen divider. Shot on medium format film. 16:9.*

---

## Process: From Conversation to Content

Richard often develops ideas through conversation before writing. The typical flow:

1. **Brainstorm in chat.** Richard shares a thesis or observation. Engage with it — push back, extend it, find the historical analog, identify the framework.
2. **Identify the structural backbone.** What's the opening metaphor? What's the product proof point? What's the framework people will remember?
3. **Draft the piece.** Follow the content architecture above. Write in Richard's voice. Include one image generation prompt per section (cover + each body section) as callout boxes in the document output.
4. **Generate companion content.** LinkedIn post, Slack message, image placement notes.
5. **Iterate on specifics.** Title, closing line, individual sections.

When brainstorming, don't just validate — challenge. Richard values direct, data-driven pushback over diplomatic agreement. If an idea has a hole, say so. The best content comes from ideas that survived scrutiny.
