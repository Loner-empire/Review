"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface AdminSidebarProps {
  email: string;
  role: string;
}

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/jobs", label: "Manage Jobs" },
  { href: "/admin/blog", label: "Blog Posts" },
];

export default function AdminSidebar({ email, role }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const navContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-200">
        <span className="w-7 h-7 bg-brand-600 rounded flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
          YS
        </span>
        <span className="font-display font-bold text-sm text-slate-900 truncate">Admin Panel</span>
      </div>

      <nav className="flex-1 p-3 space-y-0.5" aria-label="Admin navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center min-h-[44px] px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              pathname.startsWith(item.href)
                ? "bg-brand-50 text-brand-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-slate-900"
            }`}
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 truncate mb-0.5" title={email}>{email}</p>
        <p className="text-xs text-gray-400 capitalize mb-3">{role}</p>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors min-h-[44px] flex items-center"
        >
          {signingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — fixed */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-60 bg-white border-r border-gray-200 z-30">
        {navContent}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14">
        <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <span className="w-7 h-7 bg-brand-600 rounded flex items-center justify-center text-white font-bold text-xs">
            YS
          </span>
          <span className="font-display font-bold text-sm text-slate-900">Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-20 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="md:hidden fixed left-0 top-14 bottom-0 z-30 w-64 bg-white shadow-xl overflow-y-auto">
            {navContent}
          </div>
        </>
      )}
    </>
  );
}
