"use client"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

/* A donation address in a terminal plate: network label on the header row,
   the full address in mono below, and a copy button so nobody retypes it. */
export function DonationAddress({
  title,
  network,
  address,
  tint,
  copyLabel,
  copiedLabel,
}: {
  title: string
  network: string
  address: string
  tint: string
  copyLabel: string
  copiedLabel: string
}) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable — the address stays selectable
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-stroke bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-hairline px-5 py-3">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="flex items-center gap-2.5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-foreground">
            <span aria-hidden className={`size-1.5 rounded-full ${tint}`} />
            {title}
          </h3>
          <p className="font-mono text-xs text-muted-foreground">{network}</p>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-stroke px-3 text-sm text-foreground outline-none transition-colors hover:border-foreground/30 hover:bg-foreground/5 focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transition-none"
        >
          {copied ? <Check className="size-3.5 text-brand" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
        </button>
      </div>
      <code className="block select-all break-all px-5 py-5 font-mono text-sm leading-relaxed text-foreground sm:text-base">
        {address}
      </code>
    </div>
  )
}
