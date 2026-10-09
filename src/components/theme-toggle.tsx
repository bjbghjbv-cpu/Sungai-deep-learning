"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "sm-theme";

function readTheme(): "dark" | "light" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: "dark" | "light") {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.setAttribute("data-theme", theme);
}

function subscribe(callback: () => void) {
  window.addEventListener("sm-theme-change", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("sm-theme-change", callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): "dark" | "light" {
  return readTheme();
}

function getServerSnapshot(): "dark" | "light" {
  return "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isDark = theme === "dark";

  useLayoutEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const resolved =
      stored === "dark" || stored === "light"
        ? (stored as "dark" | "light")
        : readTheme();
    applyTheme(resolved);
    window.dispatchEvent(new Event("sm-theme-change"));
  }, []);

  function toggle() {
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage tidak tersedia — abaikan.
    }
    window.dispatchEvent(new Event("sm-theme-change"));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Ubah mode terang/gelap"
      aria-pressed={isDark}
      className="grid h-9 w-9 place-items-center rounded-lg border border-line text-muted transition hover:border-foreground/40 hover:text-foreground"
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
