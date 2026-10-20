import Image from "next/image"

// The pool's own web interface, captured against a staged API with
// mainnet-scale figures (the dev chain's numbers are private-chain ones).
const overview = { src: "/showcase/parallax-pool/pool-overview.webp", width: 2880, height: 1380 }

/* The overview screenshot, framed like Hashwarp's, with a one-line caption. */
export function PoolShot({ alt, caption }: { alt: string; caption: string }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-xl border border-stroke bg-black shadow-[0_24px_80px_-24px_rgb(0_0_0/0.6)]">
        <Image
          src={overview.src}
          alt={alt}
          width={overview.width}
          height={overview.height}
          sizes="(max-width: 1152px) 100vw, 1152px"
          priority
          className="block h-auto w-full"
        />
      </div>
      <figcaption className="mt-4 flex gap-3 text-sm leading-relaxed text-muted-foreground">
        <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-brand" />
        {caption}
      </figcaption>
    </figure>
  )
}
