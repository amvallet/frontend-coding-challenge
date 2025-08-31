import { NextResponse } from "next/server"

const publicAPIKey = process.env.COINMARKET_API_KEY

interface Crypto {
  id: number
  name: string
  symbol: string
  quote?: {
    USD?: {
      price?: number
    }
  }
}

type BuyPayload = {
  amountUSD: number
  symbol: string
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") || "10"

    const params = new URLSearchParams()
    params.set("limit", limit)

    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?${params.toString()}`

    const response = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": publicAPIKey!,
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.statusText}`)
    }

    const data = await response.json()
    const sortedData: Crypto[] = Array.isArray(data?.data)
      ? [...data.data].sort((a: Crypto, b: Crypto) => a.name.localeCompare(b.name))
      : []
    return NextResponse.json({ data: sortedData })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Something went wrong",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<BuyPayload>
    const amount = Number(body.amountUSD)
    const symbol = String(body.symbol ?? "")

    if (!symbol) {
      return NextResponse.json({ error: "Missing symbol" }, { status: 400 })
    }
    if (!Number.isFinite(amount) || amount <= 0 || amount > 5000) {
      return NextResponse.json({ error: "Amount must be between 0 and 5000" }, { status: 400 })
    }

    const payload: BuyPayload = { amountUSD: Math.round(amount * 100) / 100, symbol }
    return NextResponse.json(payload, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Invalid request",
        details: error instanceof Error ? error.message : error,
      },
      { status: 400 },
    )
  }
}
