import confetti from 'canvas-confetti'
import { ArrowLeft, ArrowRight, Home, Star } from 'lucide-react'
import { useState } from 'react'
import { useSpeech } from '../../hooks/useSpeech'
import type { Story } from '../../types/story'
import { recordCompletion } from '../../utils/progress'
import { playFanfare } from '../../utils/soundEffects'
import { ReaderPage } from './ReaderPage'

interface ReaderViewProps {
  story: Story
  onExit: () => void
}

export function ReaderView({ story, onExit }: ReaderViewProps) {
  const speech = useSpeech()
  const [index, setIndex] = useState(0)
  const [finishedCount, setFinishedCount] = useState<number | null>(null)

  const page = story.pages[index]
  const total = story.pages.length
  const isLast = index === total - 1

  const goTo = (next: number) => {
    speech.stop() // a page change always silences the speech
    setIndex(next)
  }

  const exit = () => {
    speech.stop()
    onExit()
  }

  const finish = () => {
    speech.stop()
    setFinishedCount(recordCompletion(story.id))
    playFanfare()
    void confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } })
  }

  if (finishedCount !== null) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-5 bg-paper p-6 text-center">
        <Star size={96} className="animate-pop fill-yellow-300 text-amber-400" aria-hidden="true" />
        <h1 className="text-3xl font-bold text-violet-700">Brawo, Martynko!</h1>
        <p className="text-lg text-slate-700">Masz nową gwiazdkę ⭐</p>
        <p className="text-base text-slate-600">
          „{story.titlePl}” przeczytana {finishedCount} {finishedCount === 1 ? 'raz' : 'razy'}.
        </p>
        <button
          type="button"
          onClick={() => {
            setFinishedCount(null)
            setIndex(0)
          }}
          className="min-h-14 w-full max-w-xs rounded-3xl bg-violet-500 px-6 text-lg font-bold text-white shadow-md active:scale-95"
        >
          🔄 Czytam jeszcze raz
        </button>
        <button
          type="button"
          onClick={exit}
          className="min-h-14 w-full max-w-xs rounded-3xl bg-white px-6 text-lg font-bold text-violet-700 shadow-md ring-1 ring-violet-200 active:scale-95"
        >
          📚 Do bajek
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col gap-2 overflow-hidden bg-paper px-4 pt-2 pb-3">
      <header className="flex flex-none items-center gap-3">
        <button
          type="button"
          onClick={exit}
          className="flex min-h-12 items-center gap-1 rounded-2xl bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 active:scale-95"
        >
          <Home size={20} aria-hidden="true" /> Wyjdź
        </button>
        <div className="min-w-0 flex-1 text-center">
          <div className="flex justify-center gap-1.5" aria-hidden="true">
            {story.pages.map((p, i) => (
              <Star
                key={p.pageNumber}
                size={18}
                className={i <= index ? 'fill-yellow-300 text-amber-400' : 'text-slate-300'}
              />
            ))}
          </div>
          <div className="text-xs font-medium text-slate-600">
            Strona {index + 1} z {total}
          </div>
        </div>
        <div className="w-[76px]" aria-hidden="true" />
      </header>

      {speech.voiceStatus === 'missing' && (
        <p className="flex-none rounded-2xl bg-amber-100 px-3 py-0.5 text-xs leading-snug text-amber-900">
          🔇 Dla dorosłego: brak angielskiego głosu w telefonie.
        </p>
      )}

      <ReaderPage key={page.pageNumber} storyId={story.id} page={page} speech={speech} />

      <nav className="mt-auto flex flex-none gap-3">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => goTo(index - 1)}
          className="flex min-h-14 flex-1 items-center justify-center gap-1 rounded-3xl bg-white text-base font-bold text-violet-700 shadow-md ring-1 ring-violet-200 active:scale-95 disabled:opacity-40"
        >
          <ArrowLeft size={20} aria-hidden="true" /> Wstecz
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={finish}
            className="min-h-14 flex-[2] rounded-3xl bg-amber-400 px-2 text-base leading-tight font-bold text-amber-950 shadow-md active:scale-95"
          >
            🎉 Koniec bajki! Odbierz gwiazdkę!
          </button>
        ) : (
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="flex min-h-14 flex-[2] items-center justify-center gap-1 rounded-3xl bg-violet-500 text-base font-bold text-white shadow-md active:scale-95"
          >
            Dalej <ArrowRight size={20} aria-hidden="true" />
          </button>
        )}
      </nav>
    </div>
  )
}
