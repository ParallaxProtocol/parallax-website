"use client"
import { FadeIn } from "@/components/fade-in"
import MainMotion from "@/components/main-motion"
import PageHeader from "@/components/page-header"
import { Section, SectionHeading, TwoToneTitle } from "@/components/section"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink } from "lucide-react"
import { useTranslations } from "next-intl"
import { FaGithub } from "react-icons/fa"

type NetworkRow = { label: string; value: string }
type RawItem = { title: string; description: string }

const HARDHAT_CONFIG = `import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: { evmVersion: "berlin" },
  },
  networks: {
    parallax: {
      url: "https://rpc.parallaxprotocol.org",
      chainId: 2110,
    },
  },
};

export default config;`

const FOUNDRY_CONFIG = `[profile.default]
evm_version = "berlin"

[rpc_endpoints]
parallax = "https://rpc.parallaxprotocol.org"`

/* A config file as a terminal panel: the filename on a hairline header row,
   marked in blue (the developer colour, see audience-router.tsx). */
function CodeCard({ title, code }: { title: string; code: string }) {
  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-stroke bg-card">
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <p className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-foreground">
          <span aria-hidden className="size-1.5 rounded-full bg-brand-2" />
          {title}
        </p>
        <span aria-hidden className="font-mono text-xs tracking-[0.2em] text-muted-foreground/50">||||||||</span>
      </div>
      <pre className="flex-1 overflow-x-auto p-5 font-mono text-xs leading-relaxed text-foreground/85 sm:text-[13px]">
        {code}
      </pre>
    </div>
  )
}

export default function ParallaxForDevelopers() {
  const t = useTranslations("introduction.parallaxForDevelopers")
  const networkRows = t.raw("network.rows") as NetworkRow[]
  const differences = t.raw("differences.items") as RawItem[]

  return (
    <MainMotion>
      <PageHeader
        title={t("pageTitle")}
        subTitle={t("pageSubtitle")}
      />

      {/* Network facts — heading on the left, the facts as a ledger on the right */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-4">
            <p className="tag"><span className="text-brand">01</span></p>
            <h2 className="mt-6 text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl">
              <TwoToneTitle text={t("network.heading")} />
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="min-w-0 lg:col-span-8">
            <dl className="overflow-hidden rounded-2xl border border-stroke bg-card">
              {networkRows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-1 border-b border-hairline px-5 py-4 last:border-b-0 sm:grid-cols-[13rem_1fr] sm:gap-6 sm:px-6"
                >
                  <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground sm:pt-0.5">
                    {row.label}
                  </dt>
                  <dd className="font-mono text-sm text-foreground [overflow-wrap:anywhere]">{row.value}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </Section>

      {/* Compiler config */}
      <Section>
        <FadeIn>
          <SectionHeading index="02" eyebrow={undefined} title={t("config.heading")} subtitle={t("config.tagline")} />
        </FadeIn>
        <div className="mt-16 grid gap-4 lg:grid-cols-2">
          <FadeIn delay={0.05} className="min-w-0">
            <CodeCard title={t("config.hardhatTitle")} code={HARDHAT_CONFIG} />
          </FadeIn>
          <FadeIn delay={0.1} className="min-w-0">
            <CodeCard title={t("config.foundryTitle")} code={FOUNDRY_CONFIG} />
          </FadeIn>
        </div>
      </Section>

      {/* Differences — a numbered ledger, one row per change */}
      <Section>
        <FadeIn>
          <SectionHeading index="03" eyebrow={undefined} title={t("differences.heading")} subtitle={t("differences.tagline")} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <ol className="mt-16 overflow-hidden rounded-2xl border border-stroke">
            {differences.map((item, i) => (
              <li
                key={item.title}
                className="grid gap-3 border-b border-hairline p-6 last:border-b-0 sm:p-8 lg:grid-cols-12 lg:gap-8"
              >
                <span className="tag text-brand lg:col-span-1 lg:pt-1.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-xl leading-tight text-foreground sm:text-2xl lg:col-span-4">{item.title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground lg:col-span-7">{item.description}</p>
              </li>
            ))}
          </ol>
        </FadeIn>
      </Section>

      {/* Why, with the CTAs inside its glowing panel. Last band: it runs flush into the footer's rule instead
          of leaving MainMotion's bottom padding. */}
      <Section className="border-b-0">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card p-8 sm:p-12">
            <div aria-hidden className="aurora" />
            <div className="relative">
              <h2 className="max-w-3xl text-3xl leading-[1.1] text-foreground text-balance sm:text-4xl lg:text-5xl">
                <TwoToneTitle text={t("why.heading")} />
              </h2>
              <p className="accent-rule mt-8 max-w-3xl pl-6 text-base leading-relaxed text-muted-foreground sm:text-lg">{t("why.body")}</p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button variant="brand" size="lg" className="w-full sm:w-fit" asChild>
              <a href="https://docs.parallaxprotocol.org/parallax-protocol/parallax-stack/smart-contracts" target="_blank" rel="noopener">
                {t("ctas.docs")}
                <ArrowRight />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-fit" asChild>
              <a href="https://explorer.parallaxprotocol.org" target="_blank" rel="noopener">
                {t("ctas.explorer")}
                <ExternalLink />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-fit" asChild>
              <a href="https://github.com/ParallaxProtocol" target="_blank" rel="noopener">
                {t("ctas.github")}
                <FaGithub />
              </a>
            </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>
    </MainMotion>
  )
}
