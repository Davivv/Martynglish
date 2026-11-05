import { useState } from 'react'
import { getCustomStories, removeCustomStory } from '../../data/stories'

/** Stories added from this phone, with deletion after confirmation (D22). */
export function CustomStoriesPanel({ version, onChanged }: { version: number; onChanged: () => void }) {
  // `version` changes after every save, which re-reads the list
  const stories = getCustomStories()
  const [pendingId, setPendingId] = useState<string | null>(null)

  const remove = (id: string) => {
    removeCustomStory(id)
    setPendingId(null)
    onChanged()
  }

  return (
    <section className="flex flex-col gap-3" aria-label="Bajki z telefonu" data-version={version}>
      <p className="text-sm text-slate-600">
        Bajki dodane z tego telefonu. Żyją tylko w pamięci tej przeglądarki: wyczyszczenie danych witryny je usunie.
      </p>
      {stories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-600">
          Nie ma jeszcze bajek dodanych z telefonu. Użyj zakładki Kreator.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {stories.map((story) => (
            <li key={story.id} className="rounded-xl bg-white p-3 shadow-sm">
              <p className="break-words font-semibold text-slate-800">{story.titlePl}</p>
              <p className="break-words text-xs text-slate-500">
                {story.titleEn} · {story.id} · stron: {story.pages.length}
              </p>
              {pendingId === story.id ? (
                <div className="mt-2 flex flex-col gap-2" role="alertdialog" aria-label="Potwierdzenie usunięcia">
                  <p className="text-sm text-rose-900">Usunąć „{story.titlePl}”? Tego nie da się cofnąć.</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => remove(story.id)}
                      className="min-h-12 flex-1 rounded-lg bg-rose-700 px-3 text-sm font-semibold text-white"
                    >
                      Tak, usuń
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingId(null)}
                      className="min-h-12 flex-1 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-700"
                    >
                      Anuluj
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPendingId(story.id)}
                  className="mt-2 min-h-12 w-full rounded-lg border border-rose-300 px-3 text-sm font-semibold text-rose-800"
                >
                  Usuń
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
