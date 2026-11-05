import { describe, expect, it } from 'vitest'
import { loadQuizDirection, saveProgress, saveQuizDirection, saveVocabulary, STORAGE_KEYS } from './storage'
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
