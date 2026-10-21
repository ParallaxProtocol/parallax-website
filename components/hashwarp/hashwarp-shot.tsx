import { HashwarpConsoleArt, HashwarpDashboardArt } from "@/components/showcase-art/hashwarp-art"
import { cn } from "@/lib/utils"

// Hashwarp's console and its web dashboard, drawn as SVG from its code
// (components/showcase-art/hashwarp-art.tsx) rather than captured.
export const hashwarpShots = {
  console: HashwarpConsoleArt,
  dashboard: HashwarpDashboardArt,
} as const

export type HashwarpShotName = keyof typeof hashwarpShots

/* A screen framed like Parallax Wallet's: a rounded hairline edge and a
   shadow. */
export function HashwarpShot({ shot, alt, className }: { shot: HashwarpShotName; alt: string; className?: string }) {
  const Art = hashwarpShots[shot]
  return (
    <div className={cn("overflow-hidden rounded-xl border border-stroke bg-black shadow-[0_24px_80px_-24px_rgb(0_0_0/0.6)]", className)}>
      <Art alt={alt} />
    </div>
  )
}

/* A screen with a one-line caption under it. */
export function CaptionedHashwarpShot({
  caption,
  ...props
}: React.ComponentProps<typeof HashwarpShot> & { caption: string }) {
  return (
    <figure>
      <HashwarpShot {...props} />
      <figcaption className="mt-4 flex gap-3 text-sm leading-relaxed text-muted-foreground">
        <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-brand" />
        {caption}
      </figcaption>
    </figure>
  )
}
