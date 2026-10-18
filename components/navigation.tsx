"use client"

import { Button } from "@/components/ui/button"
import { useArrival } from "@/hooks/useArrival"
import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import {
  ArrowUpRight,
  BookOpen,
  CircleHelp,
  Code2,
  Cpu,
  FileText,
  Gauge,
  Globe2,
  Heart,
  Activity,
  Landmark,
  Layers,
  Menu,
  Newspaper,
  Pickaxe,
  Rocket,
  ScrollText,
  Search,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
  Bitcoin,
  Scale,
  type LucideIcon,
} from "lucide-react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { FaGithub } from "react-icons/fa"
import LanguageSwitcher from "./language-switcher"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu"

type NavLink = { key: string; href: string; icon: LucideIcon; external?: boolean }
type NavMenu = { key: string; columns: 1 | 2; items: NavLink[] }

// The five menus, mirrored by the footer. Order within a menu runs from the
// most to the least common reason to open it.
const menus: NavMenu[] = [
  {
    key: "learn",
    columns: 2,
    items: [
      { key: "howItWorks", href: "/introduction/how-it-works", icon: Layers },
      { key: "compare", href: "/compare", icon: Scale },
      { key: "bitcoiners", href: "/introduction/parallax-for-bitcoiners", icon: Bitcoin },
      { key: "developers", href: "/introduction/parallax-for-developers", icon: Code2 },
      { key: "verify", href: "/introduction/verify", icon: ShieldCheck },
      { key: "doctrine", href: "/introduction/doctrine", icon: ScrollText },
      { key: "whitepaper", href: "/parallax.pdf", icon: FileText, external: true },
      { key: "faq", href: "/faq", icon: CircleHelp },
    ],
  },
  {
    key: "use",
    columns: 1,
    items: [
      { key: "gettingStarted", href: "/introduction/getting-started", icon: Rocket },
      { key: "parallaxWallet", href: "/parallax-wallet", icon: Wallet },
      { key: "wallets", href: "/wallets", icon: Smartphone },
      { key: "exchanges", href: "/exchanges", icon: Landmark },
    ],
  },
  {
    key: "run",
    columns: 1,
    items: [
      { key: "client", href: "/parallax-client", icon: Cpu },
      { key: "hashwarp", href: "/hashwarp", icon: Gauge },
      { key: "mining", href: "/participate/mining", icon: Pickaxe },
    ],
  },
  {
    key: "network",
    columns: 1,
    items: [
      { key: "explorer", href: "https://explorer.parallaxprotocol.org", icon: Search, external: true },
      { key: "status", href: "https://status.parallaxprotocol.org", icon: Activity, external: true },
      { key: "atlas", href: "/resources/network-atlas", icon: Globe2 },
      { key: "docs", href: "https://docs.parallaxprotocol.org", icon: BookOpen, external: true },
    ],
  },
  {
    key: "community",
    columns: 1,
    items: [
      { key: "getInvolved", href: "/resources/community", icon: Heart },
      { key: "blog", href: "/blog", icon: Newspaper },
    ],
  },
]

