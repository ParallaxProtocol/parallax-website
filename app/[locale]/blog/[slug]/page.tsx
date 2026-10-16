import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld"
import { Badge } from "@/components/ui/badge"
import { MdxContent } from "@/components/blog/mdx"
import { Cover, PostMeta } from "@/components/blog/post-card"
import MainMotion from "@/components/main-motion"
import { TwoToneTitle } from "@/components/section"
import { Link } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { formatPostDate, getAdjacentPosts, getPost, getPostSlugs, tagSlug } from "@/lib/blog"
import { blogAlternates, pageOgImage } from "@/lib/seo"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"

const BASE_URL = "https://parallaxprotocol.org"

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPost(slug)
  if (!post) return {}

  const t = await getTranslations({ locale, namespace: "metadata.blog" })
  const image = post.cover
    ? { url: post.cover, alt: post.coverAlt ?? post.title }
    : pageOgImage(post.title)

  return {
    title: post.title,
    description: post.summary,
    // Posts are English-only, so every locale prefix points at one canonical URL.
    alternates: blogAlternates(`/blog/${post.slug}`, t("title")),
    openGraph: {
      type: "article",
      siteName: "Parallax Protocol",
      title: post.title,
      description: post.summary,
      url: `${BASE_URL}/${routing.defaultLocale}/blog/${post.slug}`,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [image.url],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const t = await getTranslations("blog")
  const { newer, older } = getAdjacentPosts(post.slug)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "en",
    mainEntityOfPage: `${BASE_URL}/${routing.defaultLocale}/blog/${post.slug}`,
    image: post.cover ? `${BASE_URL}${post.cover}` : undefined,
    keywords: post.tags.length > 0 ? post.tags.join(", ") : undefined,
    author: { "@type": "Organization", name: post.author ?? "Parallax Protocol" },
    publisher: {
      "@type": "Organization",
      name: "Parallax Protocol",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
  }

  return (
    <MainMotion>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Posts are English-only, so the trail points at the canonical URLs. */}
      <BreadcrumbJsonLd
        locale={routing.defaultLocale}
        items={[
          { name: "Parallax Protocol", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />

      {/* Reading column: ~68ch of Geist at text-lg under a full-bleed
          masthead lit by the same aurora as the inner-page PageHeader. */}
      <article>
        <header className="relative mt-16 overflow-hidden border-b border-hairline">
          <div aria-hidden className="aurora" />
          <div className="relative mx-auto flex max-w-[46rem] flex-col items-start gap-7 px-6 pt-16 pb-14 sm:px-8 md:pt-24 md:pb-20">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-[15px] font-medium text-foreground"
            >
              <ArrowLeft className="size-4 text-brand transition-transform group-hover:-translate-x-1 motion-reduce:transition-none" />
              {t("backToBlog")}
            </Link>
            <PostMeta post={post} locale={locale} className="mt-6" />
            <h1 className="text-4xl leading-[1.05] tracking-[-0.025em] text-foreground text-balance sm:text-5xl lg:text-[3.5rem]">
              <TwoToneTitle text={post.title} />
            </h1>
            <p className="accent-rule pl-6 text-lg font-light leading-relaxed text-muted-foreground text-pretty sm:text-xl">{post.summary}</p>
            {post.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tagSlug(tag)}>
                    <Badge variant="outline" asChild>
                      <Link
                        href={`/blog/tag/${tagSlug(tag)}`}
                        className="text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                      >
                        {tag}
                      </Link>
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>

        <div className="mx-auto max-w-[46rem] px-6 pb-28 sm:px-8">
          {post.cover && (
            <div className="relative mt-12 aspect-video overflow-hidden rounded-2xl border border-stroke bg-surface-elevated">
              <Cover
                src={post.cover}
                alt={post.coverAlt ?? ""}
                priority
                sizes="(min-width: 1024px) 736px, 100vw"
              />
            </div>
          )}

          <MdxContent source={post.body} />

          {post.updated && (
            <p className="mt-16 border-t border-hairline pt-6 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {t("updatedOn", { date: formatPostDate(post.updated, locale) })}
            </p>
          )}

          {(newer || older) && (
            <nav className="mt-16 grid grid-cols-1 gap-4 border-t border-hairline pt-12 sm:grid-cols-2">
              {older && (
                <Link href={`/blog/${older.slug}`} className="group block rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                  <div className="plate-lift flex h-full flex-col gap-4 rounded-xl border border-stroke bg-card p-6">
                    <span className="tag">
                      <ArrowLeft className="size-4 text-brand transition-transform group-hover:-translate-x-1 motion-reduce:transition-none" />
                      {t("olderPost")}
                    </span>
                    <span className="text-xl leading-snug text-foreground text-pretty">
                      {older.title}
                    </span>
                  </div>
                </Link>
              )}
              {newer && (
                <Link href={`/blog/${newer.slug}`} className="group block rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:col-start-2">
                  <div className="plate-lift flex h-full flex-col gap-4 rounded-xl border border-stroke bg-card p-6 sm:items-end sm:text-right">
                    <span className="tag">
                      {t("newerPost")}
                      <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                    </span>
                    <span className="text-xl leading-snug text-foreground text-pretty">
                      {newer.title}
                    </span>
                  </div>
                </Link>
              )}
            </nav>
          )}
        </div>
      </article>
    </MainMotion>
  )
}
