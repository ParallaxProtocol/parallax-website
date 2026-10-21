/* Hashwarp's two faces, drawn as SVG from its own code (ParallaxProtocol/hashwarp)
   rather than captured: the console the miner prints to (hashwarp/Console.cpp's
   summary line and stats table, libdevcore/Log.cpp's line prefix, the share
   line of libpoolprotocols/PoolManager.cpp, in libdevcore/Terminal.h's ANSI
   colours as a dark terminal theme shows them), and the dashboard it serves
   (libapicore/HttpApi.cpp's page, in its dark scheme). Readings are a rig1
   session on a four-rig farm, as captured. */

const SANS = "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
const MONO = "var(--font-geist-mono), ui-monospace, monospace"

/* ---------------------------------------------------------------- console */

// The terminal: 1163×853, a title bar, then a 140-column grid of 13.44px mono
const CW = 1163
const CH = 853
const COL = 8.066
const X0 = 16.3
const LINE0 = 62.6
const LEAD = 20.24

// Terminal.h's colours, as the captured terminal's theme draws them
const T = {
  bg: "#1b1f24",
  bar: "#22252d",
  barLine: "#2f323a",
  title: "#92959f",
  fg: "#c9ccd2",
  white: "#e6e9ef", // EthWhite, EthWhiteBold
  coal: "#636970", // EthCoal: the timestamp
  lime: "#b4cd9f", // EthLime: INFO, ✔ accepted
  teal: "#72b3c0", // EthTealBold: the hashrate
}

type Seg = [text: string, color?: string, bold?: boolean]

const padL = (s: string, w: number) => s + " ".repeat(Math.max(0, w - s.length))
const padR = (s: string, w: number) => " ".repeat(Math.max(0, w - s.length)) + s

// Log.cpp: "HH:MM:SS  INFO  miner  " — coal time, lime level, the source in its colour
function prefix(time: string, source: string): Seg[] {
  return [[time, T.coal], ["  "], ["INFO ", T.lime], [" "], [padL(source, 5), T.white], ["  "]]
}

// Console.cpp statsTable: the header row, bold white
const header = (time: string): Seg[] => [
  ...prefix(time, "miner"),
  [padL("GPU", 6) + padL("Name", 26) + padR("MH/s", 10) + padR("60s", 9) + padR("15m", 9) + padR("Shares", 12) + padR("Temp", 6) + padR("Fan", 5) + padR("Power", 7) + padR("kH/J", 7) + padR("Clocks", 12), T.white, true],
]

// One GPU's row of the table
function row(time: string, [hr, h60, h15, shares, fan, watts, khj]: string[]): Seg[] {
  return [
    ...prefix(time, "miner"),
    [padL("gpu0", 6) + padL("NVIDIA GeForce RTX 4090", 26) + padR(hr, 10) + padR(h60, 9) + padR(h15, 9) + padR(shares, 12) + padR("71°C", 6) + padR(fan + "%", 5) + padR(watts + "W", 7) + padR(khj, 7) + padR("2775/10251", 12)],
  ]
}

// The table's last line: the pool, the effective rate, uptime, and the epoch's end
const pool = (time: string, eff: string, up: string): Seg[] => [...prefix(time, "miner"), [`Pool prlx.coolpool.top:3003 diff 8.59 GH, effective ${eff} MH/s, up ${up}, epoch 83 (next in 433 blocks, ~72 h)`]]

// reportLines: the periodic summary, a single GPU's sensors on the same line
function farm(time: string, [hr, h60, h15, eff, shares, fan, watts, khj]: string[]): Seg[] {
  return [...prefix(time, "miner"), [`${hr} MH/s`, T.teal, true], [` · 60s ${h60} · 15m ${h15} · eff ${eff} · `], [shares, T.white, true], [` · 71°C · fan ${fan}% · ${watts} W · ${khj} kH/J`]]
}

// PoolManager: an accepted share
const share = (time: string, ms: string, shares: string): Seg[] => [...prefix(time, "share"), ["✔ accepted", T.lime], [` gpu0 · diff 8.59 GH · ${ms} ms · ${shares}`]]

// Every minute the table; every 10 s the summary; shares as they're found
const table = (time: string, r: string[], eff: string, up: string) => [header(time), row(time, r), pool(time, eff, up)]

