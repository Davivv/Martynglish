// Dictionary logic from SPEC 3.C. Pure functions first, thin persistence wrappers at the bottom.
import type { Story, WordToken } from '../types/story'
import type { VocabEntry, VocabStatus } from '../types/vocabulary'
import { isDue, withAnswer } from './review'
import { clearDaily, clearProgress, clearStickers, clearVocabulary, loadDaily, loadVocabulary, saveDaily, saveVocabulary } from './storage'
import { flashcardOf } from './storyGuardian'
import { wordSpeechText } from './speechLogic'

export type Vocabulary = Record<string, VocabEntry>

export interface WordContext {
  storyId: string
  pageNumber: number
  sentenceEn: string
}

export function makeEntry(token: WordToken, ctx: WordContext, clickCount: number): VocabEntry {
  const { key, answerPl, phoneticsPl } = flashcardOf(token)
  return {
    key,
    answerPl,
    phoneticsPl,
    ttsText: token.lemmaEn ?? wordSpeechText(token),
    storyId: ctx.storyId,
    pageNumber: ctx.pageNumber,
    sentenceEn: ctx.sentenceEn,
    clickCount,
    status: 'learning',
  }
}

/**
 * Registers a tap on a word block. Keywords are saved automatically; function words are
 * saved only when `force` is set (the "+ Dodaj do fiszek" button) or already in the dictionary.
 * A tap on a word marked "known" sends it back to "learning".
 */
export function recordWordClick(
  vocab: Vocabulary,
  token: WordToken,
  ctx: WordContext,
  force = false,
): Vocabulary {
  const key = flashcardOf(token).key
  const existing = vocab[key]
  if (existing) {
    const next: VocabEntry = { ...existing, clickCount: existing.clickCount + 1, status: 'learning' }
    if (existing.status === 'known') {
      // A forgotten word is due again right away.
      next.box = 0
      delete next.dueAt
    }
    return { ...vocab, [key]: next }
  }
  if (!token.isKeyword && !force) return vocab
  return { ...vocab, [key]: makeEntry(token, ctx, 1) }
}

export function setEntryStatus(vocab: Vocabulary, key: string, status: VocabStatus): Vocabulary {
  const existing = vocab[key]
  if (!existing || existing.status === status) return vocab
  return { ...vocab, [key]: { ...existing, status } }
}

/** Sorted by difficulty: most clicks first (SPEC 3.D). Ties by key for a stable order. */
export function listEntries(vocab: Vocabulary): VocabEntry[] {
  return Object.values(vocab).sort((a, b) => b.clickCount - a.clickCount || a.key.localeCompare(b.key))
}

export function entriesByStatus(vocab: Vocabulary, status: VocabStatus): VocabEntry[] {
  return listEntries(vocab).filter((e) => e.status === status)
}

/** First `count` distinct keyword cards across the stories, in reading order. Skips cards already saved. */
export function pickColdStartEntries(stories: Story[], existing: Vocabulary, count = 6): VocabEntry[] {
  const picked: VocabEntry[] = []
  const seen = new Set(Object.keys(existing))
  for (const story of stories) {
    for (const page of story.pages) {
      for (const token of page.words) {
        if (!token.isKeyword) continue
        const { key } = flashcardOf(token)
        if (seen.has(key)) continue
        seen.add(key)
        picked.push(
          makeEntry(token, { storyId: story.id, pageNumber: page.pageNumber, sentenceEn: page.sentenceEn }, 0),
        )
        if (picked.length >= count) return picked
      }
    }
  }
  return picked
}

export function addEntries(vocab: Vocabulary, entries: VocabEntry[]): Vocabulary {
  const next = { ...vocab }
  for (const entry of entries) next[entry.key] ??= entry
  return next
}

// ---- Persistence wrappers (also the API for Uncle Zone) ----

export function getVocabulary(): Vocabulary {
  return loadVocabulary()
}

/** Entries as a list, most clicked first. */
export function getVocabularyList(): VocabEntry[] {
  return listEntries(loadVocabulary())
}

export function trackWordClick(token: WordToken, ctx: WordContext, force = false): void {
  saveVocabulary(recordWordClick(loadVocabulary(), token, ctx, force))
}

export function changeEntryStatus(key: string, status: VocabStatus): void {
  saveVocabulary(setEntryStatus(loadVocabulary(), key, status))
}

/**
 * Records a flashcard answer. A due card moves in the schedule and counts towards today's goal;
 * a card that is not due (free practice) changes nothing, so early practice cannot push the schedule.
 */
export function recordAnswer(key: string, firstTry: boolean, now = Date.now()): void {
  const vocab = loadVocabulary()
  const entry = vocab[key]
  if (!entry || !isDue(entry, now)) return
  saveVocabulary({ ...vocab, [key]: withAnswer(entry, firstTry, now) })
  const daily = loadDaily(now)
  saveDaily({ ...daily, cards: daily.cards + 1 })
}

export function loadColdStartWords(stories: Story[], count = 6): void {
  const vocab = loadVocabulary()
  saveVocabulary(addEntries(vocab, pickColdStartEntries(stories, vocab, count)))
}

/** Clears the dictionary and the reading counters (Uncle Zone "reset progress"). */
export function resetAllProgress(): void {
  clearVocabulary()
  clearProgress()
  clearDaily()
  clearStickers()
}
