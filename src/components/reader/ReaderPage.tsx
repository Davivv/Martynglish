import { Eye, EyeOff, Turtle, Volume2 } from 'lucide-react'
import { useState } from 'react'
import type { useSpeech } from '../../hooks/useSpeech'
import type { StoryPage, WordToken } from '../../types/story'
import { playPop } from '../../utils/soundEffects'
import { flashcardOf } from '../../utils/storyGuardian'
import { getVocabulary, trackWordClick } from '../../utils/vocabulary'
import { InteractiveStoryStage } from '../stage/InteractiveStoryStage'
import { WordBlock } from './WordBlock'
import { blockSizeClass } from './blockSize'

type Speech = ReturnType<typeof useSpeech>

interface ReaderPageProps {
  storyId: string
  page: StoryPage
  speech: Speech
}

/**
 * One story page. The reader mounts it with `key={pageNumber}`, so the veil, the owl's
 * selection and the local state reset on every page change.
 */
export function ReaderPage({ storyId, page, speech }: ReaderPageProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [added, setAdded] = useState(false)
  const [savedKeys, setSavedKeys] = useState(() => new Set(Object.keys(getVocabulary())))
  const token: WordToken | null = selected === null ? null : page.words[selected]
  const sizeClass = blockSizeClass(page.words.length)

  const ctx = { storyId, pageNumber: page.pageNumber, sentenceEn: page.sentenceEn }

  const tapWord = (i: number) => {
    const t = page.words[i]
    playPop()
    speech.speakWord(t)
    trackWordClick(t, ctx)
    setSavedKeys(new Set(Object.keys(getVocabulary())))
    setSelected(i)
    setAdded(false)
  }

  const addToFlashcards = () => {
    if (!token) return
    trackWordClick(token, ctx, true)
    setAdded(true)
  }

  return (
    <>
      <div className="relative min-h-28 max-h-56 flex-1 overflow-hidden rounded-3xl shadow-md ring-1 ring-black/5">
        <div className="absolute inset-0">
          <InteractiveStoryStage
            visualConfig={page.visualConfig}
            imageUrl={page.imageUrl}
            altText={page.imageAltPl}
            interactiveSoundText={page.interactiveSoundText}
            onCharacterTap={(text) => {
              playPop()
              speech.speakText(text)
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-3xl bg-amber-50 p-2 shadow-sm ring-1 ring-amber-100">
        <span className="text-3xl" aria-hidden="true">
          🦉
        </span>
        <div className="min-w-0 flex-1 text-sm leading-snug text-slate-700">
          {token ? (
            <>
              <span className="font-bold">{token.word}</span>{' '}
              <span className="font-medium text-indigo-600">[{token.phoneticsPl}]</span> ={' '}
              <span className="font-bold">{token.translationPl}</span> {token.isKeyword ? '💎' : ''}
              {!token.isKeyword &&
                (added || savedKeys.has(flashcardOf(token).key) ? (
                  <span className="ml-1 font-medium text-emerald-600">✓ jest w fiszkach</span>
                ) : (
                  <button
                    type="button"
                    onClick={addToFlashcards}
                    className="ml-1 inline-flex min-h-12 items-center rounded-2xl bg-violet-100 px-3 text-sm font-semibold text-violet-700 active:scale-95"
                  >
                    + Dodaj do fiszek
                  </button>
                ))}
            </>
          ) : (
            'Dotknij klocka, a powiem Ci, co znaczy!'
          )}
        </div>
        <button
          type="button"
          onClick={() => speech.speakSentence(page.words)}
          className="flex min-h-12 min-w-14 flex-col items-center justify-center rounded-2xl bg-sky-100 px-2 text-xs font-semibold text-sky-800 shadow-sm active:scale-95"
        >
          <Volume2 size={20} aria-hidden="true" />
          Posłuchaj
        </button>
        <button
          type="button"
          onClick={() => speech.speakSlow(page.words)}
          className="flex min-h-12 min-w-14 flex-col items-center justify-center rounded-2xl bg-emerald-100 px-2 text-xs font-semibold text-emerald-800 shadow-sm active:scale-95"
        >
          <Turtle size={20} aria-hidden="true" />
          Żółwik
        </button>
      </div>

      <div className="flex flex-none flex-wrap content-center justify-center gap-2 py-1">
        {page.words.map((w, i) => (
          <WordBlock
            key={`${i}-${w.word}`}
            token={w}
            lit={speech.activeIndex === i}
            selected={selected === i}
            sizeClass={sizeClass}
            onTap={() => tapWord(i)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setRevealed((r) => !r)}
        aria-pressed={revealed}
        className="relative flex min-h-12 flex-none items-center justify-center overflow-hidden rounded-3xl bg-white px-4 py-1.5 text-center shadow-sm ring-1 ring-violet-100"
      >
        <span
          className={`${page.words.length >= 8 ? 'text-sm' : 'text-base'} leading-snug font-medium text-slate-700 transition ${revealed ? '' : 'blur-md select-none'}`}
        >
          {page.sentencePl}
        </span>
        {!revealed && (
          <span className="absolute inset-0 flex items-center justify-center gap-2 text-sm font-semibold text-violet-700">
            <Eye size={20} aria-hidden="true" /> Sprawdź całe zdanie po polsku
          </span>
        )}
        {revealed && <EyeOff size={18} className="absolute top-2 right-3 text-violet-400" aria-hidden="true" />}
      </button>
    </>
  )
}
