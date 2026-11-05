import confetti from 'canvas-confetti'
import { Volume2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getAllStories } from '../../data/stories'
import { useSpeech } from '../../hooks/useSpeech'
import { type GameWord, type ListeningOption, buildListeningRound, pickListeningWords } from '../../utils/games'
import { playError, playSuccess } from '../../utils/soundEffects'
import { getVocabulary } from '../../utils/vocabulary'
import { WordPicture } from '../pictures/WordPicture'
import { GameFinish } from './GameFinish'
import { GameShell } from './GameShell'
import { VOICE_MISSING_TEXT } from './texts'

const WORDS_PER_ROUND = 6

interface ListeningGameProps {
  storyId?: string
  onExit: () => void
}

interface Round {
  word: GameWord
  options: ListeningOption[]
}

function buildRounds(storyId?: string): Round[] {
  const vocab = getVocabulary()
  const pool = Object.values(vocab).map((e) => e.answerPl)
  return pickListeningWords(vocab, getAllStories(), WORDS_PER_ROUND, Math.random, storyId).map((word) => ({
    word,
    options: buildListeningRound(word, pool),
  }))
}

/** "Posłuchaj i znajdź": the word is heard, the answer is a picture (D33). */
export function ListeningGame({ storyId, onExit }: ListeningGameProps) {
  const [session, setSession] = useState(0)
  return <ListeningSession key={session} storyId={storyId} onExit={onExit} onAgain={() => setSession((s) => s + 1)} />
}

interface SessionProps extends ListeningGameProps {
  onAgain: () => void
}

function ListeningSession({ storyId, onExit, onAgain }: SessionProps) {
  const speech = useSpeech()
  const { speakText, stop, voiceStatus } = speech
  const [rounds] = useState(() => buildRounds(storyId))
  const [index, setIndex] = useState(0)
  const [wrong, setWrong] = useState<string[]>([])
  const [shaking, setShaking] = useState<string | null>(null)
  const [solved, setSolved] = useState(false)
  const [firstTry, setFirstTry] = useState(0)
  const [finished, setFinished] = useState(false)

  const total = rounds.length
  const round = rounds[index]

  // Speaks each new question; voices load late, so it also reacts to `voiceStatus`.
  useEffect(() => {
    if (finished || !round || voiceStatus !== 'ready') return
    speakText(round.word.ttsText)
  }, [index, voiceStatus, finished, round, speakText])

  const exit = () => {
    stop()
    onExit()
  }

  if (voiceStatus === 'missing') {
    return (
      <GameShell total={total} done={0} onExit={exit}>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <p className="rounded-2xl bg-amber-100 px-4 py-3 text-base text-amber-900">🔇 {VOICE_MISSING_TEXT}</p>
          <button
            type="button"
            onClick={exit}
            className="min-h-14 rounded-3xl bg-violet-500 px-6 text-lg font-bold text-white shadow-md active:scale-95"
          >
            🎮 Do zabaw
          </button>
        </div>
      </GameShell>
    )
  }

  if (finished || !round) {
    return (
      <GameShell total={total} done={total} onExit={exit}>
        <GameFinish stars={firstTry} total={total} onAgain={onAgain} onExit={exit} />
      </GameShell>
    )
  }

  const answer = (option: ListeningOption) => {
    if (solved || wrong.includes(option.answerPl)) return
    if (option.correct) {
      playSuccess()
      setSolved(true)
      if (wrong.length === 0) setFirstTry((n) => n + 1)
      void confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } })
    } else {
      playError()
      setWrong((w) => [...w, option.answerPl])
      setShaking(option.answerPl)
    }
    speakText(round.word.ttsText)
  }

  const next = () => {
    stop()
    if (index + 1 >= total) {
      setFinished(true)
      return
    }
    setWrong([])
    setShaking(null)
    setSolved(false)
    setIndex(index + 1)
  }

  return (
    <GameShell total={total} done={index + (solved ? 1 : 0)} onExit={exit}>
      <div className="flex flex-none flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-violet-700">Co słyszysz?</h1>
        <button
          type="button"
          onClick={() => speakText(round.word.ttsText)}
          aria-label="Posłuchaj jeszcze raz"
          className="flex size-[72px] items-center justify-center rounded-full bg-sky-100 text-sky-800 shadow-md active:scale-95"
        >
          <Volume2 size={40} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-3 flex min-h-0 flex-1 flex-col gap-2">
        {round.options.map((option) => {
          const isWrong = wrong.includes(option.answerPl)
          const isRight = solved && option.correct
          return (
            <button
              key={option.answerPl}
              type="button"
              aria-label={option.answerPl}
              disabled={solved || isWrong}
              onClick={() => answer(option)}
              onAnimationEnd={() => setShaking((s) => (s === option.answerPl ? null : s))}
              className={`flex min-h-0 flex-1 items-center justify-center rounded-3xl p-2 shadow-md transition active:scale-95 ${
                isRight
                  ? 'bg-emerald-300 ring-4 ring-emerald-500'
                  : isWrong
                    ? 'bg-rose-100 opacity-70'
                    : 'bg-white ring-1 ring-violet-100'
              } ${shaking === option.answerPl ? 'animate-shake' : ''} ${solved && !isRight ? 'opacity-40' : ''}`}
            >
              {option.picture ? (
                <WordPicture picture={option.picture} />
              ) : (
                <span className="text-3xl font-bold text-slate-800">{option.answerPl}</span>
              )}
            </button>
          )
        })}
      </div>

      {solved && (
        <div className="mt-2 flex flex-none items-center gap-3 rounded-3xl bg-emerald-50 p-2 pl-4 ring-1 ring-emerald-200">
          <p className="min-w-0 flex-1 text-base font-bold text-slate-800">
            {round.word.key} <span className="text-indigo-600">[{round.word.phoneticsPl}]</span> = {round.word.answerPl}
          </p>
          <button
            type="button"
            onClick={next}
            className="min-h-14 flex-none rounded-3xl bg-violet-500 px-5 text-lg font-bold text-white shadow-md active:scale-95"
          >
            Dalej ➡️
          </button>
        </div>
      )}
    </GameShell>
  )
}
