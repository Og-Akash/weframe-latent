import { z } from "zod";
import { QUESTIONS, type Field } from "./questions";

const fieldSchema = (f: Field) => {
  switch (f.type) {
    case "number":
      return z.coerce
        .number({ error: "Required" })
        .int()
        .min(f.min ?? 0)
        .max(f.max ?? 999);
    case "currency":
      return z.coerce.number({ error: "Required" }).positive("Enter an amount");
    default:
      return z
        .string()
        .trim()
        .min(2, "Required")
        .max(f.max ?? 1000, `Keep it under ${f.max} characters`);
  }
};

// Object.fromEntries can't preserve literal key types, so the shape is
// hand-typed here. Keep this in sync with the field keys in questions.ts.
export interface FormValues {
  name: string;
  age: number;
  town: string;
  song: string;
  purchase: string;
  amount: number;
  q4: string;
  call3am: string;
  voicemail: string;
  q6: string;
  q7: string;
  timeWaster: string;
  efficient: string;
  q8Why: string;
}

export const fullSchema = z.object(
  Object.fromEntries(QUESTIONS.flatMap((q) => q.fields).map((f) => [f.key, fieldSchema(f)])),
) as unknown as z.ZodType<FormValues, FormValues>;

/** Field keys for one step — used to gate the Next button. */
export const stepKeys = (i: number) => QUESTIONS[i].fields.map((f) => f.key);
