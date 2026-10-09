import { NotificationRepository } from "./notification.repository";
import { prisma } from "@/lib/prisma";

export class NotificationService {
  static async getNotifications(userId: string) {
    const list = await NotificationRepository.getNotifications(userId);
    const unreadCount = list.filter(n => !n.isRead).length;
    return {
      notifications: list,
      unreadCount,
      totalCount: list.length
    };
  }

  static async dispatchNotification(params: {
    userId: string;
    agencyId?: string;
    message: string;
    channel?: "IN_APP" | "EMAIL" | "WHATSAPP" | "ALL";
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  }) {
    const { userId, message, channel = "IN_APP" } = params;

    const dispatchedChannels: string[] = [];

    // Always create In-App alert if IN_APP or ALL
    let createdNotification = null;
    if (channel === "IN_APP" || channel === "ALL") {
      createdNotification = await NotificationRepository.createNotification(userId, message);
      dispatchedChannels.push("IN_APP");
    }

    if (channel === "EMAIL" || channel === "ALL") {
      console.log(`[NOTIFICATION DISPATCH: EMAIL] To User: ${userId} -> Message: ${message}`);
      dispatchedChannels.push("EMAIL");
    }

    if (channel === "WHATSAPP" || channel === "ALL") {
      dispatchedChannels.push("WHATSAPP");
      // Fetch target user's phone number to attempt live delivery
      try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user?.phone) {
          // The actual sending logic will use Meta API.
          // await ConversationService.sendMessage(user.agencyId, "SYSTEM", "SYSTEM", user.phone, message);
          console.log(`[NOTIFICATION DISPATCH: WHATSAPP] Triggered for user ${userId} -> Message: ${message}`);
        } else {
          console.log(`[NOTIFICATION DISPATCH: WHATSAPP] Triggered for user ${userId} -> Message: ${message}`);
        }
      } catch (err) {
        console.error("[WHATSAPP NOTIFICATION ERROR]", err);
      }
    }

    return {
      success: true,
      notification: createdNotification,
      dispatchedChannels
    };
  }

  static async markAsRead(id: string, userId: string) {
    return NotificationRepository.markAsRead(id, userId);
  }

  static async markAllAsRead(userId: string) {
    return NotificationRepository.markAllAsRead(userId);
  }

  static async delete(id: string, userId: string) {
    return NotificationRepository.deleteNotification(id, userId);
  }
}
