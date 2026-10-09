import { prisma } from "@/lib/prisma";
import { ApiError } from "@/utils/api-error";

export class AuthService {
  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        agency: {
          include: {
            settings: true,
          }
        },
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return user;
  }
}
