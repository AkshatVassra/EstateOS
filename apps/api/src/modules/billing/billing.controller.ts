import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/api-response";
import { BillingService } from "./billing.service";
import { AuthContext } from "@/utils/route-handler";
import { z } from "zod";

const checkoutSchema = z.object({
  priceId: z.string(),
});

export class BillingController {
  static async getSubscription(req: NextRequest, auth: AuthContext) {
    const sub = await BillingService.getSubscription(auth.agencyId);
    return ApiResponse.success("Subscription fetched successfully", sub);
  }

  static async createCheckout(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const data = checkoutSchema.parse(body);
    const session = await BillingService.createCheckoutSession(auth.agencyId, data.priceId);
    return ApiResponse.success("Checkout session created", session);
  }

  static async getInvoices(req: NextRequest, auth: AuthContext) {
    const invoices = await BillingService.getInvoices(auth.agencyId);
    return ApiResponse.success("Invoices fetched successfully", invoices);
  }
}
