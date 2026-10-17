"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

// Each letter recedes into itself: DEPTH copies of it, each scaled by SHRINK
// more around the letter's centre and fainter, clipped to the letter, so the
// lines read as a tunnel going back into the distance. Letter positions are
// measured from the rendered text once the font has loaded.
const DEPTH = 7
const SHRINK = 0.1
const LINE = 1.1
const TEXT_X = 500
const TEXT_Y = 232
const FONT_SIZE = 230
const FONT_WEIGHT = 800
// The frame hugs the letters' ink horizontally (x 52.8–956.1 at this size
// and weight, inside the text's side bearings).
const VIEW_X = 52.8
const VIEW_W = 903.3
const RADIUS = 190

// The hero's entrance: the word fades in, slow at first and quickening
// (`.wordmark-enter` in globals.css), as if filling with energy. The lights
// aren't part of the fade, so they show over the faint word: they cross it
// left to right back to back, each quicker, brighter and a little wider than
// the last; then the word releases it in one pulse, lit near white from its
// centre outward, as the subtitle and buttons come in (their delays in
// hero.tsx follow FINALE_AT). Times are from the start of the fade, read off
// its CSS animation, so the lights stay in step with it however late the
// page hydrates, and any already past are skipped.
const CHARGE = { count: 16, first: 600, speedup: 0.85, shortest: 110, strength: [0.3, 0.95], r: [160, 240] } as const
type Shine = { at: number; ms: number; r: number; strength: number; pulse?: boolean }
const SHINES: Shine[] = []
for (let i = 0, at = 0; i < CHARGE.count; i++) {
  const f = i / (CHARGE.count - 1)
  const ms = Math.max(CHARGE.first * CHARGE.speedup ** i, CHARGE.shortest)
  SHINES.push({
    at,
    ms,
    r: CHARGE.r[0] + (CHARGE.r[1] - CHARGE.r[0]) * f,
    strength: CHARGE.strength[0] + (CHARGE.strength[1] - CHARGE.strength[0]) * f,
  })
  at += ms
}
/** ≈3880ms: when the release starts. */
const FINALE_AT = SHINES[SHINES.length - 1].at + SHINES[SHINES.length - 1].ms
// The release: a pulse from the word's centre, its layers lit near white
// rather than in the gradient's tint, thicker, all at full strength and
// glowing (`.wordmark-pulse` in globals.css, and the glow filter). It swells over its first quarter and
// fades over the rest while its light spreads from r to PULSE_REACH, past
// the word's ends.
SHINES.push({ at: FINALE_AT, ms: 700, r: 300, strength: 0.85, pulse: true })
const PULSE_REACH = 1100
const BRIGHT = ["#eafff5", "#edf4ff"] as const

const sweepEase = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

// Each layer is drawn by a charge shine, outermost first: layer k by every
// LAYER_EVERY-th shine, appearing in each letter as the light's centre
// crosses it (`.wordmark-layer` in globals.css, delayed per letter here).
const LAYER_EVERY = 2
const appearAt = (k: number, cx: number) => {
  const shine = SHINES[k * LAYER_EVERY]
  const p = (cx - (VIEW_X - shine.r)) / (VIEW_W + 2 * shine.r)
  let lo = 0
  let hi = 1
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    if (sweepEase(mid) < p) lo = mid
    else hi = mid
  }
  return Math.round(shine.at + lo * shine.ms)
}

const VARIANTS = {
  // Cropped by the page floor, fading towards it, dim at rest.
  footer: { viewY: 0, viewH: 200, fade: true, rest: 0.5, front: false, align: "xMidYMax", entrance: false },
  // The whole word, its front outline in the foreground colour so the name
  // reads, the receding layers brighter than the footer's. It plays the
  // entrance on load.
  hero: { viewY: 52, viewH: 186, fade: false, rest: 0.85, front: true, align: "xMinYMid", entrance: true },
} as const

type Letter = { char: string; x: number; cx: number; cy: number }

