'use client'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { usePlatform } from "@/hooks/usePlatform"
import { cn } from "@/lib/utils"
import { ArrowDown, Download, ExternalLink, Smartphone } from "lucide-react"
import { useTranslations } from "next-intl"
import { FaApple, FaGithub, FaLinux, FaWindows } from "react-icons/fa"
import {
  WALLET_RELEASES_URL,
  WALLET_REPO_URL,
  assetFor,
  formatSize,
  useWalletRelease,
  type WalletArch,
  type WalletKind,
  type WalletOs,
} from "./use-wallet-release"

const ARCH_LABEL: Record<WalletOs, Record<WalletArch, string>> = {
  linux: { x86_64: "x86_64", arm64: "ARM64" },
  macos: { x86_64: "Intel", arm64: "Apple silicon" },
  windows: { x86_64: "x64", arm64: "ARM64" },
}

const OS_LABEL: Record<WalletOs, string> = { linux: "Linux", macos: "macOS", windows: "Windows" }

/* The hero's call to action: this computer's build once a release carries
   Parallax Wallet builds, "coming soon" until then. Either way the rest of
   the builds are one jump down, in the download section. `children` are
   secondary actions set in the same row, above the status line. */
export function WalletDownloadButton({ children }: { children?: React.ReactNode }) {
  const t = useTranslations("parallaxWallet.download")
  const tc = useTranslations("common")
  const { platform, ready: platformReady } = usePlatform()
  const { release, ready: releaseReady, available } = useWalletRelease()

  const ready = platformReady && releaseReady
  const asset = ready && available && release && platform && !platform.isMobile ? assetFor(release, platform) : null

  let primary: React.ReactNode
  let status: React.ReactNode

  if (ready && platform?.isMobile) {
    primary = (
      <div className="inline-flex max-w-xs flex-col items-start gap-2 rounded-xl border border-stroke bg-card px-4 py-3">
        <div className="flex items-center gap-2 text-foreground">
          <Smartphone className="size-4 text-brand" strokeWidth={1.5} />
          <span className="text-sm font-medium">{tc("desktopOnly")}</span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{tc("desktopOnlyHint")}</p>
      </div>
    )
  } else if (asset && release) {
    primary = (
      <Button variant="brand" size="lg" asChild>
        <a href={asset.url}>
          <Download className="size-4" strokeWidth={2} />
          {tc("downloadFor", { platform: `${OS_LABEL[asset.os]} (${ARCH_LABEL[asset.os][asset.arch]})` })}
        </a>
      </Button>
    )
    status = (
      <>
        <span className="font-mono text-foreground/80">{release.version}</span>
        <span aria-hidden className="text-hairline">/</span>
        <a href="#download" className="underline decoration-stroke underline-offset-4 transition-colors hover:text-foreground hover:decoration-brand">
          {tc("otherPlatforms")}
        </a>
      </>
    )
  } else if (ready && !available) {
    primary = (
      <span className="inline-flex h-11 items-center gap-2.5 rounded-full border border-stroke bg-foreground/[0.04] px-5 text-[15px] font-medium text-foreground">
        <span aria-hidden className="size-1.5 rounded-full bg-brand animate-pulse motion-reduce:animate-none" />
        {t("comingSoon")}
      </span>
    )
    status = t("comingSoonHint")
  } else {
    // Still asking GitHub, or a release without this computer's build:
    // send them to the full list.
    primary = (
      <Button variant="brand" size="lg" asChild>
        <a href="#download">
          {t("getIt")}
          <ArrowDown />
        </a>
      </Button>
    )
    if (ready) status = t("allPlatforms")
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex flex-wrap items-start gap-3">
        {primary}
        {children}
      </div>
      <p className={cn("flex min-h-4 items-center gap-2 text-xs text-muted-foreground", !status && "invisible")}>{status}</p>
    </div>
  )
}

