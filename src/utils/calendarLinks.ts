import type { WeddingEvent } from '@/data/wedding'
import { resolveZonedDate } from './datetime'

const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000

function toCompactUtc(dateObj: Date): string {
  return dateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

/** Builds an "Add to Google Calendar" link for a single wedding event. */
export function buildGoogleCalendarUrl(event: WeddingEvent): string {
  const start = resolveZonedDate(event.date, event.startTime, event.timeZone)
  const end = event.endTime
    ? resolveZonedDate(event.date, event.endTime, event.timeZone)
    : new Date(start.getTime() + DEFAULT_DURATION_MS)

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.name,
    dates: `${toCompactUtc(start)}/${toCompactUtc(end)}`,
    location: event.address,
    details: event.description ?? `${event.name} — Joy & Glory Wedding Celebrations`,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** Builds an "Add to Outlook Calendar" (outlook.com) compose deep link. */
export function buildOutlookCalendarUrl(event: WeddingEvent): string {
  const start = resolveZonedDate(event.date, event.startTime, event.timeZone)
  const end = event.endTime
    ? resolveZonedDate(event.date, event.endTime, event.timeZone)
    : new Date(start.getTime() + DEFAULT_DURATION_MS)

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.name,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    location: event.address,
    body: event.description ?? `${event.name} — Joy & Glory Wedding Celebrations`,
  })

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}
