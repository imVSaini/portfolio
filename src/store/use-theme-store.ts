import { create } from "zustand";

export type Theme = "light" | "dark";
/** "system" = no saved choice; the site follows the OS setting, live. */
export type ThemeMode = Theme | "system";

export const THEME_KEY = "theme";

const DARK_QUERY = "(prefers-color-scheme: dark)";

type ThemeState = {
  /** The theme actually on screen. */
  theme: Theme;
  mode: ThemeMode;
  /** Reads what the inline boot script applied and starts following the OS while in "system". */
  init: () => () => void;
  setTheme: (theme: Theme) => void;
};

const systemTheme = (): Theme => (matchMedia(DARK_QUERY).matches ? "dark" : "light");

const apply = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#141413" : "#faf9f5");
};

const readSaved = (): Theme | null => {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null;
  }
};

const writeSaved = (theme: Theme | null) => {
  try {
    if (theme) localStorage.setItem(THEME_KEY, theme);
    else localStorage.removeItem(THEME_KEY);
  } catch {
    // Private mode or blocked storage — the choice just won't persist.
  }
};

export const useThemeStore = create<ThemeState>()((set, get) => ({
  theme: "light",
  mode: "system",

  init: () => {
    const saved = readSaved();
    set({
      mode: saved ?? "system",
      theme: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    });

    const media = matchMedia(DARK_QUERY);
    const onChange = () => {
      if (get().mode !== "system") return;
      const theme = systemTheme();
      apply(theme);
      set({ theme });
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  },

  // Picking the theme the OS already uses drops the override, so the site goes back to
  // following the system. Picking the other one saves it.
  setTheme: (theme) => {
    const mode: ThemeMode = theme === systemTheme() ? "system" : theme;
    writeSaved(mode === "system" ? null : theme);
    apply(theme);
    set({ theme, mode });
  },
}));

/**
 * Runs in <head> before first paint so there is no flash of the wrong theme.
 * Saved choice wins; otherwise follow the OS setting (the default).
 */
export const themeBootScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("${DARK_QUERY}").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})();`;
