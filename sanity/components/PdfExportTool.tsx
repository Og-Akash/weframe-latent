"use client";

import { useState } from "react";

export function PdfExportTool() {
  const [status, setStatus] = useState("all");

  const handleExport = () => {
    const url = status === "all" ? "/export-pdf" : `/export-pdf?status=${status}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex min-h-full items-center justify-center p-8 bg-neutral-900 text-neutral-100">
      <div className="w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-950 p-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📄</span>
          <h2 className="text-2xl font-bold text-white">Export Participants to PDF</h2>
        </div>

        <p className="mt-3 text-sm text-neutral-400">
          Export all participant submissions into a clean, print-formatted PDF booklet. All 8 website questions are rendered in full text alongside each participant&apos;s complete answers.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <label htmlFor="sanity-pdf-status-filter" className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Filter by Submission Status
          </label>
          <select
            id="sanity-pdf-status-filter"
            value={status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm font-medium text-white outline-none focus:border-amber-500"
          >
            <option value="all">All Submissions</option>
            <option value="shortlist">Shortlisted Only</option>
            <option value="new">New Only</option>
            <option value="scheduled">Scheduled Only</option>
            <option value="done">Done Only</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="mt-6 w-full rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-neutral-950 shadow-lg transition-all hover:bg-amber-400 active:scale-98"
        >
          Open PDF Export Booklet 🖨️
        </button>
      </div>
    </div>
  );
}
