'use client'
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { motion, useInView, useMotionValue, useSpring } from "framer-motion"
import { ExternalLink } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { FadeIn } from "./fade-in"

type Stats = {
  total_blocks: string
  total_transactions: string
  total_addresses: string
  average_block_time: number
  transactions_today: string
  price_usd: number | null
  price_change_24h: number | null
  market_cap_usd: number | null
  total_volume_usd: number | null
  circulating_supply: number | null
  max_supply: number | null
}

function formatNumber(value: string | number): string {
  const num = typeof value === "string" ? parseInt(value, 10) : value
  if (isNaN(num)) return "—"
  return num.toLocaleString()
}

function formatBlockTime(ms: number): string {
  const seconds = Math.round(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  if (minutes === 0) return `${seconds}s`
  return `${minutes}m ${remaining}s`
}

function formatPrice(usd: number): string {
  if (usd >= 1) return `$${usd.toFixed(2)}`
  if (usd >= 0.01) return `$${usd.toFixed(4)}`
  return `$${usd.toFixed(6)}`
}

function formatUsd(usd: number): string {
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(2)}M`
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(1)}K`
  return `$${usd.toFixed(0)}`
}

function formatSupply(circulating: number, max: number): string {
  const fmt = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
    return n.toLocaleString()
  }
  return `${fmt(circulating)} / ${fmt(max)}`
}

// Animated counter that counts up from 0 to target
function AnimatedValue({
  value,
  formatFn,
}: {
  value: number
  formatFn: (n: number) => string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: 1500, bounce: 0 })
  const [display, setDisplay] = useState(formatFn(0))

  useEffect(() => {
    if (inView) {
      motionValue.set(value)
    }
  }, [inView, value, motionValue])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplay(formatFn(latest))
    })
    return unsubscribe
  }, [springValue, formatFn])

  return <span ref={ref}>{display}</span>
}

// For values that aren't purely numeric (like block time, supply ratio)
function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {text}
    </motion.span>
  )
}

type LabelKey =
  | "blocks"
  | "transactions"
  | "addresses"
  | "avgBlockTime"
  | "txnsToday"
  | "price"
  | "marketCap"
  | "volume24h"
  | "supply"

type StatItem = {
  key: string
  labelKey: LabelKey
  rawValue?: (stats: Stats) => number | null
  format: (stats: Stats) => string | null
  formatRaw?: (n: number) => string
  animatable?: boolean
  suffix?: (stats: Stats) => React.ReactNode
}

const marketItems: StatItem[] = [
  {
    key: "price",
    labelKey: "price",
    format: (s) => s.price_usd != null ? formatPrice(s.price_usd) : null,
    rawValue: (s) => s.price_usd,
    formatRaw: (n) => formatPrice(n),
    animatable: true,
    suffix: (s) => {
      if (s.price_change_24h == null) return null
      const positive = s.price_change_24h >= 0
      return (
        <span className={cn("text-xs font-mono", positive ? "text-green-500" : "text-red-500")}>
          {positive ? "+" : ""}{s.price_change_24h.toFixed(1)}%
        </span>
      )
    },
  },
  {
    key: "market_cap",
    labelKey: "marketCap",
    format: (s) => s.market_cap_usd != null ? formatUsd(s.market_cap_usd) : null,
    rawValue: (s) => s.market_cap_usd,
    formatRaw: (n) => formatUsd(n),
    animatable: true,
  },
  {
    key: "volume",
    labelKey: "volume24h",
    format: (s) => s.total_volume_usd != null ? formatUsd(s.total_volume_usd) : null,
    rawValue: (s) => s.total_volume_usd,
    formatRaw: (n) => formatUsd(n),
    animatable: true,
  },
  {
    key: "supply",
    labelKey: "supply",
    format: (s) => s.circulating_supply != null && s.max_supply != null
      ? formatSupply(s.circulating_supply, s.max_supply)
      : null,
  },
]

const networkItems: StatItem[] = [
  {
    key: "total_blocks",
    labelKey: "blocks",
    format: (s) => formatNumber(s.total_blocks),
    rawValue: (s) => parseInt(s.total_blocks, 10) || null,
    formatRaw: (n) => Math.round(n).toLocaleString(),
    animatable: true,
  },
  {
    key: "total_transactions",
    labelKey: "transactions",
    format: (s) => formatNumber(s.total_transactions),
    rawValue: (s) => parseInt(s.total_transactions, 10) || null,
    formatRaw: (n) => Math.round(n).toLocaleString(),
    animatable: true,
  },
  {
    key: "total_addresses",
    labelKey: "addresses",
    format: (s) => formatNumber(s.total_addresses),
    rawValue: (s) => parseInt(s.total_addresses, 10) || null,
    formatRaw: (n) => Math.round(n).toLocaleString(),
    animatable: true,
  },
  {
    key: "average_block_time",
    labelKey: "avgBlockTime",
    format: (s) => formatBlockTime(s.average_block_time),
  },
  {
    key: "transactions_today",
    labelKey: "txnsToday",
    format: (s) => formatNumber(s.transactions_today),
    rawValue: (s) => parseInt(s.transactions_today, 10) || null,
    formatRaw: (n) => Math.round(n).toLocaleString(),
    animatable: true,
  },
]

