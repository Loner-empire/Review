"use client";

import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";

interface ApplicationFormProps {
  jobId?: string;
  defaultPosition?: string;
}

interface User {
  id: string;
  email: string;
  fullName: string;
}

export default function ApplicationForm({ jobId, defaultPosition }: ApplicationFormProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverLetterLength, setCoverLetterLength] = useState(0);

  useEffect(() => {
    async function fetchUser() {
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
    fetchUser();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="card py-12 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="card py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="font-display text-xl text-slate-900 mb-2">Sign in to Apply</h2>
        <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
          You need to create an account or sign in to submit your job application. This helps us keep track of your applications and contact you.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/auth/login" className="btn-primary px-6 py-2.5">
            Sign In
          </Link>
          <Link href="/auth/signup" className="btn-secondary px-6 py-2.5">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Double-check user exists (defensive programming)
    if (!user) {
      setError("You must be signed in to apply.");
      return;
    }
    
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    if (jobId) {
      formData.set("job_id", jobId);
    }

    // Add user_id to the form data
    formData.set("user_id", user.id);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
      // Scroll success message into view on mobile
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        className="bg-green-50 border border-green-200 rounded-lg p-6 sm:p-8 text-center"
        role="alert"
        aria-live="polite"
      >
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-xl text-slate-900 mb-2">Application Submitted</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Thank you for applying. Our team will review your application and be in touch if you are
          shortlisted. Good luck!
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card space-y-5"
      noValidate
      aria-label="Job application form"
    >
      {/* Name and email on one row on larger screens */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
        <div>
          <label htmlFor="full_name" className="form-label">
            Full Name <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            minLength={2}
            maxLength={200}
            autoComplete="name"
            className="form-input"
            placeholder="Thabo Nkosi"
          />
        </div>

        <div>
          <label htmlFor="email" className="form-label">
            Email Address <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            className="form-input"
            placeholder="thabo@example.com"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
        <div>
          <label htmlFor="phone" className="form-label">
            Phone Number <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            className="form-input"
            placeholder="0712345678"
          />
        </div>

        <div>
          <label htmlFor="position_applied" className="form-label">
            Position Applied For <span className="text-red-500" aria-label="required">*</span>
          </label>
          <input
            id="position_applied"
            name="position_applied"
            type="text"
            required
            maxLength={255}
            defaultValue={defaultPosition}
            className="form-input"
            placeholder="e.g. Retail Sales Assistant"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cv" className="form-label">
          CV / Resume <span className="text-red-500" aria-label="required">*</span>{" "}
          <span className="text-gray-400 font-normal text-xs">(PDF or DOCX, max 5 MB)</span>
        </label>
        <input
          id="cv"
          name="cv"
          type="file"
          required
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="form-input text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
          aria-describedby="cv-hint"
        />
        <p id="cv-hint" className="text-xs text-gray-400 mt-1">
          Upload your most recent CV in PDF or Word format.
        </p>
      </div>

      <div>
        <label htmlFor="certificates" className="form-label">
          Certificates{" "}
          <span className="text-gray-400 font-normal text-xs">(PDF only, max 5 MB, optional)</span>
        </label>
        <input
          id="certificates"
          name="certificates"
          type="file"
          accept=".pdf,application/pdf"
          className="form-input text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="cover_letter" className="form-label mb-0">
            Cover Letter{" "}
            <span className="text-gray-400 font-normal text-xs">(optional)</span>
          </label>
          <span className="text-xs text-gray-400" aria-live="polite">
            {coverLetterLength}/2000
          </span>
        </div>
        <textarea
          id="cover_letter"
          name="cover_letter"
          rows={5}
          maxLength={2000}
          onChange={(e) => setCoverLetterLength(e.target.value.length)}
          className="form-input resize-none"
          placeholder="Tell us a little about yourself and why you are interested in this role..."
        />
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full relative"
        aria-busy={submitting}
      >
        {submitting ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </button>
    </form>
  );
}
