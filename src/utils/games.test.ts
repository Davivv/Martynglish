import { describe, expect, it } from 'vitest'
import { PICTURE_WORDS, pictureOf } from '../data/wordPictures'
import type { Story, WordToken } from '../types/story'
import type { VocabEntry } from '../types/vocabulary'
import {
  type GameWord,
  buildListeningRound,
  buildMemoryDeck,
  isNextBlock,
  isPair,
  pickMemoryWords,
  pickGameWords,
  pickListeningWords,
  pickSentences,
  shuffleBlocks,
} from './games'

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

const mkPage = (n: number, text: string, count = 4) =>
  ({
    pageNumber: n,
    sentenceEn: text,
    words: Array.from({ length: count }, (_, i) => tok(`w${n}${i}`)),
  }) as unknown as Story['pages'][number]
const sStory = (id: string, pages: Story['pages']): Story => ({ id, pages }) as unknown as Story
const sStories = [
  sStory('a', [mkPage(1, 'A one'), mkPage(2, 'A two', 2), mkPage(3, 'A three', 9), mkPage(4, 'A four', 8)]),
  sStory('b', [mkPage(1, 'B one'), mkPage(2, 'B two'), mkPage(3, 'A one')]),
  sStory('c', [mkPage(1, 'C one', 3)]),
]

describe('pickSentences', () => {
  it('keeps only pages with 3-8 blocks, unique by text', () => {
    const all = pickSentences(sStories, {}, 99, seqRng()).map((p) => p.page.sentenceEn)
    expect(all.sort()).toEqual(['A four', 'A one', 'B one', 'B two', 'C one'])
  })

  it('puts read stories first and pads in story order', () => {
    const picked = pickSentences(sStories, { b: 1 }, 4, seqRng())
    expect(picked.slice(0, 3).every((p) => p.storyId === 'b')).toBe(true)
    expect(picked.map((p) => p.storyId).slice(3)).toEqual(['a'])
    expect(pickSentences(sStories, { b: 1 }, 1, seqRng())[0].storyId).toBe('b')
  })

  it('filters by story', () => {
    const picked = pickSentences(sStories, {}, 10, seqRng(), 'a')
    expect(picked.every((p) => p.storyId === 'a')).toBe(true)
    expect(picked).toHaveLength(2)
  })
})

describe('shuffleBlocks', () => {
  const words = ['a', 'b', 'c', 'd'].map((w) => tok(w))
  const original = (o: number[]) => o.every((v, i) => v === i)

  it('is a permutation and never the original order', () => {
    for (let i = 0; i < 200; i++) {
      const order = shuffleBlocks(words, seqRng())
      expect([...order].sort()).toEqual([0, 1, 2, 3])
      expect(original(shuffleBlocks(words))).toBe(false)
      expect(original(order)).toBe(false)
    }
    expect(original(shuffleBlocks(words, () => 0))).toBe(false)
    expect(original(shuffleBlocks(words.slice(0, 2), () => 0))).toBe(false)
  })

  it('handles identical blocks without hanging', () => {
    const same3 = [tok('go'), tok('Go'), tok('go')]
    expect([...shuffleBlocks(same3)].sort()).toEqual([0, 1, 2])
    expect(shuffleBlocks([tok('x')])).toEqual([0])
  })
})

describe('isNextBlock', () => {
  const words = [tok('I'), tok('see'), tok('i')]
  it('accepts the same text in either slot and ignores case', () => {
    expect(isNextBlock(words, 0, 2)).toBe(true)
    expect(isNextBlock(words, 2, 0)).toBe(true)
    expect(isNextBlock(words, 1, 0)).toBe(false)
  })
})

describe('pickMemoryWords', () => {
  const mStories = [
    {
          id: 'm',
          pages: [
            {
              pageNumber: 1,
              sentenceEn: 'x',
              words: [
                { word: 'little', translationPl: 'mały', phoneticsPl: 'li-tl', isKeyword: true },
                { word: 'small', translationPl: 'mały', phoneticsPl: 'smol', isKeyword: true },
                { word: 'zzz', translationPl: 'chrap', phoneticsPl: 'zzz', isKeyword: true },
                { word: 'sun', translationPl: 'słońce', phoneticsPl: 'san', isKeyword: true },
              ],
            },
          ],
    } as unknown as Story,
  ]

  it('keeps one word per meaning, pictured words first', () => {
    const words = pickMemoryWords({}, mStories, 6, seqRng())
    expect(words).toHaveLength(6)
    expect(new Set(words.map((w) => w.answerPl)).size).toBe(6)
    expect(new Set(words.map((w) => w.key)).size).toBe(6)
    expect(words[0].key).toBe('sun')
  })

  it('pads to count in story mode too', () => {
    const words = pickMemoryWords({}, mStories, 6, seqRng(), 'm')
    expect(words).toHaveLength(6)
    expect(words.filter((w) => w.answerPl === 'mały')).toHaveLength(1)
    expect(new Set(words.map((w) => w.key)).size).toBe(6)
  })
})

describe('buildMemoryDeck', () => {
  const words = ['sun', 'cat', 'red'].map((k) => {
    const w = PICTURE_WORDS.find((p) => p.key === k)!
    return { key: k, answerPl: w.answerPl, phoneticsPl: w.phoneticsPl, ttsText: k }
  })
  const deck = buildMemoryDeck(words, seqRng())

  it('has two unique cards per word', () => {
    expect(deck).toHaveLength(6)
    expect(new Set(deck.map((c) => c.id)).size).toBe(6)
    for (const w of words) expect(deck.filter((c) => c.word.key === w.key).map((c) => c.side).sort()).toEqual(['meaning', 'word'])
  })

  it('puts the picture only on the meaning side', () => {
    for (const c of deck) expect(c.picture !== undefined).toBe(c.side === 'meaning')
  })

  it('isPair needs one word and different sides', () => {
    const [a, b] = deck.filter((c) => c.word.key === 'sun')
    const other = deck.find((c) => c.word.key === 'cat' && c.side !== a.side)!
    expect(isPair(a, b)).toBe(true)
    expect(isPair(a, a)).toBe(false)
    expect(isPair(a, other)).toBe(false)
  })
})

describe('pickMemoryWords priority', () => {
  it('prefers words from the dictionary over words from the stories', () => {
    const many = [story('p', ['sun', 'moon', 'star', 'cat', 'dog', 'flower', 'tree', 'ball', 'apple'])]
    for (let i = 0; i < 30; i++) {
      const keys = pickMemoryWords({ tree: entry('tree', 'learning'), ball: entry('ball', 'known') }, many, 3).map((w) => w.key)
      expect(keys).toContain('tree')
      expect(keys).toContain('ball')
    }
  })
})
