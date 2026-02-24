"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { BlogPost } from "@/types";

interface BlogPostFormProps {
  post?: BlogPost;
}

const BLOG_CATEGORIES = ["Training", "Media", "Campaigns", "General"];

export default function BlogPostForm({ post }: BlogPostFormProps) {
  const isEditing = !!post;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      let res: Response;

      if (isEditing) {
        // For edit, send JSON (image update handled separately if needed)
        const data = {
          title: formData.get("title"),
          content: formData.get("content"),
          category: formData.get("category"),
          tags: (formData.get("tags") as string)
            ?.split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          is_published: formData.get("is_published") === "true",
          featured_image: post.featured_image,
        };
        res = await fetch(`/api/blog/${post.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        // For new posts, use FormData to support image upload
        res = await fetch("/api/blog", {
          method: "POST",
          body: formData,
        });
      }

      const result = await res.json();

      if (!res.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <div>
        <label htmlFor="title" className="form-label">Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={post?.title}
          className="form-input"
          placeholder="Post title"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            name="category"
            defaultValue={post?.category ?? "General"}
            className="form-input"
          >
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="form-label">
            Tags <span className="text-gray-400 font-normal text-xs">(comma-separated)</span>
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            defaultValue={post?.tags?.join(", ")}
            className="form-input"
            placeholder="career, tips, learnership"
          />
        </div>
      </div>

      <div>
        <label htmlFor="content" className="form-label">Content *</label>
        <textarea
          id="content"
          name="content"
          required
          rows={14}
          defaultValue={post?.content}
          className="form-input resize-y font-mono text-sm"
          placeholder="Write your post content here. Use ## for headings, blank lines between paragraphs."
        />
        <p className="text-xs text-gray-400 mt-1">
          Use ## for headings, leave blank lines between paragraphs.
        </p>
      </div>

      {!isEditing && (
        <div>
          <label htmlFor="featured_image" className="form-label">
            Featured Image <span className="text-gray-400 font-normal text-xs">(JPEG/PNG/WebP, max 3 MB, optional)</span>
          </label>
          <input
            id="featured_image"
            name="featured_image"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            className="form-input text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
          />
        </div>
      )}

      <div>
        <label htmlFor="is_published" className="form-label">Publication Status</label>
        <select
          id="is_published"
          name="is_published"
          defaultValue={post?.is_published ? "true" : "false"}
          className="form-input"
        >
          <option value="false">Draft (not visible to public)</option>
          <option value="true">Published (visible to public)</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Post"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}
