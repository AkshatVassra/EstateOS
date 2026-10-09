import { withRouteHandler } from "@/utils/route-handler";
import { CalendarController } from "@/modules/calendar/calendar.controller";

export const GET = withRouteHandler(async (req, { auth }) => {
  return await CalendarController.getAll(req, auth);
});

export const POST = withRouteHandler(async (req, { auth }) => {
  return await CalendarController.create(req, auth);
});
