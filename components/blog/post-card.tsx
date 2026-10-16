import type { PostSummary } from "@/lib/blog"
import { formatPostDate, tagSlug } from "@/lib/blog"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Image from "next/image"

/** Cover art. Local paths go through next/image; remote URLs are left alone. */
export function Cover({
  src,
  alt,
  className,
  priority = false,
  sizes,
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes: string
}) {
  if (/^https?:\/\//.test(src)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={cn("h-full w-full object-cover", className)} />
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  )
}

export async function PostMeta({
  post,
  locale,
  className,
}: {
  post: PostSummary
  locale: string
  className?: string
}) {
  const t = await getTranslations("blog")

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
    >
      <time dateTime={post.date}>{formatPostDate(post.date, locale)}</time>
      <span aria-hidden className="text-hairline">/</span>
      <span>{t("minRead", { minutes: post.readingMinutes })}</span>
      {post.author && (
        <>
          <span aria-hidden className="text-hairline">/</span>
          <span>{t("by", { author: post.author })}</span>
        </>
      )}
    </div>
  )
}

/* News card after solana.com's "Keep up with the latest": a rounded cover
   with a hairline edge, the title set below it, no plate. Hover brightens
   the cover's edge and slowly scales the art inside its frame. */
export async function PostCard({
  post,
  locale,
  featured = false,
}: {
  post: PostSummary
  locale: string
  featured?: boolean
}) {
  const t = await getTranslations("blog")

  return (
    <article className={cn("h-full", featured && "md:col-span-2")}>
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          "group flex h-full flex-col gap-6 rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          featured && "md:grid md:grid-cols-12 md:items-center md:gap-10 lg:gap-14",
        )}
      >
        {post.cover && (
          <div
            className={cn(
              "relative aspect-video shrink-0 overflow-hidden rounded-2xl border border-stroke bg-surface-elevated transition-colors duration-300 group-hover:border-foreground/25",
              featured && "md:col-span-7",
            )}
          >
            <Cover
              src={post.cover}
              alt={post.coverAlt ?? ""}
              priority={featured}
              sizes={featured ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
              className="transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none"
            />
          </div>
        )}

        <div className={cn("flex flex-1 flex-col gap-4", featured && "md:col-span-5 md:gap-5")}>
          <PostMeta post={post} locale={locale} />

          <h3
            className={cn(
              "text-2xl leading-[1.2] tracking-[-0.01em] text-foreground text-pretty transition-colors group-hover:text-foreground/80",
              featured && "sm:text-4xl sm:leading-[1.08] sm:tracking-[-0.02em] lg:text-[2.75rem]",
            )}
          >
            {post.title}
          </h3>

          <p className={cn("text-base leading-relaxed text-muted-foreground text-pretty", featured && "sm:text-lg")}>
            {post.summary}
          </p>

          {post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tagSlug(tag)}>
                  <Badge variant="outline" className="text-muted-foreground">{tag}</Badge>
                </li>
              ))}
            </ul>
          )}

          <span className="mt-auto inline-flex items-center gap-2 pt-1 text-[15px] font-medium text-foreground">
            {t("readPost")}
            <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
          </span>
        </div>
      </Link>
    </article>
  )
}
