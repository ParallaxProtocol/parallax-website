'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { ArrowRight, Lock, ShieldHalf, Zap } from "lucide-react"
import { useTranslations } from "next-intl"
import { FadeIn } from "./fade-in"
import { Section, SectionHeading } from "./section"

// What the contract layer is carrying now. Status is honest: the pool is
// research, the others are being built; none is presented as live.
const items = [
  { key: "pqPool", icon: ShieldHalf, status: "statusResearch", featured: true },
  { key: "vaults", icon: Lock, status: "statusDevelopment", featured: false },
  { key: "channels", icon: Zap, status: "statusDevelopment", featured: false },
] as const

const consensus = ["pow", "cap", "blocks", "noForks"] as const

/* The two-layer argument: an ossified consensus layer below, and above it
   a contract layer where privacy, post-quantum cryptography and covenants
   ship without touching consensus. */
export function NoForks() {
  const t = useTranslations("home.noForks")

  return (
    <Section>
      <FadeIn>
        <SectionHeading index="02" eyebrow={t("eyebrow")} title={t("heading")} subtitle={t("subtitle")} />
      </FadeIn>

      <FadeIn delay={0.1} className="mt-16">
        <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card p-3 sm:p-4">
          <div aria-hidden className="aurora" />

          {/* Contract layer */}
          <div className="relative rounded-xl border border-stroke bg-background/60 p-5 backdrop-blur-sm sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="tag text-foreground">{t("contractLayer")}</p>
              <p className="font-mono text-xs text-brand">{t("contractLayerNote")}</p>
            </div>
            <div className="mt-5 grid gap-3 lg:grid-cols-12">
              {items.map(({ key, icon: Icon, status, featured }) => (
                <div
                  key={key}
                  className={`relative overflow-hidden rounded-xl border border-stroke bg-card p-6 ${featured ? "lg:col-span-6 lg:row-span-2 sm:p-8" : "lg:col-span-6"}`}
                >
                  {featured && <div aria-hidden className="aurora aurora-left opacity-80" />}
                  <div className="relative">
                    <div className="flex items-center justify-between gap-4">
                      <Icon className={`${featured ? "size-8" : "size-6"} text-brand`} strokeWidth={1.5} aria-hidden />
                      <Badge variant="outline">{t(status)}</Badge>
                    </div>
                    <h3 className={`${featured ? "mt-14 text-3xl sm:text-4xl" : "mt-6 text-xl"} leading-tight text-foreground`}>
                      {t(`items.${key}.title` as "items.pqPool.title")}
                    </h3>
                    <p className={`${featured ? "mt-4 max-w-md text-base" : "mt-2 text-sm"} leading-relaxed text-muted-foreground`}>
                      {t(`items.${key}.description` as "items.pqPool.description")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The seam: everything above deploys onto what's below */}
          <div aria-hidden className="relative flex justify-center py-2">
            <div className="h-6 w-px bg-gradient-to-b from-brand to-brand-2" />
          </div>

          {/* Consensus layer */}
          <div className="relative rounded-xl border border-dashed border-stroke p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="tag text-foreground">{t("consensusLayer")}</p>
              <p className="font-mono text-xs text-muted-foreground">{t("consensusLayerNote")}</p>
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {consensus.map((key) => (
                <li key={key} className="flex items-center justify-center rounded-xl border border-hairline bg-foreground/[0.03] px-4 py-2.5 text-center text-sm text-foreground/85 lg:rounded-full">
                  {t(`consensus.${key}` as "consensus.pow")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-center">
          <p className="accent-rule pl-6 text-xl font-light leading-snug text-foreground text-balance sm:text-2xl lg:col-span-8">
            {t("contrast")}
          </p>
          <div className="lg:col-span-4 lg:justify-self-end">
            <Button variant="brand" size="lg" asChild>
              <Link href="/blog/covenants-without-forks">
                {t("cta")}
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </FadeIn>
    </Section>
  )
}
