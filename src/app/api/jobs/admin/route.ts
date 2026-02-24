import { NextRequest, NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { getTokenFromRequest } from "@/lib/auth";
import { Job } from "@/types";

export async function POST(req: NextRequest) {
  const admin = getTokenFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, requirements, benefits, location, category } = body;

  if (!title || !description || !location) {
    return NextResponse.json(
      { error: "Title, description and location are required." },
      { status: 400 }
    );
  }

  const job = await queryOne<Job>(
    `INSERT INTO jobs (title, description, requirements, benefits, location, category)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, description, requirements ?? null, benefits ?? null, location, category ?? "General"]
  );

  return NextResponse.json(job, { status: 201 });
}
