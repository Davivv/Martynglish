import { describe, expect, it } from 'vitest'
import { PICTURE_WORDS, pictureOf } from '../data/wordPictures'
import type { Story, WordToken } from '../types/story'
import type { VocabEntry } from '../types/vocabulary'
import { type GameWord, buildListeningRound, pickGameWords, pickListeningWords } from './games'

const tok = (word: string, isKeyword = true): WordToken => ({
  word,
  translationPl: `${word}-pl`,
  phoneticsPl: `${word}-ph`,
  isKeyword,
})
const story = (id: string, words: string[]): Story =>
  ({
    id,
    pages: words.map((w, i) => ({ pageNumber: i + 1, sentenceEn: w, words: [tok(w), tok('the', false)] })),
  }) as unknown as Story
const entry = (key: string, status: 'learning' | 'known'): VocabEntry => ({
  key,
  answerPl: `${key}-pl`,
  phoneticsPl: `${key}-ph`,
  ttsText: key,
  storyId: 's',
  pageNumber: 1,
  sentenceEn: key,
  clickCount: 1,
  status,
})

const stories = [story('a', ['cat', 'dog', 'sun']), story('b', ['moon', 'cat', 'star'])]
const seqRng = () => {
  let s = 7
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

describe('pickGameWords', () => {
  it('uses only the keywords of the chosen story', () => {
    const words = pickGameWords({}, stories, 10, seqRng(), 'b')
    expect(words.map((w) => w.key).sort()).toEqual(['cat', 'moon', 'star'])
    expect(pickGameWords({}, stories, 2, seqRng(), 'a')).toHaveLength(2)
  })

  it('takes learning words before known ones, then pads from the stories', () => {
    const vocab = { k1: entry('k1', 'known'), l1: entry('l1', 'learning'), l2: entry('l2', 'learning') }
    const firstTwo = pickGameWords(vocab, stories, 2, seqRng()).map((w) => w.key)
    expect(firstTwo.sort()).toEqual(['l1', 'l2'])
    const four = pickGameWords(vocab, stories, 4, seqRng()).map((w) => w.key)
    expect(four.slice(0, 3).sort()).toEqual(['k1', 'l1', 'l2'].sort().filter(Boolean))
    expect(four[3]).toBe('cat')
  })

  it('pads in reading order, skips words already chosen and stays unique', () => {
    const vocab = { dog: entry('dog', 'learning') }
    const keys = pickGameWords(vocab, stories, 5, seqRng()).map((w) => w.key)
    expect(keys).toEqual(['dog', 'cat', 'sun', 'moon', 'star'])
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('does not mutate its input', () => {
    const vocab = { l1: entry('l1', 'learning') }
    const before = JSON.stringify([vocab, stories])
    pickGameWords(vocab, stories, 6, seqRng())
    pickGameWords(vocab, stories, 6, seqRng(), 'a')
    expect(JSON.stringify([vocab, stories])).toBe(before)
  })
})

const wordOf = (key: string): GameWord => {
  const w = PICTURE_WORDS.find((p) => p.key === key)!
  return { key, answerPl: w.answerPl, phoneticsPl: w.phoneticsPl, ttsText: key }
}
const groupOf = (kind: string) => (kind === 'prop' || kind === 'character' ? 'thing' : kind)

describe('buildListeningRound', () => {
  it('has one correct option and 3 distinct meanings', () => {
    for (let i = 0; i < 100; i++) {
      for (const w of PICTURE_WORDS) {
        const round = buildListeningRound(wordOf(w.key), [])
        expect(round).toHaveLength(3)
        expect(round.filter((o) => o.correct)).toHaveLength(1)
        expect(new Set(round.map((o) => o.answerPl)).size).toBe(3)
        expect(round.find((o) => o.correct)?.answerPl).toBe(w.answerPl)
      }
    }
  })

  it('keeps distractors in the same picture group', () => {
    for (let i = 0; i < 50; i++) {
      for (const w of PICTURE_WORDS) {
        const round = buildListeningRound(wordOf(w.key), [])
        for (const o of round) expect(groupOf(o.picture!.kind)).toBe(groupOf(w.picture.kind))
      }
    }
    expect(pictureOf('red')?.kind).toBe('color')
  })

  it('gives text options to a word without a picture', () => {
    const word: GameWord = { key: 'window', answerPl: 'okno', phoneticsPl: 'łin-dou', ttsText: 'window' }
    const round = buildListeningRound(word, ['dom', 'stół'])
    expect(round).toHaveLength(3)
    expect(round.every((o) => o.picture === undefined)).toBe(true)
    expect(round.filter((o) => o.correct).map((o) => o.answerPl)).toEqual(['okno'])
  })
})

describe('pickListeningWords', () => {
  const mixed = [story('m', ['little', 'warm', 'sun', 'moon', 'star'])]
  it('takes words with a picture before words without one', () => {
    for (let i = 0; i < 30; i++) {
      const keys = pickListeningWords({ little: entry('little', 'learning') }, mixed, 3).map((w) => w.key)
      expect(keys.sort()).toEqual(['moon', 'star', 'sun'])
    }
  })
  it('uses words without a picture only when pictures run out', () => {
    const keys = pickListeningWords({}, mixed, 4).map((w) => w.key)
    expect(keys).toHaveLength(4)
    expect(keys.filter((k) => !pictureOf(k))).toHaveLength(1)
  })
  it('respects the story filter', () => {
    const keys = pickListeningWords({}, [...mixed, story('z', ['dog'])], 6, Math.random, 'z').map((w) => w.key)
    expect(keys).toEqual(['dog'])
  })
})
