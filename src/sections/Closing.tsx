import { Container } from '@/components/Container'
import { Reveal } from '@/components/Reveal'
import { MonogramSeal } from '@/components/MonogramSeal'
import { wedding } from '@/data/wedding'

export function Closing() {
  return (
    <section id="closing" aria-label="Closing message" className="bg-maroon-dark py-24 text-center text-ivory">
      <Container className="flex flex-col items-center gap-6">
        <Reveal>
          <MonogramSeal size={72} />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="max-w-xl font-accent text-2xl italic leading-relaxed sm:text-3xl">
            {wedding.messages.closing}
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="font-display text-3xl text-gold-light sm:text-4xl">{wedding.couple.combinedNames}</p>
        </Reveal>
      </Container>
    </section>
  )
}
