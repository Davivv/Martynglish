export type MainView = 'library' | 'treasures' | 'games' | 'uncle' | 'album'

const ITEMS: { view: MainView; icon: string; label: string }[] = [
  { view: 'library', icon: '📚', label: 'Bajki' },
  { view: 'treasures', icon: '💎', label: 'Skarby' },
  { view: 'games', icon: '🎮', label: 'Zabawy' },
  { view: 'uncle', icon: '🔐', label: 'Strefa Wujka' },
]

interface BottomNavProps {
  current: MainView
  onChange: (view: MainView) => void
}

export function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav className="flex flex-none gap-1 border-t border-violet-100 bg-white px-3 py-2 shadow-[0_-4px_12px_rgba(139,92,246,0.08)]">
      {ITEMS.map((item) => {
        const active = item.view === current
        return (
          <button
            key={item.view}
            type="button"
            onClick={() => onChange(item.view)}
            aria-current={active ? 'page' : undefined}
            className={`flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center rounded-2xl text-[11px] font-semibold transition active:scale-95 ${
              active ? 'bg-violet-100 text-violet-700' : 'text-slate-500'
            }`}
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}
