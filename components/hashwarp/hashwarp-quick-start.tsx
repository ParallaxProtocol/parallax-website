'use client'
import { CodeBlock } from "@/components/client-quick-start"
import { usePlatform } from "@/hooks/usePlatform"
import { cn } from "@/lib/utils"
import { ArrowUpRight } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { useState } from "react"

const ADDRESS = "0xYourParallaxAddress"

/* The commands from Hashwarp's README and packaging/release start scripts,
   with the pool left as a placeholder: the wizard and the pool index name
   the real ones. */
const TABS = [
  { key: "firstRun", commands: (bin: string) => [bin] },
  { key: "pool", commands: (bin: string) => [`${bin} --pool pool.example.com:3333 --wallet ${ADDRESS} --worker rig1`] },
  {
    key: "failover",
    commands: (bin: string) => [`${bin} --pool pool.example.com:4443,backup.example.com:4443 --tls --wallet ${ADDRESS}`],
  },
  {
    key: "solo",
    commands: (bin: string) => [
      `parallaxd --http --http.api eth,net,web3,miner --mine --miner.coinbase ${ADDRESS}`,
      `${bin} --solo`,
    ],
  },
] as const

type TabKey = (typeof TABS)[number]["key"]

export function HashwarpQuickStart() {
  const t = useTranslations("hashwarp.start")
  const { platform } = usePlatform()
  const [active, setActive] = useState<TabKey>("firstRun")

  // The Linux spelling until detection settles, so the layout is stable.
  const bin = platform?.os === "windows" ? "hashwarp.exe" : "./hashwarp"
  const tab = TABS.find((x) => x.key === active) ?? TABS[0]

  return (
    <div>
      <div role="tablist" aria-label={t("heading")} className="flex w-fit flex-wrap gap-1 rounded-2xl border border-stroke bg-foreground/[0.04] p-1 sm:rounded-full">
        {TABS.map(({ key }) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`hashwarp-tab-${key}`}
            aria-selected={key === active}
            aria-controls="hashwarp-tabpanel"
            onClick={() => setActive(key)}
            className={cn(
              "relative cursor-pointer rounded-full px-3.5 py-1.5 text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              key === active ? "text-background" : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
            )}
          >
            {/* The active pill is one shared element that slides from tab
                to tab (layoutId) instead of snapping, as in McpConnect */}
            {key === active && (
              <motion.span
                layoutId="hashwarp-quick-start-pill"
                aria-hidden
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative">{t(`tabs.${key}.label`)}</span>
          </button>
        ))}
      </div>

      {/* The panel cross-fades between tabs, and its height follows so the
          solo tab's second command grows the box smoothly */}
      <motion.div layout transition={{ type: "spring", stiffness: 400, damping: 40 }} className="mt-6 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            id="hashwarp-tabpanel"
            role="tabpanel"
            aria-labelledby={`hashwarp-tab-${active}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-3"
          >
            {tab.commands(bin).map((command) => (
              <CodeBlock key={command} copyLabel={t("copy")} copiedLabel={t("copied")}>
                {command}
              </CodeBlock>
            ))}
            <p className="pt-2 text-sm leading-relaxed text-muted-foreground">{t(`tabs.${active}.note`)}</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <a
        href="https://miningpoolstats.stream/parallax"
        target="_blank"
        rel="noopener"
        className="group mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-foreground"
      >
        {t("pools")}
        <ArrowUpRight className="size-4 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
      </a>
    </div>
  )
}
