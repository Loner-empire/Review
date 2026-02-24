"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["pending", "reviewed", "shortlisted", "rejected"] as const;
type Status = (typeof STATUSES)[number];

interface Props {
  id: string;
  currentStatus: Status;
}

export default function ApplicationStatusUpdater({ id, currentStatus }: Props) {
  const [status, setStatus] = useState<Status>(currentStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleChange(newStatus: Status) {
    if (newStatus === status) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as Status)}
      disabled={saving}
      className="text-sm border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s} className="capitalize">
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
}
