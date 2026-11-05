import type { VocabEntry } from '../types/vocabulary'

/** Simple words used when the dictionary has fewer than 3 distinct answers (SPEC 3.C, D31). */
export interface FallbackPair {
  pl: string
  en: string
  phoneticsPl: string
}

export const fallbackPairs: readonly FallbackPair[] = [
  { pl: 'dom', en: 'house', phoneticsPl: 'haus' },
  { pl: 'słońce', en: 'sun', phoneticsPl: 'san' },
  { pl: 'jabłko', en: 'apple', phoneticsPl: 'a-pl' },
  { pl: 'duży', en: 'big', phoneticsPl: 'big' },
  { pl: 'mały', en: 'small', phoneticsPl: 'smol' },
  { pl: 'czerwony', en: 'red', phoneticsPl: 'red' },
  { pl: 'niebieski', en: 'blue', phoneticsPl: 'blu' },
  { pl: 'zielony', en: 'green', phoneticsPl: 'grin' },
  { pl: 'drzewo', en: 'tree', phoneticsPl: 'tri' },
  { pl: 'kwiatek', en: 'flower', phoneticsPl: 'fla-łer' },
  { pl: 'piłka', en: 'ball', phoneticsPl: 'bol' },
  { pl: 'księżyc', en: 'moon', phoneticsPl: 'mun' },
  { pl: 'ptak', en: 'bird', phoneticsPl: 'berd' },
  { pl: 'woda', en: 'water', phoneticsPl: 'ło-ter' },
  { pl: 'ryba', en: 'fish', phoneticsPl: 'fisz' },
  { pl: 'chmura', en: 'cloud', phoneticsPl: 'klaud' },
  { pl: 'okno', en: 'window', phoneticsPl: 'łin-dou' },
  { pl: 'książka', en: 'book', phoneticsPl: 'buk' },
  { pl: 'stół', en: 'table', phoneticsPl: 'tej-bl' },
  { pl: 'but', en: 'shoe', phoneticsPl: 'szu' },
  { pl: 'jeden', en: 'one', phoneticsPl: 'łan' },
  { pl: 'dwa', en: 'two', phoneticsPl: 'tu' },
  { pl: 'trzy', en: 'three', phoneticsPl: 'fri' },
]

/** The Polish side of `fallbackPairs` (SPEC 3.C). */
export const fallbackDistractors: readonly string[] = fallbackPairs.map((p) => p.pl)

/** One answer button. English options carry phonetics because the child cannot read English yet (D31). */
export interface QuizOption {
  /** Text on the button. */
  label: string
  /** Shown under an English option, because the child cannot read English yet. */
  phoneticsPl?: string
  /** Spoken after a tap on an English option. */
  ttsText?: string
}

export function shuffle<T>(items: readonly T[], rng: () => number = Math.random): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = result[i]
    result[i] = result[j]
    result[j] = tmp
  }
  return result
}

export const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

/**
 * One correct answer plus distractors, shuffled. A distractor never repeats the correct
 * answer or another distractor (case-insensitive). Own-dictionary answers go first, the rest
 * comes from `fallbackDistractors`.
 */
export function buildQuizOptions(
  correct: string,
  poolAnswers: readonly string[],
  rng: () => number = Math.random,
  count = 3,
): string[] {
  const chosen: string[] = [correct]
  const take = (candidates: readonly string[]) => {
    for (const candidate of shuffle(candidates, rng)) {
      if (chosen.length >= count) return
      if (!candidate.trim() || chosen.some((c) => same(c, candidate))) continue
      chosen.push(candidate)
    }
  }
  take(poolAnswers)
  take(fallbackDistractors)
  return shuffle(chosen, rng)
}

/**
 * English options for a Polish card (D31): the correct word plus distractors from the pool,
 * then from `fallbackPairs`. A candidate is rejected when its English text or its Polish
 * meaning matches an option already chosen (`little` and `small` both mean `mały`).
 */
export function buildEnglishOptions(
  entry: VocabEntry,
  pool: readonly VocabEntry[],
  rng: () => number = Math.random,
  count = 3,
): QuizOption[] {
  const chosen: { option: QuizOption; pl: string }[] = [
    { option: { label: entry.key, phoneticsPl: entry.phoneticsPl, ttsText: entry.ttsText }, pl: entry.answerPl },
  ]
  const take = (candidates: readonly { option: QuizOption; pl: string }[]) => {
    for (const candidate of shuffle(candidates, rng)) {
      if (chosen.length >= count) return
      if (!candidate.option.label.trim()) continue
      if (chosen.some((c) => same(c.option.label, candidate.option.label) || same(c.pl, candidate.pl))) continue
      chosen.push(candidate)
    }
  }
  take(pool.map((e) => ({ option: { label: e.key, phoneticsPl: e.phoneticsPl, ttsText: e.ttsText }, pl: e.answerPl })))
  take(fallbackPairs.map((p) => ({ option: { label: p.en, phoneticsPl: p.phoneticsPl, ttsText: p.en }, pl: p.pl })))
  return shuffle(
    chosen.map((c) => c.option),
    rng,
  )
}

/** Picks a random card, avoiding the previous one when there is a choice. */
export function pickNextCard(
  entries: readonly VocabEntry[],
  lastKey: string | null,
  rng: () => number = Math.random,
): VocabEntry | null {
  if (entries.length === 0) return null
  const candidates = entries.length > 1 ? entries.filter((e) => e.key !== lastKey) : entries
  return candidates[Math.floor(rng() * candidates.length)] ?? null
}
