import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

interface ScratchRevealProps {
  message: string
  className?: string
}

/** Fraction of the sampled grid that must be scratched clear before the rest
 * reveals on its own — nobody should have to scratch into every corner. */
const REVEAL_THRESHOLD = 0.45
const SAMPLE_COLS = 12
const SAMPLE_ROWS = 5
/** A quick tap/click (little movement, little time) counts as "reveal it for me"
 * rather than requiring precise scratching — keeps the fun optional, not a gate. */
const TAP_MAX_DISTANCE = 8
const TAP_MAX_DURATION_MS = 400

/** A gold "scratch card" foil sits over the message until scratched (or tapped)
 * away — a small, playful moment instead of a plain paragraph. The text itself is
 * always present in the DOM underneath (never hidden from assistive tech), so
 * screen readers get it immediately regardless of the visual scratch state; the
 * canvas is additionally reachable and revealable by keyboard (Enter/Space). */
export function ScratchReveal({ message, className = '' }: ScratchRevealProps) {
  const shouldReduceMotion = Boolean(useReducedMotion())
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const pointerStart = useRef<{ x: number; y: number; t: number } | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (revealed) return
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const paint = () => {
      const rect = container.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height)
      gradient.addColorStop(0, '#b8893a')
      gradient.addColorStop(0.5, '#e4c878')
      gradient.addColorStop(1, '#b8893a')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, rect.width, rect.height)
      ctx.fillStyle = 'rgba(74, 20, 32, 0.8)'
      ctx.font = '600 13px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('\u2726 scratch to reveal \u2726', rect.width / 2, rect.height / 2)
    }

    paint()
    const observer = new ResizeObserver(paint)
    observer.observe(container)
    return () => observer.disconnect()
  }, [revealed])

  const erase = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(clientX - rect.left, clientY - rect.top, 26, 0, Math.PI * 2)
    ctx.fill()
  }

  const measureScratchedFraction = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || canvas.width === 0) return 0
    let cleared = 0
    for (let row = 0; row < SAMPLE_ROWS; row++) {
      for (let col = 0; col < SAMPLE_COLS; col++) {
        const x = Math.min(canvas.width - 1, ((col + 0.5) / SAMPLE_COLS) * canvas.width)
        const y = Math.min(canvas.height - 1, ((row + 0.5) / SAMPLE_ROWS) * canvas.height)
        if (ctx.getImageData(x, y, 1, 1).data[3] < 40) cleared += 1
      }
    }
    return cleared / (SAMPLE_COLS * SAMPLE_ROWS)
  }

  const startScratch = (x: number, y: number, pointerId: number, target: HTMLCanvasElement) => {
    if (revealed) return
    target.setPointerCapture(pointerId)
    isDrawing.current = true
    pointerStart.current = { x, y, t: Date.now() }
    erase(x, y)
  }

  const moveScratch = (x: number, y: number) => {
    if (!isDrawing.current || revealed) return
    erase(x, y)
  }

  const endScratch = (x: number, y: number) => {
    if (revealed) return
    isDrawing.current = false
    const start = pointerStart.current
    pointerStart.current = null
    if (start) {
      const distance = Math.hypot(x - start.x, y - start.y)
      const duration = Date.now() - start.t
      if (distance < TAP_MAX_DISTANCE && duration < TAP_MAX_DURATION_MS) {
        setRevealed(true)
        return
      }
    }
    if (measureScratchedFraction() >= REVEAL_THRESHOLD) setRevealed(true)
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl border border-gold/25 bg-white/60 shadow-soft ${className}`}
    >
      <p className="px-6 py-5 font-body text-base text-ink/70">{message}</p>
      <AnimatePresence>
        {!revealed ? (
          <motion.canvas
            key="scratch-foil"
            ref={canvasRef}
            role="button"
            tabIndex={0}
            aria-label="Scratch to reveal the message"
            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.04 }}
            transition={{ duration: shouldReduceMotion ? 0.15 : 0.5, ease: 'easeOut' }}
            className="absolute inset-0 h-full w-full touch-none rounded-2xl outline-none [cursor:pointer]"
            onPointerDown={(e) => startScratch(e.clientX, e.clientY, e.pointerId, e.currentTarget)}
            onPointerMove={(e) => moveScratch(e.clientX, e.clientY)}
            onPointerUp={(e) => endScratch(e.clientX, e.clientY)}
            onPointerCancel={(e) => endScratch(e.clientX, e.clientY)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setRevealed(true)
              }
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}
