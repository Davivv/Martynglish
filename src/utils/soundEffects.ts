// File-free sound effects on Web Audio oscillators (SPEC 4).
// The AudioContext is created and resumed inside tap handlers (Android autoplay rules).

let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      ctx = new Ctor()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

interface Tone {
  freq: number
  /** Start offset in seconds. */
  at: number
  duration: number
  type?: OscillatorType
  volume?: number
  /** Optional glide target in Hz. */
  freqTo?: number
}

function playTones(tones: Tone[]): void {
  const audio = getContext()
  if (!audio) return
  const now = audio.currentTime
  for (const tone of tones) {
    const osc = audio.createOscillator()
    const gain = audio.createGain()
    const start = now + tone.at
    const end = start + tone.duration
    osc.type = tone.type ?? 'sine'
    osc.frequency.setValueAtTime(tone.freq, start)
    if (tone.freqTo) osc.frequency.exponentialRampToValueAtTime(tone.freqTo, end)
    const peak = tone.volume ?? 0.2
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, end)
    osc.connect(gain).connect(audio.destination)
    osc.start(start)
    osc.stop(end + 0.02)
  }
}

/** Soft pop on a block tap. */
export function playPop(): void {
  playTones([{ freq: 520, freqTo: 880, at: 0, duration: 0.09, volume: 0.22 }])
}

/** Happy major triad for a correct answer. */
export function playSuccess(): void {
  playTones([
    { freq: 523.25, at: 0, duration: 0.18 },
    { freq: 659.25, at: 0.12, duration: 0.18 },
    { freq: 783.99, at: 0.24, duration: 0.32 },
  ])
}

/** Low, gentle buzz for a wrong answer. */
export function playError(): void {
  playTones([{ freq: 220, freqTo: 160, at: 0, duration: 0.28, type: 'triangle', volume: 0.18 }])
}

/** Fanfare for finishing a story. */
export function playFanfare(): void {
  playTones([
    { freq: 392, at: 0, duration: 0.14, type: 'triangle' },
    { freq: 392, at: 0.16, duration: 0.14, type: 'triangle' },
    { freq: 523.25, at: 0.32, duration: 0.18, type: 'triangle' },
    { freq: 659.25, at: 0.5, duration: 0.18, type: 'triangle' },
    { freq: 783.99, at: 0.68, duration: 0.5, type: 'triangle', volume: 0.25 },
    { freq: 1046.5, at: 0.68, duration: 0.5, type: 'sine', volume: 0.12 },
  ])
}
