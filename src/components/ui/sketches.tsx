/** Pencil doodles shared across sections. */

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
