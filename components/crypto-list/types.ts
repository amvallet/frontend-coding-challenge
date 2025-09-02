import type { CryptoListingsResponse } from "../../hooks/useCryptoListings"

export type CryptoItem = CryptoListingsResponse["data"][number]
export type SortKey = "name" | "symbol" | "price"
