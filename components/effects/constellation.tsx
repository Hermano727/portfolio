"use client"

import React, { useEffect, useRef } from "react"

interface ConstellationProps {
  className?: string
  density?: number // particles per 10,000 px^2
  maxDistance?: number // px to draw connecting lines
  speed?: number // base velocity scalar
}

// Lightweight, dependency-free canvas constellation
export default function Constellation({
  className,
  density = 0.9,
  maxDistance = 140,
  speed = 0.3,
}: ConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouse = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d", { alpha: true })!
    let raf = 0

    type P = { x: number; y: number; vx: number; vy: number }
    let particles: P[] = []

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const { clientWidth, clientHeight } = canvas.parentElement || canvas
      canvas.width = clientWidth * dpr
      canvas.height = clientHeight * dpr
      canvas.style.width = `${clientWidth}px`
      canvas.style.height = `${clientHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // Rebuild particles based on area
      const area = clientWidth * clientHeight
      const target = Math.max(40, Math.floor((area / 10000) * density))
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * clientWidth,
        y: Math.random() * clientHeight,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
      }))
    }

    function draw() {
      // Clear using identity transform in device pixels to avoid 1px artifacts on edges
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.restore()

      // Background star specks (very subtle)
      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight
      ctx.fillStyle = "rgba(255,255,255,0.03)"
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * cssW
        const y = Math.random() * cssH
        ctx.fillRect(x, y, 1, 1)
      }

      // Update and draw particles
      ctx.lineWidth = 1
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x <= 0 || p.x >= canvas.clientWidth) p.vx *= -1
        if (p.y <= 0 || p.y >= canvas.clientHeight) p.vy *= -1

        // Node
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(96,165,250,0.7)" // tailwind blue-400
        ctx.fill()

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.hypot(dx, dy)
          if (dist < maxDistance) {
            const alpha = 1 - dist / maxDistance
            // purple/blue mix
            ctx.strokeStyle = `rgba(139,92,246,${alpha * 0.6})` // purple-500
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }

        // Mouse connection
        if (mouse.current) {
          const dxm = p.x - mouse.current.x
          const dym = p.y - mouse.current.y
          const dm = Math.hypot(dxm, dym)
          if (dm < maxDistance * 1.2) {
            const alpha = 1 - dm / (maxDistance * 1.2)
            ctx.strokeStyle = `rgba(96,165,250,${alpha})` // blue-400
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.current.x, mouse.current.y)
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

    // Track mouse relative to the canvas even if the canvas does not receive events
    function onWindowMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        mouse.current = { x, y }
      } else {
        mouse.current = null
      }
    }

    function onWindowMouseOut(e: MouseEvent) {
      // If the pointer leaves the window, clear the mouse
      const toElement = (e.relatedTarget || (e as any).toElement) as Node | null
      if (!toElement) {
        mouse.current = null
      }
    }

    resize()
    draw()

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onWindowMouseMove)
    window.addEventListener("mouseout", onWindowMouseOut)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onWindowMouseMove)
      window.removeEventListener("mouseout", onWindowMouseOut)
    }
  }, [density, maxDistance, speed])

  return (
    <canvas
      ref={canvasRef}
      className={className ?? "absolute inset-0 w-full h-full pointer-events-none"}
      aria-hidden="true"
    />
  )
}
