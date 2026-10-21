import type { ReactNode } from "react"

/* The network status dashboard (status.parallaxprotocol.org), drawn as SVG
   from its own code (parallax-stats/src: app/globals.css, app/page.tsx,
   components/dashboard.tsx, incidents.tsx, block-clock.tsx,
   section-nav.tsx, charts.tsx, figures.tsx) rather than captured: its
   tokens, its plates and labels, the best block clock, the section bar and
   the Mining section's first tiles. One unit is one CSS pixel of a
   1440×900 viewport. */

const W = 1440
const H = 900

// globals.css :root, dark: the oklch tokens in sRGB
const C = {
  bg: "#000102",
  fg: "#eae7e4",
  card: "#04060a",
  surface: "#06090f",
  muted: "#7d8086",
  border: "rgb(255 255 255 / 8%)",
  brand: "#23c9c9",
  warn: "#fab219",
}

const SANS = "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
const MONO = "var(--font-geist-mono), ui-monospace, monospace"

const LOGO =
  "m 171.48919,103.57486 -0.0214,30.61331 108.49225,-62.638032 0.007,-0.004 0.007,0.01164 52.90338,30.543593 -26.45177,15.27194 -26.46448,15.27987 1.8e-4,-7e-4 -108.53587,62.66321 -0.0213,30.51422 0.0429,0.0247 211.66649,-122.2057 -105.70521,-61.127344 z m 26.39475,137.56774 79.35321,45.88867 105.91862,-61.05365 0.0215,-30.71125 -110.18258,63.61394 -0.003,-0.005 -26.45194,-15.27225 26.45847,-15.27581 110.20048,-63.62427 0.0213,-30.56377 z"

// The Mining tiles' 7 day trends, in 4 hour slices, shaped as they were captured
const BLOCK_TIME = [556, 539, 570, 589, 634, 667, 672, 648, 643, 668, 628, 607, 564, 583, 561, 567, 578, 635, 690, 652, 651, 633, 614, 607, 580, 602, 651, 645, 644, 620, 639, 654, 639, 657, 689, 670, 666, 620, 577, 552, 509, 483]
const HASHRATE = [21.82, 22.58, 21.55, 20.85, 19.4, 18.29, 18.02, 18.6, 18.64, 17.91, 19.02, 19.64, 21.2, 20.54, 21.48, 21.3, 20.99, 19.12, 17.36, 18.33, 18.29, 18.81, 19.37, 19.57, 20.51, 19.85, 18.22, 18.36, 18.26, 19.05, 18.36, 17.84, 18.19, 17.63, 16.7, 17.05, 17.08, 18.33, 19.75, 20.75, 22.69, 23.9]
const DIFFICULTY = [12.31, 12.247, 12.305, 12.106, 12.064, 11.86, 11.901, 11.896, 11.86, 11.776, 11.765, 11.818, 12.064, 12.153, 12.142, 12.085, 12.011, 11.86, 11.629, 11.739, 11.891, 11.865, 11.907, 11.791, 11.776, 11.833, 11.739, 11.619, 11.629, 11.666, 11.603, 11.503, 11.503, 11.294, 11.236, 11.21, 11.283, 11.336, 11.503, 11.566, 11.818, 12.001]

// The Decentralization tile: the 7 largest miners of the last 1,008 blocks, then the rest
const MINERS = [
  { label: "0e0e…0e0e", blocks: 92 },
  { label: "6c4f…6b08", blocks: 90 },
  { label: "a91d…33fe", blocks: 87 },
  { label: "3b07…c2d1", blocks: 85 },
  { label: "f4e2…9a10", blocks: 83 },
  { label: "58c1…07bb", blocks: 80 },
  { label: "d2aa…41c6", blocks: 76 },
]
const OTHERS = 415
const TOTAL = 1008
// sliceColor: the brand teal mixed toward the card by rank, in oklch; the rest neutral
const SLICE = ["#23c9c9", "#247f95", "#235168", "#1d394d", "#182b3c", "#14212f", "#101a27"]
const OTHER_SLICE = "#34373d"

// The four columns every section's tiles sit on
const COL = [24, 376, 728, 1080]
const TILE_W = 336