// The letters as measured in Geist at this size, so the layers are in the
// server HTML and paint (and fade in) from the first frame. The client
// re-measures once the font is ready, in case the font's metrics change.
const LETTERS: Letter[] = [
  { char: "P", x: 36.76, cx: 110.32, cy: 186 },
  { char: "a", x: 183.86, cx: 251.99, cy: 186 },
  { char: "r", x: 320.1, cx: 365.03, cy: 186 },
  { char: "a", x: 409.94, cx: 476.83, cy: 186 },
  { char: "l", x: 543.7, cx: 578.29, cy: 186 },
  { char: "l", x: 612.85, cx: 648.21, cy: 186 },
  { char: "a", x: 683.55, cx: 748.23, cy: 186 },
  { char: "x", x: 812.88, cx: 888.06, cy: 186 },
]
const close = (a: Letter[], b: Letter[]) =>
  a.length === b.length && a.every((l, i) => l.char === b[i].char && Math.abs(l.x - b[i].x) + Math.abs(l.cx - b[i].cx) + Math.abs(l.cy - b[i].cy) < 0.5)

/* "Parallax" with every letter receding into itself, in the logo gradient.
   On devices with a fine pointer a soft light follows the cursor across the
   surrounding `area` (the footer, the hero) and brightens the lines beneath
   it. The hero plays an entrance on load (see SHINES above).
   Decorative: callers carry the real text for assistive tech. */
