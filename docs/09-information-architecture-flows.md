# EstateOS — Information Architecture & User Flows

## Primary personas

1. **Agency owner** — analytics, billing, team, WhatsApp connection  
2. **Agent (Ali)** — Command Center, leads, messages, properties  
3. **Internal admin** — `/admin` metrics only  

## Navigation map

```
Marketing (public)
  Home → Pricing / Demo / Register

App (authenticated)
  Default landing: /command-center
  Sidebar: Dashboard, Leads, Messages, Properties, Marketing, AI Studio, Analytics, Team, Settings, Billing
```

## Critical user flows

### Flow A — Morning routine (agent)

1. Open app → **Command Center**  
2. Tap top priority card (hot buyer)  
3. **Lead detail** → review AI summary → send viewing slot on WhatsApp  
4. Mark task done → back to Command Center  

**Success:** &lt; 90 seconds to first meaningful action.

### Flow B — New WhatsApp lead (automated)

1. Buyer messages agency number  
2. AI qualifies (budget, beds, timeline…)  
3. AI recommends 2–3 properties  
4. Agent gets **Hot lead** notification  
5. Agent opens **Messages** only if needed  

**Success:** Agent intervenes only when score ≥ threshold or buyer asks for human.

### Flow C — List new inventory

1. **Properties** → Import CSV or manual  
2. AI indexes for search + matching  
3. **Marketing** → generate posts from property  
4. Schedule to calendar  

### Flow D — Owner weekly review

1. **Analytics** → funnel + response time  
2. **Team** → compare agents  
3. **Billing** → usage vs plan  

## Page count checklist (implemented in web app)

- [x] Landing, Pricing, About, Blog, Contact, Book demo  
- [x] Login, Register, Forgot password, Privacy, Terms  
- [x] Command Center, Dashboard  
- [x] Leads, Lead detail  
- [x] Messages, Properties, Property detail  
- [x] Marketing / Content calendar  
- [x] AI Studio, Analytics  
- [x] Appointments, Calendar, Tasks, Notifications  
- [x] Team, Billing, Settings, Support, Admin  

## Keyboard shortcuts (planned)

| Key | Action |
|-----|--------|
| `G then L` | Go to Leads |
| `G then M` | Messages |
| `G then C` | Command Center |
| `/` | Focus search |
