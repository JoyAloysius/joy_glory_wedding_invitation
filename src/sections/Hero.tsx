import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Container } from '@/components/Container'
import { Picture } from '@/components/Picture'
import { Button } from '@/components/Button'
import { PetalField } from '@/components/PetalField'
import { MonogramSeal } from '@/components/MonogramSeal'
import { ScratchReveal } from '@/components/ScratchReveal'
import { wedding } from '@/data/wedding'

const EASE_SILK = [0.22, 1, 0.36, 1] as const

interface HeroProps {
  /** Whether the opening gate has been dismissed. The entrance below is gated on
   * this (rather than firing on mount) so it plays as the gate dissolves and the
   * two blend together, instead of the gate fading away to reveal an
   * already-settled, static page. */
  isRevealed: boolean
}

/** Premium duo-portrait hero: the bride and groom's own high-resolution studio
 * portraits, framed side by side with an arched, gold-edged card treatment and the
 * couple's monogram as a locket between them — both faces are always sharp and
 * fully in frame (no crop math against a single wide group photo), which is also
 * what keeps this reliable across every screen size. */
export function Hero({ isRevealed }: HeroProps) {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const duoY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 36])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  const { groom, bride } = wedding.couple

  // Explicit per-element delays (no shared parent/child variant orchestration) so the
  // cascade stays correct even under React's dev-mode double-render. Offset so this
  // rise plays out DURING the gate's actual background reveal (OpeningExperience's
  // rootCloseTransition), not before it.
  const GATE_BLEND_OFFSET = 0.55
  const riseInitial = { opacity: 0, y: shouldReduceMotion ? 0 : 22 }
  const riseAnimate = { opacity: 1, y: 0 }
  const riseTransition = (delay: number) => ({
    duration: 0.7,
    ease: EASE_SILK,
    delay: shouldReduceMotion ? 0 : GATE_BLEND_OFFSET + delay,
  })

  // The whole Hero settles in from a slightly enlarged state as the gate lifts
  // away — a gentle "arriving" move rather than a static pop-in.
  const zoomSettleTransition = {
    duration: shouldReduceMotion ? 0.4 : 1.1,
    ease: EASE_SILK,
    delay: shouldReduceMotion ? 0 : GATE_BLEND_OFFSET,
  }
  const zoomedIn = { scale: shouldReduceMotion ? 1 : 1.12 }
  const zoomSettled = { scale: 1 }

  const groomClosed = { opacity: 0, x: shouldReduceMotion ? 0 : -30, rotate: shouldReduceMotion ? 0 : -8 }
  const groomOpen = { opacity: 1, x: 0, rotate: -5 }
  const brideClosed = { opacity: 0, x: shouldReduceMotion ? 0 : 30, rotate: shouldReduceMotion ? 0 : 8 }
  const brideOpen = { opacity: 1, x: 0, rotate: 5 }
  const monogramClosed = { opacity: 0, scale: shouldReduceMotion ? 1 : 0.5 }
  const monogramOpen = { opacity: 1, scale: 1 }

  return (
    <div
      ref={sectionRef}
      id="hero"
      className="relative isolate flex min-h-[70svh] flex-col overflow-hidden bg-gradient-to-b from-champagne via-ivory to-ivory"
    >
      {/* Soft, painterly depth — never a literal scene, so it never reads as a fake photo backdrop. */}
      <div className="pointer-events-none absolute -left-24 -top-24 -z-10 h-96 w-96 rounded-full bg-blush/50 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-28 top-1/3 -z-10 h-[28rem] w-[28rem] rounded-full bg-gold-light/25 blur-3xl" aria-hidden="true" />
      <div className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" aria-hidden="true" />

      <PetalField count={6} />

      <Container className="relative flex flex-1 flex-col items-center justify-center gap-8 py-24 sm:py-28">
        <motion.div
          initial={zoomedIn}
          animate={isRevealed ? zoomSettled : zoomedIn}
          transition={zoomSettleTransition}
          style={{ y: duoY }}
          className="relative mx-auto flex w-full max-w-[19rem] items-end justify-center sm:max-w-sm md:max-w-md lg:max-w-lg"
        >
          <motion.div
            initial={groomClosed}
            animate={isRevealed ? groomOpen : groomClosed}
            transition={{ duration: 0.8, ease: EASE_SILK, delay: shouldReduceMotion ? 0 : GATE_BLEND_OFFSET + 0.1 }}
            className="relative z-10 w-[47%] -mr-3"
          >
            <div className="overflow-hidden rounded-t-[4rem] rounded-b-2xl border-4 border-white shadow-lift ring-1 ring-gold/25 transition-transform duration-500 hover:scale-[1.03]">
              <Picture image={groom.photo} sizes="(min-width: 640px) 220px, 45vw" priority />
            </div>
          </motion.div>

          <motion.div
            initial={brideClosed}
            animate={isRevealed ? brideOpen : brideClosed}
            transition={{ duration: 0.8, ease: EASE_SILK, delay: shouldReduceMotion ? 0 : GATE_BLEND_OFFSET + 0.2 }}
            className="relative z-10 w-[47%] -ml-3"
          >
            <div className="overflow-hidden rounded-t-[4rem] rounded-b-2xl border-4 border-white shadow-lift ring-1 ring-gold/25 transition-transform duration-500 hover:scale-[1.03]">
              <Picture image={bride.photo} sizes="(min-width: 640px) 220px, 45vw" priority />
            </div>
          </motion.div>

          <motion.div
            initial={monogramClosed}
            animate={isRevealed ? monogramOpen : monogramClosed}
            transition={{ duration: 0.6, ease: EASE_SILK, delay: shouldReduceMotion ? 0 : GATE_BLEND_OFFSET + 0.5 }}
            className="absolute left-1/2 top-[34%] z-20 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-light bg-ivory p-2 shadow-lift sm:h-20 sm:w-20">
              <MonogramSeal size={44} />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={zoomedIn}
          animate={isRevealed ? zoomSettled : zoomedIn}
          transition={zoomSettleTransition}
          style={{ opacity: contentOpacity }}
          className="flex max-w-2xl flex-col items-center gap-5 text-center"
        >
          <motion.h1
            initial={riseInitial}
            animate={isRevealed ? riseAnimate : riseInitial}
            transition={riseTransition(0.3)}
            className="font-display text-5xl leading-[1.05] text-maroon sm:text-6xl md:text-7xl"
          >
            {wedding.hero.headline}
          </motion.h1>
          <motion.p
            initial={riseInitial}
            animate={isRevealed ? riseAnimate : riseInitial}
            transition={riseTransition(0.38)}
            className="font-accent text-xl italic text-maroon/85 sm:text-2xl"
          >
            {wedding.hero.message}
          </motion.p>
          <motion.div
            initial={riseInitial}
            animate={isRevealed ? riseAnimate : riseInitial}
            transition={riseTransition(0.46)}
            className="w-full max-w-md"
          >
            <ScratchReveal message={wedding.hero.subMessage} />
          </motion.div>

          <motion.div
            initial={riseInitial}
            animate={isRevealed ? riseAnimate : riseInitial}
            transition={riseTransition(0.54)}
            className="mt-4 flex flex-wrap items-center justify-center gap-4"
          >
            <Button href="#events">View Celebrations</Button>
            <Button href="#save-the-date" variant="secondary">
              Save the Date
            </Button>
          </motion.div>
        </motion.div>
      </Container>

      <motion.a
        href="#couple"
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-gold"
        animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={28} />
      </motion.a>
    </div>
  )
}

