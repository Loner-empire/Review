import { Metadata } from "next";
import AdminLoginForm from "./AdminLoginForm";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Login | Youth Spark Careers",
};

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="w-9 h-9 bg-brand-600 rounded flex items-center justify-center text-white font-bold">
            YS
          </span>
          <span className="font-display font-bold text-xl text-slate-900">Youth Spark Careers</span>
        </div>

        <div className="card">
          <h1 className="font-display text-2xl text-slate-900 mb-1">Admin Login</h1>
          <p className="text-sm text-gray-500 mb-6">Sign in to access the admin dashboard.</p>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
