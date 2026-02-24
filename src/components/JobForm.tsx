"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Job } from "@/types";

interface JobFormProps {
  job?: Job;
}

export default function JobForm({ job }: JobFormProps) {
  const isEditing = !!job;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      requirements: formData.get("requirements"),
      benefits: formData.get("benefits"),
      location: formData.get("location"),
      category: formData.get("category"),
      is_active: formData.get("is_active") === "true",
    };

    try {
      const res = await fetch(
        isEditing ? `/api/jobs/${job.id}` : "/api/jobs/admin",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }

      router.push("/admin/jobs");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const JOB_CATEGORIES = [
    "General",
    "Customer Service",
    "Retail",
    "Learnership",
    "Administration",
    "Hospitality",
    "ICT",
    "Community Development",
    "Finance",
    "Healthcare",
    "Construction",
  ];

  return (
    <form onSubmit={handleSubmit} className="card space-y-5">
      <div>
        <label htmlFor="title" className="form-label">Job Title *</label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={job?.title}
          className="form-input"
          placeholder="e.g. Junior Customer Service Agent"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="location" className="form-label">Location *</label>
          <input
            id="location"
            name="location"
            type="text"
            required
            defaultValue={job?.location}
            className="form-input"
            placeholder="e.g. Johannesburg, Gauteng"
          />
        </div>

        <div>
          <label htmlFor="category" className="form-label">Category</label>
          <select
            id="category"
            name="category"
            defaultValue={job?.category ?? "General"}
            className="form-input"
          >
            {JOB_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="form-label">Description *</label>
        <textarea
          id="description"
          name="description"
          required
          rows={6}
          defaultValue={job?.description}
          className="form-input resize-y"
          placeholder="Describe the role, responsibilities, and context..."
        />
      </div>

      <div>
        <label htmlFor="requirements" className="form-label">Requirements</label>
        <textarea
          id="requirements"
          name="requirements"
          rows={5}
          defaultValue={job?.requirements ?? ""}
          className="form-input resize-y"
          placeholder="List the qualifications and requirements..."
        />
      </div>

      <div>
        <label htmlFor="benefits" className="form-label">Benefits & What We Offer</label>
        <textarea
          id="benefits"
          name="benefits"
          rows={4}
          defaultValue={job?.benefits ?? ""}
          className="form-input resize-y"
          placeholder="Salary, perks, training, growth opportunities..."
        />
      </div>

      {isEditing && (
        <div>
          <label htmlFor="is_active" className="form-label">Status</label>
          <select
            id="is_active"
            name="is_active"
            defaultValue={job.is_active ? "true" : "false"}
            className="form-input"
          >
            <option value="true">Active (visible to applicants)</option>
            <option value="false">Inactive (hidden from applicants)</option>
          </select>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Saving..." : isEditing ? "Save Changes" : "Create Job"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
