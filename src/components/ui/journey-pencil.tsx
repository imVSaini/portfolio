"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

/*
 * A clay line drawn down the Experience column with the years in the margin. The line is the
 * `[data-fake-vertical-meter]` the scroll engine already scrubs (scaleY 0 → 1); this component
 * only *reads* how far it has grown to ink each year as it is reached, so scrolling is untouched.
 */

type Mark = { at: number; label: string; tone?: "next" };

// A gently wobbling vertical stroke, so the graphite line reads as hand-drawn.
const LINE = "M5 0 C 3.8 16, 6 30, 4.9 48 S 3.9 78, 5 100";

export function JourneyPencil({ marks, className }: { marks: Mark[]; className?: string }) {
  const meter = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const m = meter.current;
    const t = track.current;
    if (!m || !t) return;

    let frame = 0;
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const full = t.getBoundingClientRect().height || 1;
        const p = Math.min(1, Math.max(0, m.getBoundingClientRect().height / full));
        labels.current.forEach((li, i) =>
          li?.toggleAttribute("data-reached", p >= marks[i].at - 0.01),
        );
      });
    };

    // GSAP writes the meter's inline transform on every scrubbed frame.
    const mo = new MutationObserver(sync);
    mo.observe(m, { attributes: true, attributeFilter: ["style"] });
    const ro = new ResizeObserver(sync);
    ro.observe(t);
    sync();
    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      ro.disconnect();
    };
  }, [marks]);

  return (
    <div className={cn("relative pl-16", className)} aria-hidden>
      {/* Years in the margin */}
      <ol className="absolute inset-y-0 left-0 w-12">
        {marks.map((mark, i) => (
          <li
            key={mark.label}
            ref={(el) => {
              labels.current[i] = el;
            }}
            className={cn(
              "absolute right-0 -translate-y-1/2 text-right font-head text-[1.2rem] font-bold transition-colors duration-500",
              mark.tone === "next"
                ? "text-plum/50 data-reached:text-plum"
                : "text-ink-soft/45 data-reached:text-ink",
            )}
            style={{ top: `${mark.at * 100}%` } as CSSProperties}
          >
            {mark.label}
          </li>
        ))}
      </ol>

      <div ref={track} className="relative h-full w-2.5">
        {/* Guide: where the line will go */}
        <svg
          viewBox="0 0 10 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <path
            d={LINE}
            fill="none"
            className="stroke-ink/20"
            strokeWidth={1.2}
            strokeDasharray="3 5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Graphite: scrubbed by the scroll engine */}
        <span
          ref={meter}
          data-fake-vertical-meter
          className="absolute inset-0 block origin-top"
          style={{ transform: "scaleY(0)" }}
        >
          <svg
            viewBox="0 0 10 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <path
              d={LINE}
              fill="none"
              className="stroke-signal"
              strokeWidth={3}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </span>

        {/* Tick marks on the guide at each year */}
        {marks.map((mark) => (
          <span
            key={mark.label}
            className="absolute left-1/2 h-px w-3 -translate-x-1/2 bg-ink/35"
            style={{ top: `${mark.at * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
