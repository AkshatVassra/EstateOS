import { AuthContext } from "@/utils/route-handler";
import { ApiResponse } from "@/utils/api-response";
import { AuthService } from "./auth.service";

export class AuthController {
  static async me(auth: AuthContext) {
    const user = await AuthService.getCurrentUser(auth.userId);
    return ApiResponse.success("User fetched successfully", user);
  }
}
