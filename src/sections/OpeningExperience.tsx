import { useReducedMotion, motion } from 'framer-motion'
import { MonogramSeal } from '@/components/MonogramSeal'
import { SparkleAccents } from '@/components/SparkleAccents'
import { PetalField } from '@/components/PetalField'
import { wedding } from '@/data/wedding'
import { playSealChime } from '@/utils/sound'

const EASE_SILK = [0.22, 1, 0.36, 1] as const

/** How long the closing visual plays before App.tsx actually unmounts this component.
 * Driven by a plain timer (not animation-completion callbacks) so the invitation is
 * guaranteed to open even if a browser throttles/skips animation frames. */
export const OPENING_CLOSE_MS = 1750

interface OpeningExperienceProps {
  onOpen: () => void
  isClosing: boolean
}

const FLAP_BG = 'linear-gradient(160deg, var(--color-ivory) 0%, var(--color-ivory-dark) 55%, #e2cb9c 100%)'

/** One triangular quarter of the folded letter — its point meets the other
 * three dead center, where the wax-seal stamp sits. Purely the decorative
 * paper surface; any text lives in a sibling that rides along with it, never
 * clipped by this triangle's own edges. */
function FlapShape({ clipPath }: { clipPath: string }) {
  return (
    <div
      className="h-full w-full shadow-[0_10px_25px_-10px_rgba(0,0,0,0.4)]"
      style={{ clipPath, background: FLAP_BG }}
    />
  )
}

/** Full-screen invitation gate styled as a folded letter: four triangular
 * flaps (top, bottom, left, right) meet at the center, held shut by a
 * wax-seal monogram stamp sitting exactly at that joint. The top flap alone
 * carries "Wedding Invitation" and the couple's names — one intact block, so
 * it's never visually split — while the other three are purely decorative.
 * Tapping the stamp breaks the seal and all four flaps fly apart straight
 * toward their own edge of the screen (up, down, left, right), the letter
 * bursting open to reveal the Hero underneath. Every step uses the same fixed
 * durations/delays whether or not reduced-motion is on — only the directional
 * travel is stripped out in favor of a plain crossfade. Dismissal itself is
 * driven by a plain timer in App.tsx (not any animation's completion), so the
 * invitation always opens even if a browser throttles or skips frames. */
