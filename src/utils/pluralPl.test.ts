import { describe, expect, it } from 'vitest'
import { pluralPl } from './pluralPl'

describe('pluralPl', () => {
  it.each([
    [0, 'bajek'], [1, 'bajka'], [2, 'bajki'], [4, 'bajki'], [5, 'bajek'], [12, 'bajek'], [13, 'bajek'],
    [14, 'bajek'], [21, 'bajek'], [22, 'bajki'], [24, 'bajki'], [25, 'bajek'], [112, 'bajek'],
  ])('%i -> %s', (n, expected) => {
    expect(pluralPl(n, 'bajka', 'bajki', 'bajek')).toBe(expected)
  })
})
