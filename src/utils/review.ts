// Spaced repetition (D32): Leitner boxes and a small daily portion. Pure functions, `now` is injected.
import type { VocabEntry } from '../types/vocabulary'

/** Days until a card returns, indexed by Leitner box 0-4. */
export const REVIEW_INTERVALS_DAYS = [0, 1, 3, 7, 14] as const
export const DAILY_CARD_GOAL = 8
const MAX_BOX = REVIEW_INTERVALS_DAYS.length - 1

const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)

/** Local midnight of the day containing `now`. */
export function startOfDay(now: number): number {
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** Adds calendar days with Date setters, so a DST change does not shift the day. */
export function addDays(dayStart: number, days: number): number {
  const d = new Date(dayStart)
  d.setDate(d.getDate() + days)
  return d.getTime()
}

/** Local date as 'YYYY-MM-DD'. */
export function localDay(now: number): string {
  const d = new Date(now)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** Box of an entry; a missing or junk value counts as 0. */
export function boxOf(entry: Pick<VocabEntry, 'box'>): number {
  return finite(entry.box) ? Math.min(MAX_BOX, Math.max(0, Math.floor(entry.box))) : 0
}

export function isDue(entry: Pick<VocabEntry, 'dueAt'>, now: number): boolean {
  return !finite(entry.dueAt) || entry.dueAt <= now
}

/** A first-try answer moves the card up one box; any mistake sends it to box 0 (due today again). */
export function withAnswer(entry: VocabEntry, firstTry: boolean, now: number): VocabEntry {
  const box = firstTry ? Math.min(MAX_BOX, boxOf(entry) + 1) : 0
  return { ...entry, box, dueAt: addDays(startOfDay(now), REVIEW_INTERVALS_DAYS[box]) }
}

/** Today's cards: due entries, `learning` first, then lower box, more clicks, then key. */
export function todayQueue(vocab: Record<string, VocabEntry>, cardsDone: number, now: number): VocabEntry[] {
  const limit = Math.max(0, DAILY_CARD_GOAL - cardsDone)
  return Object.values(vocab)
    .filter((e) => isDue(e, now))
    .sort(
      (a, b) =>
        Number(a.status === 'known') - Number(b.status === 'known') ||
        boxOf(a) - boxOf(b) ||
        b.clickCount - a.clickCount ||
        a.key.localeCompare(b.key),
    )
    .slice(0, limit)
}

/** Uncle Zone label: 'dziś' when due, otherwise 'za N dni'. */
export function reviewLabel(entry: Pick<VocabEntry, 'dueAt'>, now: number): string {
  if (isDue(entry, now)) return 'dziś'
  const days = Math.round((startOfDay(entry.dueAt as number) - startOfDay(now)) / 86_400_000)
  return days <= 1 ? 'za 1 dzień' : `za ${days} dni`
}
