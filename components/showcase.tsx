'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { ArrowRight, ArrowUpRight, Eye, EyeOff, KeyRound, Lock, Radio, Server, ShieldCheck, Sparkles, Usb, Zap } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { FadeIn } from "./fade-in"
import { Section, SectionHeading, TwoToneTitle } from "./section"
import { McpConnect } from "./mcp-connect"
import { AppScreenshot } from "./wallet-app/app-screenshot"

const STATUS_URL = "https://status.parallaxprotocol.org"
const EXPLORER_URL = "https://explorer.parallaxprotocol.org"
const MCP_GUIDE_URL = "https://docs.parallaxprotocol.org/guides/ai/parallax-mcp"

/* Three dots and a centred title — the browser shots' chrome. */
function WindowBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
      <span aria-hidden className="flex gap-1.5">
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
      </span>
      <span className="mx-auto min-w-0">{children}</span>
      <span aria-hidden className="w-[42px]" />
    </div>
  )
}

/* A screenshot set in minimal browser chrome. The captures in
   public/showcase are 2x renders of a 1440×900 viewport. */
function BrowserFrame({ src, alt, host }: { src: string; alt: string; host: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-stroke bg-background shadow-[0_24px_80px_-24px_rgb(0_0_0/0.6)]">
      <WindowBar>
        <span className="flex min-w-0 items-center gap-1.5 truncate rounded-full bg-foreground/[0.05] px-3 py-1 font-mono text-[11px] text-muted-foreground">
          <Lock className="size-3" aria-hidden />
          {host}
        </span>
      </WindowBar>
      <Image src={src} alt={alt} width={2880} height={1800} sizes="(max-width: 1024px) 100vw, 60vw" className="block h-auto w-full" />
    </div>
  )
}

function OutboundLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="group inline-flex items-center gap-2 text-[15px] font-medium text-foreground">
      {children}
      <ArrowUpRight className="size-4 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
    </a>
  )
}

/* A product panel: copy on one side, a browser shot bleeding off the far
   edge and the floor on the other, like solana.com's product shots. */
