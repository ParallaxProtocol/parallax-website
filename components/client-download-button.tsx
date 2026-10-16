'use client'
import { Button } from "@/components/ui/button";
import { usePlatform, type Platform } from "@/hooks/usePlatform";
import { Download, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const REPO = {
  cli: {
    releasesPage: "https://github.com/ParallaxProtocol/parallax/releases/latest",
    latestApi: "https://api.github.com/repos/ParallaxProtocol/parallax/releases/latest",
  },
  gui: {
    releasesPage: "https://github.com/ParallaxProtocol/parallax-gui/releases/latest",
    latestApi: "https://api.github.com/repos/ParallaxProtocol/parallax-gui/releases/latest",
  },
} as const;

type ReleaseAsset = {
  name: string;
  browser_download_url: string;
};

type Release = {
  tag_name: string;
  assets: ReleaseAsset[];
};

export type ClientVariant = "cli" | "gui";

/** Map internal platform values to the GUI artifact naming convention. */
const GUI_OS: Record<string, string> = { darwin: "macos", linux: "linux", windows: "windows" };
const GUI_ARCH: Record<string, string> = { amd64: "x86_64", arm64: "arm64", "386": "x86", armv7: "armv7" };
const GUI_EXT: Record<string, string> = { darwin: ".dmg", linux: ".AppImage", windows: "-setup.exe" };

function findAsset(release: Release, platform: Platform, variant: ClientVariant): ReleaseAsset | null {
  if (variant === "gui") {
    // GUI artifacts follow: Parallax-Client-{version}-{os}-{arch}.{ext}
    const os = GUI_OS[platform.os] ?? platform.os;
    const arch = GUI_ARCH[platform.arch] ?? platform.arch;
    const ext = GUI_EXT[platform.os] ?? "";
    const version = release.tag_name.replace(/^v/, "");
    const exact = `Parallax-Client-${version}-${os}-${arch}${ext}`;
    return release.assets.find((a) => a.name === exact)
      // Fallback: match os + arch substring in case the version format changes slightly.
      ?? release.assets.find((a) => a.name.includes(`-${os}-${arch}`) && a.name.endsWith(ext) && !a.name.endsWith(".txt"))
      ?? null;
  }
  const ext = platform.os === "windows" ? "zip" : "tar.gz";
  const exact = `parallax-${platform.os}-${platform.arch}.${ext}`;
  const match = release.assets.find((a) => a.name === exact);
  if (match) return match;
  // Lenient OS-only fallback for CLI — but exclude GUI assets so we don't grab one by accident.
  return release.assets.find(
    (a) => !a.name.startsWith("parallax-gui-") && a.name.includes(`-${platform.os}-`),
  ) ?? null;
}

type Props = {
  variant?: ClientVariant;
  prominent?: boolean;
};

export default function ClientDownloadButton({ variant = "cli", prominent = true }: Props) {
  const t = useTranslations("common");
  const { platform, ready: platformReady } = usePlatform();
  const [release, setRelease] = useState<Release | null>(null);
  const [releaseReady, setReleaseReady] = useState(false);

  const { releasesPage, latestApi } = REPO[variant];

  useEffect(() => {
    let cancelled = false;
    fetch(latestApi, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? (r.json() as Promise<Release>) : null))
      .catch(() => null)
      .then((rel) => {
        if (cancelled) return;
        setRelease(rel);
        setReleaseReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [latestApi]);

  const ready = platformReady && releaseReady;
  const isMobile = ready && platform?.isMobile === true;
  const asset = ready && platform && !isMobile && release ? findAsset(release, platform, variant) : null;
  const href = asset?.browser_download_url ?? releasesPage;
  const version = release?.tag_name;

  if (isMobile) {
    return (
      <div className="inline-flex max-w-xs flex-col items-start gap-2 rounded-xl border border-stroke bg-card px-4 py-3">
        <div className="flex items-center gap-2 text-foreground">
          <Smartphone className="size-4 text-brand" strokeWidth={1.5} />
          <span className="text-sm font-medium">{t("desktopOnly")}</span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {t("desktopOnlyHint")}
        </p>
      </div>
    );
  }

  const fallbackLabel = variant === "gui" ? t("downloadDesktopApp") : t("downloadCli");
  const label = !ready
    ? fallbackLabel
    : asset && platform
      ? t("downloadFor", { platform: platform.label })
      : variant === "gui"
        ? t("viewDesktopBuilds")
        : fallbackLabel;

  return (
    <div className="relative inline-flex flex-col items-center">
      <Button
        variant={prominent ? "brand" : "outline"}
        size="lg"
        asChild
      >
        <a href={href} target="_blank" rel="noopener">
          <Download className="size-4" strokeWidth={2} />
          {label}
        </a>
      </Button>
      {ready && (
        <div className="mt-3 flex items-center gap-2 whitespace-nowrap text-xs text-muted-foreground">
          {version && asset ? (
            <>
              <span className="font-mono text-foreground/80">{version}</span>
              <span aria-hidden className="text-hairline">/</span>
            </>
          ) : null}
          <a href={releasesPage} target="_blank" rel="noopener" className="underline decoration-stroke underline-offset-4 transition-colors hover:text-foreground hover:decoration-brand">
            {t("otherPlatforms")}
          </a>
        </div>
      )}
    </div>
  );
}
