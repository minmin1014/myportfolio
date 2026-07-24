import type { Dictionary } from "@/i18n/get-dictionary";
import { skills } from "@/data/skills";
import Reveal from "./Reveal";
import Watermark from "./Watermark";

function SkillGroup({
  heading,
  items,
  delayOffset,
}: {
  heading: string;
  items: readonly string[];
  delayOffset: number;
}) {
  return (
    <div>
      <Reveal delay={delayOffset}>
        <h3 className="text-sm font-medium tracking-[0.08em] text-[var(--color-text-muted)]">
          {heading}
        </h3>
      </Reveal>
      <div className="mt-5 flex flex-wrap gap-3">
        {items.map((item, i) => (
          <Reveal key={item} delay={delayOffset + 0.02 * (i + 1)} y={12}>
            <span className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg-card)] px-5 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition-all duration-300 ease-[var(--ease-fluid)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]">
              {item}
            </span>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function Skills({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="skills"
      className="relative overflow-hidden mx-auto max-w-[100rem] px-5 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      <Watermark text={dict.skills.eyebrow} />

      <div className="relative">
      <Reveal>
        <p className="text-xs font-medium tracking-[0.3em] text-[var(--color-accent)]">
          {dict.skills.eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-[var(--color-text)] sm:text-4xl">
          {dict.skills.heading}
        </h2>
      </Reveal>

      <div className="mt-12 max-w-5xl space-y-12">
        <SkillGroup
          heading={dict.skills.programmingHeading}
          items={skills}
          delayOffset={0.1}
        />
        <SkillGroup
          heading={dict.skills.creativeHeading}
          items={dict.skills.creativeItems}
          delayOffset={0.15}
        />
        <SkillGroup
          heading={dict.skills.choralHeading}
          items={dict.skills.choralItems}
          delayOffset={0.2}
        />
      </div>
      </div>
    </section>
  );
}
