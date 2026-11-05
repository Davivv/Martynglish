import { beforeEach, describe, expect, it } from 'vitest'
import type { VocabEntry } from '../types/vocabulary'
import { STICKER_WORDS, claimSticker, markGamePlayed, markStoryRead, missionState, nextSticker } from './mission'
import { DAILY_CARD_GOAL } from './review'
import {
  STORAGE_KEYS,
  clearDaily,
  loadDaily,
  loadStickers,
  saveDaily,
  saveStickers,
  saveVocabulary,
} from './storage'
import { resetAllProgress } from './vocabulary'

const now = new Date(2026, 10, 5, 12).getTime()
const tomorrow = now + 86_400_000
const day = '2026-11-05'

const entry = (key: string, extra: Partial<VocabEntry> = {}): VocabEntry => ({
  key,
  answerPl: key,
  phoneticsPl: key,
  ttsText: key,
  storyId: 's',
  pageNumber: 1,
  sentenceEn: key,
  clickCount: 1,
  status: 'learning',
  ...extra,
})
const dueVocab = { cat: entry('cat') }
const nothingDue = { cat: entry('cat', { status: 'known', box: 2, dueAt: now + 5 * 86_400_000 }) }

describe('missionState', () => {
  it('does not count cards for an empty dictionary', () => {
    expect(missionState({ day, cards: 0 }, {}, now).cards).toBe(false)
  })
  it('counts cards when nothing is due', () => {
    expect(missionState({ day, cards: 0 }, nothingDue, now).cards).toBe(true)
  })
  it('does not count cards while due cards are left', () => {
    expect(missionState({ day, cards: 0 }, dueVocab, now).cards).toBe(false)
  })
  it('counts cards once the daily portion is reached', () => {
    expect(missionState({ day, cards: DAILY_CARD_GOAL }, dueVocab, now).cards).toBe(true)
  })
  it('is complete only with all three steps', () => {
    const base = { day, cards: DAILY_CARD_GOAL }
    expect(missionState({ ...base, storyRead: true, gamePlayed: true }, dueVocab, now)).toEqual({
      story: true,
      cards: true,
      game: true,
      complete: true,
      claimed: false,
    })
    expect(missionState({ ...base, storyRead: true }, dueVocab, now).complete).toBe(false)
    expect(missionState({ ...base, gamePlayed: true }, dueVocab, now).complete).toBe(false)
    expect(missionState({ day, cards: 0, storyRead: true, gamePlayed: true }, dueVocab, now).complete).toBe(false)
    expect(missionState({ ...base, sticker: true }, dueVocab, now).claimed).toBe(true)
  })
})

describe('stickers', () => {
  it('has only things in table order', () => {
    const keys = STICKER_WORDS.map((w) => w.key)
    expect(keys[0]).toBe('cat')
    for (const w of STICKER_WORDS) expect(['prop', 'character']).toContain(w.picture.kind)
    for (const colourOrNumber of ['red', 'blue', 'one', 'five']) expect(keys).not.toContain(colourOrNumber)
  })
  it('picks the first sticker not owned, null when full', () => {
    expect(nextSticker([])?.key).toBe(STICKER_WORDS[0].key)
    expect(nextSticker([STICKER_WORDS[0].key])?.key).toBe(STICKER_WORDS[1].key)
    expect(nextSticker(STICKER_WORDS.map((w) => w.key))).toBeNull()
  })
})

describe('claimSticker', () => {
  const finishMission = (at: number) => {
    saveVocabulary(nothingDue)
    markStoryRead(at)
    markGamePlayed(at)
  }
  beforeEach(() => {
    resetAllProgress()
    saveVocabulary({})
  })

  it('gives nothing while the mission is incomplete', () => {
    saveVocabulary(nothingDue)
    markStoryRead(now)
    expect(claimSticker(now)).toBeNull()
    expect(loadStickers()).toEqual([])
  })
  it('gives one sticker a day and is idempotent', () => {
    finishMission(now)
    expect(claimSticker(now)?.key).toBe(STICKER_WORDS[0].key)
    expect(claimSticker(now)).toBeNull()
    expect(loadStickers()).toEqual([STICKER_WORDS[0].key])
  })
  it('gives the next sticker on the next day', () => {
    finishMission(now)
    claimSticker(now)
    finishMission(tomorrow)
    expect(claimSticker(tomorrow)?.key).toBe(STICKER_WORDS[1].key)
    expect(loadStickers()).toHaveLength(2)
  })
  it('with a full album gives null but marks the day as claimed', () => {
    saveStickers(STICKER_WORDS.map((w) => w.key))
    finishMission(now)
    expect(claimSticker(now)).toBeNull()
    expect(loadDaily(now).sticker).toBe(true)
    expect(loadStickers()).toHaveLength(STICKER_WORDS.length)
  })
})

describe('storage of the mission', () => {
  it('ignores junk flags and keeps old objects working', () => {
    clearDaily()
    localStorageSet(STORAGE_KEYS.daily, { day, cards: 2, storyRead: 'yes', gamePlayed: 1, sticker: true })
    expect(loadDaily(now)).toEqual({ day, cards: 2, sticker: true })
    saveDaily({ day, cards: 1 })
    expect(loadDaily(now)).toEqual({ day, cards: 1 })
  })
  it('drops junk, unknown keys and duplicates from stickers', () => {
    saveStickers(['cat', 'cat', 'unicorn', 'sun'])
    expect(loadStickers()).toEqual(['cat', 'sun'])
    localStorageSet(STORAGE_KEYS.stickers, { cat: true })
    expect(loadStickers()).toEqual([])
    localStorageSet(STORAGE_KEYS.stickers, [1, null, 'dog'])
    expect(loadStickers()).toEqual(['dog'])
  })
  it('is cleared by resetAllProgress', () => {
    saveStickers(['cat'])
    resetAllProgress()
    expect(loadStickers()).toEqual([])
  })
})

/** Stores junk through the typed savers: they only JSON.stringify, so any shape lands in storage as is. */
function localStorageSet(key: string, value: unknown) {
  if (key === STORAGE_KEYS.stickers) saveStickers(value as string[])
  else saveDaily(value as never)
}
