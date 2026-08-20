"use client";

import { useEffect, useState } from "react";
import { safeGet } from "@/lib/storage";
import { FormShell } from "@/components/form/FormShell";
import { LockedState } from "@/components/form/LockedState";

const SUBMITTED_KEY = "latent:submitted:v1";

interface SubmittedRecord {
  submissionId: string;
  at: string;
}

export default function ApplyPage() {
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState<SubmittedRecord | null>(null);

  useEffect(() => {
    // localStorage is unavailable during SSR; reading it here (rather than in a
    // lazy useState initializer) avoids a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocked(safeGet<SubmittedRecord>(SUBMITTED_KEY));
    setReady(true);
  }, []);

  return (
    <main className="mx-auto flex w-full flex-1 flex-col items-center justify-center px-6 py-16">
      {ready && (locked ? <LockedState submissionId={locked.submissionId} /> : <FormShell />)}
    </main>
  );
}
