import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Add a new locale here to enable it across the site.
  // Steps to add a locale:
  //   1. Add its code to `locales` below.
  //   2. Add a display name to `localeNames`.
  //   3. Create `messages/<code>.json` mirroring `messages/en.json`.
  locales: ["en"] as const,
  defaultLocale: "en",
  localePrefix: "always",
  localeDetection: true,
  // No Link headers from the middleware: they disagree with the HTML meta
  // tags on x-default (bare root vs /en). The per-page meta tags built in
  // lib/seo.ts are the single source of hreflang truth.
  alternateLinks: false,
});

export type Locale = (typeof routing.locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
};
