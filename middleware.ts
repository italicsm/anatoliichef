import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./app/lib/auth";
import { isLocale, matchLocale } from "./app/lib/locale";

/**
 * Two jobs, deliberately in one place: whatever reaches a page has already
 * been through here, so a new admin screen is protected and a new public page
 * is localised by existing rather than by remembering.
 */

const LOGIN_PATH = "/admin/login";

async function guardAdmin(request: NextRequest) {
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

  loginUrl.searchParams.set("from", request.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The panel is Ukrainian only and lives outside the localised tree.
  if (pathname.startsWith("/admin")) {
    return guardAdmin(request);
  }

  const [first] = pathname.split("/").filter(Boolean);

  if (first && isLocale(first)) {
    // The root layout owns <html lang>, but it sits above [locale] and cannot
    // read the segment. Passing the language along as a header is the cheapest
    // way to keep that attribute honest.
    const headers = new Headers(request.headers);

    headers.set("x-locale", first);

    return NextResponse.next({ request: { headers } });
  }

  // Every public page is prefixed, so a bare path is redirected rather than
  // served: one page must not answer on two addresses.
  const locale = matchLocale(request.headers.get("accept-language"));
  const target = new URL(`/${locale}${pathname}`, request.url);

  target.search = request.nextUrl.search;

  return NextResponse.redirect(target);
}

export const config = {
  matcher: [
    /*
     * Everything except Next internals, the API, and files with an extension —
     * those are assets, and prefixing them with a locale would break them.
     */
    "/((?!_next/|api/|favicon.ico|.*\\.).*)",
  ],
};
