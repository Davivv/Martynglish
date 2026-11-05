import { describe, expect, it } from 'vitest'
import { PROP_OBJECTS, isKnownProp, listProps } from './propCatalog.mjs'

describe('propCatalog', () => {
  it.each(['flower-pink', 'butterfly-blue', 'icecream-1', 'icecream-2', 'icecream-3'])(
    'accepts the SPEC example %s',
    (prop) => {
      expect(isKnownProp(prop)).toBe(true)
    },
  )

  it.each(['flower', 'flower-black', 'dragon-red', 'icecream-9', '', 7, null])(
    'rejects %s',
    (prop) => {
      expect(isKnownProp(prop)).toBe(false)
    },
  )

  it('lists every variant of every object', () => {
    const expected = Object.values(PROP_OBJECTS).reduce((sum, list) => sum + list.length, 0)
    expect(listProps()).toHaveLength(expected)
    expect(new Set(listProps()).size).toBe(expected)
    expect(listProps().every(isKnownProp)).toBe(true)
  })
})
