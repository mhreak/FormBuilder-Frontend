import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (
    username !== process.env.AUTH_USERNAME ||
    password !== process.env.AUTH_PASSWORD
  ) {
    return NextResponse.json(
      {
        message: "نام کاربری یا رمز عبور اشتباه است.",
      },
      {
        status: 401,
      },
    );
  }

  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set("auth", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}
