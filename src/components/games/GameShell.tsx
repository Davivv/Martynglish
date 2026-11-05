import { Home, Star } from 'lucide-react'
import type { ReactNode } from 'react'

interface GameShellProps {
  /** Number of words in the round. */
  total: number
  /** Words finished so far. */
  done: number
  onExit: () => void
  children: ReactNode
}

/** Full-screen frame shared by all games (D33): exit button, star progress, content below. */
export function GameShell({ total, done, onExit, children }: GameShellProps) {
  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col gap-2 overflow-hidden bg-paper px-4 pt-2 pb-3">
      <header className="flex flex-none items-center gap-3">
        <button
          type="button"
          onClick={onExit}
          className="flex min-h-12 items-center gap-1 rounded-2xl bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 active:scale-95"
        >
          <Home size={20} aria-hidden="true" /> Wyjdź
        </button>
        <div className="flex min-w-0 flex-1 justify-center gap-1.5" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <Star key={i} size={18} className={i < done ? 'fill-yellow-300 text-amber-400' : 'text-slate-300'} />
          ))}
        </div>
        <div className="w-[76px]" aria-hidden="true" />
      </header>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
