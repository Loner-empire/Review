import { Metadata } from "next";
import Link from "next/link";
import { query } from "@/lib/db";
import { BlogPost } from "@/types";
import AdminBlogActions from "./AdminBlogActions";

export const metadata: Metadata = {
  title: "Blog Posts | Admin",
};

async function getPosts(): Promise<BlogPost[]> {
  return query<BlogPost>("SELECT * FROM blog_posts ORDER BY created_at DESC");
}

export default async function AdminBlogPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-5xl mt-8 md:mt-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-slate-900">Blog Posts</h1>
          <p className="text-gray-500 text-sm mt-1">{posts.length} total post{posts.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary text-sm py-2">
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          No posts yet. Create your first blog post.
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="card flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold text-slate-900 truncate">{post.title}</h2>
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 ${
                      post.is_published
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {post.is_published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                  <span>{post.category}</span>
                  <span>{new Date(post.created_at).toLocaleDateString("en-ZA")}</span>
                  {post.tags.length > 0 && <span>{post.tags.join(", ")}</span>}
                </div>
              </div>
              <AdminBlogActions postId={post.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
