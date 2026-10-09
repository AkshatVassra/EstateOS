# EstateOS — Development Roadmap

## Phase 0 — Planning (Week 0) ✅

- Brand, architecture, schema, API, AI flows, UI spec, deployment plan
- Monorepo scaffold + design system + route shells

## Month 1 — Foundation

| Week | Deliverables |
|------|----------------|
| 1 | Prisma schema migrate; NestJS skeleton; Clerk auth; agency bootstrap |
| 2 | Landing + auth flows live on Vercel; dashboard shell + Command Center (mock API) |
| 3 | Leads CRUD + table + lead detail layout; PostgreSQL FTS search |
| 4 | Settings, team invites, RBAC; Sentry + PostHog |

**Validation:** 3 design partners confirm IA and lead UI.

## Month 2 — WhatsApp + AI Core

| Week | Deliverables |
|------|----------------|
| 5 | Meta WhatsApp Cloud API webhook; message storage; inbox UI |
| 6 | AI qualification loop + lead scoring; agent notifications |
| 7 | AI Command Center wired to real data; tasks from AI |
| 8 | Pilot with 2–3 agencies; fix reply quality + latency |

**Gate:** ≥80% pilot satisfaction on auto-replies OR disable auto-send default.

## Month 3 — Inventory + Recommendations

| Week | Deliverables |
|------|----------------|
| 9 | Property CRUD, R2 media, CSV import |
| 10 | AI property matching + send via WhatsApp |
| 11 | Google Sheets sync (read-only v1) |
| 12 | Pilot re-test; measure time-to-first-recommendation |

## Month 4 — Marketing

| Week | Deliverables |
|------|----------------|
| 13 | Caption/flyer generation; content calendar UI |
| 14 | Schedule queue (BullMQ); manual publish export if no API keys |
| 15 | Optional Meta/IG publish if customers demand |
| 16 | Build only if ≥2 pilots request marketing |

## Month 5 — Analytics + Billing + Team

| Week | Deliverables |
|------|----------------|
| 17 | Analytics rollups + charts |
| 18 | Stripe subscriptions + usage |
| 19 | Team performance dashboard |
| 20 | Security audit, rate limits, audit logs |

## Month 6 — GTM

- 10 paying agencies target
- Onboarding playbook, demo environment, support docs
- Iterate pricing from usage data

## Weekly Rituals

- Ship notes every Friday
- Review AI cost per agency Monday
- Customer call minimum 2/week until 10 paid

## Definition of Done (Feature)

- Zod validated API + tenant isolation test
- Empty/loading/error states in UI
- PostHog event for primary action
- Docs updated in `/docs`
