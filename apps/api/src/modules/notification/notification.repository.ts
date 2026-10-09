import { prisma } from "@/lib/prisma";

export class NotificationRepository {
  static async getNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { id: "desc" },
      take: 50
    });
  }

  static async createNotification(userId: string, message: string) {
    return prisma.notification.create({
      data: {
        userId,
        message,
        isRead: false
      }
    });
  }

  static async markAsRead(id: string, userId: string) {
    const notification = await prisma.notification.findFirst({ where: { id, userId }, select: { id: true } });
    if (!notification) throw new Error("Notification not found for user");
    return prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }

  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }

  static async deleteNotification(id: string, userId: string) {
    const notification = await prisma.notification.findFirst({ where: { id, userId }, select: { id: true } });
    if (!notification) throw new Error("Notification not found for user");
    return prisma.notification.delete({
      where: { id }
    });
  }
}
