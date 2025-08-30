import { NextResponse } from "next/server"

export async function GET() {
  // Fetch data from the CoinMarketCap API
  // https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest

  const data = {}

  return NextResponse.json(data)
}
