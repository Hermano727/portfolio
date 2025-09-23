"use client"

import React, { useEffect, useRef } from "react"

interface StarfieldProps {
  className?: string
  density?: number // particles per 10,000 px^2
  speed?: number // px per frame in each axis (small)
  color?: string // rgba string for dots
  size?: number // dot radius in px
}

// Minimal, DPR-safe starfield (moving dots, no mouse/lines)
export default function Starfield({
  className,
  density = 0.6,
  speed = 0.15,
  color = "rgba(255,255,255,0.35)",
  size = 1.6,
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d", { alpha: true })!
    let raf = 0

    type P = { x: number; y: number; vx: number; vy: number }
    let particles: P[] = []

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const { clientWidth, clientHeight } = canvas.parentElement || canvas
      canvas.width = Math.max(1, Math.floor(clientWidth * dpr))
      canvas.height = Math.max(1, Math.floor(clientHeight * dpr))
      canvas.style.width = `${clientWidth}px`
      canvas.style.height = `${clientHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const area = clientWidth * clientHeight
      const target = Math.max(30, Math.floor((area / 10000) * density))
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * clientWidth,
        y: Math.random() * clientHeight,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
      }))
    }

    function draw() {
      // Clear in device pixels to avoid DPR edge artifacts
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.restore()

      const w = canvas.clientWidth
      const h = canvas.clientHeight

      ctx.fillStyle = color
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        // wrap around edges
        if (p.x < -2) p.x = w + 2
        if (p.x > w + 2) p.x = -2
        if (p.y < -2) p.y = h + 2
        if (p.y > h + 2) p.y = -2

        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [density, speed, color, size])

  return (
    <canvas
      ref={canvasRef}
      className={className ?? "absolute inset-0 w-full h-full pointer-events-none"}
      aria-hidden="true"
    />
  )
}
