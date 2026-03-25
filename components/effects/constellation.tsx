"use client"

import React, { useEffect, useRef } from "react"

interface ConstellationProps {
  className?: string
  density?: number       // particles per 10,000 px^2
  maxDistance?: number   // px to draw connecting lines
  speed?: number         // base velocity scalar
  nodeColor?: string     // CSS rgba for particle dots
  lineColor?: string     // RGB only (e.g. "157,78,221") — alpha is set per-distance
  mouseColor?: string    // RGB only — for mouse connection lines
}

// Lightweight, dependency-free canvas constellation with mouse-proximity line drawing.
export default function Constellation({
  className,
  density = 0.9,
  maxDistance = 140,
  speed = 0.3,
  nodeColor = "rgba(224,182,255,0.55)",
  lineColor = "157,78,221",
  mouseColor = "224,182,255",
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
      const area = clientWidth * clientHeight
      const target = Math.max(40, Math.floor((area / 10000) * density))
      particles = Array.from({ length: target }, () => ({
        x:  Math.random() * clientWidth,
        y:  Math.random() * clientHeight,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
      }))
    }

    function draw() {
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.restore()

      const cssW = canvas.clientWidth
      const cssH = canvas.clientHeight

      // Subtle background star specks
      ctx.fillStyle = "rgba(255,255,255,0.025)"
      for (let i = 0; i < 28; i++) {
        ctx.fillRect(Math.random() * cssW, Math.random() * cssH, 1, 1)
      }

      ctx.lineWidth = 1

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Standard drift — bounce off walls
        p.x += p.vx
        p.y += p.vy
        if (p.x <= 0 || p.x >= cssW) p.vx *= -1
        if (p.y <= 0 || p.y >= cssH) p.vy *= -1

        // Node dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2)
        ctx.fillStyle = nodeColor
        ctx.fill()

        // Connections between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.hypot(dx, dy)
          if (dist < maxDistance) {
            const alpha = 1 - dist / maxDistance
            ctx.strokeStyle = `rgba(${lineColor},${alpha * 0.5})`
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }

        // Lines drawn toward the mouse cursor — original connecting behavior
        if (mouse.current) {
          const dxm = p.x - mouse.current.x
          const dym = p.y - mouse.current.y
          const dm = Math.hypot(dxm, dym)
          if (dm < maxDistance * 1.2) {
            const alpha = 1 - dm / (maxDistance * 1.2)
            ctx.strokeStyle = `rgba(${mouseColor},${alpha * 0.75})`
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.current.x, mouse.current.y)
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

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
      const toElement = (e.relatedTarget || (e as unknown as { toElement: Node | null }).toElement) as Node | null
      if (!toElement) mouse.current = null
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
  }, [density, maxDistance, speed, nodeColor, lineColor, mouseColor])

  return (
    <canvas
      ref={canvasRef}
      className={className ?? "absolute inset-0 w-full h-full pointer-events-none"}
      aria-hidden="true"
    />
  )
}
