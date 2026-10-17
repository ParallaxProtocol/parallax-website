"use client";

import { Button } from "@/components/ui/button";
import { addParallaxNetwork, checkParallaxAdded, STORAGE_KEY } from "@/lib/parallax-network";
import { Check, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useSyncExternalStore } from "react";

const subscribeNever = () => () => {};

export default function AddNetworkSection() {
  const t = useTranslations("addNetworkSection");
  // No wallet on the server, so the HTML matches a visitor without one.
  const hasWallet = useSyncExternalStore(subscribeNever, () => Boolean(window.ethereum), () => false);
  const [state, setState] = useState<"loading" | "not-added" | "added">("loading");
  const [status, setStatus] = useState<"idle" | "adding" | "success" | "error">("idle");

  useEffect(() => {
    if (!hasWallet) return;
    checkParallaxAdded().then((added) => {
      setState(added ? "added" : "not-added");
    });
  }, [hasWallet]);

  async function handleAdd() {
    setStatus("adding");
    try {
      await addParallaxNetwork();
      setStatus("success");
      localStorage.setItem(STORAGE_KEY, "true");
      setState("added");
    } catch {
      setStatus("error");
    }
  }

  if (!hasWallet || state === "loading") return null;

  if (state === "added" && status !== "success") {
    return (
      <div className="mb-8 flex flex-col gap-5 rounded-xl border border-stroke bg-card p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand-muted">
          <Check className="size-5 text-brand" strokeWidth={1.5} />
        </span>
        <div>
          <h3 className="text-xl leading-tight text-foreground sm:text-2xl">
            {t("connectedTitle")}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t("connectedDescription")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-stroke bg-card">
      <div aria-hidden className="aurora aurora-left" />
      <div className="relative grid gap-8 p-8 sm:p-10 md:grid-cols-12 md:items-center">
        <div className="md:col-span-7">
          <h3 className="text-2xl leading-tight text-foreground sm:text-3xl">
            {t("title")}
          </h3>
          <p className="mt-3 max-w-xl text-base text-muted-foreground">
            {t("description")}
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 md:col-span-5 md:items-end">
          <Button
            variant="brand"
            size="lg"
            className="w-full sm:w-fit"
            onClick={handleAdd}
            disabled={status === "adding" || status === "success"}
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
