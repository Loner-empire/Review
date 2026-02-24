"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface JobFiltersProps {
  categories: string[];
  locations: string[];
  selectedCategory?: string;
  selectedLocation?: string;
}

export default function JobFilters({
  categories,
  locations,
  selectedCategory,
  selectedLocation,
}: JobFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/jobs?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    router.push("/jobs");
  };

  const hasFilters = selectedCategory || selectedLocation;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-5">
      <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wide">
        Filter Jobs
      </h2>

      <div>
        <label className="form-label">Category</label>
        <select
          value={selectedCategory ?? ""}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="form-input text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label">Location</label>
        <select
          value={selectedLocation ?? ""}
          onChange={(e) => updateFilter("location", e.target.value)}
          className="form-input text-sm"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
