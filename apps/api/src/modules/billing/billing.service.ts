import { BillingRepository } from "./billing.repository";
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export class BillingService {
  static async getSubscription(agencyId: string) {
    let sub = await BillingRepository.getSubscription(agencyId);
    if (!sub) {
      // Create a default trial subscription if it doesn't exist
      sub = await BillingRepository.updateSubscription(agencyId, {
        plan: "trial",
        status: "TRIALING",
      });
    }
    return sub;
  }

  static async getInvoices(agencyId: string) {
    return BillingRepository.getInvoices(agencyId);
  }

  static async createCheckoutSession(_agencyId: string, _priceId: string) {
    // TODO: Create a Stripe Checkout Session
    // 1. Get or create Stripe Customer for the Agency
    // 2. Create session with the customer ID and price ID
    // 3. Return session.url
    
    return { url: "https://checkout.stripe.com/mock-session-url" };
  }

  static async handleStripeWebhook(payload: unknown, _signature: string) {
    // TODO: Verify Stripe Signature
    // const event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    
    if (!payload || typeof payload !== "object" || !("type" in payload) || typeof payload.type !== "string") {
      throw new Error("Malformed Stripe webhook event");
    }
    const event = payload;
    
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        // Update database with subscription details
        // await BillingRepository.updateSubscription(agencyId, { ... })
        break;
      case 'invoice.payment_succeeded':
        // Log invoice to DB
        break;
    }
    
    return true;
  }
}
