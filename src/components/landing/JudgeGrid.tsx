"use client";

import { motion, type Variants } from "motion/react";
import { JudgeCard, type Judge } from "./JudgeCard";

const JUDGES: Judge[] = [
  {
    name: "Durgesh",
    role: "Host",
    note: "Reads every answer out loud with zero filter and maximum dramatic effect.",
  },
  {
    name: "Akash",
    role: "Co-Host",
    note: "Spotter of subtle blunders. Never lets an embarrassing detail slip by.",
  },
  {
    name: "Ankita",
    role: "Judge",
    note: "Rates the most unhinged choices with brutal, unapologetic honesty.",
  },
  {
    name: "Bishen",
    role: "Judge",
    note: "Hurls real feedback before the 3-minute timer even gets close.",
  },
  {
    name: "Sambit",
    role: "Judge",
    note: "Maintains the official points. The scoring math is highly questionable.",
  },
  {
    name: "Vipul",
    role: "Judge",
    note: "Delivers unexpected 10s and unprovoked reality checks.",
  },
];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export function JudgeGrid() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <h2 className="font-heading text-3xl font-semibold sm:text-4xl">On the panel</h2>
        <p className="mt-2 text-base text-muted-foreground">
          Whoever&apos;s hosting the call will be reading these back — live.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={container}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {JUDGES.map((judge) => (
          <motion.div key={judge.name} variants={item}>
            <JudgeCard judge={judge} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
