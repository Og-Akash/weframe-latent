"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export function SuccessScreen({ submissionId }: { submissionId: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-5 py-8 text-center"
    >
      <CheckCircleIcon className="size-14 text-gold" weight="fill" />
      <div>
        <h2 tabIndex={-1} className="font-heading text-3xl font-semibold outline-none sm:text-4xl">
          You&apos;re in.
        </h2>
        <p className="mt-2 text-muted-foreground">
          Your answers are saved. We&apos;ll read them out on the call.
        </p>
      </div>
      <p className="rounded-full border border-border bg-muted px-4 py-1.5 font-mono text-sm tracking-wider">
        {submissionId}
      </p>
      <Button render={<Link href="/" />} variant="outline" className="mt-2">
        Back home
      </Button>
    </motion.div>
  );
}
