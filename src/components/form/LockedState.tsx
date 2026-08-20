"use client";

import Link from "next/link";
import { LockSimpleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function LockedState({ submissionId }: { submissionId: string }) {
  return (
    <div className="flex flex-col items-center gap-5 py-8 text-center">
      <LockSimpleIcon className="size-12 text-gold" />
      <div>
        <h2 tabIndex={-1} className="font-heading text-3xl font-semibold outline-none sm:text-4xl">
          You&apos;ve already applied.
        </h2>
        <p className="mt-2 text-muted-foreground">One shot per person — that&apos;s the format.</p>
      </div>
      <p className="rounded-full border border-border bg-muted px-4 py-1.5 font-mono text-sm tracking-wider">
        {submissionId}
      </p>
      <Button render={<Link href="/" />} variant="outline" className="mt-2">
        Back home
      </Button>
    </div>
  );
}
