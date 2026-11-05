import confetti from 'canvas-confetti'
import { Volume2 } from 'lucide-react'
import { useState } from 'react'
import type { useSpeech } from '../../hooks/useSpeech'
import { findStoryPage } from '../../data/stories'
import type { Story } from '../../types/story'
import type { QuizDirection, VocabEntry, VocabStatus } from '../../types/vocabulary'
import type { QuizOption } from '../../utils/quiz'
import { playError, playSuccess } from '../../utils/soundEffects'
import { InteractiveStoryStage } from '../stage/InteractiveStoryStage'

interface FlashcardProps {
  entry: VocabEntry
  options: QuizOption[]
  direction: QuizDirection
  stories: Story[]
  speech: ReturnType<typeof useSpeech>
  /** Card comes from the "known" tab. */
  knownTab: boolean
  onDecide: (status: VocabStatus) => void
}

export function Flashcard({ entry, options, direction, stories, speech, knownTab, onDecide }: FlashcardProps) {
  const [wrong, setWrong] = useState<string[]>([])
  const [shaking, setShaking] = useState<string | null>(null)
  const [solved, setSolved] = useState(false)
  const found = findStoryPage(stories, entry.storyId, entry.pageNumber)
  const answerEn = direction === 'answer-en'
  const correct = answerEn ? entry.key : entry.answerPl
  // In answer-en the sentence and the speaker reveal the answer, so they wait for the correct tap (D31).
  const showHints = !answerEn || solved

  const answer = (option: QuizOption) => {
    if (solved || wrong.includes(option.label)) return
    if (option.label === correct) {
      playSuccess()
      setSolved(true)
      void confetti({ particleCount: 90, spread: 70, origin: { y: 0.55 } })
      if (answerEn) speech.speakText(entry.ttsText)
    } else {
      playError()
      setWrong((w) => [...w, option.label])
      setShaking(option.label)
      // In answer-en the card word is the answer, so we read the tapped word instead (D31).
      const spoken = answerEn ? option.ttsText : entry.ttsText
      if (spoken) speech.speakText(spoken)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className={`flex flex-col gap-2 rounded-3xl bg-white p-3 shadow-lg ring-1 ring-violet-100 ${solved ? 'animate-flip' : ''}`}
      >
        {found && (
          <div className="relative h-24 overflow-hidden rounded-2xl">
            <div className="absolute inset-0">
              <InteractiveStoryStage
                visualConfig={found.page.visualConfig}
                imageUrl={found.page.imageUrl}
                altText={found.page.imageAltPl}
              />
            </div>
          </div>
        )}
        <div className="flex items-center justify-center gap-3">
          <div className="text-center">
            <div className="text-4xl leading-none font-bold text-slate-800">
              {answerEn ? entry.answerPl : entry.key}
            </div>
            {!answerEn && <div className="text-base font-medium text-indigo-600">[{entry.phoneticsPl}]</div>}
          </div>
          {showHints && (
            <button
              type="button"
              onClick={() => speech.speakText(entry.ttsText)}
              aria-label="Posłuchaj słowa"
              className="flex size-12 items-center justify-center rounded-full bg-sky-100 text-sky-800 shadow-sm active:scale-95"
            >
              <Volume2 size={28} aria-hidden="true" />
            </button>
          )}
        </div>
        {showHints && (
          <p className="rounded-2xl bg-amber-50 px-3 py-1 text-center text-sm leading-snug text-slate-700">
            {entry.sentenceEn}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {options.filter((option) => !solved || option.label === correct).map((option) => {
          const isWrong = wrong.includes(option.label)
          const isRight = solved && option.label === correct
          return (
            <button
              key={option.label}
              type="button"
              disabled={solved && !isRight}
              onClick={() => answer(option)}
              onAnimationEnd={() => setShaking((s) => (s === option.label ? null : s))}
              className={`min-h-12 rounded-3xl px-4 py-1 text-lg font-bold shadow-md transition active:scale-95 ${
                isRight
                  ? 'bg-emerald-400 text-white'
                  : isWrong
                    ? 'bg-rose-100 text-rose-400'
                    : 'bg-white text-slate-800 ring-1 ring-violet-100'
              } ${shaking === option.label ? 'animate-shake' : ''}`}
            >
              {isRight ? '✅ ' : ''}
              {option.label}
              {option.phoneticsPl && (
                <span
                  className={`block text-sm font-medium ${isRight || isWrong ? 'text-current' : 'text-indigo-600'}`}
                >
                  [{option.phoneticsPl}]
                </span>
              )}
            </button>
          )
        })}
      </div>

      {solved && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onDecide('learning')}
            className="min-h-12 flex-1 rounded-3xl bg-white px-2 text-base font-bold text-violet-700 shadow-md ring-1 ring-violet-200 active:scale-95"
          >
            🔄 Jeszcze poćwiczę
          </button>
          <button
            type="button"
            onClick={() => onDecide('known')}
            className="min-h-12 flex-1 rounded-3xl bg-emerald-500 px-2 text-base font-bold text-white shadow-md active:scale-95"
          >
            ✅ {knownTab ? 'Nadal umiem!' : 'Już umiem na pamięć!'}
          </button>
        </div>
      )}
    </div>
  )
}
