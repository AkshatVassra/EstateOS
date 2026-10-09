import { withRouteHandler } from "@/utils/route-handler";
import { NotificationController } from "@/modules/notification/notification.controller";

export const GET = withRouteHandler(async (req, { auth }) => {
  return await NotificationController.getAll(req, auth);
});

export const POST = withRouteHandler(async (req, { auth }) => {
  return await NotificationController.dispatch(req, auth);
});
