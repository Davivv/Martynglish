import { useState } from 'react'
import { CustomStoriesPanel } from './CustomStoriesPanel'
import { StatsPanel } from './StatsPanel'
import { UncleGate } from './UncleGate'
import { WizardPanel } from './WizardPanel'

type Tab = 'stats' | 'wizard' | 'stories'

const TABS: { id: Tab; label: string }[] = [
  { id: 'stats', label: 'Statystyki' },
  { id: 'wizard', label: 'Kreator' },
  { id: 'stories', label: 'Moje bajki' },
]

/** The unlocked state lives only in this component: leaving the tab locks the zone again. */
export function UncleZoneView() {
  const [unlocked, setUnlocked] = useState(false)
  const [tab, setTab] = useState<Tab>('stats')
  const [listVersion, setListVersion] = useState(0)
  const bump = () => setListVersion((n) => n + 1)

  if (!unlocked) return <UncleGate onUnlock={() => setUnlocked(true)} />

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 py-4">
      <h1 className="text-xl font-bold text-slate-700">Strefa Wujka</h1>
      <div role="tablist" className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`min-h-12 rounded-lg px-1 text-sm font-semibold ${
              tab === item.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {tab === 'stats' && <StatsPanel />}
      {tab === 'wizard' && <WizardPanel onSaved={bump} />}
      {tab === 'stories' && <CustomStoriesPanel version={listVersion} onChanged={bump} />}
    </div>
  )
}
