import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/userAuth";

export async function GET(req: Request) {
  const user = getUserFromRequest(req as any);

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    },
  });
}
