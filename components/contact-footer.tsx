"use client"

import { useState } from "react"
import Link from "next/link"
import { Github, Linkedin, LayoutGrid, Mail } from "lucide-react"
import { Modal, ModalBody, ModalContent } from "@nextui-org/react"
import { useScrollOrchestrator } from "@/context/ScrollOrchestratorContext"
import { jumpNavPillClassName } from "@/components/nav/jumpNavStyles"

// ── Design tokens ─────────────────────────────────────────────────────────────

const T = {
  surface:           "#151314",
  surfaceLow:        "#1d1b1c",
  surfaceHigh:       "#2b2829",
  primary:           "#e0b6ff",
  primaryContainer:  "#9d4edd",
  onSurface:         "#f4edf8",
  onSurfaceVariant:  "#d0c2d5",
  outlineVariant:    "74,66,73",
} as const

type FormStatus = "idle" | "loading" | "success" | "error"

export function ContactFooter() {
  const { contactModalOpen, setContactModalOpen, jumpToHero } =
    useScrollOrchestrator()
  const [status,   setStatus]   = useState<FormStatus>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  function stripContactHash() {
    if (
      typeof window !== "undefined" &&
      window.location.hash === "#contact"
    ) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      )
    }
  }

  function onModalOpenChange(open: boolean) {
    setContactModalOpen(open)
    if (!open) stripContactHash()
  }

  function returnToPortfolio() {
    setContactModalOpen(false)
    stripContactHash()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "loading") return
    setStatus("loading")
    setErrorMsg(null)

    try {
      const form     = e.currentTarget
      const formData = new FormData(form)
      const payload  = {
        name:    String(formData.get("name")    || "").trim(),
        email:   String(formData.get("email")   || "").trim(),
        message: String(formData.get("message") || "").trim(),
        company: String(formData.get("company") || "").trim(),
      }

      // Honeypot: silently succeed if bot fills hidden field
      if (payload.company) { setStatus("success"); form.reset(); return }

      if (payload.name.length < 2)
        throw new Error("Please enter your name.")
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))
        throw new Error("Please enter a valid email.")
      if (payload.message.length < 10)
        throw new Error("Message should be at least 10 characters.")

      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Failed to send message. Please try again.")
      }

      setStatus("success")
      form.reset()
    } catch (err: unknown) {
      setStatus("error")
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again later."
      )
    } finally {
      if (status !== "success") setTimeout(() => setStatus("idle"), 3000)
    }
  }

  return (
    <Modal
      isOpen={contactModalOpen}
      onOpenChange={onModalOpenChange}
      scrollBehavior="inside"
      size="4xl"
      placement="center"
      backdrop="blur"
      classNames={{
        backdrop: "bg-black/60",
        base: "border border-[rgba(74,66,73,0.35)] bg-[#151314] max-h-[min(84vh,680px)] my-4 w-[min(94vw,980px)]",
        body: "p-0 overflow-y-auto",
      }}
    >
      <ModalContent>
      {/* ── Contact Section ─────────────────────────────────────────────────── */}
      <ModalBody className="gap-0 p-0">
      <section
        id="contact"
        className="relative w-full overflow-hidden"
        style={{
          background: T.surface,
          padding:    "clamp(2.2rem, 4.6vw, 3.6rem) 0",
        }}
      >
        {/* Nebula glow — matches hero aesthetic */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: `radial-gradient(
              ellipse 70% 55% at 50% 0%,
              rgba(157,78,221,0.055) 0%,
              transparent 65%
            )`,
          }}
        />

        {/* Constellation-line separator at top edge */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          aria-hidden="true"
          style={{
            background: `linear-gradient(
              to right,
              transparent,
              rgba(${T.outlineVariant},0.3) 20%,
              rgba(157,78,221,0.25) 50%,
              rgba(${T.outlineVariant},0.3) 80%,
              transparent
            )`,
          }}
        />

        <div
          className="relative z-10 mx-auto"
          style={{
            maxWidth: "1100px",
            padding:  "0 clamp(1.2rem, 3.8vw, 3.8rem)",
          }}
        >
          {/* Intro / Portfolio — these must appear above the content */}
          <div
            className="flex w-full flex-wrap items-center justify-center gap-2"
            style={{ paddingTop: "0.25rem", transform: "translateY(-15px)" }}
          >
            <button
              type="button"
              onClick={() => jumpToHero()}
              aria-label="Return to intro hero"
              className={jumpNavPillClassName}
            >
              <span aria-hidden="true" className="text-[0.85rem] leading-none" style={{ color: T.primary }}>
                ↑
              </span>
              <span>Intro</span>
            </button>
            <button
              type="button"
              onClick={returnToPortfolio}
              aria-label="Return to portfolio and close contact"
              className={jumpNavPillClassName}
            >
              <LayoutGrid aria-hidden="true" style={{ width: "0.85rem", height: "0.85rem", color: T.primary }} />
              <span>Portfolio</span>
            </button>
          </div>

          <div
            style={{
              display:       "flex",
              flexDirection: "row",
              alignItems:    "flex-start",
              gap:           "clamp(1.6rem, 3.9vw, 4.2rem)",
              flexWrap:      "wrap",
            }}
          >
            {/* ── Left: heading + contact info ── */}
            <div
              style={{
                flex:          "0 0 auto",
                width:         "min(38%, 320px)",
                minWidth:      "240px",
                display:       "flex",
                flexDirection: "column",
                gap:           "1.6rem",
              }}
            >
              <div>
                <p
                  style={{
                    color:         T.primary,
                    fontSize:      "0.62rem",
                    letterSpacing: "0.26em",
                    textTransform: "uppercase",
                    marginBottom:  "0.875rem",
                    fontFamily:    "var(--font-manrope), var(--font-geist-sans), sans-serif",
                    fontWeight:    600,
                  }}
                >
                  Let&rsquo;s connect
                </p>
                <h2
                  style={{
                    color:         T.onSurface,
                    fontSize:      "clamp(1.9rem, 4vw, 3rem)",
                    fontFamily:    "var(--font-space-grotesk), var(--font-geist-sans), sans-serif",
                    fontWeight:    700,
                    letterSpacing: "-0.02em",
                    lineHeight:    1.1,
                  }}
                >
                  Get in Touch
                </h2>
              </div>

              <p
                style={{
                  color:      T.onSurfaceVariant,
                  fontSize:   "0.95rem",
                  lineHeight: 1.7,
                  fontFamily: "var(--font-manrope), var(--font-geist-sans), sans-serif",
                }}
              >
                Feel free to reach out about anything! :)
              </p>

              {/* Email row */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div
                  style={{
                    height:     "2.5rem",
                    width:      "2.5rem",
                    borderRadius: "50%",
                    display:    "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    background: `rgba(157,78,221,0.1)`,
                    border:     `1px solid rgba(${T.outlineVariant},0.2)`,
                  }}
                >
                  <Mail style={{ width: "1rem", height: "1rem", color: T.primary }} />
                </div>
                <div>
                  <p
                    style={{
                      fontSize:  "0.7rem",
                      color:     `rgba(${T.outlineVariant},1)`,
                      fontFamily: "var(--font-manrope), sans-serif",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Direct
                  </p>
                  <a
                    href="mailto:hh727w@gmail.com"
                    style={{
                      color:      T.onSurfaceVariant,
                      fontSize:   "0.875rem",
                      transition: "color 0.2s ease",
                      textDecoration: "none",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = T.primary)}
                    onMouseLeave={e => (e.currentTarget.style.color = T.onSurfaceVariant)}
                  >
                    hh727w@gmail.com
                  </a>
                </div>
              </div>

              {/* Social links */}
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <Link
                  href="https://github.com/Hermano727"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  style={{
                    color:      T.onSurfaceVariant,
                    opacity:    0.95,
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = T.onSurfaceVariant)}
                  onMouseLeave={e => (e.currentTarget.style.color = T.onSurfaceVariant)}
                >
                  <Github
                    style={{ height: "2.05rem", width: "2.05rem" }}
                    strokeWidth={1.8}
                  />
                </Link>
                <Link
                  href="http://linkedin.com/in/herman-hundsberger-577600295"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  style={{
                    color:      T.onSurfaceVariant,
                    opacity:    0.95,
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = T.onSurfaceVariant)}
                  onMouseLeave={e => (e.currentTarget.style.color = T.onSurfaceVariant)}
                >
                  <Linkedin
                    style={{ height: "2.05rem", width: "2.05rem" }}
                    strokeWidth={1.8}
                  />
                </Link>
              </div>
            </div>

            {/* ── Right: contact form ── */}
            <div style={{ flex: "1 1 300px" }}>
              <div
                style={{
                  borderRadius:        "1.25rem",
                  padding:             "clamp(1.5rem, 3vw, 2.25rem)",
                  background:          "rgba(29,27,28,0.55)",
                  border:              `1px solid rgba(${T.outlineVariant},0.15)`,
                  backdropFilter:      "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <form
                  style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* Honeypot */}
                  <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ display: "none" }}
                    aria-hidden="true"
                  />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                      <label
                        htmlFor="cf-name"
                        style={{
                          color:         T.onSurfaceVariant,
                          fontSize:      "0.7rem",
                          fontWeight:    500,
                          letterSpacing: "0.06em",
                          fontFamily:    "var(--font-manrope), sans-serif",
                        }}
                      >
                        Name
                      </label>
                      <input
                        id="cf-name"
                        name="name"
                        type="text"
                        required
                        minLength={2}
                        placeholder="Your name"
                        className="cf-input"
                      />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                      <label
                        htmlFor="cf-email"
                        style={{
                          color:         T.onSurfaceVariant,
                          fontSize:      "0.7rem",
                          fontWeight:    500,
                          letterSpacing: "0.06em",
                          fontFamily:    "var(--font-manrope), sans-serif",
                        }}
                      >
                        Email
                      </label>
                      <input
                        id="cf-email"
                        name="email"
                        type="email"
                        required
                        placeholder="Your email"
                        className="cf-input"
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                    <label
                      htmlFor="cf-message"
                      style={{
                        color:         T.onSurfaceVariant,
                        fontSize:      "0.7rem",
                        fontWeight:    500,
                        letterSpacing: "0.06em",
                        fontFamily:    "var(--font-manrope), sans-serif",
                      }}
                    >
                      Message
                    </label>
                    <textarea
                      id="cf-message"
                      name="message"
                      rows={5}
                      required
                      minLength={10}
                      placeholder="Your message"
                      className="cf-input"
                      style={{ resize: "none" }}
                    />
                  </div>

                  {/* Status feedback */}
                  <div role="status" aria-live="polite" style={{ fontSize: "0.85rem", minHeight: "1.25rem" }}>
                    {status === "success" && (
                      <p style={{ color: "#a8edbb" }}>Thanks — your message is on its way.</p>
                    )}
                    {status === "error" && (
                      <p style={{ color: "#f4a4b0" }}>
                        {errorMsg ?? "Something went wrong. Please try again."}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    aria-busy={status === "loading"}
                    style={{
                      width:         "100%",
                      padding:       "0.75rem 1.5rem",
                      borderRadius:  "0.5rem",
                      fontSize:      "0.8rem",
                      fontWeight:    600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase" as const,
                      fontFamily:    "var(--font-manrope), var(--font-geist-sans), sans-serif",
                      background:    status === "loading"
                        ? "rgba(157,78,221,0.35)"
                        : "rgba(157,78,221,0.72)",
                      color:         T.onSurface,
                      border:        "none",
                      cursor:        status === "loading" ? "not-allowed" : "pointer",
                      opacity:       status === "loading" ? 0.6 : 1,
                      transition:    "background 0.2s ease, transform 0.15s ease",
                      // Neon glow on hover (primary at 10% opacity)
                      boxShadow:     status !== "loading"
                        ? "0 0 0 rgba(157,78,221,0)"
                        : undefined,
                    }}
                    onMouseEnter={e => {
                      if (status !== "loading") {
                        e.currentTarget.style.background  = "rgba(157,78,221,0.9)"
                        e.currentTarget.style.boxShadow   = "0 0 24px rgba(157,78,221,0.18)"
                        e.currentTarget.style.transform   = "translateY(-1px)"
                      }
                    }}
                    onMouseLeave={e => {
                      if (status !== "loading") {
                        e.currentTarget.style.background  = "rgba(157,78,221,0.72)"
                        e.currentTarget.style.boxShadow   = "0 0 0 rgba(157,78,221,0)"
                        e.currentTarget.style.transform   = "translateY(0)"
                      }
                    }}
                  >
                    {status === "loading" ? "Sending…" : "Send Message"}
                  </button>
                </form>

                {/* Copyright only — social links stay in the left column */}
                <div
                  className="flex flex-col items-center"
                  style={{ paddingTop: "0.9rem" }}
                >
                  <p
                    style={{
                      fontSize: "0.7rem",
                      fontFamily: "var(--font-geist-mono), monospace",
                      color: T.onSurfaceVariant,
                      opacity: 0.88,
                      letterSpacing: "0.06em",
                      margin: 0,
                    }}
                  >
                    © {new Date().getFullYear()} Herman Hundsberger
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ContactFooter
