// Example: Discovery Dashboard for a fictional NWFCU-style call.
// This file shows what the populated data constants look like with
// realistic content. The structural code matches the template exactly —
// only the data constants change. Use this as a quality reference for
// extraction depth, quote selection, and headline voice.

import React, { useState } from 'react';
import {
  ChevronDown, ChevronUp, AlertCircle, AlertTriangle, ArrowUpRight,
  Download, Share2, ExternalLink, Sparkles, Users, Target, Layers,
  GitBranch, Shield, Calendar, MessageCircle, CheckCircle2, Circle,
  XCircle, Clock,
} from 'lucide-react';

// (Design tokens C / FONT_DISPLAY / FONT_BODY / FONT_MONO same as template — omitted for brevity.)

// ============================================================
// EXAMPLE: Populated discovery data
// ============================================================

const PROJECT = {
  prospect: 'Northwest Federal Credit Union',
  prospectShort: 'NWFCU',
  callDate: '2026-04-23',
  callType: 'Discovery Call',
  stage: 'Discovery',
  owner: 'Richard Lin',
  participants: 6,
  eyebrow: 'DISCOVERY · APR 23 2026 · 47 MIN',
  headline: 'Two queues, *one mandate*.',
  spotlightWord: 'mandate',
  frame: 'Member services is splitting calls across two contact centers ' +
         'with no shared queue. The 12-week pilot replaces their after-hours ' +
         'overflow agent with an AI agent on the NWFCU number, with success ' +
         'measured on containment rate and post-call CSAT.',
  kpis: [
    { label: 'Deal-size signal', value: '$212K',  hint: 'signed pilot' },
    { label: 'Pilot length',     value: '12 wks', hint: 'live by Jun 1' },
    { label: 'Stakeholders',     value: '8',      hint: '3 decision-makers' },
    { label: 'Use cases',        value: '4',      hint: 'voice, IVR, FAQ, ID' },
  ],
  byline: 'Compiled from Otter transcript + Richard notes',
};

const STAKEHOLDERS = [
  {
    id: 'dk',
    name: 'Dee Kohler',
    title: 'Sr. Director, Member Services',
    role: 'champion',
    sentiment: 'positive',
    influence: 5,
    onCall: true,
    quote: 'We are hemorrhaging on after-hours volume.',
    notes: 'Internal champion. Pulled us into the room. Owns the member ' +
           'services number and the after-hours P&L.',
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
    notes: 'Security review will gate the pilot. Treat as priority-1. ' +
           'Walked us through the eval framework — 12-point checklist.',
  },
  {
    id: 'jc',
    name: 'James Chen',
    title: 'Director, Core Banking Engineering',
    role: 'technical',
    sentiment: 'neutral',
    influence: 4,
    onCall: true,
    quote: 'Our Symitar instance has 30+ custom fields. Has anyone done this depth before?',
    notes: 'Architect of their Symitar customization. Genuine question, not ' +
           'a gotcha — but the answer matters. Schedule deeper scoping with him.',
  },
  {
    id: 'lp',
    name: 'Linda Park',
    title: 'Procurement Manager',
    role: 'gatekeeper',
    sentiment: 'neutral',
    influence: 3,
    onCall: true,
    quote: 'Our paper takes 21 business days from receipt to signature.',
    notes: 'Procurement timeline is the deal\'s long pole. Get her the ' +
           'redline early.',
  },
  {
    id: 'rb',
    name: 'Roberto Brunelli',
    title: 'Member Services Floor Manager',
    role: 'user',
    sentiment: 'positive',
    influence: 2,
    onCall: true,
    quote: 'My team is on hold for 11 minutes some afternoons.',
    notes: 'Day-to-day operations voice. Pain is visceral and well-quantified.',
  },
  {
    id: 'sj',
    name: 'Sarah Johnson',
    title: 'CFO',
    role: 'economic_buyer',
    sentiment: 'neutral',
    influence: 5,
    onCall: false,
    quote: '(mentioned but did not attend the discovery call)',
    notes: 'The actual signer. Dee said she pre-briefed Sarah on the ' +
           'business case. Need to get her on a call before SOW signs.',
  },
  {
    id: 'tk',
    name: 'Tracy Kim',
    title: 'AVP, Compliance',
    role: 'gatekeeper',
    sentiment: 'neutral',
    influence: 3,
    onCall: true,
    quote: 'Are call recordings retained in your environment or ours?',
    notes: 'Compliance review separate from security. Data residency is her hot button.',
  },
  {
    id: 'ah',
    name: 'Aaron Hayes',
    title: 'Director, Member Experience',
    role: 'influencer',
    sentiment: 'positive',
    influence: 3,
    onCall: true,
    quote: 'I want CSAT measured per-call, not weekly aggregate.',
    notes: 'Strong CX advocate. Will probably push the pilot success criteria ' +
           'to be ambitious — useful ally on scope.',
  },
];

