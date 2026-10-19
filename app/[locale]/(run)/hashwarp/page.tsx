import ClientReleases from "@/components/client-releases"
import { FadeIn } from "@/components/fade-in"
import { HashwarpDownloadButton } from "@/components/hashwarp/hashwarp-download"
import { HashwarpQuickStart } from "@/components/hashwarp/hashwarp-quick-start"
import { CaptionedHashwarpShot, HashwarpShot } from "@/components/hashwarp/hashwarp-shot"
import MainMotion from "@/components/main-motion"
import { Section, SectionHeading, TwoToneTitle } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { HASHWARP_DOCS, HASHWARP_REPO, HASHWARP_REPO_URL } from "@/lib/hashwarp"
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Braces,
  Cable,
  Cpu,
  FileCog,
  Gauge,
  Keyboard,
  Layers,
  LayoutDashboard,
  ListChecks,
  Lock,
  Pickaxe,
  Power,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Thermometer,
  Timer,
  Wand2,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import { FaGithub, FaLinux, FaWindows } from "react-icons/fa"

const startPoints = [
  { key: "wizard", icon: Wand2 },
  { key: "stratum", icon: Cable },
  { key: "config", icon: FileCog },
] as const

const consolePoints = [
  { key: "hashrate", icon: Gauge },
  { key: "gpus", icon: Cpu },
  { key: "shares", icon: ListChecks },
  { key: "kernels", icon: Timer },
] as const

/* Hashwarp's docs, "Safety" (docs.parallaxprotocol.org/hashwarp/safety);
   epochs: the retry on a failed DAG build. */
const safetyItems = [
  { key: "tempStop", icon: Thermometer },
  { key: "shutdown", icon: Power },
  { key: "watchdog", icon: RefreshCw },
  { key: "verified", icon: ShieldCheck },
  { key: "selftest", icon: Sparkles },
  { key: "epochs", icon: Layers },
] as const

const monitoringPoints = [
  { key: "dashboard", icon: LayoutDashboard },
  { key: "json", icon: Braces },
  { key: "prometheus", icon: Activity },
  { key: "locked", icon: Lock },
] as const

const RIG_OSES = [
  { name: "HiveOS", logo: "/rig-os/hiveos.png" },
  { name: "mmpOS", logo: "/rig-os/mmpos.png" },
] as const

const API_COMMAND = "hashwarp --api-bind 127.0.0.1:21550 --api-token <token>"
const API_ENDPOINTS = ["http://127.0.0.1:21550", "/api/v1/summary", "/metrics"]

type KeyRow = { key: string; action: string }
type Field = { label: string; value: string }
type ExitRow = { code: string; meaning: string }
type Requirement = { label: string; value: string }

