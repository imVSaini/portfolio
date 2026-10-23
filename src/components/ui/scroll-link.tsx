"use client";

import type { ReactNode } from "react";
import type { SectionId } from "@/data/profile";
import { useScrollStore } from "@/store/use-scroll-store";

/** Anchor that glides to a section through the active scroll engine. */
export function ScrollLink({
  to,
  className,
  children,
}: {
  to: SectionId;
  className?: string;
  children: ReactNode;
}) {
  const scrollTo = useScrollStore((s) => s.scrollTo);
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        scrollTo(`#${to}`);
      }}
    >
      {children}
    </a>
  );
}
