"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useScrollStore } from "@/store/use-scroll-store";

/** Counts to 100 while fonts settle, then lifts away and flags the store as ready. */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const setReady = useScrollStore((s) => s.setReady);

  useGSAP(
    () => {
      const html = document.documentElement;
      html.classList.add("is-loading");

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const counter = { value: 0 };
      const fonts = document.fonts?.ready ?? Promise.resolve();

      const tl = gsap.timeline({ paused: true });
      tl.to(counter, {
        value: 100,
        duration: reduced ? 0.2 : 1.6,
        ease: "power2.inOut",
        onUpdate: () => {
          if (count.current)
            count.current.textContent = String(Math.round(counter.value)).padStart(3, "0");
        },
      })
        .to(
          "[data-loader-bar]",
          { scaleX: 1, duration: reduced ? 0.2 : 1.6, ease: "power2.inOut" },
          0,
        )
        .to("[data-loader-inner]", {
          yPercent: -30,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.in",
        })
        .add(() => {
          html.classList.remove("is-loading");
          setReady();
        })
        .to(
          root.current,
          { yPercent: -100, duration: reduced ? 0.01 : 1.1, ease: "expo.inOut" },
          "<",
        )
        .set(root.current, { display: "none" });

      fonts.then(() => tl.play());

      return () => html.classList.remove("is-loading");
    },
    { scope: root },
  );

  // Always a dark panel: slate + ivory in light theme, and the same pair (swapped tokens) in dark.
  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-70 flex flex-col justify-between bg-ink px-[max(1.25rem,4vw,env(safe-area-inset-left),env(safe-area-inset-right))] pt-[max(1.25rem,4vw,env(safe-area-inset-top))] pb-[max(1.25rem,4vw,env(safe-area-inset-bottom))] text-paper in-data-[theme=dark]:bg-paper in-data-[theme=dark]:text-ink"
    >
      <div data-loader-inner className="flex h-full flex-col justify-between">
        <div className="eyebrow flex flex-col gap-0.5 opacity-60 sm:flex-row sm:justify-between sm:gap-6">
          <span>Vaibhav Kumar Saini</span>
          <span>Portfolio — Bengaluru, India</span>
        </div>
        <div>
          <div
            className="mb-6 h-px w-full origin-left bg-current opacity-80"
            style={{ transform: "scaleX(0)" }}
            data-loader-bar
          />
          <div className="flex items-end justify-between gap-4">
            <span
              ref={count}
              className="display text-[min(22vw,38vh)] tabular-nums md:text-[min(14vw,38vh)]"
            >
              000
            </span>
            <span className="eyebrow mb-[1.2vw] shrink-0 opacity-60">Warming caches</span>
          </div>
        </div>
      </div>
    </div>
  );
}
