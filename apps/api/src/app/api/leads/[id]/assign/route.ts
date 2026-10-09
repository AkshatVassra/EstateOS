import { withRouteHandler } from "@/utils/route-handler";
import { LeadController } from "@/modules/lead/lead.controller";

export const POST = withRouteHandler(async (req, { params, auth }) => {
  return await LeadController.assign(req, params.id, auth);
});
