import MainMotion from "@/components/main-motion"
import PageHeader from "@/components/page-header"
import { FadeIn } from "@/components/fade-in"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"

const sections = ["browser", "hosting", "external", "contact"] as const

export default async function PrivacyPage() {
  const t = await getTranslations("privacy")

  return (
    <MainMotion>
      <PageHeader title={t("title")} subTitle={t("subtitle")} />

      <section className="px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="tag">
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              {t("updated")}
            </p>
            <p className="accent-rule mt-10 pl-6 text-xl font-light leading-relaxed text-foreground text-pretty sm:text-2xl sm:leading-[1.5]">
              {t("intro")}
            </p>
          </FadeIn>

          {/* One rounded panel ruled into cells: the 1px gaps are the
              hairline showing through. It fades in as one block so cells
              never drift off the grid. */}
          <FadeIn className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline">
            {sections.map((section, i) => (
              <div key={section} className="grid gap-4 bg-background p-6 sm:grid-cols-[3.5rem_1fr] sm:gap-6 sm:p-10">
                <span aria-hidden className="font-mono text-xs font-medium tracking-[0.14em] text-brand sm:pt-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="mb-4 text-2xl leading-tight tracking-[-0.02em] text-foreground">
                    {t(`sections.${section}.title`)}
                  </h2>
                  {section === "external" ? (
                    <>
                      <p className="text-base text-muted-foreground leading-relaxed text-pretty">
                        {t("sections.external.body1")}
                      </p>
                      <p className="mt-4 text-base text-muted-foreground leading-relaxed text-pretty">
                        {t("sections.external.body2")}
                      </p>
                    </>
                  ) : section === "contact" ? (
                    <p className="text-base text-muted-foreground leading-relaxed text-pretty">
                      {t.rich("sections.contact.body", {
                        link: (chunks) => (
                          <Link
                            href="/community"
                            className="text-foreground underline decoration-brand/50 underline-offset-4 hover:decoration-brand"
                          >
                            {chunks}
                          </Link>
                        ),
                      })}
                    </p>
                  ) : (
                    <p className="text-base text-muted-foreground leading-relaxed text-pretty">
                      {t(`sections.${section}.body`)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>
    </MainMotion>
  )
}
