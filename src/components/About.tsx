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
                {renderProse(paragraph)}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Poetic closing — centered and emphasized, set apart from the prose */}
      <div
        className="mt-20 flex flex-col items-center gap-16 text-center sm:mt-28"
        style={{ fontFamily: "var(--font-brush), var(--font-noto-jp), serif" }}
      >
        {dict.about.closing.map((stanza, i) => (
          <Reveal key={stanza.word} delay={0.05 * i}>
            <p className="text-4xl text-[var(--color-text)] sm:text-6xl">
              <span className="relative isolate inline-block px-2 pb-3">
                <BrushStroke
                  color={HIGHLIGHT[stanza.accent] ?? "var(--color-accent)"}
                />
                {stanza.word}
              </span>
            </p>
            <p className="mt-8 text-lg leading-[1.9] text-[var(--color-text-muted)] [word-break:auto-phrase] sm:text-2xl">
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

// Brush swipe drawn as a thick, tapered ink stroke on a shallow rise from
// lower-left to upper-right. It sits BEHIND the glyphs (-z-10) and is raised so
// it overlaps the lower portion of the characters, the way a broad brush is
// dragged across the text. A faint offset copy adds the dry-brush layering.
// Rendered as a filled shape so the calligraphic thick/thin contrast reads.
function BrushStroke({ color }: { color: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 64"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-1 -z-10 h-[0.9em] w-full overflow-visible"
      fill={color}
    >
      <path
        d="M4 40 C62 33, 130 26, 196 19 C198 25, 196 30, 190 31 C128 42, 66 51, 12 57 C7 57, 2 49, 4 40 Z"
        opacity={0.88}
      />
      <path
        d="M9 44 C70 37, 134 30, 194 24 C170 34, 98 46, 20 58 C14 59, 8 52, 9 44 Z"
        opacity={0.38}
      />
    </svg>
  );
}

// Compound terms and proper nouns that must never break across lines.
const NO_BREAK = [
  "情報システム部門長",
  "関西学院グリークラブ",
  "関西学院大学",
  "コンピューターサイエンス",
  "パートリーダー",
  "男声合唱団",
];

const NO_BREAK_RE = new RegExp(`(${NO_BREAK.join("|")})`, "g");

function renderProse(text: string) {
  return text.split(NO_BREAK_RE).map((part, i) =>
    NO_BREAK.includes(part) ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}
