import { Metadata } from "next";
import PublicLayout from "@/components/PublicLayout";
import ApplicationForm from "@/components/ApplicationForm";

export const metadata: Metadata = {
  title: "Apply for a Position",
  description: "Submit your application to Youth Spark Careers.",
};

interface Props {
  searchParams: {
    job_id?: string;
    position?: string;
  };
}

export default function ApplyPage({ searchParams }: Props) {
  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl text-slate-900 mb-2">
            Submit Your Application
          </h1>
          <p className="text-gray-600">
            Fill in the form below. All fields marked with an asterisk (*) are required.
          </p>
        </div>

        <ApplicationForm
          jobId={searchParams.job_id}
          defaultPosition={searchParams.position ? decodeURIComponent(searchParams.position) : ""}
        />
      </div>
    </PublicLayout>
  );
}
