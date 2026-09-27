import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Section } from '@/components/Section'
import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { SparkleAccents } from '@/components/SparkleAccents'
import { Reveal } from '@/components/Reveal'
import { useCountdown } from '@/hooks/useCountdown'
import { wedding } from '@/data/wedding'

const EASE_SILK = [0.22, 1, 0.36, 1] as const

function CountdownUnit({ value, label }: { value: number; label: string }) {
  const shouldReduceMotion = Boolean(useReducedMotion())

  return (
    <div className="flex w-14 flex-col items-center gap-2 sm:w-20">
      <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-ivory/95 shadow-soft ring-1 ring-gold-light/40 sm:h-20 sm:w-20">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: shouldReduceMotion ? 0 : 24, opacity: shouldReduceMotion ? 1 : 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: shouldReduceMotion ? 0 : -24, opacity: shouldReduceMotion ? 1 : 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: EASE_SILK }}
            className="absolute inset-0 flex items-center justify-center font-display text-2xl text-maroon sm:text-4xl"
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-ivory/70 sm:text-xs">{label}</span>
    </div>
  )
}

function Separator() {
  return (
    <span aria-hidden="true" className="hidden font-display text-2xl text-gold-light/50 sm:inline sm:text-3xl">
      &middot;
    </span>
  )
}

export function Countdown() {
  const { countdown } = wedding
  const { days, hours, minutes, seconds, isComplete } = useCountdown(
    countdown.date,
    countdown.time,
    countdown.timeZone,
  )
  const summary = isComplete
    ? countdown.completedMessage
    : `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds until ${countdown.label}`

  return (
    <Section id="countdown" tone="maroon" ariaLabel="Countdown to the wedding" className="overflow-hidden">
      <SparkleAccents count={10} />
      <Container className="relative flex flex-col items-center text-center">
        <SectionHeading eyebrow="Counting Down To" title={countdown.label} tone="inverted" />

        {/* Static summary for assistive tech — intentionally not aria-live so it
            doesn't announce every second; the digits below are aria-hidden. */}
        <p className="sr-only" role="status">
          {summary}
        </p>

        <Reveal delay={0.1} className="mt-12">
          {isComplete ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE_SILK }}
              aria-hidden="true"
              className="font-display text-3xl text-gold-light sm:text-4xl"
            >
              {countdown.completedMessage}
            </motion.p>
          ) : (
            <div aria-hidden="true" className="flex items-center justify-center gap-2 sm:gap-6">
              <CountdownUnit value={days} label="Days" />
              <Separator />
              <CountdownUnit value={hours} label="Hrs" />
              <Separator />
              <CountdownUnit value={minutes} label="Min" />
              <Separator />
              <CountdownUnit value={seconds} label="Sec" />
            </div>
          )}
        </Reveal>
      </Container>
    </Section>
  )
}
