export type VocabStatus = 'learning' | 'known'

/** Which language the child answers in on a flashcard (D31). */
export type QuizDirection = 'answer-pl' | 'answer-en'

/** One flashcard in the child's dictionary (SPEC 3.C, D27). Uncle Zone reads these. */
export interface VocabEntry {
  /** Normalized dictionary form: `flashcardOf(token).key`. */
  key: string
  /** Polish answer in dictionary form. */
  answerPl: string
  /** Polish syllable pronunciation of the dictionary form, e.g. "per-pl". */
  phoneticsPl: string
  /** Text sent to the speech synthesizer for this card. */
  ttsText: string
  storyId: string
  pageNumber: number
  /** Example sentence from the story. */
  sentenceEn: string
  clickCount: number
  status: VocabStatus
}
