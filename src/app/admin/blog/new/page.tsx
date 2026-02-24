import { Metadata } from "next";
import BlogPostForm from "@/components/BlogPostForm";

export const metadata: Metadata = {
  title: "New Blog Post | Admin",
};

export default function NewBlogPostPage() {
  return (
    <div className="max-w-3xl mt-8 md:mt-0">
      <h1 className="font-display text-2xl md:text-3xl text-slate-900 mb-6">New Blog Post</h1>
      <BlogPostForm />
    </div>
  );
}
