import { Heart } from 'lucide-react'

interface MonthCalendarProps {
  year: number
  /** 1-12 */
  month: number
  highlightedDays?: number[]
  className?: string
}

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** A real, accurate month grid (day-of-week alignment computed from the actual
 * calendar, not hand-typed) with selected days marked by a heart — e.g. for Save
 * the Date. Styled like a modern calendar-app widget: its own month/year header,
 * generous spacing, and a wide rectangular layout rather than a cramped square. */
export function MonthCalendar({ year, month, highlightedDays = [], className = '' }: MonthCalendarProps) {
  const firstWeekday = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const cells: Array<number | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div
      className={`w-full max-w-2xl rounded-3xl border border-gold-light/25 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.4)] backdrop-blur-md sm:p-8 ${className}`}
    >
      <div className="mb-5 flex items-center justify-center gap-3 sm:mb-7">
        <span className="h-px w-8 bg-gold-light/40 sm:w-12" aria-hidden="true" />
        <h3 className="font-display text-xl tracking-wide text-ivory sm:text-2xl">{monthLabel}</h3>
        <span className="h-px w-8 bg-gold-light/40 sm:w-12" aria-hidden="true" />
      </div>

      <div className="grid grid-cols-7 gap-x-1 gap-y-2 sm:gap-x-2 sm:gap-y-3">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="flex h-7 items-center justify-center font-body text-[11px] font-semibold uppercase tracking-widest text-gold-light/75 sm:h-8 sm:text-xs"
          >
            {label}
          </div>
        ))}
        {cells.map((day, index) => {
          const isHighlighted = day !== null && highlightedDays.includes(day)
          return (
            <div key={index} className="flex h-11 items-center justify-center sm:h-14">
              {day ? (
                isHighlighted ? (
                  <span className="relative flex h-10 w-11 items-center justify-center sm:h-12 sm:w-14">
                    <Heart
                      className="absolute inset-0 h-full w-full text-gold-light drop-shadow-[0_0_12px_rgba(228,200,120,0.8)]"
                      fill="currentColor"
                      strokeWidth={0}
                      aria-hidden="true"
                    />
                    <span className="relative -translate-y-0.5 font-display text-sm font-bold text-maroon-dark sm:text-base">
                      {day}
                    </span>
                  </span>
                ) : (
                  <span className="font-body text-base text-ivory/70 sm:text-lg">{day}</span>
                )
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
