import AddNetworkPopup from "@/components/add-network-popup";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { ScrollProgress, ScrollToTop } from "@/components/scroll-utilities";
import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import { alternatesFor, BASE_URL, ogAlternateLocales, ogLocale, OG_IMAGE } from "@/lib/seo";
import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import "../table.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.site" });

  return {
    title: {
      // Only the homepage falls back to this: every other route sets its own
      // title, which the template then suffixes with the brand.
      default: t("titleHome"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    metadataBase: new URL(BASE_URL),
    // Both are rendered from the source SVG at build time; the extensions keep
    // them clear of the locale middleware.
    // favicon.ico is picked up from app/ automatically; the touch icon is
    // rendered from the source SVG at build time. The extension keeps it clear
    // of the locale middleware.
    icons: { apple: "/apple-icon.png" },
    openGraph: {
      type: "website",
      siteName: t("titleDefault"),
      title: t("titleHome"),
      description: t("ogDescription"),
      url: `${BASE_URL}/${locale}`,
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: t("titleHome"),
      description: t("ogDescription"),
      images: [OG_IMAGE.url],
    },
    alternates: alternatesFor(locale, "/"),
  };
}

export const viewport: Viewport = {
  // The site follows the visitor's system theme; the browser chrome tints
  // to match each one.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
};

const ORGANIZATION_ID = `${BASE_URL}/#organization`;
const WEBSITE_ID = `${BASE_URL}/#website`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Parallax Protocol",
      alternateName: "Parallax",
      description:
        "An open-source, permissionless Proof-of-Work blockchain: Bitcoin's monetary rules with a full Ethereum Virtual Machine at the execution layer.",
      url: BASE_URL,
      // Schema.org logos are only eligible for the rich result as raster
      // images, which /logo.png renders from the source SVG at build time.
      logo: {
        "@type": "ImageObject",
        "@id": `${BASE_URL}/#logo`,
        url: `${BASE_URL}/logo.png`,
        width: 512,
        height: 512,
        caption: "Parallax Protocol",
      },
      email: "security@parallaxprotocol.org",
      sameAs: [
        "https://github.com/ParallaxProtocol",
        "https://x.com/prlxchain",
        "https://discord.gg/4Z4R3aAU3B",
        "https://t.me/parallaxchain",
        "https://reddit.com/r/parallaxprotocol",
        "https://bitcointalk.org/index.php?topic=5560698",
      ],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: "Parallax Protocol",
      url: BASE_URL,
      description:
        "A peer-to-peer programmable cash system combining Bitcoin's sound money with Ethereum's programmability.",
      publisher: { "@id": ORGANIZATION_ID },
      inLanguage: routing.locales,
    },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            // The old manual toggle stored its choice under "theme"; a new
            // key retires those so every visitor follows their system.
            storageKey="parallax-theme"
            disableTransitionOnChange
          >
            <ScrollProgress />
            <ScrollToTop />
            <Navigation />
            <div className="flex flex-col justify-between min-h-screen">
              {children}
              <Footer />
            </div>
            <AddNetworkPopup />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
