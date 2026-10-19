'use client'
import { cn } from "@/lib/utils"
import {
  ArrowDown,
  ArrowRight,
  Check,
  FileCode2,
  KeyRound,
  Lock,
  Radio,
  RotateCcw,
  ShieldCheck,
  Store,
  User,
  X,
} from "lucide-react"
import { useTranslations } from "next-intl"

/* The diagrams on /how-it-works. Each draws the mechanism it
   sits next to with hairlines and type, the way the homepage's panels do,
   so they read as part of the page rather than as embedded figures. */

/* ── Keys ─────────────────────────────────────────────────────────────
   Private key → public key → address, with the real values for the
   go-ethereum docs' well-known example key (never use it for funds). */
const KEY_EXAMPLE = {
  privateKey: "4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318",
  publicKey:
    "044e3b81af9c2234cad09d679ce6035ed1392347ce64ce405f5dcd36228a25de6e47fd35c4215d1edf53e6f83de344615ce719bdb0fd878f6ed76f06dd277956de",
  address: "0x2c7536E3605D9C16a7a3D7b1898e529396a65c23",
} as const

export function KeyDerivation() {
  const t = useTranslations("introduction.howItWorks.keys")
  const rows = [
    { key: "privateKey", icon: Lock, value: KEY_EXAMPLE.privateKey, secret: true },
    { key: "publicKey", icon: KeyRound, value: KEY_EXAMPLE.publicKey, secret: false },
    { key: "address", icon: User, value: KEY_EXAMPLE.address, secret: false },
  ] as const

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card">
      <div aria-hidden className="aurora aurora-left opacity-70" />
      <div className="relative flex items-center justify-between gap-4 border-b border-hairline px-5 py-3 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{t("example")}</p>
        <p className="hidden font-mono text-xs text-brand sm:block">{t("oneWay")}</p>
      </div>
      <div className="relative grid lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {rows.map((row, i) => {
          const Icon = row.icon
          return (
            <div key={row.key} className="contents">
              {i > 0 && (
                <div aria-hidden className="flex items-center justify-center py-1 text-brand lg:px-1 lg:py-0">
                  <ArrowDown className="size-4 lg:hidden" strokeWidth={1.5} />
                  <ArrowRight className="hidden size-4 lg:block" strokeWidth={1.5} />
                </div>
              )}
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border",
                    row.secret ? "border-brand/30 bg-brand-muted text-brand" : "border-stroke text-foreground",
                  )}>
                    <Icon className="size-4" strokeWidth={1.5} />
                  </span>
                  <h3 className="text-lg leading-tight text-foreground">{t(`${row.key}.label`)}</h3>
                </div>
                <p
                  className={cn(
                    "mt-4 rounded-lg border border-hairline bg-background/60 px-3 py-2.5 font-mono text-[12px] leading-relaxed break-all",
                    row.secret ? "text-foreground/40 blur-[3px] select-none" : "text-foreground/80",
                  )}
                  aria-hidden={row.secret || undefined}
                >
                  {row.key === "publicKey" ? `${row.value.slice(0, 34)}…${row.value.slice(-8)}` : row.value}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(`${row.key}.note`)}</p>
              </div>
            </div>
          )
        })}
      </div>
      <p className="relative border-t border-hairline px-5 py-3 font-mono text-xs text-brand sm:hidden">{t("oneWay")}</p>
    </div>
  )
}

/* ── A transaction's life ─────────────────────────────────────────────
   Five stages on a rail. The rail's gradient runs from the user's device
   (left) to settlement (right). */
type Step = { title: string; time: string; description: string }

export function TxLifecycle() {
  const t = useTranslations("introduction.howItWorks.tx")
  const steps = t.raw("steps") as Step[]
  const icons = [KeyRound, Radio, RotateCcw, FileCode2, ShieldCheck]

  return (
    <ol className="relative grid gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline md:grid-cols-5">
      {steps.map((step, i) => {
        const Icon = icons[i] ?? Check
        const last = i === steps.length - 1
        return (
          <li key={step.title} className={cn("relative flex flex-col bg-background p-6", last && "bg-card")}>
            {last && <div aria-hidden className="aurora opacity-80" />}
            <div className="relative flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-brand">{String(i + 1).padStart(2, "0")}</span>
              <Icon className="size-5 text-foreground/70" strokeWidth={1.5} aria-hidden />
            </div>
            {/* the rail: a hairline that fills with the gradient up to this step */}
            <div aria-hidden className="relative mt-6 h-px w-full bg-hairline">
              <div className="brand-gradient absolute inset-y-0 left-0" style={{ width: `${((i + 1) / steps.length) * 100}%` }} />
              <span className="absolute top-1/2 left-0 size-2 -translate-y-1/2 rounded-full bg-brand" />
            </div>
            <h3 className="relative mt-6 text-xl leading-tight text-foreground">{step.title}</h3>
            <p className="relative mt-1 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">{step.time}</p>
            <p className="relative mt-4 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          </li>
        )
      })}
    </ol>
  )
}

