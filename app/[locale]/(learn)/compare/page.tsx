"use client"

import { FadeIn } from "@/components/fade-in"
import MainMotion from "@/components/main-motion"
import PageHeader from "@/components/page-header"
import { Section, SectionHeading } from "@/components/section"
import { cn } from "@/lib/utils"
import {
  Check,
  CircuitBoard,
  Coins,
  Cpu,
  Flame,
  GitBranch,
  Hourglass,
  Minus,
  Scale,
  ShieldCheck,
  Users,
  X,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useSyncExternalStore } from "react"

const PARALLAX_LAUNCH = new Date("2025-10-28T00:00:00Z")
const BITCOIN_LAUNCH = new Date("2009-01-03T00:00:00Z")
const ETHEREUM_LAUNCH = new Date("2015-07-30T00:00:00Z")

// Ages count to the visitor's clock, read once; the server HTML counts to
// Parallax's launch so hydration matches.
let clientNow: Date | undefined
const getNow = () => (clientNow ??= new Date())
const getLaunch = () => PARALLAX_LAUNCH
const subscribeNever = () => () => {}

function yearsSince(date: Date, now: Date): number {
  const ms = now.getTime() - date.getTime()
  return ms / (365.25 * 24 * 60 * 60 * 1000)
}

type RawRow = {
  label: string
  description?: string
  parallax?: string
  bitcoin?: string
  ethereum?: string
}

type SectionKey = "consensus" | "monetary" | "settlement" | "programmability" | "governance"

// Per-row cell kinds — defines yes/no/partial visual treatment per chain column.
// Rows that contain chain labels in messages default to "text".
const ROW_KINDS: Record<SectionKey, Array<Record<"parallax" | "bitcoin" | "ethereum", "yes" | "no" | "partial" | "text">>> = {
  consensus: [
    { parallax: "text", bitcoin: "text", ethereum: "text" },
    { parallax: "text", bitcoin: "text", ethereum: "text" },
    { parallax: "text", bitcoin: "text", ethereum: "text" },
    { parallax: "text", bitcoin: "text", ethereum: "text" },
    { parallax: "yes", bitcoin: "yes", ethereum: "no" },
    { parallax: "yes", bitcoin: "yes", ethereum: "partial" },
  ],
  monetary: [
    { parallax: "text", bitcoin: "text", ethereum: "text" },
    { parallax: "yes", bitcoin: "yes", ethereum: "no" },
    { parallax: "text", bitcoin: "text", ethereum: "text" },
    { parallax: "yes", bitcoin: "yes", ethereum: "no" },
    { parallax: "text", bitcoin: "text", ethereum: "text" },
    { parallax: "text", bitcoin: "text", ethereum: "text" },
  ],
  settlement: [
    { parallax: "text", bitcoin: "text", ethereum: "text" },
    { parallax: "yes", bitcoin: "yes", ethereum: "no" },
    { parallax: "text", bitcoin: "text", ethereum: "text" },
    { parallax: "text", bitcoin: "text", ethereum: "text" },
  ],
  programmability: [
    { parallax: "text", bitcoin: "text", ethereum: "text" },
    { parallax: "yes", bitcoin: "partial", ethereum: "yes" },
    { parallax: "yes", bitcoin: "partial", ethereum: "yes" },
    { parallax: "yes", bitcoin: "no", ethereum: "yes" },
    { parallax: "yes", bitcoin: "partial", ethereum: "yes" },
    { parallax: "yes", bitcoin: "yes", ethereum: "no" },
  ],
  governance: [
    { parallax: "yes", bitcoin: "yes", ethereum: "partial" },
    { parallax: "text", bitcoin: "text", ethereum: "text" },
    { parallax: "text", bitcoin: "text", ethereum: "text" },
    { parallax: "text", bitcoin: "text", ethereum: "text" },
    { parallax: "text", bitcoin: "text", ethereum: "text" },
  ],
}

const SECTION_ICONS: Record<SectionKey, React.ComponentType<{ className?: string }>> = {
  consensus: ShieldCheck,
  monetary: Coins,
  settlement: Hourglass,
  programmability: CircuitBoard,
  governance: Users,
}

const SECTION_KEYS: SectionKey[] = ["consensus", "monetary", "settlement", "programmability", "governance"]

const SUMMARY_ICONS = [Scale, Cpu, CircuitBoard, Flame]

type Cell =
  | { kind: "yes"; label?: string }
  | { kind: "no"; label?: string }
  | { kind: "partial"; label?: string }
  | { kind: "text"; label: string }

