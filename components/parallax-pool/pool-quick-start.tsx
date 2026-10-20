'use client'
import { CodeBlock } from "@/components/client-quick-start"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { useState } from "react"

const PASSWORD_FILE = "/home/parallax/.parallax/pool-password.txt"

/* The commands from Parallax Pool's README; the miner tab uses Hashwarp's
   own flags, as its page does. */
const TABS = [
  {
    key: "solo",
    commands: [
      "git clone https://github.com/ParallaxProtocol/parallax-pool && cd parallax-pool",
      "cp .env.example .env",
      "docker compose up -d",
    ],
  },
  {
    key: "shared",
    commands: [
      `docker compose run --rm --no-deps --entrypoint sh node -c 'umask 077 && head -c 24 /dev/urandom | base64 > ${PASSWORD_FILE}'`,
      `docker compose run --rm --no-deps --entrypoint parallax-wallet node new --datadir /home/parallax/.parallax --password ${PASSWORD_FILE}`,
      "docker compose up -d",
    ],
  },
  {
    key: "miners",
    commands: ["./hashwarp --pool pool.example.com:4073 --wallet 0xYourParallaxAddress --worker rig1"],
  },
] as const

type TabKey = (typeof TABS)[number]["key"]

export function PoolQuickStart() {
  const t = useTranslations("parallaxPool.start")
  const [active, setActive] = useState<TabKey>("solo")
  const tab = TABS.find((x) => x.key === active) ?? TABS[0]

  return (
    <div>
      <div role="tablist" aria-label={t("heading")} className="flex w-fit flex-wrap gap-1 rounded-2xl border border-stroke bg-foreground/[0.04] p-1 sm:rounded-full">
        {TABS.map(({ key }) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`pool-tab-${key}`}
            aria-selected={key === active}
            aria-controls="pool-tabpanel"
            onClick={() => setActive(key)}
            className={cn(
              "relative cursor-pointer rounded-full px-3.5 py-1.5 text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
              key === active ? "text-background" : "text-muted-foreground hover:bg-foreground/10 hover:text-foreground",
            )}
          >
            {key === active && (
              <motion.span
                layoutId="pool-quick-start-pill"
                aria-hidden
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative">{t(`tabs.${key}.label`)}</span>
          </button>
        ))}
      </div>

      <motion.div layout transition={{ type: "spring", stiffness: 400, damping: 40 }} className="mt-6 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            id="pool-tabpanel"
            role="tabpanel"
            aria-labelledby={`pool-tab-${active}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-3"
          >
            {tab.commands.map((command) => (
              <CodeBlock key={command} copyLabel={t("copy")} copiedLabel={t("copied")}>
                {command}
              </CodeBlock>
            ))}
            <p className="pt-2 text-sm leading-relaxed text-muted-foreground">{t(`tabs.${active}.note`)}</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
