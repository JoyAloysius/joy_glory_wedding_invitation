import { Section } from '@/components/Section'
import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'
import { Picture } from '@/components/Picture'
import { wedding } from '@/data/wedding'
import { formatEventDate } from '@/utils/datetime'

export function OurStory() {
  const { chapters, symbolic } = wedding.story
  const { primary, secondary, date, venue } = wedding.engagement
  const hasChapters = chapters.length > 0
  const engagementDateLabel = formatEventDate(date, '00:00', 'Asia/Kolkata')

  return (
    <Section id="our-story" tone="champagne" ariaLabel="Our story">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Our Story" title="Two Journeys, One Beginning" />

        {hasChapters ? (
          <ol className="mt-14 flex flex-col gap-10 border-l-2 border-gold/40 pl-8">
            {chapters.map((chapter, index) => (
              <Reveal key={chapter.title} delay={index * 0.1} className="relative">
                <span className="absolute -left-[2.55rem] top-1 h-3 w-3 rounded-full bg-gold" aria-hidden="true" />
                {chapter.date ? (
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                    {chapter.date}
                  </p>
                ) : null}
                <h3 className="mt-1 font-display text-xl text-maroon sm:text-2xl">{chapter.title}</h3>
                <p className="mt-2 font-body text-base leading-relaxed text-ink/75">{chapter.body}</p>
              </Reveal>
            ))}
          </ol>
        ) : (
          <Reveal className="mt-14 text-center">
            <p className="font-accent text-2xl italic leading-relaxed text-maroon sm:text-3xl">
              &ldquo;{symbolic}&rdquo;
            </p>
          </Reveal>
        )}

        <Reveal delay={0.15} className="mt-14">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="group overflow-hidden rounded-2xl border-4 border-white shadow-soft transition-shadow duration-300 hover:shadow-lift">
              <div className="overflow-hidden">
                <div className="transition-transform duration-500 ease-out group-hover:scale-[1.04]">
                  <Picture image={primary} sizes="(min-width: 640px) 50vw, 90vw" />
                </div>
              </div>
            </div>
            <div className="group overflow-hidden rounded-2xl border-4 border-white shadow-soft transition-shadow duration-300 hover:shadow-lift">
              <div className="overflow-hidden">
                <div className="transition-transform duration-500 ease-out group-hover:scale-[1.04]">
                  <Picture image={secondary} sizes="(min-width: 640px) 50vw, 90vw" />
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center font-body text-sm uppercase tracking-[0.2em] text-gold">
            Engaged &bull; {engagementDateLabel} &bull; {venue}
          </p>
        </Reveal>
      </Container>
    </Section>
  )
}
