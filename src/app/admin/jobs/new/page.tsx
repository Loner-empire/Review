import { Metadata } from "next";
import JobForm from "@/components/JobForm";

export const metadata: Metadata = {
  title: "Add New Job | Admin",
};

export default function NewJobPage() {
  return (
    <div className="max-w-2xl mt-8 md:mt-0">
      <h1 className="font-display text-2xl md:text-3xl text-slate-900 mb-6">Add New Job</h1>
      <JobForm />
    </div>
  );
}
