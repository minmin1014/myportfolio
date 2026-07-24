"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import type { Dictionary } from "@/i18n/get-dictionary";

export default function Hero({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "22%"],
  );
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, 60],
  );

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex h-[100svh] min-h-[560px] w-full items-center justify-center overflow-hidden"
    >
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <Image
          src="/images/hero/hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(5,6,12,0.35)] via-[rgba(5,6,12,0.35)] to-[var(--color-bg)]" />
      </motion.div>

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="flex flex-col items-center gap-1 text-4xl font-semibold tracking-[-0.02em] text-[var(--color-text)] sm:flex-row sm:gap-3 sm:text-6xl"
        >
          <span className="whitespace-nowrap">{dict.hero.name}</span>
          <span className="hidden text-[var(--color-text-faint)] font-normal sm:inline">
            /
          </span>
          <span className="whitespace-nowrap">{dict.hero.nameEn}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.36 }}
          className="mt-6 text-balance text-lg font-medium text-[var(--color-text-muted)] sm:text-2xl"
        >
          {dict.hero.catchphrase}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] font-medium tracking-[0.3em] text-[var(--color-text-faint)]">
          {dict.hero.scrollHint}
        </span>
        <motion.span
          className="h-9 w-px bg-gradient-to-b from-[var(--color-text-faint)] to-transparent"
          animate={prefersReducedMotion ? {} : { scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />
      </motion.div>
    </section>
  );
}
