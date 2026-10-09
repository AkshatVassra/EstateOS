import { withRouteHandler } from "@/utils/route-handler";
import { LeadController } from "@/modules/lead/lead.controller";

export const GET = withRouteHandler(async (req, { params, auth }) => {
  return await LeadController.getOne(req, params.id, auth);
});

export const PUT = withRouteHandler(async (req, { params, auth }) => {
  return await LeadController.update(req, params.id, auth);
});

export const DELETE = withRouteHandler(async (req, { params, auth }) => {
  return await LeadController.delete(req, params.id, auth);
});
