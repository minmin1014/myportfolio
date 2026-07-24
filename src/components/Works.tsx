import type { Dictionary } from "@/i18n/get-dictionary";
import { works } from "@/data/works";
import WorkCard from "./WorkCard";
import Reveal from "./Reveal";

export default function Works({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="works"
      className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-5 py-28 sm:px-8 sm:py-36"
    >
      <div className="mx-auto max-w-6xl">
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

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          {works.map((work, i) => (
            <WorkCard key={work.id} work={work} dict={dict} delay={0.05 * i} />
          ))}
        </div>
      </div>
    </section>
  );
}
