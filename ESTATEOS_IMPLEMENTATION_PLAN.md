# EstateOS Implementation Plan

**Status:** Current engineering plan  
**Date:** September 6, 2026  
**Scope:** Core product loop and official Meta WhatsApp Cloud API

## 1. Current Assessment

The product architecture and Prisma model coverage are useful foundations. The main problem is incomplete behavior, not a need to redesign the platform.

| Area | State | Priority |
|---|---|---|
| Database and tenant model | Defined, needs indexes and access tests | High |
| API modules | Mostly scaffolded | High |
| WhatsApp | Not operational | Critical |
| Lead scoring | Missing | Critical |
| AI qualification | Not wired end to end | Critical |
| Property matching | Missing | Critical |
| Command Center | Shell exists, aggregation missing | Critical |
| Tasks and notifications | Models exist, automation missing | High |
| Analytics and marketing | Defer until core loop works | Medium |

## 2. Product Loop To Ship First

```text
Meta webhook
  -> verify and acknowledge
  -> identify agency and lead
  -> persist inbound message
  -> extract qualification slots
  -> recalculate score and temperature
  -> generate or queue a reply
  -> persist outbound message
  -> create task and notification when needed
  -> show the result in Command Center
```

Do not expand marketing, advanced analytics, or video generation until this loop works reliably.

## 3. Build Order

### Phase 1: Core Loop

1. Add database indexes and tenant-isolation tests.
2. Implement Meta webhook verification and raw-body signature validation.
3. Process inbound text messages idempotently using the Meta message ID.
4. Find or create the lead by agency and normalized phone number.
5. Implement slot extraction and lead scoring.
6. Generate a reply behind a queue with retry and dead-letter handling.
7. Implement property matching.
8. Aggregate the Command Center from real data.
9. Add focused unit and integration tests.

### Phase 2: Workflow Automation

1. Auto-create qualification, follow-up, and property recommendation tasks.
2. Add hot-lead and overdue-follow-up notifications.
3. Add appointment reminders.
4. Enforce role and permission checks at the API boundary.
5. Add audit events for tenant-sensitive operations.

### Phase 3: Business Intelligence

1. Add daily analytics read models.
2. Build KPI, funnel, and agent-performance views.
3. Add approved WhatsApp template workflows for outbound campaigns.
4. Add marketing generation only after the core loop has pilot usage data.

## 4. Meta WhatsApp Cloud API

### Required configuration

Create a Meta Business Account and WhatsApp app. Obtain a WABA ID, phone number ID, permanent or rotated system-user token, and app secret.

```env
WHATSAPP_BUSINESS_ACCOUNT_ID=your_waba_id
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_system_user_token
WHATSAPP_APP_SECRET=your_app_secret
WHATSAPP_WEBHOOK_VERIFY_TOKEN=long_random_value
WHATSAPP_API_VERSION=vXX.X
```

Store tokens in a secret manager in production. Do not store them in Prisma or commit them to `.env` files.

### Webhook contract

Use two routes:

- `GET /webhooks/whatsapp/messages` for Meta verification.
- `POST /webhooks/whatsapp/messages` for inbound messages and status updates.

The POST handler must:

1. Capture the raw request body.
2. Validate `X-Hub-Signature-256` with HMAC-SHA256 and a timing-safe comparison.
3. Return HTTP 200 quickly after enqueueing the event.
4. Process the event asynchronously.
5. Treat duplicate deliveries as harmless.

Do not calculate the signature from `JSON.stringify(parsedBody)`. JSON formatting can change and invalidate a valid signature. In NestJS, configure raw-body capture and validate the exact bytes received from Meta.

### Important Meta behavior

- Free-form replies generally require an active customer-service window.
- Outside that window, use an approved template.
- Templates must be approved by Meta before production use.
- Use the Graph API endpoint:
  `https://graph.facebook.com/{version}/{phone-number-id}/messages`
- Recipient phone numbers are sent as digits without the leading `+`.
- Store Meta message IDs and use them as idempotency keys.
- Do not assume one global WhatsApp account if EstateOS is multi-tenant. Store the agency's WABA and phone-number configuration and resolve credentials by the webhook phone-number ID.

### Minimal event processing pseudocode

