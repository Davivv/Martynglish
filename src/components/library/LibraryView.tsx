import { useState } from 'react'
import { getAllStories } from '../../data/stories'
import { countStars, loadProgress } from '../../utils/progress'
import { getVocabulary } from '../../utils/vocabulary'
import { InteractiveStoryStage } from '../stage/InteractiveStoryStage'

interface LibraryViewProps {
  onOpen: (storyId: string) => void
}

export function LibraryView({ onOpen }: LibraryViewProps) {
  const [stories] = useState(getAllStories)
  const [progress] = useState(loadProgress)
  const [wordCount] = useState(() => Object.keys(getVocabulary()).length)

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-5">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl leading-tight font-bold text-violet-700">Cześć Martynka!</h1>
        <p className="text-lg text-slate-700">Jaką bajkę dzisiaj czytamy?</p>
        <div className="flex gap-3">
          <div className="flex flex-1 items-center justify-center gap-2 rounded-3xl bg-yellow-100 py-2 text-lg font-bold text-amber-800 shadow-sm">
            <span aria-hidden="true">⭐</span> {countStars(progress, stories)}
            <span className="text-sm font-medium">bajek</span>
          </div>
          <div className="flex flex-1 items-center justify-center gap-2 rounded-3xl bg-sky-100 py-2 text-lg font-bold text-sky-800 shadow-sm">
            <span aria-hidden="true">💎</span> {wordCount}
            <span className="text-sm font-medium">słówek</span>
          </div>
        </div>
      </header>

      <ul className="flex flex-col gap-4">
        {stories.map((story) => {
          const reads = progress[story.id] ?? 0
          return (
            <li key={story.id}>
              <button
                type="button"
                onClick={() => onOpen(story.id)}
                className="block w-full overflow-hidden rounded-3xl text-left shadow-lg ring-1 ring-black/5 transition active:scale-[0.98]"
                style={{ backgroundColor: `${story.themeColor}1f` }}
              >
                <div className="relative h-36 w-full">
                  <div className="absolute inset-0">
                    <InteractiveStoryStage
                      visualConfig={story.coverVisualConfig}
                      imageUrl={story.coverImageUrl}
                      altText={story.titlePl}
                    />
                  </div>
                  {reads > 0 && (
                    <span className="absolute top-2 right-2 rounded-full bg-white/95 px-3 py-1 text-sm font-bold text-emerald-700 shadow">
                      ✅ {reads}×
                    </span>
                  )}
                </div>
                <div className="flex flex-col px-4 py-3">
                  <span className="text-xl font-bold text-slate-800">{story.titleEn}</span>
                  <span className="text-base text-slate-600">{story.titlePl}</span>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
