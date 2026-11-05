import { useState } from 'react'
import { useSpeech } from '../../hooks/useSpeech'
import { getAllStories } from '../../data/stories'
import type { QuizDirection, VocabEntry, VocabStatus } from '../../types/vocabulary'
import { type QuizOption, buildEnglishOptions, buildQuizOptions, pickNextCard } from '../../utils/quiz'
import { todayQueue } from '../../utils/review'
import { loadDaily, loadQuizDirection, saveQuizDirection } from '../../utils/storage'
import {
  type Vocabulary,
  changeEntryStatus,
  entriesByStatus,
  getVocabulary,
  loadColdStartWords,
  recordAnswer,
} from '../../utils/vocabulary'
import { Flashcard } from './Flashcard'

interface QuizCard {
  key: string
  options: QuizOption[]
  /** Changes with every new card so the flashcard resets its local state, even for the same word. */
  round: number
}

function buildCard(entry: VocabEntry, vocab: Vocabulary, direction: QuizDirection, round: number): QuizCard {
  const others = Object.values(vocab).filter((e) => e.key !== entry.key)
  const options =
    direction === 'answer-en'
      ? buildEnglishOptions(entry, others)
      : buildQuizOptions(
          entry.answerPl,
          others.map((e) => e.answerPl),
        ).map((label) => ({ label }))
  return { key: entry.key, options, round }
}

/** Cards for a tab: today's queue for "learning", everything for "known" or free practice. */
function cardsFor(vocab: Vocabulary, status: VocabStatus, practice: boolean, cardsDone: number): VocabEntry[] {
  if (status === 'learning' && !practice) return todayQueue(vocab, cardsDone, Date.now())
  return entriesByStatus(vocab, status)
}

function makeCard(
  vocab: Vocabulary,
  status: VocabStatus,
  lastKey: string | null,
  round: number,
  direction: QuizDirection,
  practice: boolean,
  cardsDone: number,
): QuizCard | null {
  const entry = pickNextCard(cardsFor(vocab, status, practice, cardsDone), lastKey)
  return entry ? buildCard(entry, vocab, direction, round) : null
}

