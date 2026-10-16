'use client'

import { ChevronDown, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

/* The command-line client's releases. Parallax Wallet's are on its own
   page (wallet-app/). */
const RELEASES_API = "https://api.github.com/repos/ParallaxProtocol/parallax/releases?per_page=10";
const ALL_RELEASES = "https://github.com/ParallaxProtocol/parallax/releases";

const MAX_RELEASES = 4;

type Asset = {
  name: string;
  browser_download_url: string;
  size: number;
};

type Release = {
  tag_name: string;
  name: string;
  html_url: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
  assets: Asset[];
};

function formatDate(iso: string, locale: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
}

function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

function ReleaseTable({ releases, allReleasesUrl }: { releases: Release[]; allReleasesUrl: string }) {
  const t = useTranslations("resources.parallaxClient.releases");
  const locale = useLocale();
  const latestStableIndex = releases.findIndex((r) => !r.prerelease && !r.draft);
  const visible = releases.filter((r) => !r.draft).slice(0, MAX_RELEASES);

  if (visible.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-stroke bg-card px-6 py-8 text-sm text-muted-foreground">{t("noReleases")}</p>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-stroke bg-card">
        <div className="hidden sm:grid grid-cols-12 gap-4 border-b border-hairline px-6 py-3.5 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <div className="col-span-3">{t("columnVersion")}</div>
          <div className="col-span-3">{t("columnReleased")}</div>
          <div className="col-span-4">{t("columnAssets")}</div>
          <div className="col-span-2 text-right">{t("columnLink")}</div>
        </div>

        {visible.map((release) => {
          const binaryAssets = release.assets.filter(
            (a) =>
              a.name.endsWith(".tar.gz") ||
              a.name.endsWith(".zip"),
          );
          const isLatestStable = releases.indexOf(release) === latestStableIndex;
          return (
            <div
              key={release.tag_name}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-5 border-b border-hairline last:border-b-0 hover:bg-foreground/[0.03] transition-colors"
            >
              <div className="sm:col-span-3 flex items-center gap-2">
                <span className="font-mono text-base text-foreground">{release.tag_name}</span>
                {isLatestStable && (
                  <Badge>{t("latestBadge")}</Badge>
                )}
                {release.prerelease && (
                  <Badge variant="outline" className="text-muted-foreground">{t("preBadge")}</Badge>
                )}
              </div>
              <div className="sm:col-span-3 text-sm text-muted-foreground font-mono">
                {formatDate(release.published_at, locale)}
              </div>
              <div className="sm:col-span-4 text-sm text-muted-foreground">
                {binaryAssets.length > 0 ? (
                  <span>{t("artifactsCount", { count: binaryAssets.length })}</span>
                ) : (
                  <span>{t("sourceOnly")}</span>
                )}
              </div>
              <div className="sm:col-span-2 sm:text-right">
                <a
                  href={release.html_url}
                  target="_blank"
                  rel="noopener"
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
                >
                  {t("view")}
                  <ExternalLink className="size-3.5 text-brand" />
                </a>
              </div>
              {binaryAssets.length > 0 && (
                <div className="sm:col-span-12 mt-2 sm:mt-1 sm:border-t sm:border-hairline sm:pt-3">
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                    {binaryAssets.map((asset) => (
                      <a
                        key={asset.name}
                        href={asset.browser_download_url}
                        target="_blank"
                        rel="noopener"
                        className="font-mono text-xs text-muted-foreground underline decoration-transparent underline-offset-4 transition-colors hover:text-foreground hover:decoration-brand"
                      >
                        {asset.name}
                        <span className="text-muted-foreground/60"> · {formatSize(asset.size)}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex">
        <Button variant="outline" asChild>
          <a href={allReleasesUrl} target="_blank" rel="noopener">
            <FaGithub />
            {t("viewAllReleases")}
          </a>
        </Button>
      </div>
    </>
  );
}

export default function ClientReleases() {
  const t = useTranslations("resources.parallaxClient.releases");
  const [open, setOpen] = useState(false);
  const [releases, setReleases] = useState<Release[] | null>(null);

  useEffect(() => {
    fetch(RELEASES_API, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? (r.json() as Promise<Release[]>) : null))
      .catch(() => null)
      .then((r) => setReleases(r ?? []));
  }, []);

  if (releases !== null && releases.length === 0) return null;

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="group plate-lift flex w-full cursor-pointer items-center gap-4 rounded-xl border border-stroke bg-card px-5 py-5 text-left sm:px-8"
      >
        <h3 className="text-2xl leading-tight text-foreground sm:text-3xl">{t("heading")}</h3>
        <span className={`ml-auto flex size-9 items-center justify-center rounded-full border transition-colors ${open ? "border-foreground bg-foreground text-background" : "border-stroke text-foreground group-hover:border-foreground/30"}`}>
          <ChevronDown className={`size-4 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`} strokeWidth={1.5} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="releases-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="mb-8 mt-10 max-w-2xl text-base text-muted-foreground sm:text-lg">
              {t("intro")}
            </p>
            {releases ? (
              <ReleaseTable releases={releases} allReleasesUrl={ALL_RELEASES} />
            ) : (
              <p className="py-8 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{t("loading")}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
