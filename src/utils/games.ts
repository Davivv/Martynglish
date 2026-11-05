// Pure game logic (D33). `rng` is injectable so tests are deterministic.
import { PICTURE_WORDS, type PictureSpec, pictureOf } from '../data/wordPictures'
import type { Story, StoryPage, WordToken } from '../types/story'
import { buildQuizOptions, same, shuffle } from './quiz'
import { flashcardOf } from './storyGuardian'
import { type Vocabulary, makeEntry } from './vocabulary'

export type GameId = 'listening' | 'sentence' | 'memory'

export interface GameWord {
  key: string
  answerPl: string
  phoneticsPl: string
  /** English text sent to the speech synthesizer. */
  ttsText: string
}

export interface ListeningOption {
  answerPl: string
  picture?: PictureSpec
  correct: boolean
}

const toGameWord = (e: GameWord): GameWord => ({
  key: e.key,
  answerPl: e.answerPl,
  phoneticsPl: e.phoneticsPl,
  ttsText: e.ttsText,
})

/** Distinct keyword cards of the stories, in reading order. */
function keywordCards(stories: readonly Story[]): GameWord[] {
  const seen = new Set<string>()
  const cards: GameWord[] = []
  for (const story of stories) {
    for (const page of story.pages) {
      for (const token of page.words) {
        if (!token.isKeyword) continue
        const { key } = flashcardOf(token)
        if (seen.has(key)) continue
        seen.add(key)
        cards.push(
          toGameWord(
            makeEntry(token, { storyId: story.id, pageNumber: page.pageNumber, sentenceEn: page.sentenceEn }, 0),
          ),
        )
      }
    }
  }
  return cards
}

/**
 * Words for one round. With `storyId`: that story's keyword cards. Without: the dictionary
 * (`learning` before `known`), padded with story keywords. Padding is never saved (D33).
 */
export function pickGameWords(
  vocab: Vocabulary,
  stories: readonly Story[],
  count: number,
  rng: () => number = Math.random,
  storyId?: string,
): GameWord[] {
  if (storyId) {
    return shuffle(keywordCards(stories.filter((s) => s.id === storyId)), rng).slice(0, count)
  }
  const entries = Object.values(vocab)
  const chosen: GameWord[] = []
  const seen = new Set<string>()
  for (const status of ['learning', 'known'] as const) {
    for (const entry of shuffle(
      entries.filter((e) => e.status === status),
      rng,
    )) {
      if (chosen.length >= count) return chosen
      if (seen.has(entry.key)) continue
      seen.add(entry.key)
      chosen.push(toGameWord(entry))
    }
  }
  for (const card of keywordCards(stories)) {
    if (chosen.length >= count) break
    if (seen.has(card.key)) continue
    seen.add(card.key)
    chosen.push(card)
  }
  return chosen
}

/** Words for the listening game: the answer is a touched picture, so words with a picture go first (D33). */
export function pickListeningWords(
  vocab: Vocabulary,
  stories: readonly Story[],
  count: number,
  rng: () => number = Math.random,
  storyId?: string,
): GameWord[] {
  const all = pickGameWords(vocab, stories, Number.MAX_SAFE_INTEGER, rng, storyId)
  const pictured = all.filter((w) => pictureOf(w.key))
  const textOnly = all.filter((w) => !pictureOf(w.key))
  return shuffle([...pictured, ...textOnly].slice(0, count), rng)
}

/** Things (props and heroes) form one group; colours and numbers each their own, so a swatch never gives the answer away. */
export const groupOf = (picture: PictureSpec): string =>
  picture.kind === 'prop' || picture.kind === 'character' ? 'thing' : picture.kind

/**
 * Three shuffled options with exactly one correct. A word with a picture gets picture
 * distractors of the same group; a word without gets Polish text options.
 */
export function buildListeningRound(
  word: GameWord,
  poolAnswers: readonly string[],
  rng: () => number = Math.random,
): ListeningOption[] {
  const picture = pictureOf(word.key)
  if (!picture) {
    return buildQuizOptions(word.answerPl, poolAnswers, rng).map((answerPl) => ({
      answerPl,
      correct: same(answerPl, word.answerPl),
    }))
  }
  const group = groupOf(picture)
  const options: ListeningOption[] = [{ answerPl: word.answerPl, picture, correct: true }]
  for (const candidate of shuffle(
    PICTURE_WORDS.filter((w) => groupOf(w.picture) === group),
    rng,
  )) {
    if (options.length >= 3) break
    if (candidate.key === word.key || options.some((o) => same(o.answerPl, candidate.answerPl))) continue
    options.push({ answerPl: candidate.answerPl, picture: candidate.picture, correct: false })
  }
  return shuffle(options, rng)
}

