import { useState } from 'react'
import { getAllStories } from '../../data/stories'
import type { VocabStatus } from '../../types/vocabulary'
import { countStars, loadProgress } from '../../utils/progress'
import { changeEntryStatus, getVocabularyList, resetAllProgress } from '../../utils/vocabulary'

const STATUS_LABEL: Record<VocabStatus, string> = { learning: 'Uczę się', known: 'Już umiem' }

function load() {
  const stories = getAllStories()
  return {
    entries: getVocabularyList(),
    titles: new Map(stories.map((s) => [s.id, s.titlePl])),
    stars: countStars(loadProgress(), stories),
    storyCount: stories.length,
  }
}

export function StatsPanel() {
  const [data, setData] = useState(load)
  const [confirming, setConfirming] = useState(false)
  const { entries, titles, stars, storyCount } = data

  const toggle = (key: string, status: VocabStatus) => {
    changeEntryStatus(key, status === 'known' ? 'learning' : 'known')
    setData(load())
  }

  const reset = () => {
    resetAllProgress()
    setConfirming(false)
    setData(load())
  }

  return (
    <section className="flex flex-col gap-3" aria-label="Statystyki">
      <p className="text-sm text-slate-600">
        Przeczytane bajki: {stars} z {storyCount}. Słowa od najczęściej klikanych, czyli od tych najtrudniejszych.
      </p>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-600">
          Martynka nie kliknęła jeszcze żadnego słowa. Gdy zacznie czytać, słowa pojawią się tutaj razem z liczbą
          kliknięć.
        </div>
      ) : (
        <table className="w-full table-fixed border-collapse overflow-hidden rounded-xl bg-white text-xs shadow-sm">
          <colgroup>
            <col className="w-[34%]" />
            <col className="w-[13%]" />
            <col className="w-[27%]" />
            <col className="w-[26%]" />
          </colgroup>
          <thead className="bg-slate-100 text-left text-slate-600">
            <tr>
              <th className="px-2 py-2 font-semibold">Słowo</th>
              <th className="px-1 py-2 text-center font-semibold">Kliki</th>
              <th className="px-2 py-2 font-semibold">Bajka</th>
              <th className="px-2 py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.key} className="border-t border-slate-100 align-middle">
                <td className="break-words px-2 py-2">
                  <div className="text-sm font-semibold text-slate-800">{entry.key}</div>
                  <div className="text-slate-500">{entry.answerPl}</div>
                </td>
                <td className="px-1 py-2 text-center text-base font-bold text-slate-700">{entry.clickCount}</td>
                <td className="break-words px-2 py-2 text-slate-600">
                  {titles.get(entry.storyId) ?? entry.storyId}
                  <span className="text-slate-400">, str. {entry.pageNumber}</span>
                </td>
                <td className="px-1 py-1">
                  <button
                    type="button"
                    onClick={() => toggle(entry.key, entry.status)}
                    aria-label={`${entry.key}: ${STATUS_LABEL[entry.status]}. Zmień status.`}
                    className={`min-h-12 w-full rounded-lg px-1 text-xs font-semibold ${
                      entry.status === 'known' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {STATUS_LABEL[entry.status]}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {confirming ? (
        <div role="alertdialog" aria-label="Potwierdzenie resetu" className="rounded-xl border border-rose-200 bg-rose-50 p-3">
          <p className="mb-2 text-sm text-rose-900">
            Skasować wszystkie słowa i licznik przeczytanych bajek? Tego nie da się cofnąć. Bajki dodane z telefonu
            zostaną.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={reset}
              className="min-h-12 flex-1 rounded-lg bg-rose-700 px-3 text-sm font-semibold text-white"
            >
              Tak, resetuj
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="min-h-12 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700"
            >
              Anuluj
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="min-h-12 rounded-lg border border-rose-300 bg-white px-3 text-sm font-semibold text-rose-800"
        >
          Resetuj postępy
        </button>
      )}
    </section>
  )
}
