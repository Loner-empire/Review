import Link from "next/link";
import { Suspense } from "react";
import PublicLayout from "@/components/PublicLayout";
import { query } from "@/lib/db";
import { Job } from "@/types";
import JobCard from "@/components/JobCard";

// Revalidate the homepage every 5 minutes instead of on every request
export const revalidate = 300;

async function getRecentJobs(): Promise<Job[]> {
  return query<Job>(
    "SELECT * FROM jobs WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 3"
  );
}

function JobCardSkeleton() {
  return (
    <div className="card space-y-3" aria-hidden="true">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-4 w-1/3" />
      <div className="skeleton h-16 w-full" />
      <div className="skeleton h-4 w-1/4 mt-auto" />
    </div>
  );
}

async function RecentJobsSection() {
  const recentJobs = await getRecentJobs();
  if (recentJobs.length === 0) return null;

  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="section-heading mb-0">Recent Opportunities</h2>
          <Link href="/jobs" className="text-brand-600 font-semibold text-sm hover:text-brand-700 shrink-0 ml-4">
            View all
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {recentJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <PublicLayout>
      {/* Hero — dark background, full bleed on all screens */}
      <section className="bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-brand-400 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 sm:mb-4">
              South African Youth Employment Platform
            </p>
            {/* h1 is the LCP element — keep it lean */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4 sm:mb-6">
              Your First Step Toward a Real Career
            </h1>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-xl">
              Youth Spark Careers connects young South Africans between 18 and 35 with verified
              job opportunities, learnerships, and resources to help build lasting careers.
            </p>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
              <Link href="/jobs" className="btn-primary text-base w-full xs:w-auto text-center">
                View All Jobs
              </Link>
              <Link
                href="/apply"
                className="btn-outline border-white text-white hover:bg-white hover:text-slate-900 text-base w-full xs:w-auto text-center"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-brand-600" aria-label="Platform highlights">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center text-white">
            <div className="py-1">
              <p className="font-display text-xl sm:text-2xl md:text-3xl font-bold">Free</p>
              <p className="text-brand-100 text-xs sm:text-sm mt-0.5 sm:mt-1">To Apply</p>
            </div>
            <div className="py-1">
              <p className="font-display text-xl sm:text-2xl md:text-3xl font-bold">SA-Wide</p>
              <p className="text-brand-100 text-xs sm:text-sm mt-0.5 sm:mt-1">Opportunities</p>
            </div>
            <div className="py-1">
              <p className="font-display text-xl sm:text-2xl md:text-3xl font-bold">Youth</p>
              <p className="text-brand-100 text-xs sm:text-sm mt-0.5 sm:mt-1">Focused</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center">
            <div>
              <h2 className="section-heading">
                Bridging the Gap Between Youth and Employment
              </h2>
              <p className="prose-content text-base mb-4">
                South Africa's youth unemployment rate remains one of the highest in the world.
                Youth Spark Careers was created to change that — one placement at a time.
              </p>
              <p className="prose-content text-base mb-6">
                We work directly with employers to list verified opportunities in sectors where
                young people can grow: retail, hospitality, ICT, administration, and community
                development. We never charge applicants a cent.
              </p>
              <Link href="/blog" className="btn-outline">
                Read Our Blog
              </Link>
            </div>

            <div className="bg-brand-50 border border-brand-100 rounded-xl p-6 sm:p-8">
              <h3 className="font-display text-lg sm:text-xl text-slate-900 mb-4 sm:mb-5">
                Who We Help
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  "Recent matriculants looking for their first job",
                  "Graduates seeking entry-level positions",
                  "Youth aged 18–35 looking for learnerships",
                  "Unemployed individuals wanting to re-enter the workforce",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <span
                      className="mt-0.5 w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Jobs — streamed so it doesn't block the rest of the page */}
      <Suspense
        fallback={
          <section className="py-14 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="skeleton h-8 w-48 mb-8" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[1, 2, 3].map((n) => <JobCardSkeleton key={n} />)}
              </div>
            </div>
          </section>
        }
      >
        <RecentJobsSection />
      </Suspense>

      {/* CTA */}
      <section className="py-14 md:py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="section-heading">Ready to Take the Next Step?</h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-base">
            Browse open positions across South Africa and apply directly through our platform.
            No recruitment fees. No barriers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link href="/jobs" className="btn-primary text-base">
              Browse Jobs
            </Link>
            <Link href="/contact" className="btn-outline text-base">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
