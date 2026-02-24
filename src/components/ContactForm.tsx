"use client";

import { useState, FormEvent } from "react";

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
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
        <h2 className="font-display text-xl text-slate-900 mb-2">Message Sent</h2>
        <p className="text-gray-600 text-sm">
          Thank you for reaching out. We will get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card space-y-5"
      noValidate
      aria-label="Contact form"
    >
      <div>
        <label htmlFor="contact_name" className="form-label">
          Full Name <span className="text-red-500" aria-label="required">*</span>
        </label>
        <input
          id="contact_name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={200}
          autoComplete="name"
          className="form-input"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="contact_email" className="form-label">
          Email Address <span className="text-red-500" aria-label="required">*</span>
        </label>
        <input
          id="contact_email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          className="form-input"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="contact_message" className="form-label">
          Message <span className="text-red-500" aria-label="required">*</span>
        </label>
        <textarea
          id="contact_message"
          name="message"
          required
          rows={6}
          maxLength={2000}
          className="form-input resize-none"
          placeholder="How can we help you?"
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
        className="btn-primary w-full"
        aria-busy={submitting}
      >
        {submitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}
