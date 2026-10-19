import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      // Translations are temporarily withdrawn; send old locale-prefixed
      // links to English. Not permanent so the locales can come back.
      {
        source: '/:locale(de|es|fil|fr|ja|ko|pt-BR|zh-CN)/:path*',
        destination: '/en/:path*',
        permanent: false,
      },
      // The canonical whitepaper is the second-edition PDF, at the site root
      // only: /whitepaper is its short link, and the removed HTML
      // transcription of the first edition (/introduction/whitepaper) and any
      // locale-prefixed or nested link to the PDF land on it too.
      ...['/whitepaper', '/introduction/whitepaper'].flatMap((from) => [
        { source: from, destination: '/parallax.pdf', permanent: true },
        { source: `/:locale(en)${from}`, destination: '/parallax.pdf', permanent: true },
      ]),
      {
        source: '/:path+/parallax.pdf',
        destination: '/parallax.pdf',
        permanent: true,
      },
      // Pages that moved or were merged, old path to where it lives now. Every
      // entry points at the final page, so no redirect chains through another.
      ...[
        // The flat paths (2026-10): the bitcoin.org-era Introduction,
        // Participate and Resources folders gave way to one level, grouped on
        // disk by nav group only.
        ['/introduction/how-it-works', '/:locale/how-it-works'],
        ['/introduction/parallax-for-bitcoiners', '/:locale/bitcoiners'],
        ['/introduction/parallax-for-developers', '/:locale/developers'],
        ['/introduction/verify', '/:locale/verify'],
        ['/introduction/doctrine', '/:locale/doctrine'],
        ['/introduction/getting-started', '/:locale/get-started'],
        ['/participate/mining', '/:locale/mining'],
        ['/resources/community', '/:locale/community'],
        ['/resources/network-atlas', '/:locale/network-atlas'],
        ['/resources/branding', '/:locale/branding'],
        // The client's page left Resources for the top level, beside the other
        // official programs (2026-10).
        ['/resources/parallax-client', '/:locale/parallax-client'],
        // The inner-pages consolidation (2026-10): thin pages merged into the
        // pages that cover the same ground, the docs hubs replaced by the docs.
        ['/participate/running-a-full-node', '/:locale/parallax-client'],
        ['/participate/development', '/:locale/community#contribute'],
        ['/participate/support-parallax', '/:locale/community#support'],
        ['/resources/beginner-guides', 'https://docs.parallaxprotocol.org/guides'],
        ['/resources/technical-documentation', 'https://docs.parallaxprotocol.org'],
        // The bitcoin.org-style audience pages were replaced by pages targeting
        // the protocol's actual audiences.
        ['/introduction/parallax-for-individuals', '/:locale/bitcoiners'],
        ['/introduction/parallax-for-businesses', '/:locale/developers'],
      ].flatMap(([from, to]) => [
        { source: `/:locale(en)${from}`, destination: to, permanent: true },
        { source: from, destination: to.replace('/:locale', '/en'), permanent: true },
      ]),
      // The protocol deep-dive pages were removed in the redesign.
      {
        source: '/:locale(en)/introduction/protocol/:path*',
        destination: '/:locale/how-it-works',
        permanent: false,
      },
      {
        source: '/introduction/protocol/:path*',
        destination: '/en/how-it-works',
        permanent: false,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/.well-known/nostr.json',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
