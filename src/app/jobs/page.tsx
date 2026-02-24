import { Metadata } from "next";
import { Suspense } from "react";
import PublicLayout from "@/components/PublicLayout";
import JobCard from "@/components/JobCard";
import JobFilters from "@/components/JobFilters";
import { query } from "@/lib/db";
import { Job } from "@/types";

// Cache the page for 2 minutes
export const revalidate = 120;

export const metadata: Metadata = {
  title: "Find Jobs",
  description: "Browse verified employment opportunities for South African youth.",
};

interface SearchParams {
  location?: string;
  category?: string;
}

async function getJobs(searchParams: SearchParams): Promise<Job[]> {
  const conditions: string[] = ["is_active = TRUE"];
  const params: unknown[] = [];

  if (searchParams.location) {
    params.push(`%${searchParams.location}%`);
    conditions.push(`location ILIKE $${params.length}`);
  }

  if (searchParams.category) {
    params.push(searchParams.category);
    conditions.push(`category = $${params.length}`);
  }

  return query<Job>(
    `SELECT * FROM jobs WHERE ${conditions.join(" AND ")} ORDER BY created_at DESC`,
    params
  );
}

async function getFilterOptions(): Promise<{ categories: string[]; locations: string[] }> {
  const [catRows, locRows] = await Promise.all([
    query<{ category: string }>(
      "SELECT DISTINCT category FROM jobs WHERE is_active = TRUE ORDER BY category"
    ),
    query<{ location: string }>(
      "SELECT DISTINCT location FROM jobs WHERE is_active = TRUE ORDER BY location"
    ),
  ]);
  return {
    categories: catRows.map((r) => r.category),
    locations: locRows.map((r) => r.location),
  };
}

function JobGridSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="card space-y-3" aria-hidden="true">
          <div className="skeleton h-5 w-3/4" />
          <div className="skeleton h-4 w-1/3" />
          <div className="skeleton h-16 w-full" />
        </div>
      ))}
    </div>
  );
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [jobs, { categories, locations }] = await Promise.all([
    getJobs(searchParams),
    getFilterOptions(),
  ]);

  return (
    <PublicLayout>
      <div className="bg-slate-900 text-white py-10 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-white mb-1">
            Job Opportunities
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            {jobs.length} position{jobs.length !== 1 ? "s" : ""} currently available
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Filters above grid on mobile, sidebar on desktop */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <aside className="md:w-56 lg:w-60 flex-shrink-0">
            <Suspense fallback={null}>
              <JobFilters
                categories={categories}
                locations={locations}
                selectedCategory={searchParams.category}
                selectedLocation={searchParams.location}
              />
            </Suspense>
          </aside>

          <div className="flex-1 min-w-0">
            {jobs.length === 0 ? (
              <div className="card text-center py-12 sm:py-16 text-gray-500">
                <p className="text-base font-medium mb-1">No jobs match your filters</p>
                <p className="text-sm">Try adjusting your search criteria.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
