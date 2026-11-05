import confetti from 'canvas-confetti'
import { Volume2 } from 'lucide-react'
import { useState } from 'react'
import { getAllStories } from '../../data/stories'
import { useSpeech } from '../../hooks/useSpeech'
import type { StoryPage } from '../../types/story'
import { isNextBlock, pickSentences, shuffleBlocks } from '../../utils/games'
import { loadProgress } from '../../utils/progress'
import { playError, playPop, playSuccess } from '../../utils/soundEffects'
import { blockSizeClass } from '../reader/blockSize'
import { WordBlock } from '../reader/WordBlock'
import { InteractiveStoryStage } from '../stage/InteractiveStoryStage'
import { GameFinish } from './GameFinish'
import { GameShell } from './GameShell'

const SENTENCES_PER_ROUND = 4

interface SentenceGameProps {
  storyId?: string
  onExit: () => void
}

/** "Ułóż zdanie": rebuild a story sentence from blocks, the Polish sentence is the prompt (D34). */
export function SentenceGame({ storyId, onExit }: SentenceGameProps) {
  const [session, setSession] = useState(0)
  return <SentenceSession key={session} storyId={storyId} onExit={onExit} onAgain={() => setSession((s) => s + 1)} />
}

function SentenceSession({ storyId, onExit, onAgain }: SentenceGameProps & { onAgain: () => void }) {
  const speech = useSpeech()
  const [pages] = useState(() =>
    pickSentences(getAllStories(), loadProgress(), SENTENCES_PER_ROUND, Math.random, storyId).map(({ page }) => page),
  )
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const [perfect, setPerfect] = useState(0)
  const total = pages.length
  const page = pages[index]

  const exit = () => {
    speech.stop()
    onExit()
  }

  if (finished || !page) {
    return (
      <GameShell total={total} done={total} onExit={exit}>
        <GameFinish stars={perfect} total={total} onAgain={onAgain} onExit={exit} />
      </GameShell>
    )
  }

  return (
    <SentenceRound
      key={index}
      page={page}
      speech={speech}
      total={total}
      index={index}
      mistakes={mistakes}
      onMistake={() => setMistakes((m) => m + 1)}
      onExit={exit}
      onNext={(clean) => {
        speech.stop()
        if (clean) setPerfect((n) => n + 1)
        setMistakes(0)
        if (index + 1 >= total) setFinished(true)
        else setIndex(index + 1)
      }}
    />
  )
}

interface RoundProps {
  page: StoryPage
  speech: ReturnType<typeof useSpeech>
  total: number
  index: number
  mistakes: number
  onMistake: () => void
  onExit: () => void
  onNext: (clean: boolean) => void
}

function SentenceRound({ page, speech, total, index, mistakes, onMistake, onExit, onNext }: RoundProps) {
  const words = page.words
  const [bank, setBank] = useState(() => shuffleBlocks(words))
  const [placed, setPlaced] = useState(0)
  const [shaking, setShaking] = useState<number | null>(null)
  const done = placed >= words.length
  const sizeClass = blockSizeClass(words.length)

  const tap = (blockIndex: number) => {
    if (done) return
    if (isNextBlock(words, placed, blockIndex)) {
      const next = placed + 1
      setBank((b) => b.filter((v) => v !== blockIndex))
      setPlaced(next)
      if (next >= words.length) {
        playSuccess()
        void confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } })
        speech.speakSentence(words)
      } else {
        playPop()
        speech.speakWord(words[placed])
      }
    } else {
      playError()
      onMistake()
      setShaking(blockIndex)
    }
  }

  return (
    <GameShell total={total} done={index + (done ? 1 : 0)} onExit={onExit}>
      <div className="relative min-h-20 max-h-36 flex-1 overflow-hidden rounded-3xl shadow-md ring-1 ring-black/5">
        <div className="absolute inset-0">
          <InteractiveStoryStage
            visualConfig={page.visualConfig}
            imageUrl={page.imageUrl}
            altText={page.imageAltPl}
          />
        </div>
      </div>

      <div className="mt-2 flex flex-none items-center justify-center gap-2">
        <p className="min-w-0 text-center text-base leading-snug font-bold text-slate-800">{page.sentencePl}</p>
        <button
          type="button"
          onClick={() => speech.speakSentence(words)}
          aria-label="Posłuchaj zdania"
          className="flex size-12 flex-none items-center justify-center rounded-full bg-sky-100 text-sky-800 shadow-sm active:scale-95"
        >
          <Volume2 size={26} aria-hidden="true" />
        </button>
      </div>

      <div className="mt-2 flex min-h-16 flex-none flex-wrap content-center justify-center gap-1.5 rounded-3xl bg-violet-50 p-2 ring-1 ring-violet-100">
        {words.slice(0, placed).map((w, i) => (
          <WordBlock
            key={i}
            token={w}
            lit={speech.activeIndex === i}
            selected={false}
            sizeClass={sizeClass}
            onTap={() => speech.speakWord(w)}
          />
        ))}
        {!done && (
          <span className="min-h-12 min-w-14 rounded-2xl border-2 border-dashed border-violet-300" aria-hidden="true" />
        )}
      </div>

      <div className="mt-2 flex flex-none flex-wrap content-center justify-center gap-2">
        {bank.map((blockIndex) => {
          const { punctuation: _punctuation, ...bare } = words[blockIndex]
          return (
            <div
              key={blockIndex}
              className={shaking === blockIndex ? 'animate-shake' : ''}
              onAnimationEnd={() => setShaking((s) => (s === blockIndex ? null : s))}
            >
              <WordBlock token={bare} lit={false} selected={false} sizeClass={sizeClass} onTap={() => tap(blockIndex)} />
            </div>
          )
        })}
      </div>

      {done && (
        <button
          type="button"
          onClick={() => onNext(mistakes === 0)}
          className="mt-2 min-h-14 flex-none rounded-3xl bg-violet-500 px-6 text-lg font-bold text-white shadow-md active:scale-95"
        >
          Dalej ➡️
        </button>
      )}
    </GameShell>
  )
}
