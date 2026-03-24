"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

// ─── Design Tokens ────────────────────────────────────────────────────────────

const T = {
  surface:            "#151314",
  surfaceLow:         "#1d1b1c",
  primary:            "#e0b6ff",
  primaryContainer:   "#9d4edd",
  onSurface:          "#f4edf8",
  onSurfaceVariant:   "#d0c2d5",
  outlineVariant:     "74,66,73",
} as const

// ─── Constants ────────────────────────────────────────────────────────────────

const NAME      = "Herman Hundsberger"
const SUB_LABEL = "UCSD '27"

// ─── Cloud Bank — frosted barrier the card "falls into" on exit ───────────────

function CloudBank({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cloud-bank"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 right-0 pointer-events-none"
          style={{
            height:              "62vh",
            zIndex:              30,
            // ~40% translucent cloud layer — card rises through and is obscured
            background:          `linear-gradient(
              to bottom,
              rgba(21,19,20,0.88)    0%,
              rgba(21,19,20,0.62)    28%,
              rgba(21,19,20,0.40)    54%,
              rgba(21,19,20,0.18)    76%,
              transparent            100%
            )`,
          }}
          aria-hidden="true"
        >
          {/* Nebula fringe at cloud bank base */}
          <div
            style={{
              position:   "absolute",
              bottom:     0,
              left:       "8%",
              right:      "8%",
              height:     "2px",
              background: `linear-gradient(
                to right,
                transparent,
                rgba(157,78,221,0.32) 28%,
                rgba(224,182,255,0.55) 50%,
                rgba(157,78,221,0.32) 72%,
                transparent
              )`,
              filter: "blur(3px)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Portrait ring — conic gradient with purple glow ─────────────────────────

function PortraitRing() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.72 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "relative", width: 118, height: 118 }}
    >
      {/* Outer glow */}
      <div
        style={{
          position:     "absolute",
          inset:        -8,
          borderRadius: "50%",
          background:   `radial-gradient(circle, rgba(157,78,221,0.22) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
      {/* Spinning conic ring */}
      <div
        style={{
          position:     "absolute",
          inset:        0,
          borderRadius: "50%",
          padding:      "2px",
          background:   `conic-gradient(
            from 0deg,
            rgba(224,182,255,0.15),
            rgba(224,182,255,0.85) 35%,
            rgba(157,78,221,1)     55%,
            rgba(224,182,255,0.85) 75%,
            rgba(224,182,255,0.15) 100%
          )`,
          animation: "hero-ring-spin 9s linear infinite",
        }}
        aria-hidden="true"
      />
      {/* Photo */}
      <div
        style={{
          position:     "absolute",
          inset:        3,
          borderRadius: "50%",
          overflow:     "hidden",
        }}
      >
        <Image
          src="/assets/pfp.jpg"
          alt="Herman Hundsberger"
          fill
          sizes="112px"
          className="object-cover rounded-full"
          priority
        />
      </div>
    </motion.div>
  )
}

// ─── Animated name — letters stagger up, words never break mid-word ──────────
//
// Words are wrapped in `white-space: nowrap` spans so the browser can only
// break lines at the space between words — not mid-word across character spans.

function AnimatedName({ name }: { name: string }) {
  const words = name.split(" ")
  let globalIdx = 0

  return (
    <span
      aria-label={name}
      style={{
        display:        "inline-flex",
        flexWrap:       "wrap",
        justifyContent: "center",
        columnGap:      "0.28em",
      }}
    >
      {words.map((word, wi) => (
        <span key={wi} style={{ whiteSpace: "nowrap", display: "inline-block" }}>
          {word.split("").map((char) => {
            const i = globalIdx++
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay:    0.38 + i * 0.024,
                  duration: 0.52,
                  ease:     [0.22, 1, 0.36, 1],
                }}
                style={{ display: "inline-block" }}
              >
                {char}
              </motion.span>
            )
          })}
        </span>
      ))}
    </span>
  )
}

// ─── Animated chevron CTA ─────────────────────────────────────────────────────

function ChevronDown() {
  return (
    <motion.svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ y: [0, 5, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <path
        d="M5 9L12 16L19 9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  )
}

// ─── Main HeroSection ─────────────────────────────────────────────────────────

interface HeroSectionProps {
  onStart: () => void
  /** Fired at t=0 of the exit sequence — lets SceneManager start the dive immediately. */
  onExitStart?: () => void
}

export default function HeroSection({ onStart, onExitStart }: HeroSectionProps) {
  const [exiting, setExiting] = useState(false)
  const buttonRef    = useRef<HTMLButtonElement>(null)
  const tiltWrapRef  = useRef<HTMLDivElement>(null)
  const cardRef      = useRef<HTMLDivElement>(null)
  const glintRef     = useRef<HTMLDivElement>(null)

  // Lock body scroll while hero is covering the viewport
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [])

  // 3D card tilt + specular glint — all DOM writes, zero React re-renders
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!tiltWrapRef.current) return

      const mx = (e.clientX / window.innerWidth)  * 2 - 1   // [-1, 1]
      const my = -((e.clientY / window.innerHeight) * 2 - 1) // [-1, 1]

      // Perspective tilt — ±11° gives a strong "engineered" 3-D feel
      tiltWrapRef.current.style.transform =
        `perspective(720px) rotateX(${-my * 11}deg) rotateY(${mx * 11}deg)`

      // Specular glint — radial highlight tracks cursor over the card surface,
      // simulating a PointLight reflection on the border as it tilts
      if (glintRef.current && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        const px = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width)  * 100))
        const py = Math.min(100, Math.max(0, ((e.clientY - rect.top)  / rect.height) * 100))
        glintRef.current.style.background = `radial-gradient(
          circle 160px at ${px}% ${py}%,
          rgba(224,182,255,0.22) 0%,
          rgba(157,78,221,0.10)  30%,
          transparent            62%
        )`
      }
    }

    function onMouseLeave() {
      if (glintRef.current) glintRef.current.style.background = "transparent"
    }

    window.addEventListener("mousemove",  onMouseMove,  { passive: true })
    window.addEventListener("mouseleave", onMouseLeave, { passive: true })
    return () => {
      window.removeEventListener("mousemove",  onMouseMove)
      window.removeEventListener("mouseleave", onMouseLeave)
    }
  }, [])

  const handleStart = useCallback(() => {
    if (exiting) return
    setExiting(true)
    // Fire dive and unmount in the same React 18 batch — card is gone instantly,
    // leaving the Three.js background lerp as the sole transition visual.
    onExitStart?.()
    onStart()
  }, [exiting, onStart, onExitStart])

  // Wheel scroll fires the transition
  useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (e.deltaY > 20) handleStart()
    }
    window.addEventListener("wheel", onWheel, { passive: true })
    return () => window.removeEventListener("wheel", onWheel)
  }, [handleStart])

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleStart()
    }
  }

  return (
    <>
      <AnimatePresence>
        {!exiting && (
          <motion.section
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity:    0,
              transition: { duration: 0.38, delay: 0.44, ease: "easeIn" },
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 20 }}
            aria-label="Portfolio hero — Herman Hundsberger"
          >

            {/* Nebula glow — soft purple haze anchors the card to the space scene */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(
                  ellipse 52% 44% at 50% 46%,
                  rgba(157,78,221,0.11) 0%,
                  rgba(157,78,221,0.04) 50%,
                  transparent 72%
                )`,
              }}
              aria-hidden="true"
            />

            {/* Vignette — color matched to R3F space (#010714) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(
                  ellipse 78% 68% at 50% 50%,
                  transparent 22%,
                  rgba(1,7,20,0.72) 100%
                )`,
              }}
              aria-hidden="true"
            />

            {/* ── 3-D Tilt Wrapper — plain div, bypasses Framer transforms ── */}
            <div
              ref={tiltWrapRef}
              style={{
                transition:    "transform 0.16s ease-out",
                willChange:    "transform",
                transformStyle: "preserve-3d",
                position:      "relative",
                zIndex:        10,
              }}
            >

              {/* ── Identity Card ── */}
              {/* Entrance: fades + rises.  Exit: shrinks and drops into cloud bank. */}
              <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 44, scale: 0.94 }}
                animate={
                  exiting
                    ? {
                        y:       -192,
                        opacity: 0,
                        scale:   0.84,
                        transition: {
                          duration: 0.72,
                          y:       { ease: [0.48, 0, 1, 1], duration: 0.72 },
                          scale:   { ease: [0.4, 0, 1, 1],  duration: 0.40 },
                          opacity: { ease: "easeIn",         duration: 0.38, delay: 0.22 },
                        },
                      }
                    : { opacity: 1, y: 0, scale: 1 }
                }
                transition={{ delay: 0.1, duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position:       "relative",
                  display:        "flex",
                  flexDirection:  "column",
                  alignItems:     "center",
                  textAlign:      "center",
                  maxWidth:       "600px",
                  width:          "min(600px, 92vw)",
                  padding:        "clamp(1.75rem, 4.5vw, 2.5rem) clamp(1.5rem, 4.5vw, 3rem)",
                  gap:            "1.25rem",
                  background:     "rgba(8,7,9,0.80)",
                  backdropFilter: "blur(22px)",
                  WebkitBackdropFilter: "blur(22px)",
                  borderRadius:   "1.5rem",
                  border:         `1px solid rgba(${T.outlineVariant},0.42)`,
                  boxShadow: [
                    "0 0 0 1px rgba(157,78,221,0.10)",
                    "0 2px 0 0 rgba(255,255,255,0.04) inset",
                    "0 28px 72px rgba(0,0,0,0.70)",
                    "0 0 48px rgba(157,78,221,0.06)",
                  ].join(", "),
                  overflow: "hidden",
                }}
              >

                {/* Specular glint overlay — cursor-tracking radial highlight on card surface */}
                <div
                  ref={glintRef}
                  aria-hidden="true"
                  style={{
                    position:      "absolute",
                    inset:         0,
                    borderRadius:  "1.5rem",
                    pointerEvents: "none",
                    zIndex:        2,
                    background:    "transparent",
                    mixBlendMode:  "screen",
                  }}
                />

                {/* Portrait */}
                <PortraitRing />

                {/* Name — Space Grotesk display */}
                <h1
                  style={{
                    fontSize:      "clamp(1.8rem, 4.2vw, 2.75rem)",
                    lineHeight:    1.06,
                    fontFamily:    "var(--font-space-grotesk), var(--font-geist-sans), sans-serif",
                    fontWeight:    700,
                    letterSpacing: "-0.025em",
                    color:         T.onSurface,
                    margin:        0,
                  }}
                >
                  <AnimatedName name={NAME} />
                </h1>

                {/* Sub-label — UCSD year + degree, intentionally quiet */}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1,  y: 0 }}
                  transition={{ delay: 0.95, duration: 0.42, ease: "easeOut" }}
                  style={{
                    fontSize:      "0.82rem",
                    fontFamily:    "var(--font-manrope), var(--font-geist-sans), sans-serif",
                    fontWeight:    400,
                    letterSpacing: "0.06em",
                    color:         `rgba(208,194,213,0.55)`,
                    marginTop:     "-0.35rem",
                  }}
                >
                  {SUB_LABEL}
                </motion.p>

                {/* Separator */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    width:           "100%",
                    height:          "1px",
                    background:      `linear-gradient(
                      to right,
                      transparent,
                      rgba(${T.outlineVariant},0.22) 30%,
                      rgba(${T.outlineVariant},0.22) 70%,
                      transparent
                    )`,
                    transformOrigin: "center",
                  }}
                  aria-hidden="true"
                />

                {/* Scroll CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1,  y: 0  }}
                  transition={{ delay: 1.3, duration: 0.5, ease: "easeOut" }}
                  style={{
                    display:       "flex",
                    flexDirection: "column",
                    alignItems:    "center",
                    gap:           "0.45rem",
                    marginTop:     "-0.15rem",
                  }}
                >
                  <p
                    style={{
                      fontSize:      "0.7rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color:         `rgba(208,194,213,0.65)`,
                      fontFamily:    "var(--font-manrope), var(--font-geist-sans), sans-serif",
                      fontWeight:    500,
                    }}
                  >
                    scroll to explore
                  </p>
                  <button
                    ref={buttonRef}
                    onClick={handleStart}
                    onKeyDown={handleKey}
                    aria-label="Start — enter the portfolio"
                    tabIndex={0}
                    style={{
                      background:   "transparent",
                      border:       "none",
                      padding:      "0.55rem",
                      cursor:       "pointer",
                      color:        T.primary,
                      borderRadius: "50%",
                      opacity:      0.5,
                      transition:   "opacity 0.18s ease, transform 0.18s ease",
                      outline:      "none",
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLButtonElement
                      el.style.opacity   = "1"
                      el.style.transform = "scale(1.2)"
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLButtonElement
                      el.style.opacity   = "0.5"
                      el.style.transform = "scale(1)"
                    }}
                  >
                    <ChevronDown />
                  </button>
                </motion.div>

              </motion.div>
            </div>

          </motion.section>
        )}
      </AnimatePresence>
    </>
  )
}
