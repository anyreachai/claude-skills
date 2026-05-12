# Red Flag Quick Reference

A scannable thresholds table the synthesis pass uses to validate finding severity. If your finding violates one of these, the severity should match the table unless there's a specific reason to deviate (note the reason in the finding's `evidence` block).

| Signal | Threshold | Severity | Source rule |
|---|---|---|---|
| Top 1 rep share of pipeline | >40% | critical | T4 |
| Top 3 reps share of pipeline | >50% | high | T4 |
| Top 3 reps share of closed-won | >60% | high | T4 |
| Owner Gini coefficient | >0.65 | medium | T4 |
| Stage skip rate (closed-won) | >25% | high | T8 |
| Stage skip rate (closed-won) | >40% | critical | T8 |
| MQL → SQL median latency | >24h | medium | T3 |
| MQL → SQL median latency | >48h | high | T3 |
| MQL → SQL median latency | >72h | critical | T3 |
| MQL rejection rate | >40% | high | T3 |
| Source attribution retention (MAP→CRM) | <85% | high | T2 |
| Source attribution retention (MAP→CRM) | <60% | critical | T2 |
| Tool license utilization | <50% | medium | T6 |
| Tool license utilization | <30% | high | T6 |
| Active campaigns w/ zero engagement 30d | >20% of active | medium | T12 |
| Orphaned active sequences | >30% of inventory | medium | T5 / T12 |
| ICP drift on any single dimension | >25% | high | T1 |
| ICP drift on any single dimension | >40% | critical | T1 |
| ICP drift on 3+ dimensions | >25% each | critical | T1 |
| Implied pipeline coverage | <2.5x | medium | T7 |
| Implied pipeline coverage | <2.0x | high | T7 |
| Implied pipeline coverage | <1.5x | critical | T7 |
| Activity-to-outcome correlation | <0.1 | high | T9 |
| Activity-to-outcome correlation | <0 | critical | T9 |
| Reply rate gap (clean vs dirty data) | >2x | high | T11 |
| Email hard bounce rate (any week) | >2% | medium | extractor warning |
| Email unsubscribe rate (any week) | >0.5% | medium | extractor warning |
| Custom fields on Account | >50 | low | T6 (sprawl) |
| Service level (inbound) below stated SLA | sustained 30d | high | dialer extractor |
| TCPA/DNC violations 90d | any | critical | dialer extractor |

## Notes on severity

A single threshold-cross is necessary but not always sufficient for a finding. The triangulation rules can elevate or downgrade severity based on context — for example, an ICP drift of 28% on a BPO with a clean closed-won pattern in the new segment is genuinely a strategic insight (the stated ICP is wrong, not the actual targeting); on a BPO with chaotic targeting across the board, the same drift number is symptomatic of a deeper process failure.

Use the table as a floor, not a ceiling. The severity field on a finding is a judgment call by the rule, anchored to the threshold table.
