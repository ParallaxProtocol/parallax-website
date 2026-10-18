import ClientDownloadButton from "@/components/client-download-button";
import ClientQuickStart from "@/components/client-quick-start";
import ClientReleases from "@/components/client-releases";
import { CliInfoCapture } from "@/components/client/cli-capture";
import { FadeIn } from "@/components/fade-in";
import MainMotion from "@/components/main-motion";
import { Section, SectionHeading, TwoToneTitle } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  Activity,
  Anchor,
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  Ban,
  BookOpen,
  Braces,
  CircleSlash,
  Code2,
  Database,
  Eye,
  EyeOff,
  FileCog,
  Gauge,
  Globe,
  HardDrive,
  Hexagon,
  KeyRound,
  Landmark,
  Network,
  Pickaxe,
  Radar,
  Radio,
  Route,
  Scissors,
  Server,
  Shapes,
  ShieldCheck,
  Shuffle,
  TerminalSquare,
  Usb,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { FaApple, FaDocker, FaGithub, FaLinux, FaWindows } from "react-icons/fa";

const SETUP_GUIDE = "https://docs.parallaxprotocol.org/guides/client/setup";
const DOCS = "https://docs.parallaxprotocol.org/parallax-client";
const EXCHANGE_GUIDE = "https://docs.parallaxprotocol.org/v2.1.x/exchange-integration/overview";
const REPO = "https://github.com/ParallaxProtocol/parallax";
const DOCKER_HUB = "https://hub.docker.com/r/parallaxprotocol/parallax";
const STATUS_PAGE = "https://status.parallaxprotocol.org";

const DOCKER_RUN = `docker run -d --name parallax \\
  -v parallax-data:/home/parallax/.parallax \\
  -p 32110:32110 -p 32110:32110/udp \\
  parallaxprotocol/parallax node`;
const DOCKER_STOP = "docker stop -t 60 parallax";

/* With Tor running, --listenonion (on by default) creates the onion service
   and configures the onion proxy, which is all --onlynet=onion needs. */
const DARK_NODE = "parallaxd --onlynet=onion";

const EVERYDAY_COMMANDS = [
  "parallax-cli start",
  "parallax-cli tip",
  "parallax-cli peers",
  "parallax-cli mempool",
  "parallax-cli listbanned",
  "parallax-cli stop",
];

const whyItems = [
  { key: "verify", icon: Eye },
  { key: "privacy", icon: Hexagon },
  { key: "network", icon: Network },
  { key: "build", icon: Code2 },
] as const;

/* parallax's p2p/: addrman (new and tried tables under a secret key),
   anchors.go (two block-relay anchors), feeler.go, eviction.go,
   network_group.go and dial.go (/16 and /32 groups, Tor apart), banman and
   dnsseed.go (every 24h). Each cites the Bitcoin Core code it mirrors. */
const p2pItems = [
  { key: "addrman", icon: Database },
  { key: "anchors", icon: Anchor },
  { key: "feelers", icon: Radar },
  { key: "eviction", icon: ShieldCheck },
  { key: "groups", icon: Shapes },
  { key: "bans", icon: Ban },
] as const;

const torPoints = [
  { key: "onion", icon: Globe },
  { key: "proxy", icon: Shuffle },
  { key: "gossip", icon: Route },
  { key: "dark", icon: EyeOff },
] as const;

const operateItems = [
  { key: "cli", icon: TerminalSquare },
  { key: "daemon", icon: Server },
  { key: "config", icon: FileCog },
  { key: "fees", icon: Gauge },
  { key: "sync", icon: HardDrive },
  { key: "prune", icon: Scissors },
  { key: "completion", icon: KeyRound },
  { key: "usb", icon: Usb },
] as const;

