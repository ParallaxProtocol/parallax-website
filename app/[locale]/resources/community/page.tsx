import { DonationAddress } from "@/components/community/donation-address";
import { FadeIn } from "@/components/fade-in";
import MainMotion from "@/components/main-motion";
import PageHeader from "@/components/page-header";
import { Section, SectionHeading } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { IconType } from "react-icons";
import { FaBitcoin, FaDiscord, FaGithub, FaReddit, FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

// Donation endpoints, copied verbatim from the former /participate/support-parallax.
const BTC_DONATION_ADDRESS = "bc1qmlwnufa0ux3janw04dlld0w0v3tkv05snjmr8m";
const EVM_DONATION_ADDRESS = "0xa4Ff25A2814649F672e4abad49E45AB824E5988c";
const PATREON_URL = "https://www.patreon.com/ParallaxChainProtocol";

const GITHUB_ORG = "https://github.com/ParallaxProtocol";
const DOCS_URL = "https://docs.parallaxprotocol.org";

const OFFICIAL_CHANNELS: { href: string; icon: IconType }[] = [
  { href: "https://x.com/prlxchain", icon: FaXTwitter },
  { href: "https://bitcointalk.org/index.php?topic=5560698", icon: FaBitcoin },
  { href: GITHUB_ORG, icon: FaGithub },
];

const COMMUNITY_CHANNELS: { href: string; icon: IconType }[] = [
  { href: "https://t.me/parallaxchain", icon: FaTelegram },
  { href: "https://www.reddit.com/r/ParallaxProtocol/", icon: FaReddit },
  { href: "https://discord.gg/85SvRxWEja", icon: FaDiscord },
];

type Channel = { name: string; handle: string; description: string };
type Repo = { name: string; description: string };

const linkClass = "group inline-flex items-center gap-2 text-[15px] font-medium text-foreground";

function ActionLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener" className={linkClass}>
        {children}
        <ArrowUpRight className="size-4 text-brand transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" />
      </a>
    );
  }
  return (
    <Link href={href} className={linkClass}>
      {children}
      <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
    </Link>
  );
}

function Meta({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((m) => (
        <li key={m} className="rounded-full border border-hairline bg-foreground/[0.03] px-3 py-1 font-mono text-xs text-foreground/80">
          {m}
        </li>
      ))}
    </ul>
  );
}

/* One way to contribute, set as an editorial row: title, what it takes,
   the specifics in mono chips, and the one link that gets you started. */
function ContributeRow({
  title,
  description,
  meta,
  children,
}: {
  title: string;
  description: string;
  meta?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="py-10 first:pt-0 last:pb-0">
      <h4 className="text-2xl leading-tight text-foreground">{title}</h4>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">{description}</p>
      {meta && <div className="mt-5"><Meta items={meta} /></div>}
      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">{children}</div>
    </div>
  );
}

/* A group of contributions: label and rationale on the left, the rows on
   the right, divided by hairlines. */
function ContributeGroup({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <FadeIn className="grid gap-10 border-t border-hairline pt-12 lg:grid-cols-12 lg:gap-16 lg:pt-16">
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <h3 className="text-3xl leading-tight text-foreground sm:text-4xl">{title}</h3>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground text-pretty">{description}</p>
        </div>
      </div>
      <div className="flex flex-col divide-y divide-hairline lg:col-span-8">{children}</div>
    </FadeIn>
  );
}

