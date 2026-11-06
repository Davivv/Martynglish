import { describe, expect, it } from 'vitest'
import type { Story } from '../types/story'
import { builtInStories } from './stories'
import { groupByShelf, posterTitle, readerToneOf } from './shelves'

const stub = (id: string) => ({ id }) as Story

describe('groupByShelf', () => {
  it('orders shelves and sends everything else to Bajeczki', () => {
    const groups = groupByShelf([stub('purple-cat'), stub('friends-club-1'), stub('neon-stars-2'), stub('my-own')])
    expect(groups.map((g) => g.shelf.title)).toEqual(['Neon Stars', 'Klub Przyjaciółek', 'Bajeczki'])
    expect(groups[2].stories.map((s) => s.id)).toEqual(['purple-cat', 'my-own'])
  })

  it('hides empty shelves', () => {
    expect(groupByShelf([stub('purple-cat')]).map((g) => g.shelf.title)).toEqual(['Bajeczki'])
    expect(groupByShelf([])).toEqual([])
  })

  it('places every built-in story exactly once', () => {
    const total = groupByShelf(builtInStories).reduce((n, g) => n + g.stories.length, 0)
    expect(total).toBe(builtInStories.length)
  })
})

describe('readerToneOf', () => {
  it('is dark only for Neon Stars', () => {
    expect(readerToneOf('neon-stars-1')).toBe('dark')
    expect(readerToneOf('friends-club-1')).toBe('light')
    expect(readerToneOf('purple-cat')).toBe('light')
  })
})

describe('posterTitle', () => {
  it.each([
    ['Neon Stars 1: Wielki cień', '1. Wielki cień'],
    ['Klub Przyjaciółek 3: Gdzie jest Coco?', '3. Gdzie jest Coco?'],
    ['Fioletowy Kotek', 'Fioletowy Kotek'],
    ['Bajka: o kocie', 'Bajka: o kocie'],
  ])('%s -> %s', (input, expected) => {
    expect(posterTitle(input)).toBe(expected)
  })
})
