import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import { queryOne } from "@/lib/db";
import { Job } from "@/types";

export const revalidate = 120;

interface Props {
  params: Promise<{ id: string }>;
}

async function getJob(id: string): Promise<Job | null> {
  return queryOne<Job>(
    "SELECT * FROM jobs WHERE id = $1 AND is_active = TRUE",
    [id]
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) return { title: "Job Not Found" };
  return {
    title: job.title,
    description: job.description.substring(0, 160),
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) notFound();

  const postedDate = new Date(job.created_at).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="mb-4">
          <Link href="/jobs" className="text-sm text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </Link>
        </div>

        <div className="card">
          {/* Header — stacks on mobile, row on desktop */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="min-w-0">
              <h1 className="font-display text-xl sm:text-2xl md:text-3xl text-slate-900 leading-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">{job.location}</span>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <span className="text-xs bg-brand-50 text-brand-700 border border-brand-200 rounded-full px-2.5 py-0.5">
                  {job.category}
                </span>
                <span className="text-gray-300 hidden sm:inline">|</span>
                <span className="text-xs text-gray-400">{postedDate}</span>
              </div>
            </div>

            {/* Apply button — full width on mobile */}
            <Link
              href={`/apply?job_id=${job.id}&position=${encodeURIComponent(job.title)}`}
              className="btn-primary whitespace-nowrap w-full sm:w-auto text-center"
            >
              Apply for This Job
            </Link>
          </div>

          <div className="space-y-6 prose-content">
            <div>
              <h2 className="font-display text-lg sm:text-xl text-slate-900 mb-3">About the Role</h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {job.description}
              </div>
            </div>

            {job.requirements && (
              <div>
                <h2 className="font-display text-lg sm:text-xl text-slate-900 mb-3">Requirements</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {job.requirements}
                </div>
              </div>
            )}

            {job.benefits && (
              <div>
                <h2 className="font-display text-lg sm:text-xl text-slate-900 mb-3">What We Offer</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {job.benefits}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link
              href={`/apply?job_id=${job.id}&position=${encodeURIComponent(job.title)}`}
              className="btn-primary w-full sm:w-auto text-center"
            >
              Apply for This Job
            </Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
