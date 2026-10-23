"use client";

import { useEffect, useState } from "react";
import { useThemeStore } from "@/store/use-theme-store";
import { cn } from "@/lib/cn";

function Sun({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 1.5v2M12 20.5v2M22.5 12h-2M3.5 12h-2M19.4 4.6l-1.4 1.4M6 18l-1.4 1.4M19.4 19.4 18 18M6 6 4.6 4.6" />
    </svg>
  );
}

function Moon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.5 14.8A9 9 0 1 1 9.2 3.5a7.2 7.2 0 0 0 11.3 11.3Z" />
    </svg>
  );
}

const EASE = "ease-out-expo";

/**
 * Sliding switch. Knob position and icon states are driven by `in-data-[theme=dark]:` (the <html data-theme>
 * attribute set before paint), so the first render is already correct and nothing slides on load.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const mode = useThemeStore((s) => s.mode);
  const init = useThemeStore((s) => s.init);
  // Transitions switch on only after mount, so the knob never animates into place on load.
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const stop = init();
    const id = requestAnimationFrame(() => setArmed(true));
    return () => {
      stop();
      cancelAnimationFrame(id);
    };
  }, [init]);

  const dark = theme === "dark";
  const next = dark ? "light" : "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={`Switch to ${next} theme`}
      title={`${dark ? "Dark" : "Light"} theme${mode === "system" ? " (system)" : ""}`}
      onClick={() => setTheme(next)}
      className={cn(
        "group relative inline-flex h-7 w-13.5 shrink-0 items-center rounded-full border-[1.5px] border-ink/25 bg-paper-dim/70 px-0.5 transition-colors duration-300 hover:border-ink/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal focus-visible:outline-solid",
        className,
      )}
    >
      {/* Track icons — the one under the knob fades out. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-between px-1.75 text-ink-soft"
      >
        <Sun className="size-3 opacity-0 transition-opacity duration-300 in-data-[theme=dark]:opacity-100" />
        <Moon className="size-3 opacity-100 transition-opacity duration-300 in-data-[theme=dark]:opacity-0" />
      </span>

      {/* Knob — slides across and swaps its icon with a small turn. */}
      <span
        aria-hidden
        className={cn(
          "relative grid size-5.5 place-items-center rounded-full bg-ink text-paper shadow-[0_1px_2px_rgb(0_0_0/0.25)] in-data-[theme=dark]:translate-x-6.25",
          armed && "transition-transform duration-500",
          EASE,
        )}
      >
        <Sun
          className={cn(
            "absolute size-3 transition-[opacity,rotate,scale] duration-500 in-data-[theme=dark]:scale-50 in-data-[theme=dark]:-rotate-90 in-data-[theme=dark]:opacity-0",
            EASE,
          )}
        />
        <Moon
          className={cn(
            "absolute size-3 scale-50 rotate-90 opacity-0 transition-[opacity,rotate,scale] duration-500 in-data-[theme=dark]:scale-100 in-data-[theme=dark]:rotate-0 in-data-[theme=dark]:opacity-100",
            EASE,
          )}
        />
      </span>
    </button>
  );
}