function CellDisplay({ cell }: { cell: Cell }) {
  if (cell.kind === "yes") {
    return (
      <div className="flex items-start gap-2">
        <Check className="size-4 text-brand shrink-0 mt-0.5" strokeWidth={2.25} />
        {cell.label && <span className="text-sm text-foreground">{cell.label}</span>}
      </div>
    )
  }
  if (cell.kind === "no") {
    return (
      <div className="flex items-start gap-2">
        <X className="size-4 text-muted-foreground shrink-0 mt-0.5" strokeWidth={2} />
        {cell.label && <span className="text-sm text-muted-foreground">{cell.label}</span>}
      </div>
    )
  }
  if (cell.kind === "partial") {
    return (
      <div className="flex items-start gap-2">
        <Minus className="size-4 text-muted-foreground shrink-0 mt-0.5" strokeWidth={2} />
        {cell.label && <span className="text-sm text-muted-foreground">{cell.label}</span>}
      </div>
    )
  }
  return <span className="text-sm text-foreground">{cell.label}</span>
}

function formatMaturity(years: number, t: ReturnType<typeof useTranslations<"compare.maturity">>): string {
  if (years < 1) {
    const months = Math.max(0, Math.round(years * 12))
    if (months <= 0) return t("justLaunched")
    if (months === 1) return t("oneMonth")
    return t("months", { count: months })
  }
  const rounded = years < 10 ? years.toFixed(1) : Math.round(years).toString()
  return t("years", { years: rounded })
}

