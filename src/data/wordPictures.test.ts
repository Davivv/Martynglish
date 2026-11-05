import { describe, expect, it } from 'vitest'
import { flashcardOf } from '../utils/storyGuardian'
import { findPhoneticProblem } from '../utils/storyGuardianCore.mjs'
import { PRIMARY_CHARACTERS, isKnownProp } from './propCatalog.mjs'
import { builtInStories } from './stories'
import { PICTURE_WORDS, pictureOf } from './wordPictures'

describe('PICTURE_WORDS', () => {
  it('has unique keys', () => {
    expect(new Set(PICTURE_WORDS.map((w) => w.key)).size).toBe(PICTURE_WORDS.length)
  })

  it('uses only known props and characters', () => {
    for (const { picture } of PICTURE_WORDS) {
      if (picture.kind === 'prop') expect(isKnownProp(picture.prop), picture.prop).toBe(true)
      if (picture.kind === 'character') expect(PRIMARY_CHARACTERS).toContain(picture.character)
    }
  })

  it('has phonetics that pass the Guardian rule', () => {
    for (const w of PICTURE_WORDS) expect(findPhoneticProblem(w.phoneticsPl), w.key).toBeNull()
  })

  it('agrees with the story cards on shared keys', () => {
    let shared = 0
    for (const story of builtInStories) {
      for (const page of story.pages) {
        for (const token of page.words) {
          if (!token.isKeyword) continue
          const card = flashcardOf(token)
          const w = PICTURE_WORDS.find((p) => p.key === card.key)
          if (!w) continue
          shared++
          expect(w.answerPl, card.key).toBe(card.answerPl)
          expect(w.phoneticsPl, card.key).toBe(card.phoneticsPl)
        }
      }
    }
    expect(shared).toBeGreaterThan(0)
  })

  it('finds a picture by key', () => {
    expect(pictureOf('sun')).toEqual({ kind: 'prop', prop: 'sun-yellow' })
    expect(pictureOf('nope')).toBeUndefined()
  })
})
