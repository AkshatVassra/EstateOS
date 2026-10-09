import crypto from "crypto";

export function validateMetaSignature(payload: string, signature: string, appSecret: string): boolean {
  const digest = crypto.createHmac("sha256", appSecret).update(payload).digest("hex");
  const expected = Buffer.from(`sha256=${digest}`);
  const received = Buffer.from(signature);

  return received.length === expected.length && crypto.timingSafeEqual(received, expected);
}
