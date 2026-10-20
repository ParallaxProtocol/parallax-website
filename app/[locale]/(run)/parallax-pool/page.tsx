import ClientReleases from "@/components/client-releases"
import { FadeIn } from "@/components/fade-in"
import MainMotion from "@/components/main-motion"
import { PoolQuickStart } from "@/components/parallax-pool/pool-quick-start"
import { PoolShot } from "@/components/parallax-pool/pool-shot"
import { Section, SectionHeading, TwoToneTitle } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { POOL_CONFIG_EXAMPLE_URL, POOL_README_URL, POOL_REPO, POOL_REPO_URL } from "@/lib/parallax-pool"
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Cable,
  Clock,
  Cpu,
  FileCog,
  Gauge,
  KeyRound,
  LayoutDashboard,
  Lock,
  Pickaxe,
  Radio,
  Server,
  Users,
  User,
  Wrench,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { FaDocker, FaGithub } from "react-icons/fa"

const modes = [
  { key: "direct", icon: User },
  { key: "pool", icon: Users },
] as const

/* Each claim checked against the pool's code (src/Miningcore): XHash in
   Crypto/Hashing/Xhash, stratum in ParallaxPool.cs, maturity in
   ParallaxPayoutHandler.cs, the UI in ui/. */
const features = [
  { key: "xhash", icon: Cpu },
  { key: "stratum", icon: Cable },
  { key: "vardiff", icon: Gauge },
  { key: "maturity", icon: Clock },
  { key: "ui", icon: LayoutDashboard },
  { key: "api", icon: Radio },
  { key: "zeroConfig", icon: Wrench },
  { key: "ops", icon: Activity },
] as const

const operatorPoints = [
  { key: "rpc", icon: Lock },
  { key: "keys", icon: KeyRound },
  { key: "admin", icon: Server },
  { key: "config", icon: FileCog },
] as const

type Fact = { label: string; value: string }
type Requirement = { label: string; value: string }

