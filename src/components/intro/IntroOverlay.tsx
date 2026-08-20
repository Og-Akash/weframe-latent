"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LogoMark } from "./LogoMark";
import { playShowIntroSting } from "@/lib/sound";

export function IntroOverlay() {
  const [show, setShow] = useState(false);
  const [reduced, setReduced] = useState(false);
  const stopSoundRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);
    setShow(true);

    if (!prefersReduced) {
      stopSoundRef.current = playShowIntroSting();
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const holdMs = prefersReduced ? 600 : 2800;
    const timer = setTimeout(() => {
      setShow(false);
    }, holdMs);

    return () => {
      clearTimeout(timer);
      if (stopSoundRef.current) {
        stopSoundRef.current();
      }
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleOverlayClick = () => {
    if (!reduced) {
      if (stopSoundRef.current) stopSoundRef.current();
      stopSoundRef.current = playShowIntroSting();
    }
  };

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
      }}
    >
      {show && (
        <motion.div
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center bg-background px-6 backdrop-blur-md"
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
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,178,8,0.18)_0%,transparent_65%)]" />

          <div className="relative flex flex-col items-center w-full max-w-md sm:max-w-xl md:max-w-2xl px-4">
            <LogoMark animate={!reduced} className="w-full" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
