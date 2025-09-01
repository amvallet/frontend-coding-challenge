"use client"

import { createContext, createElement, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react"

export type ViewStyle = "grid" | "list"

const STORAGE_KEY = "ui-view-style"

function coerce(value: string | null | undefined): ViewStyle {
  return value === "list" ? "list" : "grid"
}

type Ctx = {
  viewStyle: ViewStyle
  setViewStyle: (next: ViewStyle) => void
  setGrid: () => void
  setList: () => void
  toggle: () => void
}

const ViewStyleContext = createContext<Ctx | null>(null)

function useLocalViewStyle(): Ctx {
  const [viewStyle, setViewStyleState] = useState<ViewStyle>("grid")

  useEffect(() => {
    try {
      const fromStorage = (typeof window !== "undefined"
        ? (window.localStorage.getItem(STORAGE_KEY) as ViewStyle | null)
        : null)
      const next = coerce(fromStorage)
      setViewStyleState(next)
    } catch {
      // no-op
    }
  }, [])

  const apply = useCallback((next: ViewStyle) => {
    setViewStyleState(next)
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next)
      }
    } catch {
      // ignore write errors
    }
  }, [])

  const setGrid = useCallback(() => apply("grid"), [apply])
  const setList = useCallback(() => apply("list"), [apply])
  const toggle = useCallback(() => apply(viewStyle === "grid" ? "list" : "grid"), [apply, viewStyle])

  return useMemo(() => ({ viewStyle, setViewStyle: apply, setGrid, setList, toggle }), [apply, setGrid, setList, toggle, viewStyle])
}

export function ViewStyleProvider({ children }: { children: ReactNode }) {
  const value = useLocalViewStyle()
  return createElement(ViewStyleContext.Provider, { value }, children)
}

export function useViewStyle(): Ctx {
  const ctx = useContext(ViewStyleContext)
  if (!ctx) throw new Error("useViewStyle must be used within ViewStyleProvider")
  return ctx
}
