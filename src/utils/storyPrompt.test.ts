import { describe, expect, it } from 'vitest'
import { BACKGROUND_THEMES, CHARACTER_MOODS, PRIMARY_CHARACTERS, listProps } from '../data/propCatalog.mjs'
import { builtInStories } from '../data/stories'
import { buildStoryPrompt, collectFlashcards } from './storyPrompt'

describe('buildStoryPrompt', () => {
  const prompt = buildStoryPrompt('Mała panda liczy gwiazdki', builtInStories)

  it('contains the topic and demands a bare JSON object', () => {
    expect(prompt).toContain('Mała panda liczy gwiazdki')
    expect(prompt).toContain('wyłącznie jeden obiekt JSON')
  })

  it('lists every scene value and every prop', () => {
    for (const value of [...BACKGROUND_THEMES, ...PRIMARY_CHARACTERS, ...CHARACTER_MOODS, ...listProps()]) {
      expect(prompt).toContain(value)
    }
  })

  it('covers the contract, lemma fields and the ban on image urls', () => {
    for (const field of ['lemmaEn', 'lemmaPl', 'lemmaPhoneticsPl', 'characterVisualAnchor', 'guardianVerified']) {
      expect(prompt).toContain(field)
    }
    expect(prompt).toContain('imageUrl')
    expect(prompt).toContain('coverImageUrl')
    expect(prompt).toContain('DOSŁOWNIE')
  })

  it('includes the phonetics table and the phrase rule', () => {
    expect(prompt).toContain('| th bezdźwięczne | f | fri |')
    expect(prompt).toContain('"ice cream"')
    expect(prompt).toContain('"Good night"')
  })

  it('lists existing flashcards with their answers and ids', () => {
    const cards = collectFlashcards(builtInStories)
    expect(cards.length).toBeGreaterThan(5)
    for (const card of cards) expect(prompt).toContain(`- ${card.key} | ${card.answerPl} | ${card.phoneticsPl}`)
    for (const story of builtInStories) expect(prompt).toContain(story.id)
  })

  it('demands contextual translations, broad keywords and ttsOverride for "a"', () => {
    expect(prompt).toContain('dokładnie ta forma, która stoi w sentencePl')
    expect(prompt).toContain('Błędnie: pink -> "różowy"')
    expect(prompt).toContain('WSZYSTKIE rzeczowniki, kolory, przymiotniki')
    expect(prompt).toContain('Nie ustawiaj false po to, żeby uniknąć konfliktu fiszek')
    expect(prompt).toContain('Każdy klocek "a" musi mieć "ttsOverride": "uh"')
  })

  it('does not break on an empty topic and an empty library', () => {
    expect(buildStoryPrompt('   ', [])).toContain('(wpisz temat bajki)')
    expect(buildStoryPrompt('x', [])).toContain('Nie ma jeszcze żadnych fiszek')
  })
})