function ProductPanel({
  label,
  title,
  description,
  cta,
  href,
  src,
  host,
  live,
  reverse,
  note,
}: {
  label: string
  title: string
  description: string
  cta: string
  href: string
  src: string
  host: string
  live?: boolean
  reverse?: boolean
  note?: string
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card">
      <div aria-hidden className={`aurora ${reverse ? "aurora-left" : ""}`} />
      <div className="relative grid gap-10 lg:grid-cols-12 lg:gap-0 [&>*]:min-w-0">
        <div className={`flex flex-col justify-between gap-10 p-8 sm:p-10 lg:col-span-4 ${reverse ? "lg:order-2" : ""}`}>
          <div>
            <p className="tag">
              {live && <span aria-hidden className="size-1.5 rounded-full bg-brand animate-pulse motion-reduce:animate-none" />}
              {label}
            </p>
            <h3 className="mt-6 text-3xl leading-tight text-foreground sm:text-4xl">{title}</h3>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{description}</p>
          </div>
          <div>
            <OutboundLink href={href}>{cta}</OutboundLink>
            {note && <p className="mt-3 font-mono text-[11px] leading-relaxed text-muted-foreground/80">{note}</p>}
          </div>
        </div>
        <div className={`lg:col-span-8 lg:pt-10 ${reverse ? "pr-8 sm:pr-10 lg:order-1 lg:pr-0" : "pl-8 sm:pl-10 lg:pl-0"}`}>
          <div className={`-mb-20 ${reverse ? "-translate-x-8 lg:-translate-x-10" : "translate-x-8 lg:translate-x-10"}`}>
            <BrowserFrame src={src} alt={title} host={host} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* Status page and explorer: the two windows onto the live network. */
export function ToolsShowcase() {
  const t = useTranslations("home.showcase")

  return (
    <Section>
      <FadeIn>
        <SectionHeading index="06" eyebrow={t("eyebrow")} title={t("heading")} subtitle={t("subtitle")} />
      </FadeIn>

      <div className="mt-16 space-y-4">
        <FadeIn>
          <ProductPanel
            live
            label={t("status.label")}
            title={t("status.title")}
            description={t("status.description")}
            cta={t("status.cta")}
            href={STATUS_URL}
            note={t("status.note")}
            src="/showcase/status-dashboard.webp"
            host="status.parallaxprotocol.org"
          />
        </FadeIn>
        <FadeIn>
          <ProductPanel
            reverse
            label={t("explorer.label")}
            title={t("explorer.title")}
            description={t("explorer.description")}
            cta={t("explorer.cta")}
            href={EXPLORER_URL}
            src="/showcase/explorer.webp"
            host="explorer.parallaxprotocol.org"
          />
        </FadeIn>
      </div>
    </Section>
  )
}

const askPoints = [
  { key: "live", icon: Radio },
  { key: "readOnly", icon: Eye },
  { key: "noKeys", icon: KeyRound },
] as const

/* Ask Parallax: the MCP server, with setup for each major assistant and
   the example exchange from the announcement post. */
export function AskParallaxShowcase() {
  const t = useTranslations("home.askParallax")

  return (
    <Section>
      <FadeIn>
        <SectionHeading index="05" eyebrow={t("eyebrow")} title={t("heading")} subtitle={t("subtitle")} />
      </FadeIn>

      <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
        <FadeIn className="lg:col-span-5">
          <ul className="divide-y divide-hairline border-y border-hairline">
            {askPoints.map(({ key, icon: Icon }) => (
              <li key={key} className="flex gap-5 py-6">
                <Icon className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
                <div>
                  <h3 className="text-lg leading-tight text-foreground">{t(`points.${key}.title` as "points.live.title")}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{t(`points.${key}.description` as "points.live.description")}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button variant="brand" size="lg" asChild>
              <Link href="/blog/ask-parallax">
                {t("cta")}
                <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href={MCP_GUIDE_URL} target="_blank" rel="noopener">{t("docs")}</a>
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="lg:col-span-7">
          <div className="relative flex h-full items-center overflow-hidden rounded-2xl border border-stroke bg-card p-4 sm:p-8">
            <div aria-hidden className="aurora" />
            <div className="relative w-full space-y-4">
              <McpConnect />
              {/* An example exchange, from the announcement post */}
              <div className="rounded-xl border border-hairline bg-background/40 p-5 backdrop-blur-sm sm:p-6">
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{t("connect.example")}</p>
                <p className="mt-3 text-base text-foreground">
                  <span aria-hidden className="select-none text-brand-2">&gt; </span>
                  {t("question")}
                </p>
                <p className="mt-3 border-l border-hairline pl-4 text-[15px] leading-relaxed text-muted-foreground">{t("answer")}</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  )
}

const walletFeatures = [
  { key: "node", icon: Server },
  { key: "sealed", icon: ShieldCheck },
  { key: "signing", icon: Usb },
  { key: "assistant", icon: Sparkles },
] as const

const walletUpcoming = [
  { key: "stealth", icon: EyeOff },
  { key: "channels", icon: Zap },
] as const

/* Parallax Wallet: the desktop app, shipping with the redesign. The window
   holds a skeleton plus the assistant's approval card, not a screenshot —
   swap one in when the app is public. */
export function WalletShowcase() {
  const t = useTranslations("home.wallet")

  return (
    <Section>
      <FadeIn>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <p className="tag"><span className="text-brand">04</span><span aria-hidden className="text-hairline">/</span>{t("eyebrow")}</p>
              <Badge>{t("badge")}</Badge>
            </div>
            <h2 className="text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl lg:text-6xl">
              <TwoToneTitle text={t("heading")} />
            </h2>
          </div>
          <div className="flex flex-col items-start gap-6 lg:col-span-4 lg:col-start-9">
            <p className="accent-rule max-w-md pl-6 text-base text-muted-foreground text-pretty sm:text-lg">
              {t("subtitle")}
            </p>
            <Button variant="outline" asChild>
              <Link href="/parallax-wallet">
                {t("cta")}
                <ArrowRight className="text-brand" />
              </Link>
            </Button>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-16">
        <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card p-4 sm:p-12">
          <div aria-hidden className="aurora" />
          <div aria-hidden className="aurora aurora-left opacity-70" />
          <div className="relative mx-auto max-w-5xl">
            <AppScreenshot shot="assistantSend" alt={t("shotAlt")} sizes="(max-width: 1024px) 100vw, 1024px" />
          </div>
        </div>
      </FadeIn>

      {/* What ships */}
      <FadeIn delay={0.1}>
        <div className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {walletFeatures.map(({ key, icon: Icon }) => (
            <div key={key} className="bg-background p-6 sm:p-8">
              <Icon className="size-6 text-brand" strokeWidth={1.5} aria-hidden />
              <h3 className="mt-8 text-lg leading-tight text-foreground">{t(`features.${key}.title` as "features.node.title")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`features.${key}.description` as "features.node.description")}</p>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* What's being built */}
      <FadeIn delay={0.15}>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {walletUpcoming.map(({ key, icon: Icon }) => (
            <div key={key} className="relative overflow-hidden rounded-2xl border border-dashed border-stroke p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <Icon className="size-6 text-brand-2" strokeWidth={1.5} aria-hidden />
                <Badge variant="outline">{t("inDevelopment")}</Badge>
              </div>
              <h3 className="mt-8 text-xl leading-tight text-foreground">{t(`upcoming.${key}.title` as "upcoming.stealth.title")}</h3>
              <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-muted-foreground">{t(`upcoming.${key}.description` as "upcoming.stealth.description")}</p>
            </div>
          ))}
        </div>
      </FadeIn>
    </Section>
  )
}
