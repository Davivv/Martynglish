import type { WordToken } from '../../types/story'

interface WordBlockProps {
  token: WordToken
  /** Karaoke highlight (whole block, also for "ice cream"). */
  lit: boolean
  selected: boolean
  /** Text size class chosen by the number of blocks so the longest sentence fits (D20). */
  sizeClass: string
  onTap: () => void
}

export function WordBlock({ token, lit, selected, sizeClass, onTap }: WordBlockProps) {
  const state = lit
    ? 'bg-yellow-200 scale-105 ring-2 ring-amber-400'
    : selected
      ? 'bg-violet-100 ring-2 ring-violet-300'
      : 'bg-white ring-1 ring-violet-100'
  return (
    <button
      type="button"
      onClick={onTap}
      className={`flex min-h-12 min-w-12 flex-col items-center justify-center rounded-2xl px-3 py-0.5 shadow-md transition active:scale-95 ${state}`}
    >
      <span className={`font-bold leading-tight text-slate-800 ${sizeClass}`}>
        {token.word}
        {token.punctuation}
      </span>
      <span className="text-[13px] leading-tight font-medium text-indigo-600">{token.phoneticsPl}</span>
    </button>
  )
}
