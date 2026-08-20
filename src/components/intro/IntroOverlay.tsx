"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LogoMark } from "./LogoMark";

const SEEN_KEY = "latent:introSeen";

export function IntroOverlay() {
  const [show, setShow] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);

    if (seen) return;

    setShow(true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const holdMs = prefersReduced ? 600 : 1800;
    const timer = setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* noop */
      }
    }, holdMs);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
      }}
    >
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background px-6 backdrop-blur-md"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={
            reduced
              ? { opacity: 0, transition: { duration: 0.4, ease: "easeOut" } }
              : {
                  y: "-100%",
                  scale: 0.96,
                  opacity: 0.9,
                  transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
                }
          }
        >
          {/* Subtle stage spotlight effect behind logo overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,178,8,0.12)_0%,transparent_65%)]" />

          <div className="relative w-full max-w-sm sm:max-w-md">
            <LogoMark animate={!reduced} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
