import { NextResponse } from "next/server"
import { Resend } from "resend"

// Basic email regex for sanity checks
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function sanitize(input: string) {
  return input.replace(/[\r\n]/g, " ").trim()
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const name = sanitize(String(body.name ?? ""))
    const email = sanitize(String(body.email ?? ""))
    const message = String(body.message ?? "").trim()
    const honeypot = String(body.company ?? "").trim() // hidden field to catch bots

    // Honeypot: if filled, silently accept
    if (honeypot) {
      return NextResponse.json({ ok: true })
    }

    // Validation
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: "Please provide your name (2-100 chars)." }, { status: 400 })
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 })
    }
    if (message.length < 10 || message.length > 5000) {
      return NextResponse.json({ error: "Message should be between 10 and 5000 characters." }, { status: 400 })
    }

    const to = (process.env.CONTACT_TO_EMAIL || "hh727w@gmail.com").split(",").map(s => s.trim()).filter(Boolean)
    const from = process.env.CONTACT_FROM_EMAIL || "Herman Portfolio <onboarding@resend.dev>"

    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      // In development or if not configured, don't fail hard — pretend accepted.
      console.warn("RESEND_API_KEY not set; skipping email send. Message:", { name, email, message })
      return NextResponse.json({ ok: true })
    }

    const resend = new Resend(apiKey)

    const subject = `New message from ${name}`
    const text = `You have a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`

    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      text,
      replyTo: email,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("/api/contact error:", err)
    return NextResponse.json({ error: "Unexpected error. Please try again later." }, { status: 500 })
  }
}
