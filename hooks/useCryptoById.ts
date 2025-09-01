"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { CryptoListingsResponse } from "./useCryptoListings"

export type Crypto = CryptoListingsResponse["data"][number]

export const cryptoByIdQueryKey = (id: number) => ["crypto", "byId", id] as const

export function useCryptoById(id?: number) {
  const queryClient = useQueryClient()

  return useQuery<Crypto | undefined>({
    queryKey: id != null ? cryptoByIdQueryKey(id) : ["crypto", "byId", "undefined"],
    // Resolve from any cached listings page; no network calls here.
    queryFn: async () => {
      if (id == null) return undefined
      // Look through cached listings pages for the item
      const queries = queryClient.getQueriesData<CryptoListingsResponse>({ queryKey: ["crypto", "listings"] })
      for (const [, data] of queries) {
        const found = data?.data?.find((c) => c.id === id)
        if (found) return found
      }
      // As a final fallback, return whatever may already be set directly on this key
      const direct = queryClient.getQueryData<Crypto>(cryptoByIdQueryKey(id))
      return direct
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: false,
    enabled: id != null,
  })
}
