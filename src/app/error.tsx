"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your error reporting service in production
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">
          Something went wrong
        </p>
        <h1 className="font-display text-2xl sm:text-3xl text-slate-900 mb-3">
          An unexpected error occurred
        </h1>
        <p className="text-gray-600 text-sm mb-8">
          We have noted the issue. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <Link href="/" className="btn-outline">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
