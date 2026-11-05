import { describe, expect, it } from 'vitest'
import { isVocabEntry, loadDaily, loadQuizDirection, saveDaily, saveProgress, saveQuizDirection, saveVocabulary, STORAGE_KEYS } from './storage'
import { resetAllProgress } from './vocabulary'

describe('quiz direction setting', () => {
  it('defaults to answer-pl and round-trips', () => {
    expect(loadQuizDirection()).toBe('answer-pl')
    saveQuizDirection('answer-en')
    expect(loadQuizDirection()).toBe('answer-en')
    saveQuizDirection('answer-pl')
    expect(loadQuizDirection()).toBe('answer-pl')
  })
  it('falls back to answer-pl on junk', () => {
    const junk = { getItem: () => '{"x":', setItem: () => {}, removeItem: () => {} }
    ;(globalThis as { window?: unknown }).window = { localStorage: junk }
    try {
      expect(STORAGE_KEYS.quizDirection).toContain('quiz-direction')
      expect(loadQuizDirection()).toBe('answer-pl')
    } finally {
      delete (globalThis as { window?: unknown }).window
    }
  })
  it('survives resetAllProgress', () => {
    saveQuizDirection('answer-en')
    saveProgress({ a: 1 })
    saveVocabulary({})
    resetAllProgress()
    expect(loadQuizDirection()).toBe('answer-en')
    saveQuizDirection('answer-pl')
  })
})

describe('daily counter', () => {
  const now = new Date(2026, 10, 5, 12).getTime()
  it('round-trips within a day and is fresh on another day', () => {
    saveDaily({ day: '2026-11-05', cards: 3 })
    expect(loadDaily(now).cards).toBe(3)
    expect(loadDaily(now + 2 * 86_400_000)).toEqual({ day: '2026-11-07', cards: 0 })
  })
  it('is fresh for junk data', () => {
    const junk = { getItem: () => '{"day":', setItem: () => {}, removeItem: () => {} }
    ;(globalThis as { window?: unknown }).window = { localStorage: junk }
    try {
      expect(loadDaily(now)).toEqual({ day: '2026-11-05', cards: 0 })
    } finally {
      delete (globalThis as { window?: unknown }).window
    }
  })
  it('is cleared by resetAllProgress', () => {
    saveDaily({ day: '2026-11-05', cards: 5 })
    resetAllProgress()
    expect(loadDaily(now).cards).toBe(0)
  })
  it('still accepts old entries without schedule fields', () => {
    const old = { key: 'a', answerPl: 'a', phoneticsPl: 'a', ttsText: 'a', storyId: 's', pageNumber: 1, sentenceEn: 'x', clickCount: 1, status: 'learning' }
    expect(isVocabEntry(old)).toBe(true)
    expect(isVocabEntry({ ...old, box: 2, dueAt: 5 })).toBe(true)
  })
})
