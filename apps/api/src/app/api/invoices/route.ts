import { withRouteHandler } from "@/utils/route-handler";
import { BillingController } from "@/modules/billing/billing.controller";

export const GET = withRouteHandler(async (req, { auth }) => {
  return await BillingController.getInvoices(req, auth);
});
