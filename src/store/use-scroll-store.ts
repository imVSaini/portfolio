import { create } from "zustand";
import type { SectionId } from "@/data/profile";

type ScrollTarget = string | number | HTMLElement;
type ScrollToFn = (target: ScrollTarget, options?: { immediate?: boolean }) => void;

type ScrollState = {
  /** Preloader finished and fonts are in — safe to measure and animate. */
  ready: boolean;
  /** Desktop runs horizontally; below `md` the page falls back to a vertical flow. */
  orientation: "horizontal" | "vertical";
  activeSection: SectionId;
  /** 0 → 1 across the whole document. Updated every frame — read it with `subscribe`, not a hook. */
  progress: number;
  /** Scroll offset in px along the active axis, and 1 / -1 for forward / back. */
  scroll: number;
  direction: number;
  menuOpen: boolean;
  scrollTo: ScrollToFn;

  setReady: () => void;
  setOrientation: (orientation: ScrollState["orientation"]) => void;
  setActiveSection: (id: SectionId) => void;
  setScroll: (values: { progress: number; scroll: number; direction: number }) => void;
  setMenuOpen: (open: boolean) => void;
  registerScrollTo: (fn: ScrollToFn | null) => void;
};

const nativeScrollTo: ScrollToFn = (target) => {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (typeof el === "number") window.scrollTo({ top: el });
  else el?.scrollIntoView({ behavior: "smooth" });
};

export const useScrollStore = create<ScrollState>()((set) => ({
  ready: false,
  orientation: "horizontal",
  activeSection: "index",
  progress: 0,
  scroll: 0,
  direction: 0,
  menuOpen: false,
  scrollTo: nativeScrollTo,

  setReady: () => set({ ready: true }),
  setOrientation: (orientation) => set({ orientation }),
  setActiveSection: (activeSection) => set({ activeSection }),
  setScroll: ({ progress, scroll, direction }) => set({ progress, scroll, direction }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  registerScrollTo: (fn) => set({ scrollTo: fn ?? nativeScrollTo }),
}));
