import { Volume2 } from 'lucide-react'
import { useState } from 'react'
import type { PictureWord } from '../../data/wordPictures'
import { useSpeech } from '../../hooks/useSpeech'
import { STICKER_WORDS } from '../../utils/mission'
import { loadStickers } from '../../utils/storage'
import { WordPicture } from '../pictures/WordPicture'

interface StickerAlbumProps {
  onBack: () => void
}

/** Slight tilt per slot so the tiles look like stuck-on stickers. */
const tilt = (i: number) => [-4, 3, -2, 5, -5, 2][i % 6]

export function StickerAlbum({ onBack }: StickerAlbumProps) {
  const speech = useSpeech()
  const [owned] = useState(loadStickers)
  const [current, setCurrent] = useState<PictureWord | null>(null)

  const tap = (word: PictureWord) => {
    setCurrent(word)
    speech.speakText(word.key)
  }

  const exit = () => {
    speech.stop()
    onBack()
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-3 px-4 py-4">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={exit}
            className="min-h-12 rounded-2xl bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 active:scale-95"
          >
            ⬅️ Wróć
          </button>
          <h1 className="text-2xl font-bold text-violet-700">Moje naklejki</h1>
        </header>
        {owned.length === 0 && (
          <p className="rounded-2xl bg-amber-50 px-3 py-2 text-center text-base text-slate-700">
            Zrób dzisiejszą misję, a dostaniesz pierwszą naklejkę!
          </p>
        )}
        <div className="grid grid-cols-4 gap-2">
          {STICKER_WORDS.map((word, i) =>
            owned.includes(word.key) ? (
              <button
                key={word.key}
                type="button"
                onClick={() => tap(word)}
                aria-label={word.answerPl}
                className="aspect-square rounded-2xl bg-white p-1.5 shadow-md ring-1 ring-violet-100 active:scale-95"
                style={{ transform: `rotate(${tilt(i)}deg)` }}
              >
                <WordPicture picture={word.picture} />
              </button>
            ) : (
              <div
                key={word.key}
                aria-hidden="true"
                className="flex aspect-square items-center justify-center rounded-2xl bg-slate-200 text-2xl"
              >
                ❓
              </div>
            ),
          )}
        </div>
      </div>
      {current && (
        <div className="sticky bottom-0 flex items-center gap-3 border-t border-violet-100 bg-white px-4 py-2 shadow-[0_-4px_12px_rgba(139,92,246,0.08)]">
          <p className="min-w-0 flex-1 text-base font-bold text-slate-800">
            {current.key} <span className="text-indigo-600">[{current.phoneticsPl}]</span> = {current.answerPl}
          </p>
          <button
            type="button"
            onClick={() => speech.speakText(current.key)}
            aria-label="Posłuchaj słowa"
            className="flex size-12 flex-none items-center justify-center rounded-full bg-sky-100 text-sky-800 shadow-sm active:scale-95"
          >
            <Volume2 size={26} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
