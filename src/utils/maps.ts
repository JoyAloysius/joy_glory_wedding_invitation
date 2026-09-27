/**
 * Builds a Google Maps search URL that works on both mobile (opens the Maps app via
 * universal link) and desktop (opens Google Maps in the browser). Used whenever a
 * venue only has an address rather than a confirmed Maps link.
 */
export function buildMapsSearchUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

import type { WeddingEvent } from '@/data/wedding'

export function getEventMapsUrl(event: Pick<WeddingEvent, 'mapsUrl' | 'address'>): string {
  return event.mapsUrl || buildMapsSearchUrl(event.address)
}
