import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "./api-error";
import { ApiResponse } from "./api-response";
import { auth } from "@clerk/nextjs/server";

export type AuthContext = {
  userId: string;
  agencyId: string;
  roleId: string | null;
};

export type RouteHandler = (
  req: NextRequest,
  ctx: { params: Record<string, string>; auth: AuthContext }
) => Promise<Response>;

type RouteContext = { params: Promise<Record<string, string>> };

export function withRouteHandler(handler: RouteHandler, options: { requireAuth?: boolean } = { requireAuth: true }) {
  return async (req: NextRequest, context: RouteContext): Promise<Response> => {
    try {
      const resolvedParams = await context.params;
      let authContext: AuthContext = { userId: "", agencyId: "", roleId: null };

      if (options.requireAuth) {
        const { userId } = await auth();
        
        if (!userId) {
          throw ApiError.unauthorized("Authentication required");
        }

        // Ideally, we'd fetch the user's agencyId from the database here 
        // to populate the authContext, avoiding the need for every controller to do it.
        // We'll import prisma inside the function to avoid circular deps.
        const { prisma } = await import("@/lib/prisma");
        let dbUser = await prisma.user.findUnique({
          where: { clerkUserId: userId },
          select: { id: true, agencyId: true, roleId: true }
        });

        if (!dbUser) {
          console.log(`[ROUTE HANDLER] Auto-provisioning database user for Clerk ID: ${userId}`);
          let agency = await prisma.agency.findFirst();
          if (!agency) {
            agency = await prisma.agency.create({
              data: {
                name: "Gulf Properties LLC",
                slug: "gulf-properties-" + Date.now(),
                country: "AE",
                companySize: "5-20",
              }
            });
          }
          const newUser = await prisma.user.create({
            data: {
              agencyId: agency.id,
              clerkUserId: userId,
              email: `user_${userId.slice(-6)}@estateos.app`,
              name: "EstateOS User",
            }
          });
          dbUser = { id: newUser.id, agencyId: newUser.agencyId, roleId: newUser.roleId };
        }

        authContext = {
          userId: dbUser.id,
          agencyId: dbUser.agencyId,
          roleId: dbUser.roleId
        };
      }

      return await handler(req, { ...context, params: resolvedParams, auth: authContext });
    } catch (error: unknown) {
      console.error(`[API ERROR] ${req.method} ${req.nextUrl.pathname}:`, error);

      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return ApiResponse.error("Validation failed", formattedErrors, 400);
      }

      if (error instanceof ApiError) {
        return ApiResponse.error(error.message, error.errors, error.status);
      }

      return ApiResponse.error("Internal server error", [], 500);
    }
  };
}
