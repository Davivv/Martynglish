import { useState } from 'react'
import type { PictureWord } from '../../data/wordPictures'
import { STICKER_WORDS, claimSticker, getMissionState } from '../../utils/mission'
import { loadStickers } from '../../utils/storage'
import type { MainView } from '../nav/BottomNav'
import { StickerReward } from './StickerReward'

interface MissionCardProps {
  onNavigate: (view: MainView) => void
  onOpenAlbum: () => void
}

function Chip({ done, emoji, label, onTap }: { done: boolean; emoji: string; label: string; onTap?: () => void }) {
  return (
    <button
      type="button"
      onClick={onTap}
      className={`flex min-h-12 min-w-0 flex-1 items-center justify-center gap-1 rounded-2xl px-1 text-sm font-bold shadow-sm ${
        done ? 'bg-emerald-200 text-emerald-900' : 'bg-white text-slate-700 ring-1 ring-violet-100'
      } ${onTap ? 'active:scale-95' : ''}`}
    >
      <span aria-hidden="true">{done ? '✅' : emoji}</span>
      {label}
    </button>
  )
}

/** Today's mission: read, repeat, play. The sticker is claimed here (D36). */
export function MissionCard({ onNavigate, onOpenAlbum }: MissionCardProps) {
  const [state, setState] = useState(() => getMissionState())
  const [owned, setOwned] = useState(() => loadStickers().length)
  const [reward, setReward] = useState<PictureWord | null>(null)

  const claim = () => {
    const sticker = claimSticker()
    setState(getMissionState())
    setOwned(loadStickers().length)
    if (sticker) setReward(sticker)
  }

  return (
    <section className="flex flex-col gap-2 rounded-3xl bg-violet-50 p-3 ring-1 ring-violet-100" aria-label="Dzisiejsza misja">
      <h2 className="text-lg font-bold text-violet-700">Dzisiejsza misja</h2>
      <div className="flex gap-2">
        <Chip done={state.story} emoji="📖" label="Bajka" />
        <Chip done={state.cards} emoji="💎" label="Fiszki" onTap={() => onNavigate('treasures')} />
        <Chip done={state.game} emoji="🎮" label="Zabawa" onTap={() => onNavigate('games')} />
      </div>
      {state.complete && !state.claimed && (
        <button
          type="button"
          onClick={claim}
          className="min-h-14 animate-pulse rounded-3xl bg-amber-400 px-4 text-lg font-bold text-amber-950 shadow-md active:scale-95"
        >
          🎁 Odbierz naklejkę!
        </button>
      )}
      {state.claimed && <p className="text-center text-base font-bold text-emerald-700">Misja wykonana! Do jutra! 🌟</p>}
      <button
        type="button"
        onClick={onOpenAlbum}
        className="min-h-12 rounded-2xl bg-white px-3 text-base font-bold text-violet-700 shadow-sm ring-1 ring-violet-200 active:scale-95"
      >
        📒 Moje naklejki: {owned} z {STICKER_WORDS.length}
      </button>
      {reward && <StickerReward sticker={reward} onClose={() => setReward(null)} />}
    </section>
  )
}
