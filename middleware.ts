import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./app/lib/auth";

/**
 * The guard sits in middleware rather than in each page so that a new admin
 * screen is protected by existing there, not by remembering to add a check.
 */
const LOGIN_PATH = "/admin/login";

export async function middleware(request: NextRequest) {
  // The login screen has to stay reachable, or the redirect loops forever.
  if (request.nextUrl.pathname.startsWith(LOGIN_PATH)) {
    return NextResponse.next();
  }

  const isAuthenticated = await verifySessionToken(
    request.cookies.get(SESSION_COOKIE)?.value
  );

  if (isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL(LOGIN_PATH, request.url);

  // Remember where the visitor was headed so the login can return them there.
  loginUrl.searchParams.set("from", request.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