// Root-level static assets (the whitepaper PDF) and other sites bypass the
// locale-prefixing i18n Link.
function linkProps(item: NavLink) {
  return item.external ? { href: item.href, target: "_blank", rel: "noopener" } : { href: item.href }
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const t = useTranslations("nav")

  useEffect(() => {
    const b = document.body
    if (isOpen) {
      b.style.overflow = "hidden"
      b.style.touchAction = "none"
    } else {
      b.style.overflow = ""
      b.style.touchAction = ""
    }
    return () => {
      b.style.overflow = ""
      b.style.touchAction = ""
    }
  }, [isOpen])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const showBg = scrolled || isOpen
  const isHome = pathname === "/"
  // Landing on the homepage, the nav comes in last, after the hero's
  // entrance. Fixed at mount: the nav stays mounted across navigations, and
  // later visits to the homepage (which skip the entrance) shouldn't hide it.
  const arriving = useArrival()
  const [entersAfterHero] = useState(isHome && arriving)
  const heroOverlay = isHome && !scrolled && !isOpen

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 border-b transition-colors duration-200",
        showBg
          ? "bg-background/85 backdrop-blur-xl border-hairline"
          : "bg-transparent border-transparent",
        heroOverlay && "nav-hero-overlay",
        entersAfterHero && "enter-fade"
      )}
      style={entersAfterHero ? ({ "--enter-delay": "4.35s" } as React.CSSProperties) : undefined}
    >
      <div className="flex h-full items-center mx-auto max-w-[90rem] px-5 md:px-6 justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="cursor-pointer flex items-center gap-3">
            <Image
              src="/new_parallax_logo_transparent.svg"
              className="size-8 w-auto"
              width={200}
              height={200}
              alt="Parallax Logo"
              priority
            />
            <span className="hidden xl:inline text-[30px] leading-none font-medium tracking-[-0.04em]">
              Parallax
            </span>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden lg:block">
          <NavigationMenu viewport={false} delayDuration={0}>
            <NavigationMenuList>
              {menus.map((menu) => (
                <NavigationMenuItem key={menu.key}>
                  <NavigationMenuTrigger>{t(`menus.${menu.key}` as "menus.learn")}</NavigationMenuTrigger>
                  <NavigationMenuContent className={cn("p-2", menu.columns === 2 ? "md:w-[40rem]" : "md:w-[22rem]")}>
                    <ul className={cn("grid gap-0.5", menu.columns === 2 && "grid-cols-2")}>
                      {menu.items.map((item) => (
                        <li key={item.key}>
                          <MenuItem item={item} title={t(`items.${item.key}.title` as "items.faq.title")} description={t(`items.${item.key}.description` as "items.faq.description")} />
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
            <div className="flex items-center gap-2 ml-6">
              <Button variant="brand" size="sm" className="h-9 px-4" asChild>
                <Link href={"/introduction/getting-started"}>
                  {t("getStarted")}
                </Link>
              </Button>
              <Button variant="outline" size="icon" className="size-9" asChild>
                <a href={'https://github.com/ParallaxProtocol/parallax'} target="_blank" rel="noopener" aria-label="GitHub">
                  <FaGithub />
                </a>
              </Button>
              <LanguageSwitcher heroOverlay={heroOverlay} />
            </div>
          </NavigationMenu>
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsOpen((v) => !v)}
            className="ml-4"
          >
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile sheet via portal */}
      {typeof window !== "undefined" && isOpen &&
        createPortal(
          <div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            className="fixed inset-x-0 top-16 bottom-0 lg:hidden z-50 bg-background overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="mx-auto max-w-2xl px-5 pt-4 pb-24">
              {menus.map((menu, i) => (
                <motion.section
                  key={menu.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="border-b border-hairline py-5"
                >
                  <p className="tag mb-3 px-3">{t(`menus.${menu.key}` as "menus.learn")}</p>
                  <ul className="grid gap-0.5 sm:grid-cols-2">
                    {menu.items.map((item) => {
                      const Comp = item.external ? "a" : Link
                      const active = !item.external && item.href === pathname
                      return (
                        <li key={item.key}>
                          <Comp
                            {...linkProps(item)}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-base text-foreground/85 transition-colors hover:bg-foreground/5 hover:text-foreground",
                              active && "bg-foreground/5 text-foreground"
                            )}
                          >
                            <item.icon className={cn("size-4 shrink-0", active ? "text-brand" : "text-muted-foreground")} strokeWidth={1.75} />
                            {t(`items.${item.key}.title` as "items.faq.title")}
                            {item.external && <ArrowUpRight className="ml-auto size-3.5 text-muted-foreground" />}
                          </Comp>
                        </li>
                      )
                    })}
                  </ul>
                </motion.section>
              ))}

              <div className="mt-6 flex flex-col gap-3 px-3">
                <Button variant="brand" asChild>
                  <Link href="/introduction/getting-started" onClick={() => setIsOpen(false)}>{t("getStarted")}</Link>
                </Button>
                <LanguageSwitcher mobile />
              </div>
            </div>
          </div>,
          document.body
        )}
    </nav>
  )
}

/* A dropdown entry: a bare outline icon, the title, and one line on what
   the page is for — the shape of solana.com's menus. */
function MenuItem({ item, title, description }: { item: NavLink; title: string; description: string }) {
  const Comp = item.external ? "a" : Link
  return (
    <NavigationMenuLink asChild>
      <Comp {...linkProps(item)} className="!flex-row items-start gap-3 rounded-lg p-3">
        <item.icon className="mt-0.5 size-[18px] shrink-0 text-muted-foreground transition-colors group-hover/navlink:text-brand" strokeWidth={1.5} />
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            {title}
            {item.external && <ArrowUpRight className="size-3 text-muted-foreground" />}
          </span>
          <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">{description}</span>
        </span>
      </Comp>
    </NavigationMenuLink>
  )
}
