"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navLinks = [
  { href: "/jobs", label: "Find Jobs" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

interface User {
  id: string;
  email: string;
  fullName: string;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Check for user session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch {
        // Not logged in
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [pathname]);

  // Close drawer whenever the user navigates
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-900 hover:text-brand-600 transition-colors"
              aria-label="Youth Spark Careers home"
            >
              <span className="w-8 h-8 bg-brand-600 rounded flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0">
                YS
              </span>
              <span className="font-display font-bold text-base sm:text-lg">
                Youth Spark Careers
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors min-h-[44px] flex items-center ${
                    pathname.startsWith(link.href)
                      ? "text-brand-600"
                      : "text-gray-600 hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {loading ? (
                <div className="w-20 h-9 bg-gray-100 rounded animate-pulse" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-slate-900 min-h-[44px] px-2 rounded-md hover:bg-gray-100 transition-colors"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    <span className="w-8 h-8 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-sm font-semibold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                    <span className="hidden lg:inline">{user.fullName.split(' ')[0]}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-slate-900 min-h-[44px] flex items-center">
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="btn-primary text-sm py-2 px-4">
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button — 44×44px touch target */}
            <button
              className="md:hidden w-11 h-11 flex items-center justify-center text-gray-500 hover:text-slate-900 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen drawer with backdrop */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <nav
            id="mobile-nav"
            className="md:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-lg"
            aria-label="Mobile navigation"
          >
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center min-h-[48px] px-3 rounded-md font-medium text-base transition-colors ${
                    pathname.startsWith(link.href)
                      ? "text-brand-600 bg-brand-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 pb-1 border-t border-gray-100 mt-2">
                {loading ? (
                  <div className="w-full h-10 bg-gray-100 rounded animate-pulse" />
                ) : user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/auth/login"
                      className="w-full text-center py-2.5 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="btn-primary w-full text-base"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
