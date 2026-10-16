'use client'
import { useStableVh } from "@/hooks/useStableVh"
import { Link } from "@/i18n/navigation"
import { Button } from "./ui/button"
import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"

const BlackHoleVisualization = dynamic(() => import("./black-hole"), { ssr: false })

/* The entrances are CSS animations (see "Entrance animations" in
   globals.css), not framer-motion: the h1 and subtitle are the homepage's
   LCP candidates and must paint from the SSR HTML, before hydration. */
export function Hero() {
  useStableVh()
  const containerRef = useRef<HTMLElement>(null)
  const t = useTranslations("home.hero")

  // Mount the black hole only once the browser is idle: its chunk eval and
  // scene setup are the page's biggest main-thread block, and mounting it at
  // hydration stalled the entrance animations above it (mobile LCP). Its own
  // 3s bloom fade-in makes the later start imperceptible.
  const [showBlackHole, setShowBlackHole] = useState(false)
  useEffect(() => {
    if (!("requestIdleCallback" in window)) {
      setShowBlackHole(true)
      return
    }
    const id = requestIdleCallback(() => setShowBlackHole(true), { timeout: 2000 })
    return () => cancelIdleCallback(id)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative isolate overflow-hidden
                  min-h-[calc(var(--vh,1vh)*100)]
                  pt-[env(safe-area-inset-top)]
                  pb-[env(safe-area-inset-bottom)]
                  bg-black on-dark-surface border-b border-hairline"
    >
      {/* Black hole — centred behind the copy on small screens, pushed to
          the right half on desktop so the headline owns the left, as on
          solana.com. */}
      <div className="absolute inset-0 lg:left-[32%] lg:-right-[6%]">
        {showBlackHole && <BlackHoleVisualization interactive={false} />}
        {/* Centered in the black hole core */}
        <p
          className="absolute top-1/2 left-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 font-mono text-xs sm:text-sm text-white/40 text-center tracking-[0.25em] uppercase enter-fade"
          style={{ "--enter-delay": "0.8s", animationDuration: "1.2s" } as React.CSSProperties}
        >
          {t("securedByPhysics")}
        </p>
      </div>

      {/* Readability: a vignette on mobile, a left-to-right fade on desktop */}
      <div
        className="absolute inset-0 z-[1] lg:hidden"
        style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.85) 75%)" }}
      />
      <div
        className="absolute inset-0 z-[1] hidden lg:block"
        style={{ background: "linear-gradient(to right, #000 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0) 62%)" }}
      />

      {/* Content */}
      <div className="relative z-[3] mx-auto flex min-h-[calc(var(--vh,1vh)*100)] w-full max-w-[90rem] flex-col justify-between px-5 pt-28 pb-16 md:px-10 lg:justify-center lg:pb-24">
        <div className="max-w-2xl">
          <h1
            className="text-6xl font-medium leading-[0.95] tracking-[-0.045em] text-white sm:text-7xl lg:text-8xl enter-fade-up"
            style={{ "--enter-delay": "0.1s" } as React.CSSProperties}
          >
            Parallax
          </h1>
          <p
            className="mt-3 text-[1.75rem] font-light leading-[1.1] tracking-[-0.03em] text-white text-balance sm:text-4xl lg:text-5xl enter-fade-up"
            style={{ "--enter-delay": "0.25s" } as React.CSSProperties}
          >
            {t("subtitle")}
          </p>
        </div>

        <div
          className="flex flex-col gap-3 sm:flex-row lg:mt-12 enter-fade"
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
