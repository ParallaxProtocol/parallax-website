import { TerminalPlate } from "@/components/client-quick-start"

// Real `parallax-cli info` output from a synced mainnet node, pasted as-is.
// Until it exists the plate shows a placeholder of about the same height:
// set this to the output and the placeholder goes.
const CLI_INFO_OUTPUT: string | null = null

/* The hero's terminal: the command behind a prompt glyph, then its output. */
export function CliInfoCapture({ label, placeholder, alt }: { label: string; placeholder: string; alt: string }) {
  return (
    <TerminalPlate>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-foreground/90 sm:px-6 sm:py-5">
        <code>
          <span aria-hidden className="select-none text-brand">$ </span>
          {label}
        </code>
      </pre>
      {CLI_INFO_OUTPUT ? (
        <pre className="overflow-x-auto border-t border-hairline px-4 py-4 font-mono text-[13px] leading-relaxed text-foreground/75 sm:px-6 sm:py-5">
          <code>{CLI_INFO_OUTPUT}</code>
        </pre>
      ) : (
        <div role="img" aria-label={alt} className="flex min-h-80 flex-col items-center justify-center gap-3 border-t border-dashed border-white/10 px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/40">{placeholder}</p>
          <p className="max-w-md text-sm text-white/50">{alt}</p>
        </div>
      )}
    </TerminalPlate>
  )
}
