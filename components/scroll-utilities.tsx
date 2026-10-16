'use client'
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 brand-gradient z-[60] origin-left"
      style={{ scaleX }}
    />
  )
}

export function ScrollToTop() {
  const t = useTranslations("common")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          className="fixed bottom-6 right-6 z-50 size-11 flex items-center justify-center rounded-full border border-stroke bg-background/80 text-foreground backdrop-blur-md hover:bg-foreground/10 transition-colors cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          aria-label={t("scrollToTop")}
        >
          <ArrowUp className="size-4" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
