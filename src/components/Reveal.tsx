import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  /** Root margin for the in-view trigger. Defaults to '-80px' (requires the
   * element to scroll meaningfully into the viewport). Short elements pinned to
   * the very end of the page (e.g. a footer) can never scroll past the document's
   * max scroll position, so they may never satisfy a negative margin — pass a
   * smaller/zero margin for those cases. */
  viewportMargin?: string
}

/** Consistent scroll-triggered fade/rise used across sections; animates once and
 * respects the user's reduced-motion preference (fades in place instead of moving). */
export function Reveal({ children, className, delay = 0, y = 24, viewportMargin = '-80px' }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  const variants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin }}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}
