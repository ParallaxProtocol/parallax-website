import MainMotion from "@/components/main-motion";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Section, TwoToneTitle } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { AppWindow, CircleSlash, ExternalLink, Hexagon, Info, ShieldCheck, TerminalSquare } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import ClientDownloadButton from "@/components/client-download-button";
import ClientQuickStart from "@/components/client-quick-start";
import ClientReleases from "@/components/client-releases";
import { getTranslations } from "next-intl/server";

const FEATURE_ICONS = [ShieldCheck, TerminalSquare, Info];

type Feature = { title: string; description: string };

export default async function ParallaxClientPage() {
  const t = await getTranslations("resources.parallaxClient");
  const features = t.raw("features") as Feature[];

  return (
    <MainMotion>
      <PageHeader
        title={t("title")}
        subTitle={t("subtitle")}
      />
      <Section>
        {/* Two concept cells */}
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-stroke sm:grid-cols-2">
          <div className="p-8 sm:p-10">
            <Hexagon className="size-7 text-brand" strokeWidth={1.5} />
            <h3 className="mt-10 text-2xl text-foreground">{t("decentralized.heading")}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {t("decentralized.body")}
            </p>
          </div>
          <div className="border-t border-hairline p-8 sm:border-t-0 sm:border-l sm:p-10">
            <CircleSlash className="size-7 text-brand-2" strokeWidth={1.5} />
            <h3 className="mt-10 text-2xl text-foreground">{t("noVoting.heading")}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {t("noVoting.body")}
            </p>
          </div>
        </div>

        <blockquote className="accent-rule my-20 pl-6 sm:pl-10">
          <p className="max-w-4xl text-2xl font-light leading-snug tracking-[-0.02em] text-foreground text-balance sm:text-4xl">
            {t("blockquote")}
          </p>
        </blockquote>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <div key={feature.title} className="rounded-xl border border-stroke bg-card p-6 sm:p-8">
                <Icon className="size-7 text-foreground" strokeWidth={1.5} />
                <h3 className="mt-12 text-xl leading-tight text-foreground">{feature.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section className="border-b-0">
        {/* Download panel */}
        <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card">
          <div aria-hidden className="aurora" />
          <div className="relative grid gap-8 border-b border-hairline px-8 py-12 sm:px-12 sm:py-16 lg:grid-cols-12 lg:items-end">
            <h2 className="text-4xl leading-[1.05] text-foreground text-balance sm:text-5xl lg:col-span-7">
              <TwoToneTitle text={t("download.heading")} />
            </h2>
            <p className="accent-rule max-w-md pl-6 text-base text-muted-foreground text-pretty sm:text-lg lg:col-span-4 lg:col-start-9">
              {t("download.subtitle")}
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col p-8 sm:p-12">
              <div className="flex items-start justify-between gap-4">
                <AppWindow className="size-7 text-brand" strokeWidth={1.5} />
                <Badge>{t("download.recommended")}</Badge>
              </div>
              <h3 className="mt-10 text-2xl leading-tight text-foreground sm:text-3xl">{t("download.desktopTitle")}</h3>
              <p className="mt-3 mb-10 text-base leading-relaxed text-muted-foreground">
                {t("download.desktopDescription")}
              </p>
              <div className="mt-auto">
                <ClientDownloadButton variant="gui" />
              </div>
            </div>

            <div className="flex flex-col border-t border-hairline p-8 sm:p-12 md:border-t-0 md:border-l">
              <div className="flex items-start justify-between gap-4">
                <TerminalSquare className="size-7 text-foreground" strokeWidth={1.5} />
                <Badge variant="outline">{t("download.advanced")}</Badge>
              </div>
              <h3 className="mt-10 text-2xl leading-tight text-foreground sm:text-3xl">{t("download.cliTitle")}</h3>
              <p className="mt-3 mb-10 text-base leading-relaxed text-muted-foreground">
                {t("download.cliDescription")}
              </p>
              <div className="mt-auto">
                <ClientDownloadButton variant="cli" prominent={false} />
              </div>
            </div>
          </div>

          <div className="relative flex flex-col gap-3 border-t border-hairline px-8 py-6 sm:flex-row sm:flex-wrap sm:items-center sm:px-12">
            <Button variant="secondary" size="sm" asChild>
              <a href="https://docs.parallaxprotocol.org/guides/client/setup" target="_blank" rel="noopener">
                {t("download.cliSetupGuide")}
                <ExternalLink />
              </a>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <a href="https://github.com/ParallaxProtocol/parallax" target="_blank" rel="noopener">
                <FaGithub />
                {t("download.cliOnGithub")}
              </a>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <a href="https://github.com/ParallaxProtocol/parallax-gui" target="_blank" rel="noopener">
                <FaGithub />
                {t("download.desktopOnGithub")}
              </a>
            </Button>
          </div>
        </div>

        <ClientQuickStart />

        <ClientReleases />
      </Section>
    </MainMotion>
  );
}
