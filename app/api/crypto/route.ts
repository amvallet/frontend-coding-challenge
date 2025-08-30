import { NextResponse } from "next/server"

const publicAPIKey = process.env.COINMARKET_API_KEY

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") || "10"

    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=${limit}`

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
    return NextResponse.json(data)
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
