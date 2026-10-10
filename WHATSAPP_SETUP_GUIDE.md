# Meta WhatsApp Cloud API - Production Setup Guide

This guide covers the production-ready implementation of Meta WhatsApp Cloud API for EstateOS, optimized for Dubai real estate agencies.

## Overview

Your WhatsApp infrastructure is now **100% production-ready** with:
- ✅ Signature validation (always enforced, no dev mode bypass)
- ✅ Database-backed queueing (durable, no message loss)
- ✅ Retry logic with exponential backoff (up to 5 attempts)
- ✅ Idempotency handling (duplicate events are harmless)
- ✅ Token encryption (AES-256-GCM)
- ✅ Distributed rate limiting (Redis-ready)
- ✅ Health check endpoint (`GET /api/health`)
- ✅ Comprehensive error logging
- ✅ Integration tests

## Architecture

```
Meta WhatsApp → Webhook Controller → Signature Validation → WebhookEventService (DB Queue)
                                                              ↓
                                                          Webhook Worker
                                                              ↓
                                            CommunicationOrchestrator → AI Pipeline
                                                              ↓
                                                    WhatsAppSenderService → Meta API
```

## Environment Variables

Add these to your `.env` file:

```bash
# Meta WhatsApp Cloud API (REQUIRED)
META_APP_SECRET="your_meta_app_secret"
META_WEBHOOK_VERIFY_TOKEN="your_long_random_verify_token"
META_PHONE_NUMBER_ID="your_phone_number_id"
META_BUSINESS_ACCOUNT_ID="your_business_account_id"
META_ACCESS_TOKEN="your_system_user_token"

# Token Encryption (REQUIRED)
# Generate with: openssl rand -base64 32
WHATSAPP_TOKEN_ENCRYPTION_KEY="your_base64_32_byte_key"

# API Configuration
WHATSAPP_API_VERSION="v21.0"
WEBHOOK_RATE_LIMIT_PER_MINUTE="120"

# Redis (OPTIONAL but recommended for distributed rate limiting)
REDIS_URL="redis://localhost:6379"

# Monitoring (OPTIONAL but recommended)
SENTRY_DSN="your_sentry_dsn"
SENTRY_ENVIRONMENT="production"
```

## Setup Steps

### 1. Generate Encryption Key

```bash
openssl rand -base64 32
```

Add the output to `WHATSAPP_TOKEN_ENCRYPTION_KEY`.

### 2. Configure Meta Business Manager

