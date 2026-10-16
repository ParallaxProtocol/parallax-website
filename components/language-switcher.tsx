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
  // Still passed by the navigation; the outline icon button reads on every
  // background, so it no longer changes the styling.
  heroOverlay?: boolean
  mobile?: boolean
}

export default function LanguageSwitcher({ mobile }: Props) {
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
        <span className="tag px-3">
          {t("label")}
        </span>
        <div className="flex flex-col gap-1">
          {routing.locales.map((l) => (
            <button
              key={l}
              disabled={isPending}
              onClick={() => switchLocale(l)}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-colors cursor-pointer",
                l === locale && "bg-foreground/5 text-foreground",
              )}
            >
              <span>{localeNames[l]}</span>
              {l === locale && <Check className="size-4 text-brand" />}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="size-9" aria-label={t("label")}>
          <Languages className="size-4" />
          <span className="sr-only">{t("label")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-44">
        {routing.locales.map((l) => (
          <DropdownMenuItem
            key={l}
            disabled={isPending}
            onSelect={() => switchLocale(l)}
            className={cn(
              "flex items-center justify-between gap-4 cursor-pointer px-3 py-2 text-sm",
              l === locale && "text-foreground",
            )}
          >
            <span>{localeNames[l]}</span>
            {l === locale && <Check className="size-4 text-brand" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
