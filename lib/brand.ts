import { readFileSync } from "node:fs"
import { join } from "node:path"

/**
 * Brand assets for the generated images (Open Graph cards, icons). Everything
 * is read from disk once at module load and inlined, so the routes render with
 * no network fetch — at build time for the static icon routes, per request for
 * the OG card.
 */
const asset = (...parts: string[]) => readFileSync(join(process.cwd(), ...parts))

const dataUri = (file: string) =>
  `data:image/svg+xml;base64,${asset("public", file).toString("base64")}`

/** The mark alone, in its original gradient — for dark surfaces. */
export const LOGO_MARK = dataUri("new_parallax_logo_transparent.svg")

// Still frames of the hero's black hole, captured from the live WebGL scene
// and cropped for the 1200×630 Open Graph canvas (see assets/og/README.md).
const jpegDataUri = (...parts: string[]) =>
  `data:image/jpeg;base64,${asset(...parts).toString("base64")}`

/** Hole in the right two-thirds — background for every card, the copy in
 *  the dark field left of it. */
export const OG_BLACKHOLE_RIGHT = jpegDataUri("assets", "og", "blackhole-right.jpg")

/** The mark on its black rounded plate — for icons and light surfaces. */
export const LOGO_SQUARE = dataUri("new_parallax_logo_square.svg")

// Geist, the site's sans. Satori needs raw font data and cannot read WOFF2,
// hence the vendored TTFs rather than a next/font import.
export const GEIST_MEDIUM = asset("assets", "fonts", "Geist-Medium.ttf")
export const GEIST_LIGHT = asset("assets", "fonts", "Geist-Light.ttf")
export const GEIST_MONO_MEDIUM = asset("assets", "fonts", "GeistMono-Medium.ttf")
