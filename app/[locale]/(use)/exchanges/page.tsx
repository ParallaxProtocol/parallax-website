import MainMotion from "@/components/main-motion"
import PageHeader from "@/components/page-header"
import { FadeIn } from "@/components/fade-in"
import { Badge } from "@/components/ui/badge"
import { Card, CardTitle } from "@/components/ui/card"
import { Section, SectionHeading } from "@/components/section"
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  ExternalLink,
  ShieldAlert,
  Trophy,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { COINGECKO_COIN_URL, Exchange, getExchanges } from "./data"

function formatUsd(v: number | undefined): string {
  if (v == null) return "—"
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`
  if (v >= 1_000) return `$${(v / 1_000).toFixed(1)}K`
  return `$${v.toFixed(2)}`
}

function formatPrice(price: number, target: string): string {
  const decimals = price < 0.01 ? 6 : price < 1 ? 4 : 2
  return `${price.toFixed(decimals)} ${target}`
}

function formatSpread(pct: number | undefined): string {
  if (pct == null) return "—"
  return `${pct.toFixed(2)}%`
}

function StatCell({
  icon: Icon,
  label,
  value,
  caption,
  highlight = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  caption?: string
  highlight?: boolean
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background p-6 sm:p-8">
      {highlight && <div aria-hidden className="aurora aurora-left" />}
      <div className="relative flex items-center gap-3">
        <Icon className="size-5 text-brand" />
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="relative mt-16 text-4xl font-light leading-none tracking-[-0.03em] text-foreground tabular-nums break-words sm:text-5xl">
        {value}
      </p>
      {caption && (
        <p className="relative mt-3 text-sm text-foreground/75">{caption}</p>
      )}
    </div>
  )
}

function ExchangeCard({
  exchange,
  labels,
}: {
  exchange: Exchange
  labels: { lastPrice: string; volume24h: string; spread: string }
}) {
  return (
    <a
      href={exchange.url}
      target="_blank"
      rel="noopener"
      className="group block h-full outline-none"
    >
      <Card className="h-full py-0 cursor-pointer">
        <div className="flex items-start justify-between gap-4 px-6 py-6">
          <div className="flex flex-col gap-3">
            <CardTitle className="text-2xl">
              {exchange.name}
            </CardTitle>
            <Badge variant="outline">
              {exchange.pair}
            </Badge>
          </div>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-stroke text-foreground transition-colors group-hover:border-foreground/30 group-hover:text-brand">
            <ArrowUpRight className="size-5" strokeWidth={1.5} />
          </span>
        </div>
        <dl className="grid grid-cols-3 divide-x divide-hairline border-t border-hairline">
          {[
            { label: labels.lastPrice, value: formatPrice(exchange.lastPrice, exchange.targetSymbol) },
            { label: labels.volume24h, value: formatUsd(exchange.volumeUsd) },
            { label: labels.spread, value: formatSpread(exchange.spreadPct) },
          ].map((m) => (
            <div key={m.label} className="min-w-0 px-3 py-4 sm:px-6">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                {m.label}
              </dt>
              <dd className="mt-2 break-words text-base text-foreground tabular-nums">
                {m.value}
              </dd>
            </div>
          ))}
        </dl>
      </Card>
    </a>
  )
}

export default async function ExchangePage() {
  const t = await getTranslations("exchanges")
  const exchanges = await getExchanges()
  const totalVolume = exchanges.reduce(
    (sum, e) => sum + (e.volumeUsd ?? 0),
    0
  )
  const topExchange = exchanges[0] // already sorted by volume desc

  const cardLabels = {
    lastPrice: t("card.lastPrice"),
    volume24h: t("card.volume24h"),
    spread: t("card.spread"),
  }

  return (
    <MainMotion>
      <PageHeader
        title={t("title")}
        subTitle={t("subtitle")}
      />

      {exchanges.length === 0 ? (
        // API failure / empty state
        <Section className="border-b-0">
          <FadeIn>
            <div className="relative max-w-3xl overflow-hidden rounded-2xl border border-stroke bg-card p-8 sm:p-10">
              <div aria-hidden className="aurora" />
              <div className="relative flex items-center gap-3">
                <ShieldAlert className="size-6 text-brand" strokeWidth={1.5} />
                <h3 className="text-2xl leading-tight text-foreground">{t("unavailable.title")}</h3>
              </div>
              <p className="relative mt-4 text-base text-muted-foreground leading-relaxed">
                {t("unavailable.description")}
              </p>
              <div className="relative mt-8">
                <a
                  href={COINGECKO_COIN_URL}
                  target="_blank"
                  rel="noopener"
                  className="group inline-flex items-center gap-2 text-[15px] font-medium text-foreground"
                >
                  {t("unavailable.viewOnCoingecko")}
                  <ExternalLink className="size-4 text-brand" />
                </a>
              </div>
            </div>
          </FadeIn>
        </Section>
      ) : (
        <>
          {/* Market overview — one ruled strip, the headline figure lit */}
          <Section>
            <FadeIn>
              <p className="tag"><span className="text-brand">01</span><span aria-hidden className="text-hairline">/</span>{t("stats.marketOverview")}</p>
            </FadeIn>
            <FadeIn delay={0.05}>
              <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-3">
                <StatCell
                  icon={BarChart3}
                  label={t("stats.volume24h")}
                  value={formatUsd(totalVolume)}
                  caption={t("stats.volume24hCaption")}
                  highlight
                />
                <StatCell
                  icon={Building2}
                  label={t("stats.activeMarkets")}
                  value={exchanges.length.toString()}
                  caption={
                    exchanges.length === 1
                      ? t("stats.activeMarketsCaptionOne")
                      : t("stats.activeMarketsCaptionOther")
                  }
                />
                {topExchange && (
                  <StatCell
                    icon={Trophy}
                    label={t("stats.topMarket")}
                    value={topExchange.name}
                    caption={t("stats.topMarketCaption", {
                      price: formatPrice(
                        topExchange.lastPrice,
                        topExchange.targetSymbol
                      ),
                      volume: formatUsd(topExchange.volumeUsd),
                    })}
                  />
                )}
              </div>
            </FadeIn>
          </Section>

          {/* Active markets */}
          <Section>
            <FadeIn>
              <SectionHeading
                index="02"
                eyebrow={t("activeMarkets.eyebrow")}
                title={t("activeMarkets.heading")}
                subtitle={t("activeMarkets.description")}
              />
            </FadeIn>

            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {exchanges.map((e, i) => (
                <FadeIn key={`${e.name}-${e.url}`} delay={i * 0.08}>
                  <ExchangeCard exchange={e} labels={cardLabels} />
                </FadeIn>
              ))}
            </div>
          </Section>

          {/* Disclaimer + attribution — last band, MainMotion supplies the bottom space */}
          <Section className="border-b-0">
            <div className="grid gap-8 lg:grid-cols-12">
              <FadeIn className="lg:col-span-7">
                <div className="h-full rounded-xl border border-stroke bg-card p-6 sm:p-8">
                  <p className="tag mb-5">
                    <ShieldAlert className="size-4 text-pop-yellow" />
                    {t("disclaimer.label")}
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed text-pretty">
                    {t.rich("disclaimer.body", {
                      strong: (chunks) => (
                        <strong className="text-foreground">{chunks}</strong>
                      ),
                    })}
                  </p>
                </div>
              </FadeIn>

              <FadeIn delay={0.08} className="lg:col-span-5">
                <div className="h-full overflow-hidden rounded-xl border border-stroke bg-card">
                  <div className="flex items-center justify-between border-b border-hairline px-6 py-3">
                    <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-foreground">
                      {t("attribution.dataSource")}
                    </p>
                    <span aria-hidden className="font-mono text-xs tracking-[0.2em] text-muted-foreground/50">||||||||</span>
                  </div>
                  <div className="p-6 sm:p-8">
                    <a
                      href={COINGECKO_COIN_URL}
                      target="_blank"
                      rel="noopener"
                      className="group inline-flex items-center gap-2 text-xl text-foreground underline decoration-brand/50 underline-offset-4 hover:decoration-brand"
                    >
                      {t("attribution.viewOnCoingecko")}
                      <ExternalLink className="size-4 shrink-0 text-brand" />
                    </a>
                    <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                      {t("attribution.note")}
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </Section>
        </>
      )}
    </MainMotion>
  )
}
