import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { getTokenFromRequest } from "@/lib/auth";
import { Job } from "@/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const job = await queryOne<Job>(
    "SELECT * FROM jobs WHERE id = $1 AND is_active = TRUE",
    [params.id]
  );

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(job);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = getTokenFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, requirements, benefits, location, category, is_active } = body;

  if (!title || !description || !location) {
    return NextResponse.json(
      { error: "Title, description and location are required" },
      { status: 400 }
    );
  }

  const updated = await queryOne<Job>(
    `UPDATE jobs SET title=$1, description=$2, requirements=$3, benefits=$4,
     location=$5, category=$6, is_active=$7
     WHERE id=$8 RETURNING *`,
    [title, description, requirements ?? null, benefits ?? null, location, category ?? "General", is_active ?? true, params.id]
  );

  if (!updated) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = getTokenFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  await query("DELETE FROM jobs WHERE id = $1", [params.id]);
  return NextResponse.json({ success: true });
}
