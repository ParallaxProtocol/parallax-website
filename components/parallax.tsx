'use client'
import { Link } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { FadeIn } from "./fade-in"
import { Section, SectionHeading } from "./section"
import { Button } from "./ui/button"

export function Parallax() {
  const t = useTranslations("home.parallax")
  return (
    <Section className="z-10">
      <FadeIn>
        <SectionHeading index="03" eyebrow={t("eyebrow")} title={t("heading")} subtitle={t("subtitle")} />
      </FadeIn>

      <div className="mt-16 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <FadeIn>
          <figure className="mx-auto w-full lg:mx-0">
            <div className="relative aspect-[1000/652] w-full overflow-hidden rounded-2xl border border-stroke">
              <Image
                src="/the-death-of-socrates.png"
                alt="The Death of Socrates"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <figcaption className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {t("imageCaption")}
            </figcaption>
          </figure>
        </FadeIn>

        {/* Text */}
        <FadeIn delay={0.15}>
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p className="text-xl font-light leading-relaxed text-foreground sm:text-2xl">{t("body1")}</p>
            <p>{t("body2")}</p>
            <div className="pt-4">
              <Button variant="brand" size="lg" asChild>
                <Link href={"/introduction/doctrine"}>
                  {t("cta")}
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  )
}
