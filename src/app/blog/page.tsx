import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PublicLayout from "@/components/PublicLayout";
import { query } from "@/lib/db";
import { BlogPost } from "@/types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description: "Career advice, training resources, and campaign updates for South African youth.",
};

const CATEGORIES = ["Training", "Media", "Campaigns"];

async function getPosts(category?: string): Promise<BlogPost[]> {
  const params: unknown[] = [];
  let sql = "SELECT * FROM blog_posts WHERE is_published = TRUE";

  if (category) {
    params.push(category);
    sql += ` AND category = $1`;
  }

  sql += " ORDER BY created_at DESC";
  return query<BlogPost>(sql, params);
}

interface Props {
  searchParams: { category?: string };
}

export default async function BlogPage({ searchParams }: Props) {
  const posts = await getPosts(searchParams.category);

  return (
    <PublicLayout>
      <div className="bg-slate-900 text-white py-10 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-white mb-1">Blog</h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Resources, training tips, and updates for South African youth.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Category tabs — horizontally scrollable on mobile */}
        <div
          className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-1 px-1"
          style={{ scrollbarWidth: "none" }}
        >
          <Link
            href="/blog"
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${
              !searchParams.category
                ? "bg-brand-600 text-white border-brand-600"
                : "border-gray-300 text-gray-600 hover:border-brand-400 hover:text-brand-600"
            }`}
          >
            All
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/blog?category=${cat}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors whitespace-nowrap ${
                searchParams.category === cat
                  ? "bg-brand-600 text-white border-brand-600"
                  : "border-gray-300 text-gray-600 hover:border-brand-400 hover:text-brand-600"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-14 sm:py-16 text-gray-500">
            <p className="text-base font-medium">No posts yet</p>
            <p className="text-sm mt-1">Check back soon for updates and resources.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  const date = new Date(post.created_at).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Strip simple markdown syntax for the preview blurb
  const blurb = post.content
    .replace(/^#{1,3}\s.+$/gm, "")
    .replace(/\*\*/g, "")
    .trim()
    .substring(0, 180);

  return (
    <article className="card hover:shadow-md transition-shadow flex flex-col gap-3">
      {post.featured_image && (
        <div className="relative h-40 sm:h-44 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 mb-2 rounded-t-lg overflow-hidden">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs bg-brand-50 text-brand-700 border border-brand-200 rounded-full px-2.5 py-0.5">
          {post.category}
        </span>
        <span className="text-xs text-gray-400">{date}</span>
      </div>

      <h2 className="font-display text-base sm:text-lg text-slate-900 leading-snug">
        <Link href={`/blog/${post.slug}`} className="hover:text-brand-600 transition-colors">
          {post.title}
        </Link>
      </h2>

      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
        {blurb}
      </p>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-gray-50">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
