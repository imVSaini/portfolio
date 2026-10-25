import { cn } from "@/lib/cn";

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
    <div data-prop className={className}>
      <svg viewBox={viewBox} className="h-auto w-full overflow-visible">
        <defs>
          <mask id={id} maskUnits="userSpaceOnUse" x="-100" y="-200" width="1200" height="600">
            <path
              data-prop-draw
              d={trail}
              pathLength={1}
              fill="none"
              stroke="#fff"
              strokeWidth={mask}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
        </defs>
        <g mask={`url(#${id})`}>
          <path data-prop-path d={trail} className="ink thin" strokeDasharray="7 11" />
        </g>
        <g data-prop-rider transform={end}>
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
    </div>
  );
}
