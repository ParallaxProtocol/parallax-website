import { Hairline } from "@/components/fade-in"
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
    <footer className="relative w-full">
      <Hairline />

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
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
              <span className="text-lg font-semibold font-sans text-foreground">
                Parallax
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t("tagline")}
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-medium font-mono uppercase tracking-[0.15em] text-foreground mb-4">
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
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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

        <div className="mt-12 pt-8">
          <Hairline className="mb-8" />

          <div className="flex items-center justify-center gap-2 mb-6">
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

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">{t("copyright")}</p>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t("privacy")}
            </Link>
            <p className="text-sm text-muted-foreground">
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
    </footer>
  )
}
