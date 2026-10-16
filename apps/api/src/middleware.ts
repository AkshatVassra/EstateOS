import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/api/webhooks(.*)",
  "/api/communication/webhook(.*)",
]);

// Temporarily disable auth until environment variables are configured in Vercel
const skipAuth = process.env.NODE_ENV === "development" || process.env.DISABLE_AUTH === "true" || !process.env.CLERK_SECRET_KEY;

const authMiddleware = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export default skipAuth ? () => NextResponse.next() : authMiddleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
