import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12;
const FORMAT_VERSION = "v1";

function encryptionKey(): Buffer {
  const configuredKey = process.env.WHATSAPP_TOKEN_ENCRYPTION_KEY;
  if (!configuredKey) {
    throw new Error("WHATSAPP_TOKEN_ENCRYPTION_KEY is required to use WhatsApp credentials.");
  }

  const key = Buffer.from(configuredKey, "base64");
  if (key.length !== 32) {
    throw new Error("WHATSAPP_TOKEN_ENCRYPTION_KEY must be a base64-encoded 32-byte key.");
  }
  return key;
}

export function encryptWhatsAppToken(value: string): string {
  const iv = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [FORMAT_VERSION, iv, authTag, ciphertext].map((part) =>
    typeof part === "string" ? part : part.toString("base64url"),
  ).join(".");
}

export function decryptWhatsAppToken(value: string): string {
  const [version, ivValue, authTagValue, ciphertextValue, extra] = value.split(".");
  if (version !== FORMAT_VERSION || !ivValue || !authTagValue || !ciphertextValue || extra) {
    throw new Error("Stored WhatsApp access token has an invalid encrypted format.");
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, encryptionKey(), Buffer.from(ivValue, "base64url"));
  decipher.setAuthTag(Buffer.from(authTagValue, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(ciphertextValue, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export function isEncryptedWhatsAppToken(value: string): boolean {
  return value.startsWith(`${FORMAT_VERSION}.`);
}
