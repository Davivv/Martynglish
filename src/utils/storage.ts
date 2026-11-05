// The only module that touches localStorage (D24). Keys: martynka:v1:*.
// Missing access (private mode, blocked storage) or corrupted data never throws:
// reads fall back to defaults and writes fall back to an in-memory copy.
import type { Story } from '../types/story'
import type { QuizDirection, VocabEntry } from '../types/vocabulary'

const PREFIX = 'martynka:v1:'
export const STORAGE_KEYS = {
  progress: `${PREFIX}progress`,
  vocabulary: `${PREFIX}vocabulary`,
  customStories: `${PREFIX}custom-stories`,
  quizDirection: `${PREFIX}quiz-direction`,
} as const

const memory = new Map<string, string>()

function readRaw(key: string): string | null {
  try {
    const value = window.localStorage.getItem(key)
    if (value !== null) return value
  } catch {
    // storage unavailable, use memory
  }
  return memory.get(key) ?? null
}

function writeRaw(key: string, value: string): void {
  memory.set(key, value)
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // quota or blocked: the in-memory copy keeps this session working
  }
}

function removeRaw(key: string): void {
  memory.delete(key)
  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

function readJson(key: string): unknown {
  const raw = readRaw(key)
  if (raw === null) return undefined
  try {
    return JSON.parse(raw)
  } catch {
    return undefined
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isVocabEntry(value: unknown): value is VocabEntry {
  return (
    isRecord(value) &&
    typeof value.key === 'string' &&
    typeof value.answerPl === 'string' &&
    typeof value.phoneticsPl === 'string' &&
    typeof value.ttsText === 'string' &&
    typeof value.storyId === 'string' &&
    typeof value.pageNumber === 'number' &&
    typeof value.sentenceEn === 'string' &&
    typeof value.clickCount === 'number' &&
    (value.status === 'learning' || value.status === 'known')
  )
}

function isStoryLike(value: unknown): value is Story {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.titleEn === 'string' &&
    typeof value.titlePl === 'string' &&
    isRecord(value.coverVisualConfig) &&
    Array.isArray(value.pages) &&
    value.pages.length > 0 &&
    value.pages.every((p) => isRecord(p) && Array.isArray(p.words) && typeof p.sentenceEn === 'string')
  )
}

/** Completed readings per story id. */
export function loadProgress(): Record<string, number> {
  const data = readJson(STORAGE_KEYS.progress)
  const result: Record<string, number> = {}
  if (!isRecord(data)) return result
  for (const [id, count] of Object.entries(data)) {
    if (typeof count === 'number' && Number.isFinite(count) && count > 0) result[id] = Math.floor(count)
  }
  return result
}

export function saveProgress(progress: Record<string, number>): void {
  writeRaw(STORAGE_KEYS.progress, JSON.stringify(progress))
}

export function clearProgress(): void {
  removeRaw(STORAGE_KEYS.progress)
}

export function loadVocabulary(): Record<string, VocabEntry> {
  const data = readJson(STORAGE_KEYS.vocabulary)
  const result: Record<string, VocabEntry> = {}
  if (!isRecord(data)) return result
  for (const entry of Object.values(data)) {
    if (isVocabEntry(entry)) result[entry.key] = entry
  }
  return result
}

export function saveVocabulary(vocabulary: Record<string, VocabEntry>): void {
  writeRaw(STORAGE_KEYS.vocabulary, JSON.stringify(vocabulary))
}

export function clearVocabulary(): void {
  removeRaw(STORAGE_KEYS.vocabulary)
}

export function loadCustomStories(): Story[] {
  const data = readJson(STORAGE_KEYS.customStories)
  return Array.isArray(data) ? data.filter(isStoryLike) : []
}

export function saveCustomStories(stories: Story[]): void {
  writeRaw(STORAGE_KEYS.customStories, JSON.stringify(stories))
}

/** A setting, not progress: progress reset leaves it alone (D31). */
export function loadQuizDirection(): QuizDirection {
  return readRaw(STORAGE_KEYS.quizDirection) === 'answer-en' ? 'answer-en' : 'answer-pl'
}

export function saveQuizDirection(direction: QuizDirection): void {
  writeRaw(STORAGE_KEYS.quizDirection, direction)
}
