import confetti from 'canvas-confetti'
import { Star } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { playFanfare } from '../../utils/soundEffects'

interface GameFinishProps {
  /** Words answered correctly on the first try. */
  stars: number
  total: number
  onAgain: () => void
  onExit: () => void
  /** Label of the exit button. */
  exitLabel?: string
}

export function GameFinish({ stars, total, onAgain, onExit, exitLabel = '🎮 Do zabaw' }: GameFinishProps) {
  const celebrated = useRef(false)
  useEffect(() => {
    if (celebrated.current) return // StrictMode runs effects twice in development
    celebrated.current = true
    playFanfare()
    void confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } })
  }, [])

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <h1 className="animate-pop text-3xl font-bold text-violet-700">Brawo, Martynko!</h1>
      <div className="flex flex-wrap justify-center gap-1" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <Star key={i} size={40} className={i < stars ? 'fill-yellow-300 text-amber-400' : 'text-slate-300'} />
        ))}
      </div>
      <p className="text-lg text-slate-700">
        Gwiazdki: {stars} z {total}
      </p>
      <button
        type="button"
        onClick={onAgain}
        className="min-h-14 w-full max-w-xs rounded-3xl bg-violet-500 px-6 text-lg font-bold text-white shadow-md active:scale-95"
      >
        🔄 Gram jeszcze raz
      </button>
      <button
        type="button"
        onClick={onExit}
        className="min-h-14 w-full max-w-xs rounded-3xl bg-white px-6 text-lg font-bold text-violet-700 shadow-md ring-1 ring-violet-200 active:scale-95"
      >
        {exitLabel}
      </button>
    </div>
  )
}
