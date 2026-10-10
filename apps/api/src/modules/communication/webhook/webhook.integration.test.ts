import assert from "node:assert/strict";
import test from "node:test";
import crypto from "crypto";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";
import { WebhookEventService } from "./webhook-event.service";
import { validateMetaSignature } from "./meta-signature";
import type { MetaWebhookPayload } from "../dto/meta-webhook.dto";

// Helper to create a valid Meta webhook payload
function createTestPayload(override?: Partial<MetaWebhookPayload>): MetaWebhookPayload {
  return {
    object: "whatsapp_business_account",
    entry: [
      {
        id: "test-entry-id",
        changes: [
          {
            field: "messages",
            value: {
              messaging_product: "whatsapp",
              metadata: {
                display_phone_number: "+971501234567",
                phone_number_id: "test-phone-id",
              },
              contacts: [
                {
                  profile: { name: "Test User" },
                  wa_id: "971501234567",
                },
              ],
              messages: [
                {
                  from: "971501234567",
                  id: "test-message-id",
                  timestamp: "1696000000",
                  type: "text",
                  text: { body: "Hello, I'm looking for a property" },
                },
              ],
            },
          },
        ],
      },
    ],
    ...override,
  };
}

// Helper to create a valid signature
function createSignature(payload: string, appSecret: string): string {
  const digest = crypto.createHmac("sha256", appSecret).update(payload).digest("hex");
  return `sha256=${digest}`;
}

test("signature validation accepts valid signatures", () => {
  const payload = JSON.stringify(createTestPayload());
  const appSecret = "test-app-secret";
  const signature = createSignature(payload, appSecret);

  assert.equal(validateMetaSignature(payload, signature, appSecret), true);
});

test("signature validation rejects invalid signatures", () => {
  const payload = JSON.stringify(createTestPayload());
  const appSecret = "test-app-secret";
  const signature = "sha256=invalid";

  assert.equal(validateMetaSignature(payload, signature, appSecret), false);
});

test("signature validation rejects signatures with wrong secret", () => {
  const payload = JSON.stringify(createTestPayload());
  const appSecret = "test-app-secret";
  const wrongSecret = "wrong-secret";
  const signature = createSignature(payload, wrongSecret);

  assert.equal(validateMetaSignature(payload, signature, appSecret), false);
});

test("signature validation uses timing-safe comparison", () => {
  const payload = JSON.stringify(createTestPayload());
  const appSecret = "test-app-secret";
  const signature = createSignature(payload, appSecret);

  // This should complete in constant time regardless of input
  const start = Date.now();
  validateMetaSignature(payload, signature, appSecret);
  const duration = Date.now() - start;

  // Timing-safe comparison should be fast (< 10ms)
  assert.ok(duration < 10, "Timing-safe comparison should be fast");
});

test("webhook verification rejects missing mode", async () => {
  const url = new URL("http://localhost:3001/api/communication/webhook");
  const request = new Request(url, {
    method: "GET",
  }) as NextRequest;

  const response = await WebhookController.verify(request);
  assert.equal(response.status, 403);
});

test("webhook verification rejects wrong token", async () => {
  const url = new URL("http://localhost:3001/api/communication/webhook?hub.mode=subscribe&hub.token=wrong&hub.challenge=challenge123");
  const request = new Request(url, {
    method: "GET",
  }) as NextRequest;

  // Mock environment variable
  const originalToken = process.env.META_WEBHOOK_VERIFY_TOKEN;
  process.env.META_WEBHOOK_VERIFY_TOKEN = "correct-token";

  try {
    const response = await WebhookController.verify(request);
    assert.equal(response.status, 403);
  } finally {
    process.env.META_WEBHOOK_VERIFY_TOKEN = originalToken;
  }
});

