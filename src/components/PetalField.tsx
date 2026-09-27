import { useMemo } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useLowPowerMode } from '@/hooks/useLowPowerMode'

interface PetalFieldProps {
  count?: number
  className?: string
}

/** Subtle falling petal accents. Decorative only — disabled under reduced-motion and
 * scaled down on lower-powered devices. */
export function PetalField({ count = 8, className = '' }: PetalFieldProps) {
  const shouldReduceMotion = useReducedMotion()
  const lowPower = useLowPowerMode()
  const total = lowPower ? Math.min(count, 4) : count

  const petals = useMemo(
    () =>
      Array.from({ length: total }, (_, i) => ({
        left: (i / total) * 92 + (i % 3) * 2,
        duration: 11 + (i % 5) * 2.2,
        delay: i * 1.4,
        size: 8 + (i % 3) * 4,
        rotate: (i * 47) % 360,
      })),
    [total],
  )

  if (shouldReduceMotion) return null

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {petals.map((petal, i) => (
        <span
          key={i}
          className="animate-petal absolute block bg-gradient-to-b from-rose to-gold-light opacity-70"
          style={{
            left: `${petal.left}%`,
            top: '-6%',
            width: petal.size,
            height: petal.size * 1.3,
            borderRadius: '70% 30% 70% 30% / 60% 40% 60% 40%',
            transform: `rotate(${petal.rotate}deg)`,
            animationDuration: `${petal.duration}s`,
            animationDelay: `${petal.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
