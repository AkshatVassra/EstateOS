import { withRouteHandler } from "@/utils/route-handler";
import { BillingController } from "@/modules/billing/billing.controller";
import { BillingService } from "@/modules/billing/billing.service";
import { ApiResponse } from "@/utils/api-response";

export const GET = withRouteHandler(async (req, { auth }) => {
  const [subscription, invoices] = await Promise.all([
    BillingService.getSubscription(auth.agencyId),
    BillingService.getInvoices(auth.agencyId)
  ]);
  return ApiResponse.success("Billing overview fetched successfully", {
    subscription,
    invoices,
    plans: [
      { id: "starter", name: "EstateOS Starter", price: 299, currency: "USD", features: ["Up to 5 Agents", "1,000 AI Tokens/mo", "Basic CRM & Leads", "Email Support"] },
      { id: "pro", name: "EstateOS Pro AI", price: 799, currency: "USD", features: ["Up to 25 Agents", "25,000 AI Tokens/mo", "Full AI Studio (12 Tools)", "WhatsApp & Multi-channel Inbox", "Priority Support"], popular: true },
      { id: "enterprise", name: "EstateOS Enterprise", price: 1999, currency: "USD", features: ["Unlimited Agents", "Unlimited AI Tokens", "Custom AI Fine-tuning", "Dedicated Account Manager", "SLA & 24/7 Phone Support"] }
    ]
  });
});

export const POST = withRouteHandler(async (req, { auth }) => {
  return await BillingController.createCheckout(req, auth);
});