function StatGrid({ items, stats, columns }: { items: StatItem[], stats: Stats, columns: string }) {
  const t = useTranslations("home.networkStats.labels")
  const visible = items.filter((item) => item.format(stats) != null)
  if (visible.length === 0) return null

  return (
    <div className={cn("grid border-y border-hairline", columns)}>
      {visible.map((item) => {
        const raw = item.animatable && item.rawValue && item.formatRaw
          ? item.rawValue(stats)
          : null

        return (
          <div
            key={item.key}
            className="flex flex-col items-start justify-center border-hairline py-8 pr-6 [&:not(:first-child)]:lg:border-l lg:pl-8 lg:first:pl-0"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-light tracking-[-0.03em] text-foreground tabular-nums sm:text-4xl lg:text-5xl">
                {raw != null && item.formatRaw ? (
                  <AnimatedValue value={raw} formatFn={item.formatRaw} />
                ) : (
                  <AnimatedText text={item.format(stats)!} />
                )}
              </span>
              {item.suffix?.(stats)}
            </div>
            <span className="mt-2 text-sm text-foreground/75">
              {t(item.labelKey)}
            </span>
          </div>
        )
      })}
      {/* Fill empty grid cell so bg-border doesn't bleed through */}
      {visible.length % 2 !== 0 && <div className="sm:hidden" />}
    </div>
  )
}

export function NetworkStats() {
  const t = useTranslations("home.networkStats")
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [explorerRes, marketRes] = await Promise.allSettled([
          fetch("https://explorer.parallaxprotocol.org/api/v2/stats", {
            headers: { Accept: "application/json" },
          }),
          fetch("/api/network_stats"),
        ])

        if (explorerRes.status !== "fulfilled" || !explorerRes.value.ok) return
        const explorer = await explorerRes.value.json()

        let market = {
          price_usd: null,
          price_change_24h: null,
          market_cap_usd: null,
          total_volume_usd: null,
          circulating_supply: null,
          max_supply: null,
        }
        if (marketRes.status === "fulfilled" && marketRes.value.ok) {
          market = await marketRes.value.json()
        }

        if (!cancelled) {
          setStats({
            total_blocks: explorer.total_blocks,
            total_transactions: explorer.total_transactions,
            total_addresses: explorer.total_addresses,
            average_block_time: explorer.average_block_time,
            transactions_today: explorer.transactions_today,
            ...market,
          })
        }
      } catch {
        // silently fail — stats are non-critical
      }
    }

    load()
    const interval = setInterval(load, 60_000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  if (!stats) return (
    <section className="border-b border-hairline py-16">
      <div className="mx-auto max-w-[90rem] space-y-12 px-5 md:px-10">
        <div>
          <div className="mb-6">
            <p className="tag">
              <span aria-hidden className="size-1.5 rounded-full bg-brand animate-pulse motion-reduce:animate-none" />
              {t("liveNetwork")}
            </p>
          </div>
          <div className="grid border-y border-hairline grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col items-start justify-center border-hairline py-8 pr-6 [&:not(:first-child)]:lg:border-l lg:pl-8 lg:first:pl-0">
                <div className="h-10 w-32 rounded-md bg-muted animate-pulse" />
                <div className="mt-3 h-3 w-20 rounded bg-muted animate-pulse" />
              </div>
            ))}
            {/* Fill empty cell on mobile */}
            <div className="sm:hidden" />
          </div>
        </div>
      </div>
    </section>
  )

  // Market stats hidden 2026-08-19 (owner call: market data unflattering right
  // now). Flip to true to bring the section back — data plumbing is intact.
  const showMarket = false as boolean
  const hasMarket = showMarket && marketItems.some((item) => item.format(stats) != null)

  return (
    <section className="border-b border-hairline py-16">
      <div className="mx-auto max-w-[90rem] space-y-12 px-5 md:px-10">
        <FadeIn>
          <div className="mb-6">
            <p className="tag">
              <span aria-hidden className="size-1.5 rounded-full bg-brand animate-pulse motion-reduce:animate-none" />
              {t("liveNetwork")}
            </p>
          </div>
          <StatGrid items={networkItems} stats={stats} columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6">
            <a href="https://explorer.parallaxprotocol.org" target="_blank" rel="noopener" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
              {t("blockExplorer")}
              <ExternalLink className="size-3" />
            </a>
            <Link href="/resources/network-atlas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("networkAtlas")}
            </Link>
            <a href="https://status.parallaxprotocol.org" target="_blank" rel="noopener" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
              {t("networkStatus")}
              <ExternalLink className="size-3" />
            </a>
          </div>
        </FadeIn>

        {hasMarket && (
          <FadeIn delay={0.1}>
            <div className="mb-6">
              <p className="tag">{t("market")}</p>
            </div>
            <StatGrid items={marketItems} stats={stats} columns="grid-cols-2 lg:grid-cols-4" />
            <div className="flex mt-6">
              <a href="https://www.coingecko.com/en/coins/parallax-2" target="_blank" rel="noopener" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5">
                {t("coingecko")}
                <ExternalLink className="size-3" />
              </a>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  )
}
