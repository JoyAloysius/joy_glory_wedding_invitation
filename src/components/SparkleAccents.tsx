import { useMemo } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useLowPowerMode } from '@/hooks/useLowPowerMode'

interface SparkleAccentsProps {
  count?: number
  className?: string
  /** 'gold' (default, for light/champagne sections) or 'white' (for night-sky/dark scenes). */
  tone?: 'gold' | 'white'
}

/** Soft sparkle points used to add sparingly-placed shimmer to a section. */
export function SparkleAccents({ count = 6, className = '', tone = 'gold' }: SparkleAccentsProps) {
  const shouldReduceMotion = useReducedMotion()
  const lowPower = useLowPowerMode()
  const total = lowPower ? Math.min(count, 3) : count

  const sparkles = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => ({
        left: (i * 37) % 100,
        top: (i * 53) % 100,
        delay: i * 0.6,
        size: 3 + (i % 3),
      })),
    [total],
  )

  if (shouldReduceMotion) return null

  const dotClass = tone === 'white' ? 'bg-ivory' : 'bg-gold-light'
  const glow = tone === 'white' ? '0 0 6px 1px rgba(255, 255, 255, 0.8)' : '0 0 6px 1px rgba(228, 200, 120, 0.8)'

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {sparkles.map((sparkle, i) => (
        <span
          key={i}
          className={`animate-sparkle absolute rounded-full ${dotClass}`}
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: `${sparkle.delay}s`,
            boxShadow: glow,
          }}
        />
      ))}
    </div>
  )
}
