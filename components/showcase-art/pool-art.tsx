/* Parallax Pool's overview, drawn as SVG from the pool's own web interface
   (miningcore/ui/src: styles.css, App.tsx, pages/Overview.tsx,
   components/LockboxGrid.tsx, components/ui.tsx) rather than captured: its
   dark tokens, the header with its clock, the hashrate plate with its block
   clock and facts, and the last 100 blocks. The figures are the staged
   mainnet-scale ones it was first captured with. The brand is set as the
   website's header sets it. One unit is one CSS pixel of a 1440×690
   viewport. */

const W = 1440
const H = 690

// styles.css, prefers-color-scheme: dark
const C = {
  bg: "#06070d",
  fg: "#ece9e3",
  plate: "#0e1017",
  muted: "#8a8f9e",
  border: "rgb(255 255 255 / 8%)",
  track: "rgb(255 255 255 / 8%)",
  cell: "#1b1e29",
  brand: "#19e68c",
  good: "#19e68c",
  critical: "#f0605a",
  markFrom: "#00ff80",
  markTo: "#0080ff",
}

const SANS = "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
const MONO = "var(--font-geist-mono), ui-monospace, monospace"

const LOGO =
  "m 171.48919,103.57486 -0.0214,30.61331 108.49225,-62.638032 0.007,-0.004 0.007,0.01164 52.90338,30.543593 -26.45177,15.27194 -26.46448,15.27987 1.8e-4,-7e-4 -108.53587,62.66321 -0.0213,30.51422 0.0429,0.0247 211.66649,-122.2057 -105.70521,-61.127344 z m 26.39475,137.56774 79.35321,45.88867 105.91862,-61.05365 0.0215,-30.71125 -110.18258,63.61394 -0.003,-0.005 -26.45194,-15.27225 26.45847,-15.27581 110.20048,-63.62427 0.0213,-30.56377 z"

// The page column's left edge: max-w-[1240px] with px-6, centred
const X0 = 124

// The last 100 blocks, oldest first, ten to a row: the pool's own, by row and column, as captured.
// Mining 60,561, so the grid runs 60,461 to 60,560; the newest of the pool's (row 9, column 8) is recent
const FIRST = 60461
const MINE: [number, number][] = [
  [1, 0],
  [2, 3], [2, 4], [2, 8],
  [3, 0], [3, 1], [3, 6], [3, 8],
  [4, 3],
  [5, 4],
  [6, 2], [6, 5],
  [7, 3], [7, 7],
  [9, 4], [9, 7], [9, 8],
]
const NEWEST = "9-8"

// Header nav: [label, text x, text width]
const NAV = [
  ["Overview", 550, 65.7],
  ["Blocks", 639.7, 47.5],
  ["Payments", 711.2, 69.4],
  ["Connect", 804.6, 59.2],
] as const

const FACTS = [
  ["Miners online", "37", null],
  ["Network share", "15.1%", "of 5.57 GH/s"],
  ["Current round", "62%", "of expected work"],
  ["Blocks found", "412", "last 20 min ago"],
] as const

