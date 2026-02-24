import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PublicLayout from "@/components/PublicLayout";
import { queryOne } from "@/lib/db";
import { BlogPost } from "@/types";

interface Props {
  params: { slug: string };
}

async function getPost(slug: string): Promise<BlogPost | null> {
  return queryOne<BlogPost>(
    "SELECT * FROM blog_posts WHERE slug = $1 AND is_published = TRUE",
    [slug]
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.content.substring(0, 160),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const date = new Date(post.created_at).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Render basic markdown-like content (line breaks, bold, headers)
  const renderContent = (content: string) => {
    const paragraphs = content.split("\n\n").filter(Boolean);
    return paragraphs.map((para, i) => {
      if (para.startsWith("## ")) {
        return (
          <h2 key={i} className="font-display text-2xl text-slate-900 mt-8 mb-3">
            {para.replace("## ", "")}
          </h2>
        );
      }
      if (para.startsWith("# ")) {
        return (
          <h1 key={i} className="font-display text-3xl text-slate-900 mt-8 mb-3">
            {para.replace("# ", "")}
          </h1>
        );
      }
      return (
        <p key={i} className="text-gray-700 leading-relaxed mb-4">
          {para}
        </p>
      );
    });
  };

  return (
    <PublicLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-4">
          <Link href="/blog" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            &larr; Back to Blog
          </Link>
        </div>

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs bg-brand-50 text-brand-700 border border-brand-200 rounded-full px-2.5 py-0.5">
              {post.category}
            </span>
            <span className="text-sm text-gray-400">{date}</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-slate-900 leading-tight mb-4">
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.featured_image && (
          <div className="relative h-64 md:h-80 mb-8 rounded-xl overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <article className="prose max-w-none">
          {renderContent(post.content)}
        </article>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-4">Looking for a job opportunity?</p>
          <Link href="/jobs" className="btn-primary">
            Browse Available Jobs
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
