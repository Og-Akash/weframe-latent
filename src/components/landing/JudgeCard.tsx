"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export interface Judge {
  name: string;
  role: string;
  note: string;
}

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const spring = { stiffness: 260, damping: 20, mass: 0.4 };
  const rotateX = useSpring(useTransform(y, [0, 1], [8, -8]), spring);
  const rotateY = useSpring(useTransform(x, [0, 1], [-8, 8]), spring);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const onMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return { ref, rotateX, rotateY, onMouseMove, onMouseLeave };
}

export function JudgeCard({ judge }: { judge: Judge }) {
  const { ref, rotateX, rotateY, onMouseMove, onMouseLeave } = useTilt();
  const initials = judge.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 700 }}
      whileHover={{ scale: 1.03 }}
      className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-8 text-center shadow-sm"
    >
      <Avatar initials={initials} />
      <div>
        <p className="font-heading text-lg font-medium">{judge.name}</p>
        <p className="text-xs/relaxed uppercase tracking-wide text-gold">{judge.role}</p>
      </div>
      <p className="text-sm text-muted-foreground">{judge.note}</p>
    </motion.div>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div
      className="flex size-16 items-center justify-center rounded-full font-heading text-xl font-semibold text-primary-foreground"
      style={{
        background: "linear-gradient(155deg, var(--gold-soft), var(--gold) 55%, var(--gold-dim))",
      }}
    >
      {initials}
    </div>
  );
}
