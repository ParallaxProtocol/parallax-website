import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/* The pieces Parallax Wallet's screens are drawn from, as SVG, after the
   app's own code (parallax-wallet/frontend): its tokens (styles.css), its
   shell (a 272px sidebar, a 52px title bar, a 64px node bar), its lucide
   icons and its accounts' real Jazzicons. One unit is one CSS pixel of a
   1232×920 window. */

export const W = 1232
export const H = 920

// The page column: right of the sidebar, inside the page's p-5
export const PX = 292
export const PR = 1200
export const MID = (PX + PR) / 2
// NodeBar: 64px tall, 12px clear of the window's edges
export const BAR_Y = 844
export const BAR_H = 64

// The app's dark theme (styles.css :root)
export const C = {
  fg: "#ececee",
  muted: "#9a9aa1",
  faint: "#67676e",
  border: "rgb(255 255 255 / 9%)",
  borderStrong: "rgb(255 255 255 / 14%)",
  surface: "rgb(255 255 255 / 5%)",
  selected: "rgb(255 255 255 / 10%)",
  fill: "rgb(255 255 255 / 8%)",
  inset: "rgb(255 255 255 / 4.8%)",
  glass: "rgb(255 255 255 / 6%)",
  glassEdge: "rgb(255 255 255 / 12%)",
  popover: "#161618",
  brand: "#d4d4d8",
  brandMark: "#e4e4e7",
  brandMuted: "rgb(255 255 255 / 10%)",
  brandForeground: "#0a0a0b",
  appBrand: "#b18cff",
  good: "#4ade80",
  info: "#4a94ff",
  infoInk: "#6aa8ff",
}

export const SANS = "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif"
export const MONO = "var(--font-geist-mono), ui-monospace, monospace"

// lib/jazzicon.ts for each account's address, at 40px (it scales linearly)
const JAZZ = {
  // 0x17aC91E6DC44e2b984069F83d94aB7AC0802F8ca
  account3: {
    background: "#018E7B",
    shapes: [
      ["#18BFF2", -10.094, -6.695, 245.8],
      ["#C8146B", 18.684, 10.788, 103.4],
      ["#F59B00", 30.246, -13.709, 377.5],
    ],
  },
  // 0xF97eC84e21E79B5E9fE1b3954163ed512d7f9Da7
  account2: {
    background: "#FB1882",
    shapes: [
      ["#18BBF2", 5.529, -10.167, 364.8],
      ["#035E5E", 8.909, 23.405, 134.2],
      ["#2382E1", 27.663, -21.128, 464.7],
    ],
  },
  // 0xe712e85dB451B25a16eB692Dab94E26E3bddC081
  account1: {
    background: "#FAAF00",
    shapes: [
      ["#1868F2", 3.141, -0.355, 358.9],
      ["#01688E", 17.337, -17.321, 357.4],
      ["#2339E1", -25.607, -28.087, 385.4],
    ],
  },
  // A hardware account, its address not shown: orange and blue, as it was captured
  account4: {
    background: "#F5D000",
    shapes: [
      ["#188FF2", 9.418, -0.883, 445.9],
      ["#235CE1", 9.783, 12.683, 118.0],
      ["#F94B01", -25.415, -16.485, 339.4],
    ],
  },
} as const

export type Account = keyof typeof JAZZ

export const ADDRESS: Record<Account, string> = {
  account3: "0x17aC91E6DC44e2b984069F83d94aB7AC0802F8ca",
  account2: "0xF97eC84e21E79B5E9fE1b3954163ed512d7f9Da7",
  account1: "0xe712e85dB451B25a16eB692Dab94E26E3bddC081",
  account4: "",
}

