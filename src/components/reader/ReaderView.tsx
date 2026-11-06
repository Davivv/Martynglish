import confetti from 'canvas-confetti'
import { ArrowLeft, ArrowRight, Star, X } from 'lucide-react'
import { useState } from 'react'
import { readerToneOf } from '../../data/shelves'
import { useSpeech } from '../../hooks/useSpeech'
import type { Story } from '../../types/story'
import type { GameId } from '../../utils/games'
import { markStoryRead } from '../../utils/mission'
import { recordCompletion } from '../../utils/progress'
import { playFanfare } from '../../utils/soundEffects'
import { ReaderPage } from './ReaderPage'

interface ReaderViewProps {
  story: Story
  onExit: () => void
  /** Starts a game with this story's words (D35). */
  onPlay: (game: GameId) => void
}

export function ReaderView({ story, onExit, onPlay }: ReaderViewProps) {
  const speech = useSpeech()
  const [index, setIndex] = useState(0)
  const [finishedCount, setFinishedCount] = useState<number | null>(null)
  const [wordTapped, setWordTapped] = useState(false)

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
    markStoryRead()
    playFanfare()
    void confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } })
  }

  if (finishedCount !== null) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-paper p-6 text-center">
        <Star size={96} className="animate-pop fill-yellow-300 text-amber-400" aria-hidden="true" />
        <h1 className="text-3xl font-bold text-violet-700">Brawo, Martynko!</h1>
        <p className="text-lg text-slate-700">Masz nową gwiazdkę ⭐</p>
        <p className="text-base text-slate-600">
          „{story.titlePl}” przeczytana {finishedCount} {finishedCount === 1 ? 'raz' : 'razy'}.
        </p>
        <button
          type="button"
          onClick={() => {
            speech.stop()
            onPlay('sentence')
          }}
          className="min-h-14 w-full max-w-xs rounded-3xl bg-violet-500 px-6 text-lg font-bold text-white shadow-md active:scale-95"
        >
          🧩 Ułóż zdania z tej bajki
        </button>
        <button
          type="button"
          onClick={() => {
            setFinishedCount(null)
            setIndex(0)
          }}
          className="min-h-14 w-full max-w-xs rounded-3xl bg-white px-6 text-lg font-bold text-violet-700 shadow-md ring-1 ring-violet-200 active:scale-95"
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

  const tone = readerToneOf(story.id)
  const dark = tone === 'dark'
  const ghost = dark ? 'bg-[#2b2470] text-violet-200' : 'bg-white text-violet-700 shadow-md ring-1 ring-violet-200'

  const nav = (
    <nav className="flex gap-3">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => goTo(index - 1)}
        className={`flex min-h-14 flex-1 items-center justify-center gap-1 rounded-3xl text-base font-bold active:scale-95 disabled:opacity-40 ${ghost}`}
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
  )

  const exitButton = (
    <button
      type="button"
      onClick={exit}
      className="flex min-h-12 items-center gap-1 rounded-2xl bg-slate-900/75 px-3 text-sm font-semibold text-white backdrop-blur-sm active:scale-95"
    >
      <X size={20} aria-hidden="true" /> Wyjdź
    </button>
  )

  return (
    <div className={`mx-auto flex h-dvh max-w-md flex-col overflow-hidden ${dark ? 'bg-[#171347]' : 'bg-paper'}`}>
      <ReaderPage
        key={page.pageNumber}
        storyId={story.id}
        page={page}
        speech={speech}
        tone={tone}
        exitButton={exitButton}
        counter={`${index + 1} z ${total}`}
        showHint={index === 0 && !wordTapped}
        onWordTapped={() => setWordTapped(true)}
        nav={nav}
      />
    </div>
  )
}