const PAIN_POINTS = [
  {
    id: 'p1',
    title: 'After-hours volume routed to voicemail',
    detail: 'Post-9pm calls drop into voicemail. Callbacks happen the next ' +
            'business day at best. Member satisfaction craters Monday morning.',
    quantified: true,
    metric: '31% callback rate · ~400 missed/wk',
    source: 'Dee Kohler, 12:14 in transcript',
    severity: 'high',
    linkedValuePropId: 'v1',
  },
  {
    id: 'p2',
    title: 'Two contact centers, no shared visibility',
    detail: 'Primary queue and overflow queue run on separate platforms. ' +
            'Agents can\'t see if a member already tried the other queue.',
    quantified: false,
    metric: null,
    source: 'Dee Kohler + Roberto Brunelli, 18:30 in transcript',
    severity: 'high',
    linkedValuePropId: 'v2',
  },
  {
    id: 'p3',
    title: 'Spanish-language coverage gaps',
    detail: 'Spanish queue staffed only weekday business hours. ~22% of ' +
            'members have Spanish preference flag, ~30% in San Antonio branch.',
    quantified: true,
    metric: '22% members · 30% in SA branch',
    source: 'Aaron Hayes, 25:08 in transcript',
    severity: 'medium',
    linkedValuePropId: 'v3',
  },
  {
    id: 'p4',
    title: 'Member identification takes 90+ seconds per call',
    detail: 'Account number + last 4 SSN + DOB + security question. Adds up ' +
            'across 4k weekly calls.',
    quantified: true,
    metric: '~90 sec/call · 100 agent-hours/wk',
    source: 'Roberto Brunelli, 31:45 in transcript',
    severity: 'medium',
    linkedValuePropId: 'v4',
  },
  {
    id: 'p5',
    title: 'No way to measure intent at the IVR level',
    detail: 'Current IVR is touch-tone. Members navigate by guessing, ' +
            'frequently abandon and call back to a different number.',
    quantified: false,
    metric: null,
    source: 'Aaron Hayes, 35:12 in transcript',
    severity: 'medium',
    linkedValuePropId: null,
  },
];

const VALUE_PROPS = [
  {
    id: 'v1',
    title: '24/7 AI agent on the member services number',
    detail: 'Voice agent picks up after-hours calls in under 800ms, handles ' +
            'top-25 intents end-to-end, routes the rest to on-call human queue.',
    proofPoint: 'NWFCU pilot · OneCenTeam reference call available',
    linkedPainId: 'p1',
  },
  {
    id: 'v2',
    title: 'Unified queue routing with shared member context',
    detail: 'AI agent maintains member context across both queues. When a ' +
            'transfer happens, the human agent sees the full intent + history.',
    proofPoint: 'GameStop deployment — same multi-queue pattern',
    linkedPainId: 'p2',
  },
  {
    id: 'v3',
    title: 'Native bilingual EN/ES voice + chat',
    detail: 'Spanish-first option from greeting. Agent switches languages ' +
            'mid-call without losing context. Same quality both languages.',
    proofPoint: 'AnyLingual stack · UBA Ghana deployment',
    linkedPainId: 'p3',
  },
  {
    id: 'v4',
    title: 'Voice biometric + Symitar lookup at greeting',
    detail: 'Member identified by voice + caller ID + verbal challenge in ' +
            '~15 seconds. Direct Symitar real-time lookup.',
    proofPoint: 'NWFCU technical scoping with James Chen planned',
    linkedPainId: 'p4',
  },
];

