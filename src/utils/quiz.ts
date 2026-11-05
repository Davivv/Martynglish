import type { VocabEntry } from '../types/vocabulary'

/** Simple Polish words used when the dictionary has fewer than 3 distinct answers (SPEC 3.C). */
export const fallbackDistractors: readonly string[] = [
  'dom',
  'słońce',
  'jabłko',
  'duży',
  'mały',
  'czerwony',
  'niebieski',
  'zielony',
  'drzewo',
  'kwiatek',
  'piłka',
  'księżyc',
  'ptak',
  'woda',
  'ryba',
  'chmura',
  'okno',
  'książka',
  'stół',
  'but',
  'jeden',
  'dwa',
  'trzy',
]

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

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

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
