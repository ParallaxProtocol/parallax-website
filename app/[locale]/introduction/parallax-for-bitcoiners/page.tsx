"use client"
import { FadeIn } from "@/components/fade-in"
import MainMotion from "@/components/main-motion"
import PageHeader from "@/components/page-header"
import { Section, SectionHeading } from "@/components/section"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { AlertTriangle, ArrowRight, ArrowRightLeft, Check, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"

type RawItem = { title: string; description: string }

export default function ParallaxForBitcoiners() {
  const t = useTranslations("introduction.parallaxForBitcoiners")
  const identical = t.raw("identical.items") as RawItem[]
  const different = t.raw("different.items") as RawItem[]
  const caveats = t.raw("caveats.items") as RawItem[]
  const [headline, ...constants] = identical

  return (
    <MainMotion>
      <PageHeader
        title={t("pageTitle")}
        subTitle={t("pageSubtitle")}
      />

      {/* Identical — the supply schedule leads as a glowing panel; the rest
          of the constitution sits beside it in one hairline grid. */}
      <Section>
        <FadeIn>
          <SectionHeading index="01" eyebrow={undefined} title={t("identical.heading")} subtitle={t("identical.tagline")} />
        </FadeIn>
        <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {headline && (
            <FadeIn className="h-full">
              <div className="relative h-full overflow-hidden rounded-2xl border border-stroke bg-card p-8 sm:p-10">
                <div aria-hidden className="aurora aurora-left" />
                <div className="relative flex h-full flex-col">
                  <span className="flex size-11 items-center justify-center rounded-full border border-stroke text-brand">
                    <Check className="size-5" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-16 text-3xl leading-[1.1] text-foreground sm:text-4xl">{headline.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{headline.description}</p>
                </div>
              </div>
            </FadeIn>
          )}
          <FadeIn delay={0.1} className="lg:col-span-2">
            <div className="grid h-full grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2">
              {constants.map((item) => (
                <div key={item.title} className="bg-background p-6 sm:p-8">
                  <Check className="size-5 text-brand" strokeWidth={1.5} />
                  <h3 className="mt-8 text-lg leading-tight text-foreground sm:text-xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Different — separate plates, each change numbered */}
      <Section>
        <FadeIn>
          <SectionHeading index="02" eyebrow={undefined} title={t("different.heading")} subtitle={t("different.tagline")} />
        </FadeIn>
        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
          {different.map((item, i) => (
            <FadeIn key={item.title} delay={(i % 2) * 0.1} className="h-full">
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-stroke bg-card">
                <div className="flex items-center justify-between border-b border-hairline px-6 py-3">
                  <span className="tag">
                    <span className="text-brand">{String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <ArrowRightLeft className="size-4 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="text-2xl leading-tight text-foreground">{item.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Caveats — the costs, flagged with a yellow mark. Last band: it runs flush into
          the footer's rule instead of leaving MainMotion's bottom padding. */}
      <Section className="border-b-0">
        <FadeIn>
          <SectionHeading index="03" eyebrow={undefined} title={t("caveats.heading")} subtitle={t("caveats.tagline")} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline lg:grid-cols-3">
            {caveats.map((item) => (
              <div key={item.title} className="bg-background p-6 sm:p-8">
                <AlertTriangle className="size-6 text-pop-yellow" strokeWidth={1.5} />
                <h3 className="mt-10 text-xl leading-tight text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <Button variant="brand" size="lg" className="w-full sm:w-fit" asChild>
              <Link href={"/introduction/verify"}>
                {t("ctaVerify")}
                <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-fit" asChild>
              <Link href={"/compare"}>
                {t("ctaCompare")}
                <ChevronRight />
              </Link>
            </Button>
          </div>
        </FadeIn>
      </Section>
    </MainMotion>
  )
}
