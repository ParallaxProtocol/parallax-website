'use client'
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import {
  ArrowRight,
  CircuitBoard,
  Hourglass,
  Scale,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { FadeIn } from "./fade-in"
import { Section, SectionHeading } from "./section"

const primaryFeatures = [
  { key: "hardCap", icon: Scale, glow: "aurora-left" },
  { key: "energySecured", icon: Zap, glow: "" },
] as const

const secondaryFeatures = [
  { key: "fairLaunch", icon: Users },
  { key: "settlement", icon: Hourglass },
  { key: "programmable", icon: CircuitBoard },
  { key: "credibly", icon: ShieldCheck },
] as const

export function SoundMoney() {
  const t = useTranslations("home.soundMoney")

  return (
    <Section>
      <FadeIn>
        <SectionHeading index="01" eyebrow={t("eyebrow")} title={t("heading")} subtitle={t("subtitle")} />
      </FadeIn>

      {/* Primary features — glowing panels */}
      <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {primaryFeatures.map((feature, i) => {
          const Icon = feature.icon
          return (
            <FadeIn key={feature.key} delay={i * 0.1} className="h-full">
              <div className="relative h-full overflow-hidden rounded-2xl border border-stroke bg-card p-8 sm:p-10">
                <div aria-hidden className={`aurora ${feature.glow}`} />
                <div className="relative">
                  <Icon className="size-8 text-brand" strokeWidth={1.5} />
                  <h3 className="mt-16 text-3xl leading-tight text-foreground">
                    {t(`${feature.key}.title` as "hardCap.title")}
                  </h3>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                    {t(`${feature.key}.description` as "hardCap.description")}
                  </p>
                </div>
              </div>
            </FadeIn>
          )
        })}
      </div>

      {/* Secondary features — one hairline grid */}
      <FadeIn delay={0.1}>
        <div className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {secondaryFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.key} className="bg-background p-6">
                <Icon className="size-6 text-foreground" strokeWidth={1.5} />
                <h3 className="mt-8 text-lg leading-tight text-foreground">
                  {t(`${feature.key}.title` as "fairLaunch.title")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(`${feature.key}.description` as "fairLaunch.description")}
                </p>
              </div>
            )
          })}
        </div>
      </FadeIn>

      <FadeIn>
        <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Button variant="brand" size="lg" asChild>
            <Link href={"/compare"}>
              {t("cta")}
              <ArrowRight />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">{t("ctaSubtitle")}</p>
        </div>
      </FadeIn>
    </Section>
  )
}
