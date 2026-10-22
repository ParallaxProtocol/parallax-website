/* BitCity (parallax.thebitcity.io), drawn as SVG from its own code
   (bitcity/lib: building/dimensions.ts, building/score.ts,
   building/window-palette.ts, app/globals.css) rather than captured: a
   night skyline where every building is an address. Footprints follow
   buildingFootprint's width buckets, heights the balance curve's long
   short tail and few towers, and lit windows the "neon" palette, the
   city's default. Seeded, so the server and client draw the same city. */

const W = 480
const H = 160
const GROUND = 148

// globals.css :root
const C = {
  void: "#050810",
  bg: "#080d1a",
  line: "rgba(140, 180, 255, 0.12)",
  lime: "#c0fe04",
}

// dimensions.ts: width bucket 1–5 → 14 + (w - 1) × 6 world units, 6 per floor
const UNIT = 0.5
const FLOOR = 6 * UNIT

// window-palette.ts "neon": hue 0.55–0.85, sat 0.5–0.8, light 0.65–0.85
function neon(seed: number) {
  const hue = (0.55 + (seed & 0xff) / 255 * 0.3) * 360
  const sat = (0.5 + ((seed >> 8) & 0xff) / 255 * 0.3) * 100
  const light = (0.65 + ((seed >> 16) & 0xff) / 255 * 0.2) * 100
  return `hsl(${hue.toFixed(0)} ${sat.toFixed(0)}% ${light.toFixed(0)}%)`
}

function mulberry32(a: number) {
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Building = { x: number; w: number; floors: number; seed: number; windows: { x: number; y: number }[] }

function city(): Building[] {
  const rand = mulberry32(2110)
  const out: Building[] = []
  let x = -4
  while (x < W) {
    const widthUnits = 1 + Math.floor(rand() * rand() * 5)
    const w = (14 + (widthUnits - 1) * 6) * UNIT * 1.6
    // score.ts: most of the chain sits low; a few holders tower
    const floors = Math.round(4 + rand() ** 3 * 34)
    const seed = Math.floor(rand() * 0xffffff)
    const cols = Math.max(1, Math.floor((w - 4) / 4))
    const windows: Building["windows"] = []
    for (let f = 1; f < floors; f++) {
      for (let c = 0; c < cols; c++) {
        // activity.ts: one window per active day; most stay dark
        if (rand() < 0.22) windows.push({ x: x + 2.5 + c * 4, y: GROUND - f * FLOOR - 1.5 })
      }
    }
    out.push({ x, w, floors, seed, windows })
    x += w + 1 + Math.floor(rand() * 3)
  }
  return out
}

const BUILDINGS = city()
const TALLEST = BUILDINGS.reduce((a, b) => (b.floors > a.floors ? b : a))

export function BitcityArt({ alt }: { alt: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={alt} className="block h-full w-full" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="bitcity-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.void} />
          <stop offset="1" stopColor={C.bg} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#bitcity-sky)" />
      {BUILDINGS.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={GROUND - b.floors * FLOOR} width={b.w} height={b.floors * FLOOR} fill={C.bg} stroke={C.line} strokeWidth={0.5} />
          {b.windows.map((w, j) => (
            <rect key={j} x={w.x} y={w.y} width={2} height={1.5} fill={neon(b.seed + j * 7919)} opacity={0.85} />
          ))}
        </g>
      ))}
      {/* ValidatorBeacons: the last block's miner flares, here in the city's lime accent */}
      <circle cx={TALLEST.x + TALLEST.w / 2} cy={GROUND - TALLEST.floors * FLOOR - 3} r={1.5} fill={C.lime} />
      <rect y={GROUND} width={W} height={H - GROUND} fill={C.void} />
      <line x1={0} x2={W} y1={GROUND + 0.25} y2={GROUND + 0.25} stroke={C.line} strokeWidth={0.5} />
    </svg>
  )
}
