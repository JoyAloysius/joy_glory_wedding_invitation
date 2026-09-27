import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  children: ReactNode
  className?: string
  tone?: 'ivory' | 'champagne' | 'maroon'
  ariaLabel?: string
}

const TONE_CLASSES: Record<NonNullable<SectionProps['tone']>, string> = {
  ivory: 'bg-ivory text-ink',
  champagne: 'bg-ivory-dark text-ink',
  maroon: 'bg-maroon text-ivory',
}

/** Standard full-width section wrapper: anchor id, consistent vertical rhythm, and
 * scroll-margin so the sticky nav never covers a section's heading when jumped to. */
export function Section({ id, children, className = '', tone = 'ivory', ariaLabel }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`relative scroll-mt-20 py-20 sm:py-28 ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </section>
  )
}
