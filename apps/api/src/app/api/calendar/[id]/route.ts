import { withRouteHandler } from "@/utils/route-handler";
import { CalendarController } from "@/modules/calendar/calendar.controller";

export const DELETE = withRouteHandler(async (req, { params, auth }) => {
  return await CalendarController.delete(req, params.id, auth);
});
