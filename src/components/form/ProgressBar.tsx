"use client";

import { motion } from "motion/react";
import { TOTAL_QUESTIONS } from "@/lib/questions";

export function ProgressBar({ step }: { step: number }) {
  const current = Math.min(step + 1, TOTAL_QUESTIONS);
  const pct = (Math.min(step, TOTAL_QUESTIONS) / TOTAL_QUESTIONS) * 100;

  return (
    <div className="w-full">
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={TOTAL_QUESTIONS}
        aria-label="Progress"
        className="h-1 w-full overflow-hidden rounded-full bg-muted"
      >
        <motion.div
          className="h-full rounded-full bg-gold"
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      <p aria-live="polite" className="mt-2 text-xs text-muted-foreground">
        {step < TOTAL_QUESTIONS ? `${current} of ${TOTAL_QUESTIONS}` : "Review"}
      </p>
    </div>
  );
}