export function TreasuresView() {
  const [stories] = useState(getAllStories)
  const [vocab, setVocab] = useState(getVocabulary)
  const [tab, setTab] = useState<VocabStatus>('learning')
  const [direction, setDirection] = useState(loadQuizDirection)
  const [cardsDone, setCardsDone] = useState(() => loadDaily(Date.now()).cards)
  // Free practice for the rest of this visit, after today's portion is done.
  const [practice, setPractice] = useState(false)
  // Read in event handlers, so render stays pure.
  const [now, setNow] = useState(Date.now)
  const [card, setCard] = useState<QuizCard | null>(() =>
    makeCard(getVocabulary(), 'learning', null, 0, loadQuizDirection(), false, loadDaily(Date.now()).cards),
  )
  const speech = useSpeech()

  const total = Object.keys(vocab).length

  const switchTab = (next: VocabStatus) => {
    speech.stop()
    setTab(next)
    setCard(makeCard(vocab, next, null, (card?.round ?? 0) + 1, direction, practice, cardsDone))
  }

  const switchDirection = (next: QuizDirection) => {
    if (next === direction) return
    speech.stop()
    saveQuizDirection(next)
    setDirection(next)
    const current = card ? vocab[card.key] : undefined
    if (card && current) setCard(buildCard(current, vocab, next, card.round + 1))
  }

  const coldStart = () => {
    loadColdStartWords(stories, 6)
    const next = getVocabulary()
    setVocab(next)
    setTab('learning')
    setCard(makeCard(next, 'learning', null, 1, direction, practice, cardsDone))
  }

  const decide = (status: VocabStatus) => {
    if (!card) return
    speech.stop()
    changeEntryStatus(card.key, status)
    const next = getVocabulary()
    const done = loadDaily(Date.now()).cards
    setVocab(next)
    setCardsDone(done)
    setNow(Date.now())
    setCard(makeCard(next, tab, card.key, card.round + 1, direction, practice, done))
  }

  // Keeps the flashcard mounted: only the schedule and the counters are refreshed.
  const answered = (firstTry: boolean) => {
    if (!card) return
    recordAnswer(card.key, firstTry)
    setVocab(getVocabulary())
    setNow(Date.now())
    setCardsDone(loadDaily(Date.now()).cards)
  }

  const startPractice = () => {
    setPractice(true)
    setCard(makeCard(vocab, 'learning', null, (card?.round ?? 0) + 1, direction, true, cardsDone))
  }

  if (total === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-10 text-center">
        <span className="text-6xl" aria-hidden="true">
          💎
        </span>
        <h1 className="text-2xl font-bold text-violet-700">Twoje Skarby</h1>
        <p className="text-lg text-slate-700">
          Jeszcze nie masz słówek. Czytaj bajki i dotykaj klocków, a słówka same tu wpadną!
        </p>
        <button
          type="button"
          onClick={coldStart}
          className="min-h-14 w-full rounded-3xl bg-violet-500 px-5 py-3 text-lg font-bold text-white shadow-md active:scale-95"
        >
          ✨ Załaduj 6 pierwszych słówek z bajek do zabawy!
        </button>
      </div>
    )
  }

  const entry = card ? vocab[card.key] : undefined
  const left = todayQueue(vocab, cardsDone, now).length
  const hasLearning = entriesByStatus(vocab, 'learning').length > 0
  const tabs: { id: VocabStatus; label: string }[] = [
    { id: 'learning', label: '🌱 Uczę się' },
    { id: 'known', label: '🏆 Już umiem!' },
  ]

  const directions: { id: QuizDirection; label: string }[] = [
    { id: 'answer-pl', label: 'po polsku' },
    { id: 'answer-en', label: 'po angielsku' },
  ]

  return (
    <div className="mx-auto flex max-w-md flex-col gap-3 px-4 py-3">
      <div className="flex gap-2" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => switchTab(t.id)}
            className={`relative min-h-12 flex-1 rounded-2xl px-2 text-sm leading-tight font-bold shadow-sm transition active:scale-95 ${
              tab === t.id ? 'bg-violet-500 text-white' : 'bg-white text-slate-600 ring-1 ring-violet-100'
            }`}
          >
            {t.label} ({entriesByStatus(vocab, t.id).length})
            {t.id === 'learning' && left > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white shadow"
                aria-label={`Do powtórki dziś: ${left}`}
              >
                {left}
              </span>
            )}
          </button>
        ))}
      </div>

      {card && entry && (
        <div className="flex items-center gap-2" role="group" aria-label="Język odpowiedzi">
          <span className="text-sm font-bold text-slate-600">Odpowiadam:</span>
          {directions.map((d) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={direction === d.id}
              onClick={() => switchDirection(d.id)}
              className={`min-h-12 flex-auto rounded-2xl px-2 text-sm font-bold whitespace-nowrap shadow-sm transition active:scale-95 ${
                direction === d.id ? 'bg-violet-500 text-white' : 'bg-white text-slate-600 ring-1 ring-violet-100'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      )}

      {card && entry ? (
        <Flashcard
          key={`${card.key}-${card.round}`}
          entry={entry}
          options={card.options}
          direction={direction}
          stories={stories}
          speech={speech}
          review={tab === 'learning' && entry.status === 'known'}
          onAnswered={answered}
          onDecide={decide}
        />
      ) : tab === 'learning' && !practice && hasLearning ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center shadow-sm">
          <span className="text-6xl" aria-hidden="true">
            🎉
          </span>
          <p className="text-lg font-bold text-slate-700">Na dziś wszystko powtórzone! Brawo!</p>
          <button
            type="button"
            onClick={startPractice}
            className="min-h-12 w-full rounded-3xl bg-violet-500 px-4 text-lg font-bold text-white shadow-md active:scale-95"
          >
            🔄 Ćwiczę dalej
          </button>
        </div>
      ) : (
        <p className="rounded-3xl bg-white p-6 text-center text-lg text-slate-600 shadow-sm">
          {tab === 'known'
            ? 'Tu pojawią się słówka, które już umiesz. 🏆'
            : 'Wszystkie słówka już umiesz! Brawo! 🎉'}
        </p>
      )}
    </div>
  )
}
