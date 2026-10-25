import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

function Prop({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div data-prop className={cn("pointer-events-none select-none", className)} aria-hidden>
      {children}
    </div>
  );
}

function Trail({
  id,
  d,
  width,
  children,
}: {
  id: string;
  d: string;
  width: number;
  children: ReactNode;
}) {
  return (
    <>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="-100" y="-200" width="1200" height="600">
          <path
            data-prop-draw
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
  end: "translate(852 38) rotate(-26)",
  scale: 1,
  mask: 14,
};

const COMPACT = {
  id: "prop-plane-trail-compact",
  viewBox: "0 0 360 200",
  trail:
    "M14 182 C 64 190 104 150 134 130 C 168 108 196 146 174 164 C 150 184 128 128 184 104 C 236 82 282 84 340 30",
  end: "translate(340 30) rotate(-42)",
  scale: 0.62,
  mask: 10,
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
  className,
}: typeof WIDE & { className: string }) {
  return (
    <Prop className={className}>
      <svg viewBox={viewBox} className="h-auto w-full overflow-visible">
        <Trail id={id} d={trail} width={mask}>
          <path data-prop-path d={trail} className="ink thin" strokeDasharray="7 11" />
        </Trail>
        <g data-prop-rider data-prop-turn transform={end}>
          <g transform={`scale(${scale})`}>
            <path
              d="M48 0 L-40 -30 L-16 -2 Z"
              className="ink"
              style={{ fill: "var(--color-card)" }}
            />
            <path
              d="M48 0 L-16 -2 L-30 26 Z"
              className="ink"
              style={{ fill: "var(--color-paper-dim)" }}
            />
            <path
              d="M48 0 L-16 -2 L-6 16 Z"
              className="ink"
              style={{ fill: "color-mix(in srgb, var(--color-signal) 55%, var(--color-card))" }}
            />
            <path d="M-12 4 L-20 18 M-4 6 L-12 20 M4 6 L-2 16" className="ink ghost" />
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
    <Prop className={className}>
      <svg viewBox="0 0 440 130" className="h-auto w-full overflow-visible">
        {STEPS.map((s) => (
          <g key={`${s.x}-${s.y}`} transform={`translate(${s.x} ${s.y}) rotate(${s.deg})`}>
            <g data-prop-step className="fill-ink/75">
              <ellipse cx="3" cy="0" rx="7" ry="4.2" />
              <ellipse cx="-8.5" cy="0" rx="3.6" ry="3.2" />
            </g>
          </g>
        ))}
        <text
          data-prop-step
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

const GROUND = "M10 92 C 80 86 140 98 200 92 C 260 86 300 94 362 89";
const GEAR_RADIUS = 24;
const GEAR_SPIN = Math.round((350 / GEAR_RADIUS) * (180 / Math.PI));

export function RollingGear({ className }: { className?: string }) {
  return (
    <Prop className={className}>
      <svg viewBox="0 0 390 110" className="h-auto w-full overflow-visible">
        <Trail id="prop-gear-ground" d={GROUND} width={10}>
          <path data-prop-path d={GROUND} className="ink" />
        </Trail>
        <g
          data-prop-rider
          data-prop-origin="0.5 1"
          transform={`translate(362 ${89 - GEAR_RADIUS})`}
        >
          <g data-prop-spin={GEAR_SPIN}>
            {Array.from({ length: 8 }, (_, i) => (
              <rect
                key={i}
                x="-4.5"
                y={-GEAR_RADIUS}
                width="9"
                height="9"
                rx="1.5"
                transform={`rotate(${i * 45})`}
                className="ink thin"
                style={{ fill: "var(--color-signal)" }}
              />
            ))}
            <circle r="18" className="ink" style={{ fill: "var(--color-card)" }} />
            <circle r="9" className="ink ghost" />
            <circle r="4" className="ink thin" style={{ fill: "var(--color-paper)" }} />
          </g>
        </g>
      </svg>
    </Prop>
  );
}

const LAUNCH =
  "M30 284 C 40 230 90 230 96 190 C 102 150 60 140 80 110 C 100 80 160 96 196 76 C 226 60 246 40 268 22";

export function Rocket({ className }: { className?: string }) {
  return (
    <Prop className={className}>
      <svg viewBox="0 0 300 300" className="h-auto w-full overflow-visible">
        <Trail id="prop-rocket-smoke" d={LAUNCH} width={18}>
          <path
            data-prop-path
            d={LAUNCH}
            className="ink"
            style={{ strokeWidth: 7, opacity: 0.3 }}
            strokeDasharray="0.5 14"
          />
        </Trail>
        <g data-prop-rider data-prop-turn transform="translate(268 22) rotate(-39)">
          <g transform="scale(1.05)">
            <path
              d="M-24 -6 C -34 -5 -42 -2 -48 0 C -42 2 -34 5 -24 6 Z"
              className="ink thin"
              style={{ fill: "var(--color-peach)" }}
            />
            <path
              d="M-14 -10 L-28 -22 L-26 -10 Z"
              className="ink"
              style={{ fill: "var(--color-signal)" }}
            />
            <path
              d="M-14 10 L-28 22 L-26 10 Z"
              className="ink"
              style={{ fill: "var(--color-signal)" }}
            />
            <path
              d="M-24 -10 L14 -10 C 24 -10 32 -5 38 0 C 32 5 24 10 14 10 L-24 10 Z"
              className="ink"
              style={{ fill: "var(--color-card)" }}
            />
            <circle
              cx="8"
              cy="0"
              r="4.5"
              className="ink thin"
              style={{ fill: "var(--color-sky)" }}
            />
            <path d="M-18 -10 L-18 10" className="ink ghost" />
          </g>
        </g>
      </svg>
    </Prop>
  );
}