function ChannelList({ label, channels, links }: { label: string; channels: Channel[]; links: { href: string; icon: IconType }[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stroke bg-card">
      <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
        <p className="tag text-foreground">{label}</p>
        <p className="font-mono text-xs text-muted-foreground">{String(channels.length).padStart(2, "0")}</p>
      </div>
      <ul className="divide-y divide-hairline">
        {channels.map((ch, i) => {
          const Icon = links[i].icon;
          return (
            <li key={ch.name}>
              <a
                href={links[i].href}
                target="_blank"
                rel="noopener"
                className="group flex items-center gap-5 px-6 py-6 outline-none transition-colors hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.04] focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50 motion-reduce:transition-none"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-stroke text-foreground transition-colors group-hover:border-foreground/30">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                    <span className="text-xl text-foreground">{ch.name}</span>
                    <span className="truncate font-mono text-xs text-muted-foreground">{ch.handle}</span>
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{ch.description}</span>
                </span>
                <ArrowUpRight className="size-5 shrink-0 text-muted-foreground transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand motion-reduce:transition-none" strokeWidth={1.5} aria-hidden />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default async function CommunityPage() {
  const t = await getTranslations("resources.community");
  const g = "contribute.groups";
  const official = t.raw("channels.official") as Channel[];
  const community = t.raw("channels.community") as Channel[];
  const repos = t.raw(`${g}.build.items.client.repos`) as Repo[];
  const meta = (key: string) => t.raw(`${g}.${key}.meta`) as string[];

  return (
    <MainMotion>
      <PageHeader title={t("title")} subTitle={t("subtitle")}>
        <div
          className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row enter-fade-up"
          style={{ "--enter-delay": "0.35s" } as React.CSSProperties}
        >
          <Button variant="brand" size="xl" className="w-full sm:w-fit" asChild>
            <a href="#contribute">
              {t("ctaContribute")}
              <ArrowRight />
            </a>
          </Button>
          <Button variant="outline" size="xl" className="w-full sm:w-fit" asChild>
            <a href="#support">{t("ctaSupport")}</a>
          </Button>
        </div>
      </PageHeader>

      {/* Channels */}
      <Section>
        <FadeIn>
          <SectionHeading index="01" eyebrow={t("channels.eyebrow")} title={t("channels.heading")} subtitle={t("channels.subtitle")} />
        </FadeIn>
        <FadeIn delay={0.1} className="mt-16 grid gap-4 lg:grid-cols-2">
          <ChannelList label={t("channels.officialLabel")} channels={official} links={OFFICIAL_CHANNELS} />
          <ChannelList label={t("channels.communityLabel")} channels={community} links={COMMUNITY_CHANNELS} />
        </FadeIn>
      </Section>

      {/* Ways to contribute */}
      <Section id="contribute" className="scroll-mt-16">
        <FadeIn>
          <SectionHeading index="02" eyebrow={t("contribute.eyebrow")} title={t("contribute.heading")} subtitle={t("contribute.subtitle")} />
        </FadeIn>

        <div className="mt-20 space-y-20">
          <ContributeGroup title={t(`${g}.network.title`)} description={t(`${g}.network.description`)}>
            {/* The node is the first thing to do, so it gets a plate with the
                one fact people need: which port to open. */}
            <div className="pb-10">
              <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card">
                <div aria-hidden className="aurora" />
                <div className="relative grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end md:gap-10">
                  <div>
                    <h4 className="text-3xl leading-tight text-foreground">{t(`${g}.network.items.node.title`)}</h4>
                    <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
                      {t(`${g}.network.items.node.description`)}
                    </p>
                    <div className="mt-8">
                      <Button variant="brand" size="lg" asChild>
                        <Link href="/resources/parallax-client">
                          {t(`${g}.network.items.node.cta`)}
                          <ArrowRight />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-stroke bg-background/70 font-mono text-[13px] backdrop-blur-sm md:w-64">
                    <div className="border-b border-hairline px-4 py-2.5 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      {t(`${g}.network.items.node.portLabel`)}
                    </div>
                    <div className="space-y-1.5 px-4 py-4 text-foreground/90">
                      <p><span aria-hidden className="select-none text-brand">$ </span>./parallaxd</p>
                      <p className="flex justify-between gap-4"><span className="text-muted-foreground">tcp</span><span>32110</span></p>
                      <p className="flex justify-between gap-4"><span className="text-muted-foreground">udp</span><span>32110</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ContributeRow
              title={t(`${g}.network.items.mine.title`)}
              description={t(`${g}.network.items.mine.description`)}
              meta={meta("network.items.mine")}
            >
              <ActionLink href="/participate/mining">{t(`${g}.network.items.mine.cta`)}</ActionLink>
            </ContributeRow>
            <ContributeRow
              title={t(`${g}.network.items.bootnode.title`)}
              description={t(`${g}.network.items.bootnode.description`)}
              meta={meta("network.items.bootnode")}
            >
              <ActionLink href={`${DOCS_URL}/parallax-client/fundamentals/connecting-to-peers`}>
                {t(`${g}.network.items.bootnode.cta`)}
              </ActionLink>
            </ContributeRow>
            <ContributeRow
              title={t(`${g}.network.items.rpc.title`)}
              description={t(`${g}.network.items.rpc.description`)}
              meta={meta("network.items.rpc")}
            >
              <ActionLink href={`${DOCS_URL}/parallax-client/interacting-with-parallax/json-rpc-server/overview`}>
                {t(`${g}.network.items.rpc.cta`)}
              </ActionLink>
            </ContributeRow>
          </ContributeGroup>

          <ContributeGroup title={t(`${g}.build.title`)} description={t(`${g}.build.description`)}>
            <ContributeRow
              title={t(`${g}.build.items.evm.title`)}
              description={t(`${g}.build.items.evm.description`)}
              meta={meta("build.items.evm")}
            >
              <ActionLink href="/introduction/parallax-for-developers">{t(`${g}.build.items.evm.cta`)}</ActionLink>
              <ActionLink href={`${DOCS_URL}/parallax-protocol/parallax-stack/smart-contracts`}>{t(`${g}.build.items.evm.ctaDocs`)}</ActionLink>
            </ContributeRow>
            <div className="py-10">
              <h4 className="text-2xl leading-tight text-foreground">{t(`${g}.build.items.client.title`)}</h4>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty">
                {t(`${g}.build.items.client.description`)}
              </p>
              <div className="mt-6 overflow-hidden rounded-xl border border-stroke bg-card">
                <div className="border-b border-hairline px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {t(`${g}.build.items.client.reposLabel`)}
                </div>
                <ul className="divide-y divide-hairline">
                  {repos.map((repo) => (
                    <li key={repo.name}>
                      <a
                        href={`${GITHUB_ORG}/${repo.name}`}
                        target="_blank"
                        rel="noopener"
                        className="group flex items-center gap-4 px-5 py-3.5 outline-none transition-colors hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.04] focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50 motion-reduce:transition-none"
                      >
                        <FaGithub className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
                          <span className="font-mono text-sm text-foreground sm:w-36 sm:shrink-0">{repo.name}</span>
                          <span className="text-sm text-muted-foreground">{repo.description}</span>
                        </span>
                        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand motion-reduce:transition-none" strokeWidth={1.5} aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <ActionLink href={GITHUB_ORG}>{t(`${g}.build.items.client.cta`)}</ActionLink>
              </div>
            </div>
            <ContributeRow
              title={t(`${g}.build.items.docs.title`)}
              description={t(`${g}.build.items.docs.description`)}
              meta={meta("build.items.docs")}
            >
              <ActionLink href={`${GITHUB_ORG}/parallax-docs`}>{t(`${g}.build.items.docs.cta`)}</ActionLink>
            </ContributeRow>
          </ContributeGroup>

          <ContributeGroup title={t(`${g}.word.title`)} description={t(`${g}.word.description`)}>
            <ContributeRow title={t(`${g}.word.items.use.title`)} description={t(`${g}.word.items.use.description`)}>
              <ActionLink href="/introduction/getting-started">{t(`${g}.word.items.use.cta`)}</ActionLink>
            </ContributeRow>
            <ContributeRow title={t(`${g}.word.items.spread.title`)} description={t(`${g}.word.items.spread.description`)}>
              <ActionLink href="/resources/branding">{t(`${g}.word.items.spread.cta`)}</ActionLink>
            </ContributeRow>
          </ContributeGroup>
        </div>
      </Section>

      {/* Donations */}
      <Section id="support" className="scroll-mt-16 border-b-0">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <FadeIn className="lg:col-span-5">
            <p className="tag"><span className="text-brand">03</span><span aria-hidden className="text-hairline">/</span>{t("support.eyebrow")}</p>
            <h2 className="mt-6 text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl lg:text-6xl">
              {t("support.heading")}
            </h2>
            <p className="accent-rule mt-8 pl-6 text-lg text-muted-foreground text-pretty">{t("support.intro")}</p>
          </FadeIn>

          <FadeIn delay={0.1} className="flex flex-col gap-4 lg:col-span-7">
            <DonationAddress
              title={t("support.btc.title")}
              network={t("support.btc.network")}
              address={BTC_DONATION_ADDRESS}
              tint="bg-brand"
              copyLabel={t("support.copy")}
              copiedLabel={t("support.copied")}
            />
            <DonationAddress
              title={t("support.evm.title")}
              network={t("support.evm.network")}
              address={EVM_DONATION_ADDRESS}
              tint="bg-brand-2"
              copyLabel={t("support.copy")}
              copiedLabel={t("support.copied")}
            />
            <p className="px-1 text-sm text-muted-foreground">{t("support.checkNote")}</p>
          </FadeIn>
        </div>

        <FadeIn>
          <div className="relative mt-16 overflow-hidden rounded-2xl border border-stroke bg-card">
            <div aria-hidden className="aurora aurora-left" />
            <div className="relative flex flex-col gap-8 p-8 sm:p-10 md:flex-row md:items-center md:justify-between">
              <p className="max-w-2xl text-lg text-muted-foreground">
                <span className="block text-2xl text-foreground">{t("support.patreonIntro")}</span>
                {t("support.patreonIntroLine2")}
              </p>
              <Button size="lg" variant="brand" className="w-full md:w-fit" asChild>
                <a href={PATREON_URL} target="_blank" rel="noopener">
                  {t("support.patreonCta")}
                  <ArrowRight />
                </a>
              </Button>
            </div>
          </div>
        </FadeIn>
      </Section>
    </MainMotion>
  );
}
