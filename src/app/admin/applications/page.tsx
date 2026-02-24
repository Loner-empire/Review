import { Metadata } from "next";
import Link from "next/link";
import { query } from "@/lib/db";
import { Application } from "@/types";
import ApplicationStatusUpdater from "./ApplicationStatusUpdater";

export const metadata: Metadata = {
  title: "Applications | Admin",
};

const STATUS_FILTERS = ["all", "pending", "reviewed", "shortlisted", "rejected"] as const;

interface Props {
  searchParams: { status?: string };
}

async function getApplications(status?: string): Promise<Application[]> {
  if (status && status !== "all") {
    return query<Application>(
      "SELECT * FROM applications WHERE status = $1 ORDER BY created_at DESC",
      [status]
    );
  }
  return query<Application>("SELECT * FROM applications ORDER BY created_at DESC");
}

export default async function AdminApplicationsPage({ searchParams }: Props) {
  const currentStatus = searchParams.status ?? "all";
  const applications = await getApplications(currentStatus);

  return (
    <div className="max-w-6xl mt-8 md:mt-0">
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl text-slate-900">Applications</h1>
        <p className="text-gray-500 text-sm mt-1">{applications.length} result{applications.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((status) => (
          <Link
            key={status}
            href={status === "all" ? "/admin/applications" : `/admin/applications?status=${status}`}
            className={`px-3 py-1 rounded-full text-xs font-medium border capitalize transition-colors ${
              currentStatus === status
                ? "bg-slate-900 text-white border-slate-900"
                : "border-gray-300 text-gray-600 hover:border-slate-400"
            }`}
          >
            {status}
          </Link>
        ))}
      </div>

      {applications.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          No applications found for this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="card">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-slate-900">{app.full_name}</p>
                    <span className={`badge-${app.status}`}>{app.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{app.position_applied}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                    <span>{app.email}</span>
                    <span>{app.phone}</span>
                    <span>{new Date(app.created_at).toLocaleDateString("en-ZA")}</span>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-3">
                    <a
                      href={app.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-600 font-medium hover:text-brand-700"
                    >
                      View CV
                    </a>
                    {app.certificates_url && (
                      <a
                        href={app.certificates_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand-600 font-medium hover:text-brand-700"
                      >
                        View Certificates
                      </a>
                    )}
                  </div>

                  {app.cover_letter && (
                    <details className="mt-3">
                      <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                        Cover Letter
                      </summary>
                      <p className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded leading-relaxed">
                        {app.cover_letter}
                      </p>
                    </details>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <ApplicationStatusUpdater id={app.id} currentStatus={app.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
