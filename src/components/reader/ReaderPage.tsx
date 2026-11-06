import { Eye, EyeOff, Turtle, Volume2 } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import type { ReaderTone } from '../../data/shelves'
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
  tone: ReaderTone
  /** Top-left button on the picture. */
  exitButton: ReactNode
  /** Top-right label on the picture, e.g. "3 z 6". */
  counter: string
  /** Hint for the first page until the child taps a block. */
  showHint: boolean
  onWordTapped: () => void
  /** Back / next / end buttons, rendered at the bottom of the panel. */
  nav: ReactNode
}

const GLASS = 'bg-slate-900/75 text-white backdrop-blur-sm'

/**
 * One story page. The reader mounts it with `key={pageNumber}`, so the veil, the selection and the
 * local state reset on every page change. Layout (D40): the picture fills the free height, the panel
 * with blocks, veil and navigation overlaps it by 16 px and is never cut.
 */
export function ReaderPage({
  storyId,
  page,
  speech,
  tone,
  exitButton,
  counter,
  showHint,
  onWordTapped,
  nav,
}: ReaderPageProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [added, setAdded] = useState(false)
  const [mode, setMode] = useState<'normal' | 'slow' | null>(null)
  const [savedKeys, setSavedKeys] = useState(() => new Set(Object.keys(getVocabulary())))
  const token: WordToken | null = selected === null ? null : page.words[selected]
  const sizeClass = blockSizeClass(page.words.length)
  const dark = tone === 'dark'
  const hasImage = page.imageUrl !== undefined

  const ctx = { storyId, pageNumber: page.pageNumber, sentenceEn: page.sentenceEn }
  // Every speech source sets `mode` (null for single words and hero lines), so a stale value never lights a button.
  const playing = speech.speaking ? mode : null

  const tapWord = (i: number) => {
    const t = page.words[i]
    playPop()
    setMode(null)
    speech.speakWord(t)
    trackWordClick(t, ctx)
    setSavedKeys(new Set(Object.keys(getVocabulary())))
    setSelected(i)
    setAdded(false)
    onWordTapped()
  }

  const addToFlashcards = () => {
    if (!token) return
    trackWordClick(token, ctx, true)
    setAdded(true)
  }

  const roundButton = (active: boolean) =>
    `flex size-12 items-center justify-center rounded-full shadow-lg transition active:scale-90 ${
      active ? 'animate-pulse bg-violet-500 text-white ring-2 ring-white' : GLASS
    }`

  return (
    <>
      <div className={`relative min-h-0 ${hasImage ? 'flex-[1_1_0]' : 'flex-[4_1_0]'}`} style={hasImage ? undefined : { maxHeight: 'min(100vw, 28rem)' }}>
        <div className="absolute inset-0">
          <InteractiveStoryStage
            visualConfig={page.visualConfig}
            imageUrl={page.imageUrl}
            altText={page.imageAltPl}
            interactiveSoundText={page.interactiveSoundText}
            onCharacterTap={(text) => {
              playPop()
              setMode(null)
              speech.speakText(text)
            }}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between">
          <div className="pointer-events-auto">{exitButton}</div>
          <div className={`flex min-h-12 items-center rounded-2xl px-3 text-sm font-semibold ${GLASS}`}>{counter}</div>
        </div>

        {speech.voiceStatus === 'missing' && (
          <p className="absolute inset-x-3 top-[4.5rem] rounded-2xl bg-amber-100 px-3 py-1 text-xs leading-snug text-amber-900 shadow">
            🔇 Dla dorosłego: brak angielskiego głosu w telefonie.
          </p>
        )}

        <div className="pointer-events-none absolute right-3 bottom-[26px] left-3 flex items-end justify-between gap-2">
          <div className="pointer-events-auto min-w-0 flex-1">
            {(token || showHint) && (
              <div className="flex max-w-[15.5rem] items-center gap-2 rounded-2xl bg-white/95 p-2 text-sm leading-snug text-slate-800 shadow-lg">
                <span className="text-2xl" aria-hidden="true">
                  🦉
                </span>
                <div className="min-w-0 flex-1">
                  {token ? (
                    <>
                      <span className="font-bold">{token.word}</span>{' '}
                      <span className="font-medium text-indigo-600">[{token.phoneticsPl}]</span> ={' '}
                      <span className="font-bold">{token.translationPl}</span> {token.isKeyword ? '💎' : ''}
                      {!token.isKeyword &&
                        (added || savedKeys.has(flashcardOf(token).key) ? (
                          <span className="mt-0.5 block font-medium text-emerald-700">✓ jest w fiszkach</span>
                        ) : (
                          <button
                            type="button"
                            onClick={addToFlashcards}
                            className="mt-1 flex min-h-12 items-center rounded-2xl bg-violet-100 px-3 text-sm font-semibold text-violet-700 active:scale-95"
                          >
                            + Dodaj do fiszek
                          </button>
                        ))}
                    </>
                  ) : (
                    'Dotknij klocka, a powiem Ci, co znaczy!'
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="pointer-events-auto flex flex-none gap-2">
            <button
              type="button"
              aria-label="Posłuchaj"
              aria-pressed={playing === 'normal'}
              onClick={() => {
                setMode('normal')
                speech.speakSentence(page.words)
              }}
              className={roundButton(playing === 'normal')}
            >
              <Volume2 size={24} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Żółwik, czytaj powoli"
              aria-pressed={playing === 'slow'}
              onClick={() => {
                setMode('slow')
                speech.speakSlow(page.words)
              }}
              className={roundButton(playing === 'slow')}
            >
              <Turtle size={24} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`relative z-10 -mt-4 flex flex-col rounded-t-3xl px-4 pt-3.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_14px_rgba(0,0,0,0.15)] ${
          dark ? 'bg-[#171347]' : 'bg-paper'
        } ${hasImage ? 'flex-none' : 'flex-[1_0_auto]'}`}
      >
        <div className="flex flex-wrap content-center justify-center gap-2">
          {page.words.map((w, i) => (
            <WordBlock
              key={`${i}-${w.word}`}
              token={w}
              lit={speech.activeIndex === i}
              selected={selected === i}
              sizeClass={sizeClass}
              tone={tone}
              onTap={() => tapWord(i)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          aria-pressed={revealed}
          className={`relative mt-2.5 flex min-h-12 flex-none items-center justify-center overflow-hidden rounded-3xl px-4 py-1.5 text-center ${
            dark ? 'bg-[#2b2470]' : 'bg-white shadow-sm ring-1 ring-violet-100'
          }`}
        >
          <span
            className={`${page.words.length >= 8 ? 'text-sm' : 'text-base'} leading-snug font-medium transition ${
              dark ? 'text-violet-100' : 'text-slate-700'
            } ${revealed ? 'px-6' : 'blur-md select-none'}`}
          >
            {page.sentencePl}
          </span>
          {!revealed && (
            <span
              className={`absolute inset-0 flex items-center justify-center gap-2 text-sm font-semibold ${
                dark ? 'text-violet-200' : 'text-violet-700'
              }`}
            >
              <Eye size={20} aria-hidden="true" /> Sprawdź po polsku
            </span>
          )}
          {revealed && (
            <EyeOff
              size={18}
              className={`absolute top-2 right-3 ${dark ? 'text-violet-300' : 'text-violet-400'}`}
              aria-hidden="true"
            />
          )}
        </button>

        <div className="mt-auto pt-2.5">{nav}</div>
      </div>
    </>
  )
}
