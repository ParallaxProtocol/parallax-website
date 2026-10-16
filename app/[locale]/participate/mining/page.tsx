"use client"
import { FadeIn } from "@/components/fade-in"
import MainMotion from "@/components/main-motion"
import PageHeader from "@/components/page-header"
import { Section, TwoToneTitle } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { ArrowRight, Cpu, ExternalLink, Scale } from "lucide-react"
import { useTranslations } from "next-intl"

type FactRow = { label: string; value: string }
type Step = { title: string; description: string }

/* Section opener: a mono index kicker, then a two-tone headline. */
function LedgerHeading({ index, children }: { index: string; children: string }) {
  return (
    <div>
      <p className="tag"><span className="text-brand">{index}</span></p>
      <h2 className="mt-6 text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl">
        <TwoToneTitle text={children} />
      </h2>
    </div>
  )
}

export default function MiningPage() {
  const t = useTranslations("participate.mining")
  const facts = t.raw("facts.rows") as FactRow[]
  const steps = t.raw("start.steps") as Step[]

  return (
    <MainMotion>
      <PageHeader
        title={t("title")}
        subTitle={t("subtitle")}
      />

      {/* The hook: your rig works */}
      <Section innerClassName="py-16 md:py-20">
        <FadeIn>
          <div className="relative grid grid-cols-1 overflow-hidden rounded-2xl border border-stroke bg-card lg:grid-cols-12">
            <div aria-hidden className="aurora aurora-left" />
            <div className="relative flex flex-col justify-between gap-12 border-b border-hairline p-8 sm:p-10 lg:col-span-5 lg:border-r lg:border-b-0">
              <span className="flex size-11 items-center justify-center rounded-full border border-stroke">
                <Cpu className="size-5 text-brand" strokeWidth={1.5} />
              </span>
              <h2 className="text-3xl leading-[1.05] text-foreground text-balance sm:text-4xl lg:text-5xl">
                <TwoToneTitle text={t("rig.heading")} />
              </h2>
            </div>
            <div className="relative flex flex-col justify-between gap-10 p-8 sm:p-10 lg:col-span-7">
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">{t("rig.body")}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="outline" className="w-full sm:w-fit" asChild>
                  <a href="https://github.com/ParallaxProtocol/hashwarp/releases" target="_blank" rel="noopener">
                    {t("rig.hashwarpCta")}
                    <ExternalLink />
                  </a>
                </Button>
                <Button variant="outline" className="w-full sm:w-fit" asChild>
                  <a href="https://github.com/doktor83/SRBMiner-Multi/releases" target="_blank" rel="noopener">
                    {t("rig.srbminerCta")}
                    <ExternalLink />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* Facts — a two-column ledger */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-4">
            <LedgerHeading index="01">{t("facts.heading")}</LedgerHeading>
          </FadeIn>
          <FadeIn delay={0.05} className="lg:col-span-8">
            <dl className="border-t border-hairline">
              {facts.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-1 border-b border-hairline py-5 sm:grid-cols-[13rem_1fr] sm:gap-6"
                >
                  <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground sm:pt-1">
                    {row.label}
                  </dt>
                  <dd className="text-base text-foreground sm:text-lg">{row.value}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </Section>

      {/* Steps — one ruled strip */}
      <Section className="border-b-0">
        <FadeIn>
          <LedgerHeading index="02">{t("start.heading")}</LedgerHeading>
        </FadeIn>
        <FadeIn delay={0.05}>
          <ol className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="flex flex-col bg-background p-6 sm:p-8">
                <p className="text-5xl font-light leading-none tracking-[-0.03em] text-brand">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-10 text-xl leading-tight text-foreground">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </FadeIn>

        {/* Economics */}
        <FadeIn>
          <div className="mt-16 flex flex-col gap-6 rounded-xl border border-stroke bg-card p-6 sm:flex-row sm:p-8">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-stroke">
              <Scale className="size-5 text-brand" strokeWidth={1.5} />
            </span>
            <div>
              <h2 className="text-2xl leading-tight text-foreground sm:text-3xl">{t("economics.heading")}</h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{t("economics.body")}</p>
            </div>
          </div>
        </FadeIn>

        {/* CTAs */}
        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <Button variant="brand" size="lg" className="w-full sm:w-fit" asChild>
            <Link href={"/resources/parallax-client"}>
              {t("ctas.client")}
              <ArrowRight />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-fit" asChild>
            <a href="https://miningpoolstats.stream/parallax" target="_blank" rel="noopener">
              {t("ctas.pools")}
              <ExternalLink />
            </a>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-fit" asChild>
            <a href="https://docs.parallaxprotocol.org/guides/mining/introduction" target="_blank" rel="noopener">
              {t("ctas.guides")}
              <ExternalLink />
            </a>
          </Button>
        </div>
      </Section>
    </MainMotion>
  )
}
