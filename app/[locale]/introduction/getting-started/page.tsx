"use client"

import MainMotion from "@/components/main-motion"
import PageHeader from "@/components/page-header"
import { Section, TwoToneTitle } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { ArrowRight, BookOpen, Building, ChevronRight, ExternalLink, Eye, HandCoins, Scale, Store, Wallet } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

/* One step as a panel: outline icon and copy on top (the titles carry
   their own step numbers), the step's actions on a hairline footer so
   every panel's buttons line up. */
function StepCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-stroke bg-card">
      <div className="flex-1 p-6 sm:p-8">
        <span className="flex size-11 items-center justify-center rounded-full border border-stroke text-brand">
          <Icon className="size-5" strokeWidth={1.5} />
        </span>
        <h3 className="mt-12 text-2xl leading-tight text-foreground">{title}</h3>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-3 border-t border-hairline px-6 py-5 sm:flex-row sm:flex-wrap sm:px-8">
        {children}
      </div>
    </div>
  )
}

export default function GettingStarted() {
  const t = useTranslations("introduction.gettingStarted")
  const [activeTab, setActiveTab] = useState<"use" | "accept">("use")

  return (
    <MainMotion>
      <PageHeader
        title={t("pageTitle")}
        subTitle={t("pageSubtitle")}
      />
      <Section>
        {/* Navigation Tabs — a pill segmented control */}
        <div className="mb-12 flex">
          <div className="flex w-full flex-col gap-1 rounded-3xl border border-stroke bg-card p-1 sm:w-auto sm:flex-row sm:rounded-full">
            <Button
              size={"lg"}
              onClick={() => setActiveTab("use")}
              variant={activeTab === "use" ? "brand" : "ghost"}
              className={activeTab === "use" ? undefined : "text-muted-foreground"}
            >
              {t("tabs.use")}
            </Button>
            <Button
              size={"lg"}
              onClick={() => setActiveTab("accept")}
              variant={activeTab === "accept" ? "brand" : "ghost"}
              className={activeTab === "accept" ? undefined : "text-muted-foreground"}
            >
              {t("tabs.accept")}
            </Button>
          </div>
        </div>

        {activeTab === "use" && (
          <div className="grid gap-4 md:grid-cols-2">
            <StepCard icon={BookOpen} title={t("use.inform.title")} description={t("use.inform.description")}>
              <Button variant="secondary" asChild className="w-full sm:w-fit">
                <Link href={"/introduction/how-it-works"}>
                  {t("use.inform.cta")} <ChevronRight />
                </Link>
              </Button>
            </StepCard>

            <StepCard icon={Wallet} title={t("use.wallet.title")} description={t("use.wallet.description")}>
              <Button variant="secondary" asChild className="w-full sm:w-fit">
                <Link href={"/wallets"}>
                  {t("use.wallet.cta")} <ChevronRight />
                </Link>
              </Button>
            </StepCard>

            <StepCard icon={HandCoins} title={t("use.get.title")} description={t("use.get.description")}>
              <Button variant="secondary" asChild className="w-full sm:w-fit">
                <a href="https://docs.parallaxprotocol.org/guides/mining" target="_blank" rel="noopener noreferrer">
                  {t("use.get.mining")} <ExternalLink />
                </a>
              </Button>
              <Button variant="secondary" asChild className="w-full sm:w-fit">
                <Link href={"/exchanges"}>
                  {t("use.get.exchanges")}
                  <ChevronRight />
                </Link>
              </Button>
            </StepCard>

            <StepCard icon={Store} title={t("use.spend.title")} description={t("use.spend.description")}>
              <Button variant="secondary" asChild className="w-full sm:w-fit">
                <Link href={"/resources/community"}>
                  {t("use.spend.cta")} <ChevronRight />
                </Link>
              </Button>
            </StepCard>
          </div>
        )}

        {activeTab === "accept" && (
          <div className="grid gap-4 md:grid-cols-2">
            <StepCard icon={BookOpen} title={t("accept.inform.title")} description={t("accept.inform.description")}>
              <Button variant="secondary" asChild className="w-full sm:w-fit">
                <Link href={"/introduction/how-it-works"}>
                  {t("accept.inform.cta")} <ChevronRight />
                </Link>
              </Button>
            </StepCard>

            <StepCard icon={Building} title={t("accept.processing.title")} description={t("accept.processing.description")}>
              <Button variant="secondary" asChild className="w-full sm:w-fit">
                <Link href={"/wallets"}>
                  {t("accept.processing.cta")} <ChevronRight />
                </Link>
              </Button>
            </StepCard>

            <StepCard icon={Scale} title={t("accept.taxes.title")} description={t("accept.taxes.description")}>
              <Button variant="secondary" asChild className="w-full sm:w-fit">
                <a href="https://en.bitcoin.it/wiki/Tax_compliance" target="_blank" rel="noopener noreferrer">
                  {t("accept.taxes.cta")} <ExternalLink />
                </a>
              </Button>
            </StepCard>

            <StepCard icon={Eye} title={t("accept.visibility.title")} description={t("accept.visibility.description")}>
              <Button variant="secondary" asChild className="w-full sm:w-fit">
                <Link href={"/resources/community"}>
                  {t("accept.visibility.cta")} <ChevronRight />
                </Link>
              </Button>
            </StepCard>
          </div>
        )}
      </Section>

      {/* Ready — closing CTA as a glowing panel. Last band: it runs flush into
          the footer's rule instead of leaving MainMotion's bottom padding. */}
      <Section className="border-b-0">
        <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card p-8 sm:p-12">
        <div aria-hidden className="aurora" />
        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <h3 className="text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl"><TwoToneTitle text={t("ready.heading")} /></h3>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("ready.description")}
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row lg:col-span-5 lg:flex-col lg:items-end xl:flex-row xl:justify-end">
            <Button variant="brand" size="lg" asChild>
              <Link href={"/wallets"}>
                {t("ready.chooseWallet")}
                <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="https://docs.parallaxprotocol.org/guides/wallets" target="_blank" rel="noopener noreferrer">
                {t("ready.setupGuide")}
                <ExternalLink />
              </a>
            </Button>
          </div>
        </div>
        </div>
      </Section>
    </MainMotion>
  )
}