const CONSOLE: Seg[][] = [
  ...table("05:56:50", ["115.39", "115.79", "116.21", "A19 R1", "54", "377", "306"], "152.71", "0:17"),
  farm("05:57:00", ["115.41", "115.66", "116.20", "143.17", "A19 R1", "53", "377", "306"]),
  farm("05:57:10", ["115.46", "115.52", "116.19", "133.62", "A19 R1", "53", "378", "306"]),
  share("05:57:14", "364", "A20 R1"),
  farm("05:57:20", ["115.42", "115.43", "116.18", "133.62", "A20 R1", "53", "377", "306"]),
  share("05:57:27", "321", "A21 R1"),
  farm("05:57:30", ["115.43", "115.45", "116.17", "133.62", "A21 R1", "53", "377", "306"]),
  farm("05:57:40", ["115.44", "115.43", "116.16", "143.17", "A21 R1", "54", "377", "306"]),
  ...table("05:57:50", ["115.43", "115.43", "116.15", "A21 R1", "54", "377", "306"], "143.17", "0:18"),
  farm("05:58:00", ["115.44", "115.44", "116.14", "143.17", "A21 R1", "53", "377", "306"]),
  farm("05:58:10", ["115.46", "115.45", "116.14", "143.17", "A21 R1", "53", "377", "306"]),
  farm("05:58:20", ["115.50", "115.45", "116.13", "143.17", "A21 R1", "54", "378", "306"]),
  farm("05:58:30", ["115.49", "115.46", "116.12", "143.17", "A21 R1", "54", "378", "306"]),
  farm("05:58:40", ["115.42", "115.47", "116.11", "143.17", "A21 R1", "53", "377", "306"]),
  ...table("05:58:50", ["115.42", "115.47", "116.10", "A21 R1", "54", "378", "305"], "143.17", "0:19"),
  farm("05:59:00", ["113.21", "115.28", "116.08", "143.17", "A21 R1", "54", "378", "299"]),
  share("05:59:05", "300", "A22 R1"),
  farm("05:59:10", ["116.09", "115.22", "116.07", "143.17", "A22 R1", "54", "378", "307"]),
  farm("05:59:20", ["115.42", "115.21", "116.06", "152.71", "A22 R1", "54", "376", "307"]),
  farm("05:59:30", ["115.02", "115.09", "116.04", "152.71", "A22 R1", "54", "377", "305"]),
  farm("05:59:40", ["115.39", "115.08", "116.03", "152.71", "A22 R1", "54", "378", "306"]),
  ...table("05:59:50", ["115.45", "115.08", "116.03", "A22 R1", "54", "377", "306"], "152.71", "0:20"),
  farm("06:00:00", ["115.55", "115.27", "116.02", "152.71", "A22 R1", "54", "378", "306"]),
  farm("06:00:10", ["115.45", "115.33", "116.01", "152.71", "A22 R1", "54", "377", "306"]),
  farm("06:00:20", ["115.40", "115.34", "116.00", "152.71", "A22 R1", "54", "378", "305"]),
  farm("06:00:30", ["115.58", "115.47", "115.99", "152.71", "A22 R1", "54", "378", "306"]),
  share("06:00:39", "340", "A23 R1"),
  farm("06:00:40", ["115.49", "115.48", "115.99", "152.71", "A23 R1", "54", "377", "306"]),
  ...table("06:00:50", ["115.45", "115.49", "115.98", "A23 R1", "54", "377", "306"], "162.25", "0:21"),
]

/* A line on the grid: each run placed at its own column, so the columns hold
   whatever the font's advance. Runs of spaces are skipped, not drawn. */
function ConsoleLine({ segs, y }: { segs: Seg[]; y: number }) {
  let col = 0
  const runs: { x: number; text: string; color?: string; bold?: boolean }[] = []
  for (const [text, color, bold] of segs) {
    // Words joined by single spaces stay one run; wider gaps are the table's columns
    for (const m of text.matchAll(/\S+(?: \S+)*/g)) runs.push({ x: X0 + (col + (m.index ?? 0)) * COL, text: m[0], color, bold })
    col += [...text].length
  }
  return (
    <text y={y} fill={T.fg} xmlSpace="preserve">
      {runs.map((r, i) => (
        <tspan key={i} x={r.x} fill={r.color} fontWeight={r.bold ? 700 : undefined} textLength={[...r.text].length * COL} lengthAdjust="spacingAndGlyphs">
          {r.text}
        </tspan>
      ))}
    </text>
  )
}

export function HashwarpConsoleArt({ alt }: { alt: string }) {
  return (
    <svg viewBox={`0 0 ${CW} ${CH}`} role="img" aria-label={alt} className="block h-auto w-full select-none" fontFamily={MONO} fontSize={13.44}>
      <rect width={CW} height={CH} fill={T.bg} />
      {/* The terminal window's title bar */}
      <rect width={CW} height={34} fill={T.bar} />
      <line x1={0} y1={34.5} x2={CW} y2={34.5} stroke={T.barLine} />
      <circle cx={19.8} cy={17.4} r={6} fill="#ff6059" />
      <circle cx={39.6} cy={17.4} r={6} fill="#ffbf2c" />
      <circle cx={59.9} cy={17.4} r={6} fill="#27c840" />
      <text x={CW / 2} y={21.8} textAnchor="middle" fontFamily={SANS} fontSize={13} fill={T.title}>
        hashwarp — rig1
      </text>
      {CONSOLE.map((segs, i) => (
        <ConsoleLine key={i} segs={segs} y={LINE0 + i * LEAD} />
      ))}
    </svg>
  )
}

