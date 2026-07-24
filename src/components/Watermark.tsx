"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";

type WatermarkProps = {
  text: string;
  /** Positioning + size utility classes (overrides the default corner). */
  className?: string;
  /** Total vertical drift in px across the section's time on screen. */
  distance?: number;
};

export default function Watermark({
  text,
  className = "-top-4 left-3 text-[22vw] sm:text-[16rem]",
  distance = 120,
}: WatermarkProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [distance / 2, -distance / 2],
  );

  return (
    <motion.span
      ref={ref}
      aria-hidden
      style={{ y }}
      className={`pointer-events-none absolute select-none font-bold leading-none tracking-tight text-[var(--color-text)]/[0.04] ${className}`}
    >
      {text}
    </motion.span>
  );
}
