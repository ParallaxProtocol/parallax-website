import { Link } from "@/i18n/navigation"
import { LineChart } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"

type InternalLink = { key: string; href: string }
type ExternalLink = { key: string; href: string; external: true }
type FooterLink = InternalLink | ExternalLink

// Mirrors the main navigation menus (plus the social links column).
const footerLinks: Record<string, FooterLink[]> = {
  protocol: [
    { key: "doctrine", href: "/introduction/doctrine" },
    { key: "howItWorks", href: "/introduction/how-it-works" },
    { key: "compare", href: "/compare" },
    { key: "bitcoiners", href: "/introduction/parallax-for-bitcoiners" },
    { key: "developers", href: "/introduction/parallax-for-developers" },
    { key: "verify", href: "/introduction/verify" },
    { key: "whitepaper", href: "/parallax.pdf", external: true },
    { key: "gettingStarted", href: "/introduction/getting-started" },
  ],
  resources: [
    { key: "beginnerGuides", href: "/resources/beginner-guides" },
    { key: "technicalDocumentation", href: "/resources/technical-documentation" },
    { key: "parallaxClient", href: "/resources/parallax-client" },
    { key: "wallets", href: "/wallets" },
    { key: "exchanges", href: "/exchanges" },
    { key: "community", href: "/resources/community" },
    { key: "brandAssets", href: "/resources/branding" },
    { key: "blockExplorer", href: "https://explorer.parallaxprotocol.org", external: true },
    { key: "networkAtlas", href: "/resources/network-atlas" },
    { key: "networkStatus", href: "https://status.parallaxprotocol.org", external: true },
    { key: "faq", href: "/faq" },
    { key: "blog", href: "/blog" },
  ],
  participate: [
    { key: "supportParallax", href: "/participate/support-parallax" },
    { key: "runningAFullNode", href: "/participate/running-a-full-node" },
    { key: "mining", href: "/participate/mining" },
    { key: "development", href: "/participate/development" },
  ],
  community: [
    { key: "github", href: "https://github.com/ParallaxProtocol", external: true },
    { key: "bitcointalk", href: "https://bitcointalk.org/index.php?topic=5560698", external: true },
    { key: "twitter", href: "https://x.com/prlxchain", external: true },
    { key: "discord", href: "https://discord.gg/4Z4R3aAU3B", external: true },
    { key: "telegram", href: "https://t.me/parallaxchain", external: true },
  ],
}

function isExternal(link: FooterLink): link is ExternalLink {
  return "external" in link
}

export function Footer() {
  const t = useTranslations("footer")

  return (
    <footer className="relative w-full overflow-hidden border-t border-hairline bg-background">
      <div className="mx-auto max-w-[90rem] px-5 pt-16 md:px-10">
        {/* Brand row */}
        <div className="flex flex-col gap-4 border-b border-hairline pb-10 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/new_parallax_logo_square.svg"
                className="h-10 w-auto dark:hidden"
                alt="Parallax logo"
                width={200}
                height={200}
              />
              <Image
                src="/new_parallax_logo_square_white.svg"
                className="h-10 w-auto hidden dark:block"
                alt="Parallax logo"
                width={200}
                height={200}
              />
              <span className="text-xl font-medium tracking-tight text-foreground">
                Parallax
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs sm:text-right">
              {t("tagline")}
            </p>
        </div>

        <div className="grid grid-cols-2 gap-10 pt-12 sm:grid-cols-4">

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {t(`sections.${section}` as "sections.protocol")}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => {
                  const label = t(`links.${link.key}` as "links.doctrine")
                  if (isExternal(link)) {
                    return (
                      <li key={link.key}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener"
                          className="text-[15px] text-foreground/80 hover:text-foreground transition-colors"
                        >
                          {label}
                        </a>
                      </li>
                    )
                  }
                  return (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="text-[15px] text-foreground/80 hover:text-foreground transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-hairline pt-8">
          <div className="flex items-center gap-2 mb-6">
            <LineChart className="size-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {t.rich("marketDataBy", {
                link: (chunks) => (
                  <a
                    href="https://www.coingecko.com/en/coins/parallax-2"
                    target="_blank"
                    rel="noopener"
                    className="hover:text-foreground transition-colors underline underline-offset-4"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm">
            <p className="text-muted-foreground">{t("copyright")}</p>
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground hover:underline decoration-2 decoration-brand underline-offset-4 transition-colors"
            >
              {t("privacy")}
            </Link>
            <p className="text-muted-foreground">
              {t.rich("license", {
                link: (chunks) => (
                  <a
                    href="https://www.gnu.org/licenses/lgpl-3.0.html"
                    target="_blank"
                    rel="noopener"
                    className="hover:text-foreground transition-colors underline underline-offset-4"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Outlined wordmark along the floor, stroked in the logo gradient —
          solana.com's footer signature. Decorative; the brand row carries
          the link. */}
      <svg aria-hidden viewBox="0 0 1000 190" className="mt-16 block w-full select-none" preserveAspectRatio="xMidYMax meet">
        <defs>
          <linearGradient id="footer-wordmark" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--brand-2)" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="footer-wordmark-fade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0.15" />
          </linearGradient>
          <mask id="footer-wordmark-mask">
            <rect width="1000" height="190" fill="url(#footer-wordmark-fade)" />
          </mask>
        </defs>
        <text
          x="500"
          y="210"
          textAnchor="middle"
          fontSize="250"
          fontWeight="500"
          letterSpacing="-12"
          fill="none"
          stroke="url(#footer-wordmark)"
          strokeWidth="1.25"
          mask="url(#footer-wordmark-mask)"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Parallax
        </text>
      </svg>
    </footer>
  )
}
