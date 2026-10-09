import { withRouteHandler } from "@/utils/route-handler";
import { SupportController } from "@/modules/support/support.controller";

export const GET = withRouteHandler(async (req, { auth }) => {
  return await SupportController.getAll(req, auth);
});

export const POST = withRouteHandler(async (req, { auth }) => {
  return await SupportController.create(req, auth);
});