export default async function ParallaxPoolPage() {
  const t = await getTranslations("parallaxPool")
  const requirements = t.raw("get.requirements.items") as Requirement[]

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
          <div className="mt-10 flex flex-col gap-3 sm:flex-row enter-fade-up" style={{ "--enter-delay": "0.35s" } as React.CSSProperties}>
            <Button variant="brand" size="lg" className="w-full sm:w-fit" asChild>
              <a href="#start">
                {t("hero.start")}
                <ArrowDown />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-fit" asChild>
              <a href={POOL_REPO_URL} target="_blank" rel="noopener">
                <FaGithub />
                {t("hero.source")}
              </a>
            </Button>
          </div>
          <p className="mt-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <FaDocker className="size-3.5 text-foreground/70" aria-hidden />
            {t("hero.platforms")}
          </p>

          <div className="relative mx-auto mt-16 max-w-6xl sm:mt-20">
            <PoolShot alt={t("shot.alt")} caption={t("shot.caption")} />
          </div>
        </div>
      </div>

      {/* 01 Two modes */}
      <Section>
        <FadeIn>
          <SectionHeading index="01" eyebrow={t("modes.eyebrow")} title={t("modes.heading")} subtitle={t("modes.subtitle")} />
        </FadeIn>
        <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {modes.map(({ key, icon: Icon }, i) => {
            const facts = t.raw(`modes.${key}.facts`) as Fact[]
            return (
              <FadeIn key={key} delay={0.05 + i * 0.05} className="h-full">
                <div className="relative h-full overflow-hidden rounded-2xl border border-stroke bg-card p-8 sm:p-10">
                  {i === 0 && <div aria-hidden className="aurora aurora-left opacity-70" />}
                  <div className="relative">
                    <div className="flex items-center justify-between gap-4">
                      <Icon className="size-7 text-brand" strokeWidth={1.5} aria-hidden />
                      <code className="rounded-full border border-stroke px-3 py-1 font-mono text-xs text-muted-foreground">
                        PAYOUT_MODE={key}
                      </code>
                    </div>
                    <h3 className="mt-10 text-3xl leading-tight text-foreground">{t(`modes.${key}.title`)}</h3>
                    <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t(`modes.${key}.description`)}</p>
                    <dl className="mt-8 border-t border-hairline">
                      {facts.map(({ label, value }) => (
                        <div key={label} className="grid gap-1 border-b border-hairline py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                          <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground sm:pt-0.5">{label}</dt>
                          <dd className="text-[15px] text-foreground">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </Section>

      {/* 02 Quick start */}
      <Section id="start" className="scroll-mt-16">
        <FadeIn>
          <SectionHeading index="02" eyebrow={t("start.eyebrow")} title={t("start.heading")} subtitle={t("start.subtitle")} />
        </FadeIn>
        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
          <FadeIn className="lg:col-span-5">
            <ol className="divide-y divide-hairline border-y border-hairline">
              {(t.raw("start.steps") as { title: string; description: string }[]).map((step, i) => (
                <li key={step.title} className="flex gap-5 py-6">
                  <span className="mt-0.5 w-6 shrink-0 font-mono text-sm text-brand">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-lg leading-tight text-foreground">{step.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-7">
            <div className="relative h-full overflow-hidden rounded-2xl border border-stroke bg-card p-5 sm:p-10">
              <div aria-hidden className="aurora aurora-left" />
              <div className="relative">
                <PoolQuickStart />
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* 03 What's inside */}
      <Section>
        <FadeIn>
          <SectionHeading index="03" eyebrow={t("features.eyebrow")} title={t("features.heading")} subtitle={t("features.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ key, icon: Icon }) => (
              <div key={key} className="bg-background p-6 sm:p-8">
                <Icon className="size-6 text-brand" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-8 text-xl leading-tight text-foreground">{t(`features.items.${key}.title`)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(`features.items.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* 04 Running it in public */}
      <Section>
        <FadeIn>
          <SectionHeading index="04" eyebrow={t("operators.eyebrow")} title={t("operators.heading")} subtitle={t("operators.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <ul className="mt-16 grid grid-cols-1 gap-x-16 border-t border-hairline md:grid-cols-2">
            {operatorPoints.map(({ key, icon: Icon }) => (
              <li key={key} className="flex gap-5 border-b border-hairline py-6">
                <Icon className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
                <div>
                  <h3 className="text-lg leading-tight text-foreground">{t(`operators.points.${key}.title`)}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{t(`operators.points.${key}.description`)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-8">
            <GuideLink href={POOL_README_URL}>{t("operators.readme")}</GuideLink>
            <GuideLink href={POOL_CONFIG_EXAMPLE_URL}>{t("operators.configExample")}</GuideLink>
          </div>
        </FadeIn>
      </Section>

      {/* 05 Get it */}
      <Section id="download" className="scroll-mt-16 border-b-0">
        <FadeIn>
          <SectionHeading index="05" eyebrow={t("get.eyebrow")} title={t("get.heading")} subtitle={t("get.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1} className="mt-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="flex flex-col gap-3 lg:col-span-4">
              <Button variant="brand" size="lg" className="w-full sm:w-fit" asChild>
                <a href={POOL_REPO_URL} target="_blank" rel="noopener">
                  <FaGithub />
                  {t("get.repo")}
                </a>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-fit" asChild>
                <a href="https://hub.docker.com/r/parallaxprotocol/parallax-pool" target="_blank" rel="noopener">
                  <FaDocker />
                  {t("get.image")}
                </a>
              </Button>
            </div>
            <div className="lg:col-span-8">
              <p className="tag mb-4">{t("get.requirements.heading")}</p>
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
          <ClientReleases repo={POOL_REPO} intro={t("get.releasesIntro")} />
        </FadeIn>
        <FadeIn delay={0.15}>
          <Link
            href="/hashwarp"
            className="group plate-lift mt-16 flex flex-col gap-4 rounded-2xl border border-stroke bg-card p-6 sm:flex-row sm:items-center sm:gap-6 sm:px-8"
          >
            <Pickaxe className="size-7 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
            <p className="text-base text-muted-foreground">
              <span className="text-foreground">{t("get.minerPrompt")}</span> {t("get.minerDescription")}
            </p>
            <span className="inline-flex shrink-0 items-center gap-2 text-[15px] font-medium text-foreground sm:ml-auto">
              {t("get.minerCta")}
              <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
            </span>
          </Link>
        </FadeIn>
      </Section>
    </MainMotion>
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
