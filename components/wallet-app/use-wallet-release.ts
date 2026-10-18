'use client'
import { useEffect, useState } from "react"
import type { Platform } from "@/hooks/usePlatform"

export const WALLET_REPO_URL = "https://github.com/ParallaxProtocol/parallax-wallet"
export const WALLET_RELEASES_URL = `${WALLET_REPO_URL}/releases`
const LATEST_API = "https://api.github.com/repos/ParallaxProtocol/parallax-wallet/releases/latest"

export type WalletOs = "linux" | "macos" | "windows"
export type WalletArch = "x86_64" | "arm64"
/** AppImage and DMG are the only builds on Linux and macOS; Windows ships
    an installer and a portable executable. */
export type WalletKind = "appimage" | "dmg" | "installer" | "portable"

export type WalletAsset = {
  name: string
  url: string
  size: number
  os: WalletOs
  arch: WalletArch
  kind: WalletKind
}

export type WalletRelease = {
  version: string
  url: string
  assets: WalletAsset[]
  /** The release's SHA256SUMS.txt, when it has one. */
  checksums: string | null
}

type GithubRelease = {
  tag_name: string
  html_url: string
  assets: { name: string; browser_download_url: string; size: number }[]
}

/* Release artifacts are named as the in-app updater looks for them
   (desiredAssetName in parallax-wallet's backend/updater.go):
   Parallax-Wallet-<version>-<os>-<arch>.<ext>, the Windows installer
   ending -setup.exe. Builds of the old app (Parallax-Client-*) don't match,
   so a release without Wallet builds reads as "not out yet". */
const ASSET = /^Parallax-Wallet-.+-(linux|macos|windows)-(x86_64|arm64)(-setup\.exe|\.exe|\.AppImage|\.dmg)$/

const KIND: Record<string, WalletKind> = {
  ".AppImage": "appimage",
  ".dmg": "dmg",
  "-setup.exe": "installer",
  ".exe": "portable",
}

function parse(release: GithubRelease): WalletRelease {
  const assets: WalletAsset[] = []
  for (const a of release.assets) {
    const m = ASSET.exec(a.name)
    if (!m) continue
    assets.push({
      name: a.name,
      url: a.browser_download_url,
      size: a.size,
      os: m[1] as WalletOs,
      arch: m[2] as WalletArch,
      kind: KIND[m[3]],
    })
  }
  const sums = release.assets.find((a) => a.name === "SHA256SUMS.txt")
  return {
    version: release.tag_name,
    url: release.html_url,
    assets,
    checksums: assets.length > 0 && sums ? sums.browser_download_url : null,
  }
}

/* One request per page view, however many download controls ask. */
let pending: Promise<WalletRelease | null> | null = null

function fetchRelease(): Promise<WalletRelease | null> {
  pending ??= fetch(LATEST_API, { headers: { Accept: "application/vnd.github+json" } })
    .then((r) => (r.ok ? (r.json() as Promise<GithubRelease>) : null))
    .then((r) => (r ? parse(r) : null))
    .catch(() => null)
  return pending
}

/** The latest Parallax Wallet release. `available` is false until a
    release carries Parallax Wallet builds (or when GitHub can't be
    reached), which the page shows as "coming soon". */
export function useWalletRelease() {
  const [release, setRelease] = useState<WalletRelease | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchRelease().then((r) => {
      if (cancelled) return
      setRelease(r)
      setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { release, ready, available: !!release && release.assets.length > 0 }
}

const OS_OF: Record<Platform["os"], WalletOs> = { linux: "linux", darwin: "macos", windows: "windows" }

/** The build for this computer: the installer on Windows. */
export function assetFor(release: WalletRelease, platform: Platform): WalletAsset | null {
  const os = OS_OF[platform.os]
  const arch: WalletArch | null = platform.arch === "amd64" ? "x86_64" : platform.arch === "arm64" ? "arm64" : null
  if (!arch) return null
  const matches = release.assets.filter((a) => a.os === os && a.arch === arch)
  return matches.find((a) => a.kind !== "portable") ?? matches[0] ?? null
}

export function formatSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`
}
