"use client";

import type { ReactNode } from "react";
import { sections, type SectionId } from "@/data/profile";
import { useScrollStore } from "@/store/use-scroll-store";
import { cn } from "@/lib/cn";

/*
 * App-style bottom tab bar for the stacked (touch / narrow) layout, following Playnix's
 * BottomNav: fixed to the bottom, icon over label, a sliding accent bar on the active tab and
 * safe-area padding for the home indicator. Hidden in the mouse "strip" layout (`md:`), where
 * the header nav is used instead.
 */

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const ICONS: Record<Exclude<SectionId, "index">, ReactNode> = {
  about: (
    <>
      <circle cx="12" cy="8.2" r="3.6" {...stroke} />
      <path d="M4.8 20.2c.8-3.9 3.6-6 7.2-6s6.4 2.1 7.2 6" {...stroke} />
    </>
  ),
  skills: (
    <>
      <path d="M14.6 5.2a4 4 0 0 0 4.9 4.9l-8.8 8.8a2.2 2.2 0 1 1-3.1-3.1l8.8-8.8" {...stroke} />
      <path d="M5.1 5.1l3 3M4 8.3l2.3-.1.1-2.3" {...stroke} />
    </>
  ),
  experience: (
    <>
      <rect x="3.6" y="7.4" width="16.8" height="12" rx="2.4" {...stroke} />
      <path
        d="M9 7.4V5.9c0-.9.7-1.6 1.6-1.6h2.8c.9 0 1.6.7 1.6 1.6v1.5M3.6 12.6h16.8"
        {...stroke}
      />
    </>
  ),
  projects: (
    <>
      <path
        d="M3.8 7.2c0-1 .8-1.8 1.8-1.8h3.6l1.9 2.1h7.3c1 0 1.8.8 1.8 1.8v8.5c0 1-.8 1.8-1.8 1.8H5.6c-1 0-1.8-.8-1.8-1.8z"
        {...stroke}
      />
    </>
  ),
  contact: (
    <>
      <rect x="3.4" y="5.6" width="17.2" height="12.8" rx="2.2" {...stroke} />
      <path d="M4.2 7l7.8 6 7.8-6" {...stroke} />
    </>
  ),
};

const TABS = sections.filter((s) => s.id !== "index") as Array<{
  id: Exclude<SectionId, "index">;
  label: string;
}>;

export function BottomNav() {
  const active = useScrollStore((s) => s.activeSection);
  const scrollTo = useScrollStore((s) => s.scrollTo);
  const index = TABS.findIndex((t) => t.id === active);

  return (
    <nav
      data-bottom-nav
      aria-label="Sections"
      className="fixed inset-x-0 bottom-0 z-50 bg-paper/95 pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] backdrop-blur-md md:hidden"
    >
      {/* Pencil rule along the top edge. */}
      <svg
        viewBox="0 0 400 6"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -top-0.5 h-1.5 w-full text-ink/20"
        aria-hidden
      >
        <path
          d="M0 3 q 25 -2.6 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <ul className="relative flex h-16 items-stretch">
        {/* Active marker: one bar that slides between tabs (CSS, no animation library). */}
        <span
          aria-hidden
          className={cn(
            "absolute top-0 left-0 flex h-0.75 justify-center transition-[translate,opacity] duration-500 ease-out-expo",
            index < 0 && "opacity-0",
          )}
          style={{ width: `${100 / TABS.length}%`, translate: `${Math.max(0, index) * 100}% 0` }}
        >
          <span className="h-full w-8 rounded-full bg-signal" />
        </span>

        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <li key={tab.id} className="flex-1">
              <a
                href={`#${tab.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(`#${tab.id}`);
                }}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex size-full flex-col items-center justify-center gap-1 transition-colors duration-300 select-none active:scale-95",
                  isActive ? "text-ink" : "text-ink-soft",
                )}
              >
                <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
                  {ICONS[tab.id]}
                </svg>
                <span className="font-head text-[0.72rem] leading-none font-bold">{tab.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
