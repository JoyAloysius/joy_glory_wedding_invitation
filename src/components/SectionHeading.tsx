import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { OrnamentDivider } from './OrnamentDivider'

interface SectionHeadingProps {
  eyebrow?: string
  title: ReactNode
  align?: 'center' | 'left'
  tone?: 'default' | 'inverted'
  id?: string
}

const EASE_SILK = [0.22, 1, 0.36, 1] as const

/** Consistent eyebrow + title + ornamental divider heading used at the top of every
 * section. Animates in once on scroll — the eyebrow/title rise in together and the
 * divider draws itself in from the centre outward — using the same safe,
 * viewport-triggered, once-only pattern as `Reveal` throughout the rest of the site. */
export function SectionHeading({ eyebrow, title, align = 'center', tone = 'default', id }: SectionHeadingProps) {
  const shouldReduceMotion = Boolean(useReducedMotion())
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left'
  const titleColor = tone === 'inverted' ? 'text-ivory' : 'text-maroon'
  const eyebrowColor = tone === 'inverted' ? 'text-gold-light' : 'text-gold'

  return (
    <motion.div
      className={`flex flex-col gap-4 ${alignment}`}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: EASE_SILK }}
    >
      {eyebrow ? (
        <span className={`font-body text-xs font-semibold uppercase tracking-[0.3em] ${eyebrowColor}`}>
          {eyebrow}
        </span>
      ) : null}
      <h2 id={id} className={`font-display text-3xl leading-tight sm:text-4xl md:text-5xl ${titleColor}`}>
        {title}
      </h2>
      <motion.div
        initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: EASE_SILK, delay: shouldReduceMotion ? 0 : 0.25 }}
      >
        <OrnamentDivider />
      </motion.div>
    </motion.div>
  )
}
