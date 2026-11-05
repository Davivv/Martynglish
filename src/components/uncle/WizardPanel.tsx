import { useRef, useState } from 'react'
import { addCustomStory, getAllStories } from '../../data/stories'
import type { Story } from '../../types/story'
import { type GuardianReport, formatIssue, validateImportedStory } from '../../utils/storyGuardian'
import { buildStoryPrompt } from '../../utils/storyPrompt'
import { parseStoryInput } from './parseStoryInput'

type Check =
  | { kind: 'parse-error'; message: string }
  | { kind: 'failed'; report: GuardianReport }
  | { kind: 'passed'; story: Story; report: GuardianReport }

interface WizardPanelProps {
  /** Called after a story was saved, so the list of phone stories refreshes. */
  onSaved: () => void
}

const fieldClass = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-800'
const primaryButton =
  'min-h-12 w-full rounded-xl bg-slate-700 px-4 text-sm font-semibold text-white active:bg-slate-800 disabled:bg-slate-300'

export function WizardPanel({ onSaved }: WizardPanelProps) {
  const [topic, setTopic] = useState('')
  const [pastedJson, setPastedJson] = useState('')
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle')
  const [manualPrompt, setManualPrompt] = useState('')
  const [check, setCheck] = useState<Check | null>(null)
  const [saveMessage, setSaveMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const manualRef = useRef<HTMLTextAreaElement>(null)

  const copyPrompt = async () => {
    const prompt = buildStoryPrompt(topic, getAllStories())
    try {
      await navigator.clipboard.writeText(prompt)
      setCopyState('copied')
      setManualPrompt('')
    } catch {
      // No clipboard on plain HTTP (dev:phone) or permission denied: let the adult copy by hand.
      setManualPrompt(prompt)
      setCopyState('manual')
      requestAnimationFrame(() => manualRef.current?.select())
    }
  }

  const verify = () => {
    setSaveMessage(null)
    const parsed = parseStoryInput(pastedJson)
    if (!parsed.ok) {
      setCheck({ kind: 'parse-error', message: parsed.message })
      return
    }
    const report = validateImportedStory(parsed.candidate, getAllStories())
    setCheck(
      report.errors.length > 0
        ? { kind: 'failed', report }
        : { kind: 'passed', story: parsed.candidate as Story, report },
    )
  }

  const save = () => {
    if (check?.kind !== 'passed') return
    // D14: the flag is set here, only after a positive check.
    const saved = addCustomStory({ ...check.story, guardianVerified: true })
    if (!saved) {
      setSaveMessage({ ok: false, text: 'Nie zapisano: to id ma już bajka wbudowana w aplikację.' })
      return
    }
    setSaveMessage({ ok: true, text: `Zapisano „${check.story.titlePl}”. Jest już w bibliotece.` })
    setCheck(null)
    setPastedJson('')
    onSaved()
  }

  return (
    <section className="flex flex-col gap-4" aria-label="Kreator bajek">
      <div className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow-sm">
        <h2 className="text-base font-bold text-slate-700">1. Przygotuj prompt</h2>
        <label htmlFor="story-topic" className="text-sm text-slate-600">
          Temat bajki
        </label>
        <input
          id="story-topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="np. Mała panda liczy gwiazdki"
          className={fieldClass}
        />
        <button type="button" onClick={copyPrompt} className={primaryButton}>
          Kopiuj Prompt dla AI
        </button>
        {copyState === 'copied' && (
          <p role="status" className="text-sm font-medium text-emerald-800">
            Skopiowano. Wklej prompt do czatu z AI, a odpowiedź wklej poniżej.
          </p>
        )}
        {copyState === 'manual' && (
          <div className="flex flex-col gap-2">
            <p role="status" className="text-sm font-medium text-amber-800">
              Schowek jest niedostępny w tej przeglądarce (to zwykle brak HTTPS). Zaznacz cały tekst poniżej i skopiuj
              go ręcznie.
            </p>
            <textarea
              ref={manualRef}
              readOnly
              value={manualPrompt}
              aria-label="Prompt do skopiowania"
              onFocus={(e) => e.currentTarget.select()}
              rows={6}
              className={`${fieldClass} font-mono text-xs`}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-white p-3 shadow-sm">
        <h2 className="text-base font-bold text-slate-700">2. Wklej odpowiedź AI</h2>
        <label htmlFor="story-json" className="text-sm text-slate-600">
          JSON bajki (może być w bloku ```json)
        </label>
        <textarea
          id="story-json"
          value={pastedJson}
          onChange={(e) => {
            setPastedJson(e.target.value)
            setCheck(null)
            setSaveMessage(null)
          }}
          rows={8}
          spellCheck={false}
          className={`${fieldClass} font-mono text-xs`}
        />
        <button type="button" onClick={verify} className={primaryButton}>
          Sprawdź bajkę
        </button>
      </div>

      {saveMessage && (
        <p
          role="status"
          className={`rounded-xl p-3 text-sm font-medium ${
            saveMessage.ok ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'
          }`}
        >
          {saveMessage.text}
        </p>
      )}

      {check?.kind === 'parse-error' && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
          <p className="mb-1 font-bold">❌ Nie udało się odczytać bajki</p>
          <p className="break-words">{check.message}</p>
        </div>
      )}

      {check?.kind === 'failed' && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
          <p className="mb-2 font-bold">❌ Strażnik odrzucił bajkę ({check.report.errors.length})</p>
          <ul className="flex flex-col gap-2">
            {check.report.errors.map((issue, i) => (
              <li key={i} className="break-words">
                {formatIssue(issue)}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-rose-800">Wklej te błędy do czatu z AI i poproś o poprawioną wersję.</p>
        </div>
      )}

      {check?.kind === 'passed' && <Certificate story={check.story} report={check.report} onSave={save} />}
    </section>
  )
}

function Certificate({ story, report, onSave }: { story: Story; report: GuardianReport; onSave: () => void }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950">
      <p className="text-base font-bold" role="status">
        ✅ Zielony Certyfikat: bajka spełnia reguły Strażnika
      </p>
      <p>
        Strażnik sprawdza reguły, nie sens. Przeczytaj bajkę, zanim pokażesz ją Martynce.
      </p>

      {report.warnings.length > 0 && (
        <ul className="rounded-lg bg-amber-50 p-2 text-amber-900">
          {report.warnings.map((issue, i) => (
            <li key={i} className="break-words">
              ⚠️ {formatIssue(issue)}
            </li>
          ))}
        </ul>
      )}

      <div className="rounded-lg bg-white p-3 text-slate-800">
        <h3 className="text-lg font-bold">{story.titleEn}</h3>
        <p className="text-slate-600">{story.titlePl}</p>
        <p className="mt-1 text-xs text-slate-500">
          id: {story.id}, poziom {story.level}, stron: {story.pages.length}
        </p>
        <ol className="mt-3 flex flex-col gap-3">
          {story.pages.map((page) => (
            <li key={page.pageNumber} className="break-words border-t border-slate-100 pt-2">
              <p className="text-xs font-semibold text-slate-500">Strona {page.pageNumber}</p>
              <p className="text-base font-semibold">{page.sentenceEn}</p>
              <p className="text-xs text-slate-500">{page.phoneticsPl}</p>
              <p className="text-slate-700">{page.sentencePl}</p>
            </li>
          ))}
        </ol>
      </div>

      <button
        type="button"
        onClick={onSave}
        className="min-h-12 w-full rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white active:bg-emerald-800"
      >
        Przeczytałem, zapisz w bibliotece
      </button>
    </div>
  )
}
