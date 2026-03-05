import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { query, queryOne } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const USER_COOKIE_NAME = "ysc_user_token";
const USER_EXPIRY = "7d";

export interface UserTokenPayload {
  id: string;
  email: string;
  fullName: string;
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
}

export async function hashPassword(password: string): Promise<string> {
  const { hash } = await import("bcryptjs");
  return hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const { compare } = await import("bcryptjs");
  return compare(password, hash);
}

export function signUserToken(payload: UserTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: USER_EXPIRY });
}

export function verifyUserToken(token: string): UserTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserTokenPayload;
  } catch {
    return null;
  }
}

// Use in API routes
export function getUserFromRequest(req: NextRequest): UserTokenPayload | null {
  const token = req.cookies.get(USER_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

// Use in server components
export async function getUserSession(): Promise<UserTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export async function createUser(
  email: string,
  password: string,
  fullName: string,
  phone?: string
): Promise<User | null> {
  const passwordHash = await hashPassword(password);
  
  try {
    const user = await queryOne<User>(
      `INSERT INTO users (email, password_hash, full_name, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, full_name, phone, is_active, created_at`,
      [email.toLowerCase(), passwordHash, fullName, phone || null]
    );
    return user;
  } catch (error) {
    console.error("Failed to create user:", error);
    return null;
  }
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<UserTokenPayload | null> {
  const user = await queryOne<User>(
    "SELECT id, email, password_hash, full_name, is_active FROM users WHERE email = $1",
    [email.toLowerCase()]
  );

  if (!user || !user.is_active) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
  };
}

export { USER_COOKIE_NAME, USER_EXPIRY };

