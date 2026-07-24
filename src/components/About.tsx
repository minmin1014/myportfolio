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

      <div className="mt-12 grid max-w-[82rem] grid-cols-1 gap-10 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] md:gap-14">
        <Reveal className="md:h-full">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-card)] md:mx-0 md:aspect-auto md:h-full md:min-h-[26rem] md:max-w-none">
            <Parallax distance={48} className="absolute inset-x-0 -inset-y-[10%]">
              <Image
                src="/images/about/profile-v2.jpg"
                alt={dict.about.imageAlt}
                fill
                sizes="(min-width: 768px) 360px, 80vw"
                className="object-cover"
              />
            </Parallax>
          </div>
        </Reveal>

        <div className="space-y-5">
          {dict.about.paragraphs.map((paragraph, i) => (
            <Reveal key={i} delay={0.1 + i * 0.05}>
              <p className="whitespace-pre-line leading-[1.9] text-[var(--color-text-muted)] [word-break:auto-phrase]">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Poetic closing — centered and emphasized, set apart from the prose */}
      <div className="mt-20 flex flex-col items-center gap-16 text-center sm:mt-28">
        {dict.about.closing.map((stanza, i) => (
          <Reveal key={stanza.word} delay={0.05 * i}>
            <p className="text-4xl font-semibold tracking-tight text-[var(--color-text)] sm:text-6xl">
              <span className="relative inline-block">
                {stanza.word}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-2 h-[0.26em] rounded-full"
                  style={{
                    backgroundColor: HIGHLIGHT[stanza.accent] ?? "var(--color-accent)",
                    opacity: 0.6,
                  }}
                />
              </span>
            </p>
            <p className="mt-7 text-lg text-[var(--color-text-muted)] [word-break:auto-phrase] sm:text-2xl">
              {stanza.line}
            </p>
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}

const HIGHLIGHT: Record<string, string> = {
  sing: "#f5c451",
  create: "#5aa2ff",
};
