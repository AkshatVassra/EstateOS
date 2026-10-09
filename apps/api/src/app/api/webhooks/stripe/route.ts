import { NextRequest, NextResponse } from "next/server";
import { BillingService } from "@/modules/billing/billing.service";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  try {
    await BillingService.handleStripeWebhook(payload, signature);
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid Stripe webhook";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
