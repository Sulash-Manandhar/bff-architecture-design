"use client";

import { useSyncExternalStore } from "react";
import {
  isThemePreference,
  THEME_OPTIONS,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from "@/lib/theme";

const DEFAULT_PREFERENCE: ThemePreference = "system";

/**
 * localStorage is an external store, so the preference is read through
 * useSyncExternalStore rather than mirrored into component state. That keeps
 * hydration correct — the server snapshot renders first, the stored value
 * replaces it immediately after — without a setState-in-effect round trip.
 */
const listeners = new Set<() => void>();

function subscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);
  // Keeps two open tabs in step.
  window.addEventListener("storage", onStoreChange);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);

    return isThemePreference(stored) ? stored : DEFAULT_PREFERENCE;
  } catch {
    // Private mode and blocked site data both throw here; the system theme is a fine fallback.
    return DEFAULT_PREFERENCE;
  }
}

function getServerSnapshot(): ThemePreference {
  return DEFAULT_PREFERENCE;
}

function selectPreference(preference: ThemePreference): void {
  const root = document.documentElement;

  if (preference === "system") {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = preference;
  }

  try {
    if (preference === "system") {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, preference);
    }
  } catch (error) {
    // A theme that does not survive a reload still beats a broken click.
    console.error("Could not persist the theme preference", error);
  }

  listeners.forEach((notify) => notify());
}

export function ThemeToggle() {
  const preference = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="fixed right-4 top-4 z-50 flex gap-0.5 rounded-lg border border-border bg-surface p-0.5 shadow-sm"
    >
      {THEME_OPTIONS.map((option) => {
        const isSelected = option.value === preference;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            title={option.description}
            onClick={() => selectPreference(option.value)}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              isSelected ? "bg-surface-muted text-accent" : "text-muted hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