export function DepthWordmark({
  variant,
  area,
  className,
}: {
  variant: keyof typeof VARIANTS
  /** CSS selector of the ancestor the cursor light tracks over. */
  area: string
  className?: string
}) {
  const v = VARIANTS[variant]
  // The hero and the footer share a page, so every def id is scoped by
  // variant (one of each per page). Not useId: in dev its ids can come out
  // different on the client than in the server HTML, and the layers drawn
  // after measuring would then point at defs that don't exist.
  const id = (name: string) => `dw-${variant}-${name}`
  const glow = `url(#${id("glow")})`

  const svgRef = useRef<SVGSVGElement>(null)
  const spotRef = useRef<SVGCircleElement>(null)
  const litRef = useRef<SVGGElement>(null)
  const wordRef = useRef<SVGTextElement>(null)
  const spotStopRef = useRef<SVGStopElement>(null)
  // While the entrance plays, it owns the light; the cursor light waits, then
  // picks up wherever the cursor is (`handOver`, false if it's not over the
  // area).
  const entering = useRef(false)
  const handOver = useRef<() => boolean>(() => false)
  const [letters, setLetters] = useState<Letter[]>(LETTERS)

  // Check each letter's start and box against the laid-out text.
  useEffect(() => {
    let live = true
    document.fonts.ready.then(() => {
      const el = wordRef.current
      if (!live || !el) return
      const text = el.textContent ?? ""
      const out: Letter[] = []
      for (let i = 0; i < text.length; i++) {
        const box = el.getExtentOfChar(i)
        out.push({ char: text[i], x: el.getStartPositionOfChar(i).x, cx: box.x + box.width / 2, cy: box.y + box.height * 0.62 })
      }
      if (!close(out, LETTERS)) setLetters(out)
    })
    return () => { live = false }
  }, [])

  useEffect(() => {
    const svg = svgRef.current
    const spot = spotRef.current
    const lit = litRef.current
    if (!svg || !spot || !lit) return
    const fine = window.matchMedia("(pointer: fine)").matches
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || still) return

    let frame = 0
    let x = 0
    let y = 0
    let inside = false
    const place = () => {
      frame = 0
      if (entering.current) return
      const r = svg.getBoundingClientRect()
      spot.setAttribute("cx", String(VIEW_X + ((x - r.left) / r.width) * VIEW_W))
      spot.setAttribute("cy", String(v.viewY + ((y - r.top) / r.height) * v.viewH))
    }
    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      inside = true
      if (!frame) frame = requestAnimationFrame(place)
    }
    const show = (on: boolean) => () => {
      inside = on
      if (!entering.current) lit.style.opacity = on ? "1" : "0"
    }
    const enter = show(true)
    const leave = show(false)
    handOver.current = () => {
      if (inside) place()
      return inside
    }

    // Track over the whole area, not just the letters, so the light is
    // already in place when the cursor reaches them.
    const host = svg.closest(area) ?? svg
    host.addEventListener("pointermove", onMove as EventListener)
    host.addEventListener("pointerenter", enter)
    host.addEventListener("pointerleave", leave)
    return () => {
      cancelAnimationFrame(frame)
      handOver.current = () => false
      host.removeEventListener("pointermove", onMove as EventListener)
      host.removeEventListener("pointerenter", enter)
      host.removeEventListener("pointerleave", leave)
    }
  }, [area, v.viewY, v.viewH])

  useEffect(() => {
    const svg = svgRef.current
    const spot = spotRef.current
    const stop = spotStopRef.current
    const lit = litRef.current
    if (!v.entrance || !svg || !spot || !stop || !lit) return
    // Absent under reduced motion, where the word is simply there.
    const fade = svg.querySelector(".wordmark-enter")?.getAnimations()[0]
    if (!fade) return

    let frame = 0
    let done = false
    // Switched without the cursor light's fade: animating the lit layers'
    // opacity re-rasterizes the whole word, and its lines visibly shift.
    const show = (on: boolean) => {
      const fade = lit.style.transition
      lit.style.transition = "none"
      lit.style.opacity = on ? "1" : "0"
      void lit.getBoundingClientRect()
      lit.style.transition = fade
    }
    const bright = (on: boolean) => {
      svg.style.setProperty("--dw-lit-1", on ? BRIGHT[0] : "")
      svg.style.setProperty("--dw-lit-2", on ? BRIGHT[1] : "")
      lit.classList.toggle("wordmark-pulse", on)
      if (on) lit.setAttribute("filter", glow)
      else lit.removeAttribute("filter")
    }
    const light = (cx: number, r: number, strength: number) => {
      spot.setAttribute("cx", String(cx))
      spot.setAttribute("r", String(r))
      stop.setAttribute("stop-opacity", String(strength))
    }
    const finish = () => {
      if (done) return
      done = true
      entering.current = false
      cancelAnimationFrame(frame)
      light(-RADIUS, RADIUS, 1)
      bright(false)
      if (!handOver.current()) show(false)
    }
    const step = () => {
      const elapsed = (document.timeline.currentTime as number) - (fade.startTime as number)
      const shine = SHINES.find((s) => elapsed < s.at + s.ms)
      if (!shine) return finish()
      // Between shines the light waits off the left edge.
      const t = Math.max(0, (elapsed - shine.at) / shine.ms)
      bright(Boolean(shine.pulse))
      if (shine.pulse) {
        const swell = t < 0.25 ? t / 0.25 : (1 - (t - 0.25) / 0.75) ** 2
        const spread = 1 - (1 - t) ** 3
        light(VIEW_X + VIEW_W / 2, shine.r + (PULSE_REACH - shine.r) * spread, shine.strength * swell)
      } else {
        const eased = sweepEase(t)
        const from = VIEW_X - shine.r
        const to = VIEW_X + VIEW_W + shine.r
        light(from + (to - from) * eased, shine.r, shine.strength)
      }
      frame = requestAnimationFrame(step)
    }
    entering.current = true
    fade.ready.then(() => {
      if (done) return
      spot.setAttribute("cy", String(v.viewY + v.viewH / 2))
      show(true)
      step()
    })
    return finish
  }, [v.entrance, v.viewY, v.viewH, glow])

  // Front to back, each layer smaller and fainter; layer 0 is the letter's
  // own outline.
  const depth = (stroke: string) =>
    letters.flatMap((l, i) =>
      Array.from({ length: DEPTH }, (_, k) => {
        const scale = 1 - k * SHRINK
        return (
          <text
            key={`${i}-${k}`}
            x={l.x}
            y={TEXT_Y}
            fontSize={FONT_SIZE}
            fontWeight={FONT_WEIGHT}
            className={cn(v.entrance && "wordmark-layer")}
            style={{ fontFamily: "var(--font-geist-sans)", animationDelay: v.entrance ? `${appearAt(k, l.cx)}ms` : undefined }}
            transform={`translate(${l.cx} ${l.cy}) scale(${scale}) translate(${-l.cx} ${-l.cy})`}
            fill="none"
            stroke={stroke}
            strokeWidth={LINE}
            strokeOpacity={1 - k / DEPTH}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
          >
            {l.char}
          </text>
        )
      })
    )

  return (
    <svg
      ref={svgRef}
      aria-hidden
      viewBox={`${VIEW_X} ${v.viewY} ${VIEW_W} ${v.viewH}`}
      preserveAspectRatio={`${v.align} meet`}
      // The lit layers take a lighter tint of the gradient on black and a
      // deeper one on white, so the light reads in both themes.
      className={cn(
        "block select-none overflow-visible [--dw-lit-1:#00804a] [--dw-lit-2:#0062d1] dark:[--dw-lit-1:#9dffd0] dark:[--dw-lit-2:#a9cbff]",
        className
      )}
    >
      <defs>
        <linearGradient id={id("gradient")} gradientUnits="userSpaceOnUse" x1={VIEW_X} x2={VIEW_X + VIEW_W} y1="0" y2="0">
          <stop offset="0%" stopColor="var(--brand)" />
          <stop offset="100%" stopColor="var(--brand-2)" />
        </linearGradient>
        <linearGradient id={id("lit")} gradientUnits="userSpaceOnUse" x1={VIEW_X} x2={VIEW_X + VIEW_W} y1="0" y2="0">
          <stop offset="0%" stopColor="var(--dw-lit-1)" />
          <stop offset="100%" stopColor="var(--dw-lit-2)" />
        </linearGradient>
        {/* The hero's front outline: a light tint of the logo gradient. The
            hero is always dark, so it takes the on-black tint in both themes. */}
        <linearGradient id={id("front")} gradientUnits="userSpaceOnUse" x1={VIEW_X} x2={VIEW_X + VIEW_W} y1="0" y2="0">
          <stop offset="0%" stopColor="#9dffd0" />
          <stop offset="100%" stopColor="#a9cbff" />
        </linearGradient>
        <clipPath id={id("letters")}>
          <Word ref={wordRef} />
        </clipPath>
        <linearGradient id={id("floor")} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity={v.fade ? 0.2 : 1} />
        </linearGradient>
        <mask id={id("fade")}>
          {/* Wider than the frame: strokes on the outer edges spill past it */}
          <rect x={VIEW_X - 40} y={v.viewY} width={VIEW_W + 80} height={v.viewH} fill={`url(#${id("floor")})`} />
        </mask>
        <radialGradient id={id("spot-fill")}>
          <stop ref={spotStopRef} offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        {v.entrance && (
          <filter id={id("glow")} x="-10%" y="-20%" width="120%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
        <mask id={id("spot")}>
          <circle ref={spotRef} cx={-RADIUS} cy={-RADIUS} r={RADIUS} fill={`url(#${id("spot-fill")})`} />
        </mask>
      </defs>

      <g mask={`url(#${id("fade")})`} clipPath={`url(#${id("letters")})`}>
        {/* At rest: the receding layers */}
        <g opacity={v.rest} className={cn(v.entrance && "wordmark-enter")}>
          {depth(`url(#${id("gradient")})`)}
        </g>
        {/* Under the cursor: the same layers, lit */}
        <g ref={litRef} mask={`url(#${id("spot")})`} style={{ opacity: 0, transition: "opacity 300ms ease-out" }}>
          {depth(`url(#${id("lit")})`)}
        </g>
      </g>
      {/* The hero's front outline, crisp over the layers so the word reads */}
      {v.front && (
        <Word
          className={cn(v.entrance && "wordmark-enter")}
          fill="none"
          stroke={`url(#${id("front")})`}
          strokeWidth={1.6}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  )

}

function Word(props: React.SVGProps<SVGTextElement> & { ref?: React.Ref<SVGTextElement> }) {
  return (
    <text
      x={TEXT_X}
      y={TEXT_Y}
      textAnchor="middle"
      fontSize={FONT_SIZE}
      fontWeight={FONT_WEIGHT}
      letterSpacing={-4}
      style={{ fontFamily: "var(--font-geist-sans)" }}
      {...props}
    >
      Parallax
    </text>
  )
}
