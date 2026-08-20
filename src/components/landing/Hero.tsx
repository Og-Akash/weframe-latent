"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { TOTAL_QUESTIONS } from "@/lib/questions";

const title = "Latent";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function Hero() {
  return (
    <section className="relative flex flex-col items-center gap-8 px-6 pt-28 pb-20 text-center sm:pt-36">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="flex flex-col items-center gap-6"
      >
        <motion.span
          variants={word}
          className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs/relaxed font-medium tracking-wide text-gold uppercase"
        >
          Fun-Friday · {TOTAL_QUESTIONS} questions
        </motion.span>

        <motion.h1
          variants={container}
          className="font-heading text-6xl font-semibold tracking-tight sm:text-8xl"
        >
          {title.split("").map((ch, i) => (
            <motion.span key={i} variants={word} className="inline-block">
              {ch}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          variants={word}
          className="max-w-md text-balance text-base text-muted-foreground sm:text-lg"
        >
          Eight questions. Three minutes. No résumé required — just the most
          embarrassing truths your team will read out loud on the call.
        </motion.p>

        <motion.div variants={word}>
          <Button size="xl" className="gap-2.5 px-8 shadow-xl shadow-gold/25" render={<Link href="/apply" />}>
            Take the stage
            <ArrowRightIcon className="size-5" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