// lucide-react 1.59, the wallet's version
type IconNode = [string, Record<string, string>][]
const ICONS = {
  wallet: [
    ["path", { d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" }],
    ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" }],
  ],
  arrowUpRight: [
    ["path", { d: "M7 7h10v10" }],
    ["path", { d: "M7 17 17 7" }],
  ],
  arrowDownLeft: [
    ["path", { d: "M17 7 7 17" }],
    ["path", { d: "M17 17H7V7" }],
  ],
  arrowDown: [
    ["path", { d: "M12 5v14" }],
    ["path", { d: "m19 12-7 7-7-7" }],
  ],
  arrowLeft: [
    ["path", { d: "m12 19-7-7 7-7" }],
    ["path", { d: "M19 12H5" }],
  ],
  history: [
    ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
    ["path", { d: "M3 3v5h5" }],
    ["path", { d: "M12 7v5l4 2" }],
  ],
  bookUser: [
    ["path", { d: "M15 13a3 3 0 1 0-6 0" }],
    ["path", { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }],
    ["circle", { cx: "12", cy: "8", r: "2" }],
  ],
  fileSignature: [
    ["path", { d: "M14.364 13.634a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506l4.013-4.009a1 1 0 0 0-3.004-3.004z" }],
    ["path", { d: "M14.487 7.858A1 1 0 0 1 14 7V2" }],
    ["path", { d: "M20 19.645V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l2.516 2.516" }],
    ["path", { d: "M8 18h1" }],
  ],
  fileCheck: [
    ["path", { d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }],
    ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5" }],
    ["path", { d: "m9 15 2 2 4-4" }],
  ],
  settings2: [
    ["path", { d: "M14 17H5" }],
    ["path", { d: "M19 7h-9" }],
    ["circle", { cx: "17", cy: "17", r: "3" }],
    ["circle", { cx: "7", cy: "7", r: "3" }],
  ],
  radioTower: [
    ["path", { d: "M4.9 16.1C1 12.2 1 5.8 4.9 1.9" }],
    ["path", { d: "M7.8 4.7a6.14 6.14 0 0 0-.8 7.5" }],
    ["circle", { cx: "12", cy: "9", r: "2" }],
    ["path", { d: "M16.2 4.8c2 2 2.26 5.11.8 7.47" }],
    ["path", { d: "M19.1 1.9a9.96 9.96 0 0 1 0 14.1" }],
    ["path", { d: "M9.5 18h5" }],
    ["path", { d: "m8 22 4-11 4 11" }],
  ],
  power: [
    ["path", { d: "M12 2v10" }],
    ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04" }],
  ],
  chevronUp: [["path", { d: "m18 15-6-6-6 6" }]],
  chevronRight: [["path", { d: "m9 18 6-6-6-6" }]],
  panelLeftClose: [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M9 3v18" }],
    ["path", { d: "m16 15-3-3 3-3" }],
  ],
  bell: [
    ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0" }],
    ["path", { d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" }],
  ],
  lock: [
    ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2" }],
    ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }],
  ],
  x: [
    ["path", { d: "M18 6 6 18" }],
    ["path", { d: "m6 6 12 12" }],
  ],
  copy: [
    ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }],
  ],
  send: [
    ["path", { d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" }],
    ["path", { d: "m21.854 2.147-10.94 10.939" }],
  ],
  check: [["path", { d: "M20 6 9 17l-5-5" }]],
  search: [
    ["path", { d: "m21 21-4.34-4.34" }],
    ["circle", { cx: "11", cy: "11", r: "8" }],
  ],
  calendarDays: [
    ["path", { d: "M8 2v3" }],
    ["path", { d: "M16 2v3" }],
    ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }],
    ["path", { d: "M3 9h18" }],
    ["path", { d: "M8 13h.01" }],
    ["path", { d: "M12 13h.01" }],
    ["path", { d: "M16 13h.01" }],
    ["path", { d: "M8 17h.01" }],
    ["path", { d: "M12 17h.01" }],
    ["path", { d: "M16 17h.01" }],
  ],
  upload: [
    ["path", { d: "M12 3v12" }],
    ["path", { d: "m17 8-5-5-5 5" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
  ],
  usb: [
    ["circle", { cx: "10", cy: "7", r: "1" }],
    ["circle", { cx: "4", cy: "20", r: "1" }],
    ["path", { d: "M4.7 19.3 19 5" }],
    ["path", { d: "m21 3-3 1 2 2Z" }],
    ["path", { d: "M9.26 7.68 5 12l2 5" }],
    ["path", { d: "m10 14 5 2 3.5-3.5" }],
    ["path", { d: "m18 12 1-1 1 1-1 1Z" }],
  ],
  loaderCircle: [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }]],
  shieldCheck: [
    ["path", { d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }],
    ["path", { d: "m9 12 2 2 4-4" }],
  ],
  eye: [
    ["path", { d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" }],
    ["circle", { cx: "12", cy: "12", r: "3" }],
  ],
  ban: [
    ["path", { d: "M4.929 4.929 19.07 19.071" }],
    ["circle", { cx: "12", cy: "12", r: "10" }],
  ],
} satisfies Record<string, IconNode>

export type IconName = keyof typeof ICONS

/* A lucide icon centred on (cx, cy) at size px, its stroke 2 at 24px as lucide's is. */
export function Icon({
  name,
  cx,
  cy,
  size = 16,
  color = C.fg,
  strokeWidth = 2,
}: {
  name: IconName
  cx: number
  cy: number
  size?: number
  color?: string
  strokeWidth?: number
}) {
  return (
    <g
      transform={`translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})`}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {(ICONS[name] as IconNode).map(([Tag, attrs], i) => {
        const El = Tag as "path"
        return <El key={i} {...attrs} />
      })}
    </g>
  )
}

/* symbols.tsx's SparklesSymbol: SF's sparkles, filled, on lucide's grid. */
function star(cx: number, cy: number, r: number) {
  const k = r * 0.14
  return `M${cx} ${cy - r}Q${cx + k} ${cy - k} ${cx + r} ${cy}Q${cx + k} ${cy + k} ${cx} ${cy + r}Q${cx - k} ${cy + k} ${cx - r} ${cy}Q${cx - k} ${cy - k} ${cx} ${cy - r}Z`
}
export function Sparkles({ cx, cy, size = 16, color = C.fg }: { cx: number; cy: number; size?: number; color?: string }) {
  return (
    <g transform={`translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 24})`} fill={color} stroke={color} strokeWidth={1.05} strokeLinejoin="round">
      <path d={star(11.5, 13.5, 6.5)} />
      <path d={star(18, 5.75, 2.75)} />
      <path d={star(5, 5.5, 1.75)} />
    </g>
  )
}

/* AddressAvatar's Jazzicon: the background and three turned squares, in a circle. */
export function Avatar({ uid, who, x, y, size }: { uid: string; who: Account; x: number; y: number; size: number }) {
  const j = JAZZ[who]
  const id = `${uid}-av`
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 40})`}>
      <clipPath id={id}>
        <circle cx={20} cy={20} r={20} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect width={40} height={40} fill={j.background} />
        {j.shapes.map(([fill, tx, ty, rot], i) => (
          <rect key={i} width={40} height={40} transform={`translate(${tx} ${ty}) rotate(${rot} 20 20)`} fill={fill} />
        ))}
      </g>
      <circle cx={20} cy={20} r={19.5} fill="none" stroke="rgb(0 0 0 / 10%)" />
    </g>
  )
}

/* GroupedAddress: a dimmed 0x, then groups of four, every other one a shade lighter. */
export function GroupedAddress({ x, y, who, size = 12, color = C.muted }: { x: number; y: number; who: Account; size?: number; color?: string }) {
  const groups = ADDRESS[who].slice(2).match(/.{1,4}/g) ?? []
  return (
    <text x={x} y={y} fontFamily={MONO} fontSize={size} fill={color}>
      <tspan opacity={0.55}>0x</tspan>
      {groups.map((g, i) => (
        <tspan key={i} dx={size * 0.3} opacity={i % 2 ? 0.75 : 1}>
          {g}
        </tspan>
      ))}
    </text>
  )
}

/* .badge: a small capsule label; `brand` is Pill's brand tone. */
export function Badge({ x, cy, width, mono, children }: { x: number; cy: number; width: number; mono?: boolean; children: string }) {
  return (
    <g>
      <rect x={x} y={cy - 10} width={width} height={20} rx={10} fill={mono ? C.fill : C.brandMuted} />
      <text x={x + width / 2} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={500} fill={mono ? C.muted : C.brand} fontFamily={mono ? MONO : undefined}>
        {children}
      </text>
    </g>
  )
}

/* Buttons. A label and its icon, centred, 6px apart (.btn's gap); `iconW`
   and `labelW` place them, as the text isn't measured. */
type ButtonProps = {
  x: number
  y: number
  w: number
  h?: number
  r?: number
  icon?: IconName | "spinner"
  iconSize?: number
  label: string
  labelW: number
  disabled?: boolean
}

function ButtonFace({ x, y, w, h = 34, icon, iconSize = 14, label, labelW, color }: ButtonProps & { color: string }) {
  const gap = icon ? 6 + iconSize : 0
  const start = x + (w - gap - labelW) / 2
  const cy = y + h / 2
  return (
    <>
      {icon && <Icon name={icon === "spinner" ? "loaderCircle" : icon} cx={start + iconSize / 2} cy={cy} size={iconSize} color={color} />}
      <text x={start + gap} y={cy + 4.5} fontWeight={500} fill={color}>
        {label}
      </text>
    </>
  )
}

/* btn-primary: glossy chrome, lit from above, with its soft white drop. */
export function PrimaryButton({ uid, focused, ...p }: ButtonProps & { uid: string; focused?: boolean }) {
  const { x, y, w, h = 34, r = 10, disabled } = p
  return (
    <g opacity={disabled ? 0.45 : 1}>
      <defs>
        <linearGradient id={`${uid}-gloss`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fafafa" />
          <stop offset="1" stopColor="#c8c8cd" />
        </linearGradient>
        <filter colorInterpolationFilters="sRGB" id={`${uid}-drop`} x="-20%" y="-50%" width="140%" height="250%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <rect x={x + 10} y={y + h / 2} width={w - 20} height={h * 0.7} rx={r} fill="rgb(255 255 255 / 25%)" filter={`url(#${uid}-drop)`} />
      {focused && <rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx={r + 3} fill="none" stroke="rgb(255 255 255 / 35%)" strokeWidth={2} />}
      <rect x={x} y={y} width={w} height={h} rx={r} fill={`url(#${uid}-gloss)`} />
      <line x1={x + r} y1={y + 0.5} x2={x + w - r} y2={y + 0.5} stroke="rgb(255 255 255 / 85%)" />
      <ButtonFace {...p} color={C.brandForeground} />
    </g>
  )
}

