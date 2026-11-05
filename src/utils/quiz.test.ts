import { describe, expect, it } from 'vitest'
import type { VocabEntry } from '../types/vocabulary'
import stories from '../data/stories.json'
import type { Story } from '../types/story'
import { buildEnglishOptions, buildQuizOptions, fallbackDistractors, fallbackPairs, pickNextCard } from './quiz'
import { findPhoneticProblem } from './storyGuardianCore.mjs'
import { flashcardOf } from './storyGuardian'

const lower = (xs: string[]) => xs.map((x) => x.toLowerCase())

describe('buildQuizOptions', () => {
  it('returns 3 distinct options including the correct one', () => {
    for (let i = 0; i < 50; i++) {
      const opts = buildQuizOptions('kot', ['pies', 'dom'])
      expect(opts).toHaveLength(3)
      expect(new Set(lower(opts)).size).toBe(3)
      expect(opts).toContain('kot')
    }
  })
  it('never repeats the correct answer, ignoring case', () => {
    for (let i = 0; i < 50; i++) {
      const opts = buildQuizOptions('Kot', ['kot', 'KOT', 'pies'])
      expect(lower(opts).filter((o) => o === 'kot')).toHaveLength(1)
      expect(opts).toHaveLength(3)
    }
  })
  it('fills from fallback when the pool is empty', () => {
    const opts = buildQuizOptions('duży', [])
    expect(opts).toHaveLength(3)
    expect(opts.filter((o) => o !== 'duży').every((o) => fallbackDistractors.includes(o))).toBe(true)
  })
  it('skips a fallback word equal to the answer', () => {
    for (let i = 0; i < 50; i++) {
      expect(lower(buildQuizOptions('Pies', [])).filter((o) => o === 'pies')).toHaveLength(1)
    }
  })
})

describe('pickNextCard', () => {
  const entry = (key: string) => ({ key }) as VocabEntry
  it('handles empty and single lists', () => {
    expect(pickNextCard([], null)).toBeNull()
    expect(pickNextCard([entry('a')], 'a')?.key).toBe('a')
  })
  it('avoids the previous card', () => {
    for (let i = 0; i < 30; i++) expect(pickNextCard([entry('a'), entry('b')], 'a')?.key).toBe('b')
  })
})

describe('fallbackDistractors', () => {
  it('has no near-synonyms of real answers', () => {
    for (const w of ['kot', 'pies', 'szczęśliwy', 'biegnie', 'śpi']) expect(fallbackDistractors).not.toContain(w)
  })
})

const vocabEntry = (key: string, answerPl: string, phoneticsPl = `${key}-ph`, ttsText = key): VocabEntry => ({
  key,
  answerPl,
  phoneticsPl,
  ttsText,
  storyId: 's',
  pageNumber: 1,
  sentenceEn: `${key}.`,
  clickCount: 1,
  status: 'learning',
})

describe('buildEnglishOptions', () => {
  const labels = (opts: { label: string }[]) => opts.map((o) => o.label)

  it('returns 3 distinct options including the correct one with its phonetics and ttsText', () => {
    const uh = vocabEntry('uh', 'o', 'a', 'uh')
    const pool = [vocabEntry('cat', 'kot'), vocabEntry('dog', 'pies')]
    for (let i = 0; i < 50; i++) {
      const opts = buildEnglishOptions(uh, pool)
      expect(opts).toHaveLength(3)
      expect(new Set(lower(labels(opts))).size).toBe(3)
      expect(opts).toContainEqual({ label: 'uh', phoneticsPl: 'a', ttsText: 'uh' })
    }
  })
  it('never offers a word with the same Polish meaning, from the pool or the fallback', () => {
    const little = vocabEntry('little', 'mały')
    const withPool = [vocabEntry('small', 'mały'), vocabEntry('cat', 'kot'), vocabEntry('dog', 'pies')]
    for (let i = 0; i < 100; i++) {
      expect(labels(buildEnglishOptions(little, withPool))).not.toContain('small')
      expect(labels(buildEnglishOptions(little, []))).not.toContain('small')
    }
  })
  it('fills from the fallback list when the pool is empty', () => {
    const opts = buildEnglishOptions(vocabEntry('cat', 'kot'), [])
    expect(opts).toHaveLength(3)
    for (const o of opts.filter((x) => x.label !== 'cat')) {
      expect(fallbackPairs.some((p) => p.en === o.label && p.phoneticsPl === o.phoneticsPl)).toBe(true)
      expect(o.ttsText).toBe(o.label)
    }
  })
  it('does not duplicate a word shared by the pool and the fallback', () => {
    const pool = [vocabEntry('sun', 'słońce')]
    for (let i = 0; i < 100; i++) {
      expect(labels(buildEnglishOptions(vocabEntry('cat', 'kot'), pool)).filter((l) => l === 'sun').length).toBeLessThanOrEqual(1)
    }
  })
})

describe('fallbackPairs', () => {
  it('keeps the 23 Polish words as fallbackDistractors', () => {
    expect(fallbackDistractors).toHaveLength(23)
    expect(fallbackDistractors).toEqual(fallbackPairs.map((p) => p.pl))
  })
  it('has phonetics that pass the Guardian rules', () => {
    for (const p of fallbackPairs) expect(findPhoneticProblem(p.phoneticsPl), p.en).toBeNull()
  })
  it('agrees with the stories on words that are also cards', () => {
    const cards = new Map<string, { answerPl: string; phoneticsPl: string }>()
    for (const story of stories as unknown as Story[])
      for (const page of story.pages) for (const token of page.words) cards.set(flashcardOf(token).key, flashcardOf(token))
    for (const p of fallbackPairs) {
      const card = cards.get(p.en)
      if (!card) continue
      expect(card.phoneticsPl, p.en).toBe(p.phoneticsPl)
      expect(card.answerPl, p.en).toBe(p.pl)
    }
  })
})
