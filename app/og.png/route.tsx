import {
  GEIST_LIGHT,
  GEIST_MEDIUM,
  GEIST_MONO_MEDIUM,
  LOGO_MARK,
  OG_BLACKHOLE_RIGHT,
} from "@/lib/brand"
import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

/**
 * The Open Graph card, laid out like the homepage hero: the black hole on
 * the right (a still of the hero's, see assets/og/README.md), the nav
 * wordmark top left, and a left-aligned two-tone headline — a medium lead
 * over a light tail, the site's heading voice. Without a query it renders
 * the site-wide brand card (the hero's own headline); with `?title=` it
 * renders a per-page variant with that title. Rendered per request (the
 * CDN caches each URL), hence no `force-static`.
 */
export const dynamic = "force-dynamic"

const SIZE = { width: 1200, height: 630 }

const FOREGROUND = "#ffffff"
const FAINT = "rgba(255, 255, 255, 0.4)"
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
  { name: "Geist Mono", data: GEIST_MONO_MEDIUM, weight: 500 as const, style: "normal" as const },
]

const PAD = 64
// The hole's glow starts about 600px in; the copy column stays well left of it.
const COLUMN = 500

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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={OG_BLACKHOLE_RIGHT} width={SIZE.width} height={SIZE.height} alt="" style={{ position: "absolute", top: 0, left: 0 }} />
      {/* Fade the hole's left edge into the copy column, as the hero does */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: SIZE.width,
          height: SIZE.height,
          background: "linear-gradient(90deg, #000 0%, rgba(0,0,0,0.85) 34%, rgba(0,0,0,0) 62%)",
        }}
      />

      {/* The nav wordmark */}
      {wordmark && (
      <div style={{ position: "absolute", top: 52, left: PAD, display: "flex", alignItems: "center", gap: 18 }}>
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

function Headline({ kicker, lead, tail, size }: { kicker: string; lead: string; tail: string; size: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: PAD,
        bottom: 84,
        width: COLUMN,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ fontFamily: "Geist Mono", fontWeight: 500, fontSize: 16, letterSpacing: 3, color: FAINT, marginBottom: 26 }}>
        {kicker}
      </div>
      <div style={{ display: "flex", flexDirection: "column", fontFamily: "Geist", fontSize: size, lineHeight: 1.04, letterSpacing: -size * 0.035, color: FOREGROUND }}>
        {/* Balanced, so a wrapped half doesn't strand one word on a line */}
        <div style={{ fontWeight: 500, textWrap: "balance" }}>{lead}</div>
        {tail && <div style={{ fontWeight: 300, textWrap: "balance" }}>{tail}</div>}
      </div>
    </div>
  )
}

/* The hero itself: the mark, "Parallax" large, the subtitle light under it. */
function brandCard() {
  return (
    <Frame wordmark={false}>
      <div style={{ position: "absolute", left: PAD, bottom: 84, width: COLUMN, display: "flex", flexDirection: "column" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO_MARK} width={64} height={64} alt="" style={{ marginBottom: 40 }} />
        <div style={{ fontFamily: "Geist", fontWeight: 500, fontSize: 120, lineHeight: 0.95, letterSpacing: -5.4, color: FOREGROUND }}>
          Parallax
        </div>
        <div style={{ marginTop: 20, fontFamily: "Geist", fontWeight: 300, fontSize: 42, lineHeight: 1.12, letterSpacing: -1.3, color: FOREGROUND }}>
          A peer-to-peer programmable cash system.
        </div>
        <div style={{ marginTop: 30, fontFamily: "Geist Mono", fontWeight: 500, fontSize: 16, letterSpacing: 3, color: FAINT }}>
          SECURED BY PHYSICS
        </div>
      </div>
    </Frame>
  )
}

function titleCard(title: string) {
  const [lead, tail] = twoTone(title)
  // Largest size whose estimated wrapped height fits between the wordmark
  // and the floor (≤ 330px of headline). The 0.53em average glyph width is
  // Geist Medium's at these sizes.
  const fontSize = (() => {
    for (const size of [80, 72, 64, 58, 52, 46, 40]) {
      const charsPerLine = Math.max(1, Math.floor(COLUMN / (0.53 * size)))
      const lines = [lead, tail].filter(Boolean).reduce((n, part) => n + Math.ceil(part.length / charsPerLine), 0)
      if (lines * 1.04 * size <= 330) return size
    }
    return 36
  })()

  return (
    <Frame>
      <Headline kicker="PARALLAX PROTOCOL" lead={lead} tail={tail} size={fontSize} />
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
