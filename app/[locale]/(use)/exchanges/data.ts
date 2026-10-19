// Exchange data layer.
//
// Source: CoinGecko's `/coins/parallax-2/tickers` endpoint, fetched
// server-side with hourly ISR caching. This is the single source of truth —
// any exchange listing LAX must report to CoinGecko to appear on this page.

export interface Exchange {
  name: string
  url: string
  pair: string
  lastPrice: number
  targetSymbol: string
  volumeUsd?: number
  spreadPct?: number
  lastTradedAt: string
}

interface CoinGeckoTicker {
  base: string
  target: string
  market: { name: string; identifier: string }
  last: number
  volume: number
  converted_volume?: { usd?: number }
  bid_ask_spread_percentage: number | null
  last_traded_at: string
  trade_url: string | null
  is_anomaly: boolean
  is_stale: boolean
}

interface CoinGeckoResponse {
  tickers?: CoinGeckoTicker[]
}

const COINGECKO_TICKERS_URL =
  "https://api.coingecko.com/api/v3/coins/parallax-2/tickers"

export const COINGECKO_COIN_URL =
  "https://www.coingecko.com/en/coins/parallax-2"

export async function getExchanges(): Promise<Exchange[]> {
  try {
    const res = await fetch(COINGECKO_TICKERS_URL, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    })
    if (!res.ok) return []
    const data = (await res.json()) as CoinGeckoResponse
    const exchanges = (data.tickers ?? [])
      .filter((t) => !t.is_anomaly && !t.is_stale && t.trade_url)
      .map<Exchange>((t) => ({
        name: t.market.name,
        url: t.trade_url!,
        pair: `${t.base}/${t.target}`,
        lastPrice: t.last,
        targetSymbol: t.target,
        volumeUsd: t.converted_volume?.usd,
        spreadPct: t.bid_ask_spread_percentage ?? undefined,
        lastTradedAt: t.last_traded_at,
      }))

    // Sort by 24h USD volume descending; entries without volume go last,
    // alphabetized among themselves.
    return exchanges.sort((a, b) => {
      const aHasVol = a.volumeUsd != null
      const bHasVol = b.volumeUsd != null
      if (aHasVol && bHasVol) return (b.volumeUsd ?? 0) - (a.volumeUsd ?? 0)
      if (aHasVol) return -1
      if (bHasVol) return 1
      return a.name.localeCompare(b.name)
    })
  } catch {
    return []
  }
}
