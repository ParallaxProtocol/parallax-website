"use client"

import AddNetworkSection from "@/components/add-network-section"
import { FadeIn } from "@/components/fade-in"
import { NetworkSettings } from "@/components/learn/network-settings"
import MainMotion from "@/components/main-motion"
import PageHeader from "@/components/page-header"
import { Section, SectionHeading } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { wallets } from "@/lib/wallets"
import {
  ArrowRight,
  ArrowUpRight,
  Cpu,
  Download,
  Eye,
  Hourglass,
  Info,
  Megaphone,
  Monitor,
  NotebookPen,
  QrCode,
  ReceiptText,
  Search,
  Send,
  ShieldAlert,
  Store,
} from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"

const EXPLORER_URL = "https://explorer.parallaxprotocol.org"
const TAX_URL = "https://en.bitcoin.it/wiki/Tax_compliance"

const recommended = wallets.filter((w) => w.recommended)

const STEPS = [
  { key: "wallet", id: "wallet" },
  { key: "network", id: "network" },
  { key: "get", id: "get-lax" },
  { key: "use", id: "use" },
] as const

const USE_ITEMS = [
  { key: "receive", icon: QrCode },
  { key: "send", icon: Send },
  { key: "check", icon: Search },
  { key: "wait", icon: Hourglass },
] as const

const ACCEPT_ITEMS = [
  { key: "address", icon: ReceiptText },
  { key: "verify", icon: Eye },
  { key: "taxes", icon: NotebookPen },
  { key: "visibility", icon: Megaphone },
] as const

function InlineLink({ href, external, children }: { href: string; external?: boolean; children: React.ReactNode }) {
  const cls = "group inline-flex items-center gap-2 text-[15px] font-medium text-foreground"
  const arrow = external ? (
    <ArrowUpRight className="size-4 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
  ) : (
    <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
  )
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}{arrow}</a>
  ) : (
    <Link href={href} className={cls}>{children}{arrow}</Link>
  )
}

/* One step as a band: a big light numeral, title and standfirst on the
   left (sticky on wide screens), the step's working content on the right. */
function Step({
  n,
  id,
  title,
  description,
  children,
}: {
  n: number
  id: string
  title: string
  description: string
  children: React.ReactNode
}) {
  const t = useTranslations("introduction.gettingStarted")
  return (
    <Section id={id} className="scroll-mt-16" innerClassName="py-16 md:py-24">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <FadeIn className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="tag">{t("step")} {n} / {STEPS.length}</p>
            <p aria-hidden className="text-gradient mt-4 w-fit text-7xl leading-none font-light tracking-[-0.04em] sm:text-8xl">
              {String(n).padStart(2, "0")}
            </p>
            <h2 className="mt-6 text-3xl leading-[1.1] text-foreground text-balance sm:text-4xl">{title}</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground text-pretty">{description}</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1} className="lg:col-span-8">
          {children}
        </FadeIn>
      </div>
    </Section>
  )
}

