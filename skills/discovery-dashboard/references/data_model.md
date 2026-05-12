# Data Model — Discovery Dashboard

The shape of every module-level constant the JSX template expects.
The view components consume these directly, so the shapes are
non-negotiable.

Map your extracted discovery data into these structures at the top of
the JSX file.

---

## `PROJECT`

The top-level deal metadata + hero copy.

```javascript
const PROJECT = {
  // Top-bar metadata
  prospect: 'Northwest Federal Credit Union',     // company name
  prospectShort: 'NWFCU',                          // for top-bar display
  callDate: '2026-04-23',                          // ISO date of discovery call
  callType: 'Discovery Call',                      // 'Discovery Call' | 'Kickoff' | 'Scoping' | 'Demo'
  stage: 'Discovery',                              // CRM stage label
  owner: 'Richard Lin',                            // deal owner (you)
  participants: 6,                                 // total attendees on the call

  // Hero block — the dashboard's argument
  eyebrow: 'DISCOVERY · APR 23 2026 · 47 MIN',     // ALL CAPS metadata line
  headline: 'Two systems, *one mandate*.',         // *italicized* word
  spotlightWord: 'mandate',                        // the word to make italic+lime (must match headline)

  // Frame paragraph — what is this project, in ~50 words
  frame: 'Member services is splitting calls across two contact ' +
         'centers with no shared queue. The 12-week pilot replaces ' +
         'their after-hours overflow agent with an AI agent on the ' +
         'NWFCU number, with success measured on containment rate ' +
         'and post-call CSAT.',

  // KPI strip — 4 stats on the hero ink strip
  // Keep these short: 1–3 words for label, 1–6 chars for value
  kpis: [
    { label: 'Deal-size signal',  value: '$212K',  hint: 'signed pilot' },
    { label: 'Pilot length',      value: '12 wks', hint: 'live by Jun 1' },
    { label: 'Stakeholders',      value: '8',      hint: '3 decision-makers' },
    { label: 'Use cases',         value: '4',      hint: 'after-hours, IVR, FAQ, member ID' },
  ],

  // Optional: byline at the bottom of the hero
  byline: 'Compiled from Otter transcript + Richard notes',
};
```

---

## `STAKEHOLDERS`

Array of every person involved in the deal — both on the call and
referenced. Order doesn't matter; the view sorts by influence desc.

```javascript
const STAKEHOLDERS = [
  {
    id: 'dk',
    name: 'Dee Kohler',
    title: 'Sr. Director, Member Services',
    role: 'champion',                              // 'champion' | 'economic_buyer' | 'technical' | 'user' | 'influencer' | 'gatekeeper'
    sentiment: 'positive',                         // 'positive' | 'neutral' | 'skeptical' | 'blocker'
    influence: 5,                                  // 1–5
    onCall: true,                                  // did they attend the discovery call?
    quote: 'We are hemorrhaging on after-hours volume.',
    notes: 'Internal champion, pulled us into the room. Owns the ' +
           'member services number.',
  },
  {
    id: 'mr',
    name: 'Marcus Reyes',
    title: 'VP, Information Security',
    role: 'gatekeeper',
    sentiment: 'skeptical',
    influence: 4,
    onCall: true,
    quote: 'I will not approve anything until I see the SOC 2 report.',
    notes: 'Security review will gate the pilot. Treat as priority-1.',
  },
  // ... 4–10 stakeholders typical
];
```

Field rules:
- `sentiment`: pick one. `positive` = champion-style, `neutral` =
  attentive but uncommitted, `skeptical` = needs evidence, `blocker`
  = actively against.
- `influence`: 5 = signs the contract or kills the deal alone. 3 =
  influences the decision-maker. 1 = end-user voice only.
- `quote`: verbatim or close paraphrase from the transcript. If they
  didn't speak, use `"(mentioned but did not speak on call)"`.
- `notes`: free-form context for the deal team (1–2 sentences).

---

## `PAIN_POINTS`

Array of pain points the prospect raised, ranked by severity.

```javascript
const PAIN_POINTS = [
  {
    id: 'p1',
    title: 'After-hours volume routed to voicemail',
    detail: 'Post-9pm calls drop into voicemail with 31% callback ' +
            'rate. Member satisfaction craters on Monday morning.',
    quantified: true,                              // do we have a number tied to this?
    metric: '31% callback rate · ~400 missed/wk',  // the number, if quantified
    source: 'Dee Kohler, 12:14 in transcript',     // attribution
    severity: 'high',                              // 'high' | 'medium' | 'low'
    linkedValuePropId: 'v1',                       // links to VALUE_PROPS[].id
  },
  // ...
];
```

Severity rules:
- `high`: prospect used language like "hemorrhaging", "blocking",
  "losing X", "have to fix this quarter".
