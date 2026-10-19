import { PostCard } from "@/components/blog/post-card"
import MainMotion from "@/components/main-motion"
import PageHeader from "@/components/page-header"
import { Link } from "@/i18n/navigation"
import { getAllTags, getPostsByTag, getTagLabel } from "@/lib/blog"
import { blogAlternates, pageMetadata } from "@/lib/seo"
import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return getAllTags().map((entry) => ({ tag: entry.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>
}): Promise<Metadata> {
  const { locale, tag } = await params
  const label = getTagLabel(tag)
  if (!label) return {}

  const t = await getTranslations({ locale, namespace: "metadata.blog" })
  return pageMetadata({
    locale,
    path: `/blog/tag/${tag}`,
    title: t("tagTitle", { tag: label }),
    description: t("tagDescription", { tag: label }),
    alternates: blogAlternates(`/blog/tag/${tag}`, t("title")),
  })
}

export default async function BlogTagPage({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>
}) {
  const { locale, tag } = await params
  const label = getTagLabel(tag)
  if (!label) notFound()

  const t = await getTranslations("blog")
  const posts = getPostsByTag(tag)

  return (
    <MainMotion>
      <PageHeader
        title={t("taggedWith", { tag: label })}
        subTitle={t("taggedSubtitle", { count: posts.length })}
      />

      <section className="mx-auto max-w-[90rem] px-5 py-16 md:px-10 md:py-24">
        <Link
          href="/blog"
          className="group mb-14 inline-flex items-center gap-2 text-[15px] font-medium text-foreground"
        >
          <ArrowLeft className="size-4 text-brand transition-transform group-hover:-translate-x-1 motion-reduce:transition-none" />
          {t("backToBlog")}
        </Link>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      </section>
    </MainMotion>
  )
}
