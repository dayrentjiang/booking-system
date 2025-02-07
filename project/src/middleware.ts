import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/owner(.*)"]);
const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/"]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, userId } = await auth();

  if (isProtectedRoute(req)) await auth.protect();

  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // ✅ Redirect signed-in users from "/" or "/sign-in" to "/owner"
  if (userId && isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/owner", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};