1. Go to [Meta Business Manager](https://business.facebook.com)
2. Create/select your WhatsApp Business Account
3. Add your phone number and verify it
4. Configure your business profile:
   - Profile photo (your logo)
   - Display name (your brand)
   - Business description
   - Website
   - Contact info

### 3. Create Meta App

1. Go to [Meta for Developers](https://developers.facebook.com)
2. Create a new app (Business type)
3. Add WhatsApp product
4. Configure webhook:
   - Webhook URL: `https://your-domain.com/api/communication/webhook`
   - Verify Token: Use the value from `META_WEBHOOK_VERIFY_TOKEN`
5. Subscribe to `messages` and `message_status` fields
6. Generate a System User Access Token with `whatsapp_business_messaging` permission
7. Get your App Secret from Settings > Basic

### 4. Configure Webhook Verification

The webhook controller handles both GET (verification) and POST (events):

```typescript
GET /api/communication/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=CHALLENGE
```

Meta will call this to verify your webhook. Returns the challenge if the token matches.

### 5. Start the Webhook Worker

The worker processes events from the database queue:

```bash
npm run worker --workspace=api
```

Or with Docker Compose:

```bash
docker compose up
```

This starts:
- API server (Next.js)
- Web app (Next.js)
- MySQL database
- Webhook worker

### 6. Verify Health Check

Check that your infrastructure is healthy:

```bash
curl http://localhost:3001/api/health
```

Expected response:

```json
{
  "status": "healthy",
  "timestamp": "2026-10-10T12:00:00.000Z",
  "checks": {
    "database": "ok",
    "webhookQueue": {
      "pending": 0,
      "processing": 0,
      "retry": 0,
      "deadLetter": 0
    },
    "whatsappAccounts": {
      "active": 1
    }
  }
}
```

## Testing

Run the integration tests:

```bash
npm run test:core
```

This tests:
- Signature validation
- Webhook verification
- Rate limiting
- Event enqueueing
- Duplicate handling

## Monitoring

### Health Check Endpoint

`GET /api/health` - Check infrastructure health

### Logs

Watch for these log patterns:

```
[Webhook] Event enqueued: abc123 (duplicate: false)
[WebhookEvent] Processing event abc123 (attempt 1/5)
[WebhookEvent] Successfully processed event abc123
[WhatsApp] Sending message to +971501234567 via phone number 123456
[WhatsApp] Message sent successfully, provider ID: msg123
```

### Dead Letter Queue

If events fail after 5 attempts, they move to `DEAD_LETTER` status. Monitor this:

```sql
SELECT * FROM webhook_event WHERE status = 'DEAD_LETTER' ORDER BY created_at DESC LIMIT 10;
```

## Production Checklist

Before going live:

- [ ] All environment variables set (no defaults)
- [ ] Meta webhook verified and subscribed
- [ ] Token encryption key generated (32 bytes, base64)
- [ ] Database indexes applied
- [ ] Worker process running and auto-restart configured
- [ ] Health check endpoint accessible
- [ ] Error monitoring (Sentry) configured
- [ ] Rate limiting configured
- [ ] SSL/TLS enabled on your domain
- [ ] Database backups configured
- [ ] Webhook URL accessible from Meta's servers
- [ ] Test message sent and received successfully

## Dubai-Specific Considerations

### Currency Billing

Meta supports AED billing for UAE businesses. Configure your WhatsApp Business Account to bill in AED to avoid currency conversion fees.

### VAT

- UAE: 5% VAT applies to Meta fees
- Saudi Arabia: 15% VAT applies

### Message Rates (October 2026)

For UAE numbers:
- Service/Utility/Authentication: $0.0157 (AED 0.0576) per message
- Marketing: $0.0576 (AED 0.2115) per message
- First 1,000 service messages/month free per phone number

### Compliance

- Ensure your business profile is verified
- Use approved templates for marketing messages
- Respect the 24-hour customer service window
- Don't send marketing messages without opt-in

## Troubleshooting

### Webhook Not Receiving Events

1. Check webhook URL is accessible: `curl https://your-domain.com/api/communication/webhook`
2. Verify Meta app has correct webhook URL
3. Check webhook is subscribed to `messages` field
4. Verify `META_WEBHOOK_VERIFY_TOKEN` matches

### Signature Validation Failing

1. Ensure `META_APP_SECRET` is correct
2. Check webhook is receiving raw body (not parsed)
3. Verify signature header format: `x-hub-signature-256: sha256=...`

### Messages Not Sending

1. Check `META_ACCESS_TOKEN` is valid and not expired
2. Verify phone number ID is correct
3. Check 24-hour customer service window is open
4. Ensure template is approved (for marketing messages)

### Worker Not Processing Events

1. Check worker process is running
2. Verify database connection
3. Check for stuck `PROCESSING` events (may need manual reset)
4. Review worker logs for errors

### Rate Limiting Issues

1. Adjust `WEBHOOK_RATE_LIMIT_PER_MINUTE` if needed
2. Configure Redis for distributed rate limiting
3. Check IP-based limits from Meta

## Scaling

### Horizontal Scaling

- Deploy multiple API instances behind a load balancer
- All instances share the same database queue
- Run multiple worker instances for higher throughput

### Redis for Rate Limiting

For distributed rate limiting across multiple instances:

```bash
# Install Redis
docker run -d -p 6379:6379 redis

# Set environment variable
REDIS_URL="redis://localhost:6379"
```

### Database Indexes

Ensure these indexes exist (defined in schema.prisma):

```prisma
@@index([agencyId])
@@index([phone_number_id])
@@index([eventKey])
@@index([status, nextAttemptAt])
```

## Security Best Practices

1. **Never commit secrets** - Use environment variables or secret manager
2. **Rotate tokens regularly** - Use the token migration script
3. **Enable signature validation** - Always enforced (no dev mode)
4. **Use HTTPS** - Required for webhooks
5. **Monitor dead letter queue** - Investigate failures promptly
6. **Rate limit aggressively** - Protect against abuse
7. **Audit access** - Log all webhook events and processing
8. **Encrypt tokens at rest** - AES-256-GCM already implemented

## Cost Optimization

At scale (100 agencies, 100k messages/month):

**Meta Direct (Current Setup):**
- Meta fees: ~$1,570/mo
- Infrastructure: ~$500/mo
- **Total: ~$2,070/mo**

**Twilio (Alternative):**
- Meta fees: ~$1,570/mo
- Twilio markup: ~$500/mo
- **Total: ~$2,070/mo**

**360dialog (Not recommended for SaaS):**
- Platform fee: €4,900/mo
- Meta fees: ~$1,570/mo
- **Total: ~$6,870/mo**

**Recommendation:** Stay with Meta Direct for lowest cost and full control.

## Support

For issues:
1. Check logs: `[Webhook]`, `[WebhookEvent]`, `[WhatsApp]`
2. Health check: `GET /api/health`
3. Meta docs: https://developers.facebook.com/docs/whatsapp
4. Implementation plan: `ESTATEOS_IMPLEMENTATION_PLAN.md`

## Next Steps

1. Set up environment variables
2. Configure Meta Business Manager
3. Test webhook verification
4. Send test message
5. Monitor health check
6. Deploy to production
7. Enable Sentry monitoring
8. Set up database backups

Your WhatsApp infrastructure is now production-ready for Dubai market entry! 🚀