const SCOPE = {
  channels: [
    { name: 'Voice',  status: 'committed',   volume: '~4k calls/wk', note: 'Primary scope · after-hours first' },
    { name: 'Chat',   status: 'probable',    volume: 'TBD',          note: 'Phase 2 after pilot success' },
    { name: 'SMS',    status: 'exploratory', volume: 'TBD',          note: 'Mentioned, no commitment yet' },
    { name: 'Email',  status: 'out',         volume: '—',            note: 'Handled by Salesforce in-house' },
  ],
  languages: ['English', 'Spanish'],
  integrations: [
    { name: 'Symitar (core banking)',     status: 'committed', complexity: 'high',   note: 'Real-time account lookup, custom fields' },
    { name: 'Verint (contact center)',    status: 'committed', complexity: 'medium', note: 'Warm transfer + call recording' },
    { name: 'Salesforce Financial Cloud', status: 'probable',  complexity: 'medium', note: 'Member context surface' },
    { name: 'Genesys Cloud telephony',    status: 'committed', complexity: 'low',    note: 'SIP trunk + 800-number' },
  ],
  useCases: [
    { name: 'After-hours overflow',         priority: 1, status: 'committed' },
    { name: 'IVR replacement',              priority: 2, status: 'committed' },
    { name: 'FAQ deflection',               priority: 3, status: 'probable'  },
    { name: 'Member identification',        priority: 4, status: 'committed' },
    { name: 'Loan origination intake',      priority: 5, status: 'exploratory' },
  ],
  inScope: [
    'AI voice agent on 800-XXX-XXXX after-hours (post-9pm + weekends)',
    'Symitar real-time account lookup with PII redaction',
    'Warm transfer to on-call human queue with context handoff',
    'Bilingual EN/ES from greeting',
    'Post-call CSAT survey trigger',
  ],
  outOfScope: [
    'Outbound campaigns',
    'Wealth management line',
    'Branch appointment booking',
    'Loan underwriting decisioning',
  ],
  technicalRequirements: [
    { req: 'SOC 2 Type II report',         status: 'open',     owner: 'Marcus Reyes' },
    { req: 'FedRAMP not required',         status: 'confirmed', owner: 'Marcus Reyes' },
    { req: 'Data residency: US-only',      status: 'confirmed', owner: 'Marcus Reyes' },
    { req: 'PII redaction in transcripts', status: 'open',     owner: 'Tracy Kim' },
    { req: 'Call recording retention 7 yrs', status: 'open',   owner: 'Tracy Kim' },
  ],
};

const DECISION = {
  criteria: [
    { criterion: 'SOC 2 Type II',                       weight: 'must-have',    met: 'unknown' },
    { criterion: 'Sub-second voice latency',            weight: 'must-have',    met: 'yes'     },
    { criterion: 'Symitar integration experience',      weight: 'must-have',    met: 'partial' },
    { criterion: 'Bilingual EN/ES out of the box',      weight: 'must-have',    met: 'yes'     },
    { criterion: 'Reference customer in credit unions', weight: 'nice-to-have', met: 'no'      },
    { criterion: 'Outcomes-based pricing option',       weight: 'nice-to-have', met: 'yes'     },
  ],
  process: [
    { stage: 'Champion buy-in',          owner: 'Dee Kohler',     status: 'done',        date: '2026-04-23' },
    { stage: 'Security review',          owner: 'Marcus Reyes',   status: 'in_progress', date: '2026-05-10' },
    { stage: 'Compliance review',        owner: 'Tracy Kim',      status: 'pending',     date: '2026-05-15' },
    { stage: 'Pilot SOW sign-off',       owner: 'Linda Park',     status: 'pending',     date: '2026-05-20' },
    { stage: 'CFO final approval',       owner: 'Sarah Johnson',  status: 'pending',     date: '2026-05-25' },
    { stage: 'Pilot kickoff',            owner: 'Anyreach',       status: 'future',      date: '2026-06-01' },
    { stage: 'Pilot review + expansion', owner: 'Joint',          status: 'future',      date: '2026-08-24' },
  ],
  timeline: {
    discoveryDate:    '2026-04-23',
    pilotStartTarget: '2026-06-01',
    pilotEndTarget:   '2026-08-24',
    expansionTarget:  '2026-09-15',
  },
};

const COMPETITION = [
  {
    name: 'Incumbent (in-house Verint IVR)',
    type: 'incumbent',
    positioning: 'Status quo. No AI capability, but zero switching cost ' +
                 'and an existing $400K/yr Verint contract.',
    threat: 'high',
    note: 'Inertia is the real opponent here.',
  },
  {
    name: 'Five9 Conversational AI',
    type: 'direct',
    positioning: 'Bigger brand, slower deployment cycle, $/seat pricing. ' +
                 'Their Symitar reference is 18 months old.',
    threat: 'medium',
    note: 'Marcus mentioned getting a quote. Not actively evaluating yet.',
  },
  {
    name: 'PolyAI',
    type: 'direct',
    positioning: 'Voice-first specialist. No outcomes-based pricing. ' +
                 'Strong UK reference base, thin US credit union story.',
    threat: 'low',
    note: 'Heard once in passing, no active eval.',
  },
];

