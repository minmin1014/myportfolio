import Image from "next/image";
import type { WorkEntry } from "@/data/works";
import type { Dictionary } from "@/i18n/get-dictionary";
import Reveal from "./Reveal";

export default function WorkCard({
  work,
  dict,
  delay,
}: {
  work: WorkEntry;
  dict: Dictionary;
  delay: number;
}) {
  const copy = dict.works.items[work.id];
  const linkText = "linkText" in copy && copy.linkText ? copy.linkText : dict.works.linkLabel;

  const card = (
    <div className="group h-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] transition-colors duration-300 hover:border-[var(--color-border-strong)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={work.image}
          alt={copy.imageAlt}
          fill
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="object-cover transition-transform duration-700 ease-[var(--ease-fluid)] group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-3 p-6 sm:p-7">
        <h3 className="text-lg font-semibold tracking-[-0.01em] text-[var(--color-text)]">
          {copy.title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          {copy.description}
        </p>
        {work.link && (
          <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)]">
            {linkText}
            <span
              aria-hidden
              className="transition-transform duration-300 ease-[var(--ease-fluid)] group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        )}
      </div>
    </div>
  );

  const isInternal = work.link?.startsWith("/");

  return (
    <Reveal delay={delay} className="h-full">
      {work.link ? (
        <a
          href={work.link}
          className="block h-full"
          {...(!isInternal && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {card}
        </a>
      ) : (
        card
      )}
    </Reveal>
  );
}
