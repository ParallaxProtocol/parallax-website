'use client'
import { useState } from "react";
import { ArrowRight, Check, ChevronDown, Copy, TerminalSquare } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlatform, type Os } from "@/hooks/usePlatform";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

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

/* Terminal panel: always dark, whatever the theme — a hairline header with
   the copy control, then the command behind a prompt glyph. The outline
   stays outside .on-dark-surface so it matches the panels around it. */
export function TerminalPlate({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-stroke bg-[#0a0a0b]">
      <div className="on-dark-surface flex h-10 items-center justify-between border-b border-hairline pr-1.5 pl-4">
        <span aria-hidden className="flex items-center gap-3">
          <TerminalSquare className="size-3.5 text-muted-foreground" strokeWidth={1.5} />
          <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground/50">||||||||</span>
        </span>
        {action}
      </div>
      <div className="on-dark-surface">{children}</div>
    </div>
  );
}

export function CodeBlock({ children, copiedLabel, copyLabel }: { children: string; copiedLabel: string; copyLabel: string }) {
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
    <TerminalPlate
      action={
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? copiedLabel : copyLabel}
          className="inline-flex size-7 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          {copied ? <Check className="size-3.5 text-brand" /> : <Copy className="size-3.5" />}
        </button>
      }
    >
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-relaxed text-foreground/90">
        <code><span aria-hidden className="select-none text-brand">$ </span>{children}</code>
      </pre>
    </TerminalPlate>
  );
}

export default function ClientQuickStart({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const t = useTranslations("resources.parallaxClient.quickStart");
  const { platform, ready } = usePlatform();
  const [open, setOpen] = useState(defaultOpen);

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
          code: () => <code className="font-mono text-foreground">parallaxd</code>,
        })}
      </>
    ) : os === "linux" ? (
      <>{t("linux.runBody")}</>
    ) : (
      <>
        {t.rich("windows.runBody", {
          code: () => <code className="font-mono text-foreground">parallaxd.exe</code>,
          moreInfo: () => <span className="text-foreground">{t("windows.moreInfo")}</span>,
        })}
      </>
    );

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="group plate-lift flex w-full cursor-pointer flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-stroke bg-card px-5 py-5 text-left sm:px-8"
      >
        <h3 className="text-2xl leading-tight text-foreground sm:text-3xl">{t("heading")}</h3>
        {detectedLabel && (
          <Badge variant="outline" className="text-muted-foreground">
            {t("detected")} · <span className="text-brand">{detectedLabel}</span>
          </Badge>
        )}
        <span className={`ml-auto flex size-9 items-center justify-center rounded-full border transition-colors ${open ? "border-foreground bg-foreground text-background" : "border-stroke text-foreground group-hover:border-foreground/30"}`}>
          <ChevronDown className={`size-4 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`} strokeWidth={1.5} />
        </span>
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
            <div>
              <p className="mb-10 mt-10 max-w-2xl text-base text-muted-foreground sm:text-lg">
                {t("intro")}
              </p>

              <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-stroke bg-hairline md:grid-cols-3">
                <div className="flex flex-col bg-background p-6 sm:p-8">
                  <p className="tag mb-6"><span className="text-brand">{t("step1Label")}</span></p>
                  <h4 className="mb-3 text-xl leading-tight text-foreground">{extractTitle}</h4>
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{extractBody}</p>
                  {extractCmd && <div className="mt-auto"><CodeBlock copiedLabel={t("copied")} copyLabel={t("copyCommand")}>{extractCmd}</CodeBlock></div>}
                </div>

                <div className="flex flex-col bg-background p-6 sm:p-8">
                  <p className="tag mb-6"><span className="text-brand">{t("step2Label")}</span></p>
                  <h4 className="mb-3 text-xl leading-tight text-foreground">{runTitle}</h4>
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{runBody}</p>
                  {runCmd && <div className="mt-auto"><CodeBlock copiedLabel={t("copied")} copyLabel={t("copyCommand")}>{runCmd}</CodeBlock></div>}
                </div>

                <div className="flex flex-col bg-background p-6 sm:p-8">
                  <p className="tag mb-6"><span className="text-brand">{t("step3Label")}</span></p>
                  <h4 className="mb-3 text-xl leading-tight text-foreground">{t("step3Title")}</h4>
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                    {t("step3Body")}
                  </p>
                  <div className="mt-auto">
                    <TerminalPlate>
                      <p className="px-4 py-3.5 font-mono text-[13px] leading-relaxed text-foreground/90 break-all">
                        {dataDir}
                      </p>
                    </TerminalPlate>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {t("step3Note")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {t.rich("portsHint", {
                    code: (chunks) => <code className="rounded-md border border-hairline bg-foreground/[0.04] px-1.5 py-0.5 font-mono text-[13px] text-foreground">{chunks}</code>,
                  })}
                </p>
                <a
                  href="https://docs.parallaxprotocol.org/guides/client/setup"
                  target="_blank"
                  rel="noopener"
                  className="group inline-flex shrink-0 items-center gap-2 text-[15px] font-medium text-foreground"
                >
                  {t("fullSetupGuide")}
                  <ArrowRight className="size-4 text-brand transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
