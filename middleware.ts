import { NextRequest, NextResponse } from "next/server";

const AUTH_PATH = "/auth";

export function middleware(request: NextRequest) {
  const sitePassword = process.env.SITE_PASSWORD;
  if (!sitePassword) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (pathname === AUTH_PATH) {
    return NextResponse.next();
  }

  const provided = request.nextUrl.searchParams.get("password");
  if (provided === sitePassword) {
    return NextResponse.next();
  }

  const redirectUrl = new URL(AUTH_PATH, request.url);
  redirectUrl.searchParams.set("next", pathname);
  if (provided !== null) redirectUrl.searchParams.set("wrong", "1");
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
