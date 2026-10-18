'use client'
import { Button } from "@/components/ui/button"
import { usePlatform, type Os } from "@/hooks/usePlatform"
import { HASHWARP_REPO, HASHWARP_REPO_URL } from "@/lib/hashwarp"
import { cn } from "@/lib/utils"
import { Download, Smartphone } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

const RELEASES_PAGE = `${HASHWARP_REPO_URL}/releases/latest`
const LATEST_API = `https://api.github.com/repos/${HASHWARP_REPO}/releases/latest`

type ReleaseAsset = {
  name: string
  browser_download_url: string
}

type Release = {
  tag_name: string
  assets: ReleaseAsset[]
}

/* Hashwarp's archives: hashwarp-<tag>-<os>.tar.gz, or .zip on Windows, from
   2.0.0 on. Earlier releases split them by backend
   (hashwarp-<tag>-cuda12-linux.tar.xz), so any archive for the OS will do.
   The HiveOS and mmpOS packages carry no OS in their names and never match.
   There are no macOS builds. */
function findAsset(release: Release, os: Os): ReleaseAsset | null {
  if (os === "darwin") return null
  const exts = os === "windows" ? [".zip"] : [".tar.gz", ".tar.xz"]
  const forOs = release.assets.filter(
    (a) => a.name.startsWith("hashwarp-v") && exts.some((ext) => a.name.endsWith(`-${os}${ext}`)),
  )
  return forOs.find((a) => a.name.startsWith(`hashwarp-${release.tag_name}-${os}.`)) ?? forOs[0] ?? null
}

/** Downloads Hashwarp for the visitor's OS from the latest GitHub release.
    Children sit beside the button, like WalletDownloadButton's. */
export function HashwarpDownloadButton({ children }: { children?: React.ReactNode }) {
  const t = useTranslations("hashwarp.download")
  const tCommon = useTranslations("common")
  const { platform, ready: platformReady } = usePlatform()
  const [release, setRelease] = useState<Release | null>(null)
  const [releaseReady, setReleaseReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(LATEST_API, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? (r.json() as Promise<Release>) : null))
      .catch(() => null)
      .then((rel) => {
        if (cancelled) return
        setRelease(rel)
        setReleaseReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const ready = platformReady && releaseReady
  const isMobile = ready && platform?.isMobile === true
  const asset = ready && platform && !isMobile && release ? findAsset(release, platform.os) : null
  const href = asset?.browser_download_url ?? RELEASES_PAGE

  if (isMobile) {
    return (
      <div className="inline-flex max-w-xs flex-col items-start gap-2 rounded-xl border border-stroke bg-card px-4 py-3">
        <div className="flex items-center gap-2 text-foreground">
          <Smartphone className="size-4 text-brand" strokeWidth={1.5} />
          <span className="text-sm font-medium">{tCommon("desktopOnly")}</span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{t("platforms")}</p>
      </div>
    )
  }

  const label = asset && platform ? t("for", { os: platform.osLabel }) : t("label")

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex flex-wrap items-start gap-3">
        <Button variant="brand" size="lg" asChild>
          <a href={href} target="_blank" rel="noopener">
            <Download className="size-4" strokeWidth={2} />
            {label}
          </a>
        </Button>
        {children}
      </div>
      <p className={cn("flex min-h-4 items-center gap-2 whitespace-nowrap text-xs text-muted-foreground", !ready && "invisible")}>
        {asset && release ? (
          <>
            <span className="font-mono text-foreground/80">{release.tag_name}</span>
            <span aria-hidden className="text-hairline">/</span>
            <a href={RELEASES_PAGE} target="_blank" rel="noopener" className="underline decoration-stroke underline-offset-4 transition-colors hover:text-foreground hover:decoration-brand">
              {tCommon("otherPlatforms")}
            </a>
          </>
        ) : (
          t("platforms")
        )}
      </p>
    </div>
  )
}
