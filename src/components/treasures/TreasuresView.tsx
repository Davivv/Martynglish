import { useState } from 'react'
import { useSpeech } from '../../hooks/useSpeech'
import { getAllStories } from '../../data/stories'
import type { QuizDirection, VocabEntry, VocabStatus } from '../../types/vocabulary'
import { type QuizOption, buildEnglishOptions, buildQuizOptions, pickNextCard } from '../../utils/quiz'
import { loadQuizDirection, saveQuizDirection } from '../../utils/storage'
import {
  type Vocabulary,
  changeEntryStatus,
  entriesByStatus,
  getVocabulary,
  loadColdStartWords,
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

function makeCard(
  vocab: Vocabulary,
  status: VocabStatus,
  lastKey: string | null,
  round: number,
  direction: QuizDirection,
): QuizCard | null {
  const entry = pickNextCard(entriesByStatus(vocab, status), lastKey)
  return entry ? buildCard(entry, vocab, direction, round) : null
}

export function TreasuresView() {
  const [stories] = useState(getAllStories)
  const [vocab, setVocab] = useState(getVocabulary)
  const [tab, setTab] = useState<VocabStatus>('learning')
  const [direction, setDirection] = useState(loadQuizDirection)
  const [card, setCard] = useState<QuizCard | null>(() =>
    makeCard(getVocabulary(), 'learning', null, 0, loadQuizDirection()),
  )
  const speech = useSpeech()

  const total = Object.keys(vocab).length

  const switchTab = (next: VocabStatus) => {
    speech.stop()
    setTab(next)
    setCard(makeCard(vocab, next, null, (card?.round ?? 0) + 1, direction))
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
    setCard(makeCard(next, 'learning', null, 1, direction))
  }

  const decide = (status: VocabStatus) => {
    if (!card) return
    speech.stop()
    changeEntryStatus(card.key, status)
    const next = getVocabulary()
    setVocab(next)
    setCard(makeCard(next, tab, card.key, card.round + 1, direction))
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
            className={`min-h-12 flex-1 rounded-2xl px-2 text-sm leading-tight font-bold shadow-sm transition active:scale-95 ${
              tab === t.id ? 'bg-violet-500 text-white' : 'bg-white text-slate-600 ring-1 ring-violet-100'
            }`}
          >
            {t.label} ({entriesByStatus(vocab, t.id).length})
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
                direction === d.id ?'bg-violet-500 text-white' : 'bg-white text-slate-600 ring-1 ring-violet-100'
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
          knownTab={tab === 'known'}
          onDecide={decide}
        />
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