/* btn-secondary: frosted glass. */
export function SecondaryButton(p: ButtonProps) {
  const { x, y, w, h = 34, r = 10, disabled } = p
  return (
    <g opacity={disabled ? 0.45 : 1}>
      <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h - 1} rx={r} fill={C.glass} stroke={C.glassEdge} />
      <ButtonFace {...p} color={C.fg} />
    </g>
  )
}

/* btn-flat: a flat muted face. */
export function FlatButton(p: ButtonProps) {
  const { x, y, w, h = 34, r = 10 } = p
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r} fill={C.fill} />
      <ButtonFace {...p} color={C.fg} />
    </g>
  )
}

/* Panel: grouped rows on the page's glass, rounded-2xl. */
export function Panel({ x = PX, y, w = PR - PX, h, r = 16 }: { x?: number; y: number; w?: number; h: number; r?: number }) {
  return <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h - 1} rx={r} fill={C.surface} stroke={C.border} />
}

/* A hairline across a panel, between rows. */
export function Divider({ x1 = PX + 1, x2 = PR - 1, y }: { x1?: number; x2?: number; y: number }) {
  return <line x1={x1} y1={y + 0.5} x2={x2} y2={y + 0.5} stroke={C.border} />
}

/* GlowCard: a large card of frosted glass, lit by the brand's violet from its top right corner. */
export function GlowCard({ uid, x = PX, y, w = PR - PX, h }: { uid: string; x?: number; y: number; w?: number; h: number }) {
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-glow`} gradientUnits="userSpaceOnUse" cx={x + w - 144} cy={y + 80} r={272}>
          <stop offset="0" stopColor="#9d6bff" stopOpacity={0.22} />
          <stop offset="0.55" stopColor="#5b5bf0" stopOpacity={0.08} />
          <stop offset="1" stopColor="#5b5bf0" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={x} y={y} width={w} height={h} rx={24} fill={C.glass} />
      <rect x={x} y={y} width={w} height={h} rx={24} fill={`url(#${uid}-glow)`} />
      <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h - 1} rx={23.5} fill="none" stroke={C.glassEdge} />
    </g>
  )
}

