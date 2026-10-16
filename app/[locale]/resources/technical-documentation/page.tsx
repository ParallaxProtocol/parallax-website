import MainMotion from "@/components/main-motion";
import PageHeader from "@/components/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { ArrowRight, Blocks, Layers, Server, SquareTerminal } from "lucide-react";
import { getTranslations } from "next-intl/server";

const ICONS = [Blocks, SquareTerminal, Layers, Server];
// Alternate the logo's two stops so the doors read as distinct.
const TINTS = ["text-brand", "text-brand-2"];
const HREFS = [
  "https://docs.parallaxprotocol.org/parallax-protocol/foundational-topics/introduction-to-parallax",
  "https://docs.parallaxprotocol.org/parallax-protocol/parallax-stack/introduction-stack",
  "https://docs.parallaxprotocol.org/parallax-protocol/advanced/bridges",
  "https://docs.parallaxprotocol.org/parallax-client/getting-started/introduction",
];

type Doc = { title: string; description: string };

export default async function TechnicalDocumentationPage() {
  const t = await getTranslations("resources.technicalDocumentation");
  const tCommon = await getTranslations("resources.common");
  const docs = t.raw("docs") as Doc[];

  return (
    <MainMotion>
      <PageHeader
        title={t("title")}
        subTitle={t("subtitle")}
      />
      <section className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[90rem] px-5 pt-20 md:px-10 md:pt-28">
        {docs.map((doc, i) => {
          const Icon = ICONS[i];
          return (
            <a
              key={doc.title}
              href={HREFS[i]}
              target="_blank"
              rel="noopener"
              className="group block h-full outline-none"
            >
              <Card className="h-full overflow-hidden rounded-2xl py-0">
                <div className="flex flex-1 flex-col justify-between gap-10 p-8 sm:p-10">
                  <div>
                    <div className="flex items-start justify-between">
                      <Icon className={`size-8 ${TINTS[i % TINTS.length]}`} strokeWidth={1.5} />
                      <span className="font-mono text-xs tracking-[0.14em] text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <CardTitle className="mt-16 text-2xl sm:text-3xl">{doc.title}</CardTitle>
                    <p className="mt-4 max-w-lg text-base text-muted-foreground leading-relaxed">{doc.description}</p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 text-[15px] font-medium text-foreground">
                    {tCommon("readMore")}
                    <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                  </span>
                </div>
              </Card>
            </a>
          );
        })}
      </section>
    </MainMotion>
  );
}
