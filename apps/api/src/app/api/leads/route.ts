import { withRouteHandler } from "@/utils/route-handler";
import { LeadController } from "@/modules/lead/lead.controller";

export const GET = withRouteHandler(async (req, { auth }) => {
  return await LeadController.getAll(req, auth);
});

export const POST = withRouteHandler(async (req, { auth }) => {
  return await LeadController.create(req, auth);
});
