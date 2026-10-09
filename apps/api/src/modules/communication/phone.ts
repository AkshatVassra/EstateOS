/** Returns one canonical E.164-like representation for Meta and CRM lookups. */
export function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (!digits) {
    throw new Error("A phone number must contain at least one digit.");
  }

  // Meta provides WhatsApp IDs without a leading plus. Preserve international
  // numbers while converting common 00-prefixed input to the same form.
  const normalizedDigits = trimmed.startsWith("00") ? digits.slice(2) : digits;
  return `+${normalizedDigits}`;
}
