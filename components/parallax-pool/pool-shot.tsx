import { PoolOverviewArt } from "@/components/showcase-art/pool-art"

/* The pool's own web interface, drawn as SVG from its code with
   mainnet-scale figures, framed like Hashwarp's, with a one-line caption. */
export function PoolShot({ alt, caption }: { alt: string; caption: string }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-xl border border-stroke bg-black shadow-[0_24px_80px_-24px_rgb(0_0_0/0.6)]">
        <PoolOverviewArt alt={alt} />
      </div>
      <figcaption className="mt-4 flex gap-3 text-sm leading-relaxed text-muted-foreground">
        <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-brand" />
        {caption}
      </figcaption>
    </figure>
  )
}