```typescript
async function processWhatsAppEvent(event: MetaWebhookEvent) {
  for (const entry of event.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;

      for (const message of value.messages ?? []) {
        if (await messageExists(message.id)) continue;

        const account = await findAccountByPhoneNumberId(
          value.metadata.phone_number_id,
        );
        const phone = normalizePhone(message.from);
        const lead = await findOrCreateLead(account.agencyId, phone);

        await saveInboundMessage({
          externalMessageId: message.id,
          agencyId: account.agencyId,
          leadId: lead.id,
          body: extractMessageText(message),
        });

        await queueQualification({
          agencyId: account.agencyId,
          leadId: lead.id,
          messageId: message.id,
        });
      }

      for (const status of value.statuses ?? []) {
        await updateMessageStatus(status.id, status.status);
      }
    }
  }
}
```

The queue worker should extract slots, update the lead, calculate the score, find matches, and send a reply. A failed job must be retryable and visible in a dead-letter queue.

## 5. Lead Scoring

Start with a deterministic score that can be calibrated using pilot data:

| Factor | Weight |
|---|---:|
| Budget clarity | 20 |
| Timeline urgency | 20 |
| Engagement | 15 |
| Qualification completion | 25 |
| Viewing or purchase intent | 20 |

Store the score and temperature on the lead:

- `COLD`: 0-39
- `WARM`: 40-74
- `HOT`: 75-100

Every score change should record the reason or source event. This makes manual calibration possible and prevents the score from becoming unexplained magic.

## 6. Property Matching

Rank available properties from 0 to 100:

- Budget fit: 40 points
- Bedrooms: 20 points
- Location: 20 points
- Amenities: 10 points
- Property type: 10 points

Return match reasons with every result. A recommendation without an explanation is difficult for an agent to trust.

## 7. Command Center

The first real dashboard response should include:

- Five highest-scoring hot leads.
- Messages waiting for a reply.
- Overdue tasks.
- Today's confirmed or scheduled appointments.
- Top property recommendations.

Use tenant-scoped indexed queries and a short cache, but do not cache data across agencies. The initial acceptance target is a p95 response under two seconds with realistic pilot data.

## 8. Data and Security Requirements

- Every query involving a tenant-owned record must include `agencyId`.
- Resolve tenant context from authenticated identity, never from an arbitrary request body.
- Normalize phone numbers before lookup and enforce a composite uniqueness rule such as `(agencyId, phone)`.
- Add indexes for common access paths, including `(agencyId, temperature, score)`, `(agencyId, status)`, `(agencyId, createdAt)`, and `(leadId, createdAt)`.
- Make inbound processing idempotent on `externalMessageId`.
- Encrypt Meta tokens at rest and rotate them.
- Rate-limit outbound sends per agency and respect Meta quality and throughput limits.
- Redact message content and tokens from logs.
- Add cross-tenant access tests before inviting pilot agencies.

## 9. Testing Gate

The core loop is not ready for a pilot until these checks pass:

- Invalid webhook verification token is rejected.
- Invalid or missing Meta signature is rejected.
- Valid webhook is acknowledged quickly.
- Duplicate Meta delivery creates one message and one lead update.
- Unknown phone creates one lead for the correct agency.
- Slot extraction updates only supplied fields.
- Score thresholds produce the expected temperature.
- Failed AI or Graph API jobs retry without duplicate outbound messages.
- A hot lead creates one urgent task and one notification.
- A user from agency A cannot read or mutate agency B data.
- Command Center returns real data within the agreed latency target.

## 10. Pilot Exit Criteria

Before onboarding agencies:

- Meta production access and approved templates are ready.
- Inbound and outbound messages work with a real test number.
- Sentry or equivalent error monitoring is active.
- Database backups and migration rollback procedures are tested.
- Queue failures are visible and recoverable.
- Privacy policy and customer-data handling are published.
- Empty, loading, error, and mobile states are usable in the web app.

Track only a small set of pilot metrics at first: messages processed, duplicate rate, AI reply acceptance, hot-lead accuracy, property-match acceptance, response latency, and lead-to-viewing conversion.

## 11. Repository Documentation

The canonical product specifications remain in [`docs/`](docs/). This file is the single implementation and delivery plan. The old root-level review, task breakdown, quick-reference, and provider-specific documents were consolidated into it to avoid conflicting instructions.
