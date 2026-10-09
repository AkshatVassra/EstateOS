import { NextRequest } from "next/server";
import { ApiResponse } from "@/utils/api-response";
import { UserService } from "./user.service";
import { createUserSchema, updateUserSchema } from "./user.validator";
import { AuthContext } from "@/utils/route-handler";

export class UserController {
  static async create(req: NextRequest, auth: AuthContext) {
    const body = await req.json();
    const data = createUserSchema.parse(body);
    const user = await UserService.createUser(auth.agencyId, data);
    return ApiResponse.success("User created successfully", user, 201);
  }

  static async getAll(req: NextRequest, auth: AuthContext) {
    const url = new URL(req.url);
    const skip = parseInt(url.searchParams.get("skip") || "0");
    const take = parseInt(url.searchParams.get("take") || "20");
    const users = await UserService.getAllUsers(auth.agencyId, skip, take);
    return ApiResponse.success("Users fetched successfully", users);
  }

  static async getOne(req: NextRequest, id: string, auth: AuthContext) {
    const user = await UserService.getUser(id, auth.agencyId);
    return ApiResponse.success("User fetched successfully", user);
  }

  static async update(req: NextRequest, id: string, auth: AuthContext) {
    const body = await req.json();
    const data = updateUserSchema.parse(body);
    const user = await UserService.updateUser(id, auth.agencyId, data);
    return ApiResponse.success("User updated successfully", user);
  }

  static async delete(req: NextRequest, id: string, auth: AuthContext) {
    await UserService.deleteUser(id, auth.agencyId);
    return ApiResponse.success("User deleted successfully");
  }
}
