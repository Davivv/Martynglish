import { describe, expect, it } from 'vitest'
import type { Story, WordToken } from '../types/story'
import {
  addEntries,
  entriesByStatus,
  listEntries,
  pickColdStartEntries,
  recordAnswer,
  recordWordClick,
  setEntryStatus,
} from './vocabulary'
import { addDays, startOfDay } from './review'
import { loadDaily, loadVocabulary, saveVocabulary } from './storage'

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

describe('schedule', () => {
  const now = new Date(2026, 10, 5, 12).getTime()
  const seed = (extra: object) => {
    const v = recordWordClick({}, tok('cat'), ctx)
    saveVocabulary({ ...v, cat: { ...v.cat, ...extra } })
  }

  it('recordAnswer updates a due card and the daily count', () => {
    seed({})
    recordAnswer('cat', true, now)
    expect(loadVocabulary().cat).toMatchObject({ box: 1, dueAt: addDays(startOfDay(now), 1) })
    expect(loadDaily(now).cards).toBe(1)
  })
  it('recordAnswer leaves a not-due card alone', () => {
    const dueAt = addDays(startOfDay(now), 3)
    seed({ box: 2, dueAt })
    const before = loadDaily(now).cards
    recordAnswer('cat', true, now)
    expect(loadVocabulary().cat).toMatchObject({ box: 2, dueAt })
    expect(loadDaily(now).cards).toBe(before)
  })
  it('tapping a known word resets its schedule, tapping a learning word does not', () => {
    const dueAt = addDays(startOfDay(now), 7)
    const known = setEntryStatus({ cat: { ...recordWordClick({}, tok('cat'), ctx).cat, box: 3, dueAt } }, 'cat', 'known')
    const back = recordWordClick(known, tok('cat'), ctx).cat
    expect(back.box).toBe(0)
    expect(back.dueAt).toBeUndefined()
    const learning = { cat: { ...known.cat, status: 'learning' as const } }
    expect(recordWordClick(learning, tok('cat'), ctx).cat).toMatchObject({ box: 3, dueAt })
  })
})
