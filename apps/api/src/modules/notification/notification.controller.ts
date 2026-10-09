import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/api-response";
import { NotificationService } from "./notification.service";
import { AuthContext } from "@/utils/route-handler";
import { z } from "zod";

const dispatchSchema = z.object({
  userId: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  channel: z.enum(["IN_APP", "EMAIL", "WHATSAPP", "ALL"]).default("IN_APP"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
});

export class NotificationController {
  static async getAll(req: NextRequest, auth: AuthContext) {
    const data = await NotificationService.getNotifications(auth.userId);
    return ApiResponse.success("Notifications fetched successfully", data);
  }

  static async dispatch(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const params = dispatchSchema.parse(body);
    const targetUserId = params.userId || auth.userId;

    const result = await NotificationService.dispatchNotification({
      userId: targetUserId,
      agencyId: auth.agencyId,
      message: params.message,
      channel: params.channel,
      priority: params.priority,
    });

    return ApiResponse.success("Notification dispatched successfully", result, 201);
  }

  static async markRead(req: NextRequest, id: string, auth: AuthContext) {
    await NotificationService.markAsRead(id, auth.userId);
    return ApiResponse.success("Notification marked as read");
  }

  static async markAllRead(req: NextRequest, auth: AuthContext) {
    await NotificationService.markAllAsRead(auth.userId);
    return ApiResponse.success("All notifications marked as read");
  }

  static async delete(req: NextRequest, id: string, auth: AuthContext) {
    await NotificationService.delete(id, auth.userId);
    return ApiResponse.success("Notification deleted successfully");
  }
}
