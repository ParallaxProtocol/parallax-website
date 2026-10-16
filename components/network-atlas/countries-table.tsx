import type { Node } from "@/lib/nodes"
import { getTranslations } from "next-intl/server"

type Props = {
  nodes: Node[]
}

type Row = {
  countryCode: string
  country: string
  count: number
}

function aggregate(nodes: Node[], unknownLabel: string): Row[] {
  const map = new Map<string, Row>()
  for (const n of nodes) {
    const key = n.countryCode || "??"
    const existing = map.get(key)
    if (existing) {
      existing.count++
    } else {
      map.set(key, {
        countryCode: key,
        country: n.country || unknownLabel,
        count: 1,
      })
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => b.count - a.count || a.country.localeCompare(b.country),
  )
}

/**
 * Render a country code as the corresponding flag emoji. ISO 3166-1 alpha-2
 * codes map onto regional indicator symbols by offset; bogus codes fall back
 * to a neutral globe.
 */
function flagFor(code: string): string {
  if (!/^[A-Za-z]{2}$/.test(code)) return "🌐"
  const base = 0x1f1e6 - "A".charCodeAt(0)
  const upper = code.toUpperCase()
  return String.fromCodePoint(base + upper.charCodeAt(0), base + upper.charCodeAt(1))
}

export default async function CountriesTable({ nodes }: Props) {
  const t = await getTranslations("resources.networkAtlas.countriesTable")
  const rows = aggregate(nodes, t("unknownCountry"))
  const total = nodes.length

  return (
    <div className="overflow-hidden rounded-2xl border border-stroke bg-card">
      <div className="px-6 py-5 border-b border-hairline">
        <h3 className="text-xl leading-tight text-foreground sm:text-2xl">
          {t("heading")}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b border-hairline">
              <th className="px-4 py-3 sm:px-6 font-mono text-xs font-medium uppercase tracking-[0.14em]">
                {t("country")}
              </th>
              <th className="px-4 py-3 sm:px-6 font-mono text-xs font-medium uppercase tracking-[0.14em] text-right">
                {t("nodes")}
              </th>
              <th className="px-4 py-3 sm:px-6 font-mono text-xs font-medium uppercase tracking-[0.14em] text-right w-1/3">
                {t("share")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const pct = total > 0 ? (row.count / total) * 100 : 0
              return (
                <tr
                  key={row.countryCode}
                  className="border-b border-hairline last:border-b-0 hover:bg-foreground/[0.03] transition-colors"
                >
                  <td className="px-4 py-3.5 sm:px-6 whitespace-nowrap text-foreground">
                    <span className="mr-3 text-base" aria-hidden>
                      {flagFor(row.countryCode)}
                    </span>
                    {row.country}
                  </td>
                  <td className="px-4 py-3 sm:px-6 text-right font-mono tabular-nums text-foreground">
                    {row.count}
                  </td>
                  <td className="px-4 py-3 sm:px-6">
                    <div className="flex items-center gap-3 justify-end">
                      <div className="relative h-1.5 w-full max-w-[160px] overflow-hidden rounded-full bg-foreground/10">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-brand"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-mono tabular-nums text-muted-foreground w-14 text-right">
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
