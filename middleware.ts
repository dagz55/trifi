import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/settings(.*)',
  '/analytics(.*)',
  '/organization(.*)',
  '/projects(.*)',
  '/transactions(.*)',
  '/investor(.*)',
  '/invoices(.*)',
  '/payments(.*)',
  '/members(.*)',
  '/departments(.*)',
  '/permissions(.*)',
  '/chat(.*)',
  '/meetings(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}; 