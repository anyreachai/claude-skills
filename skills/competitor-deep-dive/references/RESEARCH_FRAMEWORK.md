# Research Framework Reference

## Source Hierarchy

When multiple sources conflict, prioritize in this order:

1. **Independent benchmarks** (Artificial Analysis, Enterprisebot, academic papers)
2. **Verified user reviews** (G2, Gartner Peer Insights, TrustRadius with "Verified User" tags)
3. **Developer forums & GitHub issues** (specific bug reports with reproduction steps)
4. **Employee reviews** (Glassdoor, Blind — corroborate patterns, don't rely on individuals)
5. **Analyst reports** (Gartner MQ, Forrester Wave — note methodology limitations)
6. **Press coverage** (TechCrunch, VentureBeat, The Information — independent journalism)
7. **Partner testimonials** (cited in vendor case studies — useful but curated)
8. **Vendor marketing claims** (always labeled as "claimed" until independently verified)

## Review Authenticity Analysis Framework

### Red Flags to Check:
- **Zero low-star reviews**: Any product with 400+ reviews and literally 0% at 1-2-3 stars is statistically extraordinary
- **Rating distribution**: Healthy products typically show 60-75% 5-star, 15-20% 4-star, 5-10% 3-star, 2-5% 2-1-star
- **"Vendor Referred" tags**: Capterra/G2 flag incentivized reviews — count these
- **Review clustering**: Many reviews posted in a short timeframe suggests organized campaigns
- **Geographic concentration**: Reviews overwhelmingly from one country when company claims global presence
- **Content uniformity**: Reviews that sound similar or hit the same talking points in the same order
- **Featurebase / Reddit absence**: Companies with hundreds of G2 reviews but zero Reddit threads or community discussion

### How to Report:
- State the raw numbers: "4.6/5 from 467 reviews on G2"
- Note distribution: "79% 5-star, 18% 4-star, 0% at 3-star or below"
- Flag anomalies: "Zero reviews below 4 stars across 467 entries is statistically unusual"
- Note incentives: "Multiple Capterra reviews carry 'Vendor Referred - Incentive Offered' tags"
- Let readers draw conclusions: Present evidence, don't accuse

## Technical Assessment Dimensions

### For Voice AI Competitors:
| Dimension | What to Research | Where to Find |
|-----------|-----------------|---------------|
| TTFA (Time to First Audio) | Latency from user speech end to agent speech start | Benchmarks, dev forums, case studies |
| Speech-to-Speech vs Cascaded | Unified S2S model or STT→LLM→TTS pipeline? | Architecture docs, blog posts |
| Session Duration Limits | Max conversation length before timeout | GitHub issues, forum reports |
| Echo Cancellation | Built-in or requires external AEC? | Dev forums, deployment guides |
| Barge-in / Turn-taking | How well does it handle interruptions? | User reports, demo testing |
| Language Support | Number of languages, quality per language | Product docs, user reports |
| Voice Variety | Number of voices, custom voice support, cloning | Product docs |
| Tool Calling / Agentic | Can it call APIs, chain tools, take actions? | Dev docs, GitHub issues |
| Fine-tuning | Can the model be customized for domains? | Product docs |
| Telephony Integration | SIP, PSTN, which carriers supported? | Integration docs |

### For Conversational AI Competitors:
| Dimension | What to Research | Where to Find |
|-----------|-----------------|---------------|
| NLU Accuracy | Intent recognition, entity extraction accuracy | Benchmarks, user reviews |
| Channel Coverage | Voice, chat, email, SMS, WhatsApp, social | Product docs |
| No-Code vs Code-Required | Actual complexity despite "no-code" marketing | G2 reviews, implementation guides |
| Implementation Time | Weeks? Months? Years? | Gartner reviews, case studies |
| Bot Builder UX | Visual builder quality, debugging capabilities | G2 reviews, YouTube demos |
| Integration Ecosystem | Pre-built integrations, API flexibility | Product docs, marketplace |
| Analytics & Reporting | Built-in analytics, custom dashboards | Product docs, reviews |
| Enterprise Security | SOC 2, HIPAA, data residency, encryption | Trust/security pages |
| Pricing Transparency | Published pricing or "contact sales" opaque? | Pricing page, G2 reviews |
| Support Quality | Response times, dedicated CSM, community | G2 reviews, support pages |

## Pricing Analysis Framework

### True Cost Components (what to look for):
1. **Base platform fee** — Monthly/annual subscription
2. **Per-minute / per-message / per-conversation charges** — Usage-based costs
3. **Telephony costs** — SIP trunking, PSTN, toll-free numbers
4. **Infrastructure costs** — If self-hosted or cloud-dependent
5. **Integration costs** — Connector fees, API call limits, webhook costs
6. **Professional services** — Implementation, customization, training
7. **Support tier costs** — Basic vs. premium support pricing
8. **Hidden minimums** — Minimum commit, minimum seats, annual lock-in
9. **Overage charges** — What happens when you exceed plan limits

### How to Present:
- Always compare **fully-loaded cost** (all components) not just the headline number
- Use a consistent unit: cost per minute of voice, cost per conversation, cost per agent seat
- Note contract terms: monthly vs. annual, cancellation penalties
- Flag opacity: if pricing isn't published, that itself is a finding

## Competitor Positioning Framework

When writing the comparison section, use this structure:

### Dimensions to Compare:
| Category | Metrics |
|----------|---------|
| **Voice Quality** | TTFA, response latency, speech naturalness, BPM |
| **Channel Coverage** | Voice, chat, email, SMS, WhatsApp, vision |
| **Production Readiness** | Deployment time, infrastructure required, white-label |
| **Task Completion** | Can it actually DO things? Schedule demos, update CRMs? |
| **Language Support** | Number of languages, quality per language |
| **Pricing** | Fully-loaded cost per minute/conversation |
| **Enterprise Features** | SSO, RBAC, audit logs, compliance certs |
| **Integration Depth** | Pre-built connectors, API flexibility |
| **Scalability** | Concurrent call handling, session limits |
| **Support & Onboarding** | Implementation support, documentation quality |

### Scoring Guidance:
- **9-10**: Industry-leading, demonstrably superior with evidence
- **7-8**: Strong, meets enterprise requirements, minor gaps
- **5-6**: Adequate, works but with notable limitations
- **3-4**: Weak, significant gaps that impact production use
- **1-2**: Missing or fundamentally broken

### Fairness Rules:
- If a competitor genuinely excels somewhere, say so. Credibility comes from honesty.
- If data is insufficient to score, say "insufficient data" — don't guess low.
- Distinguish between "not supported" and "not tested/verified."
- Note when Anyreach data is from production vs. demo environments.

## Writing Style Guide

### Tone:
- **Investigative journalist**, not marketing copywriter
- **Data-first**: Lead with numbers, follow with interpretation
- **Bold key findings**: Make the most important data visually prominent
- **Direct**: Don't hedge excessively — if the evidence is clear, say so

### Section Headers:
- Use provocative, specific headers that preview the finding:
  - GOOD: "The learning curve nobody warned about"
  - GOOD: "69% accuracy — dead last among tested platforms"
  - BAD: "Technical Assessment"
  - BAD: "User Reviews"

### Source Citations:
- Inline, in parentheses with rounded-pill visual treatment: **(G2)**, **(Glassdoor)**, **(Gartner)**
- Multiple sources for same fact: **(G2) (Gartner)**
- When citing a specific review: use the platform name as the citation
- When citing a news article: use the publication name

### Key Statistics:
- Bold the number: "scored just **69%** on answer accuracy"
- Bold the finding: "**zero reviews below 4 stars** across 467 entries"
- Use em dashes for dramatic punctuation: "4.6/5 on G2 — but dig beneath the surface"
