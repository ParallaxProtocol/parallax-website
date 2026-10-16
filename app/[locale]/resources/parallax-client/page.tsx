import ClientDownloadButton from "@/components/client-download-button";
import ClientQuickStart from "@/components/client-quick-start";
import ClientReleases from "@/components/client-releases";
import { FadeIn } from "@/components/fade-in";
import MainMotion from "@/components/main-motion";
import PageHeader from "@/components/page-header";
import { Section, SectionHeading, TwoToneTitle } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { AppWindow, ArrowRight, CircleSlash, Code2, ExternalLink, Eye, Hexagon, Network, TerminalSquare } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { FaApple, FaDocker, FaGithub, FaLinux, FaWindows } from "react-icons/fa";

const SETUP_GUIDE = "https://docs.parallaxprotocol.org/guides/client/setup";
const REPO = "https://github.com/ParallaxProtocol/parallax";
const DOCKER_HUB = "https://hub.docker.com/r/parallaxprotocol/parallax";

const DOCKER_RUN = `docker run -d --name parallax \\
  -v parallax-data:/home/parallax/.parallax \\
  -p 32110:32110 -p 32110:32110/udp \\
  parallaxprotocol/parallax node`;
const DOCKER_STOP = "docker stop -t 60 parallax";

const whyItems = [
  { key: "verify", icon: Eye },
  { key: "privacy", icon: Hexagon },
  { key: "network", icon: Network },
  { key: "build", icon: Code2 },
] as const;

/* The release archive's programs (parallax's README, "Executables"), each
   with a command that shows what it's for. */
const binaries = [
  { name: "parallaxd", example: "parallaxd" },
  { name: "parallax-cli", example: "parallax-cli info" },
  { name: "parallax-wallet", example: "parallax-wallet signmessage" },
  { name: "parallax", example: "parallax rpc info" },
] as const;

const hardware = [
  { key: "cpu", min: "cpuMin", rec: "cpuRec" },
  { key: "ram", min: "ramMin", rec: "ramRec" },
  { key: "storage", min: "storageMin", rec: "storageRec" },
  { key: "network", min: "networkMin", rec: "networkRec" },
] as const;

const platforms = [
  { key: "linux", label: "Linux", icon: FaLinux },
  { key: "macos", label: "macOS", icon: FaApple },
  { key: "windows", label: "Windows", icon: FaWindows },
] as const;

