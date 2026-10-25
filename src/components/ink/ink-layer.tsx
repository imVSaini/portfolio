import { projects } from "@/data/projects";

export const EXTRA_BLOBS = 12;
export const PILLS = 4;
export const SEAL_RIM = 10;

/**
 * The ink layer: fixed overlays in viewport pixels above the page. Everything that is liquid
 * lives here and is drawn through a metaball ("goo") filter, so separate blobs fuse, neck and
 * split like real surface tension. The liquid is blended into the page like real ink (text
 * shows through it); the gloss and the seal sit on a plain layer above. The director moves it
 * all from the scroll position.
 */
export function InkLayer() {
  return (
    <>
      <svg
        data-ink
        className="ink-layer pointer-events-none fixed inset-0 z-55 h-svh w-screen overflow-visible"
        aria-hidden
      >
        <defs>
          <filter id="ink-goo" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" />
          </filter>
          <filter id="ink-bleed" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="7" />
            <feDisplacementMap
              in="SourceGraphic"
              scale="46"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          <filter id="ink-soft" x="-50%" y="-200%" width="200%" height="500%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <radialGradient id="ink-body" cx="38%" cy="32%" r="75%">
            <stop offset="0" stopColor="#e89a7e" />
            <stop offset="0.55" stopColor="#d97757" />
            <stop offset="1" stopColor="#b9583a" />
          </radialGradient>
          {projects.map((p, i) => (
            <clipPath key={p.slug} id={`ink-clip-${i}`}>
              <rect data-ink-clip />
            </clipPath>
          ))}
        </defs>

        <g data-ink-washes filter="url(#ink-bleed)" className="fill-signal">
          {projects.map((p, i) => (
            <circle key={p.slug} data-ink-wash clipPath={`url(#ink-clip-${i})`} r="0" />
          ))}
        </g>

        <ellipse data-ink-shadow filter="url(#ink-soft)" className="fill-ink" opacity="0" />

        <g data-ink-goo filter="url(#ink-goo)">
          <g className="fill-signal">
            {Array.from({ length: PILLS }, (_, i) => (
              <rect key={i} data-ink-pill width="0" height="0" />
            ))}
            {Array.from({ length: EXTRA_BLOBS + SEAL_RIM + 2 }, (_, i) => (
              <circle key={i} data-ink-blob r="0" />
            ))}
          </g>
          <ellipse data-ink-main rx="0" ry="0" fill="url(#ink-body)" />
        </g>
      </svg>
      <svg
        data-ink-gloss
        className="pointer-events-none fixed inset-0 z-55 h-svh w-screen overflow-visible"
        aria-hidden
      >
        <g data-ink-seal opacity="0">
          <circle r="1" className="ink-seal-ring" />
          <text y="0.36" textAnchor="middle" className="ink-seal-mark font-head font-bold">
            V
          </text>
        </g>

        <ellipse data-ink-shine fill="#fff" opacity="0" />
      </svg>
    </>
  );
}
