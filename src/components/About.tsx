import Image from "next/image";
import type { Dictionary } from "@/i18n/get-dictionary";
import Reveal from "./Reveal";
import Parallax from "./Parallax";
import Watermark from "./Watermark";

export default function About({ dict }: { dict: Dictionary }) {
  return (
    <section
      id="about"
      className="relative overflow-hidden mx-auto max-w-[100rem] px-5 py-28 sm:px-10 sm:py-36 lg:px-16"
    >
      <Watermark text={dict.about.eyebrow} />

      <div className="relative">
      <Reveal>
        <p className="text-xs font-medium tracking-[0.3em] text-[var(--color-accent)]">
          {dict.about.eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-[var(--color-text)] sm:text-4xl">
          {dict.about.heading}
        </h2>
      </Reveal>

      <div className="mt-12 grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16">
        <Reveal>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
            <Parallax distance={48} className="absolute inset-x-0 -inset-y-[10%]">
              <Image
                src="/images/about/profile-v2.jpg"
                alt={dict.about.imageAlt}
                fill
                sizes="(min-width: 768px) 380px, 80vw"
                className="object-cover"
              />
            </Parallax>
          </div>
        </Reveal>

        <div className="space-y-5">
          {dict.about.paragraphs.map((paragraph, i) => (
            <Reveal key={i} delay={0.1 + i * 0.05}>
              <p className="text-balance leading-[1.85] text-[var(--color-text-muted)]">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
