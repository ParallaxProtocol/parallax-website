import { FadeIn } from "@/components/fade-in"
import MainMotion from "@/components/main-motion"
import { Section, SectionHeading, TwoToneTitle } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AppScreenshot, CaptionedShot } from "@/components/wallet-app/app-screenshot"
import { WALLET_REPO_URL } from "@/components/wallet-app/use-wallet-release"
import { WalletDownloadButton, WalletDownloads } from "@/components/wallet-app/wallet-download"
import { Link } from "@/i18n/navigation"
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Ban,
  Bell,
  BookUser,
  Cable,
  Check,
  ClipboardX,
  Dices,
  Eye,
  EyeOff,
  FileKey,
  FileLock,
  Globe,
  HardDrive,
  History,
  KeyRound,
  Languages,
  Layers,
  ListChecks,
  Lock,
  Minus,
  MonitorOff,
  Package,
  Pickaxe,
  QrCode,
  Radio,
  RefreshCw,
  Route,
  Search,
  Send,
  Server,
  ShieldBan,
  ShieldCheck,
  Signature,
  Sparkles,
  SunMoon,
  TerminalSquare,
  Timer,
  Usb,
  UserCheck,
  Users,
  Zap,
  ArrowUpRight,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { FaApple, FaGithub, FaLinux, FaWindows } from "react-icons/fa"

const MCP_COMMAND =
  'claude mcp add --transport http parallax-wallet-app http://127.0.0.1:8549/mcp --header "Authorization: Bearer <token>"'

const nodePoints = [
  { key: "own", icon: Server },
  { key: "history", icon: History },
  { key: "network", icon: Activity },
  { key: "inbound", icon: Radio },
] as const

/* What parallax-wallet's backend sends through Tor once it's on (tor.go,
   flags.go): the node's peers and DNS seeds, the status-page reports, the
   updater and the assistants' explorer and status-page lookups. */
const privacyPoints = [
  { key: "builtIn", icon: Package },
  { key: "everything", icon: Route },
  { key: "failClosed", icon: Ban },
  { key: "onion", icon: Globe },
] as const

const torRoutes = [
  { key: "peers", icon: Server },
  { key: "seeds", icon: Search },
  { key: "updates", icon: RefreshCw },
  { key: "assistant", icon: Sparkles },
  { key: "stats", icon: Activity },
] as const

const privacyExtras = [
  { key: "tracking", icon: EyeOff },
  { key: "logs", icon: FileLock },
] as const

const securityItems = [
  { key: "password", icon: KeyRound },
  { key: "keystore", icon: FileKey },
  { key: "sealed", icon: ShieldCheck },
  { key: "moment", icon: Timer },
  { key: "confirm", icon: UserCheck },
  { key: "local", icon: HardDrive },
  { key: "calls", icon: Cable },
  { key: "shielded", icon: ShieldBan },
  { key: "random", icon: Dices },
  { key: "capture", icon: MonitorOff },
  { key: "clipboard", icon: ClipboardX },
  { key: "tamper", icon: Package },
] as const

/* What parallax-wallet's backend does on each OS: harden_linux.go (no core
   dump, non-dumpable), harden_unix.go (no core dump; memory reads kept out
   by the hardened runtime the backend is signed with), harden_windows.go
   (an access list against memory reads, left out of Windows Error
   Reporting), desktop/src/main.ts (content protection and locking on a
   screen lock, macOS and Windows) and session.go (memguard on every OS). */
type Cell = "yes" | "no"
const platformRows: { key: "guarded" | "dumps" | "attach" | "capture" | "away"; cells: [Cell, Cell, Cell] }[] = [
  { key: "guarded", cells: ["yes", "yes", "yes"] },
  { key: "dumps", cells: ["yes", "yes", "yes"] },
  { key: "attach", cells: ["yes", "yes", "yes"] },
  { key: "capture", cells: ["no", "yes", "yes"] },
  { key: "away", cells: ["no", "yes", "yes"] },
]
const platformCols = [
  { label: "Linux", icon: FaLinux },
  { label: "macOS", icon: FaApple },
  { label: "Windows", icon: FaWindows },
]

const offlineSteps = ["prepare", "sign", "broadcast"] as const

const assistantPoints = [
  { key: "permissions", icon: Sparkles },
  { key: "sends", icon: KeyRound },
  { key: "local", icon: Server },
  { key: "lock", icon: Lock },
] as const