const RISKS = [
  {
    id: 'r1',
    title: 'Security review may demand FedRAMP',
    detail: 'Marcus initially said no, but procurement template defaults to ' +
            'FedRAMP-required for credit unions. Worth confirming in writing.',
    impact: 'high',
    likelihood: 'medium',
    mitigation: 'Have Tom Aiello pre-walk Marcus through SOC 2 evidence ' +
                'package by 5/3. Get FedRAMP-not-required confirmed in writing.',
    owner: 'Richard',
    source: 'Marcus Reyes, 28:40 in transcript',
  },
  {
    id: 'r2',
    title: 'Symitar custom-field depth not yet proven',
    detail: 'Their Symitar instance has 30+ custom fields including some ' +
            'we haven\'t integrated against. Could surface a 4-week scoping delay.',
    impact: 'medium',
    likelihood: 'high',
    mitigation: 'Schedule technical scoping call with James Chen + Mukunth ' +
                'within 10 days of discovery. Snapshot of custom-field schema before SOW.',
    owner: 'Mukunth',
    source: 'James Chen, 33:12 in transcript',
  },
  {
    id: 'r3',
    title: 'Sarah Johnson (CFO) wasn\'t on the call',
    detail: 'She\'s the actual signer. We have no direct read on her ' +
            'priorities or concerns yet — relying entirely on Dee\'s briefing.',
    impact: 'high',
    likelihood: 'medium',
    mitigation: 'Ask Dee to broker a 30-min CFO intro call before SOW lands. ' +
                'Send Sarah a 1-page ROI brief in advance.',
    owner: 'Richard',
    source: 'Dee Kohler, 8:15 in transcript',
  },
  {
    id: 'r4',
    title: 'Procurement timeline ≥ pilot start target',
    detail: 'Linda quoted 21 business days from receipt. If the SOW lands ' +
            'May 10, that pushes signature to early June — pilot start slips.',
    impact: 'medium',
    likelihood: 'high',
    mitigation: 'Pre-share SOW redline with Linda by 4/30. Get her marking ' +
                'it up before formal submission.',
    owner: 'Richard',
    source: 'Linda Park, 42:18 in transcript',
  },
];

const OPEN_QUESTIONS = [
  { question: 'What is the actual FY26 budget envelope for member services tech?', owner: 'Dee Kohler / Sarah Johnson' },
  { question: 'Will security accept SOC 2 alone, or do we need HIPAA too?',         owner: 'Marcus Reyes' },
  { question: 'What\'s the expansion path beyond after-hours — daytime overflow?',  owner: 'Aaron Hayes' },
  { question: 'Is Sarah Johnson the actual signer on the MSA?',                    owner: 'Dee Kohler' },
  { question: 'Are call recordings retained in our environment or theirs?',         owner: 'Tracy Kim' },
];

const NEXT_STEPS = [
  { action: 'Send SOC 2 Type II evidence package + DPA template to Marcus',        owner: 'Richard',  due: '2026-04-26', status: 'open', priority: 1 },
  { action: 'Schedule technical scoping call with James Chen (NWFCU core banking)', owner: 'Mukunth',  due: '2026-04-30', status: 'open', priority: 2 },
  { action: 'Pre-share SOW redline with Linda Park (procurement)',                  owner: 'Richard',  due: '2026-04-30', status: 'open', priority: 3 },
  { action: 'Broker CFO intro call with Sarah Johnson via Dee',                     owner: 'Richard',  due: '2026-05-03', status: 'open', priority: 4 },
  { action: 'Draft pilot SOW from MSA template with NWFCU-specific success criteria', owner: 'Richard', due: '2026-05-02', status: 'open', priority: 5 },
  { action: 'Confirm FedRAMP-not-required in writing from Marcus',                  owner: 'Richard',  due: '2026-05-05', status: 'open', priority: 6 },
];

// The rest of the file (helper components + view components + top-level
// DiscoveryDashboard component) is identical to templates/dashboard_template.jsx.
// In a real run, copy the full template and just replace the data constants above.

// (omitted here to keep this example file focused on the data-shape demo)
