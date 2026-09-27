import { useEffect, useRef, useState } from 'react'
import { MapPin, Copy, Check } from 'lucide-react'
import { Section } from '@/components/Section'
import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import { Reveal } from '@/components/Reveal'
import { Button } from '@/components/Button'
import { wedding, type WeddingEvent } from '@/data/wedding'
import { getEventMapsUrl } from '@/utils/maps'
import { displayAddress } from '@/utils/formatAddress'
import { asset } from '@/utils/asset'

function CopyAddressButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be denied by the browser; the address remains visible
      // on screen so the guest can still select and copy it manually.
    }
  }

  return (
    <Button variant="secondary" onClick={handleCopy} icon={copied ? <Check size={16} /> : <Copy size={16} />}>
      {copied ? 'Copied!' : 'Copy Address'}
    </Button>
  )
}

function VenueCard({ event, index }: { event: WeddingEvent; index: number }) {
  const mapsUrl = getEventMapsUrl(event)
  const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(event.address)}&output=embed`

  return (
    <Reveal delay={index * 0.1}>
      <div className="grid gap-0 overflow-hidden rounded-3xl bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift md:grid-cols-5">
        <div className="relative h-56 bg-ivory-dark md:col-span-3 md:h-full">
          <iframe
            src={embedSrc}
            title={`Map showing ${event.venueName}`}
            loading="lazy"
            className="h-full w-full border-0"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="flex flex-col gap-4 p-6 md:col-span-2 md:p-8">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            {event.name}
          </span>
          <h3 className="font-display text-2xl text-maroon">{event.venueName}</h3>
          <p className="flex items-start gap-2 font-body text-sm text-ink/70">
            <MapPin size={16} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
            {displayAddress(event)}
          </p>
          <p className="font-body text-xs text-ink/50">
            If the map above doesn&rsquo;t load, use the button below to open directions instead.
          </p>

          <div className="mt-1 flex flex-wrap gap-3">
            <Button href={mapsUrl} target="_blank" rel="noreferrer" icon={<MapPin size={16} />}>
              Navigate to Venue
            </Button>
            <CopyAddressButton address={event.address} />
          </div>

          {event.qrImage ? (
            <div className="mt-3 flex flex-col items-center gap-2 border-t border-gold/20 pt-5 text-center">
              <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink/60">
                Scan for Directions
              </span>
              <img
                src={asset(event.qrImage)}
                alt={`QR code linking to directions for ${event.venueName}`}
                width={480}
                height={480}
                loading="lazy"
                className="w-44 sm:w-52"
              />
            </div>
          ) : null}
        </div>
      </div>
    </Reveal>
  )
}

export function Venue() {
  return (
    <Section id="venue" tone="ivory" ariaLabel="Venues and directions">
      <Container className="max-w-4xl">
        <SectionHeading eyebrow="Find Your Way" title="Venues &amp; Directions" />

        <div className="mt-14 flex flex-col gap-8">
          {wedding.events.map((event, index) => (
            <VenueCard key={event.id} event={event} index={index} />
          ))}
        </div>
      </Container>
    </Section>
  )
}