const BUILDS: { os: WalletOs; icon: typeof FaLinux; rows: { kind: WalletKind; arch: WalletArch }[] }[] = [
  { os: "macos", icon: FaApple, rows: [{ kind: "dmg", arch: "arm64" }, { kind: "dmg", arch: "x86_64" }] },
  { os: "windows", icon: FaWindows, rows: [{ kind: "installer", arch: "x86_64" }, { kind: "portable", arch: "x86_64" }] },
  { os: "linux", icon: FaLinux, rows: [{ kind: "appimage", arch: "x86_64" }, { kind: "appimage", arch: "arm64" }] },
]

const DETECTED_OS: Record<string, WalletOs> = { darwin: "macos", windows: "windows", linux: "linux" }

/* Every build of the latest release, by platform. Before the first
   Parallax Wallet release the same grid lists what will ship, unlinked. */
export function WalletDownloads() {
  const t = useTranslations("parallaxWallet.download")
  const { platform } = usePlatform()
  const { release, ready, available } = useWalletRelease()
  const detected = platform && !platform.isMobile ? DETECTED_OS[platform.os] : null

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {ready && available && release ? (
          <>
            <Badge>{t("latest")}</Badge>
            <span className="font-mono text-sm text-foreground">{release.version}</span>
          </>
        ) : ready ? (
          <Badge variant="outline">{t("comingSoon")}</Badge>
        ) : (
          <span className="h-[22px]" />
        )}
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline md:grid-cols-3">
        {BUILDS.map(({ os, icon: Icon, rows }) => (
          <div key={os} className={cn("flex flex-col bg-background p-6 sm:p-8", detected === os && "bg-foreground/[0.03]")}>
            <div className="flex items-start justify-between gap-4">
              <Icon className="size-7 text-foreground" aria-hidden />
              {detected === os && <Badge variant="outline" className="text-muted-foreground">{t("yourSystem")}</Badge>}
            </div>
            <h3 className="mt-8 text-2xl leading-tight text-foreground">{OS_LABEL[os]}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`notes.${os}`)}</p>
            <ul className="mt-6 divide-y divide-hairline border-y border-hairline">
              {rows.map(({ kind, arch }) => {
                const asset = available ? release?.assets.find((a) => a.os === os && a.kind === kind && a.arch === arch) : undefined
                const label = (
                  <span className="min-w-0">
                    <span className="block text-[15px] text-foreground">{t(`kinds.${kind}`)}</span>
                    <span className="block font-mono text-xs text-muted-foreground">
                      {ARCH_LABEL[os][arch]}
                      {asset && ` · ${formatSize(asset.size)}`}
                    </span>
                  </span>
                )
                return (
                  <li key={kind + arch}>
                    {asset ? (
                      <a href={asset.url} className="group flex items-center justify-between gap-4 py-3.5">
                        {label}
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-stroke text-foreground transition-colors group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                          <Download className="size-4" strokeWidth={1.5} aria-hidden />
                          <span className="sr-only">{t("downloadAsset", { name: asset.name })}</span>
                        </span>
                      </a>
                    ) : (
                      <div className="flex items-center justify-between gap-4 py-3.5">
                        {label}
                        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/70">
                          {ready && available ? t("notInRelease") : t("soon")}
                        </span>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        <Button variant="outline" asChild>
          <a href={WALLET_REPO_URL} target="_blank" rel="noopener">
            <FaGithub />
            {t("source")}
          </a>
        </Button>
        {ready && available && release ? (
          <>
            <Button variant="secondary" asChild>
              <a href={release.url} target="_blank" rel="noopener">
                {t("releaseNotes")}
                <ExternalLink />
              </a>
            </Button>
            {release.checksums && (
              <a href={release.checksums} className="text-sm text-muted-foreground underline decoration-stroke underline-offset-4 transition-colors hover:text-foreground hover:decoration-brand sm:ml-2">
                {t("checksums")}
              </a>
            )}
          </>
        ) : (
          <a href={WALLET_RELEASES_URL} target="_blank" rel="noopener" className="text-sm text-muted-foreground underline decoration-stroke underline-offset-4 transition-colors hover:text-foreground hover:decoration-brand sm:ml-2">
            {t("watchReleases")}
          </a>
        )}
      </div>
    </div>
  )
}
