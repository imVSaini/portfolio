import type { ReactNode } from "react";
import rough from "roughjs";
import { cn } from "@/lib/cn";

const gen = rough.generator();
const CARD = { fill: "var(--color-card)" };

function Prop({
  name,
  depth,
  className,
  children,
}: {
  name: string;
  depth: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-prop={name}
      data-depth={depth}
      className={cn("pointer-events-none select-none", className)}
      aria-hidden
    >
      {children}
    </div>
  );
}

function Trail({
  id,
  d,
  width,
  part = "trail",
  children,
}: {
  id: string;
  d: string;
  width: number;
  part?: string;
  children: ReactNode;
}) {
  return (
    <>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="-100" y="-200" width="1200" height="600">
          <path
            data-part={part}
            d={d}
            pathLength={1}
            fill="none"
            stroke="#fff"
            strokeWidth={width}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>
      <g mask={`url(#${id})`}>{children}</g>
    </>
  );
}

const WIDE = {
  id: "prop-plane-trail",
  viewBox: "0 0 900 250",
  trail:
    "M20 214 C 110 222 190 168 268 156 C 350 144 384 200 344 216 C 298 232 282 146 382 120 C 482 94 562 152 652 120 C 734 92 792 66 852 38",
  end: { x: 852, y: 38, deg: -26 },
  scale: 1,
  mask: 14,
  ground: 246,
  note: { x: 700, y: 30, size: 24 },
};

const COMPACT = {
  id: "prop-plane-trail-compact",
  viewBox: "0 0 360 200",
  trail:
    "M14 182 C 64 190 104 150 134 130 C 168 108 196 146 174 164 C 150 184 128 128 184 104 C 236 82 282 84 340 30",
  end: { x: 340, y: 30, deg: -42 },
  scale: 0.62,
  mask: 10,
  ground: 198,
  note: { x: 232, y: 24, size: 17 },
};

export function PaperPlane({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none select-none", className)} aria-hidden>
      <Flight {...COMPACT} className="md:hidden" />
      <Flight {...WIDE} className="hidden md:block" />
    </div>
  );
}

function Flight({
  id,
  viewBox,
  trail,
  end,
  scale,
  mask,
  ground,
  note,
  className,
}: typeof WIDE & { className: string }) {
  return (
    <Prop name="plane" depth={14} className={className}>
      <svg viewBox={viewBox} className="h-auto w-full overflow-visible">
        <ellipse
          data-part="shadow"
          cx={end.x}
          cy={ground}
          rx="14"
          ry="3.5"
          opacity="0.06"
          className="fill-ink"
        />
        <Trail id={id} d={trail} width={mask}>
          <path data-part="path" d={trail} className="ink thin" strokeDasharray="7 11" />
        </Trail>
        <text
          data-part="note"
          x={note.x}
          y={note.y}
          className="fill-plum font-hand"
          style={{ fontSize: note.size }}
        >
          sent ✓
        </text>
        <g data-part="rider" transform={`translate(${end.x} ${end.y}) rotate(${end.deg})`}>
          <g data-part="turn">
            <g data-part="flutter">
              <g transform={`scale(${scale})`}>
                <path
                  data-part="lines"
                  opacity="0"
                  d="M-50 -10 L-74 -10 M-46 5 L-64 5 M-58 -2 L-90 -2"
                  className="ink thin"
                />
                <path
                  data-part="ink"
                  pathLength={1}
                  d="M48 0 L-40 -30 L-16 -2 Z"
                  className="ink"
                  style={CARD}
                />
                <path
                  data-part="ink"
                  pathLength={1}
                  d="M48 0 L-16 -2 L-30 26 Z"
                  className="ink"
                  style={{ fill: "var(--color-paper-dim)" }}
                />
                <path
                  data-part="ink"
                  pathLength={1}
                  d="M48 0 L-16 -2 L-6 16 Z"
                  className="ink"
                  style={{ fill: "color-mix(in srgb, var(--color-signal) 55%, var(--color-card))" }}
                />
                <path
                  data-part="ink"
                  pathLength={1}
                  d="M-12 4 L-20 18 M-4 6 L-12 20 M4 6 L-2 16"
                  className="ink ghost"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </Prop>
  );
}