/* Six blocks stacking on top of the one that holds your transaction. */
export function ConfirmationStrip() {
  const t = useTranslations("introduction.howItWorks.tx")
  const blocks = [1, 2, 3, 4, 5, 6]

  return (
    <ol className="grid grid-cols-6 gap-2 sm:gap-4">
      {blocks.map((n) => (
        <li key={n} className="min-w-0" aria-label={t("confirmations", { n })}>
          <div
            className={cn(
              "relative flex aspect-square flex-col justify-end rounded-lg sm:justify-between border p-2 sm:rounded-xl sm:p-3",
              n === 1 ? "border-brand/40 bg-brand-muted" : "border-stroke bg-foreground/[0.03]",
            )}
          >
            {/* link to the previous block, drawn across the gap */}
            {n > 1 && <span aria-hidden className="absolute top-1/2 right-full h-px w-2 bg-stroke sm:w-4" />}
            <span className={cn("hidden truncate font-mono text-[11px] uppercase tracking-[0.1em] sm:block", n === 1 ? "text-brand" : "text-transparent")}>
              {n === 1 ? t("yourBlock") : "."}
            </span>
            <span className={cn("text-2xl font-light tracking-[-0.03em] sm:text-4xl", n === 1 ? "text-brand" : n === 6 ? "text-foreground" : "text-foreground/60")}>
              {n}
            </span>
          </div>
          <p className="mt-2 truncate font-mono text-[10px] text-muted-foreground sm:text-xs">{t("minutes", { n: n * 10 })}</p>
        </li>
      ))}
    </ol>
  )
}

/* The mempool as a miner sees it: waiting transactions sorted by gas
   price, the best-paying ones taken into the next block. Illustrative. */
const MEMPOOL = [
  { gwei: 42, size: 0.9 },
  { gwei: 30, size: 0.6 },
  { gwei: 21, size: 1 },
  { gwei: 12, size: 0.7 },
  { gwei: 4, size: 0.8 },
  { gwei: 1, size: 0.5 },
] as const

