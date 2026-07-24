"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import Reveal from "./Reveal";

type Status = "idle" | "submitting" | "success" | "error" | "rate_limited";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact({ dict }: { dict: Dictionary }) {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const subjectOptions = Object.entries(dict.contact.subjectOptions);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subjectKey = String(data.get("subject") ?? "general");
    const message = String(data.get("message") ?? "").trim();
    const company = String(data.get("company") ?? "");

    if (!name || !email || !message) {
      setFieldError(dict.contact.requiredError);
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setFieldError(dict.contact.emailInvalid);
      return;
    }

    setStatus("submitting");
    try {
      const subjectLabel =
        dict.contact.subjectOptions[
          subjectKey as keyof typeof dict.contact.subjectOptions
        ] ?? subjectKey;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: subjectLabel,
          message,
          company,
        }),
      });

      if (res.status === 429) {
        setStatus("rate_limited");
        return;
      }
      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      <div className="mx-auto max-w-[100rem]">
        <div className="max-w-2xl">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.3em] text-[var(--color-accent)]">
            {dict.contact.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-[var(--color-text)] sm:text-4xl">
            {dict.contact.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-[var(--color-text-muted)]">
            {dict.contact.description}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <form onSubmit={handleSubmit} className="mt-10 space-y-6" noValidate>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
            >
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]"
              >
                {dict.contact.nameLabel}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder={dict.contact.namePlaceholder}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3 text-[var(--color-text)] outline-none transition-colors duration-200 placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]"
              >
                {dict.contact.emailLabel}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder={dict.contact.emailPlaceholder}
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3 text-[var(--color-text)] outline-none transition-colors duration-200 placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]"
              >
                {dict.contact.subjectLabel}
              </label>
              <select
                id="subject"
                name="subject"
                defaultValue="general"
                className="w-full appearance-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3 text-[var(--color-text)] outline-none transition-colors duration-200 focus:border-[var(--color-accent)]"
              >
                {subjectOptions.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-[var(--color-text-muted)]"
              >
                {dict.contact.messageLabel}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                placeholder={dict.contact.messagePlaceholder}
                className="w-full resize-none rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3 text-[var(--color-text)] outline-none transition-colors duration-200 placeholder:text-[var(--color-text-faint)] focus:border-[var(--color-accent)]"
              />
            </div>

            {fieldError && (
              <p className="text-sm text-red-400">{fieldError}</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-full bg-[var(--color-accent)] px-6 py-3.5 text-sm font-semibold text-[#0b0e1e] transition-all duration-300 ease-[var(--ease-fluid)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
            >
              {status === "submitting" ? dict.contact.submitting : dict.contact.submit}
            </button>

            {status === "success" && (
              <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-300">
                <p className="font-medium">{dict.contact.successTitle}</p>
                <p className="mt-1 text-emerald-300/80">{dict.contact.successBody}</p>
              </div>
            )}
            {status === "error" && (
              <div className="rounded-lg border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-300">
                <p className="font-medium">{dict.contact.errorTitle}</p>
                <p className="mt-1 text-red-300/80">{dict.contact.errorBody}</p>
              </div>
            )}
            {status === "rate_limited" && (
              <div className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-300">
                <p>{dict.contact.rateLimitBody}</p>
              </div>
            )}
          </form>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
