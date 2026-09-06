import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (token) return NextResponse.next();

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/blog/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/blog/admin/login", req.url);
  loginUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/blog/admin",
    "/blog/admin/((?!login).*)",
    "/blog/api/posts/:path*",
    "/blog/api/categories/:path*",
    "/blog/api/tags/:path*",
    "/blog/api/resources/:path*",
    "/blog/api/upload",
    "/blog/api/admin/:path*",
  ],
};
