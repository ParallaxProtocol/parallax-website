# Open Graph card assets

`wordmark-hero.png` is the homepage hero's depth wordmark
(`components/depth-wordmark.tsx`, variant `hero`), used by
`app/og.png/route.tsx`. The card renderer (Satori) can't draw it itself — the
depth layers are positioned from per-letter measurements a browser makes — so
it is captured from the running site instead:

1. With the dev server up, open `/en` in headless Chromium at a 1440px-wide
   viewport, device scale factor 2, reduced motion on.
2. Make the page transparent (`html, body, section, div { background:
   transparent }`, hide `.aurora` and the nav) and screenshot with
   `omitBackground`, clipped to the `h1 svg` box grown by 16px on every
   side — the outer strokes spill past the svg's own box, and an element
   screenshot would cut them.
3. Crop to the alpha bounding box and resize to 1600px wide.

Re-capture it whenever the wordmark's font, weight, depth or colours change.
