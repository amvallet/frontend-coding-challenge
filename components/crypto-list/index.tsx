"use client"

import { useEffect, useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { GridPlaceholder, ListPlaceholder } from "./list-placeholder"
import GridView from "./grid-view"
import ListView from "./list-view"
import type { CryptoItem, SortKey } from "./types"
import PageFrame from "./page-frame"
import ErrorAlert from "./error-alert"

import { useCryptoListings, cryptoListingsQueryOptions } from "../../hooks/useCryptoListings"
import { useViewStyle } from "../../hooks/useViewStyle"
import { cryptoByIdQueryKey } from "../../hooks/useCryptoById"
import CryptoDetailDialog from "../crypto-detail-dialog"
import { makeFuzzyRegex } from "../../lib/text"

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
      <PageFrame
        query={query}
        onQueryChange={setQuery}
        sortKey={sortKey}
        onSortChange={setSortKey}
        showPrev={page > 1}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
        onHoverPrev={() => prefetchPage(page - 1)}
        onHoverNext={() => prefetchPage(page + 1)}
        align="center"
     >
        {viewStyle === "list" ? (
          <ListPlaceholder count={skeletonCount} />
        ) : (
          <GridPlaceholder count={skeletonCount} />
        )}
      </PageFrame>
    )
  }

  if (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return (
      <PageFrame
        query={query}
        onQueryChange={setQuery}
        sortKey={sortKey}
        onSortChange={setSortKey}
        showPrev={page > 1}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
        onHoverPrev={() => prefetchPage(page - 1)}
        onHoverNext={() => prefetchPage(page + 1)}
        align="center"
      >
        <ErrorAlert message={message} />
      </PageFrame>
    )
  }

  return (
    <PageFrame
      query={query}
      onQueryChange={setQuery}
      sortKey={sortKey}
      onSortChange={setSortKey}
      showPrev={page > 1}
      onPrev={() => setPage((p) => Math.max(1, p - 1))}
      onNext={() => setPage((p) => p + 1)}
      onHoverPrev={() => prefetchPage(page - 1)}
      onHoverNext={() => prefetchPage(page + 1)}
      align="stretch"
    >
      {viewStyle === "list" ? (
        <ListView items={displayItems} onOpenDetails={openDetails} />
      ) : (
        <GridView items={displayItems} onOpenDetails={openDetails} />
      )}
      <CryptoDetailDialog open={detailOpen} onOpenChange={setDetailOpen} cryptoId={selectedId ?? undefined} />
    </PageFrame>
  )
}
