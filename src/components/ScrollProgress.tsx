import { motion, useScroll, useSpring } from 'framer-motion'

/** Slim scroll-progress indicator fixed to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-gradient-to-r from-gold-light via-gold to-rose"
      style={{ scaleX }}
    />
  )
}
