import {
  GEIST_LIGHT,
  GEIST_MEDIUM,
  LOGO_MARK,
  OG_WORDMARK,
  OG_WORDMARK_SIZE,
} from "@/lib/brand"
import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

/**
 * The Open Graph card, in the homepage hero's style: black, a faint glow in
 * the logo's colours, the hero's depth wordmark (a capture, see
 * assets/og/README.md) and the site's two-tone headings — a medium lead over
 * a light tail. Without a query it renders the site-wide brand card, the
 * hero itself; with `?title=` a per-page card, the title above the wordmark
 * cropped along the floor as in the site footer. Rendered per request (the
 * CDN caches each URL), hence no `force-static`.
 */
export const dynamic = "force-dynamic"

const SIZE = { width: 1200, height: 630 }

const FOREGROUND = "#ffffff"
const HAIRLINE = "rgba(255, 255, 255, 0.12)"
const BRAND_GRADIENT = "linear-gradient(90deg, #00ff80 0%, #0080ff 100%)"

// Titled cards: the title is part of the URL, so a card never changes in
// place — cache for a year. The bare brand card CAN change in place (its
// content is edited without the URL changing), so give it a day instead;
// a redesign then rolls out on its own instead of needing an edge purge.
const CACHE_CONTROL_TITLED = "public, max-age=31536000, immutable"
const CACHE_CONTROL_BRAND = "public, max-age=86400"

const FONTS = [
  { name: "Geist", data: GEIST_MEDIUM, weight: 500 as const, style: "normal" as const },
  { name: "Geist", data: GEIST_LIGHT, weight: 300 as const, style: "normal" as const },
]

const PAD = 64
// Title cards: the headline runs the full content width. Page titles top
// out around 32 characters ("Parallax for Ethereum Developers"); blog posts
// bring their own cover images instead of a generated card.
const COLUMN = 1072

/** Splits a title into a medium lead and a light tail at the word boundary
 *  nearest the middle, as the site's TwoToneTitle does. Titles of three
 *  words or fewer stay whole. */
function twoTone(text: string): [string, string] {
  const words = text.trim().split(/\s+/)
  if (words.length < 4) return [text, ""]
  const half = text.length / 2
  let best = 1
  let bestDistance = Infinity
  let running = 0
  for (let i = 0; i < words.length - 1; i++) {
    running += words[i].length + 1
    const distance = Math.abs(running - half)
    if (distance < bestDistance) {
      bestDistance = distance
      best = i + 1
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")]
}

function Frame({ children, wordmark = true }: { children: React.ReactNode; wordmark?: boolean }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#000" }}>
      {/* The site's aurora: soft light in the logo's colours, low on the right */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: SIZE.width,
          height: SIZE.height,
          backgroundImage:
            "radial-gradient(circle at 96% 96%, rgba(0,128,255,0.42), rgba(0,0,0,0) 52%), radial-gradient(circle at 72% 112%, rgba(0,255,128,0.30), rgba(0,0,0,0) 46%), radial-gradient(circle at 100% 0%, rgba(0,200,200,0.14), rgba(0,0,0,0) 40%)",
        }}
      />

      {/* The nav wordmark */}
      {wordmark && (
      <div style={{ position: "absolute", top: NAV_TOP, left: PAD, display: "flex", alignItems: "center", gap: 18 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_MARK} width={50} height={50} alt="" />
        <div style={{ fontFamily: "Geist", fontWeight: 500, fontSize: 46, letterSpacing: -1.8, color: FOREGROUND }}>
          Parallax
        </div>
      </div>
      )}

      {children}

      {/* The site's hairline floor, lit at the left by the logo gradient */}
      <div style={{ position: "absolute", left: 0, bottom: 0, width: SIZE.width, height: 1, background: HAIRLINE }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 240, height: 3, background: BRAND_GRADIENT }} />
    </div>
  )
}

/* The title, centred vertically in the band from `top` to `bottom` (card
   coordinates). Pulled left by the font's side bearing, which grows with
   size, so the first letter lines up with the logo above it. */
