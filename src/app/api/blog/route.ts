import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { getTokenFromRequest } from "@/lib/auth";
import { BlogPost } from "@/types";
import { uploadFile, ALLOWED_MIME_TYPES, FILE_LIMITS } from "@/lib/storage";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Public: get published posts
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const admin = getTokenFromRequest(req);

  const params: unknown[] = [];
  let sql = "SELECT * FROM blog_posts";

  const conditions: string[] = [];
  if (!admin) {
    conditions.push("is_published = TRUE");
  }
  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  sql += " ORDER BY created_at DESC";

  const posts = await query<BlogPost>(sql, params);
  return NextResponse.json(posts);
}

// Admin: create a new post
export async function POST(req: NextRequest) {
  const admin = getTokenFromRequest(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const formData = await req.formData();
  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const category = (formData.get("category") as string)?.trim() ?? "General";
  const tagsRaw = (formData.get("tags") as string)?.trim();
  const isPublished = formData.get("is_published") === "true";
  const imageFile = formData.get("featured_image") as File | null;

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and content are required." },
      { status: 400 }
    );
  }

  let slug = slugify(title);
  // Ensure slug uniqueness
  const existing = await queryOne("SELECT id FROM blog_posts WHERE slug = $1", [slug]);
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    if (imageFile.size > FILE_LIMITS.image) {
      return NextResponse.json(
        { error: "Image must be under 3 MB." },
        { status: 400 }
      );
    }
    if (!ALLOWED_MIME_TYPES.image.includes(imageFile.type)) {
      return NextResponse.json(
        { error: "Image must be JPEG, PNG, or WebP." },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const { url } = await uploadFile(buffer, imageFile.name, imageFile.type, "blog-images");
    imageUrl = url;
  }

  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const post = await queryOne<BlogPost>(
    `INSERT INTO blog_posts (title, slug, content, category, tags, featured_image, is_published)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [title, slug, content, category, tags, imageUrl, isPublished]
  );

  return NextResponse.json(post, { status: 201 });
}
