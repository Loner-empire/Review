import { Metadata } from "next";
import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { BlogPost } from "@/types";
import BlogPostForm from "@/components/BlogPostForm";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Post | Admin",
};

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await queryOne<BlogPost>(
    "SELECT * FROM blog_posts WHERE id = $1",
    [id]
  );
  if (!post) notFound();

  return (
    <div className="max-w-3xl mt-8 md:mt-0">
      <h1 className="font-display text-2xl md:text-3xl text-slate-900 mb-6">Edit Post</h1>
      <BlogPostForm post={post} />
    </div>
  );
}
