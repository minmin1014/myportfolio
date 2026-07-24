"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const STARS = [
  { top: "18%", left: "20%", size: 2 },
  { top: "70%", left: "12%", size: 1.5 },
  { top: "30%", left: "45%", size: 1.5 },
  { top: "78%", left: "52%", size: 2 },
  { top: "15%", left: "72%", size: 1.5 },
  { top: "55%", left: "82%", size: 2 },
  { top: "85%", left: "30%", size: 1 },
  { top: "40%", left: "88%", size: 1 },
];

// Deterministic PRNG so server and client render the exact same particle
// layout (avoids hydration mismatches from Math.random()).
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Countless small stars, each scattering outward at its own angle/distance/speed,
// looping continuously (staggered) for as long as the parent is hovered.
const PARTICLE_COUNT = 36;
const rand = mulberry32(20260723);
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, () => {
  const angle = rand() * Math.PI * 2;
  const distance = 30 + rand() * 46;
  const dx = Math.cos(angle) * distance;
  const dy = Math.sin(angle) * distance;
  const size = 1 + rand() * 2;
  const duration = 900 + rand() * 900;
  const delay = rand() * 1800;
  return { dx, dy, size, duration, delay };
});

export function BackToPortfolioLink() {
  return (
    <Link
      href="/ja"
      className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-colors duration-300 hover:text-white"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-3 z-0 scale-75 rounded-[28px] opacity-0 blur-[2px] transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100 group-hover:blur-0 motion-reduce:scale-100 motion-reduce:blur-0 motion-reduce:transition-opacity motion-reduce:duration-200"
        style={{
          background:
            "radial-gradient(circle at 28% 25%, rgba(155,140,255,0.6), transparent 55%), radial-gradient(circle at 78% 70%, rgba(110,231,208,0.28), transparent 50%), radial-gradient(circle at 50% 50%, #0b0e1e, rgba(5,6,12,0.92) 75%, transparent 100%)",
        }}
      >
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white opacity-0 transition-opacity duration-500 group-hover:opacity-90"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
          />
        ))}
      </span>

      {/* Countless star particles that keep scattering outward while hovered */}
      <span
        aria-hidden
        className="particle-field pointer-events-none absolute left-6 top-1/2 z-[5] opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
      >
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="particle absolute rounded-full bg-white shadow-[0_0_4px_1px_rgba(155,140,255,0.8)]"
            style={
              {
                width: p.size,
                height: p.size,
                marginLeft: -p.size / 2,
                marginTop: -p.size / 2,
                "--tx": `${p.dx}px`,
                "--ty": `${p.dy}px`,
                animationDuration: `${p.duration}ms`,
                animationDelay: `${p.delay}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </span>

      <ArrowLeft size={18} className="relative z-10" />
      <span className="relative z-10">ポートフォリオに戻る</span>

      <style jsx>{`
        .particle {
          opacity: 0;
          transform: translate(0, 0) scale(0);
          animation-name: scatter;
          animation-timing-function: ease-out;
          animation-iteration-count: infinite;
          animation-play-state: paused;
        }
        :global(.group):hover .particle {
          animation-play-state: running;
        }
        @keyframes scatter {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          80% {
            opacity: 0.7;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </Link>
  );
}
