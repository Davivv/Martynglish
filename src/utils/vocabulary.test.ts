import { describe, expect, it } from 'vitest'
import type { Story, WordToken } from '../types/story'
import {
  addEntries,
  entriesByStatus,
  listEntries,
  pickColdStartEntries,
  recordWordClick,
  setEntryStatus,
} from './vocabulary'

const tok = (word: string, extra: Partial<WordToken> = {}): WordToken => ({
  word,
  translationPl: `${word}-pl`,
  phoneticsPl: `${word}-ph`,
  isKeyword: true,
  ...extra,
})
const ctx = { storyId: 's', pageNumber: 1, sentenceEn: 'Sentence.' }

describe('recordWordClick', () => {
  it('saves a keyword with clickCount 1 under its lemma key', () => {
    const star = tok('stars', { lemmaEn: 'star', lemmaPl: 'gwiazda', lemmaPhoneticsPl: 'star-ph' })
    const v = recordWordClick({}, star, ctx)
    expect(v.star).toMatchObject({
      answerPl: 'gwiazda',
      phoneticsPl: 'star-ph',
      clickCount: 1,
      status: 'learning',
      ttsText: 'star',
    })
  })
  it('counts clicks and merges forms of one lemma', () => {
    let v = recordWordClick({}, tok('star', { lemmaEn: 'star' }), ctx)
    v = recordWordClick(v, tok('Stars', { lemmaEn: 'star' }), ctx)
    expect(Object.keys(v)).toEqual(['star'])
    expect(v.star.clickCount).toBe(2)
  })
  it('returns a known word to learning on click', () => {
    let v = recordWordClick({}, tok('cat'), ctx)
    v = setEntryStatus(v, 'cat', 'known')
    expect(v.cat.status).toBe('known')
    v = recordWordClick(v, tok('cat'), ctx)
    expect(v.cat.status).toBe('learning')
  })
  it('ignores function words unless forced', () => {
    const the = tok('the', { isKeyword: false })
    expect(recordWordClick({}, the, ctx)).toEqual({})
    expect(recordWordClick({}, the, ctx, true).the.clickCount).toBe(1)
  })
  it('does not mutate the input', () => {
    const v = {}
    recordWordClick(v, tok('cat'), ctx)
    expect(v).toEqual({})
  })
})

describe('lists', () => {
  it('sorts by clickCount descending and filters by status', () => {
    let v = recordWordClick({}, tok('cat'), ctx)
    v = recordWordClick(v, tok('dog'), ctx)
    v = recordWordClick(v, tok('dog'), ctx)
    v = setEntryStatus(v, 'cat', 'known')
    expect(listEntries(v).map((e) => e.key)).toEqual(['dog', 'cat'])
    expect(entriesByStatus(v, 'known').map((e) => e.key)).toEqual(['cat'])
    expect(setEntryStatus(v, 'nope', 'known')).toBe(v)
  })
})

describe('cold start', () => {
  const story = {
    id: 'x',
    pages: [
      { pageNumber: 1, sentenceEn: 'A cat.', words: [tok('a', { isKeyword: false }), tok('cat'), tok('big')] },
      { pageNumber: 2, sentenceEn: 'Cat runs.', words: [tok('Cat'), tok('runs'), tok('home'), tok('red')] },
    ],
  } as unknown as Story
  it('picks distinct keywords in order, up to the count', () => {
    expect(pickColdStartEntries([story], {}, 4).map((e) => e.key)).toEqual(['cat', 'big', 'runs', 'home'])
  })
  it('skips saved words and adds without overwriting', () => {
    const existing = recordWordClick({}, tok('cat'), ctx)
    const picked = pickColdStartEntries([story], existing, 2)
    expect(picked.map((e) => e.key)).toEqual(['big', 'runs'])
    const merged = addEntries(existing, [...picked, { ...existing.cat, clickCount: 99 }])
    expect(merged.cat.clickCount).toBe(1)
    expect(picked[0].clickCount).toBe(0)
  })
})

describe('ttsText', () => {
  it('reads the dictionary form, not the inflected word', () => {
    expect(recordWordClick({}, tok('sees', { lemmaEn: 'see' }), ctx).see.ttsText).toBe('see')
    expect(recordWordClick({}, tok('a', { isKeyword: false, ttsOverride: 'uh' }), ctx, true).a.ttsText).toBe('uh')
  })
})
