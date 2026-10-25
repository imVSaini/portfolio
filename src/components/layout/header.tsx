"use client";

import { useEffect, useRef } from "react";
import { profile, sections, type SectionId } from "@/data/profile";
import { useScrollStore } from "@/store/use-scroll-store";
import { cn } from "@/lib/cn";
import { LogoMark } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  const active = useScrollStore((s) => s.activeSection);
  const scrollTo = useScrollStore((s) => s.scrollTo);
  const header = useRef<HTMLElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  // Transient store reads: progress line every frame, and on mobile tuck the bar away while
  // reading forward, bring it back on reverse.
  useEffect(
    () =>
      useScrollStore.subscribe((state) => {
        const p = Math.min(1, Math.max(0, state.progress));
        if (progress.current) progress.current.style.transform = `scaleX(${p})`;

        const hide =
          state.orientation === "vertical" && state.scroll > 120 && state.direction === 1;
        if (state.direction !== 0 || state.scroll <= 120)
          header.current?.classList.toggle("-translate-y-full", hide);
      }),
    [],
  );

  const go = (id: SectionId) => {
    scrollTo(`#${id}`);
  };

  return (
    <>
      <header
        ref={header}
        className="fixed inset-x-0 top-0 z-50 bg-paper/85 pt-[env(safe-area-inset-top)] backdrop-blur-md transition-transform duration-500 ease-out-expo"
      >
        <div className="flex h-(--header-h) items-center gap-3 pr-[max(6vw,env(safe-area-inset-right))] pl-[max(6vw,env(safe-area-inset-left))] md:gap-8 md:px-[5vw]">
          <a
            href="#index"
            onClick={(e) => {
              e.preventDefault();
              go("index");
            }}
            className="group flex items-center gap-3"
            aria-label={`${profile.name} — back to start`}
          >
            <LogoMark className="size-10.5 shrink-0" />
            <span className="flex flex-col leading-none max-[22rem]:hidden">
              <span className="font-head text-[1.2rem] font-bold tracking-tight">
                {profile.name.replace(" Kumar", "")}
              </span>
              <span className="mt-0.5 font-hand text-[1.05rem] text-ink-soft">
                {profile.role.toLowerCase()}
              </span>
            </span>
          </a>

          <NavLinks active={active} onNavigate={go} />

          <ThemeToggle className="ml-auto md:ml-0" />
        </div>

        {/* A wobbly pencil rule under the bar; the ink stroke over it is the scroll progress. */}
        <div className="absolute inset-x-0 -bottom-1 h-2.5">
          <PencilRule className="text-ink/25" />
          <span
            ref={progress}
            className="absolute inset-0 block origin-left"
            style={{ transform: "scaleX(0)" }}
          >
            <PencilRule className="text-ink" strong />
          </span>
        </div>
      </header>
    </>
  );
}

function NavLinks({
  active,
  onNavigate,
}: {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
}) {
  return (
    <nav aria-label="Sections" className="ml-auto hidden md:block">
      <ul className="flex gap-7">
        {sections.slice(1).map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(s.id);
                }}
                aria-current={isActive ? "true" : undefined}
                className="group relative block py-1 font-head text-[1.0625rem]"
              >
                {s.label}
                <svg
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1.5 left-[-6%] h-2.5 w-[112%] overflow-visible text-signal"
                  aria-hidden
                >
                  <path
                    d="M2 7.5 C 22 3.5, 58 2, 98 4"
                    pathLength={1}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    strokeDasharray={1}
                    className={cn(
                      "transition-[stroke-dashoffset] duration-500 ease-out-expo",
                      isActive
                        ? "[stroke-dashoffset:0]"
                        : "[stroke-dashoffset:1] group-hover:[stroke-dashoffset:0]",
                    )}
                  />
                </svg>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// A long, slightly irregular wave (deterministic) so the rule reads as drawn by hand.
const RULE = (() => {
  let d = "M0 5";
  for (let x = 0; x < 1000; x += 40) {
    const lift = 3.2 + Math.sin(x * 0.37) * 1.4;
    d += ` q 20 ${(-lift).toFixed(2)} 40 0`;
  }
  return d;
})();

function PencilRule({ className, strong = false }: { className?: string; strong?: boolean }) {
  return (
    <svg
      viewBox="0 0 1000 10"
      preserveAspectRatio="none"
      className={cn("absolute inset-0 size-full overflow-visible", className)}
      aria-hidden
    >
      <path
        d={RULE}
        fill="none"
        stroke="currentColor"
        strokeWidth={strong ? 2.2 : 1.4}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
