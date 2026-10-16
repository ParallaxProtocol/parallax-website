"use client";

import { Button } from "@/components/ui/button";
import { addParallaxNetwork, checkParallaxAdded, STORAGE_KEY } from "@/lib/parallax-network";
import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function AddNetworkPopup() {
  const t = useTranslations("popup");
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "adding" | "success" | "error">("idle");

  useEffect(() => {
    if (!window.ethereum) return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    checkParallaxAdded().then((added) => {
      if (!added) setVisible(true);
    });
  }, []);

  async function handleAdd() {
    setStatus("adding");
    try {
      await addParallaxNetwork();
      setStatus("success");
      localStorage.setItem(STORAGE_KEY, "true");
      setTimeout(() => setVisible(false), 2000);
    } catch {
      setStatus("error");
    }
  }

  function dismiss() {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "dismissed");
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 overflow-hidden rounded-2xl border border-stroke bg-popover shadow-overlay animate-in slide-in-from-bottom-4 fade-in duration-300 motion-reduce:animate-none">
      <div aria-hidden className="aurora" />
      <div className="relative flex items-center justify-between border-b border-hairline py-2 pr-2 pl-5">
        <span aria-hidden className="flex items-center gap-3">
          <span className="size-1.5 rounded-full bg-brand" />
          <span className="font-mono text-xs tracking-[0.2em] text-muted-foreground/50">||||||||</span>
        </span>
        <button
          onClick={dismiss}
          className="flex size-8 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
          aria-label={t("dismiss")}
        >
          <X className="size-4" strokeWidth={1.5} />
        </button>
      </div>
      <div className="relative p-5">
        <h3 className="mb-2 text-xl leading-tight text-foreground">
          {t("title")}
        </h3>
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{t("description")}</p>
        <div className="flex flex-col items-center gap-3">
          <Button
            variant="brand"
            className="w-full"
            onClick={handleAdd}
            disabled={status === "adding"}
          >
            <Plus strokeWidth={2} />
            {status === "adding"
              ? t("adding")
              : status === "success"
                ? t("added")
                : t("add")}
          </Button>
          {status === "error" && (
            <p className="text-sm text-destructive">{t("error")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
