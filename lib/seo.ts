import { routing } from "@/i18n/routing"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export const BASE_URL = "https://parallaxprotocol.org"

/** Fallback name for the feed link; blog routes pass their localised title. */
const FEED_TITLE = "Parallax Protocol Blog"

/**
 * Default social card, rendered by app/og.png/route.tsx.
 *
 * The version query exists for scraper caches: X (and others) cache a fetched
 * card image by its exact URL for about a week — including fetch failures.
 * Bump `v` whenever the brand card's design changes (or a bad fetch got
 * cached) so scrapers see a fresh URL; the route ignores the parameter.
 */
export const OG_IMAGE = {
  url: "/og.png?v=3",
  width: 1200,
  height: 630,
  alt: "Parallax Protocol — secured by physics",
}

/** Per-page social card: the brand card carrying this page's title. */
export function pageOgImage(title: string) {
  return {
    url: `/og.png?title=${encodeURIComponent(title)}`,
    width: OG_IMAGE.width,
    height: OG_IMAGE.height,
    alt: `${title} — Parallax Protocol`,
  }
}

/**
 * Open Graph wants language_TERRITORY, which our routing codes only supply for
 * the two that already carry a region.
 */
const OG_LOCALES: Record<string, string> = {
  en: "en_US",
}

export function ogLocale(locale: string): string {
  return OG_LOCALES[locale] ?? locale.replace("-", "_")
}

/** The other locales this page is also published in, for og:locale:alternate. */
export function ogAlternateLocales(locale: string): string[] {
  return routing.locales.filter((l) => l !== locale).map(ogLocale)
}

function pathFor(locale: string, path: string): string {
  return `/${locale}${path === "/" ? "" : path}`
}

/**
 * Canonical and hreflang set for one page, in every locale.
 *
 * Every route has to pass its own path: Next merges metadata shallowly, so a
 * page that omits `alternates` inherits the root layout's and ends up telling
 * crawlers it is a duplicate of the homepage.
 */
export function alternatesFor(locale: string, path: string): Metadata["alternates"] {
  return {
    canonical: pathFor(locale, path),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, pathFor(l, path)])),
      "x-default": pathFor(routing.defaultLocale, path),
    },
    types: {
      "application/rss+xml": [{ url: "/blog/rss.xml", title: FEED_TITLE }],
      "text/plain": [{ url: "/llms.txt", title: "llms.txt" }],
    },
  }
}

/**
 * Canonical for the blog, which is English-only. Every locale prefix serves the
 * same English content, so they all point at the default locale's URL and no
 * language alternates are advertised.
 */
export function blogAlternates(path: string, feedTitle: string): Metadata["alternates"] {
  return {
    canonical: pathFor(routing.defaultLocale, path),
    types: {
      "application/rss+xml": [{ url: "/blog/rss.xml", title: feedTitle }],
      "text/plain": [{ url: "/llms.txt", title: "llms.txt" }],
    },
  }
}

/**
 * Title, description, canonical, hreflang and Open Graph for a single page.
 *
 * `openGraph` replaces rather than merges with the parent's, so this builds the
 * whole object; leaving it to inheritance is what made every page share the
 * homepage's card.
 */
export async function pageMetadata({
  locale,
  path,
  title,
  description,
  alternates,
}: {
  locale: string
  path: string
  title: string
  description: string
  /** Overrides the default per-locale canonical, e.g. for English-only routes. */
  alternates?: Metadata["alternates"]
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata.site" })
  const ogTitle = t("titleTemplate").replace("%s", title)
  const resolved = alternates ?? alternatesFor(locale, path)
  const image = pageOgImage(title)

  return {
    title,
    description,
    alternates: resolved,
    openGraph: {
      type: "website",
      siteName: t("titleDefault"),
      title: ogTitle,
      description,
      url: `${BASE_URL}${resolved?.canonical ?? pathFor(locale, path)}`,
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image.url],
    },
  }
}