const STEPS = Array.from({ length: 11 }, (_, i) => {
  const t = i / 10;
  const wave = Math.PI * 2.2;
  const x = 24 + t * 360;
  const y = 92 - t * 40 + 22 * Math.sin(t * wave);
  const a = Math.atan2(-40 + 22 * wave * Math.cos(t * wave), 360);
  const side = i % 2 ? 7 : -7;
  return {
    x: (x - Math.sin(a) * side).toFixed(1),
    y: (y + Math.cos(a) * side).toFixed(1),
    deg: ((a * 180) / Math.PI).toFixed(1),
  };
});

export function Footprints({ className }: { className?: string }) {
  return (
    <Prop name="footprints" depth={8} className={className}>
      <svg viewBox="0 0 440 130" className="h-auto w-full overflow-visible">
        {STEPS.map((s) => (
          <g key={`${s.x}-${s.y}`} transform={`translate(${s.x} ${s.y}) rotate(${s.deg})`}>
            <g data-part="dust" className="fill-ink-soft">
              <circle cx="-14" cy="-4" r="1.4" opacity="0" />
              <circle cx="-15" cy="3" r="1.1" opacity="0" />
              <circle cx="-11" cy="6" r="1.3" opacity="0" />
            </g>
            <g data-part="step" className="fill-ink/80">
              <ellipse cx="3" cy="0" rx="7" ry="4.2" />
              <ellipse cx="-8.5" cy="0" rx="3.6" ry="3.2" />
            </g>
          </g>
        ))}
        <text
          data-part="note"
          x="318"
          y="102"
          textAnchor="middle"
          className="fill-plum font-hand text-[20px]"
        >
          still walking →
        </text>
      </svg>
    </Prop>
  );
}

const MOUNTAIN = "M10 250 L 120 70 L 150 110 L 200 30 L 310 250 Z";
const SWITCHBACKS =
  "M60 246 C 110 240 150 232 172 222 C 132 212 100 200 114 188 C 142 176 190 172 216 160 C 200 142 162 132 172 118 C 186 106 208 100 220 94 C 214 82 206 74 206 62 C 206 50 202 42 200 32";
const COMET = "M206 10 C 232 -6 264 -10 300 -2";

const mountainInk = gen.toPaths(
  gen.path(MOUNTAIN, {
    seed: 61,
    stroke: "var(--color-ink)",
    strokeWidth: 1.7,
    roughness: 0.9,
    bowing: 0.7,
    fill: "color-mix(in srgb, var(--color-mineral) 55%, transparent)",
    fillStyle: "hachure",
    hachureGap: 5,
    hachureAngle: -38,
    fillWeight: 1,
  }),
);

const TENTS = [
  { x: 172, y: 222 },
  { x: 172, y: 118 },
];

const CLOUDS = [
  { x: 40, y: 34, s: 1 },
  { x: 250, y: 74, s: 0.8 },
];

