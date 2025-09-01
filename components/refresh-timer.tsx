"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { HStack, IconButton, Text } from "@chakra-ui/react"
import { useIsFetching, useQueryClient } from "@tanstack/react-query"
import { LuRefreshCw } from "react-icons/lu"

type RefreshTimerProps = {
  limit?: number
  intervalMs?: number // default 10_000
  align?: "left" | "center" | "right"
}

export default function RefreshTimer({ limit = 10, intervalMs = 10_000, align = "center" }: RefreshTimerProps) {
  const queryClient = useQueryClient()
  const queryKey = useMemo(() => ["crypto", "listings", { limit }], [limit])

  const [seconds, setSeconds] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

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

  const justify = align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center"
  const isRefreshing = useIsFetching({ queryKey: ["crypto", "listings"] }) > 0

  const handleRefresh = async () => {
    if (locked) return
    setLocked(true)
    try {
      // Manually refetch active queries and await completion to lock the button until response
      await queryClient.refetchQueries({ queryKey: ["crypto", "listings"] })
    } finally {
      setLocked(false)
    }
  }

  return (
    <HStack justify={justify} gap={2}>
      <Text color="var(--foreground)" opacity={0.8}>
        Next update in: {seconds == null ? "—" : `${seconds}s`}
      </Text>
      <IconButton
        aria-label="Refresh now"
        size="sm"
        variant="ghost"
        onClick={handleRefresh}
        color="var(--foreground)"
        disabled={locked || isRefreshing}
        aria-busy={isRefreshing}
      >
        <LuRefreshCw className={isRefreshing ? "ui-spin" : undefined} />
      </IconButton>
    </HStack>
  )
}