- `medium`: real pain, no urgency language attached.
- `low`: mentioned in passing, not core to the deal.

---

## `VALUE_PROPS`

Anyreach's answer to each pain point.

```javascript
const VALUE_PROPS = [
  {
    id: 'v1',
    title: '24/7 AI agent on the member services number',
    detail: 'Voice agent picks up after-hours calls in under 800ms, ' +
            'handles top-25 intents end-to-end, routes the rest to ' +
            'on-call human queue.',
    proofPoint: 'NWFCU pilot · OneCenTeam reference call available',
    linkedPainId: 'p1',
  },
  // ...
];
```

Every `PAIN_POINTS[i].linkedValuePropId` should resolve to a
`VALUE_PROPS[j].id`. If no value prop is mapped yet, leave the link
as `null` and the dashboard will render an explicit "no answer yet"
state.

---

## `SCOPE`

The deal's scope — what's in, what's out, what's still being scoped.

```javascript
const SCOPE = {
  // Channels — voice/chat/sms/email/whatsapp/webchat
  channels: [
    { name: 'Voice',  status: 'committed', volume: '~4k calls/wk', note: 'Primary scope' },
    { name: 'Chat',   status: 'probable',  volume: 'TBD',         note: 'Phase 2' },
    { name: 'SMS',    status: 'exploratory', volume: 'TBD',       note: 'Mentioned, no commitment' },
    { name: 'Email',  status: 'out',       volume: '—',           note: 'Handled in-house' },
  ],

  languages: ['English', 'Spanish'],

  integrations: [
    { name: 'Symitar (core banking)',     status: 'committed', complexity: 'high',   note: 'Real-time account lookup' },
    { name: 'Verint (contact center)',    status: 'committed', complexity: 'medium', note: 'Warm transfer + call recording' },
    { name: 'Salesforce Financial Cloud', status: 'probable',  complexity: 'medium', note: 'Member context surface' },
    { name: 'Genesys Cloud telephony',    status: 'committed', complexity: 'low',    note: 'SIP trunk + 800-number' },
  ],

  // Use cases — what the agent will actually do
  useCases: [
    { name: 'After-hours overflow', priority: 1, status: 'committed' },
    { name: 'IVR replacement',      priority: 2, status: 'committed' },
    { name: 'FAQ deflection',       priority: 3, status: 'probable'  },
    { name: 'Member identification',priority: 4, status: 'committed' },
    { name: 'Loan origination intake', priority: 5, status: 'exploratory' },
  ],

  inScope: [
    'AI voice agent on 800-XXX-XXXX after-hours',
    'Symitar real-time account lookup',
    'Warm transfer to on-call agent queue',
    'Post-call CSAT survey trigger',
  ],
  outOfScope: [
    'Outbound campaigns',
    'Wealth management line',
    'Branch appointment booking',
  ],

  technicalRequirements: [
    { req: 'SOC 2 Type II report',         status: 'open',     owner: 'Marcus Reyes' },
    { req: 'FedRAMP not required',         status: 'confirmed', owner: 'Marcus Reyes' },
    { req: 'Data residency: US-only',      status: 'confirmed', owner: 'Marcus Reyes' },
    { req: 'PII redaction in transcripts', status: 'open',     owner: 'Marcus Reyes' },
  ],
};
```

Status values:
- `committed`: prospect explicitly said yes / in scope
- `probable`: discussed positively, not yet committed
- `exploratory`: mentioned, undecided
- `out`: explicitly out of scope

---

## `DECISION`

The decision path — process, criteria, timeline, competition.

```javascript
const DECISION = {
  // What the prospect said matters for vendor choice
  criteria: [
    { criterion: 'SOC 2 Type II',                       weight: 'must-have', met: 'unknown'  },
    { criterion: 'Sub-second voice latency',            weight: 'must-have', met: 'yes'      },
    { criterion: 'Symitar integration experience',      weight: 'must-have', met: 'partial'  },
    { criterion: 'Bilingual EN/ES out of the box',      weight: 'must-have', met: 'yes'      },
    { criterion: 'Reference customer in credit unions', weight: 'nice-to-have', met: 'no'    },
  ],

  // Stages → who → status
  process: [
    { stage: 'Champion buy-in',     owner: 'Dee Kohler',     status: 'done',       date: '2026-04-23' },
    { stage: 'Security review',     owner: 'Marcus Reyes',   status: 'in_progress', date: '2026-05-10' },
    { stage: 'Pilot SOW sign-off',  owner: 'Linda Park (Procurement)', status: 'pending', date: '2026-05-20' },
    { stage: 'Pilot kickoff',       owner: 'Anyreach',       status: 'pending',    date: '2026-06-01' },
    { stage: 'Pilot review + expansion', owner: 'Joint',     status: 'future',     date: '2026-08-24' },
  ],

  // Status values: 'done' | 'in_progress' | 'pending' | 'future' | 'blocked'

  // Key dates timeline
  timeline: {
    discoveryDate:   '2026-04-23',
    pilotStartTarget:'2026-06-01',
    pilotEndTarget:  '2026-08-24',
    expansionTarget: '2026-09-15',
  },
};
```

