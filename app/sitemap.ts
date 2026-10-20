import { routing } from "@/i18n/routing"
import { getAllPosts, getAllTags } from "@/lib/blog"
import type { MetadataRoute } from "next"

const BASE_URL = "https://parallaxprotocol.org"

const routes = [
  "/",
  "/faq",
  "/wallets",
  "/exchanges",
  "/compare",
  "/privacy",
  "/doctrine",
  "/get-started",
  "/how-it-works",
  "/bitcoiners",
  "/developers",
  "/verify",
  "/community",
  "/branding",
  "/parallax-client",
  "/parallax-wallet",
  "/network-atlas",
  "/mining",
  "/hashwarp",
  "/parallax-pool",
  "/blog",
]

function normalize(path: string): string {
  return path === "/" ? "" : path
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    for (const route of routes) {
      // No lastModified: stamping every URL with the build time is a signal
      // crawlers discount. Blog posts below carry real dates.
      entries.push({
        url: `${BASE_URL}/${locale}${normalize(route)}`,
        changeFrequency: route === "/" ? "daily" : "weekly",
        priority: route === "/" ? 1 : 0.8,
        alternates: {
          languages: {
            ...Object.fromEntries(
              routing.locales.map((l) => [
                l,
                `${BASE_URL}/${l}${normalize(route)}`,
              ]),
            ),
            "x-default": `${BASE_URL}/${routing.defaultLocale}${normalize(route)}`,
          },
        },
      })
    }
  }

  // Blog posts are English-only: one URL each, under the default locale, with
  // no language alternates (post pages set their canonical to the same URL).
  for (const post of getAllPosts()) {
    entries.push({
      url: `${BASE_URL}/${routing.defaultLocale}/blog/${post.slug}`,
      lastModified: new Date(`${post.updated ?? post.date}T00:00:00Z`),
      changeFrequency: "yearly",
      priority: 0.7,
    })
  }

  for (const tag of getAllTags()) {
    entries.push({
      url: `${BASE_URL}/${routing.defaultLocale}/blog/tag/${tag.slug}`,
      changeFrequency: "weekly",
      priority: 0.4,
    })
  }

  return entries
}
