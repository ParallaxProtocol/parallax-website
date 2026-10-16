'use client'
import { Link } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { FadeIn } from "./fade-in"
import { Section } from "./section"

export const GENESIS_HASH = "0x96b239e015d50f5c3f11b80733e5f38c95882c072719507b7be1a59db4975457"

export function GenesisProof() {
  const t = useTranslations("home.genesis")
  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <FadeIn className="lg:col-span-7">
          <p className="tag"><span className="text-brand">01</span><span aria-hidden className="text-hairline">/</span>{t("eyebrow")}</p>
          <blockquote className="mt-6 text-3xl font-light leading-[1.15] tracking-[-0.03em] text-foreground text-balance sm:text-4xl lg:text-5xl">
            <span aria-hidden className="text-gradient">&ldquo;</span>{t("headline")}<span aria-hidden className="text-gradient">&rdquo;</span>
          </blockquote>
          <p className="mt-6 max-w-xl text-base text-muted-foreground">{t("headlineNote")}</p>
        </FadeIn>
        <FadeIn delay={0.1} className="lg:col-span-5 lg:self-end">
          {/* Terminal readout */}
          <div className="overflow-hidden rounded-xl border border-stroke bg-card">
            <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-foreground">{t("hashLabel")}</p>
              <span aria-hidden className="font-mono text-xs tracking-[0.2em] text-muted-foreground/50">||||||||</span>
            </div>
            <p className="px-4 py-5 font-mono text-sm leading-relaxed text-foreground/85 break-all">{GENESIS_HASH}</p>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{t("supplyNote")}</p>
          <Link
            href="/introduction/verify"
            className="group mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-foreground"
          >
            {t("cta")}
            <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
          </Link>
        </FadeIn>
      </div>
    </Section>
  )
}
