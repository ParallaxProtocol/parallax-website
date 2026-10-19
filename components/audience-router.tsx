'use client'
import { Link } from "@/i18n/navigation"
import { ArrowRight, Bitcoin, Code2, Pickaxe } from "lucide-react"
import { useTranslations } from "next-intl"
import { FadeIn } from "./fade-in"
import { Section, SectionHeading } from "./section"

// Each briefing carries its own glow corner so the two doors read as two
// distinct entrances, not two copies of one card.
const audiences = [
  { key: "parallaxForBitcoiners", icon: Bitcoin, href: "/bitcoiners", glow: "aurora-left" },
  { key: "parallaxForDevelopers", icon: Code2, href: "/developers", glow: "" },
] as const

export function AudienceRouter() {
  const t = useTranslations("home.audience")
  const tIntro = useTranslations("introduction")
  const tCommon = useTranslations("common")

  return (
    <Section>
      <FadeIn>
        <SectionHeading index="04" eyebrow={t("eyebrow")} title={t("heading")} subtitle={t("subtitle")} />
      </FadeIn>

      <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {audiences.map((audience, i) => {
          const Icon = audience.icon
          return (
            <FadeIn key={audience.key} delay={i * 0.1} className="h-full">
              <Link href={audience.href} className="group block h-full outline-none">
                <div className="plate-lift relative flex h-full min-h-80 flex-col justify-between overflow-hidden rounded-2xl border border-stroke bg-card p-8 sm:p-10">
                  <div aria-hidden className={`aurora opacity-70 transition-opacity duration-300 group-hover:opacity-100 ${audience.glow}`} />
                  <div className="relative">
                    <Icon className="size-8 text-foreground" strokeWidth={1.5} />
                    <h3 className="mt-10 text-3xl leading-tight text-foreground sm:text-4xl">
                      {tIntro(`${audience.key}.pageTitle` as "parallaxForBitcoiners.pageTitle")}
                    </h3>
                    <p className="mt-4 max-w-lg text-base text-muted-foreground">
                      {tIntro(`${audience.key}.pageSubtitle` as "parallaxForBitcoiners.pageSubtitle")}
                    </p>
                  </div>
                  <span className="relative mt-10 inline-flex items-center gap-2 text-[15px] font-medium text-foreground">
                    {tCommon("readMore")}
                    <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          )
        })}
      </div>

      {/* Miners: a narrower door under the two briefings, to the mining page */}
      <FadeIn delay={0.2}>
        <Link
          href="/mining"
          className="group plate-lift mt-4 flex flex-col gap-4 rounded-2xl border border-stroke bg-card p-6 sm:flex-row sm:items-center sm:gap-6 sm:px-8"
        >
          <Pickaxe className="size-7 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
          <p className="text-base text-muted-foreground">
            <span className="text-foreground">{t("mining.prompt")}</span> {t("mining.description")}
          </p>
          <span className="inline-flex shrink-0 items-center gap-2 text-[15px] font-medium text-foreground sm:ml-auto">
            {t("mining.cta")}
            <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
          </span>
        </Link>
      </FadeIn>
    </Section>
  )
}
