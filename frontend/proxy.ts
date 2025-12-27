import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/settings"];

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const res = await fetch(`${process.env.API_URL}/api/auth/me/`, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
    credentials: "include",
  });

  if (res.status === 401) {
    const loginUrl = new URL("/login", req.url);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
