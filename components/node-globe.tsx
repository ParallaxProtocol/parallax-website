'use client'
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import Globe, { type GlobeMethods } from "react-globe.gl"
import { useTheme } from "next-themes"
import { MeshPhongMaterial } from "three"
import { feature } from "topojson-client"
import type { FeatureCollection } from "geojson"
import type { Topology, GeometryCollection } from "topojson-specification"

export type GlobeNode = {
  lat: number
  lon: number
  country?: string
  countryCode?: string
  region?: string
  city?: string
}

type GlobeLabels = {
  nodeSingular: string
  nodePlural: string
  unknownLocation: string
}

type ClusterPoint = {
  lat: number
  lng: number
  count: number
  /** Deduplicated "City, Region, Country" labels for the tooltip. */
  locations: string[]
}

export type NodeGlobeApi = {
  /** Multiply the camera altitude by `factor` (<1 zooms in, >1 zooms out). */
  zoomBy: (factor: number) => void
}

interface NodeGlobeProps {
  /** Enables drag-rotate and hover tooltips (tooltips need `labels`). */
  interactive?: boolean
  nodes: GlobeNode[]
  /** Translated tooltip strings; enables point tooltips when interactive. */
  labels?: GlobeLabels
  /** Initial camera altitude override (globe radii above the surface). */
  altitude?: { desktop: number; mobile: number }
  /** Receives the imperative zoom API once the globe is ready. */
  onApi?: (api: NodeGlobeApi) => void
  /**
   * Adapt the palette to the active next-themes theme. Off by default so
   * surfaces that are always dark (the hero) keep the dark look in both themes.
   */
  followTheme?: boolean
}

/* The globe's own accent, used before the CSS token resolves. Defaults to the
   dark-surface brand because the globe renders on a dark sphere unless
   followTheme puts it on the page background. */
const BRAND_FALLBACK = "#23c9c9"

const DEFAULT_ALTITUDE = { desktop: 2.2, mobile: 3.0 }
const MIN_ALTITUDE = 0.7
const MAX_ALTITUDE = 4.5

const DARK_PALETTE = {
  sphereColor: "#0b0d15",
  sphereOpacity: 0.94,
  landColor: "rgba(148, 163, 184, 0.55)",
  // Tooltip is a small panel: near-black card, 1px hairline, soft depth.
  tooltipBg: "rgba(11, 11, 12, 0.94)",
  tooltipBorder: "rgba(255, 255, 255, 0.14)",
  tooltipColor: "#ffffff",
  tooltipShadow: "rgba(0, 0, 0, 0.45)",
}

const LIGHT_PALETTE = {
  sphereColor: "#edeae2",
  sphereOpacity: 1,
  landColor: "rgba(71, 85, 105, 0.55)",
  tooltipBg: "rgba(255, 255, 255, 0.96)",
  tooltipBorder: "rgba(10, 10, 10, 0.12)",
  tooltipColor: "#0a0a0a",
  tooltipShadow: "rgba(10, 10, 10, 0.12)",
}

type Ring = number[][]
type PolygonCoords = Ring[]

/**
 * countries-110m.json contains degenerate rings collapsed to a single
 * repeated point by quantization (e.g. North Korea's first sub-polygon),
 * which make h3-js polygonToCells throw. Keep only rings with at least
 * three distinct vertices.
 */
function isValidRing(ring: Ring): boolean {
  const distinct = new Set(ring.map(([x, y]) => `${x},${y}`))
  return distinct.size >= 3
}

function sanitizeFeatures(fc: FeatureCollection): FeatureCollection["features"] {
  const out: FeatureCollection["features"] = []
  for (const f of fc.features) {
    const geom = f.geometry
    if (geom.type === "Polygon") {
      const rings = (geom.coordinates as PolygonCoords).filter(isValidRing)
      if (rings.length) out.push({ ...f, geometry: { ...geom, coordinates: rings } })
    } else if (geom.type === "MultiPolygon") {
      const polys = (geom.coordinates as PolygonCoords[])
        .map((poly) => poly.filter(isValidRing))
        .filter((poly) => poly.length > 0)
      if (polys.length) out.push({ ...f, geometry: { ...geom, coordinates: polys } })
    }
  }
  return out
}

function locationLabel(node: GlobeNode, unknownLabel: string): string {
  const parts: string[] = []
  if (node.city) parts.push(node.city)
  if (node.region && node.region !== node.city) parts.push(node.region)
  if (node.country) parts.push(node.country)
  return parts.join(", ") || unknownLabel
}

