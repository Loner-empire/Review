import { Metadata } from "next";
import Link from "next/link";
import { query } from "@/lib/db";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
};

async function getStats() {
  const [
    totalApplications,
    pendingApplications,
    totalJobs,
    totalPosts,
  ] = await Promise.all([
    query<{ count: string }>("SELECT COUNT(*) FROM applications"),
    query<{ count: string }>("SELECT COUNT(*) FROM applications WHERE status = 'pending'"),
    query<{ count: string }>("SELECT COUNT(*) FROM jobs WHERE is_active = TRUE"),
    query<{ count: string }>("SELECT COUNT(*) FROM blog_posts WHERE is_published = TRUE"),
  ]);

  return {
    totalApplications: Number(totalApplications[0]?.count ?? 0),
    pendingApplications: Number(pendingApplications[0]?.count ?? 0),
    totalJobs: Number(totalJobs[0]?.count ?? 0),
    totalPosts: Number(totalPosts[0]?.count ?? 0),
  };
}

async function getRecentApplications() {
  return query<{
    id: string;
    full_name: string;
    position_applied: string;
    status: string;
    created_at: string;
  }>(
    "SELECT id, full_name, position_applied, status, created_at FROM applications ORDER BY created_at DESC LIMIT 5"
  );
}

export default async function AdminDashboard() {
  const [stats, recentApplications] = await Promise.all([
    getStats(),
    getRecentApplications(),
  ]);

  const statCards = [
    { label: "Total Applications", value: stats.totalApplications, href: "/admin/applications" },
    { label: "Pending Review", value: stats.pendingApplications, href: "/admin/applications?status=pending" },
    { label: "Active Jobs", value: stats.totalJobs, href: "/admin/jobs" },
    { label: "Published Posts", value: stats.totalPosts, href: "/admin/blog" },
  ];

  return (
    <div className="max-w-5xl">
      <div className="mt-8 md:mt-0 mb-8">
        <h1 className="font-display text-2xl md:text-3xl text-slate-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of platform activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="card hover:shadow-md transition-shadow text-center"
          >
            <p className="font-display text-3xl font-bold text-brand-600">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-slate-900">Recent Applications</h2>
          <Link href="/admin/applications" className="text-sm text-brand-600 hover:text-brand-700">
            View all
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <p className="text-gray-500 text-sm py-4 text-center">No applications yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="pb-2 font-semibold text-gray-600">Applicant</th>
                  <th className="pb-2 font-semibold text-gray-600">Position</th>
                  <th className="pb-2 font-semibold text-gray-600">Status</th>
                  <th className="pb-2 font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="py-2">
                    <td className="py-3 pr-4 text-slate-900 font-medium">{app.full_name}</td>
                    <td className="py-3 pr-4 text-gray-600 max-w-[200px] truncate">
                      {app.position_applied}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`badge-${app.status}`}>{app.status}</span>
                    </td>
                    <td className="py-3 text-gray-400 whitespace-nowrap">
                      {new Date(app.created_at).toLocaleDateString("en-ZA")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