const MIN_BLOCKS = 3
const MAX_BLOCKS = 8

/**
 * Pages for the sentence game (D34): 3-8 blocks, unique by sentence text. Without `storyId`,
 * pages of stories read at least once come first, the rest pads in story order.
 */
export function pickSentences(
  stories: readonly Story[],
  progress: Record<string, number>,
  count: number,
  rng: () => number = Math.random,
  storyId?: string,
): { storyId: string; page: StoryPage }[] {
  const pagesOf = (list: readonly Story[]) =>
    list.flatMap((story) =>
      story.pages
        .filter((p) => p.words.length >= MIN_BLOCKS && p.words.length <= MAX_BLOCKS)
        .map((page) => ({ storyId: story.id, page })),
    )
  const seen = new Set<string>()
  const unique = (items: { storyId: string; page: StoryPage }[]) =>
    items.filter(({ page }) => {
      const text = page.sentenceEn.trim().toLowerCase()
      if (seen.has(text)) return false
      seen.add(text)
      return true
    })
  if (storyId) return unique(shuffle(pagesOf(stories.filter((s) => s.id === storyId)), rng)).slice(0, count)
  const read = unique(shuffle(pagesOf(stories.filter((s) => (progress[s.id] ?? 0) > 0)), rng))
  if (read.length >= count) return read.slice(0, count)
  const rest = unique(pagesOf(stories.filter((s) => !((progress[s.id] ?? 0) > 0))))
  return [...read, ...rest].slice(0, count)
}

/** Block indexes in random order; never the original order when two blocks differ. */
export function shuffleBlocks(words: readonly WordToken[], rng: () => number = Math.random): number[] {
  const identity = words.map((_, i) => i)
  const distinct = new Set(words.map((w) => w.word.toLowerCase())).size > 1
  if (!distinct) return shuffle(identity, rng)
  const isOriginal = (order: number[]) => order.every((v, i) => words[v].word.toLowerCase() === words[i].word.toLowerCase())
  for (let attempt = 0; attempt < 20; attempt++) {
    const order = shuffle(identity, rng)
    if (!isOriginal(order)) return order
  }
  // Guaranteed fallback: rotate by one step until the text order differs.
  for (let shift = 1; shift < identity.length; shift++) {
    const order = identity.map((_, i) => (i + shift) % identity.length)
    if (!isOriginal(order)) return order
  }
  return identity
}

/** True when block `index` may fill slot `placed`: equal text counts, so a repeated word fits either slot. */
export function isNextBlock(words: readonly WordToken[], placed: number, index: number): boolean {
  const target = words[placed]
  const tapped = words[index]
  return !!target && !!tapped && same(tapped.word, target.word)
}

export interface MemoryCard {
  id: string
  word: GameWord
  side: 'word' | 'meaning'
  /** Only on the meaning side. */
  picture?: PictureSpec
}

/**
 * Words for the memory game (D35): pictured words first, one word per Polish meaning,
 * padded from PICTURE_WORDS when the pool is too small (also in story mode).
 */
export function pickMemoryWords(
  vocab: Vocabulary,
  stories: readonly Story[],
  count: number,
  rng: () => number = Math.random,
  storyId?: string,
): GameWord[] {
  const chosen: GameWord[] = []
  const add = (word: GameWord) => {
    if (chosen.length >= count) return
    if (chosen.some((c) => c.key === word.key || same(c.answerPl, word.answerPl))) return
    chosen.push(word)
  }
  // Dictionary words keep their priority, pictured words first within it.
  const pool = pickGameWords(vocab, stories, Number.MAX_SAFE_INTEGER, rng, storyId)
  ;[...pool.filter((w) => pictureOf(w.key)), ...pool.filter((w) => !pictureOf(w.key))].forEach(add)
  for (const w of shuffle(PICTURE_WORDS, rng)) {
    add({ key: w.key, answerPl: w.answerPl, phoneticsPl: w.phoneticsPl, ttsText: w.key })
  }
  return chosen
}

/** Two cards per word, shuffled. */
export function buildMemoryDeck(words: readonly GameWord[], rng: () => number = Math.random): MemoryCard[] {
  const cards = words.flatMap((word): MemoryCard[] => [
    { id: `${word.key}:word`, word, side: 'word' },
    { id: `${word.key}:meaning`, word, side: 'meaning', picture: pictureOf(word.key) },
  ])
  return shuffle(cards, rng)
}

export function isPair(a: MemoryCard, b: MemoryCard): boolean {
  return a.word.key === b.word.key && a.side !== b.side
}
