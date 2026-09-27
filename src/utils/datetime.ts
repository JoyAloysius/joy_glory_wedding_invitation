/**
 * Fixed UTC offsets for the time zones this project needs. India (Asia/Kolkata) has
 * used a constant +05:30 offset year-round with no daylight saving since 1945, so a
 * small lookup table is sufficient here and avoids pulling in a full timezone library.
 */
const FIXED_OFFSETS: Record<string, string> = {
  'Asia/Kolkata': '+05:30',
}

/** Resolves "YYYY-MM-DD" + "HH:mm" + IANA zone into a real, timezone-correct Date. */
export function resolveZonedDate(date: string, time: string, timeZone: string): Date {
  const offset = FIXED_OFFSETS[timeZone] ?? '+00:00'
  return new Date(`${date}T${time}:00${offset}`)
}

export function formatEventDateTime(date: string, time: string, timeZone: string): string {
  const zoned = resolveZonedDate(date, time, timeZone)
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).format(zoned)
}

export function formatEventDate(date: string, time: string, timeZone: string): string {
  const zoned = resolveZonedDate(date, time, timeZone)
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(zoned)
}

export function formatEventTime(date: string, time: string, timeZone: string): string {
  const zoned = resolveZonedDate(date, time, timeZone)
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone,
  }).format(zoned)
}
