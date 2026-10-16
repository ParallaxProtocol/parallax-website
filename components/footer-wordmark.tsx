"use client"

import { useEffect, useRef, useState } from "react"

// Each letter recedes into itself: DEPTH copies of it, each scaled by SHRINK
// more around the letter's centre and fainter, clipped to the letter, so the
// lines read as a tunnel going back into the distance. Letter positions are
// measured from the rendered text once the font has loaded.
const DEPTH = 7
const SHRINK = 0.1
const LINE = 1.1
const TEXT_X = 500
// The frame hugs the letters' ink (x 52.8–956.1 at this size and weight,
// inside the text's side bearings). The svg then runs a little wider than
// the footer's content column and lets strokes spill past its edges, so
// the word bleeds out rather than stopping at the column.
const VIEW_X = 52.8
const VIEW_W = 903.3
const VIEW_H = 200
const RADIUS = 190

/* The footer's sign-off: "Parallax" as rings stepping into the letters, in
   the logo gradient, dim at rest. On devices with a fine pointer a soft spotlight
   follows the cursor and brightens the lines beneath it. Decorative. */
export function FooterWordmark() {
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
      spot.setAttribute("cy", String(((y - r.top) / r.height) * VIEW_H))
    }
    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (!frame) frame = requestAnimationFrame(place)
    }
    const show = (on: boolean) => () => { lit.style.opacity = on ? "1" : "0" }
    const enter = show(true)
    const leave = show(false)

    // Track over the whole footer, not just the letters, so the light is
    // already in place when the cursor reaches them.
    const area = svg.closest("footer") ?? svg
    area.addEventListener("pointermove", onMove as EventListener)
    area.addEventListener("pointerenter", enter)
    area.addEventListener("pointerleave", leave)
    return () => {
      cancelAnimationFrame(frame)
      area.removeEventListener("pointermove", onMove as EventListener)
      area.removeEventListener("pointerenter", enter)
      area.removeEventListener("pointerleave", leave)
    }
  }, [])

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
    <div className="mx-auto mt-16 max-w-[90rem] px-5 md:px-10">
    <svg
      ref={svgRef}
      aria-hidden
      viewBox={`${VIEW_X} 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMax meet"
      // The lit layers take a lighter tint of the gradient on black and a
      // deeper one on white, so the light reads in both themes.
      className="-mx-3 block w-[calc(100%+1.5rem)] max-w-none select-none overflow-visible md:-mx-6 md:w-[calc(100%+3rem)] [--fw-lit-1:#00804a] [--fw-lit-2:#0062d1] dark:[--fw-lit-1:#9dffd0] dark:[--fw-lit-2:#a9cbff]"
    >
      <defs>
        <linearGradient id="fw-gradient" gradientUnits="userSpaceOnUse" x1={VIEW_X} x2={VIEW_X + VIEW_W} y1="0" y2="0">
          <stop offset="0%" stopColor="var(--brand)" />
          <stop offset="100%" stopColor="var(--brand-2)" />
        </linearGradient>
        <linearGradient id="fw-lit" gradientUnits="userSpaceOnUse" x1={VIEW_X} x2={VIEW_X + VIEW_W} y1="0" y2="0">
          <stop offset="0%" stopColor="var(--fw-lit-1)" />
          <stop offset="100%" stopColor="var(--fw-lit-2)" />
        </linearGradient>
        <clipPath id="fw-letters">
          <Word ref={wordRef} />
        </clipPath>
        <linearGradient id="fw-floor" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0.2" />
        </linearGradient>
        <mask id="fw-fade">
          {/* Wider than the frame: strokes on the outer edges spill past it */}
          <rect x={VIEW_X - 40} width={VIEW_W + 80} height={VIEW_H} fill="url(#fw-floor)" />
        </mask>
        <radialGradient id="fw-spot-fill">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="fw-spot">
          <circle ref={spotRef} cx={-RADIUS} cy={-RADIUS} r={RADIUS} fill="url(#fw-spot-fill)" />
        </mask>
      </defs>

      <g mask="url(#fw-fade)" clipPath="url(#fw-letters)">
        {/* Before the font loads and letters are measured: the outline alone */}
        {letters.length === 0 && <Word fill="none" stroke="url(#fw-gradient)" strokeWidth={LINE * 2} opacity={0.45} />}
        {/* At rest: the receding layers, dim */}
        <g opacity={0.5}>{depth("url(#fw-gradient)")}</g>
        {/* Under the cursor: the same layers, lit */}
        <g ref={litRef} mask="url(#fw-spot)" style={{ opacity: 0, transition: "opacity 300ms ease-out" }}>
          {depth("url(#fw-lit)")}
        </g>
      </g>
    </svg>
    </div>
  )
}

/* The wordmark text, positioned so its baseline sits below the frame and
   the page floor crops the letters. */
type Letter = { char: string; x: number; cx: number; cy: number }

const TEXT_Y = 232
const FONT_SIZE = 230
const FONT_WEIGHT = 800

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
