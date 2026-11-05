// Pure speech logic (D19): voice choice, text for the synthesizer, charIndex -> block mapping
// and the fallback karaoke timer. No DOM here, so it is easy to test.
import type { WordToken } from '../types/story'

export interface VoiceLike {
  name: string
  lang: string
}

/** Names from SPEC 4 in priority order. */
const PREFERRED_NAMES = ['Google UK English Female', 'Samantha', 'Daniel', 'Aria']

const normLang = (lang: string) => lang.replace('_', '-').toLowerCase()

/** English voice by D19: SPEC names, then en-GB, en-US, any en*. Never a non-English voice. */
export function pickEnglishVoice<T extends VoiceLike>(voices: readonly T[]): T | null {
  const english = voices.filter((v) => normLang(v.lang).startsWith('en'))
  if (english.length === 0) return null
  for (const name of PREFERRED_NAMES) {
    const found = english.find((v) => v.name.includes(name))
    if (found) return found
  }
  return (
    english.find((v) => normLang(v.lang) === 'en-gb') ??
    english.find((v) => normLang(v.lang) === 'en-us') ??
    english[0]
  )
}

/** A single word as the synthesizer should say it: `ttsOverride`, else lowercase without punctuation. */
export function wordSpeechText(token: WordToken): string {
  if (token.ttsOverride) return token.ttsOverride
  return token.word.toLowerCase().replace(/[.,!?;:"“”]/g, '').trim()
}

export interface CharRange {
  start: number
  end: number
}

/** Whole sentence text (words with their punctuation) and the character range of each block. */
export function buildSentenceText(tokens: readonly WordToken[]): { text: string; ranges: CharRange[] } {
  let text = ''
  const ranges: CharRange[] = []
  tokens.forEach((token, i) => {
    if (i > 0) text += ' '
    const start = text.length
    text += token.word
    const end = text.length
    text += token.punctuation ?? ''
    ranges.push({ start, end })
  })
  return { text, ranges }
}

/** Index of the block spoken at `charIndex`: the last block that starts at or before it. -1 before the first. */
export function tokenIndexAtChar(ranges: readonly CharRange[], charIndex: number): number {
  let found = -1
  for (let i = 0; i < ranges.length; i++) {
    if (ranges[i].start <= charIndex) found = i
    else break
  }
  return found
}

/** Rough speaking time of one block in ms at the given rate. */
export function estimateWordMs(token: WordToken, rate: number): number {
  const letters = token.word.replace(/\s/g, '').length
  const pause = token.punctuation ? 250 : 0
  return Math.round((220 + letters * 85) / rate) + pause
}

/** Start offsets (ms after speech starts) of each block, plus the total duration. */
export function buildFallbackSchedule(
  tokens: readonly WordToken[],
  rate: number,
): { offsets: number[]; totalMs: number } {
  const offsets: number[] = []
  let at = 0
  for (const token of tokens) {
    offsets.push(at)
    at += estimateWordMs(token, rate)
  }
  return { offsets, totalMs: at }
}

/**
 * Karaoke state. Real `onboundary` events win: after the first one the fallback timer is
 * switched off, so the two sources never race each other.
 */
export interface KaraokeState {
  active: number
  boundarySeen: boolean
}

export const initialKaraoke: KaraokeState = { active: -1, boundarySeen: false }

export function karaokeOnBoundary(index: number): KaraokeState {
  return { active: index, boundarySeen: true }
}

/** Timer tick: ignored once boundary events have been seen. */
export function karaokeOnTimer(state: KaraokeState, index: number): KaraokeState {
  return state.boundarySeen ? state : { ...state, active: index }
}
