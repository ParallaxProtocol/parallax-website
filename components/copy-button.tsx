"use client"

import { cn } from "@/lib/utils"
import { Check, Copy } from "lucide-react"
import { useState } from "react"

/* A small round icon button that copies `value` and briefly shows a check.
   Labels come from the caller so it stays namespace-agnostic. */
export function CopyButton({
  value,
  label,
  copiedLabel,
  className,
}: {
  value: string
  label: string
  copiedLabel: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard unavailable: nothing to do
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? copiedLabel : `${label}: ${value}`}
      title={copied ? copiedLabel : label}
      className={cn(
        "inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
    >
      {copied ? <Check className="size-3.5 text-brand" /> : <Copy className="size-3.5" />}
      <span aria-live="polite" className="sr-only">{copied ? copiedLabel : ""}</span>
    </button>
  )
}
