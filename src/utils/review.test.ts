import { describe, expect, it } from 'vitest'
import type { VocabEntry } from '../types/vocabulary'
import {
  DAILY_CARD_GOAL,
  REVIEW_INTERVALS_DAYS,
  addDays,
  isDue,
  localDay,
  reviewLabel,
  startOfDay,
  todayQueue,
  withAnswer,
} from './review'

const entry = (key: string, extra: Partial<VocabEntry> = {}): VocabEntry => ({
  key,
  answerPl: key,
  phoneticsPl: key,
  ttsText: key,
  storyId: 's',
  pageNumber: 1,
  sentenceEn: 'x',
  clickCount: 1,
  status: 'learning',
  ...extra,
})
const now = new Date(2026, 10, 5, 15, 30).getTime()
const today = startOfDay(now)

describe('withAnswer', () => {
  it('moves up one box per first-try answer and caps at 4', () => {
    let e = entry('a')
    const boxes: number[] = []
    for (let i = 0; i < 6; i++) {
      e = withAnswer(e, true, now)
      boxes.push(e.box!)
    }
    expect(boxes).toEqual([1, 2, 3, 4, 4, 4])
  })
  it('sets dueAt by the interval of the new box', () => {
    let e = entry('a')
    for (let box = 1; box <= 4; box++) {
      e = withAnswer(e, true, now)
      expect(e.dueAt).toBe(addDays(today, REVIEW_INTERVALS_DAYS[box]))
    }
  })
  it('a mistake sends the card to box 0, due today', () => {
    const e = withAnswer(entry('a', { box: 3 }), false, now)
    expect(e.box).toBe(0)
    expect(e.dueAt).toBe(today)
    expect(isDue(e, now)).toBe(true)
  })
  it('treats a junk box as 0', () => {
    expect(withAnswer(entry('a', { box: Number.NaN }), true, now).box).toBe(1)
  })
})

describe('isDue', () => {
  it('is due when dueAt is missing or junk', () => {
    expect(isDue(entry('a'), now)).toBe(true)
    expect(isDue(entry('a', { dueAt: Number.NaN }), now)).toBe(true)
    expect(isDue(entry('a', { dueAt: Infinity }), now)).toBe(true)
  })
  it('compares with now', () => {
    expect(isDue(entry('a', { dueAt: today }), now)).toBe(true)
    expect(isDue(entry('a', { dueAt: addDays(today, 1) }), now)).toBe(false)
  })
})

describe('dates', () => {
  it('addDays keeps local midnight across DST changes', () => {
    for (const start of [new Date(2026, 2, 28), new Date(2026, 9, 24)]) {
      const next = new Date(addDays(start.getTime(), 3))
      expect([next.getHours(), next.getMinutes()]).toEqual([0, 0])
      expect(next.getDate()).toBe(new Date(start.getFullYear(), start.getMonth(), start.getDate() + 3).getDate())
    }
  })
  it('formats the local day', () => {
    expect(localDay(now)).toBe('2026-11-05')
  })
})

describe('todayQueue', () => {
  it('orders learning before known, lower box, more clicks, then key', () => {
    const vocab = Object.fromEntries(
      [
        entry('k', { status: 'known' }),
        entry('b2', { box: 2 }),
        entry('b0-few'),
        entry('b0-many', { clickCount: 5 }),
        entry('b0-a'),
      ].map((e) => [e.key, e]),
    )
    expect(todayQueue(vocab, 0, now).map((e) => e.key)).toEqual(['b0-many', 'b0-a', 'b0-few', 'b2', 'k'])
  })
  it('includes a due known word and skips not-due ones', () => {
    const vocab = {
      k: entry('k', { status: 'known' }),
      later: entry('later', { dueAt: addDays(today, 2) }),
    }
    expect(todayQueue(vocab, 0, now).map((e) => e.key)).toEqual(['k'])
  })
  it('cuts to the remaining daily goal', () => {
    const vocab = Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`w${i}`, entry(`w${i}`)]))
    expect(todayQueue(vocab, 0, now)).toHaveLength(DAILY_CARD_GOAL)
    expect(todayQueue(vocab, 3, now)).toHaveLength(DAILY_CARD_GOAL - 3)
    expect(todayQueue(vocab, 20, now)).toHaveLength(0)
  })
})

describe('reviewLabel', () => {
  it('says dziś when due and za N dni otherwise', () => {
    expect(reviewLabel(entry('a'), now)).toBe('dziś')
    expect(reviewLabel(entry('a', { dueAt: addDays(today, 1) }), now)).toBe('za 1 dzień')
    expect(reviewLabel(entry('a', { dueAt: addDays(today, 7) }), now)).toBe('za 7 dni')
  })
})