const servePoints = [
  { key: "rpc", icon: Braces },
  { key: "graphql", icon: Network },
  { key: "auth", icon: KeyRound },
  { key: "metrics", icon: Activity },
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
      {/* Hero */}
      <div className="relative mt-16 overflow-hidden border-b border-hairline">
        <div aria-hidden className="aurora" />
        <div aria-hidden className="aurora aurora-left opacity-60" />
        <div className="relative mx-auto max-w-[90rem] px-5 pt-24 pb-20 md:px-10 md:pt-32 md:pb-28">
          <div className="mb-8 flex flex-wrap items-center gap-3 enter-fade-up" style={{ "--enter-delay": "0.05s" } as React.CSSProperties}>
            <p className="tag">{t("hero.eyebrow")}</p>
            <Badge>{t("hero.badge")}</Badge>
          </div>
          <h1
            className="max-w-5xl text-5xl leading-[1.02] text-foreground text-balance sm:text-6xl lg:text-7xl enter-fade-up"
            style={{ "--enter-delay": "0.1s" } as React.CSSProperties}
          >
            <TwoToneTitle text={t("hero.title")} />
          </h1>
          <p
            className="mt-8 max-w-2xl text-lg text-muted-foreground text-pretty sm:text-xl enter-fade-up"
            style={{ "--enter-delay": "0.25s" } as React.CSSProperties}
          >
            {t("hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-wrap items-start gap-3 enter-fade-up" style={{ "--enter-delay": "0.35s" } as React.CSSProperties}>
            <ClientDownloadButton align="start" />
            <Button variant="outline" size="lg" asChild>
              <a href={REPO} target="_blank" rel="noopener">
                <FaGithub />
                {t("hero.source")}
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href={SETUP_GUIDE} target="_blank" rel="noopener">
                <BookOpen />
                {t("hero.setupGuide")}
              </a>
            </Button>
          </div>
          <p className="mt-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            <span className="flex items-center gap-2 text-foreground/70" aria-hidden>
              <FaLinux className="size-3.5" />
              <FaApple className="size-3.5" />
              <FaWindows className="size-3.5" />
              <FaDocker className="size-3.5" />
            </span>
            {t("hero.platforms")}
          </p>

          <div className="relative mx-auto mt-16 max-w-4xl sm:mt-20">
            <div className="shadow-[0_24px_80px_-24px_rgb(0_0_0/0.6)]">
              <CliInfoCapture label={t("hero.capture.label")} placeholder={t("hero.capture.placeholder")} alt={t("hero.capture.alt")} />
            </div>
          </div>
        </div>
      </div>

      {/* 01 What a full node does, and why run one */}
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
          <h3 className="mt-16 text-2xl leading-tight text-foreground sm:text-3xl">{t("fullNode.why.heading")}</h3>
          <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map(({ key, icon: Icon }) => (
              <div key={key} className="bg-background p-6 sm:p-8">
                <Icon className="size-6 text-brand" strokeWidth={1.5} aria-hidden />
                <h4 className="mt-8 text-xl leading-tight text-foreground">{t(`fullNode.why.items.${key}.title`)}</h4>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(`fullNode.why.items.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* 02 Peer-to-peer */}
      <Section>
        <FadeIn>
          <SectionHeading index="02" eyebrow={t("p2p.eyebrow")} title={t("p2p.heading")} subtitle={t("p2p.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {p2pItems.map(({ key, icon: Icon }) => (
              <div key={key} className="bg-background p-6 sm:p-8">
                <Icon className="size-6 text-brand" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-8 text-xl leading-tight text-foreground">{t(`p2p.items.${key}.title`)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(`p2p.items.${key}.description`)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <GuideLink href={`${DOCS}/fundamentals/connecting-to-peers`}>{t("p2p.guide")}</GuideLink>
          </div>
        </FadeIn>
      </Section>

      {/* 03 Tor */}
      <Section>
        <FadeIn>
          <SectionHeading index="03" eyebrow={t("tor.eyebrow")} title={t("tor.heading")} subtitle={t("tor.subtitle")} />
        </FadeIn>
        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16 [&>*]:min-w-0">
          <FadeIn className="lg:col-span-5">
            <PointList points={torPoints} t={(key, field) => t(`tor.points.${key}.${field}`)} />
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-7">
            <div className="relative flex h-full flex-col justify-center gap-6 overflow-hidden rounded-2xl border border-stroke bg-card p-5 sm:p-10">
              <div aria-hidden className="aurora" />
              <div className="on-dark-surface relative overflow-hidden rounded-xl border border-stroke bg-[#050506] text-white">
                <p className="flex items-center gap-2 border-b border-hairline px-4 py-3 font-mono text-xs uppercase tracking-[0.14em]">
                  <EyeOff className="size-3.5 text-brand" aria-hidden />
                  {t("tor.command")}
                </p>
                <p className="break-all px-4 py-4 font-mono text-[13px] leading-relaxed text-white/80 sm:px-5">
                  <span aria-hidden className="select-none text-brand">$ </span>
                  {DARK_NODE}
                </p>
              </div>
              <div className="relative">
                <GuideLink href={`${DOCS}/fundamentals/tor`}>{t("tor.guide")}</GuideLink>
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* 04 Operate */}
      <Section>
        <FadeIn>
          <SectionHeading index="04" eyebrow={t("operate.eyebrow")} title={t("operate.heading")} subtitle={t("operate.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {operateItems.map(({ key, icon: Icon }) => (
              <div key={key} className="bg-background p-6 sm:p-8">
                <Icon className="size-6 text-brand" strokeWidth={1.5} aria-hidden />
                <h3 className="mt-8 text-lg leading-tight text-foreground">{t(`operate.items.${key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`operate.items.${key}.description`)}</p>
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="mt-4 grid gap-6 rounded-2xl border border-stroke bg-card p-4 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="on-dark-surface overflow-hidden rounded-xl border border-stroke bg-[#050506] text-white lg:col-span-7">
              <p className="flex items-center gap-2 border-b border-hairline px-4 py-3 font-mono text-xs uppercase tracking-[0.14em]">
                <TerminalSquare className="size-3.5 text-brand" aria-hidden />
                {t("operate.example")}
              </p>
              <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-white/80 sm:px-5">
                <code>
                  {EVERYDAY_COMMANDS.map((command) => (
                    <span key={command} className="block">
                      <span aria-hidden className="select-none text-brand">$ </span>
                      {command}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
            <div className="px-2 lg:col-span-5 lg:px-0">
              <GuideLink href={`${DOCS}/interacting-with-parallax/command-line-rpc`}>{t("operate.guide")}</GuideLink>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* 05 Serve */}
      <Section>
        <FadeIn>
          <SectionHeading index="05" eyebrow={t("serve.eyebrow")} title={t("serve.heading")} subtitle={t("serve.subtitle")} />
        </FadeIn>
        <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-5">
            <PointList points={servePoints} t={(key, field) => t(`serve.points.${key}.${field}`)} />
            <div className="mt-6">
              <GuideLink href={`${DOCS}/monitoring/metrics`}>{t("serve.metricsGuide")}</GuideLink>
            </div>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-7">
            <a
              href={EXCHANGE_GUIDE}
              target="_blank"
              rel="noopener"
              className="group plate-lift relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-2xl border border-stroke bg-card p-8 sm:p-10"
            >
              <div aria-hidden className="aurora aurora-left opacity-70" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <Landmark className="size-7 text-brand" strokeWidth={1.5} aria-hidden />
                  <p className="tag">{t("serve.exchanges.label")}</p>
                </div>
                <h3 className="mt-10 text-3xl leading-tight text-foreground">{t("serve.exchanges.title")}</h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">{t("serve.exchanges.description")}</p>
              </div>
              <span className="relative inline-flex items-center gap-2 text-[15px] font-medium text-foreground">
                {t("serve.exchanges.cta")}
                <ArrowUpRight className="size-4 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </span>
            </a>
          </FadeIn>
        </div>

        {/* --prlstats: opt-in reporting to the status page the homepage shows */}
        <FadeIn delay={0.15}>
          <a
            href={STATUS_PAGE}
            target="_blank"
            rel="noopener"
            className="group plate-lift mt-4 flex flex-col gap-4 rounded-2xl border border-stroke bg-card p-6 sm:flex-row sm:items-center sm:gap-6 sm:px-8"
          >
            <Radio className="size-7 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
            <p className="text-base text-muted-foreground">
              <span className="text-foreground">{t("serve.stats.prompt")}</span> {t("serve.stats.description")}
            </p>
            <span className="inline-flex shrink-0 items-center gap-2 text-[15px] font-medium text-foreground sm:ml-auto">
              {t("serve.stats.cta")}
              <ArrowUpRight className="size-4 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </span>
          </a>
        </FadeIn>
      </Section>

      {/* 06 What's in the archive */}
      <Section>
        <FadeIn>
          <SectionHeading index="06" eyebrow={t("binaries.eyebrow")} title={t("binaries.heading")} subtitle={t("binaries.subtitle")} />
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

        {/* The README's rule: the version describes the software, never consensus */}
        <FadeIn delay={0.15}>
          <div className="mt-4 flex flex-col gap-5 rounded-2xl border border-dashed border-stroke p-6 sm:flex-row sm:p-8">
            <ShieldCheck className="size-6 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
            <div>
              <h3 className="text-xl leading-tight text-foreground">{t("binaries.versioning.title")}</h3>
              <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">{t("binaries.versioning.description")}</p>
              <div className="mt-4">
                <GuideLink href={`${DOCS}/fundamentals/versioning`}>{t("binaries.versioning.cta")}</GuideLink>
              </div>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* 07 Download */}
      <Section id="download" className="scroll-mt-16 border-b-0">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card">
            <div aria-hidden className="aurora" />
            <div className="relative grid gap-10 border-b border-hairline px-8 py-12 sm:px-12 sm:py-16 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <p className="tag mb-6"><span className="text-brand">07</span><span aria-hidden className="text-hairline">/</span>{t("download.eyebrow")}</p>
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
                  <ArrowUpRight />
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

        {/* The desktop app and the miner, the other two official programs */}
        <div className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {([
            { key: "walletCta", href: "/parallax-wallet", icon: AppWindow, glow: "aurora-left" },
            { key: "hashwarpCta", href: "/hashwarp", icon: Pickaxe, glow: "" },
          ] as const).map(({ key, href, icon: Icon, glow }, i) => (
            <FadeIn key={key} delay={i * 0.05} className="h-full">
              <Link
                href={href}
                className="group plate-lift relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-2xl border border-stroke bg-card p-8 sm:p-10"
              >
                <div aria-hidden className={`aurora opacity-70 ${glow}`} />
                <div className="relative">
                  <p className="tag">
                    <Icon className="size-3.5 text-brand" strokeWidth={1.5} aria-hidden />
                    {t(`${key}.eyebrow`)}
                  </p>
                  <h3 className="mt-6 text-3xl leading-tight text-foreground">{t(`${key}.heading`)}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t(`${key}.body`)}</p>
                </div>
                <span className="relative inline-flex items-center gap-2 text-[15px] font-medium text-foreground">
                  {t(`${key}.cta`)}
                  <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Section>
    </MainMotion>
  );
}

/* A ruled list of icon, title and description, like Parallax Wallet's. */
function PointList({
  points,
  t,
}: {
  points: readonly { key: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }> }[];
  t: (key: string, field: "title" | "description") => string;
}) {
  return (
    <ul className="divide-y divide-hairline border-y border-hairline">
      {points.map(({ key, icon: Icon }) => (
        <li key={key} className="flex gap-5 py-6">
          <Icon className="mt-0.5 size-5 shrink-0 text-brand" strokeWidth={1.5} aria-hidden />
          <div>
            <h3 className="text-lg leading-tight text-foreground">{t(key, "title")}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{t(key, "description")}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* An inline link out to a guide on the docs site. */
function GuideLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="group inline-flex items-center gap-2 text-[15px] font-medium text-foreground">
      {children}
      <ArrowUpRight className="size-4 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
    </a>
  );
}
