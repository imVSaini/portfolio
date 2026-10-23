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

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-70 flex flex-col justify-between bg-ink p-[4vw] text-paper"
    >
      <div data-loader-inner className="flex h-full flex-col justify-between">
        <div className="eyebrow flex justify-between text-paper/60">
          <span>Vaibhav Kumar Saini</span>
          <span>Portfolio — Bengaluru</span>
        </div>
        <div>
          <div
            className="mb-6 h-px w-full origin-left bg-paper/80"
            style={{ transform: "scaleX(0)" }}
            data-loader-bar
          />
          <div className="flex items-end justify-between">
            <span ref={count} className="display text-[22vw] tabular-nums md:text-[14vw]">
              000
            </span>
            <span className="eyebrow mb-[1.2vw] text-paper/60">Warming caches</span>
          </div>
        </div>
      </div>
    </div>
  );
}
