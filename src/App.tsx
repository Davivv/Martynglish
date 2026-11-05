import { useState } from 'react'
import { BottomNav, type MainView } from './components/nav/BottomNav'
import { LibraryView } from './components/library/LibraryView'
import { ReaderView } from './components/reader/ReaderView'
import { TreasuresView } from './components/treasures/TreasuresView'
import { UncleZoneView } from './components/uncle/UncleZoneView'
import { getAllStories } from './data/stories'

// Navigation is plain state, no router. The bottom bar disappears inside the reader.
export default function App() {
  const [view, setView] = useState<MainView>('library')
  const [readingId, setReadingId] = useState<string | null>(null)

  const reading = readingId ? getAllStories().find((s) => s.id === readingId) : undefined
  if (reading) {
    return <ReaderView key={reading.id} story={reading} onExit={() => setReadingId(null)} />
  }

  return (
    <div className="mx-auto flex h-dvh max-w-xl flex-col bg-paper">
      <main className="min-h-0 flex-1 overflow-y-auto">
        {view === 'library' && <LibraryView onOpen={setReadingId} />}
        {view === 'treasures' && <TreasuresView />}
        {view === 'uncle' && <UncleZoneView />}
      </main>
      <BottomNav current={view} onChange={setView} />
    </div>
  )
}
