"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";
import { useScrollStore } from "@/store/use-scroll-store";

/*
 * A hand-drawn timeline ruler pinned to the bottom of the viewport (desktop). Scrolling the page
 * scrubs through time: the left edge of the site is Jul 2019, the right edge is today.
 */

const START = 2019 + 6 / 12; // Jul 2019 — first job
const END = 2026 + 9.7 / 12; // Oct 2026 — today
const FROM = 2019;
const TO = 2027.5;
// Wide enough that the 2026 product launches (a month or two apart) get their own labels.
const PX_PER_YEAR = 900;
const H = 104;
const BASE = 62; // baseline y inside the strip
const W = (TO - FROM) * PX_PER_YEAR;

const x = (year: number) => (year - FROM) * PX_PER_YEAR;

type Milestone = {
  at: number;
  date: string;
  text: string;
  tone?: "clay" | "mineral" | "plum";
  /** Products get a diamond marker; roles and moments get a dot. */
  kind?: "role" | "product";
};

// Websites fill the early years; from 2022 on, the timeline is applications only.
const MILESTONES: Milestone[] = [
  { at: 2019 + 6 / 12, date: "Jul 2019", text: "first job — Cetpa Infotech", tone: "mineral" },
  {
    at: 2019 + 9 / 12,
    date: "Oct 2019",
    text: "Cetpa Infotech website",
    tone: "plum",
    kind: "product",
  },
  { at: 2020, date: "Jan 2020", text: "Assent Global — APIs & Postgres", tone: "mineral" },
  {
    at: 2020 + 5 / 12,
    date: "Jun 2020",
    text: "KVPR Masalas — spice e-commerce store",
    tone: "plum",
    kind: "product",
  },
  {
    at: 2021,
    date: "Jan 2021",
    text: "Travel Kampany — travel platform",
    tone: "plum",
    kind: "product",
  },
  {
    at: 2021 + 6 / 12,
    date: "Jul 2021",
    text: "VLSID conference sites",
    tone: "plum",
    kind: "product",
  },
  { at: 2022, date: "Jan 2022", text: "Lead engineer — Screen Interactiv", tone: "clay" },
  {
    at: 2022 + 0.45 / 12,
    date: "Jan 2022",
    text: "Namami Health — billing app",
    tone: "plum",
    kind: "product",
  },
  {
    at: 2022 + 6 / 12,
    date: "Jul 2022",
    text: "WorkOrbit — schema-per-tenant lead CRM",
    tone: "plum",
    kind: "product",
  },
  {
    at: 2023 + 4 / 12,
    date: "May 2023",
    text: "Channel Partner Portal",
    tone: "plum",
    kind: "product",
  },
  {
    at: 2024 + 2 / 12,
    date: "Mar 2024",
    text: "Task Manager — with an AI assistant",
    tone: "plum",
    kind: "product",
  },
  {
    at: 2025,
    date: "Jan 2025",
    text: "Work OS — workspace SaaS",
    tone: "plum",
    kind: "product",
  },
  {
    at: 2025 + 9 / 12,
    date: "Oct 2025",
    text: "Windy Parking — airport parking marketplace",
    tone: "plum",
    kind: "product",
  },
  {
    at: 2026,
    date: "Jan 2026",
    text: "VLSID 2026 — live in Pune",
    tone: "plum",
    kind: "product",
  },
  {
    at: 2026 + 2 / 12,
    date: "Mar 2026",
    text: "Multi-tenant bookkeeping platform",
    tone: "plum",
    kind: "product",
  },
  // Current work, in clay like "today".
  {
    at: 2026 + 5 / 12,
    date: "Jun 2026",
    text: "TcodeChat — current, multi-tenant AI chatbot",
    tone: "clay",
    kind: "product",
  },
  {
    at: 2026 + 7 / 12,
    date: "Aug 2026",
    text: "Lead Directory — current, multi-tenant lead admin",
    tone: "clay",
    kind: "product",
  },
  { at: END, date: "today", text: "open to lead & senior roles", tone: "clay" },
];

/*
 * One-line labels, stacked into up to three lanes above the baseline so close dates never
 * collide. Widths are estimated from character counts (Kalam bold date + Caveat text).
 */
const LANE_Y = [44, 28, 12];
const LABELS = (() => {
  const ends = LANE_Y.map(() => -Infinity);
  return MILESTONES.map((m) => {
    const mx = x(m.at);
    const width = m.date.length * 7.6 + 14 + m.text.length * 6.6;
    let lane = ends.findIndex((e) => e + 16 <= mx);
    if (lane === -1) lane = ends.indexOf(Math.min(...ends));
    ends[lane] = mx + 9 + width;
    return { ...m, mx, y: LANE_Y[lane] };
  });
})();

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const gen = rough.generator();
const ink = "var(--color-ink)";

// Built once at module load (fixed seeds) — the same drawing on every visit.
// Drawn a year at a time: one long Rough.js stroke bows too far and splits at the far end.
const BASELINE = (() => {
  const out: string[] = [];
  const from = x(START) - 40;
  const to = x(END);
  for (let a = from, i = 0; a < to; a += PX_PER_YEAR, i++) {
    const b = Math.min(to, a + PX_PER_YEAR + 2);
    gen
      .toPaths(
        gen.line(a, BASE, b, BASE, {
          seed: 7 + i,
          roughness: 1.1,
          bowing: 0.8,
          stroke: ink,
          strokeWidth: 1.8,
        }),
      )
      .forEach((p) => out.push(p.d));
  }
  return out;
})();
const FUTURE = gen
  .toPaths(
    gen.line(x(END), BASE, x(TO) - 20, BASE, {
      seed: 9,
      roughness: 1.2,
      stroke: ink,
      strokeWidth: 1.4,
      strokeLineDash: [6, 7],
    }),
  )
  .map((p) => p.d);

