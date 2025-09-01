"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

export type CryptoListingsResponse = {
  data: Array<{
    id: number
    name: string
    symbol: string
    quote?: {
      USD?: {
        price?: number
        volume_24h?: number
        volume_change_24h?: number
        percent_change_1h?: number
        percent_change_24h?: number
        percent_change_7d?: number
        percent_change_30d?: number
        percent_change_60d?: number
        percent_change_90d?: number
        market_cap?: number
        market_cap_dominance?: number
        fully_diluted_market_cap?: number
        tvl?: number | null
      }
    }
  }>
}

async function fetchCryptoListings(
  limit: number,
  start: number,
): Promise<CryptoListingsResponse> {
  const params = new URLSearchParams()
  params.set("limit", String(limit))
  params.set("start", String(start))

  const res = await fetch(`/api/crypto?${params.toString()}`, {
    cache: "no-store",
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Failed to fetch crypto listings (${res.status}): ${text}`)
  }
  return res.json()
}

export function useCryptoListings(params: { limit?: number; start?: number } = {}) {
  const { limit = 10, start = 1 } = params
  return useQuery<CryptoListingsResponse>({
    queryKey: ["crypto", "listings", { limit, start }],
    queryFn: () => fetchCryptoListings(limit, start),
    placeholderData: keepPreviousData,
  })
}

export function cryptoListingsQueryOptions(params: { start?: number; limit?: number } = {}) {
  const { limit = 10, start = 1 } = params
  return {
    queryKey: ["crypto", "listings", { limit, start }] as const,
    queryFn: () => fetchCryptoListings(limit, start),
  }
}
