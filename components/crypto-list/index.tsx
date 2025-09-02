"use client"

import { Alert, Box, HStack, IconButton } from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { LuArrowLeft, LuArrowRight } from "react-icons/lu"

import Controls from "./controls"
import { GridPlaceholder, ListPlaceholder } from "./list-placeholder"
import GridView from "./grid-view"
import ListView from "./list-view"
import type { CryptoItem, SortKey } from "./types"

import { useCryptoListings, cryptoListingsQueryOptions } from "../../hooks/useCryptoListings"
import { useViewStyle } from "../../hooks/useViewStyle"
import { cryptoByIdQueryKey } from "../../hooks/useCryptoById"
import CryptoDetailDialog from "../crypto-detail-dialog"

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function makeFuzzyRegex(input: string) {
  const cleaned = escapeRegExp(input.trim())
  const pattern = cleaned.split("").join(".*")
  return new RegExp(pattern, "i")
}

export default function CryptoList() {
  const limit = 10
  const [page, setPage] = useState(1)
  const start = (page - 1) * limit + 1 // 1-based index per API

  const queryClient = useQueryClient()
  const prefetchPage = (targetPage: number) => {
    if (targetPage < 1) return
    const targetStart = (targetPage - 1) * limit + 1
    queryClient.prefetchQuery(cryptoListingsQueryOptions({ start: targetStart, limit }))
  }

  const { data, isLoading, error } = useCryptoListings({ limit, start })
  const { viewStyle } = useViewStyle()

  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("name")

  const items: CryptoItem[] = useMemo(() => (data?.data ?? []) as CryptoItem[], [data])

  const displayItems = useMemo<CryptoItem[]>(() => {
    const q = query.trim()
    let filtered = items
    if (q.length > 0) {
      const re = makeFuzzyRegex(q)
      filtered = items.filter((c) => re.test(c?.name ?? "") || re.test(c?.symbol ?? ""))
    }
    const sorted = [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "name":
          return String(a?.name ?? "").localeCompare(String(b?.name ?? ""))
        case "symbol":
          return String(a?.symbol ?? "").localeCompare(String(b?.symbol ?? ""))
        case "price": {
          const pa = Number(a?.quote?.USD?.price ?? 0)
          const pb = Number(b?.quote?.USD?.price ?? 0)
          return pb - pa
        }
        default:
          return 0
      }
    })
    return sorted
  }, [items, query, sortKey])

  // Seed per-id cache entries so details open instantly without new requests.
  useEffect(() => {
    if (!items?.length) return
    for (const item of items) {
      if (item?.id != null) {
        queryClient.setQueryData(cryptoByIdQueryKey(item.id), item)
      }
    }
  }, [items, queryClient])

  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const openDetails = (id: number) => {
    setSelectedId(id)
    setDetailOpen(true)
  }

  if (isLoading) {
    const skeletonCount = 10
    return (
      <Box px={{ base: 4, md: 8 }} py={6} bg="var(--background)" color="var(--foreground)">
        <Controls
          query={query}
          onQueryChange={setQuery}
          sortKey={sortKey}
          onSortChange={setSortKey}
        />
        <HStack justify="center" align="center" gap={4}>
          {page > 1 ? (
            <IconButton
              my="auto"
              alignSelf="center"
              aria-label="Previous page"
              onMouseEnter={() => prefetchPage(page - 1)}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <LuArrowLeft />
            </IconButton>
          ) : (
            <IconButton
              my="auto"
              alignSelf="center"
              aria-hidden="true"
              tabIndex={-1}
              pointerEvents="none"
              visibility="hidden"
            >
              <LuArrowLeft />
            </IconButton>
          )}
          {viewStyle === "list" ? (
            <ListPlaceholder count={skeletonCount} />
          ) : (
            <GridPlaceholder count={skeletonCount} />
          )}
          <IconButton
            my="auto"
            alignSelf="center"
            aria-label="Next page"
            onMouseEnter={() => prefetchPage(page + 1)}
            onClick={() => setPage((p) => p + 1)}
          >
            <LuArrowRight />
          </IconButton>
        </HStack>
      </Box>
    )
  }

  if (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return (
      <Box px={{ base: 4, md: 8 }} py={6} bg="var(--background)" color="var(--foreground)">
        <Controls
          query={query}
          onQueryChange={setQuery}
          sortKey={sortKey}
          onSortChange={setSortKey}
        />
        <Alert.Root status="error" borderRadius="md">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Request failed</Alert.Title>
            <Alert.Description>{message}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </Box>
    )
  }

  return (
    <Box px={{ base: 4, md: 8 }} py={6} bg="var(--background)" color="var(--foreground)">
      <Controls
        query={query}
        onQueryChange={setQuery}
        sortKey={sortKey}
        onSortChange={setSortKey}
      />
      <HStack justify="center" align="stretch" gap={4}>
        {page > 1 ? (
          <IconButton
            my="auto"
            aria-label="Previous page"
            onMouseEnter={() => prefetchPage(page - 1)}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <LuArrowLeft />
          </IconButton>
        ) : (
          <IconButton
            my="auto"
            aria-hidden="true"
            tabIndex={-1}
            pointerEvents="none"
            visibility="hidden"
          >
            <LuArrowLeft />
          </IconButton>
        )}
        {viewStyle === "list" ? (
          <ListView items={displayItems} onOpenDetails={openDetails} />
        ) : (
          <GridView items={displayItems} onOpenDetails={openDetails} />
        )}
        <IconButton
          my="auto"
          aria-label="Next page"
          onMouseEnter={() => prefetchPage(page + 1)}
          onClick={() => setPage((p) => p + 1)}
        >
          <LuArrowRight />
        </IconButton>
      </HStack>
      <CryptoDetailDialog open={detailOpen} onOpenChange={setDetailOpen} cryptoId={selectedId ?? undefined} />
    </Box>
  )
}
