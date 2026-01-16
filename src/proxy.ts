import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // ✅ If user is LOGGED IN, don't allow auth pages
  if (
    token &&
    (
      pathname.startsWith("/sign-in") ||
      pathname.startsWith("/sign-up") ||
      pathname.startsWith("/verify") ||
      pathname === "/"
    )
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  // ✅ If user is NOT logged in, protect dashboard
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }

  // ✅ Allow everything else
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
    "/dashboard/:path*",
  ],
};
