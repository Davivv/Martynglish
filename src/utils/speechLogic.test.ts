import { describe, expect, it } from 'vitest'
import type { WordToken } from '../types/story'
import {
  buildFallbackSchedule,
  buildSentenceText,
  initialKaraoke,
  karaokeOnBoundary,
  karaokeOnTimer,
  pickEnglishVoice,
  tokenIndexAtChar,
  wordSpeechText,
} from './speechLogic'

const tok = (word: string, extra: Partial<WordToken> = {}): WordToken => ({
  word,
  translationPl: 'x',
  phoneticsPl: 'x',
  isKeyword: true,
  ...extra,
})

const sentence = [tok('Dino'), tok('likes'), tok('ice cream', { punctuation: '.' })]

describe('pickEnglishVoice', () => {
  it('returns null without an English voice', () => {
    expect(pickEnglishVoice([{ name: 'Paulina', lang: 'pl-PL' }])).toBeNull()
    expect(pickEnglishVoice([])).toBeNull()
  })
  it('prefers SPEC names over locale', () => {
    const voices = [
      { name: 'Generic', lang: 'en-GB' },
      { name: 'Samantha', lang: 'en-US' },
    ]
    expect(pickEnglishVoice(voices)?.name).toBe('Samantha')
  })
  it('falls back en-GB, en-US, then any en (also with underscore)', () => {
    expect(pickEnglishVoice([{ name: 'a', lang: 'en_AU' }, { name: 'b', lang: 'en_US' }])?.name).toBe('b')
    expect(pickEnglishVoice([{ name: 'a', lang: 'en-US' }, { name: 'b', lang: 'en-GB' }])?.name).toBe('b')
    expect(pickEnglishVoice([{ name: 'a', lang: 'pl-PL' }, { name: 'b', lang: 'en-AU' }])?.name).toBe('b')
  })
})

describe('wordSpeechText', () => {
  it('uses ttsOverride, else lowercase without punctuation', () => {
    expect(wordSpeechText(tok('a', { ttsOverride: 'uh' }))).toBe('uh')
    expect(wordSpeechText(tok('Dino', { punctuation: '.' }))).toBe('dino')
    expect(wordSpeechText(tok('Good night!'))).toBe('good night')
  })
})

describe('charIndex mapping', () => {
  const { text, ranges } = buildSentenceText(sentence)
  it('builds the sentence with punctuation', () => {
    expect(text).toBe('Dino likes ice cream.')
  })
  it('maps charIndex to blocks, a two-word block as a whole', () => {
    expect(tokenIndexAtChar(ranges, 0)).toBe(0)
    expect(tokenIndexAtChar(ranges, 5)).toBe(1)
    expect(tokenIndexAtChar(ranges, 11)).toBe(2)
    expect(tokenIndexAtChar(ranges, 15)).toBe(2) // "cream" belongs to the "ice cream" block
    expect(tokenIndexAtChar(ranges, 99)).toBe(2)
  })
  it('gives -1 before the first block', () => {
    expect(tokenIndexAtChar(ranges, -1)).toBe(-1)
  })
})

describe('fallback schedule', () => {
  it('increases monotonically and a slower rate lengthens it', () => {
    const fast = buildFallbackSchedule(sentence, 1)
    const slow = buildFallbackSchedule(sentence, 0.8)
    expect(fast.offsets[0]).toBe(0)
    expect(fast.offsets[1]).toBeGreaterThan(0)
    expect(fast.offsets[2]).toBeGreaterThan(fast.offsets[1])
    expect(fast.totalMs).toBeGreaterThan(fast.offsets[2])
    expect(slow.totalMs).toBeGreaterThan(fast.totalMs)
  })
})

describe('karaoke state', () => {
  it('timer moves the highlight until a boundary arrives', () => {
    let s = karaokeOnTimer(initialKaraoke, 0)
    expect(s.active).toBe(0)
    s = karaokeOnBoundary(1)
    expect(s).toEqual({ active: 1, boundarySeen: true })
    expect(karaokeOnTimer(s, 2).active).toBe(1) // timer no longer races onboundary
  })
})
