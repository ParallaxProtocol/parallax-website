import MainMotion from "@/components/main-motion"
import PageHeader from "@/components/page-header"
import CountriesTable from "@/components/network-atlas/countries-table"
import NodesSummary from "@/components/network-atlas/nodes-summary"
import AtlasGlobe from "@/components/network-atlas/atlas-globe"
import { getNodes, type NodesPayload } from "@/lib/nodes"
import { TriangleAlert } from "lucide-react"
import { getTranslations } from "next-intl/server"

export const revalidate = 300

export default async function NetworkAtlasPage() {
  const t = await getTranslations("resources.networkAtlas")
  let data: NodesPayload | null = null
  let errored = false
  try {
    data = await getNodes()
  } catch {
    errored = true
  }

  return (
    <MainMotion>
      <PageHeader
        title={t("title")}
        subTitle={t("subtitle")}
      />
      <section className="mx-auto max-w-[90rem] px-5 pt-20 md:px-10 md:pt-28">
        {errored || !data ? (
          <div className="max-w-3xl rounded-xl border border-stroke bg-card p-6 sm:p-8">
            <p className="tag text-foreground">
              <TriangleAlert className="size-4 text-pop-yellow" />
              {t("errorTitle")}
            </p>
            <p className="text-muted-foreground mt-3">
              {t("errorBody")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            <AtlasGlobe nodes={data.nodes} />
            {/* Stacked above the globe canvas, which bleeds past its layout box. */}
            <div className="relative z-10 flex flex-col gap-10">
              <NodesSummary
                totalPeers={data.totalPeers}
                countries={data.countries}
                torPeers={data.torPeers}
              />
              <CountriesTable nodes={data.nodes} />
            </div>
            <p className="relative z-10 font-mono text-xs uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
              {t("footer")}
            </p>
          </div>
        )}
      </section>
    </MainMotion>
  )
}