/* The balance's figure: semibold, tight, from the text colour into violet at its far corner. */
export function Figure({
  uid,
  x,
  y,
  size,
  value,
  unitSize,
  anchor = "start",
  box,
}: {
  uid: string
  x: number
  y: number
  size: number
  value: string
  unitSize: number
  anchor?: "start" | "middle"
  /** The figure's box, for its gradient: [left, top, right, bottom]. */
  box: [number, number, number, number]
}) {
  return (
    <g>
      <defs>
        <linearGradient id={`${uid}-fig`} gradientUnits="userSpaceOnUse" x1={box[0]} y1={box[1]} x2={box[2]} y2={box[3]}>
          <stop offset="0" stopColor={C.fg} />
          <stop offset="0.5" stopColor={C.fg} />
          <stop offset="1" stopColor={C.appBrand} />
        </linearGradient>
      </defs>
      <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={600} letterSpacing="-0.025em" fill={`url(#${uid}-fig)`}>
        {value}
        {/* gap-2.5 after the figure, wherever its width ends */}
        <tspan dx={10} fontSize={unitSize} fontWeight={500} letterSpacing="0" fill={C.muted}>
          LAX
        </tspan>
      </text>
    </g>
  )
}

export type Activity = { kind?: "sent" | "canceled"; block: string; to: string; amount: string; when: string }

