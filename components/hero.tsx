'use client'
import { useStableVh } from "@/hooks/useStableVh"
import { Link } from "@/i18n/navigation"
import { Button } from "./ui/button"
import { useRef } from "react"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { DepthWordmark } from "./depth-wordmark"

/* The entrances are CSS animations (see "Entrance animations" in
   globals.css), not framer-motion: the h1 and subtitle are the homepage's
   LCP candidates and must paint from the SSR HTML, before hydration. */
export function Hero() {
  useStableVh()
  const containerRef = useRef<HTMLElement>(null)
  const t = useTranslations("home.hero")

  return (
    <section
      ref={containerRef}
      className="relative isolate overflow-hidden
                  min-h-[calc(var(--vh,1vh)*100)]
                  pt-[env(safe-area-inset-top)]
                  pb-[env(safe-area-inset-bottom)]
                  bg-black on-dark-surface border-b border-hairline"
    >
      {/* A faint glow in the logo's colours, low on the right — the only
          light behind the wordmark. */}
      <div aria-hidden className="aurora opacity-80" />

      {/* Content */}
      <div className="relative z-[3] mx-auto flex min-h-[calc(var(--vh,1vh)*100)] w-full max-w-[90rem] flex-col justify-center px-5 pt-28 pb-16 md:px-10 lg:pb-24">
        <div>
          {/* The name as the depth wordmark, across the full content width. The svg renders on the server,
              so it paints before hydration like the text it replaces; the
              h1 keeps the word for assistive tech and search. */}
          <h1
            className="enter-fade-up"
            style={{ "--enter-delay": "0.1s" } as React.CSSProperties}
          >
            <span className="sr-only">Parallax</span>
            <DepthWordmark variant="hero" area="section" className="w-full" />
          </h1>
          <p
            className="mt-6 max-w-2xl text-[1.75rem] font-light leading-[1.1] tracking-[-0.03em] text-white text-balance sm:text-4xl lg:text-5xl enter-fade-up"
            style={{ "--enter-delay": "0.25s" } as React.CSSProperties}
          >
            {t("subtitle")}
          </p>
        </div>

        <div
          className="mt-10 flex flex-col gap-3 sm:flex-row lg:mt-12 enter-fade"
          style={{ "--enter-delay": "0.6s" } as React.CSSProperties}
        >
          <Button size="xl" variant="brand" className="w-full sm:w-auto" asChild>
            <Link href={"/resources/parallax-client"}>
              {t("runNode")}
              <ArrowRight />
            </Link>
          </Button>
          <Button size="xl" variant="outline" className="w-full sm:w-auto" asChild>
            <a href={"https://docs.parallaxprotocol.org"} target="_blank" rel="noopener">
              {t("readDocs")}
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