export default function GettingStarted() {
  const t = useTranslations("introduction.gettingStarted")

  return (
    <MainMotion>
      <PageHeader title={t("pageTitle")} subTitle={t("pageSubtitle")}>
        <ol className="enter-fade-up flex flex-wrap gap-2" style={{ "--enter-delay": "0.4s" } as React.CSSProperties}>
          {STEPS.map((s, i) => (
            <li key={s.key}>
              <a
                href={`#${s.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-stroke bg-background/40 px-4 py-2 text-sm text-foreground/85 backdrop-blur-sm transition-colors hover:border-foreground/30 hover:bg-foreground/5"
              >
                <span className="font-mono text-xs text-brand">{String(i + 1).padStart(2, "0")}</span>
                {t(`${s.key}.title`)}
              </a>
            </li>
          ))}
        </ol>
      </PageHeader>

      {/* 01 Wallet */}
      <Step n={1} id="wallet" title={t("wallet.title")} description={t("wallet.description")}>
        <Link href="/parallax-wallet" className="group block">
          <div className="plate-lift relative overflow-hidden rounded-2xl border border-stroke bg-card p-6 sm:p-8">
            <div aria-hidden className="aurora" />
            <div className="relative grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-8">
              <Image src="/new_parallax_logo_rounded.png" alt="" width={112} height={112} className="size-14 rounded-2xl" />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl leading-tight text-foreground">{t("wallet.parallaxWallet.title")}</h3>
                  <Badge variant="outline"><Monitor aria-hidden />{t("wallet.parallaxWallet.label")}</Badge>
                </div>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">{t("wallet.parallaxWallet.description")}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-foreground">
                  {t("wallet.parallaxWallet.cta")}
                  <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                </span>
              </div>
            </div>
          </div>
        </Link>

        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {recommended.map((w) => (
            <li key={w.name}>
              <a href={w.url} target="_blank" rel="noopener" className="group block h-full">
                <div className="plate-lift relative flex h-full items-center gap-4 rounded-2xl border border-stroke bg-card p-4 sm:flex-col sm:items-start sm:p-6">
                  <Image src={w.image} alt="" width={88} height={88} className="size-11 rounded-full" />
                  <div className="min-w-0 flex-1 sm:mt-4">
                    <p className="text-lg leading-tight text-foreground">{w.name}</p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-brand">{t("wallet.recommended")}</p>
                  </div>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground sm:absolute sm:top-6 sm:right-6" aria-hidden />
                </div>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <InlineLink href="/wallets">{t("wallet.all")}</InlineLink>
        </div>

        <div className="mt-10 flex gap-4 rounded-xl border border-stroke bg-card p-5 sm:p-6">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-pop-yellow" strokeWidth={1.5} aria-hidden />
          <div>
            <h3 className="text-lg leading-tight text-foreground">{t("wallet.backupTitle")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("wallet.backupBody")}</p>
          </div>
        </div>
      </Step>

      {/* 02 Network */}
      <Step n={2} id="network" title={t("network.title")} description={t("network.description")}>
        <AddNetworkSection />
        <NetworkSettings />
        <p className="mt-6 flex gap-3 text-sm leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
          {t("network.hint")}
        </p>
      </Step>

      {/* 03 Get LAX */}
      <Step n={3} id="get-lax" title={t("get.title")} description={t("get.description")}>
        <div className="grid gap-4 md:grid-cols-2">
          {([
            { key: "mine", icon: Cpu, href: "/participate/mining", glow: "aurora-left" },
            { key: "buy", icon: Download, href: "/exchanges", glow: "" },
          ] as const).map(({ key, icon: Icon, href, glow }) => (
            <div key={key} className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-stroke bg-card">
              <div aria-hidden className={`aurora ${glow} opacity-70`} />
              <div className="relative flex-1 p-6 sm:p-8">
                <Icon className="size-7 text-brand" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-10 text-2xl leading-tight text-foreground">{t(`get.${key}.title`)}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t(`get.${key}.description`)}</p>
              </div>
              <div className="relative border-t border-hairline px-6 py-5 sm:px-8">
                <Button variant="outline" asChild>
                  <Link href={href}>
                    {t(`get.${key}.cta`)}
                    <ArrowRight className="text-brand" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        <p className="accent-rule mt-8 pl-6 text-lg font-light leading-snug text-foreground sm:text-xl">{t("get.paid")}</p>
      </Step>

      {/* 04 Use it */}
      <Step n={4} id="use" title={t("use.title")} description={t("use.description")}>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2">
          {USE_ITEMS.map(({ key, icon: Icon }) => (
            <div key={key} className="bg-background p-6">
              <Icon className="size-6 text-foreground" strokeWidth={1.5} aria-hidden />
              <h3 className="mt-6 text-lg leading-tight text-foreground">{t(`use.items.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`use.items.${key}.description`)}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <InlineLink href={EXPLORER_URL} external>{t("use.explorerCta")}</InlineLink>
        </div>

        <div className="mt-10 rounded-xl border border-stroke bg-card p-5 sm:p-6">
          <div className="flex gap-4">
            <Store className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
            <div>
              <h3 className="text-lg leading-tight text-foreground">{t("use.honestTitle")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("use.honestBody")}</p>
              <div className="mt-4">
                <InlineLink href="/resources/community">{t("use.honestCta")}</InlineLink>
              </div>
            </div>
          </div>
        </div>
      </Step>

      {/* Merchants */}
      <Section id="accept" className="scroll-mt-16">
        <FadeIn>
          <SectionHeading eyebrow={t("accept.eyebrow")} title={t("accept.heading")} subtitle={t("accept.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {ACCEPT_ITEMS.map(({ key, icon: Icon }) => (
              <div key={key} className="flex flex-col bg-background p-6">
                <Icon className="size-6 text-foreground" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-8 text-lg leading-tight text-foreground">{t(`accept.items.${key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`accept.items.${key}.description`)}</p>
                {key === "taxes" && (
                  <div className="mt-4">
                    <InlineLink href={TAX_URL} external>{t("accept.items.taxes.cta")}</InlineLink>
                  </div>
                )}
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn>
          <div className="mt-10">
            <Button variant="outline" size="lg" asChild>
              <Link href="/introduction/parallax-for-developers">
                {t("accept.cta")}
                <ArrowRight className="text-brand" />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </Section>

      {/* Under the hood */}
      <Section className="border-b-0" innerClassName="py-16 md:py-20">
        <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card p-8 sm:p-12">
          <div aria-hidden className="aurora" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="max-w-2xl text-3xl leading-[1.1] text-foreground text-balance sm:text-4xl">{t("next.heading")}</h2>
            <Button variant="brand" size="lg" asChild className="w-fit">
              <Link href="/introduction/how-it-works">
                {t("next.cta")}
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </MainMotion>
  )
}
