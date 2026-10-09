import { withRouteHandler } from "@/utils/route-handler";
import { LeadController } from "@/modules/lead/lead.controller";

export const POST = withRouteHandler(async (req, { params, auth }) => {
  return await LeadController.addNote(req, params.id, auth);
});
