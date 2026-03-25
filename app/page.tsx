"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import SceneManager from "@/components/scene/SceneManager"
import { useScrollOrchestrator } from "@/context/ScrollOrchestratorContext"
import ContactFooter from "@/components/contact-footer"

// ─── Integration wiring slots (uncomment as each issue lands) ─────────────────
import HeroSection from "@/components/hero/HeroSection"
import CardGrid from "@/components/grid/CardGrid"
import QuickNav from "@/components/nav/QuickNav"
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tracks mouse position normalized to [-1, 1].
 * Updates React state via rAF so SceneManager receives fresh props at ~60fps
 * even when the page isn't scrolling — necessary for hero parallax.
 */
function useMouseNorm() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const rawRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    function onMove(e: MouseEvent) {
      rawRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      }
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          setMouse({ ...rawRef.current })
          rafRef.current = null
        })
      }
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMove)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return mouse
}

function HomeContent() {
  const { sceneScrollProgress, registerReturnToHero, setContactModalOpen } =
    useScrollOrchestrator()
  const mousePosition = useMouseNorm()

  /**
   * deckVisible: false  → hero is mounted, deck is hidden, scroll is locked
   * deckVisible: true   → hero has exited the DOM, deck is visible, scroll enabled
   *
   * scenePhase: "hero"  → constellation / exosphere camera
   * scenePhase: "deck"  → fired at hero-exit t=0, drives the atmosphere dive while
   *                        the card is still animating out (820 ms window)
   */
  const [deckVisible, setDeckVisible] = useState(false)
  const [scenePhase, setScenePhase] = useState<"hero" | "deck">("hero")
  const [dealSeed, setDealSeed] = useState(0)

  // Scroll to top when deck becomes visible so scrollProgress starts at 0
  useEffect(() => {
    if (deckVisible) {
      window.scrollTo({ top: 0, behavior: "instant" })
    }
  }, [deckVisible])

  // `jumpToHero` / wheel-up-at-top remount the intro hero (not only scroll to y=0)
  useEffect(() => {
    registerReturnToHero(() => {
      setDeckVisible(false)
      setScenePhase("hero")
      window.scrollTo({ top: 0, behavior: "instant" })
    })
    return () => registerReturnToHero(null)
  }, [registerReturnToHero])

  useEffect(() => {
    function syncFromHash() {
      if (typeof window === "undefined") return
      if (window.location.hash === "#contact") setContactModalOpen(true)
    }
    syncFromHash()
    window.addEventListener("hashchange", syncFromHash)
    return () => window.removeEventListener("hashchange", syncFromHash)
  }, [setContactModalOpen])

  return (
    <div className="flex flex-col min-h-screen text-white" style={{ background: "#151314" }}>

      {/* ── SceneManager — always mounted; scenePhase drives the exosphere→atmosphere dive ── */}
      <SceneManager
        scrollProgress={sceneScrollProgress}
        mousePosition={mousePosition}
        scenePhase={scenePhase}
      />

      {/* ── Hero — exits DOM after "Start" click (ISSUE-005) ── */}
      <AnimatePresence mode="wait">
        {!deckVisible && (
          <HeroSection
            key="hero"
            onExitStart={() => setScenePhase("deck")}
            onStart={() => {
              setDealSeed(Date.now())
              setDeckVisible(true)
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Main scroll content — hidden until hero exits ── */}
      <AnimatePresence>
        {deckVisible && (
          <motion.div
            key="deck-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col"
            style={{ minHeight: "100vh" }}
          >
            {/* Card grid + contact in one section so layout reads as one column */}
            <section
              id="deck"
              className="relative w-full flex flex-col"
              style={{ zIndex: 10 }}
            >
              <CardGrid dealSeed={dealSeed} />
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Contact — modal only (not in scroll flow) ── */}
      <ContactFooter />

      {/* ── QuickNav — Hero + Contact while deck is visible ── */}
      {deckVisible && <QuickNav />}
    </div>
  )
}

export default function Home() {
  return <HomeContent />
}
