"use client"
import { FadeIn } from "@/components/fade-in"
import GridView from "@/components/grid-view"
import MainMotion from "@/components/main-motion"
import PageHeader from "@/components/page-header"
import { Section, TwoToneTitle } from "@/components/section"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Code, Heart, Megaphone, Pickaxe, Radio, Server, SquareTerminal, Waypoints } from "lucide-react"
import { useTranslations } from "next-intl"

const BTC_DONATION_ADDRESS = "bc1qmlwnufa0ux3janw04dlld0w0v3tkv05snjmr8m"
const EVM_DONATION_ADDRESS = "0xa4Ff25A2814649F672e4abad49E45AB824E5988c"
const PATREON_URL = "https://www.patreon.com/ParallaxChainProtocol"

const TOPIC_ICONS = [Heart, Waypoints, Pickaxe, Code, Megaphone, BookOpen, Radio, SquareTerminal, Server]

function DonationAddress({ title, description, address, tint }: { title: string; description: string; address: string; tint: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-stroke bg-card">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-hairline px-5 py-3">
        <h3 className="flex items-center gap-2.5 font-mono text-xs font-medium uppercase tracking-[0.14em] text-foreground">
          <span aria-hidden className={`size-1.5 rounded-full ${tint}`} />
          {title}
        </h3>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{description}</p>
      </div>
      <code className="block px-5 py-5 font-mono text-sm leading-relaxed text-foreground/85 break-all sm:text-base">
        {address}
      </code>
    </div>
  )
}

function DonationsSection() {
  const t = useTranslations("participate.supportParallax.donations")
  return (
    <Section className="border-t border-b-0">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <FadeIn className="lg:col-span-5">
          <h2 className="text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl">
            <TwoToneTitle text={t("heading")} />
          </h2>
          <p className="accent-rule mt-8 pl-6 text-lg text-muted-foreground text-pretty">
            {t("intro")}
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="flex flex-col gap-6 lg:col-span-7">
          <DonationAddress
            title={t("btc.title")}
            description={t("btc.description")}
            address={BTC_DONATION_ADDRESS}
            tint="bg-brand"
          />
          <DonationAddress
            title={t("evm.title")}
            description={t("evm.description")}
            address={EVM_DONATION_ADDRESS}
            tint="bg-brand-2"
          />
        </FadeIn>
      </div>

      <FadeIn>
        <div className="relative mt-16 overflow-hidden rounded-2xl border border-stroke bg-card">
          <div aria-hidden className="aurora aurora-left" />
          <div className="relative flex flex-col gap-8 p-8 sm:p-10 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl text-lg text-muted-foreground">
              <span className="text-2xl text-foreground">{t("patreonIntro")}</span>
              <br />
              {t("patreonIntroLine2")}
            </p>

            <Button
              size={"lg"}
              variant="brand"
              className="w-full md:w-fit"
              asChild
            >
              <a
                href={PATREON_URL}
                target="_blank"
                rel="noopener"
              >
                {t("patreonCta")}
                <ArrowRight />
              </a>
            </Button>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}

export default function ParallaxForIndividuals() {
  const t = useTranslations("participate.supportParallax")
  const rawTopics = t.raw("topics") as Array<{ title: string; description: string }>
  const topics = rawTopics.map((topic, i) => ({
    icon: TOPIC_ICONS[i],
    title: topic.title,
    description: topic.description,
  }))

  return (
    <MainMotion>
      <PageHeader
        title={t("title")}
        subTitle={t("subtitle")}
      />
      <GridView
        items={topics}
      />
      <DonationsSection />
    </MainMotion>
  )
}
