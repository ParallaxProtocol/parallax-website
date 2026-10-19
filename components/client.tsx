'use client'
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { AppWindow, ArrowRight, CircleSlash, Network, Pickaxe, ShieldCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { FaGithub } from "react-icons/fa"
import { Button } from "./ui/button"
import ClientDownloadButton from "./client-download-button"
import { FadeIn } from "./fade-in"
import { Section, SectionHeading } from "./section"

const points = [
  { key: "verify", icon: ShieldCheck, tone: "text-brand" },
  { key: "noVoting", icon: CircleSlash, tone: "text-brand-2" },
  { key: "network", icon: Network, tone: "text-brand" },
] as const

export default function Client() {
  const t = useTranslations("home.client")
  return (
    <Section className="z-10">
      <FadeIn>
        <SectionHeading index="07" eyebrow={t("eyebrow")} title={t("heading")} subtitle={t("subtitle")} />
      </FadeIn>

      {/* Why run one, in three cells: the case the client page makes at
          length, with the rejected-block point standing in for a pull quote */}
      <FadeIn delay={0.1}>
        <div className="mt-16 grid grid-cols-1 overflow-hidden rounded-2xl border border-stroke md:grid-cols-3">
          {points.map(({ key, icon: Icon, tone }, i) => (
            <div key={key} className={cn("flex flex-col p-8", i > 0 && "border-t border-hairline md:border-t-0 md:border-l")}>
              <Icon className={cn("size-7", tone)} strokeWidth={1.5} aria-hidden />
              <h3 className="mt-10 text-2xl text-foreground">{t(`points.${key}.title`)}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t(`points.${key}.description`)}</p>
              {key === "network" && (
                <Link
                  href="/resources/network-atlas"
                  className="group mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-foreground"
                >
                  {t("points.network.cta")}
                  <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Download CTA panel: the command-line node software and its own
          page, with the desktop app and the miner one link away */}
      <FadeIn delay={0.2}>
        <div className="relative mt-4 overflow-hidden rounded-2xl border border-stroke bg-card px-8 py-14 text-center sm:px-12 sm:py-20">
          <div aria-hidden className="aurora" />
          <div className="relative">
            <h3 className="text-4xl text-foreground sm:text-5xl">{t("runNode.title")}</h3>
            <p className="mx-auto mt-4 mb-10 max-w-xl text-lg text-muted-foreground">
              {t("runNode.description")}
            </p>
            <div className="flex flex-wrap items-start justify-center gap-3">
              <ClientDownloadButton />
              <Button variant="outline" size="lg" asChild>
                <Link href="/parallax-client">
                  {t("explore")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
              <a
                href="https://github.com/ParallaxProtocol/parallax"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
              >
                <FaGithub className="size-3.5" />
                {t("github")}
              </a>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.25}>
        <Link
          href="/parallax-wallet"
          className="group plate-lift mt-4 flex flex-col gap-4 rounded-2xl border border-stroke bg-card p-6 sm:flex-row sm:items-center sm:gap-6 sm:px-8"
        >
          <AppWindow className="size-7 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
          <p className="text-base text-muted-foreground">
            <span className="text-foreground">{t("wallet.prompt")}</span> {t("wallet.description")}
          </p>
          <span className="inline-flex shrink-0 items-center gap-2 text-[15px] font-medium text-foreground sm:ml-auto">
            {t("wallet.cta")}
            <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
          </span>
        </Link>
      </FadeIn>

      <FadeIn delay={0.3}>
        <Link
          href="/hashwarp"
          className="group plate-lift mt-4 flex flex-col gap-4 rounded-2xl border border-stroke bg-card p-6 sm:flex-row sm:items-center sm:gap-6 sm:px-8"
        >
          <Pickaxe className="size-7 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
          <p className="text-base text-muted-foreground">
            <span className="text-foreground">{t("hashwarp.prompt")}</span> {t("hashwarp.description")}
          </p>
          <span className="inline-flex shrink-0 items-center gap-2 text-[15px] font-medium text-foreground sm:ml-auto">
            {t("hashwarp.cta")}
            <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
          </span>
        </Link>
      </FadeIn>
    </Section>
  )
}
