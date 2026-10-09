const CUSTOMER_SERVICE_WINDOW_MS = 24 * 60 * 60 * 1000;

/** WhatsApp permits free-form business replies for 24 hours after inbound contact. */
export function isCustomerServiceWindowOpen(lastInboundAt: Date, now = new Date()): boolean {
  return now.getTime() - lastInboundAt.getTime() <= CUSTOMER_SERVICE_WINDOW_MS;
}
