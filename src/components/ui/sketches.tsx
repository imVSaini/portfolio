import type { SVGProps } from "react";

/*
 * Pencil drawings, adapted from the sketchbook template. Everything is drawn on a 1440×900
 * board with the ground line at y=800, so separate SVGs that share
 * `preserveAspectRatio="xMidYMax slice"` line up on the same horizon.
 */

export const GROUND = 800;
const f = (n: number) => Math.round(n * 10) / 10;
// Deterministic jitter so the drawing is identical on server and client.
const rnd = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/* --- small doodles --------------------------------------------------------------------- */

export function Cloud({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 130 36" className={className} aria-hidden {...props}>
      <path
        className="ink thin"
        d="M8 32 C 10 18 28 16 34 24 C 40 2 68 2 70 22 C 80 14 92 20 94 32"
      />
      <path className="ink thin" d="M0 32 L 122 33" />
    </svg>
  );
}

export function Birds({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 90 40" className={className} aria-hidden {...props}>
      {[
        [4, 22],
        [36, 9],
        [62, 32],
      ].map(([x, y]) => (
        <path key={x} className="ink thin" d={`M${x} ${y} q6 -6 12 0 q6 -6 12 0`} />
      ))}
    </svg>
  );
}

const BULB_GLASS =
  "M-30 28 C-54 4 -50 -44 0 -47 C50 -44 54 4 30 28 C22 38 20 46 20 56 L-20 56 C-20 46 -22 38 -30 28 Z";
const BULB_RAYS = Array.from({ length: 9 }, (_, i) => {
  const a = ((-200 + i * 27.5) * Math.PI) / 180;
  const r1 = 64 + (i % 2) * 6;
  const r2 = 88 + (i % 2) * 6;
  return `M${f(Math.cos(a) * r1)} ${f(Math.sin(a) * r1)} L${f(Math.cos(a) * r2)} ${f(Math.sin(a) * r2)}`;
});

export function Bulb({ className, lit = false }: { className?: string; lit?: boolean }) {
  return (
    <svg viewBox="-100 -100 200 190" className={className} aria-hidden>
      {lit && <path d={BULB_GLASS} fill="rgb(217 119 87 / 0.28)" />}
      <path className="ink" d={BULB_GLASS} />
      <path className="ink thin" d="M-26 -12 C-24 -26 -14 -34 -2 -36" />
      <path className="ink clay" d="M-10 56 L-10 22 L-4 32 L2 18 L8 32 L10 22 L10 56" />
      <path className="ink" d="M-20 64 L20 64 M-18 72 L18 72 M-11 80 L11 80" />
      {BULB_RAYS.map((d, i) => (
        <path key={i} className="ink clay" d={d} />
      ))}
    </svg>
  );
}