/* ActivityRow: one transaction in a panel, 64px tall, centred on cy. */
export function ActivityRow({ a, cy }: { a: Activity; cy: number }) {
  return (
    <g>
      <circle cx={PX + 36} cy={cy} r={20} fill={C.fill} />
      <Icon name={a.kind === "canceled" ? "ban" : "arrowUpRight"} cx={PX + 36} cy={cy} />
      <text x={PX + 70} y={cy - 4} fontWeight={500}>
        {a.kind === "canceled" ? "Canceled" : "Sent"}
      </text>
      <text x={PX + 70} y={cy + 14} fontSize={12} fill={C.muted}>
        Block {a.block} · to <tspan fontFamily={MONO}>{a.to}</tspan>
      </text>
      <text x={PR - 44} y={cy - 4} textAnchor="end" fontWeight={600}>
        {a.amount}
        <tspan dx={3.5} fontWeight={400} fill={C.muted}>
          LAX
        </tspan>
      </text>
      <text x={PR - 44} y={cy + 14} textAnchor="end" fontSize={12} fill={C.muted}>
        {a.when}
      </text>
      <Icon name="chevronRight" cx={PR - 23} cy={cy} size={14} color={C.muted} />
    </g>
  )
}

/* Property: a label and its value on one 48px line of a Rows panel. */
export function Property({ cy, label, x1 = PX + 20, x2 = PR - 20, children }: { cy: number; label: string; x1?: number; x2?: number; children: ReactNode }) {
  return (
    <g>
      <text x={x1} y={cy + 4.5}>
        {label}
      </text>
      <text x={x2} y={cy + 4.5} textAnchor="end" fill={C.muted}>
        {children}
      </text>
    </g>
  )
}

/* Frosted glass over what lies under it: the window drawn again, blurred,
   inside the surface's shape. `under` is the id of the group to blur. */
export function Frost({ uid, under, x, y, w, h, r, blur, children }: { uid: string; under: string; x: number; y: number; w: number; h: number; r: number; blur: number; children?: ReactNode }) {
  return (
    <g>
      <defs>
        <clipPath id={`${uid}-clip`}>
          <rect x={x} y={y} width={w} height={h} rx={r} />
        </clipPath>
        {/* Only what lies under the surface (and the blur's reach) is blurred */}
        <filter colorInterpolationFilters="sRGB" id={`${uid}-blur`} filterUnits="userSpaceOnUse" x={x - blur * 3} y={y - blur * 3} width={w + blur * 6} height={h + blur * 6}>
          <feGaussianBlur stdDeviation={blur} />
          <feColorMatrix type="saturate" values="1.5" />
        </filter>
      </defs>
      <g clipPath={`url(#${uid}-clip)`}>
        <rect x={x} y={y} width={w} height={h} fill="#000" />
        <use href={`#${under}`} filter={`url(#${uid}-blur)`} />
        {children}
      </g>
    </g>
  )
}

const NAV = [
  { key: "overview", icon: "wallet", label: "Overview", y: 190 },
  { key: "send", icon: "arrowUpRight", label: "Send", y: 224 },
  { key: "receive", icon: "arrowDownLeft", label: "Receive", y: 258 },
  { key: "history", icon: "history", label: "History", y: 292 },
  { key: "contacts", icon: "bookUser", label: "Contacts", y: 348 },
  { key: "sign", icon: "fileSignature", label: "Sign message", y: 404 },
  { key: "verify", icon: "fileCheck", label: "Verify message", y: 438 },
] as const

export type NavKey = (typeof NAV)[number]["key"]

