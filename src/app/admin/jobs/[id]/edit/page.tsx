import { Metadata } from "next";
import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db";
import { Job } from "@/types";
import JobForm from "@/components/JobForm";

interface Props {
  params: { id: string };
}

export const metadata: Metadata = {
  title: "Edit Job | Admin",
};

export default async function EditJobPage({ params }: Props) {
  const job = await queryOne<Job>("SELECT * FROM jobs WHERE id = $1", [params.id]);
  if (!job) notFound();

  return (
    <div className="max-w-2xl mt-8 md:mt-0">
      <h1 className="font-display text-2xl md:text-3xl text-slate-900 mb-6">Edit Job</h1>
      <JobForm job={job} />
    </div>
  );
}
