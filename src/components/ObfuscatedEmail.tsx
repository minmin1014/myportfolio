"use client";

import { useEffect, useRef } from "react";

const USER = "contact";
const DOMAIN = "minforge.dev";

export default function ObfuscatedEmail({ className }: { className?: string }) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (linkRef.current) linkRef.current.href = `mailto:${USER}@${DOMAIN}`;
  }, []);

  return (
    <a
      ref={linkRef}
      className={
        className ??
        "font-medium text-[var(--color-text)] transition-colors duration-200 hover:text-[var(--color-accent)]"
      }
    >
      {USER}
      <span aria-hidden>&nbsp;[at]&nbsp;</span>
      {DOMAIN}
    </a>
  );
}
