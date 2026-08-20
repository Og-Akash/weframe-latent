"use client";

import { forwardRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { Question } from "@/lib/questions";
import type { FormValues } from "@/lib/schema";
import { FieldRenderer } from "./FieldRenderer";

interface QuestionStepProps {
  question: Question;
  form: UseFormReturn<FormValues>;
  onEnter: () => void;
}

export const QuestionStep = forwardRef<HTMLHeadingElement, QuestionStepProps>(function QuestionStep(
  { question, form, onEnter },
  ref,
) {
  return (
    <div
      onKeyDown={(e) => {
        // Enter advances the step; Shift+Enter still inserts a newline in textareas.
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          onEnter();
        }
      }}
      className="flex flex-col gap-8"
    >
      <div>
        <h2
          ref={ref}
          tabIndex={-1}
          className="font-heading text-3xl font-semibold leading-tight outline-none sm:text-4xl"
        >
          {question.prompt}
        </h2>
        {question.sub && <p className="mt-2 text-muted-foreground">{question.sub}</p>}
      </div>
      <div className="flex flex-col gap-5">
        {question.fields.map((f, i) => (
          <FieldRenderer key={f.key} field={f} form={form} autoFocus={i === 0} />
        ))}
      </div>
    </div>
  );
});
