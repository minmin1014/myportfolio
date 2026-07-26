"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { works } from "@/data/works";
import Reveal from "./Reveal";
import Watermark from "./Watermark";

const ROTATE_MS = 5000;

// Even staircase (lg+): the first card sits lowest (bottom-left) and each
// following card steps up by an equal amount to the last (top-right). Panels
// are the same size and butt together horizontally, so the leftover triangles
// — empty at the top-left and bottom-right — reveal the background photo.
// Even 9rem rise between adjacent cards (27 → 18 → 9 → 0). Larger so the
// bottom-left card drops toward the section's bottom-left corner and the
// top-right card climbs toward its top-right corner, opening big background
// triangles at the top-left and bottom-right.
const OFFSETS = ["lg:mt-[27rem]", "lg:mt-[18rem]", "lg:mt-[9rem]", "lg:mt-0"];

export default function Works({ dict }: { dict: Dictionary }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const count = works.length;
  const open = openIndex !== null;

  // Scroll-linked parallax for the background banner and watermark.
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["-10%", "10%"],
  );

  const closeModal = useCallback(() => setOpenIndex(null), []);

  // Modal: lock body scroll and close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, closeModal]);

  // Mobile carousel: swiping horizontally drives the active banner.
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const scrollToIndex = useCallback((i: number) => {
    const el = trackRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return; // only when scrollable
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    // Scroll only the carousel's own scrollLeft. Using scrollIntoView here would
    // also scroll the page vertically back to this section on every auto-advance.
    const elRect = el.getBoundingClientRect();
    const childRect = child.getBoundingClientRect();
    const target =
      el.scrollLeft +
      (childRect.left - elRect.left) -
      (el.clientWidth - childRect.width) / 2;
    el.scrollTo({ left: target, behavior: "smooth" });
  }, []);

  const handleTrackScroll = useCallback(() => {
    if (rafRef.current !== null) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      const el = trackRef.current;
      if (!el || el.scrollWidth <= el.clientWidth) return;
      const center = el.getBoundingClientRect().left + el.clientWidth / 2;
      let closest = 0;
      let min = Infinity;
      Array.from(el.children).forEach((child, i) => {
        const r = (child as HTMLElement).getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - center);
        if (d < min) {
          min = d;
          closest = i;
        }
      });
      setActive(closest);
    });
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  // Auto-rotate the banner, looping back to the first item. Paused on hover/focus
  // or while a modal is open. On phones this scrolls the carousel (which in turn
  // updates the active banner); on larger screens it crossfades the background.
  useEffect(() => {
    if (paused || open) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      const next = (activeRef.current + 1) % count;
      if (window.matchMedia("(min-width: 640px)").matches) {
        setActive(next);
      } else {
        scrollToIndex(next);
      }
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [paused, open, count, scrollToIndex]);

  const activeCopy = dict.works.items[works[active].id];

  return (
    <section
      ref={sectionRef}
      id="works"
      className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg)]"
    >
      {/* Background banner — crossfades with the active work, drifts on scroll */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-x-0 -top-[15%] h-[130%]"
        >
          {works.map((work, i) => (
            <div
              key={work.id}
              className="absolute inset-0 transition-opacity duration-[1200ms] ease-[var(--ease-fluid)]"
              style={{ opacity: i === active ? 1 : 0 }}
            >
              <Image
                src={work.image}
                alt=""
                fill
                priority={i === 0}
                sizes="100vw"
                className="scale-110 object-cover"
              />
            </div>
          ))}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/80 via-[var(--color-bg)]/55 to-[var(--color-bg)]/85" />
        <div className="absolute inset-0 bg-[var(--color-bg)]/15" />
      </div>

      <div className="relative mx-auto max-w-[100rem] px-5 pt-28 pb-12 sm:px-10 sm:pt-36 sm:pb-16 lg:px-16">
        {/* Giant watermark echoing the section title */}
        <Watermark text="WORKS" />

        <div className="relative">
          {/* Title block, kept above the raised right-column cards */}
          <div className="pointer-events-none relative z-20">
          <Reveal>
            <p className="text-xs font-medium tracking-[0.3em] text-[var(--color-accent)]">
              {dict.works.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-[var(--color-text)] sm:text-4xl">
              {dict.works.heading}
            </h2>
          </Reveal>

          {/* Active work title (large, changes with the background) */}
          <div className="mt-8 min-h-[3.5rem] max-w-4xl sm:min-h-[4rem]">
            <AnimatePresence mode="wait">
              <motion.p
                key={works[active].id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-xl font-medium leading-snug text-[var(--color-text)] sm:text-2xl"
              >
                {activeCopy.title}
              </motion.p>
            </AnimatePresence>
          </div>
          </div>

          {/* Scattered thumbnails — a swipe carousel on phones, a grid from sm up */}
          <div
            ref={trackRef}
            onScroll={handleTrackScroll}
            className="mt-16 -mx-5 flex items-stretch snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:snap-none sm:grid-cols-2 sm:items-start sm:gap-0 sm:overflow-visible sm:px-0 sm:pb-0 lg:-mt-[18rem] lg:grid-cols-4"
          >
            {works.map((work, i) => {
              const copy = dict.works.items[work.id];
              const isActive = i === active;
              return (
                <Reveal
                  key={work.id}
                  delay={0.05 * i}
                  className={`w-[80%] shrink-0 snap-center sm:w-auto sm:shrink ${OFFSETS[i % OFFSETS.length]}`}
                >
                  <button
                    type="button"
                    onMouseEnter={() => {
                      setActive(i);
                      setPaused(true);
                    }}
                    onMouseLeave={() => setPaused(false)}
                    onFocus={() => {
                      setActive(i);
                      setPaused(true);
                    }}
                    onBlur={() => setPaused(false)}
                    onClick={() => setOpenIndex(i)}
                    aria-label={copy.title}
                    className="group block h-full w-full focus:outline-none"
                  >
                    {/* Solid panels butt together with no gap; the vertical
                        stagger is what lets the backdrop show through the seams. */}
                    <div
                      className={`relative flex h-[22rem] flex-col bg-[var(--color-bg-card)] p-5 text-center transition-all duration-500 ease-[var(--ease-fluid)] sm:h-[26rem] lg:h-[30rem] ${
                        isActive
                          ? "z-10 scale-[1.015] shadow-[0_0_0_2px_var(--color-accent),0_28px_60px_-24px_rgba(0,0,0,0.9)]"
                          : ""
                      }`}
                    >
                      <div className="flex flex-1 flex-col items-center justify-center gap-5">
                        <div className="relative aspect-video w-full overflow-hidden rounded-md">
                          <Image
                            src={work.image}
                            alt={copy.imageAlt}
                            fill
                            sizes="(min-width: 1024px) 22vw, 45vw"
                            className="object-cover transition-transform duration-700 ease-[var(--ease-fluid)] group-hover:scale-105"
                          />
                        </div>
                        <h3 className="px-1 text-sm font-medium leading-snug text-[var(--color-text)] transition-colors group-hover:text-[var(--color-accent)]">
                          {copy.title}
                        </h3>
                      </div>
                      {/* Vertical-rule framed MORE, echoing the reference layout */}
                      <div className="flex flex-col items-center pt-6">
                        <span aria-hidden className="h-4 w-px bg-[var(--color-border-strong)]" />
                        <span className="my-2.5 text-[0.7rem] font-medium tracking-[0.25em] text-[var(--color-text-faint)] transition-colors group-hover:text-[var(--color-accent)]">
                          MORE
                        </span>
                        <span aria-hidden className="h-4 w-px bg-[var(--color-border-strong)]" />
                      </div>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>

          {/* Dots indicator — only meaningful for the mobile swipe carousel */}
          <div className="mt-10 flex items-center gap-3 sm:hidden">
            {works.map((work, i) => (
              <button
                key={work.id}
                type="button"
                onClick={() => {
                  setActive(i);
                  setPaused(true);
                  scrollToIndex(i);
                }}
                aria-label={`${dict.works.items[work.id].title}`}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all duration-500 ease-[var(--ease-fluid)] ${
                  i === active
                    ? "w-8 bg-[var(--color-accent)]"
                    : "w-2 bg-[var(--color-text)]/25 hover:bg-[var(--color-text)]/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {open && openIndex !== null && (
          <WorkModal
            work={works[openIndex]}
            copy={dict.works.items[works[openIndex].id]}
            linkLabel={dict.works.linkLabel}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function WorkModal({
  work,
  copy,
  linkLabel,
  onClose,
}: {
  work: (typeof works)[number];
  copy: Dictionary["works"]["items"][keyof Dictionary["works"]["items"]];
  linkLabel: string;
  onClose: () => void;
}) {
  const linkText =
    "linkText" in copy && copy.linkText ? copy.linkText : linkLabel;
  const isInternal = work.link?.startsWith("/");

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
    >
      <div className="absolute inset-0 bg-[var(--color-bg)]/80 backdrop-blur-sm" />
      <motion.div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-bg-card)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video w-full">
          <Image
            src={work.image}
            alt={copy.imageAlt}
            fill
            sizes="(min-width: 640px) 42rem, 100vw"
            className="object-cover"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg)]/70 text-[var(--color-text)] backdrop-blur transition-colors hover:bg-[var(--color-bg)]"
          >
            <span aria-hidden className="text-lg leading-none">
              ×
            </span>
          </button>
        </div>
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <h3 className="text-xl font-semibold tracking-[-0.01em] text-[var(--color-text)] sm:text-2xl">
            {copy.title}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
            {copy.description}
          </p>
          {work.link && (
            <a
              href={work.link}
              {...(!isInternal && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[#0b0e1e] transition-transform duration-300 ease-[var(--ease-fluid)] hover:translate-x-0.5"
            >
              {linkText}
              <span aria-hidden>→</span>
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