const TICKS = (() => {
  const out: { x: number; major: boolean; label?: string }[] = [];
  for (let m = Math.ceil(START * 12); m <= Math.floor(END * 12); m++) {
    const year = m / 12;
    out.push({ x: x(year), major: m % 12 === 0, label: m % 12 === 0 ? String(m / 12) : undefined });
  }
  return out;
})();

const TONE = {
  clay: "var(--color-signal)",
  mineral: "var(--color-mineral)",
  plum: "var(--color-plum)",
};

export function CareerRuler() {
  const track = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(
    () =>
      useScrollStore.subscribe(({ progress, orientation }) => {
        if (orientation !== "horizontal") return;
        const p = Math.min(1, Math.max(0, progress));
        const year = START + p * (END - START);
        const vw = window.innerWidth;
        const offset = vw * 0.5 - x(year);
        if (track.current)
          track.current.style.transform = `translate3d(${offset.toFixed(1)}px,0,0)`;
        if (label.current) {
          const m = Math.min(11, Math.floor((year % 1) * 12 + 1e-6));
          label.current.textContent = p >= 0.995 ? "today" : `${MONTHS[m]} ${Math.floor(year)}`;
        }
      }),
    [],
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-0 hidden md:block"
      style={{
        height: H,
        maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div
        ref={track}
        className="absolute top-0 left-0"
        style={{ width: W, height: H, transform: `translate3d(calc(50vw - ${x(START)}px),0,0)` }}
      >
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
          {BASELINE.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              style={{ stroke: ink, strokeWidth: 1.8 }}
              strokeLinecap="round"
            />
          ))}
          {FUTURE.map((d, i) => (
            <path
              key={`f${i}`}
              d={d}
              fill="none"
              style={{ stroke: ink, strokeWidth: 1.2, opacity: 0.45 }}
              strokeDasharray="5 7"
            />
          ))}

          {TICKS.map((t) => (
            <g key={t.x}>
              <path
                d={`M${t.x} ${BASE - (t.major ? 12 : 4)} L${t.x + (t.major ? 0.8 : 0.3)} ${BASE + (t.major ? 12 : 4)}`}
                style={{ stroke: ink, strokeWidth: t.major ? 1.6 : 1, opacity: t.major ? 1 : 0.5 }}
                strokeLinecap="round"
              />
              {t.label && (
                <text
                  x={t.x}
                  y={BASE + 32}
                  textAnchor="middle"
                  className="fill-ink font-head text-[17px] font-bold"
                >
                  {t.label}
                </text>
              )}
            </g>
          ))}

          {LABELS.map((m) => {
            const color = TONE[m.tone ?? "plum"];
            return (
              <g key={m.date + m.text}>
                <path
                  d={`M${m.mx} ${BASE - 6} L${m.mx + 0.5} ${m.y + 3}`}
                  style={{ stroke: ink, strokeWidth: 1.1, opacity: 0.5 }}
                  strokeDasharray="3 3"
                />
                {m.kind === "product" ? (
                  <rect
                    x={m.mx - 5}
                    y={BASE - 5}
                    width={10}
                    height={10}
                    transform={`rotate(45 ${m.mx} ${BASE})`}
                    style={{ fill: color, stroke: ink, strokeWidth: 1.4 }}
                  />
                ) : (
                  <circle
                    cx={m.mx}
                    cy={BASE}
                    r={5.5}
                    style={{ fill: color, stroke: ink, strokeWidth: 1.4 }}
                  />
                )}
                {/* Paper-coloured halo so leader lines from lower lanes break around the words. */}
                <text
                  x={m.mx + 7}
                  y={m.y}
                  style={{
                    paintOrder: "stroke",
                    stroke: "var(--color-paper)",
                    strokeWidth: 5,
                    strokeLinejoin: "round",
                  }}
                >
                  <tspan className="font-head text-[13px] font-bold" style={{ fill: color }}>
                    {m.date}
                  </tspan>
                  <tspan dx={6} className="fill-ink-soft font-hand text-[15.5px]">
                    {m.text}
                  </tspan>
                </text>
              </g>
            );
          })}

          <text x={x(END) + 300} y={BASE - 10} className="fill-ink-soft font-hand text-[16px]">
            what’s next? →
          </text>
        </svg>
      </div>

      {/* "You are here" needle, fixed at the centre of the viewport. */}
      <div className="absolute inset-y-0 left-1/2 w-px">
        <span className="absolute top-1 bottom-8 left-0 w-0.5 -translate-x-1/2 rounded bg-signal" />
        <span className="absolute bottom-1 left-0 -translate-x-1/2 rounded-sm bg-signal px-2 py-px font-head text-[13px] font-bold whitespace-nowrap text-on-clay">
          <span ref={label}>Jul 2019</span>
        </span>
      </div>
    </div>
  );
}
