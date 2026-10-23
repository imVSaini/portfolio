"use client";

import { useEffect, useRef } from "react";
import { GROUND, LandscapeTile } from "@/components/ui/sketches";
import { useScrollStore } from "@/store/use-scroll-store";

const TILE = 1440;
const DRIFT = 0.18; // landscape moves at a fraction of the strip's speed
// Drawn smaller than the hero board so content keeps the upper ~75% of the viewport.
const SCALE = 0.7;

/**
 * Fixed pencil landscape along the bottom of the viewport (desktop). It drifts slowly with the
 * horizontal scroll and its colours wash in as the visitor gets further along.
 */
export function Landscape() {
  const svg = useRef<SVGSVGElement>(null);
  const track = useRef<SVGGElement>(null);

  useEffect(
    () =>
      useScrollStore.subscribe(({ scroll, progress }) => {
        const offset = -((scroll * DRIFT) % TILE);
        track.current?.setAttribute("transform", `translate(${offset.toFixed(1)} 0)`);
        svg.current?.style.setProperty("--wash", Math.min(1, progress * 1.4).toFixed(3));
      }),
    [],
  );

  return (
    <svg
      ref={svg}
      // "slice" takes the larger of the width/height scales. On a board 4 tiles wide the
      // height scale always wins, so the landscape keeps the same share of the screen on any
      // aspect ratio (a 1440-wide board made it grow with width and crop the hero).
      viewBox={`0 0 ${TILE * 4} 900`}
      preserveAspectRatio="xMinYMax slice"
      className="pointer-events-none fixed inset-0 z-0 hidden h-svh w-screen opacity-75 md:block"
      aria-hidden
    >
      <g transform={`translate(0 ${GROUND}) scale(${SCALE}) translate(0 ${-GROUND})`}>
        <g ref={track}>
          {[-1, 0, 1, 2, 3, 4, 5, 6].map((n) => (
            <LandscapeTile key={n} x={n * TILE} />
          ))}
        </g>
      </g>
    </svg>
  );
}
