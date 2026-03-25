"use client"

import { motion } from "framer-motion"
import { useScrollOrchestrator } from "@/context/ScrollOrchestratorContext"
import { EASE_DECK } from "@/lib/motion"
import { jumpNavPillClassName } from "./jumpNavStyles"

/**
 * QuickNav — Contact only (bottom-right). Intro lives on the deck (CardGrid top-left).
 */
export default function QuickNav() {
  const { jumpToFooter, contactModalOpen } = useScrollOrchestrator()

  if (contactModalOpen) return null

  return (
    <div
      className="fixed bottom-6 right-8 z-50 flex flex-col items-end gap-2"
      style={{ pointerEvents: "none" }}
    >
      <motion.button
        key="qnav-contact"
        type="button"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: EASE_DECK }}
        onClick={jumpToFooter}
        aria-label="Open contact form"
        style={{ pointerEvents: "auto" }}
        className={jumpNavPillClassName}
      >
        <motion.span
          animate={{ y: [1, -1, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
          className="text-[0.85rem] leading-none"
          style={{ color: "#e0b6ff" }}
        >
          ↓
        </motion.span>
        <span>Contact</span>
      </motion.button>
    </div>
  )
}
