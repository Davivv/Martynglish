import { describe, expect, it } from 'vitest'
import type { VocabEntry } from '../types/vocabulary'
import { buildQuizOptions, fallbackDistractors, pickNextCard } from './quiz'

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