export default function ComparePage() {
  const t = useTranslations("compare")
  const tMaturity = useTranslations("compare.maturity")
  const now = useSyncExternalStore(subscribeNever, getNow, getLaunch)

  const chains = [
    { key: "parallax" as const, name: t("chains.parallax"), highlight: true },
    { key: "bitcoin" as const, name: t("chains.bitcoin"), highlight: false },
    { key: "ethereum" as const, name: t("chains.ethereum"), highlight: false },
  ]

  const summary = t.raw("summary") as Array<{ title: string; parallax: string; bitcoin: string; ethereum: string }>

  const sections = SECTION_KEYS.map((sectionKey) => {
    const rows = t.raw(`sections.${sectionKey}.rows`) as RawRow[]
    const Icon = SECTION_ICONS[sectionKey]
    return {
      key: sectionKey,
      title: t(`sections.${sectionKey}.title` as "sections.consensus.title"),
      icon: Icon,
      rows: rows.map((row, i): { label: string; description?: string; parallax: Cell; bitcoin: Cell; ethereum: Cell } => {
        const kinds = ROW_KINDS[sectionKey][i]
        const makeCell = (chain: "parallax" | "bitcoin" | "ethereum"): Cell => {
          const kind = kinds[chain]
          const label = row[chain]
          // Network maturity row (governance section, last row) has dynamic maturity labels.
          if (sectionKey === "governance" && i === 4) {
            const years =
              chain === "parallax" ? yearsSince(PARALLAX_LAUNCH, now) :
              chain === "bitcoin" ? yearsSince(BITCOIN_LAUNCH, now) :
              yearsSince(ETHEREUM_LAUNCH, now)
            const launch = t(`launchDates.${chain}` as "launchDates.parallax")
            return { kind: "text", label: `${formatMaturity(years, tMaturity)} (${launch})` }
          }
          if (kind === "text") return { kind: "text", label: label ?? "" }
          return { kind, label }
        }
        return {
          label: row.label,
          description: row.description,
          parallax: makeCell("parallax"),
          bitcoin: makeCell("bitcoin"),
          ethereum: makeCell("ethereum"),
        }
      }),
    }
  })

  return (
    <MainMotion>
      <PageHeader title={t("title")} subTitle={t("subtitle")} />

      {/* At a glance — one hairline grid, Parallax's line lit in each cell */}
      <Section>
        <FadeIn>
          <p className="tag"><span className="text-brand">01</span><span aria-hidden className="text-hairline">/</span>{t("atAGlance")}</p>
        </FadeIn>
        <FadeIn delay={0.05}>
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline md:grid-cols-2">
            {summary.map((item, i) => {
              const Icon = SUMMARY_ICONS[i]
              return (
                <div key={item.title} className="flex flex-col bg-background p-6 sm:p-8">
                  <Icon className="size-6 text-brand" strokeWidth={1.5} />
                  <h3 className="mt-8 text-2xl leading-tight text-foreground">
                    {item.title}
                  </h3>
                  <dl className="mt-6 text-sm">
                    <div className="flex items-baseline justify-between gap-4 rounded-lg bg-brand/[0.06] px-3 py-3">
                      <dt className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-brand">
                        <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                        {t("chains.parallax")}
                      </dt>
                      <dd className="text-right font-medium text-foreground">{item.parallax}</dd>
                    </div>
                    <div className="mx-3 flex items-baseline justify-between gap-4 border-b border-hairline py-3">
                      <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        {t("chains.bitcoin")}
                      </dt>
                      <dd className="text-right text-muted-foreground">{item.bitcoin}</dd>
                    </div>
                    <div className="mx-3 flex items-baseline justify-between gap-4 py-3">
                      <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        {t("chains.ethereum")}
                      </dt>
                      <dd className="text-right text-muted-foreground">{item.ethereum}</dd>
                    </div>
                  </dl>
                </div>
              )
            })}
          </div>
        </FadeIn>
      </Section>

      {/* Detailed comparison — one hairline-ruled ledger per section */}
      <Section>
        <FadeIn>
          <SectionHeading index="02" eyebrow={t("detailedComparison")} title={t("featureByFeature")} />
        </FadeIn>

        <div className="mt-16 flex flex-col gap-8">
          {sections.map((section, si) => (
            <FadeIn key={section.key} delay={si * 0.05}>
              <div className="overflow-hidden rounded-2xl border border-stroke bg-card">
                <div className="flex items-center gap-4 border-b border-hairline px-5 py-5 sm:px-6">
                  <section.icon className="size-5 text-brand" />
                  <h3 className="text-xl leading-tight text-foreground sm:text-2xl">
                    {section.title}
                  </h3>
                  <span className="ml-auto font-mono text-xs tracking-[0.14em] text-muted-foreground">
                    {String(si + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Desktop table */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] divide-x divide-hairline border-b border-hairline">
                    <div className="px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {t("property")}
                    </div>
                    {chains.map((c) => (
                      <div
                        key={c.key}
                        className={cn(
                          "flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-[0.14em]",
                          c.highlight ? "bg-brand/[0.05] text-brand" : "text-muted-foreground"
                        )}
                      >
                        {c.highlight && <span aria-hidden className="size-1.5 rounded-full bg-brand" />}
                        {c.name}
                      </div>
                    ))}
                  </div>
                  {section.rows.map((row, ri) => (
                    <div
                      key={row.label}
                      className={cn(
                        "grid grid-cols-[1.6fr_1fr_1fr_1fr] divide-x divide-hairline",
                        ri !== section.rows.length - 1 && "border-b border-hairline"
                      )}
                    >
                      <div className="px-6 py-5">
                        <div className="text-base font-medium leading-snug text-foreground">{row.label}</div>
                        {row.description && (
                          <div className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                            {row.description}
                          </div>
                        )}
                      </div>
                      <div className="bg-brand/[0.05] px-6 py-5">
                        <CellDisplay cell={row.parallax} />
                      </div>
                      <div className="px-6 py-5">
                        <CellDisplay cell={row.bitcoin} />
                      </div>
                      <div className="px-6 py-5">
                        <CellDisplay cell={row.ethereum} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile stacked layout */}
                <div className="md:hidden">
                  {section.rows.map((row, ri) => (
                    <div
                      key={row.label}
                      className={cn("p-5", ri !== section.rows.length - 1 && "border-b border-hairline")}
                    >
                      <div className="text-base font-medium leading-snug text-foreground mb-1">{row.label}</div>
                      {row.description && (
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {row.description}
                        </div>
                      )}
                      <div className="mt-4 overflow-hidden rounded-xl border border-stroke">
                        {chains.map((c, ci) => (
                          <div
                            key={c.key}
                            className={cn(
                              "flex flex-col gap-1.5 px-4 py-3",
                              ci !== chains.length - 1 && "border-b border-hairline",
                              c.highlight && "bg-brand/[0.05]"
                            )}
                          >
                            <span
                              className={cn(
                                "flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]",
                                c.highlight ? "text-brand" : "text-muted-foreground"
                              )}
                            >
                              {c.highlight && <span aria-hidden className="size-1.5 rounded-full bg-brand" />}
                              {c.name}
                            </span>
                            <CellDisplay cell={row[c.key]} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Closing statement — last band, MainMotion supplies the bottom space */}
      <Section className="border-b-0">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card p-8 sm:p-12">
            <div aria-hidden className="aurora" />
            <div className="relative max-w-3xl">
              <p className="tag">
                <GitBranch className="size-4 text-brand" />
                {t("thesisLabel")}
              </p>
              <p className="mt-8 text-xl font-light leading-snug text-foreground text-pretty sm:text-2xl lg:text-3xl lg:leading-[1.25]">
                {t("thesisBody")}
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>
    </MainMotion>
  )
}
