"use client"
import { FadeIn } from "@/components/fade-in"
import { GENESIS_HASH } from "@/lib/genesis"
import MainMotion from "@/components/main-motion"
import PageHeader from "@/components/page-header"
import { Section, TwoToneTitle } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { ArrowRight, Check, Copy } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

const RPC = "https://rpc.parallaxprotocol.org"

const CMD_GENESIS_HASH = `curl -s ${RPC} -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["0x0",false],"id":1}' \\
  | jq -r '.result.hash'`

const CMD_GENESIS_EXTRA = `curl -s ${RPC} -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["0x0",false],"id":1}' \\
  | jq -r '.result.extraData' | sed 's/^0x//' | xxd -r -p; echo`

// Supply follows from the height alone: blocks 1..h, 50 LAX each, halving
// (integer division of the wei amount) every 210,000 blocks, genesis paying
// nothing. Mirrors cumulativeEmissionThrough in the client's kernel/xhash.
const CMD_SUPPLY_COMPUTED = `curl -s ${RPC} -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \\
  | python3 -c 'import json,sys; h=int(json.load(sys.stdin)["result"],16); w=sum(max(0,min(h,(e+1)*210000-1)-max(1,e*210000)+1)*((50*10**18)>>e) for e in range(64)); print(f"height {h}: {w/10**18:,.0f} LAX")'`

// The node's own sum of every block reward, in wei. The xhash namespace is
// off on the public RPC, so this needs a node started with --http.api
// including xhash.
const CMD_SUPPLY_NODE = `curl -s http://localhost:8545 -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"xhash_getTotalSupply","params":[],"id":1}'`

const CMD_CHAIN_ID = `curl -s ${RPC} -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'`

const CMD_LATEST_BLOCK = `curl -s ${RPC} -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest",false],"id":1}' \\
  | jq '{number: .result.number, timestamp: .result.timestamp, gasLimit: .result.gasLimit}'`

function CommandBlock({
  label,
  command,
  copyLabel,
  copiedLabel,
}: {
  label: string
  command: string
  copyLabel: string
  copiedLabel: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable (e.g. insecure context) — nothing to do
    }
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-stroke bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-hairline py-2 pr-2 pl-4">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
        <button
          onClick={copy}
          className="inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-stroke px-3 text-[13px] font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          aria-label={copyLabel}
        >
          {copied ? <Check className="size-3.5 text-brand" /> : <Copy className="size-3.5" />}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-foreground/85 sm:p-5">
        {command}
      </pre>
    </div>
  )
}

/* Each claim gets a two-column spread: the argument on the left (pinned
   while you scroll on desktop), the commands that check it on the right. */
function Claim({
  index,
  heading,
  children,
  commands,
}: {
  index: string
  heading: string
  children: React.ReactNode
  commands: React.ReactNode
}) {
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <FadeIn className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="tag"><span className="text-brand">{index}</span></p>
            <h2 className="mt-6 text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl"><TwoToneTitle text={heading} /></h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">{children}</div>
          </div>
        </FadeIn>
        <FadeIn delay={0.1} className="min-w-0 lg:col-span-7">
          <div className="flex flex-col gap-4">{commands}</div>
        </FadeIn>
      </div>
    </Section>
  )
}

export default function VerifyPage() {
  const t = useTranslations("introduction.verify")
  const copyLabel = t("copy")
  const copiedLabel = t("copied")

  return (
    <MainMotion>
      <PageHeader
        title={t("pageTitle")}
        subTitle={t("pageSubtitle")}
      />

      {/* Genesis */}
      <Claim
        index="01"
        heading={t("genesis.heading")}
        commands={
          <>
            <div className="relative overflow-hidden rounded-xl border border-stroke bg-card">
              <div aria-hidden className="aurora" />
              <div className="relative flex items-center justify-between border-b border-hairline px-4 py-3">
                <p className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-foreground">
                  <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                  {t("genesis.hashLabel")}
                </p>
                <span aria-hidden className="font-mono text-xs tracking-[0.2em] text-muted-foreground/50">||||||||</span>
              </div>
              <p className="relative px-4 py-5 font-mono text-xs leading-relaxed text-foreground break-all sm:px-5 sm:text-sm">{GENESIS_HASH}</p>
            </div>
            <CommandBlock label={t("genesis.cmdHashLabel")} command={CMD_GENESIS_HASH} copyLabel={copyLabel} copiedLabel={copiedLabel} />
            <CommandBlock label={t("genesis.cmdExtraLabel")} command={CMD_GENESIS_EXTRA} copyLabel={copyLabel} copiedLabel={copiedLabel} />
          </>
        }
      >
        <p>{t("genesis.body1")}</p>
        <blockquote className="py-2 text-2xl font-light leading-[1.2] tracking-[-0.03em] text-foreground text-balance sm:text-3xl">
          <span aria-hidden className="text-gradient">&ldquo;</span>{t("genesis.headline")}<span aria-hidden className="text-gradient">&rdquo;</span>
        </blockquote>
        <p>{t("genesis.body2")}</p>
      </Claim>

      {/* Supply */}
      <Claim
        index="02"
        heading={t("supply.heading")}
        commands={
          <>
            <CommandBlock label={t("supply.cmdComputedLabel")} command={CMD_SUPPLY_COMPUTED} copyLabel={copyLabel} copiedLabel={copiedLabel} />
            <CommandBlock label={t("supply.cmdNodeLabel")} command={CMD_SUPPLY_NODE} copyLabel={copyLabel} copiedLabel={copiedLabel} />
          </>
        }
      >
        <p>{t("supply.body1")}</p>
        <p>{t("supply.body2")}</p>
      </Claim>

      {/* Rules */}
      <Claim
        index="03"
        heading={t("rules.heading")}
        commands={
          <>
            <CommandBlock label={t("rules.cmdChainIdLabel")} command={CMD_CHAIN_ID} copyLabel={copyLabel} copiedLabel={copiedLabel} />
            <CommandBlock label={t("rules.cmdBlockLabel")} command={CMD_LATEST_BLOCK} copyLabel={copyLabel} copiedLabel={copiedLabel} />
          </>
        }
      >
        <p>{t("rules.body1")}</p>
      </Claim>

      {/* Run your own node. Last band: it runs flush into the footer's rule
          instead of leaving MainMotion's bottom padding. */}
      <Section className="border-b-0">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card p-8 sm:p-12">
            <div aria-hidden className="aurora" />
            <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <h2 className="text-3xl leading-[1.1] text-foreground text-balance sm:text-4xl lg:text-5xl"><TwoToneTitle text={t("node.heading")} /></h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{t("node.body1")}</p>
            </div>
            <div className="lg:col-span-4 lg:justify-self-end">
              <Button variant="brand" size="lg" className="w-full sm:w-fit" asChild>
                <Link href={"/resources/parallax-client"}>
                  {t("node.cta")}
                  <ArrowRight />
                </Link>
              </Button>
            </div>
            </div>
          </div>
        </FadeIn>
      </Section>
    </MainMotion>
  )
}
