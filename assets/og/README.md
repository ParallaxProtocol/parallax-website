# Open Graph card backgrounds

Still frames of the hero's black hole (`components/black-hole.tsx`), used by
`app/og.png/route.tsx`. Captured from the running site with headless Chromium
by reading the WebGL canvas (`canvas.toDataURL()` inside a rAF callback, so the
drawing buffer is still valid), at a 1920×1080 window — the canvas itself is
text-free; the hero's tagline, vignette, and grain are DOM overlays.

- `blackhole-right.jpg` — hole filling ~95% of the height, tangent to the
  right edge, dark space on the left for the page title; background of every card,
  the brand card and the per-page title cards alike.
  Crop: `magick <capture>.png -crop 1200x630+80+197 +repage -quality 88 -strip blackhole-right.jpg`

The crop offsets assume the hole's glow is centered near (980, 512) in the
1920×993 capture; re-derive them if the hero's camera or framing changes.
