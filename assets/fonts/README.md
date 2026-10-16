# Vendored fonts

`Geist-Medium.ttf` and `Geist-Light.ttf` (Geist v5), from Google Fonts — the
weights the site sets headings and standfirsts in.
Licensed under the SIL Open Font License 1.1.

They exist as files rather than as a `next/font` import because the Open Graph
card in `app/og.png/route.tsx` is rendered by Satori, which needs raw font data
and cannot read WOFF2. Kept out of `public/` so they are not served.
