import { Link } from "@/i18n/navigation"
import { LineChart } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { FooterWordmark } from "./footer-wordmark"

type InternalLink = { key: string; href: string }
type ExternalLink = { key: string; href: string; external: true }
type FooterLink = InternalLink | ExternalLink

// Mirrors the main navigation's five menus, plus the brand assets that only
// live here; the social links sit with Community.
const footerLinks: Record<string, FooterLink[]> = {
  learn: [
    { key: "howItWorks", href: "/introduction/how-it-works" },
    { key: "compare", href: "/compare" },
    { key: "bitcoiners", href: "/introduction/parallax-for-bitcoiners" },
    { key: "developers", href: "/introduction/parallax-for-developers" },
    { key: "verify", href: "/introduction/verify" },
    { key: "doctrine", href: "/introduction/doctrine" },
    { key: "whitepaper", href: "/parallax.pdf", external: true },
    { key: "faq", href: "/faq" },
  ],
  use: [
    { key: "gettingStarted", href: "/introduction/getting-started" },
    { key: "parallaxWallet", href: "/parallax-wallet" },
    { key: "wallets", href: "/wallets" },
    { key: "exchanges", href: "/exchanges" },
  ],
  run: [
    { key: "client", href: "/parallax-client" },
    { key: "hashwarp", href: "/hashwarp" },
    { key: "mining", href: "/participate/mining" },
  ],
  network: [
    { key: "blockExplorer", href: "https://explorer.parallaxprotocol.org", external: true },
    { key: "networkStatus", href: "https://status.parallaxprotocol.org", external: true },
    { key: "networkAtlas", href: "/resources/network-atlas" },
    { key: "docs", href: "https://docs.parallaxprotocol.org", external: true },
  ],
  community: [
    { key: "getInvolved", href: "/resources/community" },
    { key: "blog", href: "/blog" },
    { key: "brandAssets", href: "/resources/branding" },
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
                className="size-8 w-auto dark:hidden"
                alt="Parallax logo"
                width={200}
                height={200}
              />
              <Image
                src="/new_parallax_logo_square_white.svg"
                className="size-8 w-auto hidden dark:block"
                alt="Parallax logo"
                width={200}
                height={200}
              />
              <span className="text-[30px] leading-none font-medium tracking-[-0.04em] text-foreground">
                Parallax
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs sm:text-right">
              {t("tagline")}
            </p>
        </div>

        <div className="grid grid-cols-2 gap-10 pt-12 sm:grid-cols-3 lg:grid-cols-5">

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {t(`sections.${section}` as "sections.learn")}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => {
                  const label = t(`links.${link.key}` as "links.faq")
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

      {/* Contour wordmark along the floor, lit by the cursor — solana.com's
          footer signature, in the logo gradient. Decorative. */}
      <FooterWordmark />
    </footer>
  )
}
