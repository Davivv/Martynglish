import type { Story } from '../types/story'

/** Library shelves (D40). A story belongs to a shelf by the prefix of its `id`; the data contract stays untouched. */
export interface Shelf {
  title: string
  /** Id prefix; `null` marks the catch-all shelf. */
  prefix: string | null
  /** A dark reader panel for this shelf. */
  dark: boolean
}

export const SHELVES: readonly Shelf[] = [
  { title: 'Neon Stars', prefix: 'neon-stars-', dark: true },
  { title: 'Klub Przyjaciółek', prefix: 'friends-club-', dark: false },
  { title: 'Bajeczki', prefix: null, dark: false },
]

function shelfOf(storyId: string): Shelf {
  return SHELVES.find((s) => s.prefix !== null && storyId.startsWith(s.prefix)) ?? SHELVES[SHELVES.length - 1]
}

/** Shelves in fixed order, each with its stories in the input order. Empty shelves are left out. */
export function groupByShelf(stories: readonly Story[]): { shelf: Shelf; stories: Story[] }[] {
  return SHELVES.map((shelf) => ({ shelf, stories: stories.filter((s) => shelfOf(s.id) === shelf) })).filter(
    (g) => g.stories.length > 0,
  )
}

export type ReaderTone = 'dark' | 'light'

export function readerToneOf(storyId: string): ReaderTone {
  return shelfOf(storyId).dark ? 'dark' : 'light'
}

/** "Neon Stars 1: Wielki cień" becomes "1. Wielki cień"; titles without a number stay as they are. */
export function posterTitle(titlePl: string): string {
  const match = /^[^:]*?\s(\d+):\s*(.+)$/.exec(titlePl)
  return match ? `${match[1]}. ${match[2]}` : titlePl
}
