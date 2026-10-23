"use client";

import { useEffect, useRef } from "react";
import { profile, sections, type SectionId } from "@/data/profile";
import { useScrollStore } from "@/store/use-scroll-store";
import { cn } from "@/lib/cn";

const pad = (n: number) => String(n).padStart(2, "0");

export function Header() {
  const active = useScrollStore((s) => s.activeSection);
  const menuOpen = useScrollStore((s) => s.menuOpen);
  const setMenuOpen = useScrollStore((s) => s.setMenuOpen);
  const scrollTo = useScrollStore((s) => s.scrollTo);
  const header = useRef<HTMLElement>(null);

  // Vertical (mobile) flow: tuck the header away while reading forward, bring it back on reverse.
  useEffect(
    () =>
      useScrollStore.subscribe((state) => {
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

  const go = (id: SectionId) => {
    setMenuOpen(false);
    scrollTo(`#${id}`);
  };

  return (
    <>
      <header
        ref={header}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 text-paper mix-blend-difference transition-transform duration-500 ease-out-expo"
      >
        <div className="flex items-start justify-between px-[4vw] pt-6 md:pt-7">
          <button
            type="button"
            onClick={() => go("index")}
            className="pointer-events-auto text-left"
            aria-label="Back to start"
          >
            <span className="block text-sm leading-tight font-semibold">{profile.name}</span>
            <span className="eyebrow block text-paper/60">{profile.role}</span>
          </button>

          <nav aria-label="Sections" className="pointer-events-auto hidden md:block">
            <ul className="flex gap-7">
              {sections.slice(1).map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(s.id);
                    }}
                    aria-current={active === s.id ? "true" : undefined}
                    className="group flex items-baseline gap-1.5 text-sm"
                  >
                    <span className="eyebrow text-paper/50">{pad(i + 1)}</span>
                    <span
                      className={cn(
                        "link-line transition-opacity duration-300",
                        active === s.id ? "opacity-100" : "opacity-60 group-hover:opacity-100",
                      )}
                    >
                      {s.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href={`mailto:${profile.email}`}
            className="pointer-events-auto hidden text-sm md:inline-block"
          >
            <span className="link-line">Get in touch</span> <span aria-hidden>↗</span>
          </a>

          <button
            type="button"
            className="eyebrow pointer-events-auto py-1 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <MobileMenu open={menuOpen} onNavigate={go} active={active} />
      <ScrollHud active={active} />
    </>
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
        "fixed inset-0 z-40 flex flex-col justify-end bg-ink px-[4vw] pb-10 text-paper transition-[clip-path] duration-700 ease-in-out-quart md:hidden",
        open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]",
      )}
    >
      <ul className="space-y-1">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(s.id);
              }}
              className={cn(
                "display flex items-baseline gap-3 text-[15vw]",
                active === s.id ? "text-signal" : "",
              )}
            >
              <span className="eyebrow text-paper/40">{pad(i)}</span>
              {s.label}
            </a>
          </li>
        ))}
      </ul>
      <a href={`mailto:${profile.email}`} className="mt-10 text-sm text-paper/70">
        {profile.email}
      </a>
    </div>
  );
}

/** Desktop-only footer bar: where you are + how far along. Progress is a transient store read. */
function ScrollHud({ active }: { active: SectionId }) {
  const bar = useRef<HTMLSpanElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const index = sections.findIndex((s) => s.id === active);

  useEffect(
    () =>
      useScrollStore.subscribe((state) => {
        const p = Math.min(1, Math.max(0, state.progress));
        if (bar.current) bar.current.style.transform = `scaleX(${p})`;
        if (pct.current) pct.current.textContent = `${Math.round(p * 100)}%`;
      }),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 hidden px-[4vw] pb-6 text-paper mix-blend-difference md:block">
      <div className="flex items-center justify-between gap-8">
        <p className="eyebrow flex gap-3">
          <span className="tabular-nums">
            {pad(index)} / {pad(sections.length - 1)}
          </span>
          <span className="text-paper/60">{sections[index]?.label}</span>
        </p>
        <div className="flex items-center gap-4">
          <span className="relative block h-px w-40 overflow-hidden bg-paper/25">
            <span
              ref={bar}
              className="absolute inset-0 origin-left bg-paper"
              style={{ transform: "scaleX(0)" }}
            />
          </span>
          <span ref={pct} className="eyebrow w-10 text-right tabular-nums">
            0%
          </span>
        </div>
      </div>
    </div>
  );
}
