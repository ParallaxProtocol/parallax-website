'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { ArrowRight, ArrowUpRight, Eye, EyeOff, KeyRound, Lock, Radio, Server, ShieldCheck, Sparkles, TerminalSquare, Usb, Zap } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { FadeIn } from "./fade-in"
import { Section, SectionHeading, TwoToneTitle } from "./section"

const STATUS_URL = "https://status.parallaxprotocol.org"
const EXPLORER_URL = "https://explorer.parallaxprotocol.org"
const MCP_GUIDE_URL = "https://docs.parallaxprotocol.org"
const MCP_ADD_COMMAND = "claude mcp add --transport http parallax https://mcp.parallaxprotocol.org/mcp"

/* Three dots and a centred title — the chrome shared by the browser shots
   and the app-window placeholder. */
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
          <OutboundLink href={href}>{cta}</OutboundLink>
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
            src="/showcase/status.webp"
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

/* Ask Parallax: the MCP server, shown as a terminal session using the
   exchange from the announcement post. */
export function AskParallaxShowcase() {
  const t = useTranslations("home.askParallax")

  return (
    <Section>
      <FadeIn>
        <SectionHeading index="05" eyebrow={t("eyebrow")} title={t("heading")} subtitle={t("subtitle")} />
      </FadeIn>

      <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16">
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
            <div className="on-dark-surface relative w-full overflow-hidden rounded-xl border border-stroke bg-[#050506] text-white shadow-[0_24px_80px_-24px_rgb(0_0_0/0.7)]">
              <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
                <p className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.14em]">
                  <TerminalSquare className="size-3.5 text-brand" aria-hidden />
                  Terminal
                </p>
                <span aria-hidden className="font-mono text-xs tracking-[0.2em] text-white/30">||||||||</span>
              </div>
              <div className="space-y-6 p-5 font-mono text-[13px] leading-relaxed sm:p-6">
                <p className="break-all text-white/60">
                  <span aria-hidden className="select-none text-brand">$ </span>
                  {MCP_ADD_COMMAND}
                </p>
                <p className="text-base text-white">
                  <span aria-hidden className="select-none text-brand-2">&gt; </span>
                  {t("question")}
                </p>
                <p className="border-l border-white/15 pl-4 font-sans text-[15px] leading-relaxed text-white/75">{t("answer")}</p>
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
          <p className="accent-rule max-w-md pl-6 text-base text-muted-foreground text-pretty sm:text-lg lg:col-span-4 lg:col-start-9">
            {t("subtitle")}
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-16">
        <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card px-6 pt-10 sm:px-12 sm:pt-14">
          <div aria-hidden className="aurora" />
          <div aria-hidden className="aurora aurora-left opacity-70" />
          <div className="relative mx-auto max-w-5xl">
            <AppWindowPlaceholder
              title={t("mock.title")}
              assistant={t("mock.assistant")}
              request={t("mock.request")}
              approve={t("mock.approve")}
              decline={t("mock.decline")}
            />
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

/* A desktop app window cropped by the panel floor: sidebar, balance, two
   actions, an activity list, and over it the card the app shows when an AI
   assistant asks to send — the feature the wallet's MCP server is built
   around. Decorative; the copy beside it carries the meaning. */
function AppWindowPlaceholder({
  title,
  assistant,
  request,
  approve,
  decline,
}: {
  title: string
  assistant: string
  request: string
  approve: string
  decline: string
}) {
  return (
    <div aria-hidden className="relative">
      <div className="overflow-hidden rounded-t-xl border border-b-0 border-stroke bg-background shadow-[0_-12px_80px_-24px_rgb(0_0_0/0.5)]">
        <WindowBar>
          <span className="font-mono text-[11px] text-muted-foreground">{title}</span>
        </WindowBar>
        <div className="grid h-72 grid-cols-[9rem_1fr] sm:h-96 sm:grid-cols-[13rem_1fr]">
          <div className="space-y-3 border-r border-hairline p-4 sm:p-5">
            <Image src="/new_parallax_logo_transparent.svg" alt="" width={28} height={28} className="mb-6 size-7" />
            {[24, 18, 21, 15].map((w, i) => (
              <div key={i} className={`flex h-7 items-center rounded-lg px-2.5 ${i === 0 ? "bg-foreground/[0.07]" : ""}`}>
                <div className="h-2 rounded-full bg-foreground/15" style={{ width: `${w * 4}px`, maxWidth: "100%" }} />
              </div>
            ))}
          </div>
          <div className="relative overflow-hidden p-5 sm:p-8">
            <div className="h-2.5 w-24 rounded-full bg-foreground/10" />
            <div className="mt-3 h-10 w-40 rounded-lg bg-foreground/15 sm:w-56" />
            <div className="mt-6 flex gap-3">
              <div className="h-10 w-24 rounded-full bg-foreground/90 sm:w-28" />
              <div className="h-10 w-24 rounded-full border border-stroke sm:w-28" />
            </div>
            <div className="mt-10 space-y-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="size-9 shrink-0 rounded-full bg-foreground/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2 w-32 max-w-full rounded-full bg-foreground/10 sm:w-40" />
                    <div className="h-2 w-20 rounded-full bg-foreground/[0.06]" />
                  </div>
                  <div className="hidden h-2.5 w-16 rounded-full bg-foreground/10 sm:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* The assistant's request, floating over the window's corner */}
      <div className="absolute right-3 bottom-4 w-52 rounded-xl border border-stroke bg-popover/95 p-3 sm:p-4 shadow-[0_24px_60px_-12px_rgb(0_0_0/0.6)] backdrop-blur-md sm:right-8 sm:bottom-10 sm:w-72">
        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <Sparkles className="size-3.5 text-brand" />
          {assistant}
        </p>
        <p className="mt-2 text-sm text-foreground sm:mt-3 sm:text-[15px]">{request}</p>
        <div className="mt-4 flex gap-2">
          <span className="flex h-8 flex-1 items-center justify-center rounded-full bg-foreground text-[13px] font-medium text-background">{approve}</span>
          <span className="flex h-8 flex-1 items-center justify-center rounded-full border border-stroke text-[13px] text-foreground">{decline}</span>
        </div>
      </div>
    </div>
  )
}