export default async function ParallaxClientPage() {
  const t = await getTranslations("resources.parallaxClient");

  return (
    <MainMotion>
      <PageHeader title={t("title")} subTitle={t("subtitle")}>
        <div className="flex flex-col gap-8 enter-fade-up" style={{ "--enter-delay": "0.35s" } as React.CSSProperties}>
          <div className="flex flex-wrap items-start gap-3">
            <ClientDownloadButton align="start" />
            <Button variant="outline" size="lg" asChild>
              <a href={SETUP_GUIDE} target="_blank" rel="noopener">
                {t("header.setupGuide")}
                <ExternalLink />
              </a>
            </Button>
          </div>
          <Link href="/parallax-wallet" className="group inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-muted-foreground">
            <AppWindow className="size-4 text-brand" strokeWidth={1.5} aria-hidden />
            {t("header.walletPrompt")}
            <span className="inline-flex items-center gap-2 font-medium text-foreground">
              {t("header.walletLink")}
              <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
            </span>
          </Link>
        </div>
      </PageHeader>

      {/* 01 What a full node does */}
      <Section>
        <FadeIn>
          <SectionHeading index="01" eyebrow={t("fullNode.eyebrow")} title={t("fullNode.heading")} subtitle={t("fullNode.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-16 grid grid-cols-1 overflow-hidden rounded-2xl border border-stroke sm:grid-cols-2">
            <div className="p-8 sm:p-10">
              <Hexagon className="size-7 text-brand" strokeWidth={1.5} />
              <h3 className="mt-10 text-2xl text-foreground">{t("fullNode.decentralized.heading")}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("fullNode.decentralized.body")}</p>
            </div>
            <div className="border-t border-hairline p-8 sm:border-t-0 sm:border-l sm:p-10">
              <CircleSlash className="size-7 text-brand-2" strokeWidth={1.5} />
              <h3 className="mt-10 text-2xl text-foreground">{t("fullNode.noVoting.heading")}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("fullNode.noVoting.body")}</p>
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <blockquote className="accent-rule mt-20 pl-6 sm:pl-10">
            <p className="max-w-4xl text-2xl font-light leading-snug tracking-[-0.02em] text-foreground text-balance sm:text-4xl">
              {t("fullNode.blockquote")}
            </p>
          </blockquote>
        </FadeIn>
      </Section>

      {/* 02 Why run one */}
      <Section>
        <FadeIn>
          <SectionHeading index="02" eyebrow={t("why.eyebrow")} title={t("why.heading")} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map(({ key, icon: Icon }) => (
              <div key={key} className="bg-background p-6 sm:p-8">
                <Icon className="size-6 text-brand" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-8 text-xl leading-tight text-foreground">{t(`why.items.${key}.title`)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(`why.items.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* 03 What's in the archive */}
      <Section>
        <FadeIn>
          <SectionHeading index="03" eyebrow={t("binaries.eyebrow")} title={t("binaries.heading")} subtitle={t("binaries.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline md:grid-cols-2">
            {binaries.map(({ name, example }) => (
              <div key={name} className="flex flex-col bg-background p-6 sm:p-8">
                <h3 className="font-mono text-xl text-foreground">{name}</h3>
                <p className="mt-3 mb-6 text-[15px] leading-relaxed text-muted-foreground">{t(`binaries.items.${name}`)}</p>
                <p className="mt-auto w-fit rounded-lg border border-hairline bg-foreground/[0.03] px-3 py-2 font-mono text-[13px] text-foreground/85">
                  <span aria-hidden className="select-none text-brand">$ </span>
                  {example}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Hardware */}
        <FadeIn delay={0.15}>
          <div className="mt-4 overflow-hidden rounded-2xl border border-stroke bg-card">
            <h3 className="border-b border-hairline px-6 py-4 text-lg text-foreground sm:px-8">{t("binaries.hardware.heading")}</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {hardware.map(({ key, min, rec }, i) => (
                <div
                  key={key}
                  className={`p-6 sm:p-8 ${i % 2 === 1 ? "border-l border-hairline" : ""} ${i >= 2 ? "border-t border-hairline lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
                >
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{t(`binaries.hardware.${key}`)}</p>
                  <p className="mt-4 text-3xl font-light tracking-[-0.03em] text-foreground">{t(`binaries.hardware.${rec}`)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t("binaries.hardware.recommended")}</p>
                  <p className="mt-4 text-sm text-foreground/80">
                    {t(`binaries.hardware.${min}`)} <span className="text-muted-foreground">· {t("binaries.hardware.minimum")}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* 04 Download */}
      <Section className="border-b-0">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card">
            <div aria-hidden className="aurora" />
            <div className="relative grid gap-10 border-b border-hairline px-8 py-12 sm:px-12 sm:py-16 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="tag mb-6"><span className="text-brand">04</span><span aria-hidden className="text-hairline">/</span>{t("download.eyebrow")}</p>
                <h2 className="text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl">
                  <TwoToneTitle text={t("download.heading")} />
                </h2>
                <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">{t("download.subtitle")}</p>
              </div>
              <div className="flex lg:col-span-5 lg:justify-end">
                <ClientDownloadButton align="start" />
              </div>
            </div>

            <div className="relative grid grid-cols-1 sm:grid-cols-3">
              {platforms.map(({ key, label, icon: Icon }, i) => (
                <div key={key} className={`flex items-center gap-4 px-8 py-6 sm:px-10 ${i > 0 ? "border-t border-hairline sm:border-t-0 sm:border-l" : ""}`}>
                  <Icon className="size-5 shrink-0 text-foreground" aria-hidden />
                  <div>
                    <p className="text-[15px] text-foreground">{label}</p>
                    <p className="font-mono text-xs text-muted-foreground">{t(`download.platforms.${key}`)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative flex flex-col gap-3 border-t border-hairline px-8 py-6 sm:flex-row sm:flex-wrap sm:items-center sm:px-12">
              <Button variant="secondary" size="sm" asChild>
                <a href={SETUP_GUIDE} target="_blank" rel="noopener">
                  {t("download.cliSetupGuide")}
                  <ExternalLink />
                </a>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <a href={REPO} target="_blank" rel="noopener">
                  <FaGithub />
                  {t("download.cliOnGithub")}
                </a>
              </Button>
            </div>
          </div>
        </FadeIn>

        <div className="mt-16">
          <ClientQuickStart defaultOpen />
        </div>

        {/* Docker */}
        <FadeIn>
          <div className="mt-8 grid gap-8 rounded-xl border border-stroke bg-card p-6 sm:p-8 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-4">
              <FaDocker className="size-7 text-brand-2" aria-hidden />
              <h3 className="mt-6 text-2xl leading-tight text-foreground">{t("download.docker.heading")}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{t("download.docker.body")}</p>
              <a href={DOCKER_HUB} target="_blank" rel="noopener" className="group mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-foreground">
                parallaxprotocol/parallax
                <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
              </a>
            </div>
            <div className="min-w-0 lg:col-span-8">
              <div className="overflow-hidden rounded-xl border border-stroke bg-[#0a0a0b]">
                <div className="on-dark-surface flex h-10 items-center gap-3 border-b border-hairline px-4">
                  <TerminalSquare className="size-3.5 text-muted-foreground" strokeWidth={1.5} aria-hidden />
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">Docker</span>
                </div>
                <pre className="on-dark-surface overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-foreground/90">
                  <code>
                    <span aria-hidden className="select-none text-brand">$ </span>{DOCKER_RUN}
                    {"\n\n"}
                    <span aria-hidden className="select-none text-brand">$ </span>{DOCKER_STOP}
                  </code>
                </pre>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{t("download.docker.note")}</p>
            </div>
          </div>
        </FadeIn>

        <ClientReleases />

        {/* The desktop app */}
        <FadeIn>
          <Link
            href="/parallax-wallet"
            className="group plate-lift relative mt-16 flex flex-col gap-6 overflow-hidden rounded-2xl border border-stroke bg-card p-8 sm:p-12 lg:flex-row lg:items-end lg:justify-between"
          >
            <div aria-hidden className="aurora aurora-left opacity-70" />
            <div className="relative max-w-2xl">
              <p className="tag">
                <AppWindow className="size-3.5 text-brand" strokeWidth={1.5} aria-hidden />
                {t("walletCta.eyebrow")}
              </p>
              <h3 className="mt-6 text-3xl leading-tight text-foreground sm:text-4xl">{t("walletCta.heading")}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">{t("walletCta.body")}</p>
            </div>
            <span className="relative inline-flex shrink-0 items-center gap-2 text-[15px] font-medium text-foreground">
              {t("walletCta.cta")}
              <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
            </span>
          </Link>
        </FadeIn>
      </Section>
    </MainMotion>
  );
}
