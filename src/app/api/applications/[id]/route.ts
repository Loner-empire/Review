import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { getTokenFromRequest } from "@/lib/auth";
import { Application } from "@/types";

const VALID_STATUSES = ["pending", "reviewed", "shortlisted", "rejected"] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = getTokenFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json();
  const { status } = body;

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "Invalid status value." },
      { status: 400 }
    );
  }

  const updated = await queryOne<Application>(
    "UPDATE applications SET status = $1 WHERE id = $2 RETURNING *",
    [status, params.id]
  );

  if (!updated) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  return NextResponse.json(updated);
}
