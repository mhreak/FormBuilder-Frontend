import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const auth = request.cookies.get("auth")?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname === "/" && auth === "true") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/edit") ||
      pathname.startsWith("/create")) &&
    auth !== "true"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/edit/:path*", "/create/:path*"],
};
