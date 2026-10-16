"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname, useRouter } from "@/i18n/navigation"
import { localeNames, routing, type Locale } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { Check, Languages } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useTransition } from "react"

type Props = {
  heroOverlay?: boolean
  mobile?: boolean
}

export default function LanguageSwitcher({ heroOverlay, mobile }: Props) {
  const t = useTranslations("languageSwitcher")
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function switchLocale(next: Locale) {
    if (next === locale) return
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  // Nothing to switch between while only one locale is enabled.
  if (routing.locales.length < 2) return null

  if (mobile) {
    return (
      <div className="flex flex-col gap-1">
        <span className="px-3 text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground">
          {t("label")}
        </span>
        <div className="flex flex-col">
          {routing.locales.map((l) => (
            <button
              key={l}
              disabled={isPending}
              onClick={() => switchLocale(l)}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-base font-medium text-accent-foreground/80 hover:text-foreground hover:bg-muted transition-colors cursor-pointer",
                l === locale && "text-brand",
              )}
            >
              <span>{localeNames[l]}</span>
              {l === locale && <Check className="size-4" />}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={heroOverlay ? "ghost" : "secondary"}
          size="icon"
          aria-label={t("label")}
          className={cn(heroOverlay && "text-white [&_*]:text-white hover:bg-white/10")}
          style={heroOverlay ? { border: "1px solid rgba(255,255,255,0.15)" } : undefined}
        >
          <Languages className="size-4" />
          <span className="sr-only">{t("label")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((l) => (
          <DropdownMenuItem
            key={l}
            disabled={isPending}
            onSelect={() => switchLocale(l)}
            className={cn(
              "flex items-center justify-between gap-4 cursor-pointer",
              l === locale && "text-brand",
            )}
          >
            <span>{localeNames[l]}</span>
            {l === locale && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
