"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";

const NAV_ITEMS: Array<{ key: keyof Dictionary["nav"]; href: string }> = [
  { key: "home", href: "#home" },
  { key: "about", href: "#about" },
  { key: "works", href: "#works" },
  { key: "skills", href: "#skills" },
  { key: "contact", href: "#contact" },
];

function setLocaleCookie(locale: Locale) {
  document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, bounce: 0, duration: 0.65 },
  },
};

export default function Header({
  dict,
  locale,
}: {
  dict: Dictionary;
  locale: Locale;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const otherLocale: Locale = locale === "ja" ? "en" : "ja";

  const toggleMenu = () => {
    const rect = menuButtonRef.current?.getBoundingClientRect();
    if (rect) {
      setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
    setMenuOpen((v) => !v);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const reveal = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
      }
    : {
        initial: { clipPath: `circle(0% at ${origin.x}px ${origin.y}px)` },
        animate: { clipPath: `circle(150% at ${origin.x}px ${origin.y}px)` },
        exit: { clipPath: `circle(0% at ${origin.x}px ${origin.y}px)` },
        transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-[background-color,backdrop-filter,border-color] duration-500 ease-[var(--ease-fluid)] ${
          scrolled || menuOpen
            ? "bg-[rgba(5,6,12,0.72)] backdrop-blur-xl border-b border-[var(--color-border)]"
            : "bg-transparent border-b border-transparent"
        }`}
        style={{ height: "var(--header-height)" }}
      >
        <div className="flex h-full items-center justify-between px-5 sm:px-8">
          <Link
            href="#home"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-semibold tracking-wide text-[var(--color-text)]"
          >
            石井拓実 <span className="text-[var(--color-text-faint)]">/</span>{" "}
            Takumi Ishii
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href={`/${otherLocale}`}
              onClick={() => setLocaleCookie(otherLocale)}
              aria-label={dict.nav.langSwitch}
              className="rounded-full border border-[var(--color-border-strong)] px-3 py-1.5 text-xs font-medium tracking-wide text-[var(--color-text-muted)] transition-all duration-300 hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
            >
              {locale === "ja" ? "EN" : "JP"}
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={toggleMenu}
              aria-label={menuOpen ? dict.nav.menuClose : dict.nav.menuOpen}
              aria-expanded={menuOpen}
              className="group flex items-center gap-3"
            >
              <span className="relative flex h-4 w-6 flex-col items-center justify-center">
                <span
                  className={`absolute h-px w-6 bg-[var(--color-text)] transition-transform duration-300 ease-[var(--ease-fluid)] ${
                    menuOpen ? "rotate-45" : "-translate-y-[5px]"
                  }`}
                />
                <span
                  className={`absolute h-px w-6 bg-[var(--color-text)] transition-transform duration-300 ease-[var(--ease-fluid)] ${
                    menuOpen ? "-rotate-45" : "translate-y-[5px]"
                  }`}
                />
              </span>
              <span className="text-xs font-medium tracking-[0.2em] text-[var(--color-text)]">
                {menuOpen ? "CLOSE" : "MENU"}
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            {...reveal}
            className="fixed inset-0 z-[55] bg-[rgba(5,6,10,0.98)] backdrop-blur-2xl"
          >
            <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-5 sm:px-8">
              <motion.nav
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3 sm:gap-4"
              >
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.key}
                    variants={itemVariants}
                    className="flex items-baseline gap-4 border-b border-[var(--color-border)] pb-3 sm:gap-6 sm:pb-4"
                  >
                    <span className="text-xs font-medium text-[var(--color-text-faint)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="text-4xl font-semibold tracking-[-0.02em] text-[var(--color-text)] transition-colors duration-300 ease-[var(--ease-fluid)] hover:text-[var(--color-accent)] sm:text-6xl"
                    >
                      {dict.nav[item.key]}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.15 + NAV_ITEMS.length * 0.06 }}
                className="mt-10 flex items-center gap-3 sm:mt-14"
              >
                <Link
                  href={`/${otherLocale}`}
                  onClick={() => {
                    setLocaleCookie(otherLocale);
                    setMenuOpen(false);
                  }}
                  className="rounded-full border border-[var(--color-border-strong)] px-5 py-2.5 text-sm font-medium tracking-wide text-[var(--color-text-muted)] transition-all duration-300 hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
                >
                  {locale === "ja" ? "English" : "日本語"}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
