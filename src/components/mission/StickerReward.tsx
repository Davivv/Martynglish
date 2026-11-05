import confetti from 'canvas-confetti'
import { Volume2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { PictureWord } from '../../data/wordPictures'
import { useSpeech } from '../../hooks/useSpeech'
import { playFanfare } from '../../utils/soundEffects'
import { WordPicture } from '../pictures/WordPicture'

interface StickerRewardProps {
  sticker: PictureWord
  onClose: () => void
}

/** Overlay after claiming a sticker (D36). The English word is spoken once on open. */
export function StickerReward({ sticker, onClose }: StickerRewardProps) {
  const { speakText, stop, voiceStatus } = useSpeech()
  const celebrated = useRef(false)
  const spoken = useRef(false)

  useEffect(() => {
    if (celebrated.current) return // StrictMode runs effects twice in development
    celebrated.current = true
    playFanfare()
    void confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
  }, [])

  // Voices load late, so the first speech waits for `ready`.
  useEffect(() => {
    if (voiceStatus !== 'ready' || spoken.current) return
    spoken.current = true
    speakText(sticker.key)
  }, [voiceStatus, speakText, sticker.key])

  const close = () => {
    stop()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="flex w-full max-w-xs flex-col items-center gap-3 rounded-3xl bg-white p-5 text-center shadow-2xl">
        <h2 className="animate-pop text-2xl font-bold text-violet-700">Nowa naklejka!</h2>
        <div className="h-40 w-40">
          <WordPicture picture={sticker.picture} />
        </div>
        <p className="text-lg font-bold text-slate-800">
          {sticker.key} <span className="text-indigo-600">[{sticker.phoneticsPl}]</span> = {sticker.answerPl}
        </p>
        <button
          type="button"
          onClick={() => speakText(sticker.key)}
          aria-label="Posłuchaj słowa"
          className="flex size-14 items-center justify-center rounded-full bg-sky-100 text-sky-800 shadow-md active:scale-95"
        >
          <Volume2 size={30} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={close}
          className="min-h-14 w-full rounded-3xl bg-violet-500 px-6 text-lg font-bold text-white shadow-md active:scale-95"
        >
          Super!
        </button>
      </div>
    </div>
  )
}