/**
 * How much the point layer pulls apart, chosen from the camera altitude.
 *
 * - `merged` — far out: nearby cities collapse into one dot, so a continent
 *   doesn't read as a smear of overlapping marks.
 * - `exact` — mid: one dot per distinct coordinate.
 * - `spread` — close in: nodes sharing a coordinate fan out into a ring so
 *   each is individually visible and hoverable.
 */
type DetailLevel = "merged" | "exact" | "spread"

/**
 * Altitude thresholds, in globe radii (the camera runs MIN_ALTITUDE..MAX_ALTITUDE).
 * Quantising to three bands means a zoom gesture only rebuilds the point layer
 * when it crosses a boundary, not on every frame.
 */
function detailLevel(altitude: number): DetailLevel {
  if (altitude >= 2.2) return "merged"
  if (altitude > 1.2) return "exact"
  return "spread"
}

/** Merge radius for the `merged` band, in degrees of arc. */
const MERGE_RADIUS_DEG = 4

/**
 * Centre-to-centre spacing to leave between fanned-out nodes, in angular
 * degrees. Single nodes draw at 0.5° radius (three-globe sizes points in
 * degrees), so 1.15° leaves a visible gap between neighbours without pushing
 * anyone further from their real coordinate than the fan needs.
 */
const SPREAD_GAP_DEG = 1.15

/**
 * Ring radius that spaces `count` nodes `SPREAD_GAP_DEG` apart around a circle.
 * Adjacent spacing on a ring of radius r is 2·r·sin(π/n), so invert that: a
 * pair barely moves (~0.58°), and only large groups fan out far.
 */
function spreadRadiusDeg(count: number): number {
  return SPREAD_GAP_DEG / (2 * Math.sin(Math.PI / count))
}

/**
 * Offset `lat`/`lon` by `deg` of arc at bearing `theta`. Longitude degrees
 * shrink towards the poles, hence the cos(lat) divisor; it is clamped so a
 * high-latitude node doesn't fling its ring across the map.
 */
function offsetDeg(lat: number, lon: number, deg: number, theta: number): [number, number] {
  const shrink = Math.max(0.2, Math.cos((lat * Math.PI) / 180))
  return [lat + deg * Math.cos(theta), lon + (deg * Math.sin(theta)) / shrink]
}

/** Group nodes sharing geolocation coordinates into single labeled points. */
function clusterNodes(nodes: GlobeNode[], unknownLabel: string): ClusterPoint[] {
  const buckets = new Map<string, ClusterPoint & { locationSet: Set<string> }>()
  for (const n of nodes) {
    const key = `${n.lat},${n.lon}`
    const existing = buckets.get(key)
    const label = locationLabel(n, unknownLabel)
    if (existing) {
      existing.count++
      existing.locationSet.add(label)
    } else {
      buckets.set(key, {
        lat: n.lat,
        lng: n.lon,
        count: 1,
        locations: [],
        locationSet: new Set([label]),
      })
    }
  }
  return Array.from(buckets.values()).map((b) => ({
    lat: b.lat,
    lng: b.lng,
    count: b.count,
    locations: Array.from(b.locationSet),
  }))
}

/** Great-circle separation of two points, in degrees of arc. */
function arcDeg(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const rad = Math.PI / 180
  const dLat = (b.lat - a.lat) * rad
  const dLng = (b.lng - a.lng) * rad
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2
  return (2 * Math.asin(Math.min(1, Math.sqrt(h))) * 180) / Math.PI
}

/**
 * Collapse points within `radiusDeg` of each other into one mark at their
 * weighted centroid.
 *
 * Greedy around the densest point rather than a lat/lng grid: a grid leaves two
 * cities a degree apart unmerged whenever they straddle a cell boundary, which
 * is exactly the case this band exists to clean up. Quadratic, on a list that
 * is one entry per populated city.
 */
