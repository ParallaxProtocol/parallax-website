"use client"

import { Button } from "@/components/ui/button"
import { Link, usePathname } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Menu, Moon, Sun, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
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
import { Separator } from "./ui/separator"

type SubItem = { name: string; href?: string; badge?: string }
type NavItem = { name: string; href?: string; subItems?: SubItem[] }

function useNavItems(): NavItem[] {
  const t = useTranslations("nav")
  const tCommon = useTranslations("common")
  const badgeNew = tCommon("new")

  return [
    {
      name: t("introduction"),
      subItems: [
        { name: t("introductionSub.doctrine"), href: "/introduction/doctrine" },
        { name: t("introductionSub.howItWorks"), href: "/introduction/how-it-works" },
        { name: t("introductionSub.compare"), href: "/compare" },
        { name: t("introductionSub.bitcoiners"), href: "/introduction/parallax-for-bitcoiners" },
        { name: t("introductionSub.developers"), href: "/introduction/parallax-for-developers" },
        { name: t("introductionSub.verify"), href: "/introduction/verify" },
        { name: t("introductionSub.whitepaper"), href: "/parallax.pdf" },
        { name: t("introductionSub.gettingStarted"), href: "/introduction/getting-started" },
      ],
    },
    {
      name: t("resources"),
      subItems: [
        { name: t("resourcesSub.beginnerGuides"), href: "/resources/beginner-guides" },
        { name: t("resourcesSub.technicalDocumentation"), href: "/resources/technical-documentation" },
        { name: t("resourcesSub.parallaxClient"), href: "/resources/parallax-client" },
        { name: t("resourcesSub.wallets"), href: "/wallets" },
        { name: t("resourcesSub.exchanges"), href: "/exchanges" },
        { name: t("resourcesSub.community"), href: "/resources/community" },
        { name: t("resourcesSub.brandAssets"), href: "/resources/branding" },
        { name: "###" },
        { name: t("resourcesSub.blockExplorer"), href: "https://explorer.parallaxprotocol.org" },
        { name: t("resourcesSub.networkAtlas"), href: "/resources/network-atlas" },
        { name: t("resourcesSub.networkStatus"), href: "https://status.parallaxprotocol.org" },
      ],
    },
    {
      name: t("participate"),
      subItems: [
        { name: t("participateSub.supportParallax"), href: "/participate/support-parallax" },
        { name: t("participateSub.runningAFullNode"), href: "/participate/running-a-full-node" },
        { name: t("participateSub.mining"), href: "/participate/mining" },
        { name: t("participateSub.development"), href: "/participate/development" },
      ],
    },
    { name: t("blog"), href: "/blog" },
    { name: t("faq"), href: "/faq" },
  ]
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const t = useTranslations("nav")
  const navItems = useNavItems()

  useEffect(() => { setMounted(true) }, [])

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
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const showBg = scrolled || isOpen
  const isHome = pathname === "/"
  const heroOverlay = isHome && !scrolled && !isOpen

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 border-b transition-colors duration-200",
        showBg
          ? "bg-background/85 backdrop-blur-xl border-hairline"
          : "bg-transparent border-transparent",
        heroOverlay && "nav-hero-overlay"
      )}
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
            <span className="hidden lg:inline text-[30px] leading-none font-medium tracking-[-0.04em]">
              Parallax
            </span>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:block">
          <NavigationMenu viewport={false} delayDuration={0}>
            <NavigationMenuList>
              {navItems.map((item) =>
                item.subItems ? (
                  <NavigationMenuItem key={`desk_${item.name}`}>
                    <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
                    <NavigationMenuContent className="min-w-[15rem]">
                      {item.subItems.map((sub, i) => {
                        if (sub.name === "###") {
                          return (
                            <Separator
                              className="bg-hairline my-1.5"
                              key={`desk_sub_${i}`}
                            />
                          )
                        }

                        return (
                          <ListItem
                            key={`desk_sub_${item.name}_${sub.name}`}
                            href={sub.href ?? "#"}
                            title={sub.name}
                            badge={sub.badge}
                          />
                        )
                      })}
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={`desk_${item.name}`}>
                    <NavigationMenuLink asChild className="h-9 justify-center rounded-full px-3.5 text-[15px] text-foreground/80 hover:bg-transparent hover:text-foreground focus:bg-transparent">
                      <Link href={item.href ?? "#"}>{item.name}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
            <div className="flex items-center gap-2 ml-8">
              <Button variant="brand" size="sm" className="h-9 px-4" asChild>
                <Link href={"/introduction/getting-started"}>
                  {t("getStarted")}
                </Link>
              </Button>
              <Button variant="outline" size="icon" className="size-9" asChild>
                <a href={'https://github.com/ParallaxProtocol/parallax'} target="_blank" rel="noopener">
                  <FaGithub />
                </a>
              </Button>
              <LanguageSwitcher heroOverlay={heroOverlay} />
              <Button
                variant="outline"
                size="icon"
                className="size-9"
                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                <Moon className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                <span className="sr-only">{t("toggleTheme")}</span>
              </Button>
            </div>
          </NavigationMenu>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsOpen((v) => !v)}
            className="ml-4 inline-flex items-center justify-center"
          >
            {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Sheet via Portal */}
      {typeof window !== "undefined" && isOpen &&
        createPortal(
          <>
            <div
              id="mobile-nav"
              role="dialog"
              aria-modal="true"
              className="fixed inset-x-0 top-16 bottom-0 md:hidden z-50 bg-background overflow-y-auto overscroll-contain"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className="mx-auto pb-20 max-w-6xl px-4 sm:px-6 lg:px-8 py-3">
                {navItems.map((item) =>
                  item.subItems ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col gap-0"
                      key={`mob_${item.name}`}
                    >
                      <div className="mb-2">
                        <div className="flex items-center gap-2 px-3 py-2 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          {item.name}
                        </div>
                        <div className="flex pl-4 flex-col">
                          {item.subItems.map((sub, i) => {
                            if (sub.name === "###") {
                              return (
                                <Separator
                                  className="bg-hairline my-1.5 ml-2"
                                  key={`desk_sub_${i}`}
                                />
                              )
                            }

                            return (
                              <Link
                                key={`mob_sub_${item.name}_${sub.name}`}
                                href={sub.href ?? "#"}
                                className={cn("ml-2 px-4 py-2 text-base text-foreground/75 hover:text-foreground transition-colors border-l border-hairline flex items-center justify-between", {
                                  "text-foreground border-brand": sub.href === pathname,
                                })}
                                onClick={() => setIsOpen(false)}
                              >
                                {sub.name}
                                {sub.badge && (
                                  <span className="inline-flex rounded-full bg-brand-muted px-2 py-0.5 text-[10px] font-mono font-medium leading-none text-brand uppercase">
                                    {sub.badge}
                                  </span>
                                )}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <Link
                      key={`mob_${item.name}`}
                      href={item.href ?? "#"}
                      className={cn("flex items-center gap-2 px-3 py-2 text-xl font-medium text-foreground hover:text-foreground/80 transition-colors", {
                        "text-brand": item.href === pathname,
                      })}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                )}

                {/* Language + Theme toggle */}
                <div className="mt-6 px-3 flex flex-col gap-3">
                  <Separator className="mb-1" />
                  <LanguageSwitcher mobile />
                  <button
                    className="flex items-center gap-3 px-3 py-2 text-base font-medium text-accent-foreground cursor-pointer"
                    onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  >
                    {mounted && resolvedTheme === 'dark' ? <Sun className="size-5 shrink-0" /> : <Moon className="size-5 shrink-0" />}
                    <span>{mounted && resolvedTheme === 'dark' ? t("lightMode") : t("darkMode")}</span>
                  </button>
                </div>
              </div>
            </div>
          </>,
          document.body
        )}
    </nav>
  )
}

function ListItem({
  title,
  children,
  href,
  badge,
}: React.ComponentPropsWithoutRef<"li"> & { href: string; badge?: string }) {
  // Root-level static assets (e.g. the whitepaper PDF) must bypass the
  // locale-prefixing i18n Link.
  const isExternal = href.startsWith("http") || href.endsWith(".pdf")
  const LinkComponent = isExternal ? "a" : Link
  const linkProps = isExternal
    ? { href, target: "_blank", rel: "noopener" }
    : { href }

  return (
    <NavigationMenuLink asChild>
      <LinkComponent
        {...linkProps}
        className={cn({
          "text-foreground/50 pointer-events-none": href === "#",
        })}
      >
        <div className="text-sm leading-none font-medium flex items-center justify-between gap-2">
          <span>{title}</span>
          {badge && (
            <span className="rounded-full bg-brand-muted px-2 py-0.5 text-[10px] font-mono font-medium leading-none text-brand uppercase inline-block">
              {badge}
            </span>
          )}
        </div>
        <p className={"text-muted-foreground line-clamp-2 text-sm leading-snug"}>
          {children}
        </p>
      </LinkComponent>
    </NavigationMenuLink>
  )
}
