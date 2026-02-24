"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  postId: string;
}

export default function AdminBlogActions({ postId }: Props) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeleting(true);

    try {
      await fetch(`/api/blog/${postId}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/admin/blog/${postId}/edit`}
        className="text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
