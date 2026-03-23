"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useScrollOrchestrator } from "@/context/ScrollOrchestratorContext"
import { getPhaseFromScroll } from "@/components/scene/SceneManager"

/**
 * QuickNav — minimal jump-navigation pill.
 *
 * Space phase  (scrollProgress < 0.30):  visible, jumps to footer (Contact).
 * Atmosphere   (0.30 – 0.70):            hidden — preserves mid-journey immersion.
 * Earth phase  (scrollProgress > 0.70):  visible, jumps back to hero (Top).
 */
export default function QuickNav() {
  const { scrollProgress, jumpToHero, jumpToFooter } = useScrollOrchestrator()
  const phase   = getPhaseFromScroll(scrollProgress)
  const shown   = phase !== "atmosphere"
  const isEarth = phase === "earth"

  return (
    <div
      className="fixed bottom-6 right-8 z-50"
      style={{ pointerEvents: "none" }}
    >
      <AnimatePresence>
        {shown && (
          <motion.button
            key={isEarth ? "qnav-earth" : "qnav-space"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={isEarth ? jumpToHero : jumpToFooter}
            aria-label={isEarth ? "Back to top" : "Jump to contact section"}
            style={{ pointerEvents: "auto" }}
            className={[
              "flex items-center gap-1.5 rounded-full px-3.5 py-1.5",
              "text-[0.68rem] font-semibold tracking-[0.2em] uppercase",
              "outline-none",
              "transition-colors duration-200",
              // Both phases use the same design-system palette (no more amber)
              "bg-[rgba(29,27,28,0.65)] border border-[rgba(74,66,73,0.28)]",
              "text-[rgba(208,194,213,0.6)]",
              "backdrop-blur-sm",
              "hover:bg-[rgba(43,40,41,0.75)] hover:text-[#d0c2d5] hover:border-[rgba(74,66,73,0.45)]",
              "focus-visible:ring-1 focus-visible:ring-[rgba(224,182,255,0.35)]",
            ].join(" ")}
          >
            <motion.span
              animate={{ y: isEarth ? [-1, 1, -1] : [1, -1, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
              className="text-[0.85rem] leading-none"
              style={{ color: "#e0b6ff" }}
            >
              {isEarth ? "↑" : "↓"}
            </motion.span>
            <span>{isEarth ? "Top" : "Contact"}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
