// Pure game logic (D33). `rng` is injectable so tests are deterministic.
import { PICTURE_WORDS, type PictureSpec, pictureOf } from '../data/wordPictures'
import type { Story } from '../types/story'
import { buildQuizOptions, same, shuffle } from './quiz'
import { flashcardOf } from './storyGuardian'
import { type Vocabulary, makeEntry } from './vocabulary'

export type GameId = 'listening'

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
const groupOf = (picture: PictureSpec): string =>
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