export function JourneyClimb({ className }: { className?: string }) {
  return (
    <Prop name="journey" depth={10} className={className}>
      <svg viewBox="0 0 320 262" className="h-full w-full overflow-visible">
        {CLOUDS.map((c) => (
          <g key={c.x} data-part="cloud" transform={`translate(${c.x} ${c.y}) scale(${c.s})`}>
            <path
              d="M0 0 C 0 -8 10 -10 14 -5 C 18 -12 30 -10 30 -2 C 36 -2 36 6 30 6 L 2 6 C -4 6 -4 0 0 0 Z"
              className="ink thin"
              style={CARD}
            />
          </g>
        ))}

        <g data-part="birds" transform="translate(28 96)">
          {[
            [0, 0],
            [16, -8],
          ].map(([x, y]) => (
            <path
              key={x}
              data-part="wing"
              d={`M${x} ${y} q 4 -4 8 0 q 4 -4 8 0`}
              className="ink thin"
            />
          ))}
        </g>

        {mountainInk.map((p, i) => (
          <path
            key={i}
            data-part="ink"
            d={p.d}
            pathLength={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ stroke: p.stroke, strokeWidth: p.strokeWidth, fill: p.fill ?? "none" }}
          />
        ))}
        <path
          data-part="ink"
          pathLength={1}
          d="M184 56 L200 30 L214 58 L207 52 L200 60 L192 50 Z"
          className="ink thin"
          style={CARD}
        />
        <path
          data-part="ink"
          pathLength={1}
          d="M110 86 L120 70 L131 85 L125 81 L119 88 Z"
          className="ink thin"
          style={CARD}
        />
        <path
          data-part="ink"
          pathLength={1}
          d="M0 252 C 80 250 200 253 320 251"
          className="ink ghost"
        />

        <Trail id="prop-journey-trail" d={SWITCHBACKS} width={9}>
          <path data-part="path" d={SWITCHBACKS} className="ink thin" strokeDasharray="4 6" />
        </Trail>

        {TENTS.map((t) => (
          <g key={t.y} transform={`translate(${t.x} ${t.y})`}>
            <g data-part="tent" data-x={t.x} data-y={t.y}>
              <path
                d="M-9 0 L0 -13 L9 0 Z"
                className="ink thin"
                style={{ fill: "var(--color-oat)" }}
              />
              <path d="M0 -13 L-2.5 0 L2.5 0 Z" style={{ fill: "var(--color-ink)" }} />
            </g>
          </g>
        ))}

        <g data-part="flag">
          <path d="M200 32 L200 6" className="ink thin" />
          <path
            data-part="cloth"
            d="M200 6 L218 11 L200 16 Z"
            className="ink thin"
            style={{ fill: "var(--color-signal)" }}
          />
        </g>
        <text
          data-part="summit"
          x="194"
          y="16"
          textAnchor="end"
          className="fill-ink font-hand text-[16px] font-bold"
        >
          production
        </text>

        <Trail id="prop-journey-comet" d={COMET} width={8} part="comet-trail">
          <path
            data-part="comet-path"
            d={COMET}
            className="ink"
            style={{ strokeWidth: 3, opacity: 0.35 }}
            strokeDasharray="0.5 7"
          />
        </Trail>
        <g data-part="comet-rider" transform="translate(300 -2)">
          <path
            d="M0 -7 Q 1.1 -1.1 7 0 Q 1.1 1.1 0 7 Q -1.1 1.1 -7 0 Q -1.1 -1.1 0 -7 Z"
            style={{ fill: "var(--color-signal)" }}
          />
        </g>
        <text
          data-part="beyond"
          x="306"
          y="22"
          textAnchor="end"
          className="fill-plum font-hand text-[17px]"
        >
          &amp; beyond
        </text>

        <text data-part="base" x="20" y="272" className="fill-ink-soft font-hand text-[15px]">
          blank editor
        </text>

        <g data-part="rider" transform="translate(200 32)">
          <g data-part="face">
            <g data-part="stride">
              <g transform="scale(1.25)">
                <path d="M-3 0 L0 -7 L3 0 M0 -7 L0 -14" className="ink thin" />
                <path data-part="pole" d="M2 -11 L6 0" className="ink thin" />
                <rect
                  x="-5.5"
                  y="-15"
                  width="4.5"
                  height="7"
                  rx="1"
                  className="ink thin"
                  style={{ fill: "var(--color-signal)" }}
                />
                <circle cx="0.6" cy="-17.6" r="3" className="ink thin" style={CARD} />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </Prop>
  );
}

const LAUNCH =
  "M40 294 C 40 250 44 214 64 180 C 88 140 70 120 100 96 C 134 70 190 86 224 60 C 246 42 262 30 280 16";

const STARS = [
  { x: 150, y: 30, s: 1, c: "var(--color-signal)" },
  { x: 118, y: 58, s: 0.7, c: "var(--color-sky)" },
  { x: 262, y: 74, s: 0.9, c: "var(--color-mineral)" },
  { x: 292, y: 48, s: 0.6, c: "var(--color-signal)" },
  { x: 214, y: 112, s: 0.75, c: "var(--color-plum)" },
  { x: 64, y: 46, s: 0.85, c: "var(--color-sky)" },
];

