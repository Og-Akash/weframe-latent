"use client";

import type { UseFormReturn } from "react-hook-form";
import { PencilSimpleIcon } from "@phosphor-icons/react";
import { QUESTIONS } from "@/lib/questions";
import type { FormValues } from "@/lib/schema";
import { Button } from "@/components/ui/button";

export function ReviewStep({
  form,
  onJump,
}: {
  form: UseFormReturn<FormValues>;
  onJump: (step: number) => void;
}) {
  const values = form.getValues();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2
          tabIndex={-1}
          className="font-heading text-3xl font-semibold leading-tight outline-none sm:text-4xl"
        >
          Look it over.
        </h2>
        <p className="mt-2 text-muted-foreground">Last chance to change your mind.</p>
      </div>

      <div className="flex flex-col divide-y divide-border rounded-2xl border border-border">
        {QUESTIONS.map((q, i) => (
          <div key={q.id} className="flex items-start justify-between gap-4 px-5 py-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {q.prompt}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {q.fields.map((f) => (
                  <span key={f.key}>
                    {f.label ? `${f.label}: ` : ""}
                    <span className="font-medium text-foreground">
                      {String(values[f.key as keyof FormValues] ?? "—")}
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onJump(i)}
              aria-label={`Edit answer for: ${q.prompt}`}
            >
              <PencilSimpleIcon />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
