import assert from "node:assert/strict";
import test from "node:test";
import { decryptWhatsAppToken, encryptWhatsAppToken, isEncryptedWhatsAppToken } from "./token-crypto";

test("encrypts WhatsApp tokens with authenticated encryption", () => {
  process.env.WHATSAPP_TOKEN_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString("base64");
  const encrypted = encryptWhatsAppToken("sensitive-access-token");

  assert.notEqual(encrypted, "sensitive-access-token");
  assert.equal(isEncryptedWhatsAppToken(encrypted), true);
  assert.equal(isEncryptedWhatsAppToken("sensitive-access-token"), false);
  assert.equal(decryptWhatsAppToken(encrypted), "sensitive-access-token");
  assert.throws(() => decryptWhatsAppToken(`${encrypted}tampered`));
});
