import AddNetworkSection from "@/components/add-network-section";
import MainMotion from "@/components/main-motion";
import PageHeader from "@/components/page-header";
import { TwoToneTitle } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Download, ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { wallets } from "@/lib/wallets";

export default async function Page() {
  const t = await getTranslations("wallets")
  return (
    <MainMotion>
      <PageHeader
        title={t("title")}
        subTitle={t("subtitle")}
      />
      <section className="mx-auto max-w-[90rem] px-5 pt-20 md:px-10 md:pt-28">
        <AddNetworkSection />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {wallets.map((wallet) => (
            <a key={wallet.name} href={wallet.url} target="_blank" rel="noopener" className="group block outline-none">
              <Card className="relative h-full py-0 cursor-pointer">
                {"recommended" in wallet && wallet.recommended && (
                  <Badge className="absolute top-3 right-3 z-10">
                    {t("beginnerFriendly")}
                  </Badge>
                )}
                <div className="flex justify-center rounded-t-xl border-b border-hairline bg-foreground/[0.02] px-6 py-10">
                  <Image src={wallet.image} alt={wallet.name} width={200} height={200} className="size-24 sm:size-28" />
                </div>
                <CardHeader className="flex-col items-start gap-3 pb-6">
                  <CardTitle className="text-2xl">{wallet.name}</CardTitle>
                  <span className="inline-flex items-center gap-2 text-[15px] font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    {t("getWallet", { name: wallet.name })}
                    <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                  </span>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-stroke bg-card">
          <div aria-hidden className="aurora" />
          <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Download className="size-8 text-brand" strokeWidth={1.5} />
              <h3 className="mt-10 text-3xl leading-[1.05] text-foreground text-balance sm:text-4xl lg:text-5xl"><TwoToneTitle text={t("runClient.eyebrow")} /></h3>
              <p className="mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
                {t("runClient.description")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:col-span-5 lg:justify-end">
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
      </section>
    </MainMotion>
  )
}
