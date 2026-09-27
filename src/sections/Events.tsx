import { MapPin, CalendarPlus, Clock, Shirt } from 'lucide-react'
import { Section } from '@/components/Section'
import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'
import { wedding } from '@/data/wedding'
import { formatEventDate, formatEventTime } from '@/utils/datetime'
import { getEventMapsUrl } from '@/utils/maps'
import { buildGoogleCalendarUrl } from '@/utils/calendarLinks'
import { displayAddress } from '@/utils/formatAddress'

export function Events() {
  return (
    <Section id="events" tone="champagne" ariaLabel="Wedding events">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="Save These Moments" title="Wedding Events" />

        <ol className="mt-14 flex flex-col gap-10 border-l-2 border-gold/40 pl-8 sm:pl-10">
          {wedding.events.map((event, index) => {
            const dateLabel = formatEventDate(event.date, event.startTime, event.timeZone)
            const timeLabel = formatEventTime(event.date, event.startTime, event.timeZone)

            return (
              <Reveal key={event.id} delay={index * 0.1} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[2.65rem] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold ring-4 ring-ivory-dark sm:-left-[3.15rem]"
                />

                <div className="rounded-2xl bg-white/70 p-6 shadow-soft">
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                    {dateLabel}
                  </p>
                  <h3 className="mt-1 font-display text-2xl text-maroon sm:text-3xl">{event.name}</h3>

                  <p className="mt-3 flex items-center gap-2 font-body text-sm text-ink/70">
                    <Clock size={15} className="shrink-0 text-gold" aria-hidden="true" />
                    {timeLabel} onwards
                  </p>
                  <p className="mt-1 flex items-start gap-2 font-body text-sm text-ink/70">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                    <span>
                      {event.venueName} &mdash; {displayAddress(event)}
                    </span>
                  </p>
                  {event.dressCode ? (
                    <p className="mt-1 flex items-center gap-2 font-body text-sm text-ink/70">
                      <Shirt size={15} className="shrink-0 text-gold" aria-hidden="true" />
                      {event.dressCode}
                    </p>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href={getEventMapsUrl(event)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gold px-4 py-2 font-body text-sm text-maroon transition hover:bg-gold/10"
                    >
                      <MapPin size={15} aria-hidden="true" /> Directions
                    </a>
                    <a
                      href={buildGoogleCalendarUrl(event)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gold px-4 py-2 font-body text-sm text-maroon transition hover:bg-gold/10"
                    >
                      <CalendarPlus size={15} aria-hidden="true" /> Add to Calendar
                    </a>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </ol>
      </Container>
    </Section>
  )
}
