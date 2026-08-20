"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/intro/LogoMark";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  return (
    <section className="relative flex flex-col items-center gap-8 px-6 pt-20 pb-16 text-center sm:pt-28">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="flex flex-col items-center gap-6"
      >
        <motion.h1
          variants={word}
          className="w-full max-w-sm sm:max-w-md md:max-w-lg flex justify-center"
        >
          <span className="sr-only">WeFrame&apos;s Got Latent</span>
          <LogoMark animate={true} className="w-full" />
        </motion.h1>

        <motion.p
          variants={word}
          className="max-w-md text-balance text-base text-muted-foreground sm:text-lg"
        >
          Eight questions. Three minutes. No resume required just the most
          embarrassing truths your team will read out loud on the call.
        </motion.p>

        <motion.div variants={word}>
          <Button
            size="xl"
            className="gap-2.5 px-8 shadow-xl shadow-gold/25"
            render={<Link href="/apply" />}
          >
            Take the stage
            <ArrowRightIcon className="size-5" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
