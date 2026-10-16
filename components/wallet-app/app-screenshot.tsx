import Image from "next/image"
import { cn } from "@/lib/utils"

// Real captures of Parallax Wallet, cropped to the app window (or to its
// main panel) from 4K screenshots and stored in public/showcase/wallet.
export const walletShots = {
  overview: { src: "/showcase/wallet/overview.webp", width: 2056, height: 1533 },
  sendReview: { src: "/showcase/wallet/send-review.webp", width: 2056, height: 1533 },
  history: { src: "/showcase/wallet/history.webp", width: 2056, height: 1533 },
  assistantPermission: { src: "/showcase/wallet/assistant-permission.webp", width: 2056, height: 1533 },
  assistantSend: { src: "/showcase/wallet/assistant-send.webp", width: 2056, height: 1533 },
  ledger: { src: "/showcase/wallet/ledger.webp", width: 1616, height: 1232 },
} as const

export type WalletShot = keyof typeof walletShots

/* A screenshot of the app, framed as a floating window: the app draws its
   own title bar, so the frame is only a rounded hairline edge and a shadow. */
export function AppScreenshot({
  shot,
  alt,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority,
  className,
}: {
  shot: WalletShot
  alt: string
  sizes?: string
  priority?: boolean
  className?: string
}) {
  const { src, width, height } = walletShots[shot]
  return (
    <div className={cn("overflow-hidden rounded-xl border border-stroke bg-black shadow-[0_24px_80px_-24px_rgb(0_0_0/0.6)]", className)}>
      <Image src={src} alt={alt} width={width} height={height} sizes={sizes} priority={priority} className="block h-auto w-full" />
    </div>
  )
}

/* A screenshot with a one-line caption under it. */
export function CaptionedShot({ shot, alt, caption, sizes }: { shot: WalletShot; alt: string; caption: string; sizes?: string }) {
  return (
    <figure>
      <AppScreenshot shot={shot} alt={alt} sizes={sizes} />
      <figcaption className="mt-4 flex gap-3 text-sm leading-relaxed text-muted-foreground">
        <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-brand" />
        {caption}
      </figcaption>
    </figure>
  )
}
