import { useState } from 'react'

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number
}

function detectLowPowerDevice(): boolean {
  if (typeof navigator === 'undefined') return false
  const cores = navigator.hardwareConcurrency ?? 8
  const memory = (navigator as NavigatorWithMemory).deviceMemory ?? 8
  return cores <= 4 || memory <= 4
}

/** Coarse, one-time heuristic used to scale back decorative particle counts on
 * lower-powered devices (spec: "reduced animation on smaller/lower-performance
 * devices"). Not reactive — device capability doesn't change mid-session. */
export function useLowPowerMode(): boolean {
  const [lowPower] = useState(detectLowPowerDevice)
  return lowPower
}
