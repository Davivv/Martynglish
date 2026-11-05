import { useState } from 'react'
import { BottomNav, type MainView } from './components/nav/BottomNav'
import { GamesView } from './components/games/GamesView'
import { SentenceGame } from './components/games/SentenceGame'
import { ListeningGame } from './components/games/ListeningGame'
import { LibraryView } from './components/library/LibraryView'
import { ReaderView } from './components/reader/ReaderView'
import { TreasuresView } from './components/treasures/TreasuresView'
import { UncleZoneView } from './components/uncle/UncleZoneView'
import { getAllStories } from './data/stories'
import type { GameId } from './utils/games'

// Navigation is plain state, no router. The bottom bar disappears inside the reader and in games (D33).
export default function App() {
  const [view, setView] = useState<MainView>('library')
  const [readingId, setReadingId] = useState<string | null>(null)
  const [playing, setPlaying] = useState<{ game: GameId; storyId?: string } | null>(null)

  const reading = readingId ? getAllStories().find((s) => s.id === readingId) : undefined
  if (reading) {
    return <ReaderView key={reading.id} story={reading} onExit={() => setReadingId(null)} />
  }

  if (playing) {
    const Game = playing.game === 'sentence' ? SentenceGame : ListeningGame
    return <Game storyId={playing.storyId} onExit={() => setPlaying(null)} />
  }

  return (
    <div className="mx-auto flex h-dvh max-w-xl flex-col bg-paper">
      <main className="min-h-0 flex-1 overflow-y-auto">
        {view === 'library' && <LibraryView onOpen={setReadingId} />}
        {view === 'treasures' && <TreasuresView />}
        {view === 'games' && <GamesView onPlay={(game) => setPlaying({ game })} />}
        {view === 'uncle' && <UncleZoneView />}
      </main>
      <BottomNav current={view} onChange={setView} />
    </div>
  )
}
