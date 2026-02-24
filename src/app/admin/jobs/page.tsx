import { Metadata } from "next";
import Link from "next/link";
import { query } from "@/lib/db";
import { Job } from "@/types";
import AdminJobActions from "./AdminJobActions";

export const metadata: Metadata = {
  title: "Manage Jobs | Admin",
};

async function getJobs(): Promise<Job[]> {
  return query<Job>("SELECT * FROM jobs ORDER BY created_at DESC");
}

export default async function AdminJobsPage() {
  const jobs = await getJobs();

  return (
    <div className="max-w-5xl mt-8 md:mt-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl text-slate-900">Manage Jobs</h1>
          <p className="text-gray-500 text-sm mt-1">{jobs.length} total job{jobs.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/jobs/new" className="btn-primary text-sm py-2">
          Add New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          No jobs yet. Add your first job to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="card flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-semibold text-slate-900 truncate">{job.title}</h2>
                  {!job.is_active && (
                    <span className="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                  <span>{job.location}</span>
                  <span>{job.category}</span>
                  <span>{new Date(job.created_at).toLocaleDateString("en-ZA")}</span>
                </div>
              </div>
              <AdminJobActions jobId={job.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