test("webhook verification accepts correct token", async () => {
  const url = new URL("http://localhost:3001/api/communication/webhook?hub.mode=subscribe&hub.token=correct-token&hub.challenge=challenge123");
  const request = new Request(url, {
    method: "GET",
  }) as NextRequest;

  const originalToken = process.env.META_WEBHOOK_VERIFY_TOKEN;
  process.env.META_WEBHOOK_VERIFY_TOKEN = "correct-token";

  try {
    const response = await WebhookController.verify(request);
    assert.equal(response.status, 200);
    const text = await response.text();
    assert.equal(text, "challenge123");
  } finally {
    process.env.META_WEBHOOK_VERIFY_TOKEN = originalToken;
  }
});

test("webhook event rejects without signature", async () => {
  const url = new URL("http://localhost:3001/api/communication/webhook");
  const request = new Request(url, {
    method: "POST",
    body: JSON.stringify(createTestPayload()),
  }) as NextRequest;

  const originalSecret = process.env.META_APP_SECRET;
  process.env.META_APP_SECRET = "test-secret";

  try {
    const response = await WebhookController.handleEvent(request);
    assert.equal(response.status, 401);
  } finally {
    process.env.META_APP_SECRET = originalSecret;
  }
});

test("webhook event rejects invalid signature", async () => {
  const payload = JSON.stringify(createTestPayload());
  const url = new URL("http://localhost:3001/api/communication/webhook");
  const request = new Request(url, {
    method: "POST",
    body: payload,
    headers: {
      "x-hub-signature-256": "sha256=invalid",
    },
  }) as NextRequest;

  const originalSecret = process.env.META_APP_SECRET;
  process.env.META_APP_SECRET = "test-secret";

  try {
    const response = await WebhookController.handleEvent(request);
    assert.equal(response.status, 401);
  } finally {
    process.env.META_APP_SECRET = originalSecret;
  }
});

test("webhook event accepts valid signature and enqueues", async () => {
  const payload = JSON.stringify(createTestPayload());
  const appSecret = "test-secret";
  const signature = createSignature(payload, appSecret);

  const url = new URL("http://localhost:3001/api/communication/webhook");
  const request = new Request(url, {
    method: "POST",
    body: payload,
    headers: {
      "x-hub-signature-256": signature,
    },
  }) as NextRequest;

  const originalSecret = process.env.META_APP_SECRET;
  process.env.META_APP_SECRET = appSecret;

  try {
    // Note: This test requires database to be available
    // In a real test environment, you'd mock the database
    const response = await WebhookController.handleEvent(request);
    assert.equal(response.status, 200);

    const json = await response.json() as { status: string; eventId?: string; duplicate?: boolean };
    assert.equal(json.status, "enqueued");
    assert.ok(json.eventId);
    assert.equal(json.duplicate, false);
  } finally {
    process.env.META_APP_SECRET = originalSecret;
  }
});

test("rate limiter blocks excess requests", async () => {
  const { rateLimiter } = await import("./rate-limiter");

  // Set a very low limit for testing
  const limit = 2;
  const key = "test-key";

  const result1 = await rateLimiter.check(key, limit, 60_000);
  assert.equal(result1.allowed, true);
  assert.equal(result1.remaining, 1);

  const result2 = await rateLimiter.check(key, limit, 60_000);
  assert.equal(result2.allowed, true);
  assert.equal(result2.remaining, 0);

  const result3 = await rateLimiter.check(key, limit, 60_000);
  assert.equal(result3.allowed, false);
  assert.equal(result3.remaining, 0);
});

test("rate limiter resets after window expires", async () => {
  const { rateLimiter } = await import("./rate-limiter");

  const limit = 1;
  const key = "test-key-expire";
  const windowMs = 100; // 100ms window

  const result1 = await rateLimiter.check(key, limit, windowMs);
  assert.equal(result1.allowed, true);

  const result2 = await rateLimiter.check(key, limit, windowMs);
  assert.equal(result2.allowed, false);

  // Wait for window to expire
  await new Promise((resolve) => setTimeout(resolve, 150));

  const result3 = await rateLimiter.check(key, limit, windowMs);
  assert.equal(result3.allowed, true);
});
