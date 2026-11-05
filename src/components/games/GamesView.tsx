import { useSpeech } from '../../hooks/useSpeech'
import type { GameId } from '../../utils/games'
import { VOICE_MISSING_TEXT } from './texts'

interface GamesViewProps {
  onPlay: (game: GameId) => void
}

export function GamesView({ onPlay }: GamesViewProps) {
  const { voiceStatus } = useSpeech()
  const missing = voiceStatus === 'missing'

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold text-violet-700">Zabawy</h1>
      <button
        type="button"
        disabled={missing}
        onClick={() => onPlay('listening')}
        className="flex min-h-24 items-center gap-4 rounded-3xl bg-white p-4 text-left shadow-md ring-1 ring-violet-100 active:scale-95 disabled:opacity-60"
      >
        <span className="text-4xl" aria-hidden="true">
          {missing ? '🔇' : '🎧'}
        </span>
        <span className="min-w-0">
          <span className="block text-lg font-bold text-slate-800">Posłuchaj i znajdź</span>
          <span className="block text-sm text-slate-600">
            {missing ? VOICE_MISSING_TEXT : 'Słuchasz słowa i dotykasz obrazka.'}
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => onPlay('sentence')}
        className="flex min-h-24 items-center gap-4 rounded-3xl bg-white p-4 text-left shadow-md ring-1 ring-violet-100 active:scale-95"
      >
        <span className="text-4xl" aria-hidden="true">
          🧩
        </span>
        <span className="min-w-0">
          <span className="block text-lg font-bold text-slate-800">Ułóż zdanie</span>
          <span className="block text-sm text-slate-600">Układasz klocki w dobrej kolejności.</span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => onPlay('memory')}
        className="flex min-h-24 items-center gap-4 rounded-3xl bg-white p-4 text-left shadow-md ring-1 ring-violet-100 active:scale-95"
      >
        <span className="text-4xl" aria-hidden="true">
          🃏
        </span>
        <span className="min-w-0">
          <span className="block text-lg font-bold text-slate-800">Pary</span>
          <span className="block text-sm text-slate-600">Szukasz słowa i jego obrazka.</span>
        </span>
      </button>
    </div>
  )
}
