"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function FilterControl({ currentStatus }: { currentStatus: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const nextParams = new URLSearchParams(searchParams.toString());
    if (val === "all") {
      nextParams.delete("status");
    } else {
      nextParams.set("status", val);
    }
    router.push(`/export-pdf?${nextParams.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="pdf-status-filter" className="text-xs font-medium text-neutral-400">
        Filter Participants:
      </label>
      <select
        id="pdf-status-filter"
        value={currentStatus}
        onChange={handleStatusChange}
        className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-200 outline-none hover:border-neutral-600 focus:border-amber-500"
      >
        <option value="all">All Submissions</option>
        <option value="shortlist">Shortlisted Only</option>
        <option value="new">New Only</option>
        <option value="scheduled">Scheduled Only</option>
        <option value="done">Done Only</option>
      </select>
    </div>
  );
}
