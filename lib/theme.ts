/**
 * Theme preference shared by the no-flash bootstrap script and the toggle.
 * "system" is represented by the *absence* of the attribute, so the
 * prefers-color-scheme rules in globals.css stay in charge by default.
 */

export const THEME_STORAGE_KEY = "theme";

export type ThemePreference = "system" | "light" | "dark";

export type ThemeOption = {
  readonly value: ThemePreference;
  readonly label: string;
  /** Screen-reader text, since the labels are single glyphs. */
  readonly description: string;
};

export const THEME_OPTIONS: readonly ThemeOption[] = [
  { value: "system", label: "Auto", description: "Follow the operating system" },
  { value: "light", label: "Light", description: "Always light" },
  { value: "dark", label: "Dark", description: "Always dark" },
];

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

/**
 * Runs synchronously while the HTML is parsed, before the first paint, so an
 * explicit choice never flashes the system theme first. It has to be a string
 * rather than an imported function: React would not run it until hydration,
 * which is exactly the frame we are trying to avoid.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}`;
