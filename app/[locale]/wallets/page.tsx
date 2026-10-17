import AddNetworkSection from "@/components/add-network-section";
import { CopyButton } from "@/components/copy-button";
import MainMotion from "@/components/main-motion";
import PageHeader from "@/components/page-header";
import { Section, SectionHeading, TwoToneTitle } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { wallets } from "@/lib/wallets";
import { WalletDownloadCta, WalletVersionBadge } from "@/components/wallet-app/wallet-download";
import { ArrowRight, ArrowUpRight, Check, Download, ExternalLink, Fingerprint, KeyRound, Link2, Plus, Smartphone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

const RPC_URL = "https://rpc.parallaxprotocol.org"
const EXPLORER_URL = "https://explorer.parallaxprotocol.org"

/* The values a wallet asks for under "add a custom network". Mirrors
   lib/parallax-network.ts, which the one-click button uses. */
const NETWORK_FIELDS = [
  { key: "name", value: "Parallax" },
  { key: "rpc", value: RPC_URL },
  { key: "chainId", value: "2110" },
  { key: "chainIdHex", value: "0x83E" },
  { key: "currency", value: "LAX" },
  { key: "decimals", value: "18" },
  { key: "explorer", value: EXPLORER_URL },
] as const

const POINTS = [
  { key: "address", icon: Fingerprint },
  { key: "hardware", icon: KeyRound },
  { key: "replay", icon: Link2 },
] as const

export default async function Page() {
  const t = await getTranslations("wallets")
  const features = t.raw("official.features") as string[]

  return (
    <MainMotion>
      <PageHeader title={t("title")} subTitle={t("subtitle")} />

      {/* Choosing a wallet + the settings to type in */}
      <Section>
        <AddNetworkSection />
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="tag mb-6">{t("choose.eyebrow")}</p>
            <h2 className="text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl">
              <TwoToneTitle text={t("choose.heading")} />
            </h2>
            <ul className="mt-10 space-y-8">
              {POINTS.map(({ key, icon: Icon }) => (
                <li key={key} className="grid grid-cols-[auto_1fr] gap-x-5">
                  <span className="flex size-11 items-center justify-center rounded-full border border-stroke">
                    <Icon className="size-5 text-brand" strokeWidth={1.5} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-lg leading-tight text-foreground">{t(`choose.points.${key}.title`)}</h3>
                    <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground">{t(`choose.points.${key}.description`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 lg:col-span-6">
            <div className="overflow-hidden rounded-xl border border-stroke bg-card">
              <div className="flex items-center justify-between gap-4 border-b border-hairline px-4 py-3 sm:px-5">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-foreground">{t("network.label")}</p>
                <span aria-hidden className="font-mono text-xs tracking-[0.2em] text-muted-foreground/50">||||||||</span>
              </div>
              <dl>
                {NETWORK_FIELDS.map(({ key, value }) => (
                  <div key={key} className="flex items-center gap-3 border-b border-hairline py-2 pr-2 pl-4 last:border-b-0 sm:pl-5">
                    <dt className="w-24 shrink-0 font-mono text-[11px] uppercase leading-snug tracking-[0.12em] text-muted-foreground sm:w-40">
                      {t(`network.fields.${key}`)}
                    </dt>
                    <dd className="min-w-0 flex-1 break-all font-mono text-[13px] text-foreground sm:text-sm">{value}</dd>
                    <CopyButton value={value} label={t("network.copy")} copiedLabel={t("network.copied")} />
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{t("network.hint")}</p>
          </div>
        </div>
      </Section>

      {/* The official app */}
      <Section innerClassName="md:py-20">
        <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card">
          <div aria-hidden className="aurora" />
          <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-3">
                <p className="tag">{t("official.eyebrow")}</p>
                <WalletVersionBadge />
              </div>
              <div className="mt-10 flex items-center gap-5">
                <Image src="/new_parallax_logo_rounded.svg" alt="" width={64} height={64} className="size-14 sm:size-16" />
                <h2 className="text-4xl leading-[1.05] text-foreground sm:text-5xl">{t("official.title")}</h2>
              </div>
              <p className="mt-6 max-w-xl text-base text-muted-foreground text-pretty sm:text-lg">{t("official.description")}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <WalletDownloadCta className="h-11 px-6" />
                <Button variant="outline" size="lg" asChild>
                  <Link href="/parallax-wallet">
                    {t("official.cta")}
                    <ArrowRight className="text-brand" />
                  </Link>
                </Button>
              </div>
            </div>
            <ul className="space-y-px overflow-hidden rounded-xl border border-stroke bg-hairline lg:col-span-5">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 bg-background/80 px-5 py-4 text-[15px] text-foreground">
                  <Check className="size-4 shrink-0 text-brand" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Third-party wallets */}
      <Section>
        <SectionHeading eyebrow={t("list.eyebrow")} title={t("list.heading")} subtitle={t("list.subtitle")} />
        <ul className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {wallets.map((wallet) => (
            <li key={wallet.name} className="bg-background">
              <a
                href={wallet.url}
                target="_blank"
                rel="noopener"
                aria-label={t("list.getWallet", { name: wallet.name })}
                className="group flex h-full items-center gap-5 p-6 outline-none transition-colors hover:bg-foreground/[0.03] focus-visible:bg-foreground/[0.05] sm:p-7"
              >
                <Image src={wallet.image} alt="" width={112} height={112} className="size-14 shrink-0 rounded-2xl" />
                <div className="min-w-0 flex-1">
                  <p className="text-xl leading-tight text-foreground">{wallet.name}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {wallet.mobile !== false ? (
                      <Badge variant="outline" className="text-muted-foreground"><Smartphone aria-hidden />{t("list.mobile")}</Badge>
                    ) : (
                      <Badge variant="muted">{t("list.desktopOnly")}</Badge>
                    )}
                    {wallet.recommended && <Badge>{t("list.beginnerFriendly")}</Badge>}
                  </div>
                </div>
                <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand motion-reduce:transition-none" aria-hidden />
              </a>
            </li>
          ))}
          <li className="flex items-center gap-5 bg-background p-6 sm:p-7">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-dashed border-stroke">
              <Plus className="size-5 text-muted-foreground" strokeWidth={1.5} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-lg leading-tight text-foreground">{t("list.other.title")}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t("list.other.description")}</p>
            </div>
          </li>
        </ul>
      </Section>

      {/* Privacy: your own node. Runs flush into the footer's rule */}
      <Section className="border-b-0">
        <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card">
          <div aria-hidden className="aurora aurora-left" />
          <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Download className="size-8 text-brand" strokeWidth={1.5} />
              <h2 className="mt-10 text-3xl leading-[1.05] text-foreground text-balance sm:text-4xl lg:text-5xl"><TwoToneTitle text={t("runClient.eyebrow")} /></h2>
              <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
                {t("runClient.description")}
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:col-span-5 lg:justify-end">
              <Button variant="brand" size="lg" asChild>
                <Link href="/resources/parallax-client">
                  <Download />
                  {t("runClient.download")}
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://docs.parallaxprotocol.org/guides/client/introduction" target="_blank" rel="noopener">
                  {t("runClient.setupGuide")}
                  <ExternalLink />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </MainMotion>
  )
}
