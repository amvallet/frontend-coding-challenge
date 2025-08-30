"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"

export type CryptoListingsResponse = unknown

async function fetchCryptoListings(
  limit: number,
): Promise<CryptoListingsResponse> {
  const res = await fetch(`/api/crypto?limit=${encodeURIComponent(limit)}`, {
    cache: "no-store",
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Failed to fetch crypto listings (${res.status}): ${text}`)
  }
  return res.json()
}

export function useCryptoListings(limit = 10) {
  return useQuery({
    queryKey: ["crypto", "listings", { limit }],
    queryFn: () => fetchCryptoListings(limit),
    placeholderData: keepPreviousData,
  })
}
