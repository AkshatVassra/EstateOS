import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { validateMetaSignature } from "./meta-signature";

test("accepts a valid Meta webhook signature", () => {
  const payload = JSON.stringify({ object: "whatsapp_business_account" });
  const secret = "test-app-secret";
  const digest = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  assert.equal(validateMetaSignature(payload, `sha256=${digest}`, secret), true);
});

test("rejects a malformed signature without throwing", () => {
  assert.equal(validateMetaSignature("{}", "sha256=short", "secret"), false);
});
