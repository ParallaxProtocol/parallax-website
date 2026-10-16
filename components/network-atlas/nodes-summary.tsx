import TransportSplit from "@/components/network-atlas/transport-split"
import { getTranslations } from "next-intl/server"

type Props = {
  /** Every peer observed, Tor included — the headline figure. */
  totalPeers: number
  countries: number
  torPeers: number
}

/* One cell of the hairline stat grid. The headline figure sits in a glow. */
function Stat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden bg-background p-6 sm:p-8">
      {highlight && <div aria-hidden className="aurora aurora-left" />}
      <span className="relative font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="relative mt-auto pt-8 text-5xl font-light leading-none tracking-[-0.03em] text-foreground tabular-nums">{value}</span>
    </div>
  )
}

export default async function NodesSummary({ totalPeers, countries, torPeers }: Props) {
  const t = await getTranslations("resources.networkAtlas.summary")

  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline sm:grid-cols-2 lg:grid-cols-3">
      <Stat label={t("onlineNodes")} value={totalPeers.toLocaleString()} highlight />
      {/* Splits the headline figure: Tor peers are in the total but not on the
          map, since an onion address has no location. */}
      <TransportSplit clearnet={totalPeers - torPeers} tor={torPeers} />
      <Stat label={t("countries")} value={countries.toLocaleString()} />
    </div>
  )
}