/* -------------------------------------------------------------- dashboard */

// HttpApi.cpp's dark scheme (prefers-color-scheme: dark)
const D = {
  bg: "#0f1216",
  card: "#171b21",
  text: "#e6e9ed",
  muted: "#97a0aa",
  line: "#262c34",
  accent: "#6ea2ff",
  ok: "#43c37a",
}

// main: max-width 1200 centred, padding 16; tiles four to a row, 12 apart
const MX = 136
const MR = 1304
const TILE_W = 283
const tileX = (i: number) => MX + i * (TILE_W + 12)

type Col = { x: number; right?: boolean }
type Cell = string | [text: string, dot?: boolean]

/* A .tile: its label, its value, and the hashrate's sparkline under it. */
function Tile({ x, y, label, value, spark }: { x: number; y: number; label: string; value: string; spark?: number[] }) {
  // svg.spark: 28px tall, the polyline on a 120×40 box stretched to fit
  const sx = (TILE_W - 26) / 120
  const sy = 28 / 40
  const top = y + 66.3
  return (
    <g>
      <rect x={x + 0.5} y={y + 0.5} width={TILE_W - 1} height={105} rx={8} fill={D.card} stroke={D.line} />
      <text x={x + 13} y={y + 25.5} fontSize={12} letterSpacing="0.04em" fill={D.muted}>
        {label.toUpperCase()}
      </text>
      <text x={x + 13} y={y + 53} fontSize={22} fontWeight={600}>
        {value}
      </text>
      {spark && (
        <polyline
          fill="none"
          stroke={D.accent}
          strokeWidth={1.05}
          points={spark.map((v, i) => `${(x + 13 + ((i * 120) / (spark.length - 1)) * sx).toFixed(1)},${(top + (38 - v * 34) * sy).toFixed(2)}`).join(" ")}
        />
      )}
    </g>
  )
}

/* A .card table: a muted header row, then rows parted by hairlines. */
function Table({ y, cols, headCols = cols, head, rows, boldLast }: { y: number; cols: Col[]; headCols?: Col[]; head: string[]; rows: Cell[][]; boldLast?: boolean }) {
  const headH = 34.4
  const rowH = 37.3
  const h = 2 + headH + rows.length * rowH - 1
  const cell = (c: Col, text: string, baseline: number, size: number, weight?: number, fill?: string, key?: number) => (
    <text key={key} x={c.x} y={baseline} textAnchor={c.right ? "end" : "start"} fontSize={size} fontWeight={weight} fill={fill}>
      {text}
    </text>
  )
  return (
    <g>
      <rect x={MX + 0.5} y={y + 0.5} width={MR - MX - 1} height={h - 1} rx={8} fill={D.card} stroke={D.line} />
      {head.map((t, i) => cell(headCols[i], t, y + 22, 12, 500, D.muted, i))}
      {rows.map((r, j) => {
        const top = y + 1 + headH + j * rowH
        const bold = boldLast && j === rows.length - 1 ? 600 : undefined
        return (
          <g key={j}>
            <line x1={MX + 1} y1={top - 0.5} x2={MR - 1} y2={top - 0.5} stroke={D.line} />
            {r.map((c, i) => {
              const [text, dot] = typeof c === "string" ? [c] : c
              const col = cols[i]
              return dot ? (
                <g key={i}>
                  <circle cx={col.x + 4} cy={top + 18.6} r={4} fill={D.ok} />
                  {cell({ x: col.x + 14 }, text, top + 23, 14, bold)}
                </g>
              ) : (
                cell(col, text, top + 23, 14, bold, undefined, i)
              )
            })}
          </g>
        )
      })}
    </g>
  )
}

// The rigs' table: first two columns left, the rest right; Pool's cells sit left (td.left) under a right header
const RIG_COLS: Col[] = [{ x: 147 }, { x: 273 }, { x: 484.6, right: true }, { x: 610, right: true }, { x: 723.6, right: true }, { x: 784.8, right: true }, { x: 861, right: true }, { x: 944.6, right: true }, { x: 998, right: true }, { x: 1018 }, { x: 1293, right: true }]
const RIG_HEAD_COLS: Col[] = [...RIG_COLS.slice(0, 9), { x: 1201, right: true }, RIG_COLS[10]]
const GPU_COLS: Col[] = [{ x: 147 }, { x: 227.5 }, { x: 643.7, right: true }, { x: 797, right: true }, { x: 884, right: true }, { x: 961, right: true }, { x: 1035, right: true }, { x: 1106.6, right: true }, { x: 1197, right: true }, { x: 1263, right: true }]

