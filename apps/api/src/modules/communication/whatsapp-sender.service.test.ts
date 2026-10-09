import assert from "node:assert/strict";
import test from "node:test";
import { isCustomerServiceWindowOpen } from "./whatsapp-policy";

test("allows free-form WhatsApp replies only during the customer-service window", () => {
  const now = new Date("2026-10-09T12:00:00.000Z");
  assert.equal(
    isCustomerServiceWindowOpen(new Date("2026-10-08T12:00:00.000Z"), now),
    true,
  );
  assert.equal(
    isCustomerServiceWindowOpen(new Date("2026-10-08T11:59:59.999Z"), now),
    false,
  );
});