/* The app's defaults (defaultMCPAllow in parallax-wallet's backend/config.go). */
const permissionRows = [
  { key: "nodeStatus", mode: "allow" },
  { key: "wallet", mode: "ask" },
  { key: "contacts", mode: "ask" },
  { key: "lockApp", mode: "allow" },
  { key: "sendTransactions", mode: "ask" },
] as const
const modes = ["allow", "ask", "block"] as const

const everydayItems = [
  { key: "send", icon: Send },
  { key: "receive", icon: QrCode },
  { key: "history", icon: History },
  { key: "contacts", icon: BookUser },
  { key: "messages", icon: Signature },
  { key: "phrases", icon: Layers },
  { key: "watchOnly", icon: Eye },
  { key: "mining", icon: Pickaxe },
  { key: "notifications", icon: Bell },
  { key: "updates", icon: BadgeCheck },
  { key: "languages", icon: Languages },
  { key: "themes", icon: SunMoon },
] as const

const upcoming = [
  { key: "stealth", icon: EyeOff },
  { key: "channels", icon: Zap },
  { key: "multisig", icon: Users },
] as const

export default async function ParallaxWalletPage() {
  const t = await getTranslations("parallaxWallet")
  const hardwarePoints = t.raw("signing.hardware.points") as string[]
  const neverItems = t.raw("assistant.never.items") as string[]

  const cellLabel = (cell: Cell) =>
    cell === "yes" ? t("security.platform.yes") : t("security.platform.no")

  return (
    <MainMotion>
      {/* Hero */}
      <div className="relative mt-16 overflow-hidden border-b border-hairline">
        <div aria-hidden className="aurora" />
        <div aria-hidden className="aurora aurora-left opacity-60" />
        <div className="relative mx-auto max-w-[90rem] px-5 pt-24 pb-20 md:px-10 md:pt-32 md:pb-28">
          <div className="mb-8 flex flex-wrap items-center gap-3 enter-fade-up" style={{ "--enter-delay": "0.05s" } as React.CSSProperties}>
            <p className="tag">{t("hero.eyebrow")}</p>
            <Badge>{t("hero.badge")}</Badge>
          </div>
          <h1
            className="max-w-5xl text-5xl leading-[1.02] text-foreground text-balance sm:text-6xl lg:text-7xl enter-fade-up"
            style={{ "--enter-delay": "0.1s" } as React.CSSProperties}
          >
            <TwoToneTitle text={t("hero.title")} />
          </h1>
          <p
            className="mt-8 max-w-2xl text-lg text-muted-foreground text-pretty sm:text-xl enter-fade-up"
            style={{ "--enter-delay": "0.25s" } as React.CSSProperties}
          >
            {t("hero.subtitle")}
          </p>
          <div className="mt-10 enter-fade-up" style={{ "--enter-delay": "0.35s" } as React.CSSProperties}>
            <WalletDownloadButton>
              <Button variant="outline" size="lg" asChild>
                <a href={WALLET_REPO_URL} target="_blank" rel="noopener">
                  <FaGithub />
                  {t("hero.source")}
                </a>
              </Button>
            </WalletDownloadButton>
          </div>
          <p className="mt-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <span className="flex items-center gap-2 text-foreground/70" aria-hidden>
              <FaApple className="size-3.5" />
              <FaWindows className="size-3.5" />
              <FaLinux className="size-3.5" />
            </span>
            {t("hero.platforms")}
          </p>

          <div className="relative mx-auto mt-16 max-w-6xl sm:mt-20">
            <AppScreenshot shot="overview" alt={t("shots.overview.alt")} sizes="(max-width: 1152px) 100vw, 1152px" priority />
          </div>
        </div>
      </div>

      {/* 01 Full node */}
      <Section>
        <FadeIn>
          <SectionHeading index="01" eyebrow={t("node.eyebrow")} title={t("node.heading")} subtitle={t("node.subtitle")} />
        </FadeIn>
        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-5">
            <ul className="divide-y divide-hairline border-y border-hairline">
              {nodePoints.map(({ key, icon: Icon }) => (
                <li key={key} className="flex gap-5 py-6">
                  <Icon className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
                  <div>
                    <h3 className="text-lg leading-tight text-foreground">{t(`node.points.${key}.title`)}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{t(`node.points.${key}.description`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-7">
            <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-2xl border border-stroke bg-card p-5 sm:p-10">
              <div aria-hidden className="aurora aurora-left" />
              <div className="relative">
                {/* Peers outside the app */}
                <div className="flex flex-col items-center gap-3">
                  <div aria-hidden className="flex items-center gap-2">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span key={i} className={`size-2.5 rounded-full ${i === 2 ? "bg-brand" : "bg-foreground/20"}`} />
                    ))}
                  </div>
                  <p className="tag">{t("node.diagram.network")}</p>
                </div>
                <div aria-hidden className="mx-auto h-10 w-px bg-gradient-to-b from-foreground/10 to-brand/70" />

                {/* The app's one process */}
                <div className="rounded-xl border border-dashed border-stroke bg-background/70 p-3 sm:p-5">
                  <p className="tag mb-4 px-1">{t("node.diagram.process")}</p>
                  <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-stroke bg-hairline sm:grid-cols-2">
                    {[
                      { icon: Server, title: t("node.diagram.nodeTitle"), meta: t("node.diagram.nodeMeta"), lit: true },
                      { icon: KeyRound, title: t("node.diagram.walletTitle"), meta: t("node.diagram.walletMeta") },
                      { icon: History, title: t("node.diagram.historyTitle"), meta: t("node.diagram.historyMeta") },
                      { icon: Sparkles, title: t("node.diagram.assistantTitle"), meta: t("node.diagram.assistantMeta") },
                    ].map(({ icon: Icon, title, meta, lit }) => (
                      <div key={title} className="flex items-center gap-4 bg-background p-4 sm:p-5">
                        <span className={`flex size-10 shrink-0 items-center justify-center rounded-full border ${lit ? "border-brand/40 text-brand" : "border-stroke text-foreground"}`}>
                          <Icon className="size-[18px]" strokeWidth={1.5} aria-hidden />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[15px] text-foreground">{title}</p>
                          <p className="truncate font-mono text-xs text-muted-foreground">{meta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-6 flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <Lock className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
                  {t("node.diagram.rpc")}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* 02 Privacy */}
      <Section>
        <FadeIn>
          <SectionHeading index="02" eyebrow={t("privacy.eyebrow")} title={t("privacy.heading")} subtitle={t("privacy.subtitle")} />
        </FadeIn>
        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-5">
            <ul className="divide-y divide-hairline border-y border-hairline">
              {privacyPoints.map(({ key, icon: Icon }) => (
                <li key={key} className="flex gap-5 py-6">
                  <Icon className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
                  <div>
                    <h3 className="text-lg leading-tight text-foreground">{t(`privacy.points.${key}.title`)}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{t(`privacy.points.${key}.description`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-7">
            <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-2xl border border-stroke bg-card p-5 sm:p-10">
              <div aria-hidden className="aurora" />
              <div className="relative">
                {/* The app's Tor bar, as it reads once connected */}
                <div className="flex items-center gap-3 rounded-full border border-brand/40 bg-background/70 px-4 py-2.5 sm:px-5">
                  <span aria-hidden className="size-2 shrink-0 rounded-full bg-brand" />
                  <span className="text-[15px] text-foreground">{t("privacy.routes.status")}</span>
                </div>
                <div aria-hidden className="mx-auto h-8 w-px bg-gradient-to-b from-brand/70 to-foreground/10" />

                <div className="rounded-xl border border-dashed border-stroke bg-background/70 p-3 sm:p-5">
                  <p className="tag mb-4 px-1">{t("privacy.routes.heading")}</p>
                  <ul className="divide-y divide-hairline overflow-hidden rounded-lg border border-stroke bg-background">
                    {torRoutes.map(({ key, icon: Icon }) => (
                      <li key={key} className="flex items-center gap-4 px-4 py-3.5 sm:px-5">
                        <Icon className="size-[18px] shrink-0 text-foreground" strokeWidth={1.5} aria-hidden />
                        <span className="min-w-0 flex-1 text-[15px] text-foreground">{t(`privacy.routes.${key}Title`)}</span>
                        <span className="hidden truncate font-mono text-xs text-muted-foreground sm:block">{t(`privacy.routes.${key}Meta`)}</span>
                        <Check className="size-4 shrink-0 text-brand" strokeWidth={2} aria-hidden />
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="mt-6 flex gap-3 text-sm leading-relaxed text-muted-foreground">
                  <Lock className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
                  {t("privacy.routes.closed")}
                </p>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2">
            {privacyExtras.map(({ key, icon: Icon }) => (
              <div key={key} className="bg-background p-6 sm:p-8">
                <Icon className="size-6 text-brand" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-8 text-xl leading-tight text-foreground">{t(`privacy.extras.${key}.title`)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(`privacy.extras.${key}.description`)}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{t("privacy.note")}</p>
        </FadeIn>
      </Section>

      {/* 03 Security */}
      <Section>
        <FadeIn>
          <SectionHeading index="03" eyebrow={t("security.eyebrow")} title={t("security.heading")} subtitle={t("security.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {securityItems.map(({ key, icon: Icon }) => (
              <div key={key} className="bg-background p-6 sm:p-8">
                <Icon className="size-6 text-brand" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-8 text-xl leading-tight text-foreground">{t(`security.items.${key}.title`)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(`security.items.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Settings' Security page, which reads each protection as it stands */}
        <FadeIn delay={0.1}>
          <div className="mt-4 flex gap-5 rounded-2xl border border-stroke bg-card p-6 sm:p-8">
            <ListChecks className="mt-0.5 size-6 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
            <div>
              <h3 className="text-xl leading-tight text-foreground">{t("security.status.title")}</h3>
              <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">{t("security.status.description")}</p>
            </div>
          </div>
        </FadeIn>

        {/* What each OS adds on top */}
        <FadeIn delay={0.15}>
          <div className="mt-4 overflow-hidden rounded-2xl border border-stroke bg-card">
            <div className="flex items-center gap-3 border-b border-hairline px-6 py-4 sm:px-8">
              <ShieldCheck className="size-4 text-brand" strokeWidth={1.5} aria-hidden />
              <h3 className="text-lg text-foreground">{t("security.platform.heading")}</h3>
            </div>
            <div role="table" aria-label={t("security.platform.heading")}>
              <div role="row" className="hidden grid-cols-[1fr_repeat(3,9rem)] border-b border-hairline px-8 py-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground md:grid">
                <span role="columnheader">{t("security.platform.columnProtection")}</span>
                {platformCols.map(({ label, icon: Icon }) => (
                  <span role="columnheader" key={label} className="flex items-center gap-2">
                    <Icon className="size-3.5" aria-hidden />
                    {label}
                  </span>
                ))}
              </div>
              {platformRows.map(({ key, cells }) => (
                <div role="row" key={key} className="grid grid-cols-1 gap-4 border-b border-hairline px-6 py-5 last:border-b-0 sm:px-8 md:grid-cols-[1fr_repeat(3,9rem)] md:items-center md:gap-0">
                  <span role="rowheader" className="pr-6 text-[15px] leading-relaxed text-foreground">{t(`security.platform.rows.${key}`)}</span>
                  <div className="grid grid-cols-3 gap-2 md:contents">
                    {cells.map((cell, i) => (
                      <span role="cell" key={i} className="flex flex-col gap-1 md:block">
                        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground md:hidden">{platformCols[i].label}</span>
                        {cell === "yes" ? (
                          <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
                            <Check className="size-4 text-brand" strokeWidth={2} aria-hidden />
                            {cellLabel(cell)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Minus className="size-4" strokeWidth={1.5} aria-hidden />
                            {cellLabel(cell)}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="border-t border-hairline px-6 py-4 text-sm leading-relaxed text-muted-foreground sm:px-8">{t("security.platform.note")}</p>
          </div>
          <div className="mt-6">
            <GuideLink href="https://docs.parallaxprotocol.org/guides/parallax-wallet/security">{t("security.guide")}</GuideLink>
          </div>
        </FadeIn>
      </Section>

      {/* 04 Hardware and offline signing */}
      <Section>
        <FadeIn>
          <SectionHeading index="04" eyebrow={t("signing.eyebrow")} title={t("signing.heading")} subtitle={t("signing.subtitle")} />
        </FadeIn>
        <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FadeIn className="h-full">
            <div className="relative h-full overflow-hidden rounded-2xl border border-stroke bg-card p-8 sm:p-10">
              <div aria-hidden className="aurora aurora-left opacity-70" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <Usb className="size-7 text-brand" strokeWidth={1.5} aria-hidden />
                  <p className="tag">{t("signing.hardware.label")}</p>
                </div>
                <h3 className="mt-10 text-3xl leading-tight text-foreground">{t("signing.hardware.title")}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("signing.hardware.description")}</p>
                <ul className="mt-8 divide-y divide-hairline border-y border-hairline">
                  {hardwarePoints.map((point) => (
                    <li key={point} className="flex gap-3 py-4 text-[15px] leading-relaxed text-foreground/90">
                      <Check className="mt-1 size-4 shrink-0 text-brand" strokeWidth={2} aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <GuideLink href="https://docs.parallaxprotocol.org/guides/parallax-wallet/hardware-wallets">{t("signing.hardware.guide")}</GuideLink>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="h-full">
            <div className="relative h-full overflow-hidden rounded-2xl border border-stroke bg-card p-8 sm:p-10">
              <div aria-hidden className="aurora opacity-70" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <QrCode className="size-7 text-brand-2" strokeWidth={1.5} aria-hidden />
                  <p className="tag">{t("signing.offline.label")}</p>
                </div>
                <h3 className="mt-10 text-3xl leading-tight text-foreground">{t("signing.offline.title")}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("signing.offline.description")}</p>
                <ol className="mt-8 space-y-0">
                  {offlineSteps.map((step, i) => (
                    <li key={step} className="relative flex gap-5 pb-6 last:pb-0">
                      {i < offlineSteps.length - 1 && <span aria-hidden className="absolute top-9 bottom-0 left-[17px] w-px bg-hairline" />}
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-stroke font-mono text-xs text-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="pt-1.5">
                        <h4 className="text-lg leading-tight text-foreground">{t(`signing.offline.steps.${step}.title`)}</h4>
                        <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{t(`signing.offline.steps.${step}.description`)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="mt-8 border-t border-hairline pt-5 text-sm leading-relaxed text-muted-foreground">{t("signing.offline.note")}</p>
                <div className="mt-6">
                  <GuideLink href="https://docs.parallaxprotocol.org/guides/parallax-wallet/offline-signing">{t("signing.offline.guide")}</GuideLink>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div className="relative mt-4 overflow-hidden rounded-2xl border border-stroke bg-card p-4 sm:p-10">
            <div aria-hidden className="aurora aurora-left opacity-70" />
            <div className="relative mx-auto max-w-4xl">
              <CaptionedShot shot="ledger" alt={t("shots.ledger.alt")} caption={t("shots.ledger.caption")} sizes="(max-width: 1024px) 100vw, 896px" />
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* 05 AI assistant */}
      <Section>
        <FadeIn>
          <SectionHeading index="05" eyebrow={t("assistant.eyebrow")} title={t("assistant.heading")} subtitle={t("assistant.subtitle")} />
        </FadeIn>
        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-5">
            <ul className="divide-y divide-hairline border-y border-hairline">
              {assistantPoints.map(({ key, icon: Icon }) => (
                <li key={key} className="flex gap-5 py-6">
                  <Icon className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
                  <div>
                    <h3 className="text-lg leading-tight text-foreground">{t(`assistant.points.${key}.title`)}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{t(`assistant.points.${key}.description`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-7">
            <div className="relative flex h-full flex-col justify-center gap-4 overflow-hidden rounded-2xl border border-stroke bg-card p-4 sm:p-8">
              <div aria-hidden className="aurora" />
              {/* The permission modes, at the app's defaults */}
              <div className="relative overflow-hidden rounded-xl border border-stroke bg-background shadow-[0_24px_80px_-24px_rgb(0_0_0/0.5)]">
                <p className="flex items-center gap-2 border-b border-hairline px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <Sparkles className="size-3.5 text-brand" aria-hidden />
                  {t("assistant.permissionsPanel.label")}
                </p>
                <ul className="divide-y divide-hairline">
                  {permissionRows.map(({ key, mode }) => (
                    <li key={key} className="flex items-center justify-between gap-3 px-4 py-3">
                      <span className="text-[14px] text-foreground sm:text-[15px]">{t(`assistant.permissionsPanel.rows.${key}`)}</span>
                      <span className="sr-only">{t(`assistant.permissionsPanel.${mode}`)}</span>
                      <span aria-hidden className="flex shrink-0 gap-0.5 rounded-full border border-stroke bg-foreground/[0.04] p-0.5">
                        {modes.map((m) => (
                          <span
                            key={m}
                            className={`rounded-full px-2 py-1 text-[11px] sm:px-3 sm:text-xs ${m === mode ? "bg-foreground text-background" : "text-muted-foreground"}`}
                          >
                            {t(`assistant.permissionsPanel.${m}`)}
                          </span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connecting Claude Code */}
              <div className="on-dark-surface relative overflow-hidden rounded-xl border border-stroke bg-[#050506] text-white">
                <p className="flex items-center gap-2 border-b border-hairline px-4 py-3 font-mono text-xs uppercase tracking-[0.14em]">
                  <TerminalSquare className="size-3.5 text-brand" aria-hidden />
                  {t("assistant.connect.label")}
                </p>
                <p className="break-all px-4 py-4 font-mono text-[12.5px] leading-relaxed text-white/75 sm:px-5">
                  <span aria-hidden className="select-none text-brand">$ </span>
                  {MCP_COMMAND}
                </p>
              </div>
              <p className="relative px-1 text-sm leading-relaxed text-muted-foreground">{t("assistant.connect.note")}</p>
              <div className="relative px-1">
                <GuideLink href="https://docs.parallaxprotocol.org/guides/ai/parallax-wallet">{t("assistant.connect.guide")}</GuideLink>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.1}>
          <div className="relative mt-4 overflow-hidden rounded-2xl border border-stroke bg-card p-4 sm:p-10">
            <div aria-hidden className="aurora" />
            <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-8">
              <CaptionedShot shot="assistantPermission" alt={t("shots.assistantPermission.alt")} caption={t("shots.assistantPermission.caption")} />
              <CaptionedShot shot="assistantSend" alt={t("shots.assistantSend.alt")} caption={t("shots.assistantSend.caption")} />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-4 rounded-2xl border border-dashed border-stroke p-6 sm:p-8">
            <h3 className="flex items-center gap-3 text-lg text-foreground">
              <Ban className="size-5 text-brand-2" strokeWidth={1.5} aria-hidden />
              {t("assistant.never.heading")}
            </h3>
            <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
              {neverItems.map((item) => (
                <li key={item} className="flex gap-2.5 text-[15px] leading-snug text-muted-foreground">
                  <Minus className="mt-0.5 size-4 shrink-0 text-foreground/40" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </Section>

      {/* 06 Everyday */}
      <Section>
        <FadeIn>
          <SectionHeading index="06" eyebrow={t("everyday.eyebrow")} title={t("everyday.heading")} subtitle={t("everyday.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {everydayItems.map(({ key, icon: Icon }) => (
              <div key={key} className="bg-background p-6 sm:p-8">
                <Icon className="size-6 text-brand" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-8 text-lg leading-tight text-foreground">{t(`everyday.items.${key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`everyday.items.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-8">
            <CaptionedShot shot="sendReview" alt={t("shots.sendReview.alt")} caption={t("shots.sendReview.caption")} />
            <CaptionedShot shot="history" alt={t("shots.history.alt")} caption={t("shots.history.caption")} />
          </div>
        </FadeIn>
      </Section>

      {/* 07 In development */}
      <Section>
        <FadeIn>
          <SectionHeading index="07" eyebrow={t("upcoming.eyebrow")} title={t("upcoming.heading")} subtitle={t("upcoming.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {upcoming.map(({ key, icon: Icon }) => (
              <div key={key} className="relative overflow-hidden rounded-2xl border border-dashed border-stroke p-6 sm:p-10">
                <div className="flex items-center justify-between gap-4">
                  <Icon className="size-7 text-brand-2" strokeWidth={1.5} aria-hidden />
                  <Badge variant="outline">{t("upcoming.badge")}</Badge>
                </div>
                <h3 className="mt-10 text-2xl leading-tight text-foreground">{t(`upcoming.${key}.title`)}</h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">{t(`upcoming.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* 08 Download */}
      <Section id="download" className="scroll-mt-16 border-b-0">
        <FadeIn>
          <SectionHeading index="08" eyebrow={t("downloadSection.eyebrow")} title={t("downloadSection.heading")} subtitle={t("downloadSection.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1} className="mt-16">
          <WalletDownloads />
          <div className="mt-6">
            <GuideLink href="https://docs.parallaxprotocol.org/guides/parallax-wallet/installing">{t("downloadSection.guide")}</GuideLink>
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <Link
            href="/parallax-client"
            className="group plate-lift mt-16 flex flex-col gap-4 rounded-2xl border border-stroke bg-card p-6 sm:flex-row sm:items-center sm:gap-6 sm:px-8"
          >
            <TerminalSquare className="size-7 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
            <p className="text-base text-muted-foreground">
              <span className="text-foreground">{t("downloadSection.cliPrompt")}</span> {t("downloadSection.cliDescription")}
            </p>
            <span className="inline-flex shrink-0 items-center gap-2 text-[15px] font-medium text-foreground sm:ml-auto">
              {t("downloadSection.cliCta")}
              <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
            </span>
          </Link>
        </FadeIn>
      </Section>
    </MainMotion>
  )
}

/* An inline link out to a guide on the docs site. */
function GuideLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="group inline-flex items-center gap-2 text-[15px] font-medium text-foreground">
      {children}
      <ArrowUpRight className="size-4 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
    </a>
  )
}
