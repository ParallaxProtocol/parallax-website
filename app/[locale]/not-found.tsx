"use client"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"

/* 404 after solana.com: the status code set huge in a light weight,
   a two-tone heading and a white pill home, over the aurora glow. */
export default function NotFound() {
  const t = useTranslations("notFound")
  const [lead, ...tail] = t("title").split(" ")
  return (
    <section className="relative mt-16 overflow-hidden border-b border-hairline">
      <div aria-hidden className="aurora" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-[90rem] flex-col justify-center px-5 py-20 md:px-10 md:py-28">
        <p
          aria-hidden
          className="select-none text-[clamp(8rem,30vw,24rem)] font-extralight leading-[0.8] tracking-[-0.07em] text-foreground"
        >
          {t("label")}
        </p>

        <div className="mt-14 grid gap-10 border-t border-hairline pt-10 md:mt-20 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="tag">
              <span aria-hidden className="size-1.5 rounded-full bg-brand" />
              {t("label")}
            </p>
            <h1 className="mt-6 text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl lg:text-6xl">
              {/* Short title: the lead word medium, the rest light, on one line. */}
              {lead} <span className="font-light">{tail.join(" ")}</span>
            </h1>
          </div>
          <div className="flex flex-col items-start gap-8 lg:col-span-5 lg:pb-1">
            <p className="accent-rule max-w-md pl-6 text-lg text-muted-foreground text-pretty">
              {t("description")}
            </p>
            <Button variant="brand" size="lg" asChild>
              <Link href="/">
                {t("back")}
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
