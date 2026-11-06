import { useState } from 'react'
import type { PictureWord } from '../../data/wordPictures'
import { STICKER_WORDS, claimSticker, getMissionState } from '../../utils/mission'
import { loadStickers } from '../../utils/storage'
import type { MainView } from '../nav/BottomNav'
import { StickerReward } from './StickerReward'

interface MissionCardProps {
  /** Stars earned for finished stories, shown in the row. */
  stars: number
  onNavigate: (view: MainView) => void
  onOpenAlbum: () => void
}

function Step({ done, emoji, label, onTap }: { done: boolean; emoji: string; label: string; onTap?: () => void }) {
  return (
    <button
      type="button"
      onClick={onTap}
      aria-label={`${label}${done ? ', zrobione' : ''}`}
      className={`flex size-12 flex-none items-center justify-center rounded-2xl text-xl shadow-sm ${
        done ? 'bg-emerald-200' : 'bg-white ring-1 ring-violet-100'
      } ${onTap ? 'active:scale-95' : ''}`}
    >
      <span aria-hidden="true">{done ? '✅' : emoji}</span>
    </button>
  )
}

/** Today's mission in one row: read, repeat, play, stars, sticker album. The sticker is claimed here (D36). */
export function MissionCard({ stars, onNavigate, onOpenAlbum }: MissionCardProps) {
  const [state, setState] = useState(() => getMissionState())
  const [owned, setOwned] = useState(() => loadStickers().length)
  const [reward, setReward] = useState<PictureWord | null>(null)

  const claim = () => {
    const sticker = claimSticker()
    setState(getMissionState())
    setOwned(loadStickers().length)
    if (sticker) setReward(sticker)
  }

  const album = (
    <button
      type="button"
      onClick={onOpenAlbum}
      aria-label={`Moje naklejki: ${owned} z ${STICKER_WORDS.length}`}
      className="flex min-h-12 min-w-12 flex-none items-center justify-center gap-1 rounded-2xl bg-white px-2 text-base font-bold text-violet-700 shadow-sm ring-1 ring-violet-200 active:scale-95"
    >
      <span aria-hidden="true">📒</span>
      {owned}
    </button>
  )

  return (
    <section
      className="flex items-center gap-1.5 rounded-3xl bg-violet-50 p-2 ring-1 ring-violet-100"
      aria-label="Dzisiejsza misja"
    >
      {state.complete && !state.claimed ? (
        <>
          <button
            type="button"
            onClick={claim}
            className="min-h-12 min-w-0 flex-1 animate-pulse rounded-2xl bg-amber-400 px-3 text-base font-bold text-amber-950 shadow-md active:scale-95"
          >
            🎁 Odbierz naklejkę!
          </button>
          {album}
        </>
      ) : (
        <>
          <h2 className="px-1 text-xs leading-tight font-bold text-violet-700">{state.claimed ? 'Gotowe! 🌟' : 'Misja'}</h2>
          <Step done={state.story} emoji="📖" label="Bajka" />
          <Step done={state.cards} emoji="💎" label="Fiszki" onTap={() => onNavigate('treasures')} />
          <Step done={state.game} emoji="🎮" label="Zabawa" onTap={() => onNavigate('games')} />
          <div
            className="ml-auto flex min-h-12 flex-none items-center gap-1 px-1 text-base font-bold text-amber-700"
            aria-label={`Gwiazdki: ${stars}`}
          >
            <span aria-hidden="true">⭐</span>
            {stars}
          </div>
          {album}
        </>
      )}
      {reward && <StickerReward sticker={reward} onClose={() => setReward(null)} />}
    </section>
  )
}
