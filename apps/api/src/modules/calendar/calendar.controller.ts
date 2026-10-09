import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/api-response";
import { CalendarService } from "./calendar.service";
import { createAppointmentSchema } from "./calendar.validator";
import { AuthContext } from "@/utils/route-handler";

export class CalendarController {
  static async create(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const data = createAppointmentSchema.parse(body);
    const apt = await CalendarService.createAppointment(auth.agencyId, data);
    return ApiResponse.success("Appointment created successfully", apt, 201);
  }

  static async getAll(req: NextRequest, auth: AuthContext) {
    const apts = await CalendarService.getAllAppointments(auth.agencyId);
    return ApiResponse.success("Appointments fetched successfully", apts);
  }

  static async delete(req: NextRequest, id: string, auth: AuthContext) {
    await CalendarService.deleteAppointment(id, auth.agencyId);
    return ApiResponse.success("Appointment deleted successfully");
  }
}