const blockTime = (s: number) => `${Math.floor(s / 60)} min ${String(Math.round(s % 60)).padStart(2, "0")} s`

/* Plate: square corners, a hairline border, the elevated surface. */
function Plate({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h - 1} fill={C.surface} stroke={C.border} />
}

/* Label: the site's small heading, mono, uppercase, widely tracked. */
function Label({ x, y, children, anchor }: { x: number; y: number; children: string; anchor?: "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily={MONO} fontSize={12} letterSpacing="0.15em" fill={C.muted}>
      {children.toUpperCase()}
    </text>
  )
}

/* ExternalLink's arrow out, 12px, its corner at (x, cy - 6). */
function ArrowOut({ x, cy }: { x: number; cy: number }) {
  return <path transform={`translate(${x} ${cy - 6}) scale(0.75)`} d="M6 3.5h6.5V10M12.5 3.5 4 12" fill="none" stroke={C.muted} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
}

/* TrendLine: a 7 day level on a scale fitted to its range, the area under it
   faint, guides from its highest and lowest points to their labels, and a
   dot on the latest. */
function Trend({ x0, y0, w, h, values, format }: { x0: number; y0: number; w: number; h: number; values: number[]; format: (v: number) => string }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const pad = (max - min) * 0.15
  const slot = w / values.length
  const x = (i: number) => x0 + i * slot + slot / 2
  const y = (v: number) => y0 + 6 + (1 - (v - (min - pad)) / (max - min + 2 * pad)) * (h - 12)
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")
  const last = values.length - 1
  return (
    <g>
      {[max, min].map((v) => (
        <line key={v} x1={x0} x2={x(values.indexOf(v))} y1={y(v)} y2={y(v)} stroke={C.muted} strokeOpacity={0.5} strokeDasharray="2 3" />
      ))}
      <polygon points={`${x(0)},${y0 + h} ${points} ${x(last)},${y0 + h}`} fill={C.brand} fillOpacity={0.1} />
      <polyline points={points} fill="none" stroke={C.brand} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(last)} cy={y(values[last])} r={4} fill={C.brand} stroke={C.surface} strokeWidth={2} />
      <g fontFamily={MONO} fontSize={10} fill={C.muted}>
        <text x={x0} y={y(max) - 6}>
          {format(max)}
        </text>
        <text x={x0} y={y(min) + 13}>
          {format(min)}
        </text>
      </g>
    </g>
  )
}

/* Tile: a label with a readout on the right, a figure, its note, and a chart filling the rest. */
function Tile({
  col,
  y,
  h,
  title,
  readout,
  value,
  unit,
  note,
  children,
}: {
  col: number
  y: number
  h: number
  title: ReactNode
  readout?: ReactNode
  value?: ReactNode
  unit?: string
  note?: string[]
  children?: ReactNode
}) {
  const x = COL[col]
  return (
    <g>
      <Plate x={x} y={y} w={TILE_W} h={h} />
      {title}
      {readout}
      {value !== undefined && (
        <text x={x + 21} y={y + 79} fontSize={30}>
          {value}
          {unit && (
            <tspan fontSize={16} fill={C.muted}>
              {" "}
              {unit}
            </tspan>
          )}
        </text>
      )}
      {note && (
        <text fontSize={14} fill={C.muted}>
          {note.map((line, i) => (
            <tspan key={i} x={x + 21} y={y + 104 + i * 20}>
              {line}
            </tspan>
          ))}
        </text>
      )}
      {children}
    </g>
  )
}

/* The Mining section's header: the index in corner brackets, the title, what it covers, and a ruled scale to the row's end. */
function SectionHeading() {
  const bx = 25
  const by = 477
  const corner = (x: number, y: number, dx: number, dy: number) => <path d={`M${x + dx * 5} ${y}H${x}V${y + dy * 5}`} fill="none" stroke={C.brand} />
  return (
    <g>
      {corner(bx + 0.5, by + 0.5, 1, 1)}
      {corner(bx + 27.5, by + 0.5, -1, 1)}
      {corner(bx + 0.5, by + 23.5, 1, -1)}
      {corner(bx + 27.5, by + 23.5, -1, -1)}
      <text x={bx + 14} y={by + 16} textAnchor="middle" fontFamily={MONO} fontSize={11} fill={C.brand}>
        01
      </text>
      <text x={65} y={498} fontSize={24} fontWeight={500} letterSpacing="-0.025em">
        Mining
      </text>
      <text x={156} y={499} fontSize={14} fill={C.muted}>
        Block time, hashrate, difficulty, who finds the blocks and recommended confirmations
      </text>
      {/* section-rule: a hairline with a scale's ticks, from a firmer first tick */}
      <g opacity={0.9}>
        <rect x={718} y={493} width={1} height={6} fill={C.muted} />
        <rect x={718} y={495} width={697} height={4} fill="url(#st-ticks)" />
        <line x1={718} x2={1415} y1={498.5} y2={498.5} stroke={C.border} />
      </g>
    </g>
  )
}

