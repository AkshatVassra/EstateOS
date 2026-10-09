import { ApiError } from "@/utils/api-error";
import { UserRepository } from "./user.repository";
import { Prisma } from "@estateos/database";
import type { z } from "zod";
import type { createUserSchema, updateUserSchema } from "./user.validator";

type CreateUserInput = z.infer<typeof createUserSchema>;
type UpdateUserInput = z.infer<typeof updateUserSchema>;

export class UserService {
  static async createUser(agencyId: string, data: CreateUserInput) {
    // Note: Since we are using Clerk, creating a user from backend requires 
    // calling Clerk API to create them there first, then storing them here.
    // For MVP, we assume Clerk webhooks handle normal creation, but this allows manual addition.
    
    const dbData: Prisma.UserUncheckedCreateInput = {
      ...data,
      name: `${data.firstName} ${data.lastName}`,
      agencyId,
      clerkUserId: `pending-${Date.now()}`, // Temporary placeholder until they sign up
    };

    return UserRepository.create(dbData);
  }

  static async getUser(id: string, agencyId: string) {
    const user = await UserRepository.findById(id, agencyId);
    if (!user || user.status === "DELETED") {
      throw ApiError.notFound("User not found");
    }
    return user;
  }

  static async getAllUsers(agencyId: string, skip = 0, take = 20) {
    return UserRepository.findAll(agencyId, { skip, take });
  }

  static async updateUser(id: string, agencyId: string, data: UpdateUserInput) {
    await this.getUser(id, agencyId); // verify exists
    const updateData: Prisma.UserUncheckedUpdateInput = { ...data };
    if (updateData.firstName || updateData.lastName) {
      updateData.name = `${updateData.firstName || ""} ${updateData.lastName || ""}`.trim();
    }
    return UserRepository.update(id, agencyId, updateData);
  }

  static async deleteUser(id: string, agencyId: string) {
    await this.getUser(id, agencyId);
    return UserRepository.delete(id, agencyId);
  }
}
