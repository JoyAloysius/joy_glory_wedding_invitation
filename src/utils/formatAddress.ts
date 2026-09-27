import type { WeddingEvent } from '@/data/wedding'

/**
 * The `address` field is intentionally the full, specific string used for map/QR
 * lookups (including the venue name, which yields far more accurate geocoding).
 * For on-screen display next to the venue name heading, strip that duplicate prefix.
 */
export function displayAddress(event: Pick<WeddingEvent, 'address' | 'venueName'>): string {
  if (event.address.startsWith(event.venueName)) {
    return event.address.slice(event.venueName.length).replace(/^[,\s]+/, '')
  }
  return event.address
}
