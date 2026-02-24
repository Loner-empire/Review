import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="max-w-lg mx-auto px-4 py-20 sm:py-28 text-center">
        <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">404</p>
        <h1 className="font-display text-3xl sm:text-4xl text-slate-900 mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you are looking for does not exist or may have been removed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
          <Link href="/jobs" className="btn-outline">
            Browse Jobs
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
