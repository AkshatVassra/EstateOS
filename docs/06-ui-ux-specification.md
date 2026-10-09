# EstateOS — UI/UX Specification (Every Page)

Design system reference for implementation in `apps/web`.

## Global Tokens

| Token | Value |
|-------|--------|
| Font UI | Inter |
| Font mono | Geist Mono |
| Radius | 16px (`rounded-2xl` cards) |
| Grid | 8px |
| Motion | 200ms ease |
| bg | #FAFAFA |
| primary | #111827 |
| accent | #2563EB |
| success | #10B981 |
| warning | #F59E0B |
| danger | #EF4444 |
| card | white, shadow `0 1px 3px rgb(0 0 0 / 0.06)` |

## Information Architecture

```
Marketing Site (no sidebar)
  /, /pricing, /about, /blog, /contact, /book-demo
  /login, /register, /forgot-password
  /privacy, /terms

App (collapsible icon sidebar)
  /command-center  ← default after login
  /dashboard
  /leads → /leads/[id]
  /messages
  /properties → /properties/[id]
  /marketing, /content-calendar
  /ai-studio
  /analytics
  /appointments, /calendar
  /tasks, /notifications
  /team, /billing, /settings, /support
  /admin (super-admin)
```

## 1. Landing `/`

- **Hero:** Full viewport. Headline + sub + dual CTA. Right: animated dashboard mock (CSS).
- **Trust:** Logo strip placeholder
- **Problem:** 4 cards (slow replies, missed buyers, manual follow-up, posting fatigue)
- **Solution:** Vertical timeline animation (buyer → AI → qualified → recommended → notified → closed)
- **Features:** 6 large feature cards with icon + short copy
- **Pricing:** 3 tiers teaser → link /pricing
- **Testimonials:** 3 quote cards
- **FAQ:** Accordion
- **Footer:** Product, Company, Legal columns

## 2. Pricing `/pricing`

- Toggle monthly/annual
- Starter / Professional / Enterprise comparison table
- FAQ + CTA strip

## 3. Login `/login`

- Centered card 400px, subtle gradient bg
- Email, password, forgot link, Google OAuth button
- Link to register

## 4. Register `/register`

- Step indicator (1: Account, 2: Agency)
- Step 1: agency name, owner, email, password
- Step 2: company size, country, phone
- Progress bar top

## 5. AI Command Center `/command-center` ⭐

- Greeting: "Good morning, {name}"
- **Priority stack:** Action cards (hot lead, overdue follow-up, matching listing)
- **Columns below:** Hot buyers | Follow-ups | Today's appointments | Messages needing reply
- Each card: one primary action button
- Keyboard: `j/k` navigate cards (future)

## 6. Dashboard `/dashboard`

- KPI row: Today's leads, Hot leads, Appointments, Response time, Conversion, Revenue
- Second row: AI suggestions (list) + Recent activity feed + Upcoming follow-ups mini calendar
- Fit above fold on 1440px

## 7. Leads `/leads`

- Top: search, filters drawer, export, Add lead
- TanStack table: Lead, Status, Budget, Area, Timeline, Score, Agent
- Score pill color-coded; temperature badge
- Row click → detail

## 8. Lead Details `/leads/[id]`

- **3 columns:** Conversation (40%) | AI Summary (35%) | Recommendations (25%)
- Conversation: WhatsApp bubble UI, composer at bottom
- Summary: structured fields + lead score ring + next best action
- Recommendations: property cards with Send on WhatsApp
- Footer bar: Call, Email, Assign, Mark closed

## 9. Messages `/messages`

- Slack layout: thread list | conversation | lead profile + AI suggestions + quick replies
- Unread badges, channel filter WhatsApp only default

## 10. Properties `/properties`

- Grid cards: hero image, price, location, beds, status chip
- Toolbar: search, filters, Upload, Import dropdown

## 11. Property Details `/properties/[id]`

- Gallery hero, facts grid, amenities chips, payment plan, virtual tour embed
- Actions: Edit, Generate flyer, Generate video, Share

## 12. Marketing `/marketing`

- Postiz-like: calendar month view + side panel draft preview
- Quick actions: Generate caption, reel, flyer

## 13. Content Calendar `/content-calendar`

- Full calendar with scheduled posts dots; click day → list

## 14. AI Studio `/ai-studio`

- Chat layout with suggested prompts chips (caption, email, WhatsApp reply, compare projects)
- Left optional history list

## 15. Analytics `/analytics`

- KPI cards + Recharts line/bar/funnel
- Tabs: Overview, Agents, Properties, Sources

## 16. Appointments & Calendar

- Calendar: week/month, drag-drop placeholders
- Appointments list view with filters

## 17. Tasks `/tasks`

- Kanban or grouped list by priority; AI-generated tasks tagged

## 18. Notifications `/notifications`

- Grouped by type, mark read, deep links

## 19. Team `/team`

- Agent cards: avatar, leads count, revenue, assign leads modal

## 20. Billing `/billing`

- Stripe-like: plan card, usage meters, invoice table, upgrade CTA

## 21. Settings `/settings`

- Vertical tabs: General, Agency, WhatsApp, AI, Notifications, Branding, Security, API

## 22. Support `/support`

- Search FAQs, contact form, ticket list placeholder

## 23. Admin `/admin`

- Internal metrics: customers, MRR, AI cost, errors, flags

## 24. Marketing pages

- **About:** mission + team placeholder
- **Blog:** list + post template
- **Contact / Book demo:** form + calendar embed placeholder
- **Privacy / Terms:** prose layout

## Responsive

- Sidebar → bottom nav or drawer on `< md`
- Lead detail stacks: conversation → summary → recs on mobile

## Accessibility

- Focus rings visible, 44px touch targets, semantic headings, table aria-sort