export function StatusArt({ alt }: { alt: string }) {
  // Best block's clock: 13 s of the track's 30 minutes
  const track = { x: 336, w: 1047, y: 252 }
  const fill = (13 / 1800) * track.w
  // The Decentralization donut, 176px, its ring at radius 46 of 120
  const donut = { cx: 1248, cy: 756 }
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const slices = [...MINERS.map((m, i) => ({ blocks: m.blocks, color: SLICE[i] })), { blocks: OTHERS, color: OTHER_SLICE }]
  const starts = slices.map((_, i) => slices.slice(0, i).reduce((sum, s) => sum + (s.blocks / TOTAL) * circumference, 0))
  const nav = [
    ["01", 34, "Mining", 57],
    ["02", 126, "Blocks & fees", 150],
    ["03", 271, "Supply", 294.5],
    ["04", 364, "Market", 387],
    ["05", 470, "Nodes", 494],
  ] as const

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={alt} className="block h-auto w-full select-none" fontFamily={SANS} fontSize={14} fill={C.fg}>
      <defs>
        <linearGradient id="st-logo" gradientUnits="userSpaceOnUse" x1="224.35812" y1="73.057472" x2="330.26605" y2="256.49536">
          <stop offset="0" stopColor="#00ff80" />
          <stop offset="1" stopColor="#0080ff" />
        </linearGradient>
        <linearGradient id="st-brand" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00ff80" />
          <stop offset="1" stopColor="#0080ff" />
        </linearGradient>
        {/* UNRECORDED: hairline stripes at 135°, 5px apart */}
        <pattern id="st-hatch" patternUnits="userSpaceOnUse" width={5} height={10} patternTransform="rotate(45)">
          <rect width={1} height={10} fill={C.border} />
        </pattern>
        <pattern id="st-ticks" patternUnits="userSpaceOnUse" x={718} width={8} height={4}>
          <rect width={1} height={4} fill={C.border} />
        </pattern>
        <clipPath id="st-bar">
          <rect x={237} y={108} width={966} height={14} rx={7} />
        </clipPath>
      </defs>

      <rect width={W} height={H} fill={C.bg} />

      {/* Header: the logo and name, the sound toggle (blocked until the page is used) and About */}
      {/* As the website's header draws it: a 32px mark, then the name 12px on at 30px, medium, -0.04em */}
      <g transform="translate(24 28) scale(0.12094)">
        <path transform="translate(-145.01123,-32.460674)" fill="url(#st-logo)" d={LOGO} />
      </g>
      <text x={68} y={54.5} fontSize={30} fontWeight={500} letterSpacing="-0.04em">
        Parallax
      </text>
      <rect x={1336.5} y={26.5} width={35} height={35} rx={4} fill="none" stroke={C.border} />
      <g transform="translate(1346 36) scale(0.6667)" fill="none" stroke={C.muted} strokeWidth={1.5}>
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" strokeLinejoin="round" />
        <path d="m16 9.5 5 5M21 9.5l-5 5" strokeLinecap="round" />
      </g>
      <circle cx={1370} cy={28} r={4} fill={C.warn} />
      <rect x={1380.5} y={26.5} width={35} height={35} rx={4} fill="none" stroke={C.border} />
      <g transform="translate(1390 36) scale(0.6667)" fill="none" stroke={C.fg} strokeWidth={1.5}>
        <circle cx={12} cy={12} r={9} />
        <path d="M9.6 9.4a2.5 2.5 0 0 1 4.85.85c0 1.65-2.45 2.2-2.45 3.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 17.2v.1" strokeLinecap="round" strokeWidth={2} />
      </g>

      {/* Network status: all clear, the last 30 days' timeline (hatched: before records began), the history's toggle */}
      <Plate x={24} y={88} w={1392} h={54} />
      <circle cx={49} cy={115} r={4} fill={C.brand} />
      <text x={63} y={120}>
        All clear
      </text>
      <g clipPath="url(#st-bar)">
        <rect x={237} y={108} width={966} height={14} fill="url(#st-hatch)" />
      </g>
      <text x={1377} y={119} textAnchor="end" fontSize={12} fill={C.muted}>
        none in 30 days
      </text>
      <path transform="translate(1383 109) scale(0.75)" d="m4 6 4 4.5L12 6" fill="none" stroke={C.muted} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />

      {/* The block clock: the best block, how long since it was found against the 10 minute target, and the connection */}
      <Plate x={24} y={157} w={1392} h={202} />
      <Label x={57} y={203}>
        Best block
      </Label>
      <text x={55} y={277} fontSize={72} fontWeight={600} letterSpacing="-0.025em">
        59,002
      </text>
      <circle cx={61} cy={318} r={4} fill={C.brand} />
      <text x={73} y={322} fontFamily={MONO} fontSize={12} fill={C.muted}>
        Live, 3 ms to the server
      </text>
      <text x={track.x} y={233} fontSize={18}>
        Found <tspan fontWeight={600}>13 s</tspan> ago
      </text>
      <circle cx={1056} cy={228} r={4} fill={C.brand} />
      <text x={1383} y={233} textAnchor="end" fill={C.muted}>
        On schedule. 98% of blocks take longer than this.
      </text>
      <rect x={track.x} y={track.y} width={track.w} height={6} fill={C.border} />
      <rect x={track.x} y={track.y} width={fill} height={6} fill="url(#st-brand)" />
      {[1, 2].map((k) => (
        <rect key={k} x={track.x + (track.w * k) / 3} y={track.y - 4} width={1} height={14} fill={C.muted} fillOpacity={0.6} />
      ))}
      <g fontFamily={MONO} fontSize={11} fill={C.muted}>
        <text x={track.x} y={283}>
          0
        </text>
        <text x={track.x + track.w / 3} y={283} textAnchor="middle">
          10 min target
        </text>
        <text x={track.x + (track.w * 2) / 3} y={283} textAnchor="middle">
          20 min
        </text>
        <text x={track.x + track.w} y={283} textAnchor="end">
          30 min
        </text>
      </g>

      {/* The section bar: each section's index and name; Market marked for its thin trading */}
      <line x1={0} x2={W} y1={416.5} y2={416.5} stroke={C.border} />
      <g fontFamily={MONO} fontSize={11} letterSpacing="0.05em">
        {nav.map(([index, ix, title, tx]) => (
          <g key={index}>
            <text x={ix} y={400} fill={C.muted} fillOpacity={0.6}>
              {index}
            </text>
            <text x={tx} y={400} fill={C.muted}>
              {title.toUpperCase()}
            </text>
          </g>
        ))}
      </g>
      <circle cx={443.5} cy={396} r={3} fill={C.warn} />

      <SectionHeading />

      {/* Block time: the 7 day mean against the target, with the switch to the last 40 blocks */}
      <Tile
        col={0}
        y={521}
        h={313}
        title={
          <g>
            <circle cx={49} cy={551} r={4} fill={C.brand} />
            <Label x={59} y={555}>
              Block time
            </Label>
          </g>
        }
        readout={
          <g fontFamily={MONO} fontSize={10} letterSpacing="0.05em">
            <rect x={216.5} y={541.5} width={122} height={19} fill="none" stroke={C.border} />
            <rect x={217} y={542} width={52} height={18} fill={C.fg} fillOpacity={0.1} />
            <text x={243} y={555} textAnchor="middle">
              7 DAYS
            </text>
            <text x={304} y={555} textAnchor="middle" fill={C.muted}>
              40 BLOCKS
            </text>
          </g>
        }
        value="10 min 00 s"
        note={["mean of the last 7 days, target 10 min"]}
      >
        <Trend x0={45} y0={662} w={294} h={150} values={BLOCK_TIME} format={blockTime} />
      </Tile>

      <Tile
        col={1}
        y={521}
        h={313}
        title={
          <Label x={397} y={555}>
            Network hashrate
          </Label>
        }
        readout={
          <text x={691} y={555} textAnchor="end" fontSize={12} fill={C.muted}>
            last 7 days
          </text>
        }
        value="23.8 GH/s"
        note={["estimated over the last 24 hours"]}
      >
        <Trend x0={397} y0={662} w={294} h={150} values={HASHRATE} format={(v) => `${v.toFixed(1)} GH/s`} />
      </Tile>

      <Tile
        col={2}
        y={521}
        h={313}
        title={
          <Label x={749} y={555}>
            Difficulty
          </Label>
        }
        readout={
          <text x={1043} y={555} textAnchor="end" fontSize={12} fill={C.muted}>
            last 7 days
          </text>
        }
        value="12.11 TH"
        note={["next block, 2820.08 in pool units"]}
      >
        <Trend x0={749} y0={662} w={294} h={150} values={DIFFICULTY} format={(v) => `${v.toFixed(2)} TH`} />
      </Tile>

      {/* Decentralization, over both rows: how many miners hold a majority, each one's share, the largest by name */}
      <Tile
        col={3}
        y={521}
        h={420}
        title={
          <Label x={1101} y={555}>
            Decentralization
          </Label>
        }
        readout={
          <text x={1395} y={555} textAnchor="end" fontSize={12} fill={C.muted}>
            last 7 days
          </text>
        }
        note={["6 miners together hold a majority of 1,008", "blocks"]}
      >
        <circle cx={1106} cy={594} r={5} fill={C.brand} />
        <text x={1121} y={604} fontSize={30}>
          Healthy
        </text>
        <g transform={`translate(${donut.cx - 88} ${donut.cy - 88}) scale(${176 / 120}) rotate(-90 60 60)`}>
          {slices.map((s, i) => (
            <circle
              key={i}
              cx={60}
              cy={60}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={16}
              strokeDasharray={`${Math.max(0, (s.blocks / TOTAL) * circumference - 1.5)} ${circumference}`}
              strokeDashoffset={-starts[i]}
            />
          ))}
        </g>
        <text x={donut.cx} y={donut.cy - 2} textAnchor="middle" fontSize={24}>
          13
        </text>
        <text x={donut.cx} y={donut.cy + 17} textAnchor="middle" fontSize={10} letterSpacing="0.05em" fill={C.muted}>
          MINERS
        </text>
        {MINERS.slice(0, 2).map((m, i) => {
          const cy = 880 + i * 26
          return (
            <g key={m.label} fontSize={12}>
              <rect x={1101} y={cy - 5} width={10} height={10} rx={2} fill={SLICE[i]} />
              <text x={1121} y={cy + 4} fontFamily={MONO} fill={C.muted}>
                {m.label}
              </text>
              <text x={1395} y={cy + 4} textAnchor="end">
                {Math.round((m.blocks / TOTAL) * 100)}%
              </text>
            </g>
          )
        })}
      </Tile>

      {/* The second row, its headings only in view */}
      {[
        [0, "Hashprice"],
        [1, "Security budget"],
      ].map(([col, title]) => {
        const x = COL[col as number]
        return (
          <g key={title}>
            <Plate x={x} y={850} w={TILE_W} h={80} />
            <Label x={x + 21} y={883}>
              {title as string}
            </Label>
            <text x={x + 299} y={883} textAnchor="end" fontSize={12} fill={C.muted}>
              7 days · CoinGecko
            </text>
            <ArrowOut x={x + 303} cy={879} />
          </g>
        )
      })}
      <Plate x={728} y={850} w={TILE_W} h={80} />
      <Label x={749} y={883}>
        Recommended confirmations
      </Label>
      <text x={1025} y={883} textAnchor="end" fontSize={12} fill={C.muted}>
        method
      </text>
      <g transform="translate(1029 873) scale(0.75)" fill="none" stroke={C.muted} strokeWidth={1.5}>
        <circle cx={8} cy={8} r={6.25} />
        <path d="M8 7.2v4M8 4.9v.1" strokeLinecap="round" />
      </g>
    </svg>
  )
}
