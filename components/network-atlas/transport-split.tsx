import { getTranslations } from "next-intl/server"

type Props = {
  clearnet: number
  tor: number
}

/** Keeps a non-zero category from rendering as nothing at small shares. */
const MIN_SEGMENT_PX = 3

function LegendRow({
  color,
  label,
  count,
  percent,
}: {
  color: string
  label: string
  count: number
  percent: string
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span
        aria-hidden
        className="size-2 shrink-0 -translate-y-px rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-sm text-foreground tabular-nums">{count.toLocaleString()}</span>
      <span className="text-xs text-muted-foreground truncate">{label}</span>
      <span className="ml-auto text-xs text-muted-foreground tabular-nums">{percent}</span>
    </div>
  )
}

/**
 * Share of peers reached over Tor versus clearnet, as a single stacked bar.
 *
 * Part-to-whole across two categories, so the segments are separated by a 2px
 * gap in the surface colour rather than by a stroke. The track is pill-ended
 * like the site's other meters. The counts never sit inside the segments — a narrow tile
 * can't guarantee they fit — so the legend carries them.
 *
 * The colours (--atlas-clearnet, --atlas-tor) are stepped per theme in
 * globals.css and validated for colour-vision separation against the tile
 * surface. Neither clears 3:1 against the light surface alone, which is why
 * the counts are always spelled out: identity never rests on colour.
 */
export default async function TransportSplit({ clearnet, tor }: Props) {
  const t = await getTranslations("resources.networkAtlas.summary")

  const total = clearnet + tor
  // Round once and derive the complement, so the two never read as 101%.
  const torPct = total > 0 ? Math.round((tor / total) * 100) : 0
  const clearnetPct = total > 0 ? 100 - torPct : 0
  const fmt = (n: number) => `${n}%`

  // Width uses the exact fraction, not the rounded label, so the bar stays
  // proportionally true even where the two percentages are rounded apart.
  const clearnetWidth = total > 0 ? (clearnet / total) * 100 : 0

  return (
    <div className="flex flex-col gap-4 bg-background p-6 sm:p-8">
        <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {t("transport")}
        </span>

        <div
          role="img"
          aria-label={t("transportAria", {
            clearnet: clearnet.toLocaleString(),
            tor: tor.toLocaleString(),
          })}
          className="mt-auto flex h-2 w-full gap-0.5 overflow-hidden rounded-full"
        >
          {total === 0 ? (
            <div className="w-full bg-foreground/10" />
          ) : (
            <>
              {clearnet > 0 && (
                <div
                  title={`${t("clearnet")}: ${clearnet.toLocaleString()} (${fmt(clearnetPct)})`}
                  style={{
                    // The gap eats 2px; take 1px off each side so the pair
                    // still spans exactly the full track.
                    width: tor > 0 ? `calc(${clearnetWidth}% - 1px)` : "100%",
                    minWidth: MIN_SEGMENT_PX,
                    backgroundColor: "var(--atlas-clearnet)",
                  }}
                />
              )}
              {tor > 0 && (
                <div
                  title={`${t("tor")}: ${tor.toLocaleString()} (${fmt(torPct)})`}
                  className="flex-1"
                  style={{
                    minWidth: MIN_SEGMENT_PX,
                    backgroundColor: "var(--atlas-tor)",
                  }}
                />
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <LegendRow
            color="var(--atlas-clearnet)"
            label={t("clearnet")}
            count={clearnet}
            percent={fmt(clearnetPct)}
          />
          <LegendRow
            color="var(--atlas-tor)"
            label={t("tor")}
            count={tor}
            percent={fmt(torPct)}
          />
        </div>
    </div>
  )
}
