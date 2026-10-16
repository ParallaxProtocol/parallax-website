'use client'
import { Link } from "@/i18n/navigation"
import { ArrowRight, CircleSlash, Hexagon } from "lucide-react"
import { useTranslations } from "next-intl"
import { FaGithub } from "react-icons/fa"
import ClientDownloadButton from "./client-download-button"
import { FadeIn } from "./fade-in"
import { Section, SectionHeading } from "./section"

export default function Client() {
  const t = useTranslations("home.client")
  return (
    <Section className="z-10">
      <FadeIn>
        <SectionHeading index="05" eyebrow={t("eyebrow")} title={t("heading")} subtitle={t("subtitle")} />
      </FadeIn>

      {/* Two concept cells */}
      <FadeIn delay={0.1}>
        <div className="mt-16 grid grid-cols-1 overflow-hidden rounded-2xl border border-stroke sm:grid-cols-2">
          <div className="p-8">
            <Hexagon className="size-7 text-brand" strokeWidth={1.5} />
            <h3 className="mt-10 text-2xl text-foreground">{t("decentralized.title")}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {t("decentralized.description")}
            </p>
            <Link
              href="/resources/network-atlas"
              className="group mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-foreground"
            >
              {t("decentralized.cta")}
              <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
          </div>
          <div className="border-t border-hairline p-8 sm:border-t-0 sm:border-l">
            <CircleSlash className="size-7 text-brand-2" strokeWidth={1.5} />
            <h3 className="mt-10 text-2xl text-foreground">{t("noVoting.title")}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {t("noVoting.description")}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Blockquote */}
      <FadeIn delay={0.15}>
        <blockquote className="accent-rule my-20 pl-6 sm:pl-10">
          <p className="max-w-4xl text-2xl font-light leading-snug tracking-[-0.02em] text-foreground text-balance sm:text-4xl">
            {t("blockquote")}
          </p>
        </blockquote>
      </FadeIn>

      {/* Download CTA panel */}
      <FadeIn delay={0.2}>
        <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card px-8 py-14 text-center sm:px-12 sm:py-20">
          <div aria-hidden className="aurora" />
          <div className="relative">
            <h3 className="text-4xl text-foreground sm:text-5xl">{t("runNode.title")}</h3>
            <p className="mx-auto mt-4 mb-10 max-w-xl text-lg text-muted-foreground">
              {t("runNode.description")}
            </p>
            <div className="flex flex-col items-center">
              <ClientDownloadButton variant="gui" />
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
              <Link
                href="/resources/parallax-client"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                {t("cli")}
              </Link>
              <Link
                href="/resources/parallax-client"
                className="hover:text-foreground transition-colors"
              >
                {t("quickStart")}
              </Link>
              <a
                href="https://github.com/ParallaxProtocol"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <FaGithub className="size-3.5" />
                {t("github")}
              </a>
            </div>
          </div>
        </div>
      </FadeIn>
    </Section>
  )
}