const LOGO =
  "m 171.48919,103.57486 -0.0214,30.61331 108.49225,-62.638032 0.007,-0.004 0.007,0.01164 52.90338,30.543593 -26.45177,15.27194 -26.46448,15.27987 1.8e-4,-7e-4 -108.53587,62.66321 -0.0213,30.51422 0.0429,0.0247 211.66649,-122.2057 -105.70521,-61.127344 z m 26.39475,137.56774 79.35321,45.88867 105.91862,-61.05365 0.0215,-30.71125 -110.18258,63.61394 -0.003,-0.005 -26.45194,-15.27225 26.45847,-15.27581 110.20048,-63.62427 0.0213,-30.56377 z"

/* The window's shell: title bar, sidebar (with `nav` selected), the page's
   title and what `toolbar` puts beside it, the page, and the node bar,
   which ends at `barRight` (short of an assistant's panel) and frosts what
   runs under it. `overlay` floats over everything. */
function Shell({
  uid,
  nav,
  title,
  toolbar,
  page,
  barRight = W - 12,
  barSub,
  overlay,
}: {
  uid: string
  nav: NavKey
  title: string
  toolbar?: ReactNode
  page: ReactNode
  barRight?: number
  barSub: string
  overlay?: (under: string) => ReactNode
}) {
  const under = `${uid}-under`
  const barW = barRight - 12
  return (
    <>
      <defs>
        <linearGradient id={`${uid}-mark`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.fg} />
          <stop offset="0.5" stopColor={C.fg} />
          <stop offset="1" stopColor={C.appBrand} />
        </linearGradient>
        <filter colorInterpolationFilters="sRGB" id={`${uid}-bar-drop`} x="-5%" y="-50%" width="110%" height="250%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      <g id={under}>
        <rect width={W} height={H} fill="#000" />

        {/* Title bar: the sidebar's header and the page's bar, under one hairline */}
        <g transform="translate(16 13) scale(0.09827)">
          <path transform="translate(-145.01123,-32.460674)" fill={`url(#${uid}-mark)`} d={LOGO} />
        </g>
        <text x={52} y={34} fontSize={24.4} fontWeight={500} letterSpacing="-0.04em">
          Parallax Wallet
        </text>
        <Icon name="panelLeftClose" cx={297} cy={26} />
        <Icon name="bell" cx={1111} cy={26} />
        <Icon name="lock" cx={1153} cy={26} />
        <circle cx={1211} cy={26} r={12} fill={C.fill} />
        <Icon name="x" cx={1211} cy={26} size={12} strokeWidth={2.5} />
        <line x1={0} y1={51.5} x2={W} y2={51.5} stroke={C.border} />

        {/* Sidebar */}
        <line x1={271.5} y1={52} x2={271.5} y2={H} stroke={C.border} />
        <rect x={12.5} y={64.5} width={247} height={97} rx={14} fill={C.glass} stroke={C.glassEdge} />
        <Avatar uid={`${uid}-side`} who="account3" x={24} y={76} size={36} />
        <text x={72} y={89} fontSize={14} fontWeight={600}>
          Account 3
        </text>
        <text x={72} y={107} fontFamily={MONO} fontSize={12} fill={C.muted}>
          <tspan fill={C.faint}>0x</tspan> 17aC <tspan fill={C.faint}>···</tspan> F8ca
        </text>
        <Icon name="copy" cx={201} cy={103} size={14} color={C.muted} />
        <line x1={24} y1={125.5} x2={248} y2={125.5} stroke={C.border} />
        <text x={24} y={148} fill={C.muted}>
          Balance
        </text>
        <text x={248} y={148} textAnchor="end">
          6,973.0751
          <tspan dx={3.5} fill={C.muted}>
            LAX
          </tspan>
        </text>
        {NAV.map((n) => (
          <g key={n.key}>
            {n.key === nav && <rect x={12} y={n.y - 16} width={248} height={32} rx={10} fill={C.selected} />}
            <Icon name={n.icon} cx={32} cy={n.y} />
            <text x={50} y={n.y + 4.5}>
              {n.label}
            </text>
          </g>
        ))}
        <line x1={22} y1={320.5} x2={250} y2={320.5} stroke={C.border} />
        <line x1={22} y1={376.5} x2={250} y2={376.5} stroke={C.border} />
        <Icon name="settings2" cx={32} cy={804} />
        <text x={50} y={808.5}>
          Settings
        </text>

        {/* The page's toolbar: its name, and what it puts at the end */}
        <text x={PX} y={89} fontSize={24} fontWeight={600} letterSpacing="-0.025em">
          {title}
        </text>
        {toolbar}

        {page}
      </g>

      {/* NodeBar, at rest: a glass capsule along the window's foot, frosting what runs under it */}
      <rect x={24} y={BAR_Y + 12} width={barW - 24} height={BAR_H} rx={BAR_H / 2} fill="rgb(0 0 0 / 60%)" filter={`url(#${uid}-bar-drop)`} />
      <Frost uid={`${uid}-bar`} under={under} x={12} y={BAR_Y} w={barW} h={BAR_H} r={BAR_H / 2} blur={24}>
        <rect x={12} y={BAR_Y} width={barW} height={BAR_H} fill={C.glass} />
        {/* glass-shine: a faint highlight along the top edge */}
        <line x1={44} y1={BAR_Y + 1.5} x2={barRight - 32} y2={BAR_Y + 1.5} stroke="rgb(255 255 255 / 8%)" />
      </Frost>
      <rect x={12.5} y={BAR_Y + 0.5} width={barW - 1} height={BAR_H - 1} rx={(BAR_H - 1) / 2} fill="none" stroke={C.glassEdge} />
      <Icon name="radioTower" cx={42} cy={BAR_Y + 32} size={20} color={C.muted} strokeWidth={1.75} />
      <circle cx={76} cy={BAR_Y + 24} r={3.5} fill={C.good} />
      <text x={87} y={BAR_Y + 29} fontSize={15} fontWeight={600}>
        Synced
      </text>
      <text x={72} y={BAR_Y + 46} fontSize={12} fill={C.muted}>
        {barSub}
      </text>
      <circle cx={barRight - 85} cy={BAR_Y + 32} r={17} fill={C.fill} />
      <Icon name="power" cx={barRight - 85} cy={BAR_Y + 32} />
      <circle cx={barRight - 32} cy={BAR_Y + 32} r={17} fill={C.fill} />
      <Icon name="chevronUp" cx={barRight - 32} cy={BAR_Y + 32} />

      {overlay?.(under)}
    </>
  )
}