export function MempoolAuction() {
  const t = useTranslations("introduction.howItWorks.tx")
  return (
    <div className="rounded-xl border border-stroke bg-background/70 p-4 backdrop-blur-sm">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{t("mempoolLabel")}</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">gwei</p>
      </div>
      {[MEMPOOL.slice(0, 4), MEMPOOL.slice(4)].map((group, g) => (
        <div key={g} className={cn("mt-3 rounded-lg p-2.5", g === 0 ? "border border-brand/30 bg-brand-muted" : "border border-dashed border-stroke")}>
          <p className={cn("mb-2 font-mono text-[10px] uppercase tracking-[0.12em]", g === 0 ? "text-brand" : "text-muted-foreground")}>
            {g === 0 ? t("nextBlock") : t("waiting")}
          </p>
          <ul className="space-y-1.5">
            {group.map((tx) => (
              <li key={tx.gwei} className="flex items-center gap-3">
                <span className={cn("h-4 rounded-sm", g === 0 ? "bg-brand/50" : "bg-foreground/15")} style={{ width: `${tx.size * 70}%` }} />
                <span className={cn("ml-auto font-mono text-xs tabular-nums", g === 0 ? "text-foreground" : "text-muted-foreground")}>{tx.gwei}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

/* ── Mining ───────────────────────────────────────────────────────────
   The mining loop as a terminal: nonce after nonce, hash after hash,
   until one falls under the target. Values are illustrative. */
const ATTEMPTS = [
  { nonce: "0", hash: "9f3a61d0e2…c21e", ok: false },
  { nonce: "1", hash: "4c1e0b77fa…07ab", ok: false },
  { nonce: "2", hash: "e8029c4b13…9d14", ok: false },
  { nonce: "3", hash: "1b77e0fd5c…44a0", ok: false },
] as const

export function MiningLoop() {
  const t = useTranslations("introduction.howItWorks.mining.loop")
  return (
    <div className="overflow-hidden rounded-xl border border-stroke bg-background">
      <div className="flex items-center justify-between gap-4 border-b border-hairline px-4 py-3">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-foreground">{t("title")}</p>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{t("note")}</p>
      </div>
      <div className="px-4 py-4 font-mono text-[12px] leading-6 sm:text-[13px]">
        <p className="text-muted-foreground">
          {t("target")} <span className="text-foreground">0x00000000ffff…</span>
        </p>
        <div className="mt-3 grid grid-cols-[auto_1fr_auto] gap-x-4">
          <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{t("nonce")}</span>
          <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{t("hash")}</span>
          <span />
          {ATTEMPTS.map((a) => (
            <div key={a.nonce} className="contents text-foreground/60">
              <span className="text-right tabular-nums">{a.nonce}</span>
              <span className="truncate">0x{a.hash}</span>
              <X className="size-3.5 self-center text-muted-foreground" aria-hidden />
            </div>
          ))}
          <span className="text-right text-muted-foreground">⋮</span>
          <span className="text-muted-foreground">⋮</span>
          <span />
          <span className="text-right tabular-nums text-foreground">81,374,026</span>
          <span className="truncate text-brand">0x000000003b7f…e905</span>
          <Check className="size-3.5 self-center text-brand" aria-hidden />
        </div>
      </div>
      <div className="grid border-t border-hairline text-sm sm:grid-cols-2">
        <p className="flex items-center gap-2 px-4 py-3 text-muted-foreground">
          <RotateCcw className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
          {t("no")}
        </p>
        <p className="flex items-center gap-2 border-t border-hairline px-4 py-3 text-foreground sm:border-t-0 sm:border-l">
          <Check className="size-4 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
          {t("yes")}
        </p>
      </div>
    </div>
  )
}

/* ASERT, illustrated: hashrate steps up, blocks briefly come faster, and
   the per-block difficulty adjustment walks block time back to target.
   Shapes are drawn on a stretched viewBox; labels are HTML so they stay
   legible at phone width. */
export function DifficultyChart() {
  const t = useTranslations("introduction.howItWorks.mining")
  // block time: 10 → drops to 5 at x=25, then recovers toward 10 (exponential)
  const pts: string[] = []
  for (let x = 0; x <= 100; x += 1) {
    let v = 10
    if (x >= 25) v = 10 - 5 * Math.pow(0.5, (x - 25) / 12)
    pts.push(`${x},${(100 - v * 6.5).toFixed(2)}`)
  }
  const blockTimePath = `M${pts.join(" L")}`

  return (
    <div className="rounded-xl border border-stroke bg-background p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-base text-foreground">{t("chartTitle")}</p>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{t("chartLabel")}</p>
      </div>

      {/* hashrate */}
      <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{t("hashrate")}</p>
      <div className="relative mt-2 h-14">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
          <path d="M0,70 L25,70 L25,20 L100,20" fill="none" className="stroke-foreground/70" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
          <path d="M0,70 L25,70 L25,20 L100,20 L100,100 L0,100 Z" className="fill-foreground/[0.05]" />
        </svg>
      </div>

      {/* block time */}
      <div className="mt-4 flex items-baseline justify-between gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{t("blockTime")}</p>
        <p className="font-mono text-[11px] text-brand">{t("target")}</p>
      </div>
      <div className="relative mt-2 h-28">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
          <defs>
            <linearGradient id="hiw-bt" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="var(--brand)" />
              <stop offset="100%" stopColor="var(--brand-2)" />
            </linearGradient>
          </defs>
          <line x1="0" x2="100" y1="35" y2="35" className="stroke-brand/60" strokeWidth={1} strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
          <line x1="25" x2="25" y1="0" y2="100" className="stroke-hairline" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          <path d={blockTimePath} fill="none" stroke="url(#hiw-bt)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="absolute top-[35%] right-0 -translate-y-[130%] font-mono text-[11px] text-muted-foreground">10 min</span>
        <span className="absolute top-[67%] left-[26%] font-mono text-[11px] text-muted-foreground">5 min</span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t("chartNote")}</p>
    </div>
  )
}

/* ── Supply ───────────────────────────────────────────────────────────
   The issuance schedule: total supply climbing toward the cap above, the
   subsidy halving era by era below. Seven eras of 210,000 blocks. */
const ERAS = 7
const CAP = 21_000_000
const supplyAt = (era: number) => CAP * (1 - Math.pow(0.5, era))
const fmtM = (n: number) => `${(n / 1_000_000).toFixed(n < 20_000_000 && n % 1_000_000 ? 2 : 1).replace(/\.?0+$/, "")}M`
const fmtSubsidy = (n: number) => (n >= 10 ? String(n) : n.toFixed(2).replace(/\.?0+$/, ""))

export function HalvingChart() {
  const t = useTranslations("introduction.howItWorks.supply")
  // y: 0 supply → 100, cap → 12
  const y = (s: number) => 100 - (s / CAP) * 88
  const curve = Array.from({ length: ERAS + 1 }, (_, e) => `${(e / ERAS) * 100},${y(supplyAt(e)).toFixed(2)}`)
  const line = `M${curve.join(" L")}`
  const area = `${line} L100,100 L0,100 Z`
  const subsidies = Array.from({ length: ERAS }, (_, e) => 50 / Math.pow(2, e))

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card p-5 sm:p-8">
      <div aria-hidden className="aurora opacity-60" />
      <div className="relative">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="tag text-foreground">{t("chartTitle")}</p>
          <div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <span className="flex items-center gap-2"><span aria-hidden className="brand-gradient h-0.5 w-5 rounded-full" />{t("total")}</span>
            <span className="flex items-center gap-2"><span aria-hidden className="h-2.5 w-2.5 rounded-sm bg-foreground/25" />{t("subsidy")}</span>
          </div>
        </div>

        {/* total supply */}
        <div className="relative mt-8 h-48 sm:h-64">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
            <defs>
              <linearGradient id="hiw-supply-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hiw-supply-line" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="var(--brand)" />
                <stop offset="100%" stopColor="var(--brand-2)" />
              </linearGradient>
            </defs>
            {Array.from({ length: ERAS - 1 }, (_, i) => (
              <line key={i} x1={((i + 1) / ERAS) * 100} x2={((i + 1) / ERAS) * 100} y1="0" y2="100" className="stroke-hairline" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            ))}
            <line x1="0" x2="100" y1="12" y2="12" className="stroke-foreground/40" strokeWidth={1} strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
            <path d={area} fill="url(#hiw-supply-fill)" />
            <path d={line} fill="none" stroke="url(#hiw-supply-line)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          </svg>
          <span className="absolute top-[12%] left-0 -translate-y-[130%] font-mono text-[11px] text-foreground/70">{t("cap")}</span>
          {Array.from({ length: ERAS }, (_, e) => {
            const s = supplyAt(e + 1)
            return (
              <span
                key={e}
                className={cn("absolute -translate-x-full pr-1.5 font-mono text-[10px] text-muted-foreground sm:text-[11px]", e > 3 && "hidden")}
                style={{ left: `${((e + 1) / ERAS) * 100}%`, top: `${y(s) - 10}%` }}
              >
                {fmtM(s)}
              </span>
            )
          })}
        </div>

        {/* subsidy per era */}
        <div className="mt-3 grid h-20 grid-cols-7 items-end gap-1 border-t border-hairline pt-3 sm:h-24 sm:gap-2">
          {subsidies.map((s, e) => (
            <div key={e} className="flex h-full flex-col justify-end">
              <span className="mb-1 font-mono text-[10px] text-foreground/80 sm:text-xs">{fmtSubsidy(s)}</span>
              <div className={cn("rounded-t-sm", e === 0 ? "brand-gradient" : "bg-foreground/20")} style={{ height: `${(s / 50) * 100}%`, minHeight: 2 }} />
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1 sm:gap-2">
          {subsidies.map((_, e) => (
            <span key={e} className="truncate font-mono text-[10px] text-muted-foreground sm:text-[11px]">
              {e === 0 ? "0" : `${(e * 210).toLocaleString("en-US")}k`}
            </span>
          ))}
        </div>
        <p className="mt-2 text-right font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{t("axis")} →</p>
      </div>
    </div>
  )
}

/* ── Contracts ────────────────────────────────────────────────────────
   An escrow: the buyer pays the contract, the contract's rules decide
   where the money goes. */
export function EscrowDiagram() {
  const t = useTranslations("introduction.howItWorks.contracts")
  const rules = t.raw("rules") as string[]

  const party = (Icon: typeof User, label: string) => (
    <div className="flex items-center gap-3 rounded-full border border-stroke bg-background px-4 py-2.5 md:flex-col md:rounded-xl md:px-5 md:py-5">
      <Icon className="size-5 text-foreground/80" strokeWidth={1.5} aria-hidden />
      <span className="text-[15px] text-foreground">{label}</span>
    </div>
  )

  return (
    <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card p-5 sm:p-8">
      <div aria-hidden className="aurora aurora-left opacity-70" />
      <div className="relative flex flex-wrap items-baseline justify-between gap-2">
        <p className="tag text-foreground">{t("exampleLabel")}</p>
        <p className="text-sm text-muted-foreground">{t("exampleTitle")}</p>
      </div>
      <div className="relative mt-8 grid items-center gap-3 md:grid-cols-[auto_1fr_minmax(0,22rem)_1fr_auto] md:gap-0">
        {party(User, t("buyer"))}
        <div aria-hidden className="flex justify-center text-brand md:block">
          <ArrowDown className="size-4 md:hidden" strokeWidth={1.5} />
          <div className="relative hidden h-px bg-gradient-to-r from-brand/30 to-brand md:block">
            <span className="absolute top-1/2 right-0 -translate-y-1/2 font-mono text-[11px] text-brand">▸</span>
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[11px] text-muted-foreground">LAX</span>
          </div>
        </div>
        <div className="rounded-xl border border-brand/30 bg-background p-5">
          <div className="flex items-center gap-2">
            <FileCode2 className="size-5 text-brand" strokeWidth={1.5} aria-hidden />
            <span className="text-[15px] text-foreground">{t("contract")}</span>
          </div>
          <ol className="mt-4 space-y-2.5">
            {rules.map((rule, i) => (
              <li key={rule} className="flex gap-3 text-sm leading-snug text-muted-foreground">
                <span className="font-mono text-xs text-brand">{i + 1}</span>
                {rule}
              </li>
            ))}
          </ol>
        </div>
        <div aria-hidden className="flex justify-center text-brand md:block">
          <ArrowDown className="size-4 md:hidden" strokeWidth={1.5} />
          <div className="relative hidden h-px bg-gradient-to-r from-brand to-brand/30 md:block">
            <span className="absolute top-1/2 right-0 -translate-y-1/2 font-mono text-[11px] text-brand/50">▸</span>
          </div>
        </div>
        {party(Store, t("seller"))}
      </div>
    </div>
  )
}

/* ── Full nodes ───────────────────────────────────────────────────────
   An incoming block run through the node's checklist, with the two
   possible outcomes. */
export function NodeChecks() {
  const t = useTranslations("introduction.howItWorks.nodes")
  const checks = t.raw("checks") as string[]

  return (
    <div className="overflow-hidden rounded-2xl border border-stroke bg-card">
      <div className="flex items-center gap-3 border-b border-hairline px-5 py-3 sm:px-6">
        <span aria-hidden className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand/60 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-brand" />
        </span>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-foreground">{t("incoming")}</p>
      </div>
      <ul className="divide-y divide-hairline">
        {checks.map((check) => (
          <li key={check} className="flex items-center gap-4 px-5 py-3.5 sm:px-6">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand-muted">
              <Check className="size-3.5 text-brand" strokeWidth={2} aria-hidden />
            </span>
            <span className="text-[15px] text-foreground/90">{check}</span>
          </li>
        ))}
      </ul>
      <div className="grid border-t border-hairline sm:grid-cols-2">
        <p className="flex items-start gap-3 bg-brand-muted px-5 py-4 text-sm text-foreground sm:px-6">
          <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2} aria-hidden />
          {t("valid")}
        </p>
        <p className="flex items-start gap-3 border-t border-hairline px-5 py-4 text-sm text-muted-foreground sm:border-t-0 sm:border-l sm:px-6">
          <X className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden />
          {t("invalid")}
        </p>
      </div>
    </div>
  )
}
