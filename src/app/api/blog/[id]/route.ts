import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { getTokenFromRequest } from "@/lib/auth";
import { BlogPost } from "@/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Allow fetching by slug for public routes
  const post = await queryOne<BlogPost>(
    "SELECT * FROM blog_posts WHERE (id = $1 OR slug = $1) AND is_published = TRUE",
    [id]
  );

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = getTokenFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { title, content, category, tags, featured_image, is_published } = body;

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and content are required." },
      { status: 400 }
    );
  }

  const updated = await queryOne<BlogPost>(
    `UPDATE blog_posts SET title=$1, content=$2, category=$3, tags=$4,
     featured_image=$5, is_published=$6 WHERE id=$7 RETURNING *`,
    [title, content, category ?? "General", tags ?? [], featured_image ?? null, is_published ?? false, id]
  );

  if (!updated) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = getTokenFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { id } = await params;
  await query("DELETE FROM blog_posts WHERE id = $1", [id]);
  return NextResponse.json({ success: true });
}
