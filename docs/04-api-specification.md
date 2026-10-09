# EstateOS — API Specification (REST v1)

Base URL: `https://api.estateos.com/v1`  
Auth: `Authorization: Bearer <Clerk JWT>`  
Tenant: inferred from JWT `agencyId`

**Conventions:** JSON bodies; pagination `?page=1&limit=25`; errors `{ error: { code, message } }`.

## Auth & Onboarding

- `POST /auth/register` — agency + owner
- `GET /auth/me` — user, agency, permissions
- `POST /webhooks/clerk`

## Agency & Settings

- `GET/PATCH /agency`
- `GET /settings`, `PATCH /settings/:section`

## Team

- `GET /team`, `POST /team/invites`, `PATCH /team/:userId`, `GET /roles`

## Leads

- `GET /leads` (search, filters, sort)
- `POST /leads`, `GET/PATCH /leads/:id`
- `GET /leads/:id/timeline`, `POST /leads/import`, `GET /leads/export`

## Messages

- `GET /conversations`, `GET /conversations/:leadId/messages`
- `POST /conversations/:leadId/messages|notes|suggest-reply`
- `PATCH /conversations/:leadId/read`

## Properties

- CRUD `/properties`, import, Google Sheet sync, media upload, walkthrough job
- `GET /properties/:id/matches?leadId=`

## AI

- `GET /ai/command-center`
- `POST /ai/qualify|recommend|studio/chat|generate/*`

## Marketing, Appointments, Tasks, Analytics, Billing, Notifications

See full endpoint list in repo `packages/shared/src/api-routes.ts` (generated from OpenAPI later).

## Webhooks

- Stripe, Clerk, Meta WhatsApp Cloud API

## Admin (internal)

- Agencies, metrics, feature flags, AI cost
