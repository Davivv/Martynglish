import { useState } from 'react'
import { getAllStories } from '../../data/stories'
import { groupByShelf, posterTitle } from '../../data/shelves'
import { countStars, loadProgress } from '../../utils/progress'
import { MissionCard } from '../mission/MissionCard'
import type { MainView } from '../nav/BottomNav'
import { InteractiveStoryStage } from '../stage/InteractiveStoryStage'

interface LibraryViewProps {
  onOpen: (storyId: string) => void
  onNavigate: (view: MainView) => void
  onOpenAlbum: () => void
}

export function LibraryView({ onOpen, onNavigate, onOpenAlbum }: LibraryViewProps) {
  const [stories] = useState(getAllStories)
  const [progress] = useState(loadProgress)
  const shelves = groupByShelf(stories)

  return (
    <div className="mx-auto flex max-w-md flex-col gap-3 px-4 pt-4 pb-5">
      <header className="flex flex-col gap-2.5">
        <h1 className="text-3xl leading-tight font-bold text-violet-700">Cześć Martynka!</h1>
        <MissionCard stars={countStars(progress, stories)} onNavigate={onNavigate} onOpenAlbum={onOpenAlbum} />
      </header>

      {shelves.map(({ shelf, stories: shelfStories }) => (
        <section key={shelf.title} aria-label={shelf.title} className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-800">{shelf.title}</h2>
          <ul className="-mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {shelfStories.map((story) => {
              const reads = progress[story.id] ?? 0
              return (
                <li key={story.id} className="flex-none snap-start">
                  <button
                    type="button"
                    onClick={() => onOpen(story.id)}
                    aria-label={`${story.titleEn}, ${story.titlePl}`}
                    className="relative block h-[174px] w-[116px] overflow-hidden rounded-2xl text-left shadow-md ring-1 ring-black/10 transition active:scale-95"
                    style={{ backgroundColor: story.themeColor }}
                  >
                    <div className="absolute inset-0">
                      <InteractiveStoryStage
                        visualConfig={story.coverVisualConfig}
                        imageUrl={story.coverImageUrl}
                        altText=""
                      />
                    </div>
                    {reads > 0 && (
                      <span className="absolute top-1.5 right-1.5 rounded-full bg-white/95 px-2 py-0.5 text-xs font-bold text-emerald-700 shadow">
                        ✅ {reads}×
                      </span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pt-6 pb-2 text-[13px] leading-tight font-bold text-white">
                      {posterTitle(story.titlePl)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
