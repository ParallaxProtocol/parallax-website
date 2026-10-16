'use client'
import { Link } from "@/i18n/navigation"
import { ArrowUpRight, BookOpenCheck, FileText, NotebookText } from "lucide-react"
import { useTranslations } from "next-intl"
import { FadeIn } from "./fade-in"
import { Section, SectionHeading } from "./section"

const docs = [
  { key: "beginnerGuides", icon: BookOpenCheck, href: "https://docs.parallaxprotocol.org/guides", external: true },
  { key: "technicalDocumentation", icon: NotebookText, href: "https://docs.parallaxprotocol.org", external: true },
  { key: "whitepaper", icon: FileText, href: "/parallax.pdf", external: true },
] as const

export function Documentation() {
  const t = useTranslations("home.documentation")
  const tCommon = useTranslations("common")
  return (
    <Section>
      <FadeIn>
        <SectionHeading index="08" eyebrow={t("eyebrow")} title={t("heading")} subtitle={t("subtitle")} />
      </FadeIn>

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((doc, i) => {
          const Icon = doc.icon
          const title = t(`${doc.key}.title` as "beginnerGuides.title")
          const description = t(`${doc.key}.description` as "beginnerGuides.description")
          const linkProps = doc.external
            ? { href: doc.href, target: "_blank", rel: "noopener" }
            : { href: doc.href }
          const LinkComponent = doc.external ? "a" : Link
          return (
            <FadeIn key={doc.key} delay={i * 0.1} className="h-full">
              <LinkComponent {...linkProps} className="group block h-full outline-none">
                <div className="plate-lift flex h-full flex-col justify-between gap-12 rounded-xl border border-stroke bg-foreground/[0.03] p-6">
                  <div className="flex items-start justify-between">
                    <Icon className="size-7 text-foreground" strokeWidth={1.5} />
                    <ArrowUpRight className="size-5 text-muted-foreground transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground motion-reduce:transition-none" />
                  </div>
                  <div>
                    <h3 className="text-xl leading-tight text-foreground">{title}</h3>
                    <p className="mt-2 text-[15px] text-muted-foreground">{description}</p>
                    <span className="sr-only">{tCommon("readMore")}</span>
                  </div>
                </div>
              </LinkComponent>
            </FadeIn>
          )
        })}
      </div>
    </Section>
  )
}
