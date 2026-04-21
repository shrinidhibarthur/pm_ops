export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    /*
     * Protect all app routes except auth + login.
     * API routes enforce RBAC separately.
     */
    "/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)",
  ],
};

