import { PostCard } from "@/components/blog/post-card"
import MainMotion from "@/components/main-motion"
import PageHeader from "@/components/page-header"
import { Link } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { getAllPosts, getAllTags } from "@/lib/blog"
import { Rss } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations("blog")
  const posts = getAllPosts()
  const tags = getAllTags()
  const [featured, ...rest] = posts

  return (
    <MainMotion>
      <PageHeader title={t("title")} subTitle={t("subtitle")}>
        {locale !== routing.defaultLocale && (
          <p className="tag">
            {t("englishOnly")}
          </p>
        )}
      </PageHeader>

      <section className="mx-auto max-w-[90rem] px-5 py-16 md:px-10 md:py-24">
        {tags.length > 0 && (
          <nav aria-label={t("topics")} className="mb-16 flex flex-wrap items-center gap-2 border-b border-hairline pb-10">
            <span className="tag mr-3">{t("topics")}</span>
            {tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/blog/tag/${tag.slug}`}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-stroke px-4 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-foreground/5 motion-reduce:transition-none"
              >
                {tag.tag}
                <span className="font-mono text-xs tabular-nums text-muted-foreground">{tag.count}</span>
              </Link>
            ))}
          </nav>
        )}

        {posts.length === 0 ? (
          <p className="rounded-2xl border border-stroke bg-card px-6 py-16 text-center text-lg text-muted-foreground">{t("empty")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
            <PostCard post={featured} locale={locale} featured />
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        )}

        <a
          href="/blog/rss.xml"
          className="group mt-20 inline-flex items-center gap-2 text-[15px] font-medium text-foreground"
        >
          <Rss className="size-4 text-brand" strokeWidth={1.75} />
          {t("rss")}
        </a>
      </section>
    </MainMotion>
  )
}
