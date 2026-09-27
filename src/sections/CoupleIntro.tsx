import { Section } from '@/components/Section'
import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'
import { Picture } from '@/components/Picture'
import { wedding, type Person } from '@/data/wedding'

function PersonCard({ person, relation, delay }: { person: Person; relation: string; delay: number }) {
  const parentsText = person.parents.map((parent) => parent.name).join(' & ')

  return (
    <Reveal delay={delay} className="w-full max-w-sm">
      <div className="group overflow-hidden rounded-3xl bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift">
        <div className="overflow-hidden">
          <div className="transition-transform duration-500 ease-out group-hover:scale-[1.04]">
            <Picture image={person.photo} sizes="(min-width: 768px) 380px, 90vw" priority={false} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 px-6 py-7 text-center">
          <h3 className="font-display text-2xl text-maroon sm:text-3xl">{person.fullName}</h3>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            {person.qualifications}
          </p>
          <p className="mt-2 font-accent text-base italic text-ink/70">
            {relation} of {parentsText}
          </p>
        </div>
      </div>
    </Reveal>
  )
}

export function CoupleIntro() {
  return (
    <Section id="couple" tone="ivory" ariaLabel="About the couple">
      <Container>
        <SectionHeading title="The Couple" id="couple-heading" />

        <div className="mt-14 flex flex-col items-center justify-center gap-8 md:flex-row md:items-stretch md:gap-10">
          <PersonCard person={wedding.couple.groom} relation="Son" delay={0} />

          <div className="flex items-center justify-center py-2 md:py-0">
            <span className="font-display text-3xl italic text-gold sm:text-4xl">&amp;</span>
          </div>

          <PersonCard person={wedding.couple.bride} relation="Daughter" delay={0.15} />
        </div>
      </Container>
    </Section>
  )
}