export default async function HashwarpPage() {
  const t = await getTranslations("hashwarp")
  const keys = t.raw("console.keys.items") as KeyRow[]
  const hiveFields = t.raw("rigs.hiveos.fields") as Field[]
  const exitRows = t.raw("safety.exitCodes.rows") as ExitRow[]
  const requirements = t.raw("downloadSection.requirements.items") as Requirement[]

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
            <HashwarpDownloadButton>
              <Button variant="outline" size="lg" asChild>
                <a href={HASHWARP_REPO_URL} target="_blank" rel="noopener">
                  <FaGithub />
                  {t("hero.source")}
                </a>
              </Button>
              {/* The rig OSes each release is packaged for, at a glance; both
                  jump to the setup in section 05 */}
              <div className="flex items-center gap-2 self-center">
                <span aria-hidden className="mr-1 hidden h-6 w-px bg-hairline sm:block" />
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{t("hero.rigOs.label")}</span>
                {RIG_OSES.map(({ name, logo }) => (
                  <a
                    key={name}
                    href="#rigs"
                    aria-label={t("hero.rigOs.link", { os: name })}
                    className="inline-flex h-8 items-center gap-2 rounded-full border border-stroke bg-foreground/[0.04] pr-3 pl-2 text-sm text-foreground/85 transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    <Image src={logo} alt="" width={16} height={16} className="size-4" />
                    {name}
                  </a>
                ))}
              </div>
            </HashwarpDownloadButton>
          </div>
          <p className="mt-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <span className="flex items-center gap-2 text-foreground/70" aria-hidden>
              <FaLinux className="size-3.5" />
              <FaWindows className="size-3.5" />
            </span>
            {t("hero.platforms")}
          </p>

          <div className="relative mx-auto mt-16 max-w-6xl sm:mt-20">
            <HashwarpShot
              shot="console"
              alt={t("shots.console.alt")}
              placeholder={t("shots.placeholder")}
              sizes="(max-width: 1152px) 100vw, 1152px"
              priority
            />
          </div>
        </div>
      </div>

      {/* 01 Quick start */}
      <Section>
        <FadeIn>
          <SectionHeading index="01" eyebrow={t("start.eyebrow")} title={t("start.heading")} subtitle={t("start.subtitle")} />
        </FadeIn>
        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
          <FadeIn className="lg:col-span-5">
            <PointList points={startPoints} t={(key, field) => t(`start.points.${key}.${field}`)} />
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-7">
            <div className="relative h-full overflow-hidden rounded-2xl border border-stroke bg-card p-5 sm:p-10">
              <div aria-hidden className="aurora aurora-left" />
              <div className="relative">
                <HashwarpQuickStart />
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* 02 Console */}
      <Section>
        <FadeIn>
          <SectionHeading index="02" eyebrow={t("console.eyebrow")} title={t("console.heading")} subtitle={t("console.subtitle")} />
        </FadeIn>
        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-7">
            <div className="grid h-full grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2">
              {consolePoints.map(({ key, icon: Icon }) => (
                <div key={key} className="bg-background p-6 sm:p-8">
                  <Icon className="size-6 text-brand" strokeWidth={1.5} aria-hidden />
                  <h3 className="mt-8 text-xl leading-tight text-foreground">{t(`console.points.${key}.title`)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(`console.points.${key}.description`)}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* The console's keys, from its "h" help */}
          <FadeIn delay={0.1} className="lg:col-span-5">
            <div className="on-dark-surface h-full overflow-hidden rounded-2xl border border-stroke bg-[#050506] text-white">
              <p className="flex items-center gap-2 border-b border-hairline px-5 py-3.5 font-mono text-xs uppercase tracking-[0.14em]">
                <Keyboard className="size-3.5 text-brand" aria-hidden />
                {t("console.keys.label")}
              </p>
              <dl className="divide-y divide-hairline">
                {keys.map(({ key, action }) => (
                  <div key={key} className="flex items-center gap-5 px-5 py-3.5">
                    <dt className="w-16 shrink-0 whitespace-nowrap">
                      <kbd className="rounded-md border border-white/15 bg-white/[0.06] px-2 py-0.5 font-mono text-[13px] text-white">{key}</kbd>
                    </dt>
                    <dd className="text-[15px] text-white/75">{action}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* 03 Safety */}
      <Section>
        <FadeIn>
          <SectionHeading index="03" eyebrow={t("safety.eyebrow")} title={t("safety.heading")} subtitle={t("safety.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {safetyItems.map(({ key, icon: Icon }) => (
              <div key={key} className="bg-background p-6 sm:p-8">
                <Icon className="size-6 text-brand" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-8 text-xl leading-tight text-foreground">{t(`safety.items.${key}.title`)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(`safety.items.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <div className="mt-4 overflow-hidden rounded-2xl border border-stroke bg-card">
            <div className="flex items-center gap-3 border-b border-hairline px-6 py-4 sm:px-8">
              <TerminalSquare className="size-4 text-brand" strokeWidth={1.5} aria-hidden />
              <h3 className="text-lg text-foreground">{t("safety.exitCodes.heading")}</h3>
            </div>
            <div role="table" aria-label={t("safety.exitCodes.heading")}>
              <div role="row" className="grid grid-cols-[5rem_1fr] border-b border-hairline px-6 py-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground sm:px-8">
                <span role="columnheader">{t("safety.exitCodes.columnCode")}</span>
                <span role="columnheader">{t("safety.exitCodes.columnMeaning")}</span>
              </div>
              {exitRows.map(({ code, meaning }) => (
                <div role="row" key={code} className="grid grid-cols-[5rem_1fr] items-baseline border-b border-hairline px-6 py-4 last:border-b-0 sm:px-8">
                  <span role="cell" className="font-mono text-base text-brand">{code}</span>
                  <span role="cell" className="text-[15px] leading-relaxed text-foreground">{meaning}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* 04 Monitoring */}
      <Section>
        <FadeIn>
          <SectionHeading index="04" eyebrow={t("monitoring.eyebrow")} title={t("monitoring.heading")} subtitle={t("monitoring.subtitle")} />
        </FadeIn>
        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
          <FadeIn className="lg:col-span-5">
            <PointList points={monitoringPoints} t={(key, field) => t(`monitoring.points.${key}.${field}`)} />
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-7">
            <div className="relative flex h-full flex-col justify-center gap-6 overflow-hidden rounded-2xl border border-stroke bg-card p-4 sm:p-8">
              <div aria-hidden className="aurora" />
              <div className="relative">
                <CaptionedHashwarpShot
                  shot="dashboard"
                  alt={t("shots.dashboard.alt")}
                  caption={t("shots.dashboard.caption")}
                  placeholder={t("shots.placeholder")}
                  sizes="(max-width: 1024px) 100vw, 640px"
                />
              </div>
              <div className="on-dark-surface relative overflow-hidden rounded-xl border border-stroke bg-[#050506] text-white">
                <p className="flex items-center gap-2 border-b border-hairline px-4 py-3 font-mono text-xs uppercase tracking-[0.14em]">
                  <TerminalSquare className="size-3.5 text-brand" aria-hidden />
                  {t("monitoring.command")}
                </p>
                <p className="break-all px-4 py-4 font-mono text-[12.5px] leading-relaxed text-white/75 sm:px-5">
                  <span aria-hidden className="select-none text-brand">$ </span>
                  {API_COMMAND}
                </p>
                <ul className="flex flex-wrap gap-x-5 gap-y-1 border-t border-hairline px-4 py-3 font-mono text-xs text-white/50 sm:px-5">
                  {API_ENDPOINTS.map((endpoint) => (
                    <li key={endpoint}>{endpoint}</li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* 05 Rig operating systems */}
      <Section id="rigs" className="scroll-mt-16">
        <FadeIn>
          <SectionHeading index="05" eyebrow={t("rigs.eyebrow")} title={t("rigs.heading")} subtitle={t("rigs.subtitle")} />
        </FadeIn>
        <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <FadeIn className="h-full lg:col-span-2">
            <div className="relative h-full overflow-hidden rounded-2xl border border-stroke bg-card p-8 sm:p-10">
              <div aria-hidden className="aurora aurora-left opacity-70" />
              <div className="relative">
                <Pickaxe className="size-7 text-brand" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-10 text-3xl leading-tight text-foreground">{t("rigs.hiveos.title")}</h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("rigs.hiveos.description")}</p>
                <dl className="mt-8 border-t border-hairline">
                  {hiveFields.map(({ label, value }) => (
                    <div key={label} className="grid gap-1 border-b border-hairline py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
                      <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground sm:pt-0.5">{label}</dt>
                      <dd className="break-all font-mono text-[14px] text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 gap-4">
            {([
              { key: "mmpos", icon: Cpu },
            ] as const).map(({ key, icon: Icon }, i) => (
              <FadeIn key={key} delay={0.1 + i * 0.05} className="h-full">
                <div className="h-full rounded-2xl border border-stroke bg-card p-6 sm:p-8">
                  <Icon className="size-6 text-brand" strokeWidth={1.5} aria-hidden />
                  <h3 className="mt-8 text-2xl leading-tight text-foreground">{t(`rigs.${key}.title`)}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(`rigs.${key}.description`)}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
        <FadeIn delay={0.15}>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{t("rigs.restart")}</p>
          <div className="mt-6">
            <GuideLink href={`${HASHWARP_DOCS}/rig-os`}>{t("rigs.guide")}</GuideLink>
          </div>
        </FadeIn>
      </Section>

      {/* 06 Download */}
      <Section id="download" className="scroll-mt-16 border-b-0">
        <FadeIn>
          <SectionHeading index="06" eyebrow={t("downloadSection.eyebrow")} title={t("downloadSection.heading")} subtitle={t("downloadSection.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1} className="mt-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <HashwarpDownloadButton />
            </div>
            <div className="lg:col-span-8">
              <p className="tag mb-4">{t("downloadSection.requirements.heading")}</p>
              <dl className="border-t border-hairline">
                {requirements.map(({ label, value }) => (
                  <div key={label} className="grid gap-1 border-b border-hairline py-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
                    <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground sm:pt-1">{label}</dt>
                    <dd className="text-base text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <ClientReleases repo={HASHWARP_REPO} intro={t("downloadSection.releasesIntro")} />
          <div className="mt-6">
            <GuideLink href={`${HASHWARP_DOCS}/getting-started`}>{t("downloadSection.guide")}</GuideLink>
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <Link
            href="/mining"
            className="group plate-lift mt-16 flex flex-col gap-4 rounded-2xl border border-stroke bg-card p-6 sm:flex-row sm:items-center sm:gap-6 sm:px-8"
          >
            <Pickaxe className="size-7 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
            <p className="text-base text-muted-foreground">
              <span className="text-foreground">{t("downloadSection.miningPrompt")}</span> {t("downloadSection.miningDescription")}
            </p>
            <span className="inline-flex shrink-0 items-center gap-2 text-[15px] font-medium text-foreground sm:ml-auto">
              {t("downloadSection.miningCta")}
              <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
            </span>
          </Link>
        </FadeIn>
      </Section>
    </MainMotion>
  )
}

/* A ruled list of icon, title and description, like Parallax Wallet's. */
function PointList({
  points,
  t,
}: {
  points: readonly { key: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }> }[]
  t: (key: string, field: "title" | "description") => string
}) {
  return (
    <ul className="divide-y divide-hairline border-y border-hairline">
      {points.map(({ key, icon: Icon }) => (
        <li key={key} className="flex gap-5 py-6">
          <Icon className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
          <div>
            <h3 className="text-lg leading-tight text-foreground">{t(key, "title")}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{t(key, "description")}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

/* An inline link out to a guide. */
function GuideLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="group inline-flex items-center gap-2 text-[15px] font-medium text-foreground">
      {children}
      <ArrowUpRight className="size-4 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
    </a>
  )
}
