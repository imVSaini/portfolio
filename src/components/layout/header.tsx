"use client";

import { useEffect, useRef } from "react";
import { profile, sections, type SectionId } from "@/data/profile";
import { useScrollStore } from "@/store/use-scroll-store";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const pad = (n: number) => String(n).padStart(2, "0");

export function Header() {
  const active = useScrollStore((s) => s.activeSection);
  const menuOpen = useScrollStore((s) => s.menuOpen);
  const setMenuOpen = useScrollStore((s) => s.setMenuOpen);
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
          state.orientation === "vertical" &&
          !state.menuOpen &&
          state.scroll > 120 &&
          state.direction === 1;
        if (state.direction !== 0 || state.scroll <= 120)
          header.current?.classList.toggle("-translate-y-full", hide);
      }),
    [],
  );

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, setMenuOpen]);

  const go = (id: SectionId) => {
    setMenuOpen(false);
    scrollTo(`#${id}`);
  };

  return (
    <>
      <header
        ref={header}
        className="fixed inset-x-0 top-0 z-50 bg-paper/85 backdrop-blur-md transition-transform duration-500 ease-out-expo"
      >
        <div className="flex h-(--header-h) items-center gap-3 px-[6vw] md:gap-8 md:px-[5vw]">
          <a
            href="#index"
            onClick={(e) => {
              e.preventDefault();
              go("index");
            }}
            className="flex items-center gap-2"
            aria-label={`${profile.name} — back to start`}
          >
            <span className="grid size-11 place-items-center rounded-blob border-2 border-ink bg-signal font-hand text-3xl leading-none font-bold text-paper">
              {profile.firstName[0]}
            </span>
            <span className="font-head text-[1.4rem] font-bold tracking-wide max-[22rem]:hidden">
              {profile.firstName.toLowerCase()}
              <span className="text-signal">.saini</span>
            </span>
          </a>

          <NavLinks active={active} onNavigate={go} />

          <ThemeToggle className="ml-auto md:ml-0" />

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="relative z-10 flex size-11.5 flex-col justify-between rounded-sketchy border-2 border-ink bg-card p-2.5 md:hidden"
          >
            <span
              className={cn(
                "block h-0.5 rounded bg-ink transition-transform duration-300",
                menuOpen && "translate-y-2.5 rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-[70%] rounded bg-ink transition-opacity",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-0.5 rounded bg-ink transition-transform duration-300",
                menuOpen && "-translate-y-2.5 -rotate-45",
              )}
            />
          </button>
        </div>

        {/* Scroll progress, drawn like a pencil line under the bar. */}
        <div className="absolute inset-x-0 bottom-0 h-0.75">
          <span
            ref={progress}
            className="block h-full origin-left rounded-r bg-ink"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </header>

      <MobileMenu open={menuOpen} onNavigate={go} active={active} />
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

function MobileMenu({
  open,
  active,
  onNavigate,
}: {
  open: boolean;
  active: SectionId;
  onNavigate: (id: SectionId) => void;
}) {
  return (
    <div
      id="mobile-menu"
      inert={!open}
      className={cn(
        "fixed inset-0 z-40 flex flex-col justify-between bg-paper px-[8vw] pt-[calc(var(--header-h)+30px)] pb-10 transition-[clip-path,visibility] duration-700 ease-in-out-quart md:hidden",
        open
          ? "visible [clip-path:circle(150%_at_calc(100%-40px)_38px)]"
          : "invisible [clip-path:circle(0%_at_calc(100%-40px)_38px)]",
      )}
    >
      <ul className="flex flex-col gap-1">
        {sections.slice(1).map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(s.id);
              }}
              className={cn(
                "font-hand text-[clamp(2.6rem,11vw,4rem)] leading-[1.1] font-bold",
                active === s.id && "text-signal",
              )}
            >
              <span className="mr-3 text-[0.5em] text-mineral">{pad(i + 1)}</span>
              {s.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="font-hand text-[1.4rem] text-mineral">
        say hi →{" "}
        <a
          className="text-ink underline decoration-signal decoration-2 underline-offset-4"
          href={`mailto:${profile.email}`}
        >
          {profile.email}
        </a>
      </p>
    </div>
  );
}
