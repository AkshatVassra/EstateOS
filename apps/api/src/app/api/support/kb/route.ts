import { withRouteHandler } from "@/utils/route-handler";
import { SupportController } from "@/modules/support/support.controller";

export const GET = withRouteHandler(async (req, { auth }) => {
  return await SupportController.getKB(req, auth);
});
