import type { ReaderTone } from '../../data/shelves'
import type { WordToken } from '../../types/story'

interface WordBlockProps {
  token: WordToken
  /** Karaoke highlight (whole block, also for "ice cream"). */
  lit: boolean
  selected: boolean
  /** Text size class chosen by the number of blocks so the longest sentence fits (D20). */
  sizeClass: string
  tone?: ReaderTone
  onTap: () => void
}

const STATE = {
  light: {
    lit: 'bg-yellow-200 scale-105 ring-2 ring-amber-400',
    selected: 'bg-violet-100 ring-2 ring-violet-300',
    idle: 'bg-white ring-1 ring-violet-100',
    word: 'text-slate-800',
    phonetics: 'text-indigo-600',
  },
  dark: {
    lit: 'bg-yellow-300 scale-105 ring-2 ring-amber-200',
    selected: 'bg-violet-700 ring-2 ring-violet-300',
    idle: 'bg-[#2b2470] ring-1 ring-[#6d5ef0]/70',
    word: 'text-white',
    phonetics: 'text-cyan-200',
  },
} as const

export function WordBlock({ token, lit, selected, sizeClass, tone = 'light', onTap }: WordBlockProps) {
  const c = STATE[tone]
  const state = lit ? c.lit : selected ? c.selected : c.idle
  // A highlighted block on the dark panel is bright yellow, so its text goes dark.
  const wordColor = lit && tone === 'dark' ? 'text-slate-900' : c.word
  const phoneticsColor = lit && tone === 'dark' ? 'text-indigo-900' : c.phonetics
  return (
    <button
      type="button"
      onClick={onTap}
      className={`flex min-h-12 min-w-12 flex-col items-center justify-center rounded-2xl px-3 py-0.5 shadow-md transition active:scale-95 ${state}`}
    >
      <span className={`font-bold leading-tight ${wordColor} ${sizeClass}`}>
        {token.word}
        {token.punctuation}
      </span>
      <span className={`text-[13px] leading-tight font-medium ${phoneticsColor}`}>{token.phoneticsPl}</span>
    </button>
  )
}
