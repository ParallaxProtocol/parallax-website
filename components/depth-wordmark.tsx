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
const SWEEP_DELAY = 300
const SWEEP_MS = 1800

const VARIANTS = {
  // Cropped by the page floor, fading towards it, dim at rest.
  footer: { viewY: 0, viewH: 200, fade: true, rest: 0.5, front: false, align: "xMidYMax", sweep: false },
  // The whole word, its front outline in the foreground colour so the name
  // reads, the receding layers brighter than the footer's. On load the light
  // sweeps across it once, left to right.
  hero: { viewY: 52, viewH: 186, fade: false, rest: 0.85, front: true, align: "xMinYMid", sweep: true },
} as const

type Letter = { char: string; x: number; cx: number; cy: number }

/* "Parallax" with every letter receding into itself, in the logo gradient.
   On devices with a fine pointer a soft light follows the cursor across the
   surrounding `area` (the footer, the hero) and brightens the lines beneath
   it. Variants with `sweep` pass the light across the word once on load.
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

  const svgRef = useRef<SVGSVGElement>(null)
  const spotRef = useRef<SVGCircleElement>(null)
  const litRef = useRef<SVGGElement>(null)
  const wordRef = useRef<SVGTextElement>(null)
  const [letters, setLetters] = useState<Letter[]>([])

  // Measure each letter's start and box from the laid-out text.
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
      setLetters(out)
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
    const place = () => {
      frame = 0
      const r = svg.getBoundingClientRect()
      spot.setAttribute("cx", String(VIEW_X + ((x - r.left) / r.width) * VIEW_W))
      spot.setAttribute("cy", String(v.viewY + ((y - r.top) / r.height) * v.viewH))
    }
    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (!frame) frame = requestAnimationFrame(place)
    }
    const show = (on: boolean) => () => { lit.style.opacity = on ? "1" : "0" }
    const enter = show(true)
    const leave = show(false)

    // Track over the whole area, not just the letters, so the light is
    // already in place when the cursor reaches them.
    const host = svg.closest(area) ?? svg
    host.addEventListener("pointermove", onMove as EventListener)
    host.addEventListener("pointerenter", enter)
    host.addEventListener("pointerleave", leave)
    return () => {
      cancelAnimationFrame(frame)
      host.removeEventListener("pointermove", onMove as EventListener)
      host.removeEventListener("pointerenter", enter)
      host.removeEventListener("pointerleave", leave)
    }
  }, [area, v.viewY, v.viewH])

  // The load sweep: the same light, travelling from just off the left edge to
  // just off the right, once the lit layers exist. A cursor moving over the
  // area takes the light over from it.
  const measured = letters.length > 0
  useEffect(() => {
    const svg = svgRef.current
    const spot = spotRef.current
    const lit = litRef.current
    if (!v.sweep || !measured || !svg || !spot || !lit) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    let start = 0
    const from = VIEW_X - RADIUS
    const to = VIEW_X + VIEW_W + RADIUS
    const step = (now: number) => {
      if (!start) start = now
      const t = Math.min((now - start) / SWEEP_MS, 1)
      const eased = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
      spot.setAttribute("cx", String(from + (to - from) * eased))
      if (t < 1) frame = requestAnimationFrame(step)
      else show(false)
    }
    // The light enters and leaves beyond the word's edges, so the lit layers
    // switch on and off without the cursor light's fade: animating their
    // opacity re-rasterizes the whole word, and its lines visibly shift.
    const show = (on: boolean) => {
      const fade = lit.style.transition
      lit.style.transition = "none"
      lit.style.opacity = on ? "1" : "0"
      void lit.getBoundingClientRect()
      lit.style.transition = fade
    }
    const timer = window.setTimeout(() => {
      spot.setAttribute("cy", String(v.viewY + v.viewH / 2))
      spot.setAttribute("cx", String(from))
      show(true)
      frame = requestAnimationFrame(step)
    }, SWEEP_DELAY)

    // Only where the cursor light runs; elsewhere the sweep always finishes.
    const host = svg.closest(area) ?? svg
    const stop = () => {
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
    if (window.matchMedia("(pointer: fine)").matches) host.addEventListener("pointermove", stop, { once: true })
    return () => {
      stop()
      host.removeEventListener("pointermove", stop)
    }
  }, [measured, area, v.sweep, v.viewY, v.viewH])

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
            style={{ fontFamily: "var(--font-geist-sans)" }}
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
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={id("spot")}>
          <circle ref={spotRef} cx={-RADIUS} cy={-RADIUS} r={RADIUS} fill={`url(#${id("spot-fill")})`} />
        </mask>
      </defs>

      <g mask={`url(#${id("fade")})`} clipPath={`url(#${id("letters")})`}>
        {/* Before the font loads and letters are measured: the outline alone */}
        {letters.length === 0 && (
          <Word fill="none" stroke={`url(#${id("gradient")})`} strokeWidth={LINE * 2} opacity={v.rest} />
        )}
        {/* At rest: the receding layers */}
        <g opacity={v.rest}>{depth(`url(#${id("gradient")})`)}</g>
        {/* Under the cursor: the same layers, lit */}
        <g ref={litRef} mask={`url(#${id("spot")})`} style={{ opacity: 0, transition: "opacity 300ms ease-out" }}>
          {depth(`url(#${id("lit")})`)}
        </g>
      </g>
      {/* The hero's front outline, crisp over the layers so the word reads */}
      {v.front && (
        <Word fill="none" stroke={`url(#${id("front")})`} strokeWidth={1.6} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
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