const BILLOWS = [-2, -1, 0, 1, 2];

export function Rocket({ className }: { className?: string }) {
  return (
    <Prop name="rocket" depth={18} className={className}>
      <svg viewBox="0 0 300 350" className="h-auto w-full overflow-visible">
        {STARS.map((star) => (
          <g
            key={`${star.x}-${star.y}`}
            transform={`translate(${star.x} ${star.y}) scale(${star.s})`}
          >
            <g data-part="star">
              <path
                data-part="twinkle"
                d="M0 -9 Q 1.4 -1.4 9 0 Q 1.4 1.4 0 9 Q -1.4 1.4 -9 0 Q -1.4 -1.4 0 -9 Z"
                style={{ fill: star.c }}
              />
            </g>
          </g>
        ))}

        <Trail id="prop-rocket-smoke" d={LAUNCH} width={18}>
          <path
            data-part="path"
            d={LAUNCH}
            className="ink"
            style={{ strokeWidth: 5, opacity: 0.22 }}
            strokeDasharray="0.5 13"
          />
        </Trail>
        <g data-part="smoke" />

        <path
          d="M12 324 C 30 322 50 323 70 324 M18 324 L 26 338 M64 324 L 56 338 M8 338 C 30 337 52 339 74 338"
          className="ink"
        />
        <text x="82" y="341" className="fill-ink-soft font-hand text-[16px]">
          deploy
        </text>
        {["3", "2", "1"].map((n) => (
          <text
            key={n}
            data-part="count"
            x="84"
            y="300"
            opacity="0"
            className="fill-signal font-head text-[26px] font-bold"
          >
            {n}
          </text>
        ))}
        <text data-part="note" x="192" y="26" className="fill-plum font-hand text-[19px]">
          live ✓
        </text>

        {BILLOWS.map((b) => (
          <circle
            key={b}
            data-part="billow"
            data-dir={b}
            cx={40 + b * 9}
            cy="318"
            r={7 - Math.abs(b)}
            opacity="0"
            className="ink ghost"
            style={CARD}
          />
        ))}

        <g data-part="rider" transform="translate(280 16) rotate(-39)">
          <g data-part="shake">
            <g transform="scale(1.05)">
              <g data-part="ignite">
                <g data-part="boost">
                  <g data-part="flame">
                    <path
                      d="M-24 -7 C -36 -6 -46 -3 -54 0 C -46 3 -36 6 -24 7 Z"
                      className="ink thin"
                      style={{ fill: "var(--color-peach)" }}
                    />
                    <path
                      d="M-24 -3.5 C -31 -3 -36 -1 -40 0 C -36 1 -31 3 -24 3.5 Z"
                      style={{ fill: "var(--color-signal)" }}
                    />
                  </g>
                </g>
              </g>
              <path
                data-part="ink"
                pathLength={1}
                d="M-14 -10 L-28 -22 L-26 -10 Z"
                className="ink"
                style={{ fill: "var(--color-signal)" }}
              />
              <path
                data-part="ink"
                pathLength={1}
                d="M-14 10 L-28 22 L-26 10 Z"
                className="ink"
                style={{ fill: "var(--color-signal)" }}
              />
              <path
                data-part="ink"
                pathLength={1}
                d="M-24 -10 L14 -10 C 24 -10 32 -5 38 0 C 32 5 24 10 14 10 L-24 10 Z"
                className="ink"
                style={CARD}
              />
              <circle
                data-part="ink"
                pathLength={1}
                cx="8"
                cy="0"
                r="4.5"
                className="ink thin"
                style={{ fill: "var(--color-sky)" }}
              />
              <path data-part="ink" pathLength={1} d="M-18 -10 L-18 10" className="ink ghost" />
            </g>
          </g>
        </g>
      </svg>
    </Prop>
  );
}
