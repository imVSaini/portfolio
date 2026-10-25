import { cn } from "@/lib/cn";

/*
 * The "vs" monogram. Shared by the header lockup and the favicon (src/app/icon.svg uses the
 * same paths), so the tab icon and the site mark always match.
 */
export const MONOGRAM = {
  v: "M10 13.5 L15 27 L20 13.5",
  s: "M30.6 15.2 C29.1 12.7 23.4 12.8 23.5 16.3 C23.6 19.7 31 19.2 31 23.3 C31 27.3 24.3 27.6 22.5 24.9",
} as const;

/** Ink tile with a clay tile offset behind it, "vs" lettered in paper colour. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" className={cn("overflow-visible", className)} aria-hidden>
      <rect
        data-ink-source
        x="6"
        y="6"
        width="36"
        height="36"
        rx="10"
        className="logo-shadow fill-signal"
      />
      <g className="logo-tile">
        <rect x="2" y="2" width="36" height="36" rx="10" className="fill-ink" />
        <g
          className="logo-draw stroke-paper"
          fill="none"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={MONOGRAM.v} pathLength={1} />
          <path d={MONOGRAM.s} pathLength={1} />
        </g>
      </g>
    </svg>
  );
}