function mergeNearby(points: ClusterPoint[], radiusDeg: number): ClusterPoint[] {
  // Densest first, then by coordinate, so the output never depends on input order.
  const order = [...points].sort(
    (a, b) => b.count - a.count || a.lat - b.lat || a.lng - b.lng,
  )
  const taken = new Set<number>()
  const out: ClusterPoint[] = []

  for (let i = 0; i < order.length; i++) {
    if (taken.has(i)) continue
    taken.add(i)
    const seed = order[i]
    let lat = seed.lat * seed.count
    let lng = seed.lng * seed.count
    let count = seed.count
    const locations = new Set(seed.locations)

    for (let j = i + 1; j < order.length; j++) {
      if (taken.has(j) || arcDeg(seed, order[j]) > radiusDeg) continue
      taken.add(j)
      const p = order[j]
      lat += p.lat * p.count
      lng += p.lng * p.count
      count += p.count
      for (const l of p.locations) locations.add(l)
    }
    out.push({ lat: lat / count, lng: lng / count, count, locations: Array.from(locations) })
  }
  return out
}

/**
 * Fan co-located nodes into a ring around their shared coordinate.
 *
 * Geolocation resolves to a city centroid, so every node in one city lands on
 * exactly the same lat/lon — zooming cannot separate marks that occupy the same
 * point, however far in the camera goes. Nudging them apart is the only way to
 * make the individuals addressable; the offset stays small enough to sit inside
 * the error of a city-level fix, and each keeps its real city in the tooltip.
 */
function spreadColocated(nodes: GlobeNode[], unknownLabel: string): ClusterPoint[] {
  const groups = new Map<string, GlobeNode[]>()
  for (const n of nodes) {
    const key = `${n.lat},${n.lon}`
    const group = groups.get(key)
    if (group) group.push(n)
    else groups.set(key, [n])
  }

  const out: ClusterPoint[] = []
  for (const group of groups.values()) {
    if (group.length === 1) {
      const n = group[0]
      out.push({ lat: n.lat, lng: n.lon, count: 1, locations: [locationLabel(n, unknownLabel)] })
      continue
    }
    const ring = spreadRadiusDeg(group.length)
    group.forEach((n, i) => {
      // Start at 12 o'clock; input order is stable, so the ring doesn't spin
      // between renders.
      const theta = (2 * Math.PI * i) / group.length
      const [lat, lng] = offsetDeg(n.lat, n.lon, ring, theta)
      out.push({ lat, lng, count: 1, locations: [locationLabel(n, unknownLabel)] })
    })
  }
  return out
}

/** Build the point layer for a given zoom band. */
function buildPoints(
  nodes: GlobeNode[],
  unknownLabel: string,
  level: DetailLevel,
): ClusterPoint[] {
  if (level === "spread") return spreadColocated(nodes, unknownLabel)
  const exact = clusterNodes(nodes, unknownLabel)
  return level === "merged" ? mergeNearby(exact, MERGE_RADIUS_DEG) : exact
}

