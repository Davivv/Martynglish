import { describe, expect, it } from 'vitest'
import { parseStoryInput } from './parseStoryInput'

const story = { id: 'x', pages: [] }

describe('parseStoryInput', () => {
  it('parses bare JSON', () => {
    expect(parseStoryInput(JSON.stringify(story))).toEqual({ ok: true, candidate: story })
  })

  it('strips a ```json fence, also with prose around it', () => {
    const fenced = '```json\n' + JSON.stringify(story) + '\n```'
    expect(parseStoryInput(fenced)).toEqual({ ok: true, candidate: story })
    expect(parseStoryInput('Oto bajka:\n' + fenced + '\nMiłego czytania!')).toEqual({ ok: true, candidate: story })
  })

  it('accepts an array with one story and rejects other arrays', () => {
    expect(parseStoryInput(JSON.stringify([story]))).toEqual({ ok: true, candidate: story })
    expect(parseStoryInput('[]')).toMatchObject({ ok: false })
    expect(parseStoryInput(JSON.stringify([story, story]))).toMatchObject({ ok: false })
  })

  it('explains broken JSON, empty input and non-objects', () => {
    expect(parseStoryInput('{"id": ')).toMatchObject({ ok: false, message: expect.stringContaining('nie jest poprawny JSON') })
    expect(parseStoryInput('  ')).toMatchObject({ ok: false, message: expect.stringContaining('puste') })
    expect(parseStoryInput('42')).toMatchObject({ ok: false })
    expect(parseStoryInput('null')).toMatchObject({ ok: false })
  })
})
