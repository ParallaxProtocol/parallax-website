'use client'
import { useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlatform, type Os } from "@/hooks/usePlatform";
import { useTranslations } from "next-intl";

const EXTRACT_CMDS: Record<Os, string | null> = {
  darwin: "tar -xzf parallax-darwin-*.tar.gz",
  linux: "tar -xzf parallax-linux-*.tar.gz",
  windows: null,
};

const RUN_CMDS: Record<Os, string | null> = {
  darwin: "./parallaxd",
  linux: "chmod +x parallaxd && ./parallaxd",
  windows: null,
};

const DATA_DIRS: Record<Os, string> = {
  darwin: "~/Library/Parallax",
  linux: "~/.parallax",
  windows: "%APPDATA%\\Parallax",
};

function CodeBlock({ children, copiedLabel, copyLabel }: { children: string; copiedLabel: string; copyLabel: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <div className="relative group">
      <pre className="bg-background border border-border rounded-lg p-3 pr-10 text-xs font-mono text-muted-foreground overflow-x-auto">
        <code>{children}</code>
      </pre>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? copiedLabel : copyLabel}
        className="absolute top-1.5 right-1.5 inline-flex items-center justify-center size-7 text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
      >
        {copied ? <Check className="size-3.5 text-brand" /> : <Copy className="size-3.5" />}
      </button>
    </div>
  );
}

export default function ClientQuickStart() {
  const t = useTranslations("resources.parallaxClient.quickStart");
  const { platform, ready } = usePlatform();
  const [open, setOpen] = useState(false);

  // Default to linux content during SSR / before detection resolves so the layout is stable.
  const os: Os = platform?.os ?? "linux";
  const detectedLabel = ready && platform ? platform.label : null;
  const extractCmd = EXTRACT_CMDS[os];
  const runCmd = RUN_CMDS[os];
  const dataDir = DATA_DIRS[os];

  const extractTitle =
    os === "darwin" ? t("darwin.extractTitle") :
      os === "linux" ? t("linux.extractTitle") :
        t("windows.extractTitle");

  const extractBody =
    os === "darwin" ? (
      <>
        {t("darwin.extractBodyPrefix")}
        <code className="font-mono text-foreground">.tar.gz</code>
        {t("darwin.extractBodySuffix")}
      </>
    ) : os === "linux" ? (
      <>{t("linux.extractBody")}</>
    ) : (
      <>
        {t("windows.extractBodyPrefix")}
        <code className="font-mono text-foreground">.zip</code>
        {t("windows.extractBodyMiddle")}
        <span className="text-foreground">{t("windows.extractBodySuffix")}</span>
      </>
    );

  const runBinary = os === "windows" ? "parallaxd.exe" : "parallaxd";
  const runTitlePrefix =
    os === "darwin" ? t("darwin.runTitlePrefix") :
      os === "linux" ? t("linux.runTitlePrefix") :
        t("windows.runTitlePrefix");
  const runTitle = (
    <>
      {runTitlePrefix}
      <code className="font-mono">{runBinary}</code>
    </>
  );

  const runBody =
    os === "darwin" ? (
      <>
        {t.rich("darwin.runBody", {
          code: () => <code className="font-mono text-foreground">prlx</code>,
        })}
      </>
    ) : os === "linux" ? (
      <>{t("linux.runBody")}</>
    ) : (
      <>
        {t.rich("windows.runBody", {
          code: () => <code className="font-mono text-foreground">prlx.exe</code>,
          moreInfo: () => <span className="text-foreground">{t("windows.moreInfo")}</span>,
        })}
      </>
    );

  return (
    <div className="mt-16">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center gap-3 cursor-pointer group"
      >
        <h3 className="text-sm font-medium font-mono uppercase tracking-[0.15em] text-foreground group-hover:text-brand transition-colors">{t("heading")}</h3>
        <div className="flex-1 h-px bg-border" />
        {detectedLabel && (
          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
            {t("detected")} · <span className="text-brand">{detectedLabel}</span>
          </span>
        )}
        <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="quick-start-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-muted-foreground mb-10 mt-8 max-w-2xl">
              {t("intro")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-border">
              <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-border">
                <div className="text-xs font-mono text-brand mb-3">{t("step1Label")}</div>
                <h4 className="text-base text-foreground mb-3">{extractTitle}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{extractBody}</p>
                {extractCmd && <CodeBlock copiedLabel={t("copied")} copyLabel={t("copyCommand")}>{extractCmd}</CodeBlock>}
              </div>

              <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-r border-border">
                <div className="text-xs font-mono text-brand mb-3">{t("step2Label")}</div>
                <h4 className="text-base text-foreground mb-3">{runTitle}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{runBody}</p>
                {runCmd && <CodeBlock copiedLabel={t("copied")} copyLabel={t("copyCommand")}>{runCmd}</CodeBlock>}
              </div>

              <div className="p-6 sm:p-8">
                <div className="text-xs font-mono text-brand mb-3">{t("step3Label")}</div>
                <h4 className="text-base text-foreground mb-3">{t("step3Title")}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {t("step3Body")}
                </p>
                <div className="bg-background border border-border rounded-lg p-3 text-xs font-mono text-foreground break-all">
                  {dataDir}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  {t("step3Note")}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                {t.rich("portsHint", {
                  code: (chunks) => <code className="font-mono text-foreground">{chunks}</code>,
                })}
              </p>
              <a
                href="https://docs.parallaxprotocol.org/guides/client/setup"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
              >
                {t("fullSetupGuide")}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
