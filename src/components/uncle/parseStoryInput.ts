// Pasted AI output is untrusted text. This only turns it into one JSON value; the Guardian judges the content.

export type ParseResult = { ok: true; candidate: unknown } | { ok: false; message: string }

const FENCE = /```[a-zA-Z0-9_-]*\s*\n?([\s\S]*?)(?:```|$)/

function stripFence(text: string): string {
  const match = text.match(FENCE)
  return match ? match[1].trim() : text
}

/** Last resort for answers with prose around the JSON: cut from the first brace to the last one. */
function cutToBraces(text: string): string | null {
  const start = text.search(/[[{]/)
  const end = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'))
  return start >= 0 && end > start ? text.slice(start, end + 1) : null
}

function tryParse(text: string): { value: unknown } | { error: string } {
  try {
    return { value: JSON.parse(text) }
  } catch (error) {
    return { error: error instanceof Error ? error.message : String(error) }
  }
}

/** Accepts bare JSON, JSON in a ```json fence, and an array with exactly one story. */
export function parseStoryInput(raw: string): ParseResult {
  const text = raw.trim()
  if (text === '') return { ok: false, message: 'Pole jest puste. Wklej tu JSON bajki wygenerowany przez AI.' }

  const unfenced = stripFence(text)
  let parsed = tryParse(unfenced)
  if ('error' in parsed) {
    const cut = cutToBraces(unfenced)
    const retry = cut && cut !== unfenced ? tryParse(cut) : null
    if (retry && 'value' in retry) parsed = retry
  }
  if ('error' in parsed) {
    return {
      ok: false,
      message: `To nie jest poprawny JSON (${parsed.error}). Poproś AI o odpowiedź samym obiektem JSON, bez komentarzy, i wklej całość.`,
    }
  }

  let value = parsed.value
  if (Array.isArray(value)) {
    if (value.length !== 1) {
      return {
        ok: false,
        message: `Wklejono tablicę z ${value.length} elementami. Kreator przyjmuje jedną bajkę naraz.`,
      }
    }
    value = value[0]
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return { ok: false, message: 'JSON jest poprawny, ale to nie jest obiekt bajki.' }
  }
  return { ok: true, candidate: value }
}
