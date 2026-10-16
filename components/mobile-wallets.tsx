'use client'
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { wallets } from "@/lib/wallets"
import { ArrowRight } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { FadeIn } from "./fade-in"
import { TwoToneTitle } from "./section"

const mobileWallets = wallets.filter((w) => w.mobile !== false)

/* The phone-side answer to the desktop wallet above it: a slim band with
   the mobile wallets that already work with Parallax drifting past. */
export function MobileWallets() {
  const t = useTranslations("home.mobileWallets")

  return (
    <section data-band className="relative border-b border-hairline">
      <div className="mx-auto max-w-[90rem] px-5 pt-20 md:px-10 md:pt-24">
        <FadeIn>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="tag mb-6">{t("eyebrow")}</p>
              <h2 className="text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl">
                <TwoToneTitle text={t("heading")} />
              </h2>
            </div>
            <div className="flex flex-col items-start gap-6 lg:col-span-4 lg:col-start-9">
              <p className="accent-rule pl-6 text-base text-muted-foreground text-pretty sm:text-lg">{t("subtitle")}</p>
              <Button variant="outline" asChild>
                <Link href="/wallets">
                  {t("cta")}
                  <ArrowRight className="text-brand" />
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Full-bleed logo strip */}
      <div className="marquee mt-14 pb-20 md:pb-24">
        <ul className="marquee-track gap-4 px-2">
          {[...mobileWallets, ...mobileWallets].map((wallet, i) => (
            <li key={`${wallet.name}-${i}`} aria-hidden={i >= mobileWallets.length || undefined}>
              <a
                href={wallet.url}
                target="_blank"
                rel="noopener"
                tabIndex={i >= mobileWallets.length ? -1 : undefined}
                className="flex h-16 items-center gap-3 rounded-full border border-stroke bg-card pr-6 pl-2.5 text-[15px] font-medium whitespace-nowrap text-foreground transition-colors hover:border-foreground/25 hover:bg-foreground/[0.05]"
              >
                <Image src={wallet.image} alt="" width={88} height={88} className="size-11 rounded-full" />
                {wallet.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
