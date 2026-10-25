"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";
import LocomotiveScroll from "locomotive-scroll";
import { useScrollStore } from "@/store/use-scroll-store";
import { playInk } from "@/components/ink/director";
import type { SectionId } from "@/data/profile";

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin, useGSAP);

const DESKTOP = "(min-width: 48rem) and (hover: hover) and (pointer: fine)";
const MOBILE = "(max-width: 47.99rem), (hover: none), (pointer: coarse)";
const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Horizontal smooth scroll with a "fake-vertical" pinned section.
 *
 * Desktop: Locomotive Scroll v5 (Lenis under the hood) scrolls the window along x, so GSAP
 * ScrollTrigger works natively with `horizontal: true` — no scrollerProxy needed like the v4
 * approach. The experience panel is pinned while its inner column translates on y.
 * Mobile: the same markup stacks vertically and Locomotive runs in its default orientation.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const ready = useScrollStore((s) => s.ready);

  useGSAP(
    () => {
      if (!ready) return;
      const store = useScrollStore.getState();
      const mm = gsap.matchMedia();

      mm.add({ desktop: DESKTOP, mobile: MOBILE, reduced: REDUCED }, (context) => {
        const { desktop, reduced } = context.conditions as Record<string, boolean>;
        const horizontal = desktop;
        const cleanups: Array<() => void> = [];

        window.scrollTo(0, 0);
        store.setOrientation(horizontal ? "horizontal" : "vertical");
        ScrollTrigger.defaults({ horizontal });

        const loco = new LocomotiveScroll({
          lenisOptions: {
            orientation: horizontal ? "horizontal" : "vertical",
            gestureOrientation: horizontal ? "both" : "vertical",
            smoothWheel: !reduced,
            lerp: 0.085,
            wheelMultiplier: horizontal ? 1.15 : 1,
          },
          scrollCallback: ({ progress, scroll, direction }) => {
            ScrollTrigger.update();
            useScrollStore.getState().setScroll({ progress, scroll, direction });
          },
          // Drive Lenis from GSAP's ticker so scrubbed tweens and the scroll share one frame.
          initCustomTicker: (render) => gsap.ticker.add(render),
          destroyCustomTicker: (render) => gsap.ticker.remove(render),
        });
        gsap.ticker.lagSmoothing(0);

        store.registerScrollTo((target, options) =>
          loco.scrollTo(target, { duration: 1.6, immediate: options?.immediate || reduced }),
        );

        // --- Fake-vertical section ------------------------------------------------------------
        // Pinned while the horizontal scroll keeps going; its column travels up instead.
        if (horizontal) {
          const panel = document.querySelector<HTMLElement>("[data-fake-vertical]");
          const track = panel?.querySelector<HTMLElement>("[data-fake-vertical-track]");

          if (panel && track) {
            const distance = () => Math.max(0, track.scrollHeight - window.innerHeight);
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                id: "fake-vertical",
                trigger: panel,
                start: "left left",
                end: () => `+=${distance()}`,
                pin: true,
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
            tl.to(track, { y: () => -distance() }, 0);
          }
        }

        // --- Active section ---------------------------------------------------------------------
        gsap.utils.toArray<HTMLElement>("[data-section]").forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: horizontal ? "left center" : "top center",
            end: horizontal ? "right center" : "bottom center",
            onToggle: (self) => {
              if (self.isActive) store.setActiveSection(el.dataset.section as SectionId);
            },
          });
        });

        // --- Intro + reveals ------------------------------------------------------------------
        if (!reduced) {
          const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
          gsap.utils.toArray<HTMLElement>("[data-intro-split]").forEach((el, i) => {
            // Words are "inked" in: a small drop and rotation, like letters set down by hand.
            const split = SplitText.create(el, { type: "words" });
            intro.from(
              split.words,
              { autoAlpha: 0, yPercent: 40, rotation: 4, duration: 1, stagger: 0.07 },
              i * 0.18,
            );
          });
          intro.from("[data-intro-fade]", { autoAlpha: 0, y: 16, duration: 1, stagger: 0.08 }, 0.5);

          gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
            SplitText.create(el, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 105,
                  duration: 1.2,
                  stagger: 0.07,
                  ease: "expo.out",
                  scrollTrigger: {
                    trigger: el,
                    start: horizontal ? "left 88%" : "top 88%",
                    once: true,
                  },
                }),
            });
          });
        }

        // --- Highlighter swipes + stat rings --------------------------------------------------
        gsap.utils.toArray<HTMLElement>("[data-lit]").forEach((el) => {
          if (reduced) return el.classList.add("is-lit");
          ScrollTrigger.create({
            trigger: el,
            start: horizontal ? "left 80%" : "top 80%",
            once: true,
            onEnter: () => el.classList.add("is-lit"),
          });
        });

        // --- One drop -------------------------------------------------------------------------
        cleanups.push(playInk({ horizontal, reduced }));

        // Keyboard: down/up keys should move along the x-axis too.
        const onKey = (e: KeyboardEvent) => {
          if (!horizontal || e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
          const tag = (e.target as HTMLElement | null)?.tagName;
          if (tag === "INPUT" || tag === "TEXTAREA") return;
          const lenis = loco.lenisInstance;
          if (!lenis) return;
          const step = window.innerWidth * 0.6;
          const delta: Record<string, number> = {
            ArrowDown: step / 2,
            ArrowUp: -step / 2,
            PageDown: step,
            PageUp: -step,
            " ": e.shiftKey ? -step : step,
          };
          if (e.key === "Home") lenis.scrollTo(0);
          else if (e.key === "End") lenis.scrollTo(lenis.limit);
          else if (e.key in delta) lenis.scrollTo(lenis.targetScroll + delta[e.key]);
          else return;
          e.preventDefault();
        };
        window.addEventListener("keydown", onKey);
        cleanups.push(() => window.removeEventListener("keydown", onKey));

        // Pin spacing changes the strip's length; let Locomotive re-measure its in-view and
        // parallax offsets whenever ScrollTrigger does (same idea as the v4 pen's `update()`).
        const onRefresh = () => loco.resize();
        ScrollTrigger.addEventListener("refresh", onRefresh);
        ScrollTrigger.refresh();

        return () => {
          ScrollTrigger.removeEventListener("refresh", onRefresh);
          cleanups.forEach((fn) => fn());
          store.registerScrollTo(null);
          loco.destroy();
          document.documentElement.removeAttribute("data-scroll-orientation");
        };
      });

      return () => mm.revert();
    },
    { dependencies: [ready], scope: root },
  );

  return <div ref={root}>{children}</div>;
}
