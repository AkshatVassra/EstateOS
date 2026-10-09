import { withRouteHandler } from "@/utils/route-handler";
import { NotificationController } from "@/modules/notification/notification.controller";

export const PUT = withRouteHandler(async (req, { auth }) => {
  return await NotificationController.markAllRead(req, auth);
});

export const POST = withRouteHandler(async (req, { auth }) => {
  return await NotificationController.markAllRead(req, auth);
});
