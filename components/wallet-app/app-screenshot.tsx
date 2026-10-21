import { AssistantPermissionArt, AssistantSendArt, HistoryArt, LedgerArt, OverviewArt, SendReviewArt } from "./wallet-art/screens"

// Parallax Wallet's screens, drawn as SVG from the app's own code
// (components/wallet-art) rather than captured.
export const walletShots = {
  overview: OverviewArt,
  sendReview: SendReviewArt,
  history: HistoryArt,
  assistantPermission: AssistantPermissionArt,
  assistantSend: AssistantSendArt,
  ledger: LedgerArt,
} as const

export type WalletShot = keyof typeof walletShots

/* A screen of the app, framed as a floating window: the app draws its
   own title bar, so the frame is only a rounded hairline edge and a shadow. */
export function AppScreenshot({ shot, alt, className }: { shot: WalletShot; alt: string; className?: string }) {
  const Art = walletShots[shot]
  return <Art alt={alt} className={className} />
}

/* A screen with a one-line caption under it. */
export function CaptionedShot({ shot, alt, caption }: { shot: WalletShot; alt: string; caption: string }) {
  return (
    <figure>
      <AppScreenshot shot={shot} alt={alt} />
      <figcaption className="mt-4 flex gap-3 text-sm leading-relaxed text-muted-foreground">
        <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-brand" />
        {caption}
      </figcaption>
    </figure>
  )
}
