'use client'
import { Check, Copy } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

/* The values a wallet asks for when adding Parallax by hand, each with a
   copy button. Kept in step with lib/parallax-network.ts. */
const ROWS = [
  { key: "name", value: "Parallax" },
  { key: "rpc", value: "https://rpc.parallaxprotocol.org" },
  { key: "chainId", value: "2110" },
  { key: "currency", value: "LAX" },
  { key: "explorer", value: "https://explorer.parallaxprotocol.org" },
] as const

function CopyButton({ value, label, copiedLabel }: { value: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable (insecure context) — the value is selectable
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label} ${value}`}
      className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
    >
      {copied ? <Check className="size-4 text-brand" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      <span className="sr-only" aria-live="polite">{copied ? copiedLabel : ""}</span>
    </button>
  )
}

export function NetworkSettings() {
  const t = useTranslations("introduction.gettingStarted.network")
  return (
    <div className="overflow-hidden rounded-2xl border border-stroke bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-3 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-foreground">{t("panel")}</p>
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </span>
      </div>
      <dl className="divide-y divide-hairline">
        {ROWS.map((row) => (
          <div key={row.key} className="grid gap-1 px-5 py-3 sm:grid-cols-[11rem_1fr_auto] sm:items-center sm:gap-4 sm:px-6">
            <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{t(`rows.${row.key}`)}</dt>
            <dd className="flex min-w-0 items-center justify-between gap-3 sm:contents">
              <span className="min-w-0 font-mono text-sm break-all text-foreground select-all">{row.value}</span>
              <CopyButton value={row.value} label={t("copy")} copiedLabel={t("copied")} />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