export function OpeningExperience({ onOpen, isClosing }: OpeningExperienceProps) {
  const shouldReduceMotion = Boolean(useReducedMotion())

  const handleTap = () => {
    playSealChime()
    onOpen()
  }

  const riseTransition = (delay: number) => ({
    duration: shouldReduceMotion ? 0.35 : 0.6,
    ease: EASE_SILK,
    delay: shouldReduceMotion ? 0 : delay,
  })
  const riseInitial = { opacity: 0, y: shouldReduceMotion ? 0 : 14 }
  const riseAnimate = { opacity: 1, y: 0 }

  // Closing choreography: fixed timing regardless of reduced motion, so the
  // sequence always breathes the same amount — only the movement is stripped.
  // Slowed and spaced out (vs. an earlier, too-quick pass) so each beat — seal
  // breaking, flaps parting, background dissolving — has room to actually read.
  const sealTransition = { duration: 0.5, ease: EASE_SILK }
  const sealClosed = { opacity: 1, scale: 1 }
  const sealBroken = { opacity: 0, scale: shouldReduceMotion ? 1 : 0.7 }

  // Each flap travels a full viewport dimension in exactly one direction, so
  // it's guaranteed clear of the screen — not just its own small bounding box.
  const flapRest = { x: 0, y: 0 }
  const flapTransition = { duration: shouldReduceMotion ? 0.5 : 1.1, ease: EASE_SILK, delay: shouldReduceMotion ? 0 : 0.3 }
  const flapExit = (x: string, y: string) => (shouldReduceMotion ? flapRest : { x, y })

  // The gate's own background — fades once the flaps are well on their way
  // apart, which is what actually reveals the Hero underneath.
  const rootCloseTransition = { duration: 0.7, ease: EASE_SILK, delay: 0.9 }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Wedding invitation, tap to open"
      onClick={handleTap}
      initial={{ opacity: 1 }}
      animate={{ opacity: isClosing ? 0 : 1 }}
      transition={rootCloseTransition}
      className="fixed inset-0 z-[200] cursor-pointer overflow-hidden bg-[radial-gradient(ellipse_at_center,_#2c111c_0%,_#170910_55%,_#0a0407_100%)]"
    >
      <SparkleAccents count={20} tone="white" />
      <PetalField count={5} />

      <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 px-6 text-center">
        {/* The letter: four flaps meeting at a center stamp. Taller and
            narrower (portrait, not square) so it reads as a proper letter and
            fills more of a mobile screen. */}
        <div className="relative aspect-[2/3] w-[66vw] max-w-[280px] sm:max-w-[320px] md:max-w-[360px]">
          {/* A soft ambient glow behind the whole letter, like candlelight. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-6 -z-10 rounded-full opacity-70 blur-2xl"
            style={{ background: 'radial-gradient(closest-side, rgba(228,200,120,0.35), transparent)' }}
          />

          {/* Top flap — carries the invitation text, exits upward. */}
          <motion.div
            initial={flapRest}
            animate={isClosing ? flapExit('0%', '-100vh') : flapRest}
            transition={flapTransition}
            style={{ opacity: isClosing && shouldReduceMotion ? 0 : 1 }}
            className="absolute inset-x-0 top-0 z-10 h-1/2"
          >
            <FlapShape clipPath="polygon(0 0, 100% 0, 50% 100%)" />
            <div className="pointer-events-none absolute inset-x-0 top-[9%] px-8 text-center sm:px-10">
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-maroon/60 sm:text-xs">
                {wedding.hero.eyebrow}
              </p>
              <p className="mt-5 font-display text-lg leading-tight text-maroon sm:text-xl">{wedding.couple.combinedNames}</p>
            </div>
          </motion.div>

          {/* Bottom flap — decorative, exits downward. */}
          <motion.div
            aria-hidden="true"
            initial={flapRest}
            animate={isClosing ? flapExit('0%', '100vh') : flapRest}
            transition={flapTransition}
            style={{ opacity: isClosing && shouldReduceMotion ? 0 : 1 }}
            className="absolute inset-x-0 bottom-0 z-10 h-1/2"
          >
            <FlapShape clipPath="polygon(0 100%, 100% 100%, 50% 0)" />
          </motion.div>

          {/* Left flap — decorative, exits left. */}
          <motion.div
            aria-hidden="true"
            initial={flapRest}
            animate={isClosing ? flapExit('-100vw', '0%') : flapRest}
            transition={flapTransition}
            style={{ opacity: isClosing && shouldReduceMotion ? 0 : 1 }}
            className="absolute inset-y-0 left-0 z-10 w-1/2"
          >
            <FlapShape clipPath="polygon(0 0, 0 100%, 100% 50%)" />
          </motion.div>

          {/* Right flap — decorative, exits right. */}
          <motion.div
            aria-hidden="true"
            initial={flapRest}
            animate={isClosing ? flapExit('100vw', '0%') : flapRest}
            transition={flapTransition}
            style={{ opacity: isClosing && shouldReduceMotion ? 0 : 1 }}
            className="absolute inset-y-0 right-0 z-10 w-1/2"
          >
            <FlapShape clipPath="polygon(100% 0, 100% 100%, 0 50%)" />
          </motion.div>

          {/* Wax-seal monogram — the tap target, sitting exactly where all four
              flaps meet. The ring and glow are box-shadow only (no `border`,
              which didn't clip/fade cleanly during the flap-burst exit) so the
              whole button reliably fades away together on tap. */}
          <motion.button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              handleTap()
            }}
            autoFocus
            aria-label="Tap to open the invitation"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.7 }}
            animate={isClosing ? sealBroken : sealClosed}
            transition={isClosing ? sealTransition : { duration: 0.65, ease: EASE_SILK, delay: shouldReduceMotion ? 0 : 0.5 }}
            className="absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ivory p-2.5 shadow-[0_0_0_2px_var(--color-gold-light),0_0_35px_10px_rgba(228,200,120,0.45)] outline-none transition-transform duration-300 ease-out hover:scale-105 focus-visible:scale-105 active:scale-95 sm:h-20 sm:w-20"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 rounded-full opacity-70 animate-pulse"
              style={{ boxShadow: '0 0 24px 8px rgba(228,200,120,0.55)' }}
            />
            <MonogramSeal size={48} />
          </motion.button>
        </div>

        <motion.span
          initial={riseInitial}
          animate={riseAnimate}
          transition={riseTransition(0.6)}
          className="font-body text-xs uppercase tracking-[0.3em] text-ivory/50"
        >
          Tap to Open
        </motion.span>
      </div>
    </motion.div>
  )
}
