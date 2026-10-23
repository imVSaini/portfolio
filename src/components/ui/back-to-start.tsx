"use client";

import { useScrollStore } from "@/store/use-scroll-store";

export function BackToStart() {
  const scrollTo = useScrollStore((s) => s.scrollTo);
  const orientation = useScrollStore((s) => s.orientation);

  return (
    <button
      type="button"
      onClick={() => scrollTo(0)}
      className="text-left text-paper md:text-right"
    >
      <span className="link-line">Back to start</span> {orientation === "horizontal" ? "←" : "↑"}
    </button>
  );
}
