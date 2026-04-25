# Mixpanel Query Reference

All queries use **Project ID: 3699924**. Default date range: `2025-11-01` to today. Conversion window: 30 days unless noted.

## 1. Acquisition Funnel

```
Run-Funnels-Query
events: [
  {"event": "CTA Clicked", "step_label": "Homepage CTA Click"},
  {"event": "Signup Started"},
  {"event": "Signup Completed"},
  {"event": "Onboarding Page Viewed"},
  {"event": "Onboarding Completed"}
]
length: 30, length_unit: "day"
```

## 2. Onboarding Detail (with analysis states)

```
Run-Funnels-Query
events: [
  {"event": "Onboarding Page Viewed"},
  {"event": "Onboarding Analysis State Changed", "selector": "properties[\"analysis_state\"] == \"loading\""},
  {"event": "Onboarding Analysis State Changed", "selector": "properties[\"analysis_state\"] == \"complete\""},
  {"event": "Onboarding Completed"}
]
length: 30, length_unit: "day"
```

## 3. Onboarding Exits

```
Run-Segmentation-Query
event: "Onboarding Abandoned"
type: "unique", unit: "month"

Run-Segmentation-Query
event: "Onboarding Skipped"
type: "unique", unit: "month"
```

Sum across all months for totals.

## 4. In-App Activation Funnels

Run each of these separately from Signup Completed:

### 4a. Agent Building
```
Run-Funnels-Query
events: [
  {"event": "Signup Completed"},
  {"event": "Agent Created"},
  {"event": "Agent Edited"},
  {"event": "Agent Published"},
  {"event": "Agent Tested"}
]
length: 30, length_unit: "day"
```

### 4b. Dashboard & Navigation
```
Run-Funnels-Query
events: [
  {"event": "Signup Completed"},
  {"event": "Dashboard Viewed"},
  {"event": "Agents Viewed"},
  {"event": "Agent Created"}
]
length: 30, length_unit: "day"
```

### 4c. Trial & Billing
```
Run-Funnels-Query
events: [
  {"event": "Signup Completed"},
  {"event": "Trial Started"},
  {"event": "Subscription Created"}
]
length: 30, length_unit: "day"
```

### 4d. Knowledge Base
```
Run-Funnels-Query
events: [
  {"event": "Signup Completed"},
  {"event": "Knowledge Base Viewed"},
  {"event": "Knowledge Base Collection Created"}
]
length: 30, length_unit: "day"
```

### 4e. Workflows
```
Run-Funnels-Query
events: [
  {"event": "Signup Completed"},
  {"event": "Workflows Viewed"},
  {"event": "Workflow Created"}
]
length: 30, length_unit: "day"
```

### 4f. Phone Numbers
```
Run-Funnels-Query
events: [
  {"event": "Signup Completed"},
  {"event": "Phone Numbers Viewed"},
  {"event": "Phone Numbers Purchased"}
]
length: 30, length_unit: "day"
```

### 4g. Conversations
```
Run-Funnels-Query
events: [
  {"event": "Signup Completed"},
  {"event": "Conversations Viewed"},
  {"event": "Conversation Viewed"}
]
length: 30, length_unit: "day"
```

### 4h. Team / Members
```
Run-Funnels-Query
events: [
  {"event": "Signup Completed"},
  {"event": "Members Viewed"},
  {"event": "Members Invited"}
]
length: 30, length_unit: "day"
```

## 5. Auth Page Pre/Post Comparison

### Daily Signup Started (for denominator context)
```
Run-Segmentation-Query
event: "Signup Started"
from_date: "2026-01-27", to_date: today
type: "unique", unit: "day"
```

### Daily Signup Completed (the valid comparison metric)
```
Run-Segmentation-Query
event: "Signup Completed"
from_date: "2026-01-27", to_date: today
type: "unique", unit: "day"
```

**Computation:**
- Pre period: Jan 27 – Feb 12 (17 days). Sum daily completions, divide by 17.
- Post period: Feb 13 – today. Sum daily completions, divide by days.
- Compare daily averages. DO NOT compare conversion rates (different Signup Started definitions).

## 6. Hidden Insight Queries

### 6a. Onboarding Path → Agent Creation (skipper vs completer vs abandoner)
```
Run-Funnels-Query
events: [{"event": "Onboarding Completed"}, {"event": "Agent Created"}]
length: 30, length_unit: "day"

Run-Funnels-Query
events: [{"event": "Onboarding Skipped"}, {"event": "Agent Created"}]
length: 30, length_unit: "day"

Run-Funnels-Query
events: [{"event": "Onboarding Abandoned"}, {"event": "Agent Created"}]
length: 30, length_unit: "day"
```

### 6b. Trial → Agent Creation
```
Run-Funnels-Query
events: [{"event": "Trial Started"}, {"event": "Agent Created"}]
length: 30, length_unit: "day"
```

### 6c. 7-Day vs 30-Day Activation Window
```
Run-Funnels-Query
events: [{"event": "Signup Completed"}, {"event": "Agent Created"}]
length: 7, length_unit: "day"

Run-Funnels-Query
events: [{"event": "Signup Completed"}, {"event": "Agent Created"}]
length: 30, length_unit: "day"
```

### 6d. Onboarding → Dashboard Handoff
```
Run-Funnels-Query
events: [
  {"event": "Onboarding Completed"},
  {"event": "Dashboard Viewed"},
  {"event": "Agent Created"}
]
length: 30, length_unit: "day"
```

### 6e. Weekly Agent Creation (flat line check)
```
Run-Segmentation-Query
event: "Agent Created"
type: "unique", unit: "week"

Run-Segmentation-Query
event: "Signup Completed"
type: "unique", unit: "week"
```

## Query Count Summary

Running the full analysis requires approximately **20 Mixpanel API calls**:
- 1 acquisition funnel
- 1 onboarding detail funnel
- 2 onboarding exit segmentations
- 8 in-app activation funnels (4a-4h)
- 2 auth comparison segmentations (daily)
- 3 onboarding path funnels (6a)
- 1 trial → agent funnel (6b)
- 2 activation window funnels (6c)
- 1 onboarding → dashboard funnel (6d)
- 2 weekly segmentations (6e)

Total: ~23 queries
