import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterAll, describe, expect, it } from 'vitest'
import { makeValidStory } from '../src/utils/__fixtures__/story.mjs'
import { SUCCESS_MESSAGE } from '../src/utils/storyGuardianCore.mjs'

const cli = fileURLToPath(new URL('./story-guardian.mjs', import.meta.url))
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'guardian-'))

/** @param {string} contents */
function run(contents) {
  const file = path.join(dir, 'stories.json')
  fs.writeFileSync(file, contents)
  return spawnSync(process.execPath, [cli, file], { encoding: 'utf8' })
}

afterAll(() => fs.rmSync(dir, { recursive: true, force: true }))

describe('story-guardian CLI', () => {
  it('exits 0 and prints the success message for valid stories', () => {
    const result = run(JSON.stringify([makeValidStory()]))
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('test-story')
    expect(result.stdout).toContain('Bajki: 1, strony: 5, błędy: 0')
    expect(result.stdout.trim().endsWith(SUCCESS_MESSAGE)).toBe(true)
  })

  it('exits 1 and reports the exact place of an error', () => {
    const story = makeValidStory()
    story.pages[1].sentenceEn = 'The dog sees a red ball.'
    const result = run(JSON.stringify([story]))
    expect(result.status).toBe(1)
    expect(result.stdout).toContain('[sentence-match] test-story, strona 2')
    expect(result.stdout).not.toContain(SUCCESS_MESSAGE)
  })

  it('stays successful with a warning only', () => {
    const story = makeValidStory()
    Object.assign(story.pages[0], {
      sentenceEn: 'I see cats.',
      phoneticsPl: 'aj si kats',
      words: [
        { word: 'I', translationPl: 'ja', phoneticsPl: 'aj', isKeyword: false },
        { word: 'see', translationPl: 'widzę', phoneticsPl: 'si', isKeyword: false },
        {
          word: 'cats',
          punctuation: '.',
          translationPl: 'kotki',
          phoneticsPl: 'kats',
          isKeyword: true,
          lemmaEn: 'cat',
          lemmaPl: 'kotek',
          lemmaPhoneticsPl: 'kat',
        },
      ],
    })
    const result = run(JSON.stringify([story]))
    expect(result.stdout).toContain('⚠️')
    expect(result.status).toBe(0)
  })

  it('exits 1 for invalid JSON', () => {
    const result = run('{ not json')
    expect(result.status).toBe(1)
    expect(result.stdout).toContain('Nie mogę odczytać bajek')
  })

  it('exits 1 for an empty list', () => {
    expect(run('[]').status).toBe(1)
  })

  it('exits 1 for a missing file', () => {
    const result = spawnSync(process.execPath, [cli, path.join(dir, 'missing.json')], { encoding: 'utf8' })
    expect(result.status).toBe(1)
  })

  it('prints a long report in full', () => {
    const stories = Array.from({ length: 60 }, (_, index) => ({ ...makeValidStory(), id: `story-${index}`, titleEn: 'Ghost' }))
    const result = run(JSON.stringify(stories))
    expect(result.status).toBe(1)
    expect(result.stdout).toContain('GUARDIAN CHECK FAILED')
  })
})
