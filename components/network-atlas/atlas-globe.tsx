'use client'
import dynamic from "next/dynamic"
import { useState } from "react"
import { useTranslations } from "next-intl"
import type { GlobeNode, NodeGlobeApi } from "@/components/node-globe"
import { Button } from "@/components/ui/button"

const NodeGlobe = dynamic(() => import("@/components/node-globe"), { ssr: false })

const ZOOM_STEP = 1.4

type Props = {
  nodes: GlobeNode[]
}

export default function AtlasGlobe({ nodes }: Props) {
  const t = useTranslations("resources.networkAtlas.map")
  const [api, setApi] = useState<NodeGlobeApi | null>(null)

  return (
    <div
      className="relative w-full aspect-square sm:aspect-[16/10]"
      role="img"
      aria-label={t("ariaLabel")}
    >
      {/*
        The canvas bleeds to the full viewport width and 40% past the layout
        box vertically, so a zoomed-in globe spills across the page instead of
        clipping at an invisible rectangle (the body hides x-overflow). The
        camera starts farther out to compensate, so the resting sphere still
        visually fills the layout box.
      */}
      <div className="absolute top-[-40%] bottom-[-40%] left-1/2 w-screen -translate-x-1/2">
        <NodeGlobe
          interactive
          followTheme
          nodes={nodes}
          altitude={{ desktop: 3.2, mobile: 3.6 }}
          labels={{
            nodeSingular: t("nodeSingular"),
            nodePlural: t("nodePlural"),
            unknownLocation: t("unknownLocation"),
          }}
          onApi={setApi}
        />
      </div>
      {api && (
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => api.zoomBy(1 / ZOOM_STEP)}
            className="bg-background/60 text-lg backdrop-blur"
            aria-label={t("zoomIn")}
          >
            +
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => api.zoomBy(ZOOM_STEP)}
            className="bg-background/60 text-lg backdrop-blur"
            aria-label={t("zoomOut")}
          >
            &minus;
          </Button>
        </div>
      )}
    </div>
  )
}
