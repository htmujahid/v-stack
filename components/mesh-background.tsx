"use client"

import * as React from "react"

import { cn } from "cn"

type Point = {
  x: number
  y: number
  vx: number
  vy: number
}

const LINK_DISTANCE = 200
const MAX_POINTS = 70

function MeshBackground({ className }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let raf = 0
    let width = 0
    let height = 0
    let points: Point[] = []

    function resize() {
      if (!canvas) return
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(
        MAX_POINTS,
        Math.max(24, Math.floor((width * height) / 26000))
      )
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }))
    }

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, width, height)
      const color = getComputedStyle(canvas).color

      for (let i = 0; i < points.length; i++) {
        const a = points[i]
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distance = Math.hypot(dx, dy)
          if (distance < LINK_DISTANCE) {
            ctx.globalAlpha = (1 - distance / LINK_DISTANCE) * 0.18
            ctx.strokeStyle = color
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      ctx.globalAlpha = 0.45
      ctx.fillStyle = color
      for (const p of points) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    function step() {
      for (const p of points) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
      }
      draw()
      raf = requestAnimationFrame(step)
    }

    resize()
    if (reduceMotion) {
      draw()
    } else {
      raf = requestAnimationFrame(step)
    }

    function onResize() {
      resize()
      if (reduceMotion) draw()
    }

    window.addEventListener("resize", onResize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none size-full text-muted-foreground",
        className
      )}
    />
  )
}

export { MeshBackground }
