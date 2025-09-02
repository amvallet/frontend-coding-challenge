"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { HStack, IconButton, Text } from "@chakra-ui/react"
import { useIsFetching, useQueryClient } from "@tanstack/react-query"
import { LuRefreshCw } from "react-icons/lu"

type RefreshTimerProps = {
  intervalMs?: number // default 10_000
  align?: "left" | "center" | "right"
}

export default function RefreshTimer({ intervalMs = 10_000, align = "center" }: RefreshTimerProps) {
  const queryClient = useQueryClient()
  // Track listings by prefix so pagination (start) doesn't break the timer.
  const listingsKeyPrefix = useMemo(() => ["crypto", "listings"] as const, [])

  const [seconds, setSeconds] = useState<number | null>(null)
  const [locked, setLocked] = useState(false)

  // Track which fetch cycle we've already invalidated for, to avoid repeated invalidations while at 0s.
  const lastUpdatedRef = useRef<number | null>(null)
  const invalidatedForUpdatedAtRef = useRef<number | null>(null)

  useEffect(() => {
    let raf: number | null = null
    let interval: ReturnType<typeof setInterval> | null = null

    const computeAndUpdate = () => {
      // Consider ALL listings queries (different pages) and use the most recent update time.
      const entries = queryClient.getQueriesData<unknown>({ queryKey: listingsKeyPrefix, type: 'active' })
      const updatedAts = entries.map(([key]) => queryClient.getQueryState(key)?.dataUpdatedAt ?? 0)
      const latestUpdatedAt = updatedAts.length ? Math.max(...updatedAts) : 0
      const hasData = latestUpdatedAt > 0

      // When dataUpdatedAt changes, clear the invalidation guard so the next cycle can invalidate again.
      if (latestUpdatedAt !== lastUpdatedRef.current) {
        lastUpdatedRef.current = latestUpdatedAt
        invalidatedForUpdatedAtRef.current = null
      }

      if (!hasData) {
        setSeconds(null)
        return
      }

      const nextAt = latestUpdatedAt + intervalMs
      const remainingMs = Math.max(nextAt - Date.now(), 0)
      const nextSeconds = Math.ceil(remainingMs / 1000)
      setSeconds(nextSeconds)

      if (nextSeconds === 0 && invalidatedForUpdatedAtRef.current !== latestUpdatedAt) {
        // Invalidate all related queries to trigger refetch.
        queryClient.invalidateQueries({ queryKey: listingsKeyPrefix, type: 'active' })
        invalidatedForUpdatedAtRef.current = latestUpdatedAt
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
  }, [queryClient, listingsKeyPrefix, intervalMs])

  const justify = align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center"
  const isRefreshing = useIsFetching({ queryKey: listingsKeyPrefix, type: 'active' }) > 0

  const handleRefresh = async () => {
    if (locked) return
    setLocked(true)
    try {
      // Manually refetch only active queries and await completion
      await queryClient.refetchQueries({ queryKey: listingsKeyPrefix, type: 'active' })
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
