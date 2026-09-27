import type { WeddingEvent } from '@/data/wedding'
import { resolveZonedDate } from './datetime'

const DEFAULT_DURATION_MS = 2 * 60 * 60 * 1000

function toIcsUtc(dateObj: Date): string {
  return dateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

function escapeIcsText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

/**
 * Builds a single .ics file containing every wedding event. Guests can add all of
 * them to their calendar app in one download. Events without an explicit `endTime`
 * get a 2-hour default duration purely so the calendar entry is valid — this default
 * is never shown as a claimed fact anywhere else on the site.
 */
export function buildIcsContent(events: WeddingEvent[], invitationUrl?: string): string {
  const now = toIcsUtc(new Date())
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Joy and Glory Wedding//Invitation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ]

  for (const event of events) {
    const start = resolveZonedDate(event.date, event.startTime, event.timeZone)
    const end = event.endTime
      ? resolveZonedDate(event.date, event.endTime, event.timeZone)
      : new Date(start.getTime() + DEFAULT_DURATION_MS)

    const descriptionParts = [event.description, invitationUrl].filter(Boolean)

    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.id}@joy-and-glory-wedding`,
      `DTSTAMP:${now}`,
      `DTSTART:${toIcsUtc(start)}`,
      `DTEND:${toIcsUtc(end)}`,
      `SUMMARY:${escapeIcsText(event.name)}`,
      `LOCATION:${escapeIcsText(event.address)}`,
    )
    if (descriptionParts.length > 0) {
      lines.push(`DESCRIPTION:${escapeIcsText(descriptionParts.join(' — '))}`)
    }
    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

/** Triggers a browser download of the generated .ics content. */
export function downloadIcs(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
