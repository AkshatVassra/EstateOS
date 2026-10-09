import assert from "node:assert/strict";
import test from "node:test";
import { normalizePhone } from "./phone";

test("normalizes Meta and human-formatted numbers to a single value", () => {
  assert.equal(normalizePhone("971 50 123 4567"), "+971501234567");
  assert.equal(normalizePhone("+971 (50) 123-4567"), "+971501234567");
  assert.equal(normalizePhone("00971501234567"), "+971501234567");
});

test("rejects a phone number without digits", () => {
  assert.throws(() => normalizePhone("not a number"));
});