---

## `COMPETITION`

Other vendors in the room.

```javascript
const COMPETITION = [
  {
    name: 'Incumbent (in-house Verint IVR)',
    type: 'incumbent',                             // 'incumbent' | 'direct' | 'in_house' | 'partner'
    positioning: 'Status quo. No AI capability, but zero switching cost.',
    threat: 'medium',                              // 'low' | 'medium' | 'high'
    note: 'Inertia is the real opponent here.',
  },
  {
    name: 'Five9 Conversational AI',
    type: 'direct',
    positioning: 'Bigger brand, slower deployment, $/seat pricing.',
    threat: 'medium',
    note: 'Marcus mentioned getting a quote.',
  },
  {
    name: 'PolyAI',
    type: 'direct',
    positioning: 'Voice-first specialist. No outcomes-based pricing.',
    threat: 'low',
    note: 'Heard once in passing, no active eval.',
  },
];
```

---

## `RISKS`

What could kill the deal.

```javascript
const RISKS = [
  {
    id: 'r1',
    title: 'Security review may demand FedRAMP',
    detail: 'Marcus initially said no, but procurement template ' +
            'defaults to FedRAMP-required. Confirm in writing.',
    impact: 'high',                                // 'high' | 'medium' | 'low'
    likelihood: 'medium',                          // 'high' | 'medium' | 'low'
    mitigation: 'Have Tom Aiello pre-walk Marcus through SOC 2 ' +
                'evidence package by 5/3.',
    owner: 'Richard',
    source: 'Marcus Reyes comments, 28:40 in transcript',
  },
  {
    id: 'r2',
    title: 'Symitar real-time integration not yet proven at this depth',
    detail: 'Their Symitar instance has custom fields we haven\'t ' +
            'integrated against before.',
    impact: 'medium',
    likelihood: 'high',
    mitigation: 'Schedule technical scoping call with their core ' +
                'banking team before SOW signs.',
    owner: 'Mukunth',
    source: 'James Chen, 33:12 in transcript',
  },
  // ...
];
```

---

## `OPEN_QUESTIONS`

Things we did NOT get answered on the call. Critical for next-call prep.

```javascript
const OPEN_QUESTIONS = [
  { question: 'What is the actual budget envelope for FY26?',         owner: 'Dee Kohler' },
  { question: 'Who signs the MSA — is it Linda or her VP?',           owner: 'Linda Park' },
  { question: 'Will security accept SOC 2 alone, or also need HIPAA?', owner: 'Marcus Reyes' },
  { question: 'What is the expansion path beyond after-hours?',        owner: 'Joint' },
];
```

---

## `NEXT_STEPS`

Concrete commitments from the call. Owner + date required.

```javascript
const NEXT_STEPS = [
  {
    action: 'Send SOC 2 Type II evidence package to Marcus',
    owner: 'Richard',
    due: '2026-04-26',
    status: 'open',                                // 'open' | 'done' | 'blocked'
    priority: 1,
  },
  {
    action: 'Schedule technical scoping call with NWFCU core banking team',
    owner: 'Mukunth',
    due: '2026-04-30',
    status: 'open',
    priority: 2,
  },
  {
    action: 'Draft pilot SOW from MSA template',
    owner: 'Richard',
    due: '2026-05-02',
    status: 'open',
    priority: 3,
  },
  // ...
];
```

---

## Validation checklist

Before rendering, the data model must satisfy:

- [ ] `PROJECT.kpis` has exactly 4 items.
- [ ] Every `PAIN_POINTS[i].linkedValuePropId` resolves to a real
      `VALUE_PROPS` id, or is explicitly `null`.
- [ ] Every `STAKEHOLDERS[i]` has `name`, `title`, `role`, `sentiment`,
      `influence` (1–5).
- [ ] `STAKEHOLDERS.length` matches `PROJECT.participants` ± any
      stakeholders mentioned but not on call.
- [ ] Every `RISKS[i]` has `impact`, `likelihood`, `mitigation`.
- [ ] Every `NEXT_STEPS[i]` has `owner` and `due` (never both blank).
- [ ] `PROJECT.spotlightWord` exactly matches the word that's between
      `*...*` in `PROJECT.headline`.
- [ ] No invented quotes, names, or numbers. If unknown → `'TBD'`.
