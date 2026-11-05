import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { detectLocale } from "@/lib/i18n/detect";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "@/lib/i18n/locales";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);
const ONE_YEAR = 60 * 60 * 24 * 365;

async function adminMiddleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const authed = await verifySessionToken(token);

  if (!authed) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

function rememberLocale(response: NextResponse, locale: string) {
  response.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return adminMiddleware(request);
  }

  const prefix = pathname.split("/")[1];
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;

  // A language in the URL is an explicit choice: serve it and remember it.
  if (isLocale(prefix) && prefix !== defaultLocale) {
    const response = intlMiddleware(request);
    return cookie === prefix ? response : rememberLocale(response, prefix);
  }

  // No prefix: English URL. Send the visitor to their language if it isn't English.
  if (prefix !== defaultLocale) {
    const locale = detectLocale({
      cookie,
      acceptLanguage: request.headers.get("accept-language"),
      country: request.headers.get("x-vercel-ip-country"),
    });

    if (locale !== defaultLocale) {
      const target = new URL(`/${locale}${pathname === "/" ? "" : pathname}${search}`, request.url);
      return rememberLocale(NextResponse.redirect(target), locale);
    }

    const response = intlMiddleware(request);
    return cookie === locale ? response : rememberLocale(response, locale);
  }

  // "/en/..." — next-intl redirects to the unprefixed English URL.
  return rememberLocale(intlMiddleware(request), defaultLocale);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
