import { useCallback, useEffect, useState } from "react"

export type UiTheme = "light" | "dark"

const STORAGE_KEY = "ui-theme"
const ATTRIBUTE = "data-ui-theme"

function coerceTheme(value: string | null | undefined): UiTheme {
  return value === "dark" ? "dark" : "light"
}

export function useUiTheme() {
  // Default to light; we'll sync from DOM/localStorage after mount
  const [theme, setThemeState] = useState<UiTheme>("light")

  // Sync from current DOM attribute or storage on mount
  useEffect(() => {
    try {
      const fromAttr = (typeof document !== "undefined"
        ? (document.documentElement.getAttribute(ATTRIBUTE) as UiTheme | null)
        : null)
      const fromStorage = (typeof window !== "undefined"
        ? (window.localStorage.getItem(STORAGE_KEY) as UiTheme | null)
        : null)
      // Prefer DOM attribute (set by inline script), then storage, then default
      const next = coerceTheme(fromAttr ?? fromStorage)
      setThemeState(next)
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute(ATTRIBUTE, next)
        // Write cookie so the server can SSR the same theme next time
        try {
          const maxAge = 60 * 60 * 24 * 365 // 1 year
          document.cookie = `ui-theme=${next}; Path=/; Max-Age=${maxAge}`
        } catch {
          /* noop */
        }
      }
    } catch {
      // no-op
    }
  }, [])

  const apply = useCallback((next: UiTheme) => {
    setThemeState(next)
    try {
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute(ATTRIBUTE, next)
      }
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next)
      }
      // Persist to cookie for SSR consistency
      try {
        const maxAge = 60 * 60 * 24 * 365 // 1 year
        if (typeof document !== "undefined") {
          document.cookie = `ui-theme=${next}; Path=/; Max-Age=${maxAge}`
        }
      } catch {
        /* noop */
      }
    } catch {
      // ignore write errors
    }
  }, [])

  const setLight = useCallback(() => apply("light"), [apply])
  const setDark = useCallback(() => apply("dark"), [apply])
  const toggle = useCallback(() => apply(theme === "dark" ? "light" : "dark"), [apply, theme])

  return { theme, setTheme: apply, setLight, setDark, toggle }
}
