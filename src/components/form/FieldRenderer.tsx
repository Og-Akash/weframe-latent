"use client";

import type { UseFormReturn } from "react-hook-form";
import type { Field } from "@/lib/questions";
import type { FormValues } from "@/lib/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function FieldRenderer({
  field,
  form,
  autoFocus,
}: {
  field: Field;
  form: UseFormReturn<FormValues>;
  autoFocus?: boolean;
}) {
  const key = field.key as keyof FormValues;
  const error = form.formState.errors[key];
  const describedBy =
    [field.help && `${field.key}-help`, error && `${field.key}-error`].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex flex-col gap-1.5 text-left">
      {field.label && (
        <Label htmlFor={field.key} className="text-sm font-medium">
          {field.label}
        </Label>
      )}

      {field.type === "textarea" ? (
        <Textarea
          id={field.key}
          rows={field.rows ?? 4}
          placeholder={field.placeholder}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          autoFocus={autoFocus}
          className="text-base"
          {...form.register(key)}
        />
      ) : field.type === "currency" ? (
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            ₹
          </span>
          <Input
            id={field.key}
            type="number"
            inputMode="decimal"
            placeholder={field.placeholder ?? "0"}
            aria-invalid={!!error}
            aria-describedby={describedBy}
            autoFocus={autoFocus}
            className="h-11 pl-7 text-base"
            {...form.register(key)}
          />
        </div>
      ) : (
        <Input
          id={field.key}
          type={field.type === "number" ? "number" : "text"}
          inputMode={field.type === "number" ? "numeric" : undefined}
          placeholder={field.placeholder}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          autoFocus={autoFocus}
          className="h-11 text-base"
          {...form.register(key)}
        />
      )}

      {field.help && !error && (
        <p id={`${field.key}-help`} className="text-xs text-muted-foreground">
          {field.help}
        </p>
      )}
      {error && (
        <p id={`${field.key}-error`} className="text-xs text-destructive" role="alert">
          {String(error.message ?? "Required")}
        </p>
      )}
    </div>
  );
}
