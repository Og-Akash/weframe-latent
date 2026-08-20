"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { ArrowLeftIcon, ArrowRightIcon, SpinnerIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/lib/questions";
import { fullSchema, stepKeys, type FormValues } from "@/lib/schema";
import { safeGet, safeRemove, safeSet } from "@/lib/storage";
import { fireConfetti } from "@/components/fx/fireConfetti";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { QuestionStep } from "./QuestionStep";
import { ReviewStep } from "./ReviewStep";
import { SuccessScreen } from "./SuccessScreen";

const DRAFT_KEY = "latent:draft:v1";
const SUBMITTED_KEY = "latent:submitted:v1";
const DRAFT_TTL_MS = 48 * 60 * 60 * 1000;

interface Draft {
  answers: Partial<FormValues>;
  step: number;
  startedAt: number;
}

type Status = "idle" | "submitting" | "error" | "success";

const emptyDefaults = Object.fromEntries(
  QUESTIONS.flatMap((q) => q.fields).map((f) => [f.key, ""]),
) as unknown as FormValues;

const slide: Variants = {
  enter: (dir: 1 | -1) => ({ x: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: 1 | -1) => ({ x: dir > 0 ? -48 : 48, opacity: 0 }),
};

export function FormShell() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [status, setStatus] = useState<Status>("idle");
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [resumeBanner, setResumeBanner] = useState(false);
  const startedAtRef = useRef<number>(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(fullSchema),
    mode: "onChange",
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    const draft = safeGet<Draft>(DRAFT_KEY);
    if (draft && Date.now() - draft.startedAt < DRAFT_TTL_MS) {
      form.reset({ ...emptyDefaults, ...draft.answers });
      setStep(Math.min(draft.step, TOTAL_QUESTIONS));
      startedAtRef.current = draft.startedAt;
      setResumeBanner(true);
    } else if (draft) {
      safeRemove(DRAFT_KEY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const sub = form.watch((values) => {
      const t = setTimeout(() => {
        safeSet(DRAFT_KEY, { answers: values, step, startedAt: startedAtRef.current });
      }, 400);
      return () => clearTimeout(t);
    });
    return () => sub.unsubscribe();
  }, [form, step]);

  useEffect(() => {
    if (status !== "success") headingRef.current?.focus();
  }, [step, status]);

  const isReview = step === TOTAL_QUESTIONS;

  const goNext = async () => {
    if (!isReview) {
      const valid = await form.trigger(stepKeys(step) as (keyof FormValues)[]);
      if (!valid) return;
      setDirection(1);
      setStep((s) => Math.min(s + 1, TOTAL_QUESTIONS));
      return;
    }
    await onSubmit();
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const jumpTo = (i: number) => {
    setDirection(i > step ? 1 : -1);
    setStep(i);
  };

  const startOver = () => {
    safeRemove(DRAFT_KEY);
    form.reset(emptyDefaults);
    startedAtRef.current = Date.now();
    setStep(0);
    setResumeBanner(false);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          timeTakenSec: Math.round((Date.now() - startedAtRef.current) / 1000),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        toast.error(data.error ?? "Could not save. Try again.");
        return;
      }
      safeRemove(DRAFT_KEY);
      safeSet(SUBMITTED_KEY, { submissionId: data.submissionId, at: new Date().toISOString() });
      setSubmissionId(data.submissionId);
      setStatus("success");
      void fireConfetti();
    } catch {
      setStatus("error");
      toast.error("Network error. Try again.");
    }
  });

  if (status === "success" && submissionId) {
    return <SuccessScreen submissionId={submissionId} />;
  }

  const question = !isReview ? QUESTIONS[step] : null;

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <ProgressBar step={step} />

      {resumeBanner && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted px-4 py-2.5 text-sm">
          <span className="text-muted-foreground">Picked up where you left off</span>
          <button
            type="button"
            onClick={startOver}
            className="font-medium text-gold underline-offset-4 hover:underline"
          >
            Start over
          </button>
        </div>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {question ? (
            <QuestionStep ref={headingRef} question={question} form={form} onEnter={goNext} />
          ) : (
            <ReviewStep form={form} onJump={jumpTo} />
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/40">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={goBack}
          disabled={step === 0 || status === "submitting"}
          className="gap-2 px-6"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </Button>

        <Button
          type="button"
          size="lg"
          onClick={goNext}
          disabled={status === "submitting"}
          className="gap-2 px-8 min-w-[130px]"
        >
          {status === "submitting" ? (
            <>
              <SpinnerIcon className="size-5 animate-spin" />
              Saving…
            </>
          ) : isReview ? (
            "Submit Answers"
          ) : (
            <>
              Next Step
              <ArrowRightIcon className="size-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
