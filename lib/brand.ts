import { readFileSync } from "node:fs"
import { join } from "node:path"

/**
 * Brand assets for the generated images (Open Graph cards, icons). Everything
 * is read from disk once at module load and inlined, so the routes render with
 * no network fetch — at build time for the static icon routes, per request for
 * the OG card.
 */
// Each read is scoped to its folder so the bundler traces only that folder
// into the server output, not the whole project.
const asset = (...parts: string[]) => readFileSync(join(process.cwd(), "assets", ...parts))

const dataUri = (file: string) =>
  `data:image/svg+xml;base64,${readFileSync(join(process.cwd(), "public", file)).toString("base64")}`

/** The mark alone, in its original gradient — for dark surfaces. */
export const LOGO_MARK = dataUri("new_parallax_logo_transparent.svg")

// The hero's depth wordmark, captured from the live page as a transparent
// PNG (see assets/og/README.md): the card renderer can't lay out the
// per-letter depth layers itself.
/** 1600×295, cropped to the letters. */
export const OG_WORDMARK = `data:image/png;base64,${asset("og", "wordmark-hero.png").toString("base64")}`
export const OG_WORDMARK_SIZE = { width: 1600, height: 295 }

/** The mark on its black rounded plate — for icons and light surfaces. */
export const LOGO_SQUARE = dataUri("new_parallax_logo_square.svg")

// Geist, the site's sans. Satori needs raw font data and cannot read WOFF2,
// hence the vendored TTFs rather than a next/font import.
export const GEIST_MEDIUM = asset("fonts", "Geist-Medium.ttf")
export const GEIST_LIGHT = asset("fonts", "Geist-Light.ttf")
