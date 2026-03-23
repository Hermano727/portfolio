"use client"

import { useState } from "react"
import Link from "next/link"
import { Github, Linkedin, ArrowUp, Mail } from "lucide-react"

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
  const [status,   setStatus]   = useState<FormStatus>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

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
    <>
      {/* ── Contact Section ─────────────────────────────────────────────────── */}
      <section
        id="contact"
        className="relative w-full overflow-hidden"
        style={{
          background: T.surface,
          padding:    "clamp(4rem, 8vw, 7rem) 0",
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
            padding:  "0 clamp(1.5rem, 5vw, 5rem)",
          }}
        >
          <div
            style={{
              display:       "flex",
              flexDirection: "row",
              alignItems:    "flex-start",
              gap:           "clamp(2.5rem, 6vw, 6rem)",
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
                gap:           "2rem",
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
                    color:      `rgba(${T.outlineVariant},1)`,
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = T.onSurfaceVariant)}
                  onMouseLeave={e => (e.currentTarget.style.color = `rgba(${T.outlineVariant},1)`)}
                >
                  <Github style={{ height: "1.625rem", width: "1.625rem" }} />
                </Link>
                <Link
                  href="http://linkedin.com/in/herman-hundsberger-577600295"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  style={{
                    color:      `rgba(${T.outlineVariant},1)`,
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = T.onSurfaceVariant)}
                  onMouseLeave={e => (e.currentTarget.style.color = `rgba(${T.outlineVariant},1)`)}
                >
                  <Linkedin style={{ height: "1.625rem", width: "1.625rem" }} />
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
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Footer bar ──────────────────────────────────────────────────────── */}
      <footer
        className="relative w-full overflow-hidden"
        style={{
          background: "#0f0e0f",
          padding:    "2.5rem 0",
        }}
      >
        {/* Hairline separator */}
        <div
          className="absolute top-0 left-0 right-0 h-px pointer-events-none"
          aria-hidden="true"
          style={{
            background: `linear-gradient(
              to right,
              transparent,
              rgba(${T.outlineVariant},0.25) 25%,
              rgba(157,78,221,0.2) 50%,
              rgba(${T.outlineVariant},0.25) 75%,
              transparent
            )`,
          }}
        />

        <div
          className="relative z-10 mx-auto flex flex-col items-center gap-5"
          style={{ maxWidth: "1100px", padding: "0 clamp(1.5rem, 5vw, 5rem)" }}
        >
          {/* Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            style={{
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
              width:        "2.25rem",
              height:       "2.25rem",
              borderRadius: "50%",
              background:   `rgba(${T.outlineVariant},0.15)`,
              border:       `1px solid rgba(${T.outlineVariant},0.22)`,
              cursor:       "pointer",
              transition:   "background 0.2s, border-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background   = "rgba(157,78,221,0.18)"
              e.currentTarget.style.borderColor  = "rgba(157,78,221,0.4)"
              e.currentTarget.style.transform    = "translateY(-2px)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background   = `rgba(${T.outlineVariant},0.15)`
              e.currentTarget.style.borderColor  = `rgba(${T.outlineVariant},0.22)`
              e.currentTarget.style.transform    = "translateY(0)"
            }}
          >
            <ArrowUp
              style={{
                width:  "0.875rem",
                height: "0.875rem",
                color:  T.onSurfaceVariant,
              }}
            />
          </button>

          {/* Social icons */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <Link
              href="https://github.com/Hermano727"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={{
                color:      `rgba(${T.outlineVariant},0.9)`,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = T.onSurfaceVariant)}
              onMouseLeave={e => (e.currentTarget.style.color = `rgba(${T.outlineVariant},0.9)`)}
            >
              <Github style={{ height: "1.75rem", width: "1.75rem" }} />
            </Link>
            <Link
              href="http://linkedin.com/in/herman-hundsberger-577600295"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{
                color:      `rgba(${T.outlineVariant},0.9)`,
                transition: "color 0.2s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = T.onSurfaceVariant)}
              onMouseLeave={e => (e.currentTarget.style.color = `rgba(${T.outlineVariant},0.9)`)}
            >
              <Linkedin style={{ height: "1.75rem", width: "1.75rem" }} />
            </Link>
          </div>

          <p
            style={{
              fontSize:      "0.68rem",
              fontFamily:    "var(--font-geist-mono), monospace",
              color:         `rgba(${T.outlineVariant},0.8)`,
              letterSpacing: "0.06em",
            }}
          >
            © {new Date().getFullYear()} Herman Hundsberger
          </p>
        </div>
      </footer>
    </>
  )
}

export default ContactFooter
