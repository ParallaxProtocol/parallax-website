import { TerminalPlate } from "@/components/client-quick-start"

// `parallax-cli info` from a synced mainnet node (v2.1.5), with the node's id
// replaced by a random one, the enode line dropped and a few pending
// transactions in the mempool. Set to null and the plate shows a
// placeholder of about the same height instead.
const CLI_INFO_OUTPUT: string | null = `{
  "blocks": 60399,
  "chainid": 2110,
  "connections": 8,
  "gasprice": "1000000000",
  "id": "60f601255cc6d344f513f7ee3093cb69f42044d7b4d58a060c2f1651352ab760",
  "listenaddr": "[::]:32110",
  "mempool": {
    "pending": 3,
    "queued": 0
  },
  "mining": false,
  "networkid": "2110",
  "protocolversion": 66,
  "syncing": false,
  "version": "Parallax/v2.1.5-stable-e7d55074/linux-amd64/go1.27.2-X:nodwarf5"
}`

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
