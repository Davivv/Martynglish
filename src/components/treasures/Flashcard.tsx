import confetti from 'canvas-confetti'
import { Volume2 } from 'lucide-react'
import { useState } from 'react'
import type { useSpeech } from '../../hooks/useSpeech'
import { findStoryPage } from '../../data/stories'
import type { Story } from '../../types/story'
import type { VocabEntry, VocabStatus } from '../../types/vocabulary'
import { playError, playSuccess } from '../../utils/soundEffects'
import { InteractiveStoryStage } from '../stage/InteractiveStoryStage'

interface FlashcardProps {
  entry: VocabEntry
  options: string[]
  stories: Story[]
  speech: ReturnType<typeof useSpeech>
  /** Card comes from the "known" tab. */
  knownTab: boolean
  onDecide: (status: VocabStatus) => void
}

export function Flashcard({ entry, options, stories, speech, knownTab, onDecide }: FlashcardProps) {
  const [wrong, setWrong] = useState<string[]>([])
  const [shaking, setShaking] = useState<string | null>(null)
  const [solved, setSolved] = useState(false)
  const found = findStoryPage(stories, entry.storyId, entry.pageNumber)

  const answer = (option: string) => {
    if (solved || wrong.includes(option)) return
    if (option === entry.answerPl) {
      playSuccess()
      setSolved(true)
      void confetti({ particleCount: 90, spread: 70, origin: { y: 0.55 } })
    } else {
      playError()
      setWrong((w) => [...w, option])
      setShaking(option)
      speech.speakText(entry.ttsText)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-lg ring-1 ring-violet-100 ${solved ? 'animate-flip' : ''}`}
      >
        {found && (
          <div className="relative h-28 overflow-hidden rounded-2xl">
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
            <div className="text-4xl font-bold text-slate-800">{entry.key}</div>
            <div className="text-lg font-medium text-indigo-600">[{entry.phoneticsPl}]</div>
          </div>
          <button
            type="button"
            onClick={() => speech.speakText(entry.ttsText)}
            aria-label="Posłuchaj słowa"
            className="flex size-14 items-center justify-center rounded-full bg-sky-100 text-sky-800 shadow-sm active:scale-95"
          >
            <Volume2 size={28} aria-hidden="true" />
          </button>
        </div>
        <p className="rounded-2xl bg-amber-50 px-3 py-2 text-center text-base text-slate-700">
          {entry.sentenceEn}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {options.map((option) => {
          const isWrong = wrong.includes(option)
          const isRight = solved && option === entry.answerPl
          return (
            <button
              key={option}
              type="button"
              disabled={solved && !isRight}
              onClick={() => answer(option)}
              onAnimationEnd={() => setShaking((s) => (s === option ? null : s))}
              className={`min-h-14 rounded-3xl px-4 text-xl font-bold shadow-md transition active:scale-95 ${
                isRight
                  ? 'bg-emerald-400 text-white'
                  : isWrong
                    ? 'bg-rose-100 text-rose-400'
                    : 'bg-white text-slate-800 ring-1 ring-violet-100'
              } ${shaking === option ? 'animate-shake' : ''} ${solved && !isRight ? 'opacity-40' : ''}`}
            >
              {isRight ? '✅ ' : ''}
              {option}
            </button>
          )
        })}
      </div>

      {solved && (
        <div ref={(el) => el?.scrollIntoView({ block: "end", behavior: "smooth" })} className="flex gap-3">
          <button
            type="button"
            onClick={() => onDecide('learning')}
            className="min-h-14 flex-1 rounded-3xl bg-white px-2 text-base font-bold text-violet-700 shadow-md ring-1 ring-violet-200 active:scale-95"
          >
            🔄 Jeszcze poćwiczę
          </button>
          <button
            type="button"
            onClick={() => onDecide('known')}
            className="min-h-14 flex-1 rounded-3xl bg-emerald-500 px-2 text-base font-bold text-white shadow-md active:scale-95"
          >
            ✅ {knownTab ? 'Nadal umiem!' : 'Już umiem na pamięć!'}
          </button>
        </div>
      )}
    </div>
  )
}
