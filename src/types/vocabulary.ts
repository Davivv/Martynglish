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
  /** Leitner box 0-4 (see `utils/review.ts`). Missing means 0. */
  box?: number
  /** Epoch ms of the local start of the day when the card is due. Missing means due now. */
  dueAt?: number
}

/** Today's practice counter. Local day, so it resets at midnight. Easy to extend with more fields. */
export interface DailyState {
  /** Local date, 'YYYY-MM-DD'. */
  day: string
  /** Scheduled cards answered today. */
  cards: number
}
