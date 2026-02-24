import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { Job } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location");
  const category = searchParams.get("category");

  const conditions: string[] = ["is_active = TRUE"];
  const params: unknown[] = [];

  if (location) {
    params.push(`%${location}%`);
    conditions.push(`location ILIKE $${params.length}`);
  }

  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }

  const whereClause = conditions.join(" AND ");

  const jobs = await query<Job>(
    `SELECT * FROM jobs WHERE ${whereClause} ORDER BY created_at DESC`,
    params
  );

  return NextResponse.json(jobs);
}
