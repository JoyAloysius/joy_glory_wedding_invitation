let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    const AudioContextCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextCtor) return null
    if (!audioCtx) audioCtx = new AudioContextCtor()
    if (audioCtx.state === 'suspended') void audioCtx.resume()
    return audioCtx
  } catch {
    return null
  }
}

/** A soft two-note chime for the wax seal breaking open, synthesized with the
 * Web Audio API so there's no audio file to source, license, or ship. Fails
 * silently if the API is unavailable or blocked — sound is a nice-to-have and
 * must never block the actual opening. */
export function playSealChime() {
  const ctx = getAudioContext()
  if (!ctx) return
  try {
    const now = ctx.currentTime
    const notes: Array<{ frequency: number; start: number; duration: number; peak: number }> = [
      { frequency: 880, start: 0, duration: 0.4, peak: 0.16 },
      { frequency: 1318.5, start: 0.1, duration: 0.45, peak: 0.13 },
    ]
    for (const { frequency, start, duration, peak } of notes) {
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0, now + start)
      gain.gain.linearRampToValueAtTime(peak, now + start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration)
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.start(now + start)
      oscillator.stop(now + start + duration + 0.05)
    }
  } catch {
    // Ignore — never let a sound glitch block the invitation from opening.
  }
}