const subscribeNever = () => () => {}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export default function NodeGlobe({
  interactive = false,
  nodes,
  labels,
  altitude = DEFAULT_ALTITUDE,
  onApi,
  followTheme = false,
}: NodeGlobeProps) {
  const { resolvedTheme } = useTheme()
  const palette = followTheme && resolvedTheme === "light" ? LIGHT_PALETTE : DARK_PALETTE
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [land, setLand] = useState<FeatureCollection | null>(null)
  const [ready, setReady] = useState(false)
  // Seeded from the resting camera altitude so the first paint matches the
  // band the camera actually starts in.
  const [level, setLevel] = useState<DetailLevel>(() => detailLevel(altitude.desktop))

  // Track container size so the canvas always fills the wrapper.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setSize({ width, height })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Resolve the design-system brand token; WebGL can't read CSS variables.
  // Mirrors the palette choice above: a globe that ignores the theme sits on
  // the dark sphere in both modes, so it wants the full-strength stops rather
  // than light mode's darkened brand.
  const readBrand = useCallback(() => {
    const token = palette === LIGHT_PALETTE ? "--brand" : "--brand-on-dark"
    return getComputedStyle(document.documentElement).getPropertyValue(token).trim() || BRAND_FALLBACK
  }, [palette])
  const brand = useSyncExternalStore(subscribeNever, readBrand, () => BRAND_FALLBACK)

  useEffect(() => {
    let cancelled = false
    fetch("/maps/countries-110m.json")
      .then((r) => r.json())
      .then((topology: Topology) => {
        if (cancelled) return
        const obj = topology.objects.countries as GeometryCollection
        setLand(feature(topology, obj) as unknown as FeatureCollection)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const globeMaterial = useMemo(
    () =>
      new MeshPhongMaterial({
        color: palette.sphereColor,
        transparent: true,
        opacity: palette.sphereOpacity,
      }),
    [palette],
  )

  const landFeatures = useMemo(() => (land ? sanitizeFeatures(land) : []), [land])
  const landColor = useMemo(() => {
    const color = palette.landColor
    return () => color
  }, [palette])

  const showTooltips = interactive && !!labels
  const points = useMemo<ClusterPoint[]>(
    () =>
      showTooltips
        ? buildPoints(nodes, labels!.unknownLocation, level)
        : nodes.map((n) => ({ lat: n.lat, lng: n.lon, count: 1, locations: [] })),
    [nodes, showTooltips, labels, level],
  )

  // Fires continuously while zooming; setting the same band is a no-op for
  // React, so the point layer only rebuilds when a threshold is crossed.
  const handleZoom = useCallback((pov: { altitude: number }) => {
    setLevel(detailLevel(pov.altitude))
  }, [])

  const pointLabel = useMemo(() => {
    if (!showTooltips) return undefined
    return (obj: object) => {
      const p = obj as ClusterPoint
      const noun = p.count === 1 ? labels!.nodeSingular : labels!.nodePlural
      const where =
        p.locations.length === 1
          ? `<div style="opacity:0.7">${escapeHtml(p.locations[0])}</div>`
          : ""
      return `<div style="font-family:var(--font-mono, monospace);font-size:12px;color:${palette.tooltipColor};background:${palette.tooltipBg};border:1px solid ${palette.tooltipBorder};border-radius:8px;box-shadow:0 8px 24px ${palette.tooltipShadow};backdrop-filter:blur(8px);padding:7px 11px;line-height:1.5;white-space:nowrap"><div>${p.count} ${escapeHtml(noun)}</div>${where}</div>`
    }
  }, [showTooltips, labels, palette])

  const handleGlobeReady = () => {
    const globe = globeRef.current
    if (!globe) return
    // globe.gl wraps pointLabel in its own translucent, rounded box; strip it
    // so the label's own panel styling is the only chrome.
    containerRef.current?.querySelectorAll<HTMLElement>(".float-tooltip-kap").forEach((el) => {
      el.style.padding = "0"
      el.style.background = "transparent"
      el.style.borderRadius = "0"
    })
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const controls = globe.controls()
    controls.autoRotate = !prefersReducedMotion
    controls.autoRotateSpeed = 0.4
    // Wheel/pinch zoom stays off even in interactive mode so the page keeps
    // scrolling normally over the globe; zooming goes through the button API.
    controls.enableZoom = false
    controls.enablePan = false
    controls.enableRotate = interactive
    if (interactive) {
      // Stop the slow spin as soon as the visitor takes over.
      controls.addEventListener("start", () => {
        controls.autoRotate = false
      })
    }
    const isMobile = window.innerWidth < 768
    globe.pointOfView({ lat: 18, lng: -35, altitude: isMobile ? altitude.mobile : altitude.desktop }, 0)
    setReady(true)
    onApi?.({
      zoomBy: (factor: number) => {
        const pov = globe.pointOfView()
        const next = Math.max(MIN_ALTITUDE, Math.min(MAX_ALTITUDE, pov.altitude * factor))
        globe.pointOfView({ ...pov, altitude: next }, 300)
      },
    })
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 transition-opacity duration-[1500ms] ease-out ${ready ? "opacity-100" : "opacity-0"} ${interactive ? "" : "pointer-events-none"}`}
      aria-hidden={!interactive}
    >
      {size.width > 0 && size.height > 0 && (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          globeMaterial={globeMaterial}
          showAtmosphere
          atmosphereColor={brand}
          atmosphereAltitude={0.12}
          hexPolygonsData={landFeatures}
          hexPolygonResolution={3}
          hexPolygonMargin={0.6}
          hexPolygonUseDots
          hexPolygonColor={landColor}
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => brand}
          pointAltitude={0.012}
          pointRadius={(obj: object) => {
            const p = obj as ClusterPoint
            return Math.min(0.5 + Math.log2(p.count) * 0.18, 1.1)
          }}
          pointsMerge={!showTooltips}
          pointLabel={pointLabel}
          onZoom={interactive ? handleZoom : undefined}
          enablePointerInteraction={interactive}
          animateIn={false}
          onGlobeReady={handleGlobeReady}
          rendererConfig={{ antialias: true, alpha: true }}
        />
      )}
    </div>
  )
}
