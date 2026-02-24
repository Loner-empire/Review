import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar email={session.email} role={session.role} />
      {/* On mobile: pad top for the fixed header (56px = h-14), on desktop: pad left for sidebar (240px = w-60) */}
      <main className="flex-1 pt-14 md:pt-0 md:ml-60 p-4 sm:p-6 md:p-8 min-w-0">
        {children}
      </main>
    </div>
  );
}
