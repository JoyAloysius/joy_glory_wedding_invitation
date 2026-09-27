import { useEffect, useState } from 'react'
import { resolveZonedDate } from '@/utils/datetime'

export interface CountdownValue {
  days: number
  hours: number
  minutes: number
  seconds: number
  isComplete: boolean
}

function computeCountdown(target: Date): CountdownValue {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true }
  }
  const totalSeconds = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isComplete: false,
  }
}

/** Ticks every second toward the given zoned date/time and clamps at zero — never negative. */
export function useCountdown(date: string, time: string, timeZone: string): CountdownValue {
  const targetMs = resolveZonedDate(date, time, timeZone).getTime()
  const [state, setState] = useState(() => ({ targetMs, value: computeCountdown(new Date(targetMs)) }))

  // If the target ever changes (e.g. different props), re-derive synchronously during
  // render rather than via an effect, so there's no stale extra render in between.
  const value = state.targetMs === targetMs ? state.value : computeCountdown(new Date(targetMs))
  if (state.targetMs !== targetMs) {
    setState({ targetMs, value })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        const next = computeCountdown(new Date(prev.targetMs))
        if (next.isComplete) clearInterval(interval)
        return { targetMs: prev.targetMs, value: next }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [targetMs])

  return value
}
