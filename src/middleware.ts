import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;

  if ((pathname === "/login" || pathname === "/signup") && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    !token &&
    (pathname.startsWith("/settings") ||
      pathname.startsWith("/profile") ||
      pathname.startsWith("/search") ||
      pathname.startsWith("/home") ||
      pathname.startsWith("/friends"))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/settings/:path*",
    "/profile/:path*",
    "/search/:path*",
    "/home/:path*",
    "/friends/:path*",
    "/login",
    "/signup",
  ],
};
