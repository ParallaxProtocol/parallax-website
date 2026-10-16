'use client'
import { Button } from "@/components/ui/button";
import { usePlatform, type Platform } from "@/hooks/usePlatform";
import { Download, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const RELEASES_PAGE = "https://github.com/ParallaxProtocol/parallax/releases/latest";
const LATEST_API = "https://api.github.com/repos/ParallaxProtocol/parallax/releases/latest";

type ReleaseAsset = {
  name: string;
  browser_download_url: string;
};

type Release = {
  tag_name: string;
  assets: ReleaseAsset[];
};

/* The command-line client's archives: parallax-<os>-<arch>.tar.gz, or .zip
   on Windows. The desktop app has its own button (wallet-app/). */
function findAsset(release: Release, platform: Platform): ReleaseAsset | null {
  const ext = platform.os === "windows" ? "zip" : "tar.gz";
  const exact = `parallax-${platform.os}-${platform.arch}.${ext}`;
  return release.assets.find((a) => a.name === exact)
    ?? release.assets.find((a) => a.name.startsWith(`parallax-${platform.os}-`) && a.name.endsWith(`.${ext}`))
    ?? null;
}

type Props = {
  prominent?: boolean;
  /** Where the version and "other platforms" line sits under the button. */
  align?: "start" | "center";
};

/** Downloads the Parallax Client (parallaxd and the CLI tools) for the
    visitor's platform from the latest GitHub release. */
export default function ClientDownloadButton({ prominent = true, align = "center" }: Props) {
  const t = useTranslations("common");
  const { platform, ready: platformReady } = usePlatform();
  const [release, setRelease] = useState<Release | null>(null);
  const [releaseReady, setReleaseReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(LATEST_API, { headers: { Accept: "application/vnd.github+json" } })
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
  }, []);

  const ready = platformReady && releaseReady;
  const isMobile = ready && platform?.isMobile === true;
  const asset = ready && platform && !isMobile && release ? findAsset(release, platform) : null;
  const href = asset?.browser_download_url ?? RELEASES_PAGE;
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

  const label = ready && asset && platform ? t("downloadFor", { platform: platform.label }) : t("downloadCli");

  return (
    <div className={`relative inline-flex flex-col ${align === "start" ? "items-start" : "items-center"}`}>
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
          <a href={RELEASES_PAGE} target="_blank" rel="noopener" className="underline decoration-stroke underline-offset-4 transition-colors hover:text-foreground hover:decoration-brand">
            {t("otherPlatforms")}
          </a>
        </div>
      )}
    </div>
  );
}
