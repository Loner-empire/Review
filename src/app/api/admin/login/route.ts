import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { queryOne } from "@/lib/db";
import { signToken, COOKIE_NAME } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { AdminUser } from "@/types";

interface AdminUserWithHash extends AdminUser {
  password_hash: string;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const rateCheck = await checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);

  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const email = (body.email as string)?.trim().toLowerCase();
  const password = body.password as string;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const user = await queryOne<AdminUserWithHash>(
    "SELECT * FROM admin_users WHERE email = $1",
    [email]
  );

  if (!user) {
    // Avoid timing attacks by still running bcrypt compare
    await bcrypt.compare(password, "$2b$10$invalidhashforfakedelay");
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const passwordValid = await bcrypt.compare(password, user.password_hash);
  if (!passwordValid) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  const response = NextResponse.json({
    success: true,
    user: { id: user.id, email: user.email, role: user.role },
  });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });

  return response;
}
