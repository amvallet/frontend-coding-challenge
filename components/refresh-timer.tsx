"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Text } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"

type RefreshTimerProps = {
  limit?: number
  intervalMs?: number // default 10_000
  align?: "left" | "center" | "right"
}

export default function RefreshTimer({ limit = 10, intervalMs = 10_000, align = "center" }: RefreshTimerProps) {
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ["crypto", "listings", { limit }], [limit])

  const [seconds, setSeconds] = useState<number | null>(null)

  // Track which fetch cycle we've already invalidated for, to avoid repeated invalidations while at 0s.
  const lastUpdatedRef = useRef<number | null>(null)
  const invalidatedForUpdatedAtRef = useRef<number | null>(null)

  useEffect(() => {
    let raf: number | null = null
    let interval: ReturnType<typeof setInterval> | null = null

    const computeAndUpdate = () => {
      const state = queryClient.getQueryState(queryKey)
      const updatedAt = state?.dataUpdatedAt ?? 0
      const hasData = Boolean(updatedAt)

      // When dataUpdatedAt changes, clear the invalidation guard so the next cycle can invalidate again.
      if (updatedAt !== lastUpdatedRef.current) {
        lastUpdatedRef.current = updatedAt
        invalidatedForUpdatedAtRef.current = null
      }

      if (!hasData) {
        setSeconds(null)
        return
      }

      const nextAt = updatedAt + intervalMs
      const remainingMs = Math.max(nextAt - Date.now(), 0)
      const nextSeconds = Math.ceil(remainingMs / 1000)
      setSeconds(nextSeconds)

      if (nextSeconds === 0 && invalidatedForUpdatedAtRef.current !== updatedAt) {
        // Invalidate all related queries to trigger refetch.
        queryClient.invalidateQueries({ queryKey: ["crypto", "listings"] })
        invalidatedForUpdatedAtRef.current = updatedAt
      }
    }

    // Initial run and 1s ticking.
    computeAndUpdate()
    interval = setInterval(() => {
      // Use rAF inside interval to keep UI smooth.
      raf = window.requestAnimationFrame(computeAndUpdate)
    }, 1000)

    return () => {
      if (interval) clearInterval(interval)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [queryClient, queryKey, intervalMs])

  const alignProps =
    align === "left" ? { textAlign: "left" as const } : align === "right" ? { textAlign: "right" as const } : { textAlign: "center" as const }

  return (
    <Text {...alignProps} color="gray.600" className="dark:text-gray-300">
      Next update in: {seconds == null ? "—" : `${seconds}s`}
    </Text>
  )
}
