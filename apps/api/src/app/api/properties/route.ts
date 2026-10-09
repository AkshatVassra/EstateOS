import { withRouteHandler } from "@/utils/route-handler";
import { PropertyController } from "@/modules/property/property.controller";

export const GET = withRouteHandler(async (req, { auth }) => {
  return await PropertyController.getAll(req, auth);
});

export const POST = withRouteHandler(async (req, { auth }) => {
  return await PropertyController.create(req, auth);
});
