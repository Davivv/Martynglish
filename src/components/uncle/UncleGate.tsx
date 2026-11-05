import { useState } from 'react'

interface Problem {
  a: number
  b: number
}

function newProblem(previous?: Problem): Problem {
  for (;;) {
    const next = { a: 3 + Math.floor(Math.random() * 7), b: 3 + Math.floor(Math.random() * 7) }
    if (!previous || next.a !== previous.a || next.b !== previous.b) return next
  }
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

/** Multiplication gate (SPEC 3.D). It keeps a 7-year-old out; it is not data security. */
export function UncleGate({ onUnlock }: { onUnlock: () => void }) {
  const [problem, setProblem] = useState(newProblem)
  const [answer, setAnswer] = useState('')
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const submit = () => {
    if (answer.trim() !== '' && Number(answer) === problem.a * problem.b) {
      onUnlock()
      return
    }
    setFailed(true)
    setAttempt((n) => n + 1)
    setAnswer('')
    setProblem(newProblem(problem))
  }

  const press = (digit: string) => setAnswer((current) => (current + digit).slice(0, 3))

  const keyClass =
    'min-h-12 rounded-xl border border-slate-200 bg-white text-xl font-semibold text-slate-700 shadow-sm active:bg-slate-100'

  return (
    <div className="mx-auto flex max-w-xs flex-col items-center gap-2 px-4 py-3 text-center">
      <span className="text-3xl" aria-hidden="true">
        🔐
      </span>
      <h1 className="text-xl font-bold text-slate-700">Strefa Wujka</h1>
      <p className="text-sm text-slate-600">Rozwiąż działanie, żeby wejść.</p>

      <div key={attempt} className={`text-3xl font-bold text-slate-800 ${failed ? 'animate-shake' : ''}`}>
        {problem.a} × {problem.b} = ?
      </div>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={3}
        value={answer}
        aria-label="Wynik działania"
        placeholder="Wynik"
        onChange={(e) => setAnswer(e.target.value.replace(/\D/g, ''))}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-center text-2xl text-slate-800"
      />

      <p role="status" className="min-h-5 text-sm font-medium text-rose-700">
        {failed ? 'Zły wynik. Oto nowe działanie.' : ''}
      </p>

      <div className="grid w-full grid-cols-3 gap-2">
        {KEYS.map((digit) => (
          <button key={digit} type="button" onClick={() => press(digit)} className={keyClass}>
            {digit}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setAnswer((current) => current.slice(0, -1))}
          aria-label="Usuń ostatnią cyfrę"
          className={keyClass}
        >
          ⌫
        </button>
        <button type="button" onClick={() => press('0')} className={keyClass}>
          0
        </button>
        <button
          type="button"
          onClick={submit}
          className="min-h-12 rounded-xl bg-slate-700 text-lg font-semibold text-white shadow-sm active:bg-slate-800"
        >
          OK
        </button>
      </div>
    </div>
  )
}