const POOL = "prlx.coolpool.top:3003"
const mining: Cell = ["mining", true]

// spark(): each reading over the history's max, nearly flat for a steady rig
const SPARK_FARM = [0.985, 0.99, 0.988, 0.992, 0.991, 0.989, 0.994, 0.993, 0.996, 0.995, 0.998, 0.997, 1, 0.999]
const SPARK_RIG = [0.982, 0.99, 0.986, 0.993, 0.99, 0.994, 0.989, 0.996, 0.993, 0.998, 0.995, 1, 0.997, 0.999]

export function HashwarpDashboardArt({ alt }: { alt: string }) {
  const W = 1440
  const H = 765
  // The rigs' table, under the farm's tiles; This rig's tiles and its GPUs under it
  const rigsY = 199
  const localTilesY = 468
  const gpusY = 590
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={alt} className="block h-auto w-full select-none" fontFamily={SANS} fontSize={14} fill={D.text}>
      <rect width={W} height={H} fill={D.bg} />

      {/* header: the name, the version, the pool and the uptime, on one baseline */}
      <rect width={W} height={58} fill={D.card} />
      <line x1={0} y1={58.5} x2={W} y2={58.5} stroke={D.line} />
      <text x={16} y={35} fontSize={18} fontWeight={700}>
        Hashwarp
      </text>
      <text x={123} y={35} fill={D.muted}>
        v2.0.0+commit.8289dfa9
      </text>
      <circle cx={309} cy={30.5} r={4} fill={D.ok} />
      <text x={319} y={35}>
        {POOL} · epoch 83
      </text>
      <text x={549} y={35} fill={D.muted}>
        up 0:16
      </text>

      {/* The farm: every rig this one watches */}
      <Tile x={tileX(0)} y={75} label="Rigs online" value="4 / 4" />
      <Tile x={tileX(1)} y={75} label="Total hashrate" value="930.37 MH/s" spark={SPARK_FARM} />
      <Tile x={tileX(2)} y={75} label="Total power" value="3016 W" />
      <Tile x={tileX(3)} y={75} label="Shares" value="60,773 / 151 rej" />
      <Table
        y={rigsY}
        cols={RIG_COLS}
        headCols={RIG_HEAD_COLS}
        head={["Rig", "Status", "Hashrate", "15m", "Shares", "GPUs", "Hottest", "Power", "kH/J", "Pool", "Uptime"]}
        rows={[
          ["rig1 (this rig)", mining, "116.25 MH/s", "116.21 MH/s", "17/1", "1", "71°C", "378 W", "308", POOL, "0:16"],
          ["rig2", mining, "231.66 MH/s", "232.36 MH/s", "7,529/18", "2", "73°C", "753 W", "307", POOL, "3d 5:19"],
          ["rig3", mining, "469.08 MH/s", "468.71 MH/s", "52,313/130", "4", "74°C", "1520 W", "309", POOL, "11d 2:19"],
          ["rig4", mining, "113.37 MH/s", "112.92 MH/s", "914/2", "1", "68°C", "365 W", "311", POOL, "19:19"],
          ["Total", "4/4 online", "930.37 MH/s", "930.19 MH/s", "60,773/151", "8", "", "3016 W", "308", "", ""],
        ]}
        boldLast
      />
      {/* This rig */}
      <text x={MX} y={454} fontSize={13} fontWeight={600} letterSpacing="0.04em" fill={D.muted}>
        THIS RIG
      </text>
      <Tile x={tileX(0)} y={localTilesY} label="Hashrate" value="116.25 MH/s" spark={SPARK_RIG} />
      <Tile x={tileX(1)} y={localTilesY} label="15 min average" value="116.21 MH/s" />
      <Tile x={tileX(2)} y={localTilesY} label="Effective (pool)" value="152.71 MH/s" />
      <Tile x={tileX(3)} y={localTilesY} label="Shares" value="17 / 1 rej" />
      <Table
        y={gpusY}
        cols={GPU_COLS}
        head={["GPU", "Name", "Hashrate", "15m", "Shares", "Temp", "Mem", "Fan", "Power", "kH/J"]}
        rows={[["gpu0", "NVIDIA GeForce RTX 4090", "116.25 MH/s", "116.21 MH/s", "17/1", "71°C", "–", "53%", "378 W", "308"]]}
      />

      <text x={W / 2} y={707.5} textAnchor="middle" fontSize={12} fill={D.muted}>
        Updates every 5 seconds ·{" "}
        <tspan fill={D.accent} textDecoration="underline">
          JSON
        </tspan>{" "}
        ·{" "}
        <tspan fill={D.accent} textDecoration="underline">
          Prometheus
        </tspan>
      </text>
    </svg>
  )
}
