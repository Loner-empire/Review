import Link from "next/link";
import { Job } from "@/types";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const postedDate = new Date(job.created_at).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="card hover:shadow-md transition-shadow duration-200 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {/* Full card is clickable on mobile for easy tap */}
            <Link
              href={`/jobs/${job.id}`}
              className="hover:text-brand-600 transition-colors after:absolute after:inset-0"
            >
              {job.title}
            </Link>
          </h3>
          <p className="text-sm text-gray-500 mt-0.5 truncate">{job.location}</p>
        </div>
        <span className="text-xs bg-brand-50 text-brand-700 border border-brand-200 rounded-full px-2 py-0.5 whitespace-nowrap flex-shrink-0">
          {job.category}
        </span>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 flex-1">
        {job.description}
      </p>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-400">{postedDate}</span>
        <Link
          href={`/jobs/${job.id}`}
          className="text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors min-h-[44px] flex items-center"
          aria-label={`View details for ${job.title}`}
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
