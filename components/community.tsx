'use client'
import { useTranslations } from "next-intl"
import { FaBitcoin, FaDiscord, FaGithub, FaReddit, FaTelegram, FaXTwitter } from "react-icons/fa6"
import { FadeIn } from "./fade-in"
import { Section, SectionHeading } from "./section"

const channels = [
  { name: "GitHub", href: "https://github.com/ParallaxProtocol", icon: FaGithub },
  { name: "BitcoinTalk", href: "https://bitcointalk.org/index.php?topic=5560698", icon: FaBitcoin },
  { name: "X / Twitter", href: "https://x.com/prlxchain", icon: FaXTwitter },
  { name: "Discord", href: "https://discord.gg/4Z4R3aAU3B", icon: FaDiscord },
  { name: "Telegram", href: "https://t.me/parallaxchain", icon: FaTelegram },
  { name: "Reddit", href: "https://reddit.com/r/parallaxprotocol", icon: FaReddit },
]

export function Community() {
  const t = useTranslations("home.community")
  return (
    <Section className="border-b-0">
      <FadeIn>
        <SectionHeading index="07" eyebrow={t("eyebrow")} title={t("heading")} />
      </FadeIn>

      {/* Two concept cells */}
      <FadeIn delay={0.1}>
        <div className="mt-16 grid grid-cols-1 overflow-hidden rounded-2xl border border-stroke sm:grid-cols-2">
          <div className="p-8">
            <FaGithub className="size-7 text-foreground" />
            <h3 className="mt-10 text-2xl text-foreground">{t("openSource.title")}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {t("openSource.description")}
            </p>
          </div>
          <div className="border-t border-hairline p-8 sm:border-t-0 sm:border-l">
            <FaBitcoin className="size-7 text-foreground" />
            <h3 className="mt-10 text-2xl text-foreground">{t("communityDriven.title")}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {t("communityDriven.description")}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Community CTA */}
      <FadeIn delay={0.2}>
        <div className="relative mt-4 overflow-hidden rounded-2xl border border-stroke bg-card p-8 sm:p-12">
          <div aria-hidden className="aurora" />
          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-5">
              <h3 className="text-4xl leading-tight text-foreground sm:text-5xl">{t("join.title")}</h3>
              <p className="mt-4 max-w-md text-lg text-muted-foreground">{t("join.description")}</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-7 lg:justify-end">
              {channels.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.href}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex h-11 items-center gap-2.5 whitespace-nowrap rounded-full border border-stroke bg-background/40 px-5 text-[15px] font-medium text-foreground backdrop-blur-sm transition-colors hover:border-foreground/30 hover:bg-foreground/10"
                >
                  <channel.icon className="size-4 shrink-0" />
                  {channel.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </Section>
  )
}
