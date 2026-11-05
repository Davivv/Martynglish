// Daily mission and sticker album (D36). Pure functions first, thin persistence wrappers at the bottom.
import { PICTURE_WORDS, type PictureWord } from '../data/wordPictures'
import type { DailyState, VocabEntry } from '../types/vocabulary'
import { groupOf } from './games'
import { todayQueue } from './review'
import { loadDaily, loadStickers, saveDaily, saveStickers } from './storage'
import { getVocabulary } from './vocabulary'

/** Only things are stickers (no colours or numbers), in table order. */
export const STICKER_WORDS: readonly PictureWord[] = PICTURE_WORDS.filter((w) => groupOf(w.picture) === 'thing')

export interface MissionState {
  story: boolean
  cards: boolean
  game: boolean
  complete: boolean
  claimed: boolean
}

export function missionState(daily: DailyState, vocab: Record<string, VocabEntry>, now: number): MissionState {
  const story = daily.storyRead === true
  const game = daily.gamePlayed === true
  // A day with nothing left to repeat counts as done, but an empty dictionary does not.
  const cards = Object.keys(vocab).length > 0 && todayQueue(vocab, daily.cards, now).length === 0
  return { story, cards, game, complete: story && cards && game, claimed: daily.sticker === true }
}

/** First sticker not owned yet, or null when the album is full. */
export function nextSticker(owned: readonly string[]): PictureWord | null {
  return STICKER_WORDS.find((w) => !owned.includes(w.key)) ?? null
}

// ---- Persistence wrappers ----

export function getMissionState(now = Date.now()): MissionState {
  return missionState(loadDaily(now), getVocabulary(), now)
}

export function markStoryRead(now = Date.now()): void {
  saveDaily({ ...loadDaily(now), storyRead: true })
}

export function markGamePlayed(now = Date.now()): void {
  saveDaily({ ...loadDaily(now), gamePlayed: true })
}

/**
 * Gives today's sticker. Null when the mission is not complete, today's sticker is already
 * claimed, or the album is full (then the day is still marked as claimed).
 */
export function claimSticker(now = Date.now()): PictureWord | null {
  const daily = loadDaily(now)
  const state = missionState(daily, getVocabulary(), now)
  if (!state.complete || state.claimed) return null
  const owned = loadStickers()
  const sticker = nextSticker(owned)
  saveDaily({ ...daily, sticker: true })
  if (sticker) saveStickers([...owned, sticker.key])
  return sticker
}