/* A screen of the app, framed as a floating window: the app draws its own
   title bar, so the frame is only a rounded hairline edge and a shadow.
   `view` crops it to a part of the window ([x, y, width, height]). */
export function WalletWindow({ alt, className, view = [0, 0, W, H], ...shell }: Parameters<typeof Shell>[0] & { alt: string; className?: string; view?: [number, number, number, number] }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-stroke bg-black shadow-[0_24px_80px_-24px_rgb(0_0_0/0.6)]", className)}>
      <svg viewBox={view.join(" ")} role="img" aria-label={alt} className="block h-auto w-full select-none" fontFamily={SANS} fontSize={13} fill={C.fg}>
        <Shell {...shell} />
      </svg>
    </div>
  )
}

/* The assistant's request, open: BAR_SURFACE (an opaque-ish popover over a
   heavy blur) lit by the assistants' blue, a 64px header with its icon,
   title and "An AI assistant asks", the request, and a footer of buttons
   under a hairline. It sits beside the node bar, at the window's foot. */
export function AssistantPanel({
  uid,
  under,
  x,
  y,
  icon,
  title,
  footerY,
  children,
}: {
  uid: string
  under: string
  x: number
  y: number
  icon: IconName
  title: string
  footerY: number
  children: ReactNode
}) {
  const w = W - 12 - x
  const h = H - 12 - y
  return (
    <g>
      <defs>
        <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={C.info} stopOpacity={0.13} />
          <stop offset="0.4" stopColor={C.info} stopOpacity={0.1} />
          <stop offset="0.72" stopColor="#5b5bf0" stopOpacity={0.05} />
          <stop offset="1" stopColor="#5b5bf0" stopOpacity={0} />
        </radialGradient>
        <filter colorInterpolationFilters="sRGB" id={`${uid}-drop`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>
      {/* shadow-popover */}
      <rect x={x + 8} y={y + 16} width={w - 16} height={h - 8} rx={16} fill="rgb(0 0 0 / 80%)" filter={`url(#${uid}-drop)`} />
      <Frost uid={uid} under={under} x={x} y={y} w={w} h={h} r={16} blur={40}>
        <rect x={x} y={y} width={w} height={h} fill={C.popover} opacity={0.8} />
        <rect x={x - w * 0.25} y={y - h * 0.6} width={w * 1.5} height={h * 2} fill={`url(#${uid}-glow)`} />
      </Frost>
      <rect x={x + 0.5} y={y + 0.5} width={w - 1} height={h - 1} rx={15.5} fill="none" stroke={C.glassEdge} />

      <Icon name={icon} cx={x + 30} cy={y + 32} size={20} color={C.infoInk} />
      <text x={x + 52} y={y + 28} fontSize={15} fontWeight={600}>
        {title}
      </text>
      <text x={x + 52} y={y + 44} fontSize={12} fill={C.muted}>
        An AI assistant asks
      </text>
      <line x1={x + 1} y1={y + 64.5} x2={x + w - 1} y2={y + 64.5} stroke="rgb(74 148 255 / 15%)" />

      {children}

      <line x1={x + 1} y1={footerY + 0.5} x2={x + w - 1} y2={footerY + 0.5} stroke={C.border} />
    </g>
  )
}

/* The account card of the Overview: who it is, what it holds, and the two
   things to do with it (pages/Wallet/index.tsx). */
export function AccountCard({ uid, balanceAt }: { uid: string; balanceAt: string }) {
  return (
    <g>
      <GlowCard uid={uid} y={128} h={274} />
      <Avatar uid={`${uid}-card`} who="account3" x={316} y={152} size={36} />
      <text x={364} y={166} fontWeight={600}>
        Account 3
      </text>
      <GroupedAddress x={364} y={183} who="account3" />
      <Icon name="copy" cx={721} cy={179} size={14} color={C.muted} />
      <text x={316} y={224} fontSize={12} fontWeight={500} fill={C.muted}>
        Balance
      </text>
      <Figure uid={uid} x={316} y={287} size={60} unitSize={24} value="6,973.0751" box={[316, 232, 624, 292]} />
      <text x={316} y={308} fontSize={12} fill={C.muted}>
        At block #{balanceAt}
      </text>
      <PrimaryButton uid={`${uid}-send`} x={316} y={336} w={160} h={40} r={12} icon="arrowUpRight" iconSize={16} label="Send" labelW={32} />
      <FlatButton x={488} y={336} w={160} h={40} r={12} icon="arrowDownLeft" iconSize={16} label="Receive" labelW={50} />
    </g>
  )
}

export const RECENT: Activity[] = [
  { block: "58,553", to: "0xccAF3a…476Eaf", amount: "−10000", when: "10 days ago" },
  { block: "36,455", to: "0xc7D3F3…0B3fde", amount: "−1", when: "169 days ago" },
  { block: "36,446", to: "0xc7D3F3…0B3fde", amount: "−1", when: "169 days ago" },
  { block: "36,445", to: "0xc7D3F3…0B3fde", amount: "−1", when: "169 days ago" },
  { block: "36,444", to: "0xc7D3F3…0B3fde", amount: "−1", when: "169 days ago" },
]

const ROW_H = 64

/* A panel of activity rows from y, 64px each, parted by hairlines. */
export function ActivityPanel({ y, rows }: { y: number; rows: Activity[] }) {
  return (
    <g>
      <Panel y={y} h={ROW_H * rows.length + 2} />
      {rows.map((a, i) => (
        <g key={i}>
          {i > 0 && <Divider y={y + 1 + i * ROW_H} />}
          <ActivityRow a={a} cy={y + 1 + ROW_H / 2 + i * ROW_H} />
        </g>
      ))}
    </g>
  )
}

/* The Overview's page: the account card and its recent activity. */
export function OverviewPage({ uid, balanceAt = "60,045" }: { uid: string; balanceAt?: string }) {
  return (
    <g>
      <AccountCard uid={uid} balanceAt={balanceAt} />
      <text x={296} y={444} fontSize={15} fontWeight={600}>
        Recent activity
      </text>
      <text x={1186} y={444} textAnchor="end" fontWeight={500} fill={C.brand}>
        See all
      </text>
      <Icon name="chevronRight" cx={1194} cy={440} size={12} color={C.brand} />
      <ActivityPanel y={464} rows={RECENT} />
    </g>
  )
}
