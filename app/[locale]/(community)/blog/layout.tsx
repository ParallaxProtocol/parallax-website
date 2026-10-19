import type { Metadata } from "next"
import { blogAlternates, pageMetadata } from "@/lib/seo"
import { getTranslations } from "next-intl/server"
import "../../../blog.css"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "metadata.blog" })
  return pageMetadata({
    locale,
    path: "/blog",
    title: t("title"),
    description: t("description"),
    alternates: blogAlternates("/blog", t("title")),
  })
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