/* .brackets on a lit plate: four 10px corners in the brand green, over the plate's own corners */
function Brackets({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const s = 10
  return (
    <g fill={C.brand}>
      <rect x={x} y={y} width={s} height={1} />
      <rect x={x} y={y} width={1} height={s} />
      <rect x={x + w - s} y={y} width={s} height={1} />
      <rect x={x + w - 1} y={y} width={1} height={s} />
      <rect x={x} y={y + h - 1} width={s} height={1} />
      <rect x={x} y={y + h - s} width={1} height={s} />
      <rect x={x + w - s} y={y + h - 1} width={s} height={1} />
      <rect x={x + w - 1} y={y + h - s} width={1} height={s} />
    </g>
  )
}

/* Plate: a square sheet on a hairline border */
function Plate({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h - 1} fill={C.plate} stroke={C.border} />
}

/* Label: the site's small heading, mono, uppercase, widely tracked */
function Label({ x, y, children, anchor }: { x: number; y: number; children: string; anchor?: "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontFamily={MONO} fontSize={11} letterSpacing="0.15em" fill={C.muted}>
      {children.toUpperCase()}
    </text>
  )
}

export function PoolOverviewArt({ alt }: { alt: string }) {
  // The hero plate and the grid's, side by side with gap-6, stretched to one height
  const hero = { x: X0, y: 108, w: 664, h: 527 }
  const grid = { x: 812, y: 108, w: 504, h: 527 }
  const hx = hero.x + 33
  const hr = hero.x + hero.w - 33
  const track = { x: hx, w: hr - hx, y: 414 }
  const gx = grid.x + 29
  const gr = grid.x + grid.w - 29
  const cellX = gx + 48
  const step = (gr - cellX + 4) / 10
  const cell = step - 4
  const mine = new Set(MINE.map(([r, c]) => `${r}-${c}`))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={alt} className="block h-auto w-full select-none" fontFamily={SANS} fontSize={15} fill={C.fg}>
      <defs>
        <linearGradient id="pl-logo" gradientUnits="userSpaceOnUse" x1="224.35812" y1="73.057472" x2="330.26605" y2="256.49536">
          <stop offset="0" stopColor="#00ff80" />
          <stop offset="1" stopColor="#0080ff" />
        </linearGradient>
        {/* .brand-gradient-mark: 135°, from the logo's green to its blue */}
        <linearGradient id="pl-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.markFrom} />
          <stop offset="1" stopColor={C.markTo} />
        </linearGradient>
        <linearGradient id="pl-mark-x" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={C.markFrom} />
          <stop offset="1" stopColor={C.markTo} />
        </linearGradient>
        <filter id="pl-ring-glow" colorInterpolationFilters="sRGB" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>

      <rect width={W} height={H} fill={C.bg} />

      {/* Header: the brand, the network pill, the nav with its underline, the address lookup */}
      {/* As the website's header draws it: a 32px mark, then the name 12px on at 30px, medium, -0.04em */}
      <g transform={`translate(${X0} 16) scale(0.12094)`}>
        <path transform="translate(-145.01123,-32.460674)" fill="url(#pl-logo)" d={LOGO} />
      </g>
      <text x={X0 + 44} y={42.5} fontSize={30} fontWeight={500} letterSpacing="-0.04em">
        Parallax Pool
      </text>

      <rect x={364.5} y={20.5} width={145} height={22} fill="none" stroke={C.border} />
      <circle cx={378} cy={31.5} r={3.5} fill={C.brand} />
      <text x={389} y={35.5} fontFamily={MONO} fontSize={11} letterSpacing="0.12em" fill={C.muted}>
        MAINNET · LIVE
      </text>

      {NAV.map(([label, x, w], i) => (
        <g key={label}>
          <text x={x} y={37.5} fontWeight={500} fill={i === 0 ? C.fg : C.muted}>
            {label}
          </text>
          {i === 0 && <rect x={x} y={63} width={w} height={2} fill="url(#pl-mark-x)" />}
        </g>
      ))}

      <rect x={1016.5} y={10.5} width={299} height={43} rx={4} fill={C.plate} stroke={C.border} />
      <text x={1031} y={36.5} fontFamily={MONO} fontSize={13} fill={C.muted}>
        Look up an address (0x…)
      </text>

      {/* HeaderClock: time since the last block (5:42) along the header's foot, toward three target intervals */}
      <rect x={0} y={64} width={W} height={2} fill={C.track} />
      <rect x={0} y={64} width={W * (342 / 1800)} height={2} fill="url(#pl-mark-x)" />
      <rect x={0} y={66} width={W} height={1} fill={C.border} />

      {/* The hashrate plate, lit */}
      <Plate {...hero} />
      <Brackets x={hero.x - 1} y={hero.y - 1} w={hero.w + 2} h={hero.h + 2} />
      <Label x={hx} y={152}>
        Pool hashrate
      </Label>
      <text x={hx} y={240} fontSize={92} fontWeight={600} letterSpacing="-0.045em">
        842
        <tspan dx={10} fontSize={32} fontWeight={500} letterSpacing="-0.01em" fill={C.muted}>
          MH/s
        </tspan>
      </text>

      <text fontSize={17} fill={C.muted}>
        <tspan x={hx} y={295.5}>
          At this hashrate the pool finds a block about every{" "}
          <tspan fontWeight={600} fill={C.fg}>
            1.3 h
          </tspan>
          , on average. A
        </tspan>
        <tspan x={hx} y={321}>
          shared pool: block rewards are split with PPLNS, 1% fee, paid out from 1
        </tspan>
        <tspan x={hx} y={346.5}>
          LAX.
        </tspan>
      </text>

      {/* BlockClock: the block being mined and the wait for it, against the 10 minute target */}
      <text x={hx} y={399}>
        Mining block{" "}
        <tspan fontWeight={600}>60,561</tspan> · last one <tspan fontWeight={600}>5:42</tspan> ago
      </text>
      <circle cx={hr - 234.5 - 12} cy={395} r={4} fill={C.good} />
      <text x={hr} y={399} textAnchor="end" fontSize={13} fill={C.muted}>
        On schedule. 56% of blocks take longer
      </text>
      <rect x={track.x} y={track.y} width={track.w} height={6} fill={C.track} />
      <rect x={track.x} y={track.y} width={track.w * (342 / 1800)} height={6} fill="url(#pl-mark-x)" />
      {[1, 2].map((i) => (
        <rect key={i} x={track.x + (track.w * i) / 3} y={track.y - 4} width={1} height={14} fill={C.muted} opacity={0.6} />
      ))}
      {["0", "10 min target", "20 min", "30 min"].map((tick, i) => (
        <text key={tick} x={track.x + (track.w * i) / 3} y={442} textAnchor={i === 0 ? "start" : i === 3 ? "end" : "middle"} fontFamily={MONO} fontSize={11} fill={C.muted}>
          {tick}
        </text>
      ))}

      {/* Facts: a row of figures under a hairline */}
      <rect x={hx} y={516} width={hr - hx} height={1} fill={C.border} />
      {FACTS.map(([label, value, note], i) => {
        const x = hx + i * (((hr - hx) - 48) / 4 + 16)
        return (
          <g key={label}>
            <text x={x} y={544.5} fontFamily={MONO} fontSize={11} letterSpacing="0.12em" fill={C.muted}>
              {label.toUpperCase()}
            </text>
            <text x={x} y={574} fontSize={22} fontWeight={600} letterSpacing="-0.02em">
              {value}
            </text>
            {note && (
              <text x={x} y={597} fontSize={12} fill={C.muted}>
                {note}
              </text>
            )}
          </g>
        )
      })}

      {/* LockboxGrid: the last 100 blocks, 10 by 10, the pool's own lit */}
      <Plate {...grid} />
      <Label x={gx} y={150}>
        Last 100 blocks
      </Label>
      <text x={gr} y={150} textAnchor="end" fontSize={13} fill={C.muted}>
        Next reward unlocks in{" "}
        <tspan fontWeight={500} fill={C.fg}>
          11 blocks
        </tspan>
        , ~1.8 h
      </text>

      {Array.from({ length: 10 }, (_, r) => {
        const y = 171 + r * step
        return (
          <g key={r}>
            <text x={cellX - 12} y={y + cell / 2 + 3.5} textAnchor="end" fontFamily={MONO} fontSize={10} fill={C.muted}>
              {(FIRST + r * 10).toLocaleString("en")}
            </text>
            {Array.from({ length: 10 }, (_, c) => {
              const x = cellX + c * step
              const key = `${r}-${c}`
              if (!mine.has(key)) return <rect key={c} x={x} y={y} width={cell} height={cell} rx={2} fill={C.cell} />
              return (
                <g key={c}>
                  {/* The newest of the pool's blocks, while recent: a ring and a glow in the logo's green */}
                  {key === NEWEST && (
                    <>
                      <rect x={x - 3} y={y - 3} width={cell + 6} height={cell + 6} rx={4} fill={C.markFrom} opacity={0.55} filter="url(#pl-ring-glow)" />
                      <rect x={x - 2.5} y={y - 2.5} width={cell + 5} height={cell + 5} rx={4} fill={C.plate} stroke={C.markFrom} />
                    </>
                  )}
                  <rect x={x} y={y} width={cell} height={cell} rx={2} fill="url(#pl-mark)" />
                </g>
              )
            })}
          </g>
        )
      })}

      {/* Legend */}
      <g fontSize={13} fill={C.muted}>
        <rect x={gx} y={591.5} width={11} height={11} rx={2} fill="url(#pl-mark)" />
        <text x={gx + 17} y={601.5}>
          Found by this pool
        </text>
        <rect x={gx + 17 + 109.3 + 18} y={591.5} width={11} height={11} rx={2} fill={C.cell} />
        <text x={gx + 17 + 109.3 + 18 + 17} y={601.5}>
          Other miners
        </text>
        <rect x={gx + 2 * (17 + 18) + 109.3 + 77.2 + 0.75} y={592.25} width={9.5} height={9.5} rx={1.5} fill="none" stroke={C.critical} strokeWidth={1.5} />
        <text x={gx + 3 * 17 + 2 * 18 + 109.3 + 77.2} y={601.5}>
          Orphaned
        </text>
      </g>
    </svg>
  )
}
