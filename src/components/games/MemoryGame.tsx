import { useEffect, useRef, useState } from 'react'
import { getAllStories } from '../../data/stories'
import { useSpeech } from '../../hooks/useSpeech'
import { type MemoryCard, buildMemoryDeck, isPair, pickMemoryWords } from '../../utils/games'
import { playPop, playSuccess } from '../../utils/soundEffects'
import { getVocabulary } from '../../utils/vocabulary'
import { WordPicture } from '../pictures/WordPicture'
import { GameFinish } from './GameFinish'
import { GameShell } from './GameShell'

const PAIRS_PER_ROUND = 6
const MISMATCH_MS = 1200
const FINISH_MS = 900

interface MemoryGameProps {
  storyId?: string
  onExit: () => void
}

/** "Pary": memory with a word and its picture; the word is spoken at every flip (D35). */
export function MemoryGame({ storyId, onExit }: MemoryGameProps) {
  const [session, setSession] = useState(0)
  return <MemorySession key={session} storyId={storyId} onExit={onExit} onAgain={() => setSession((s) => s + 1)} />
}

function CardFace({ card }: { card: MemoryCard }) {
  if (card.side === 'word') {
    const long = card.word.key.length > 7
    return (
      <div className="flex h-full w-full flex-col items-center justify-center px-1 text-center">
        <span className={`leading-tight font-bold break-words text-slate-800 ${long ? 'text-sm' : 'text-lg'}`}>
          {card.word.key}
        </span>
        <span className="text-xs leading-tight font-medium text-indigo-600">[{card.word.phoneticsPl}]</span>
      </div>
    )
  }
  return (
    <div className="flex h-full w-full items-center justify-center p-1.5">
      {card.picture ? (
        <WordPicture picture={card.picture} />
      ) : (
        <span className="text-center text-base leading-tight font-bold text-slate-800">{card.word.answerPl}</span>
      )}
    </div>
  )
}

function MemorySession({ storyId, onExit, onAgain }: MemoryGameProps & { onAgain: () => void }) {
  const { speakText, stop } = useSpeech()
  const [deck] = useState(() =>
    buildMemoryDeck(pickMemoryWords(getVocabulary(), getAllStories(), PAIRS_PER_ROUND, Math.random, storyId)),
  )
  const [open, setOpen] = useState<string[]>([])
  const [found, setFound] = useState<string[]>([]) // word keys
  const [locked, setLocked] = useState(false)
  const [finished, setFinished] = useState(false)
  const timers = useRef<number[]>([])
  const pairs = deck.length / 2

  useEffect(() => {
    const list = timers.current
    return () => list.forEach((id) => window.clearTimeout(id))
  }, [])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const exit = () => {
    stop()
    onExit()
  }

  if (finished) {
    return (
      <GameShell total={pairs} done={pairs} onExit={exit}>
        <GameFinish
          stars={pairs}
          total={pairs}
          onAgain={onAgain}
          onExit={exit}
          exitLabel={storyId ? '📚 Do bajek' : undefined}
        />
      </GameShell>
    )
  }

  const tap = (card: MemoryCard) => {
    if (locked) return
    if (found.includes(card.word.key)) {
      speakText(card.word.ttsText)
      return
    }
    if (open.includes(card.id)) return
    playPop()
    speakText(card.word.ttsText)
    if (open.length === 0) {
      setOpen([card.id])
      return
    }
    const first = deck.find((c) => c.id === open[0])
    setOpen([open[0], card.id])
    if (first && isPair(first, card)) {
      playSuccess()
      const nextFound = [...found, card.word.key]
      setFound(nextFound)
      setOpen([])
      if (nextFound.length >= pairs) {
        setLocked(true)
        later(() => setFinished(true), FINISH_MS)
      }
    } else {
      setLocked(true)
      later(() => {
        setOpen([])
        setLocked(false)
      }, MISMATCH_MS)
    }
  }

  return (
    <GameShell total={pairs} done={found.length} onExit={exit}>
      <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-4 gap-2">
        {deck.map((card) => {
          const isFound = found.includes(card.word.key)
          const isOpen = isFound || open.includes(card.id)
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => tap(card)}
              aria-label={isOpen ? card.word.answerPl : 'Karta'}
              className="flip-card min-h-0 min-w-0 rounded-2xl active:scale-95"
            >
              <div className={`flip-inner ${isOpen ? 'is-open' : ''}`}>
                <div className="flip-face flex items-center justify-center rounded-2xl bg-violet-200 text-3xl shadow-md ring-1 ring-violet-300">
                  <span aria-hidden="true">💎</span>
                </div>
                <div
                  className={`flip-face flip-front rounded-2xl bg-white shadow-md ${
                    isFound ? 'ring-4 ring-emerald-400' : 'ring-1 ring-violet-100'
                  }`}
                >
                  <CardFace card={card} />
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </GameShell>
  )
}
