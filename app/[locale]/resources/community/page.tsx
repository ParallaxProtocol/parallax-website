
import MainMotion from "@/components/main-motion";
import PageHeader from "@/components/page-header";
import { TwoToneTitle } from "@/components/section";
import { ArrowUpRight, BookOpen, GitBranch, Globe, HeartHandshake, MessageCircle, Users } from "lucide-react";
import { FaBitcoin, FaDiscord, FaGithub, FaReddit, FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { getTranslations } from "next-intl/server";

const TOPIC_ICONS = [Users, MessageCircle, GitBranch, Globe, HeartHandshake, BookOpen];

const OFFICIAL_CHANNELS = [
  { href: "https://x.com/prlxchain", icon: FaXTwitter },
  { href: "https://bitcointalk.org/index.php?topic=5560698", icon: FaBitcoin },
  { href: "https://github.com/ParallaxProtocol", icon: FaGithub },
];

const COMMUNITY_CHANNELS = [
  { href: "https://t.me/parallaxchain", icon: FaTelegram },
  { href: "https://www.reddit.com/r/ParallaxProtocol/", icon: FaReddit },
  { href: "https://discord.gg/85SvRxWEja", icon: FaDiscord },
];

type Channel = { name: string; description: string };
type Topic = { title: string; description: string };

export default async function CommunityPage() {
  const t = await getTranslations("resources.community");
  const officialChannels = t.raw("officialChannels") as Channel[];
  const communityChannels = t.raw("communityChannels") as Channel[];
  const topics = t.raw("topics") as Topic[];

  return (
    <MainMotion>
      <PageHeader
        title={t("title")}
        subTitle={t("subtitle")}
      />

      {[
        { heading: t("officialChannelsHeading"), channels: officialChannels, links: OFFICIAL_CHANNELS, index: "01" },
        { heading: t("communityChannelsHeading"), channels: communityChannels, links: COMMUNITY_CHANNELS, index: "02" },
      ].map((group) => (
        <section key={group.index} className="mx-auto max-w-[90rem] px-5 pt-20 md:px-10 md:pt-28">
          <p className="tag"><span className="text-brand">{group.index}</span><span aria-hidden className="text-hairline">/</span>{group.heading}</p>
          <h2 className="mt-6 text-3xl leading-[1.05] text-foreground text-balance sm:text-4xl lg:text-5xl">
            <TwoToneTitle text={group.heading} />
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2 md:grid-cols-3">
            {group.channels.map((ch, i) => {
              const Icon = group.links[i].icon;
              return (
                <a
                  key={ch.name}
                  href={group.links[i].href}
                  target="_blank"
                  rel="noopener"
                  className="group flex items-center gap-4 bg-background px-6 py-6 outline-none transition-colors hover:bg-foreground/[0.04] focus-visible:bg-foreground/[0.04] focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/50 motion-reduce:transition-none"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-stroke text-foreground transition-colors group-hover:border-foreground/30">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-xl text-foreground">{ch.name}</span>
                  <ArrowUpRight className="ml-auto size-5 shrink-0 text-muted-foreground transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand motion-reduce:transition-none" strokeWidth={1.5} />
                </a>
              );
            })}
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-[90rem] px-5 pt-20 md:px-10 md:pt-28">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, i) => {
            const Icon = TOPIC_ICONS[i];
            return (
              <div key={topic.title} className="bg-background p-6 sm:p-8">
                <Icon className="size-6 text-brand" strokeWidth={1.5} />
                <h3 className="mt-10 text-xl leading-tight text-foreground">{topic.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{topic.description}</p>
              </div>
            );
          })}
        </div>
      </section>

    </MainMotion>
  );
}