/** Hand-drawn loop for circling a number. Draws itself in when an ancestor is `.is-lit`. */
export function Ring({ variant = 0 }: { variant?: number }) {
  const RINGS = [
    "M14 44 C 10 18 60 6 112 8 C 166 10 196 24 192 46 C 188 70 140 82 96 80 C 48 78 12 68 8 46 C 6 36 16 28 26 24",
    "M20 40 C 22 14 78 4 128 10 C 176 16 198 34 186 56 C 174 76 118 84 74 78 C 30 72 8 58 14 38 C 16 30 30 26 40 22",
    "M10 50 C 8 26 50 8 104 8 C 158 8 194 22 194 44 C 194 68 152 82 100 82 C 50 82 16 72 10 52 C 8 42 22 34 34 30",
  ];
  return (
    <svg
      data-ring
      viewBox="0 0 200 90"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -inset-x-4.5 -inset-y-3 h-[calc(100%+24px)] w-[calc(100%+36px)] overflow-visible"
      aria-hidden
    >
      <path
        d={RINGS[variant % RINGS.length]}
        pathLength={1}
        fill="none"
        stroke="var(--color-signal)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* --- the hero rig: a server tower with an atom on top ---------------------------------- */

const TOWER_TICKS = Array.from({ length: 30 }, (_, i) => {
  const y = 392 + i * 14;
  const half = 9 + ((y - 372) / (GROUND - 372)) * 7;
  return `M${f(-half + 2)} ${y} l5 -5`;
}).join(" ");

const ORBITS = [0, 60, 120];
const ELECTRON_ANGLE = [30, 160, 260];
const RX = 230;
const RY = 76;
const CORE_Y = 350;

/**
 * The hero rig, cropped to its own bounds (tower centre at x=0, ground at y=800) so the hero can
 * size it to fit under the header. The atom (`[data-rotor]`) is spun by the scroll engine.
 */
export const RIG_VIEWBOX = { x: -245, y: 95, w: 600, h: 715 };

export function HeroRig({ className }: { className?: string }) {
  const { x, y, w, h } = RIG_VIEWBOX;
  return (
    <svg viewBox={`${x} ${y} ${w} ${h}`} className={className} aria-hidden>
      <g>
        <path className="ink" d={`M-16 ${GROUND} L-9 ${CORE_Y + 22}`} />
        <path className="ink" d={`M16 ${GROUND} L9 ${CORE_Y + 22}`} />
        <path className="ink thin" d="M-14 690 L14 690 M-12.5 580 L12.5 580 M-11 470 L11 470" />
        <path className="ink ghost" d={TOWER_TICKS} />
        <path className="ink" d="M-36 803 L-18 790 M36 803 L18 790 M-44 804 L44 803" />
        {[635, 525, 415].map((y) => (
          <g key={y}>
            <circle cx="0" cy={y} r="4" fill="var(--color-signal)" />
            <circle className="ink thin" cx="0" cy={y} r="4" />
          </g>
        ))}

        <g transform={`translate(0 ${CORE_Y})`}>
          <g data-rotor>
            {ORBITS.map((deg, i) => {
              const a = (ELECTRON_ANGLE[i] * Math.PI) / 180;
              return (
                <g key={deg} transform={`rotate(${deg})`}>
                  <ellipse className="ink" cx="0" cy="0" rx={RX} ry={RY} />
                  <ellipse className="ink ghost" cx="2" cy="-1" rx={RX - 6} ry={RY - 5} />
                  <circle
                    cx={f(Math.cos(a) * RX)}
                    cy={f(Math.sin(a) * RY)}
                    r="9"
                    fill="var(--color-signal)"
                  />
                  <circle className="ink" cx={f(Math.cos(a) * RX)} cy={f(Math.sin(a) * RY)} r="9" />
                </g>
              );
            })}
            <circle className="ink" cx="0" cy="0" r="20" fill="var(--color-card)" />
            <circle className="ink thin" cx="0" cy="0" r="7" />
          </g>
        </g>

        <g>
          <text x="118" y="118" className="fill-mineral font-hand text-[27px]">
            the core —
          </text>
          <text x="118" y="150" className="fill-mineral font-hand text-[27px]">
            scroll to spin it
          </text>
          <path className="ink mineral thin" d="M112 166 C86 188 70 214 62 252" />
          <path className="ink mineral thin" d="M51 239 L62 254 L73 240" />
        </g>
      </g>
    </svg>
  );
}

/* --- the landscape tile (repeats every 1440 units) -------------------------------------- */

const HILLS =
  "M0 726 C 140 700 260 696 380 712 S 560 690 680 718 S 900 700 1020 712 S 1260 690 1440 726";
const HILLS_GHOST =
  "M0 731 C 150 706 270 702 390 717 S 570 696 690 722 S 910 706 1030 717 S 1270 696 1440 731";
const GROUND_LINE = "M0 800 C 300 796 600 803 900 799 S 1300 802 1440 800";

function mast(x: number, y: number) {
  return [
    `M${x} ${y + 4} L${x} ${y - 76}`,
    `M${x - 11} ${y + 4} L${x} ${y - 30} L${x + 11} ${y + 4}`,
    `M${x - 11} ${y - 86} Q${x} ${y - 97} ${x + 11} ${y - 86}`,
    `M${x - 21} ${y - 94} Q${x} ${y - 114} ${x + 21} ${y - 94}`,
  ];
}

function rack(x: number, w: number, h: number) {
  const top = GROUND - h;
  const shelves = Math.floor((h - 12) / 22);
  const lines: { d: string; cls: string }[] = [
    {
      d: `M${x} ${GROUND} L${x + 1} ${top} L${x + w} ${top + 1} L${x + w - 1} ${GROUND}`,
      cls: "ink",
    },
    { d: `M${x - 5} ${top} L${x + w + 5} ${top - 1}`, cls: "ink" },
  ];
  const leds: [number, number][] = [];
  for (let k = 1; k <= shelves; k++) {
    const y = top + k * 22;
    lines.push({ d: `M${x + 6} ${y} L${x + w - 6} ${y + 0.6}`, cls: "ink sky" });
    lines.push({
      d: `M${x + 10} ${y - 6} l6 -9 M${x + 20} ${y - 6} l6 -9 M${x + 30} ${y - 6} l6 -9`,
      cls: "ink thin",
    });
    leds.push([x + w - 14, y - 11]);
  }
  return { lines, leds, box: { x, y: top, w, h } };
}

function tree(x: number, s: number) {
  const cy = GROUND - 58 * s;
  const r = 22 * s;
  return {
    cx: x,
    cy,
    r,
    trunk: `M${x} ${GROUND} L${x} ${f(GROUND - 40 * s)} M${x} ${f(GROUND - 26 * s)} l${f(8 * s)} ${f(-8 * s)}`,
    crown: `M${f(x - r)} ${f(cy)} C${f(x - r)} ${f(cy - r * 1.15)} ${f(x + r)} ${f(cy - r * 1.15)} ${f(x + r)} ${f(cy)} C${f(x + r)} ${f(cy + r * 1.05)} ${f(x - r * 0.9)} ${f(cy + r * 1.1)} ${f(x - r)} ${f(cy - 2)}`,
  };
}

const grass = Array.from({ length: 62 }, (_, i) => {
  const x = f(i * 23.5 + rnd(i) * 12);
  return `M${x} 801 l${f(-2 + rnd(i + 99) * 4)} ${f(-7 - rnd(i + 7) * 7)}`;
}).join(" ");

const groundDashes = Array.from({ length: 16 }, (_, i) => {
  const x = f(40 + i * 90 + rnd(i + 3) * 40);
  const y = f(826 + rnd(i + 11) * 58);
  return `M${x} ${y} l${f(18 + rnd(i) * 22)} ${f(-1 + rnd(i + 5) * 2)}`;
}).join(" ");

const masts = [
  [140, 708],
  [430, 702],
  [960, 706],
  [1390, 703],
].flatMap(([x, y]) => mast(x, y));

const racks = [rack(590, 96, 156), rack(712, 70, 112), rack(1215, 84, 134), rack(1318, 58, 90)];
const trees = [
  tree(55, 1),
  tree(118, 0.8),
  tree(300, 1.1),
  tree(360, 0.75),
  tree(520, 0.9),
  tree(1000, 1),
  tree(1418, 0.95),
];

/** One 1440-wide strip of hills, masts, server racks and trees. Fills fade with `--wash`. */
export function LandscapeTile({ x = 0 }: { x?: number }) {
  const wash = { opacity: "var(--wash, 0)" };
  return (
    <g transform={`translate(${x} 0)`}>
      <path
        d={`${HILLS} L1440 ${GROUND} L0 ${GROUND} Z`}
        fill="var(--color-cactus)"
        style={{ opacity: "calc(var(--wash, 0) * 0.7)" }}
      />
      <rect x="0" y={GROUND} width="1440" height="200" fill="var(--color-oat)" style={wash} />

      <path className="ink" d={HILLS} />
      <path className="ink ghost" d={HILLS_GHOST} />
      {masts.map((d, i) => (
        <path key={i} className="ink thin" d={d} />
      ))}

      <path className="ink" d={GROUND_LINE} />
      <path className="ink thin" d={grass} />
      <path className="ink ghost" d={groundDashes} />

      {racks.map((r, i) => (
        <g key={i}>
          <rect
            x={r.box.x}
            y={r.box.y}
            width={r.box.w}
            height={r.box.h}
            fill="var(--color-heather)"
            style={wash}
          />
          {r.lines.map((l, j) => (
            <path key={j} className={l.cls} d={l.d} />
          ))}
          {r.leds.map(([lx, ly], j) => (
            <g key={`led-${j}`}>
              <circle cx={lx} cy={ly} r="3" fill="var(--color-signal)" style={wash} />
              <circle className="ink thin" cx={lx} cy={ly} r="3" />
            </g>
          ))}
        </g>
      ))}

      {trees.map((t, i) => (
        <g key={i}>
          <circle cx={t.cx} cy={t.cy} r={t.r} fill="var(--color-mineral)" style={wash} />
          <path className="ink mineral" d={t.crown} />
          <path className="ink" d={t.trunk} />
        </g>
      ))}
    </g>
  );
}
