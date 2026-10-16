import MainMotion from "@/components/main-motion";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/section";
import { Link } from "@/i18n/navigation";
import { Download, ExternalLink, Info, Server, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

const TOPIC_ICONS = [Server, ShieldCheck, Download, Info]

export default async function RunningFullNodePage() {
  const t = await getTranslations("participate.runningAFullNode")
  const rawTopics = t.raw("topics") as Array<{ title: string; description: string }>
  const nodeTopics = rawTopics.map((topic, i) => ({
    icon: TOPIC_ICONS[i],
    title: topic.title,
    description: topic.description,
  }))

  return (
    <MainMotion>
      <PageHeader
        title={t("title")}
        subTitle={t("subtitle")}
      />
      <Section className="border-b-0">
        {/* Four topics — one hairline grid */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2">
          {nodeTopics.map((topic, i) => (
            <div key={topic.title} className="flex flex-col bg-background p-8 sm:p-10">
              <div className="flex items-start justify-between gap-4">
                <topic.icon className="size-7 text-brand" strokeWidth={1.5} />
                <span className="font-mono text-xs tracking-[0.14em] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-10 text-2xl leading-tight text-foreground">{topic.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">{topic.description}</p>
            </div>
          ))}
        </div>

        {/* Get started CTA panel */}
        <div className="relative mt-16 overflow-hidden rounded-2xl border border-stroke bg-card">
          <div aria-hidden className="aurora" />
          <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="tag">{t("getStarted.eyebrow")}</p>
              <h3 className="mt-6 max-w-xl text-3xl font-light leading-[1.15] tracking-[-0.02em] text-foreground text-balance sm:text-4xl">
                {t("getStarted.description")}
              </h3>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
              <Button variant="brand" size="lg" asChild>
                <Link href="/resources/parallax-client">
                  <Download />
                  {t("getStarted.download")}
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://docs.parallaxprotocol.org/guides/client/setup" target="_blank" rel="noopener">
                  {t("getStarted.setupGuide")}
                  <ExternalLink />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </MainMotion>
  );
}
