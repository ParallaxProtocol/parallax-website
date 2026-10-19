import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.faq" })
  return pageMetadata({
    locale,
    path: "/faq",
    title: t("title"),
    description: t("description"),
  })
}

type FaqItem = { question: string; answer: string }
const CATEGORY_IDS = ["general", "technical", "mining", "economics", "governance", "development"] as const

export default async function FAQLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "faq.items" })

  const entries: FaqItem[] = []
  for (const id of CATEGORY_IDS) {
    const items = t.raw(id) as FaqItem[]
    entries.push(...items)
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  )
}