function Headline({ lead, tail, size, top, bottom }: { lead: string; tail: string; size: number; top: number; bottom: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: PAD - Math.round(size * 0.03),
        top,
        height: bottom - top,
        width: COLUMN,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", fontFamily: "Geist", fontSize: size, lineHeight: 1.04, letterSpacing: -size * 0.035, color: FOREGROUND }}>
        {/* Balanced, so a wrapped half doesn't strand one word on a line */}
        <div style={{ fontWeight: 500, textWrap: "balance" }}>{lead}</div>
        {tail && <div style={{ fontWeight: 300, textWrap: "balance" }}>{tail}</div>}
      </div>
    </div>
  )
}

// The depth wordmark across the card, at the content width.
const WORD_W = SIZE.width - PAD * 2
const WORD_H = Math.round((WORD_W * OG_WORDMARK_SIZE.height) / OG_WORDMARK_SIZE.width)

/* The hero itself: the depth wordmark full width, the subtitle light under
   it. No nav wordmark — the big one already names the card. */
function brandCard() {
  return (
    <Frame wordmark={false}>
      {/* The wordmark is the brand here: it and the subtitle, centred on the card */}
      <div style={{ position: "absolute", left: PAD, top: 0, height: SIZE.height, width: WORD_W, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={OG_WORDMARK} width={WORD_W} height={WORD_H} alt="" />
        <div style={{ marginTop: 36, fontFamily: "Geist", fontWeight: 300, fontSize: 52, lineHeight: 1.08, letterSpacing: -1.6, color: FOREGROUND }}>
          A peer-to-peer programmable cash system.
        </div>
      </div>
    </Frame>
  )
}

// Title cards' floor wordmark: wider than the card, so it bleeds, and only a
// third cropped, so the letters read.
const FLOOR_W = SIZE.width + 160
const FLOOR_CROP = 0.32
const FLOOR_H = Math.round((FLOOR_W * OG_WORDMARK_SIZE.height) / OG_WORDMARK_SIZE.width)

// The band the title is centred in: from under the nav wordmark to the top
// of the floor wordmark's visible part.
const NAV_TOP = 52
const NAV_BOTTOM = NAV_TOP + 50
const FLOOR_TOP = SIZE.height - (FLOOR_H - Math.round(FLOOR_H * FLOOR_CROP))

function titleCard(title: string) {
  const [lead, tail] = twoTone(title)
  // Largest size whose estimated wrapped height fits between the nav
  // wordmark and the floor wordmark, keeping at least 40px clear above and
  // below (≤ 270px of headline in a ~357px band). The 0.53em average glyph width is
  // Geist Medium's at these sizes.
  const fontSize = (() => {
    for (const size of [132, 120, 108, 96, 88, 80, 72, 64, 58, 52, 46, 40]) {
      const charsPerLine = Math.max(1, Math.floor(COLUMN / (0.53 * size)))
      const lines = [lead, tail].filter(Boolean).reduce((n, part) => n + Math.ceil(part.length / charsPerLine), 0)
      if (lines * 1.04 * size <= 270) return size
    }
    return 36
  })()

  return (
    <Frame>
      {/* The depth wordmark cropped by the floor, faint, as in the site footer */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={OG_WORDMARK}
        width={FLOOR_W}
        height={FLOOR_H}
        alt=""
        style={{ position: "absolute", left: (SIZE.width - FLOOR_W) / 2, bottom: -Math.round(FLOOR_H * FLOOR_CROP), opacity: 0.6 }}
      />
      <Headline lead={lead} tail={tail} size={fontSize} top={NAV_BOTTOM} bottom={FLOOR_TOP} />
    </Frame>
  )
}

export function GET(request: NextRequest) {
  // The card renders whatever it is given, so keep it to one plain short line.
  const title = (request.nextUrl.searchParams.get("title") ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120)

  return new ImageResponse(title ? titleCard(title) : brandCard(), {
    ...SIZE,
    fonts: FONTS,
    headers: { "Cache-Control": title ? CACHE_CONTROL_TITLED : CACHE_CONTROL_BRAND },
  })
}
