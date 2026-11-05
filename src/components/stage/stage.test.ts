import { describe, expect, it } from 'vitest'
import { BACKGROUND_THEMES, PRIMARY_CHARACTERS, PROP_OBJECTS, listProps } from '../../data/propCatalog.mjs'
import { BACKGROUND_DRAWINGS } from './backgrounds'
import { CHARACTER_DRAWINGS } from './characters'
import { layoutProps } from './layout'
import { PROP_DRAWINGS, SKY_OBJECTS, parseProp } from './props'

describe('stage drawings', () => {
  it('has a drawing for every prop object in the catalogue', () => {
    expect(Object.keys(PROP_DRAWINGS).sort()).toEqual(Object.keys(PROP_OBJECTS).sort())
    for (const drawing of Object.values(PROP_DRAWINGS)) expect(typeof drawing).toBe('function')
  })

  it('has a drawing for every background theme', () => {
    expect(Object.keys(BACKGROUND_DRAWINGS).sort()).toEqual([...BACKGROUND_THEMES].sort())
  })

  it('has a drawing for every primary character', () => {
    expect(Object.keys(CHARACTER_DRAWINGS).sort()).toEqual([...PRIMARY_CHARACTERS].sort())
  })

  it('parses every catalogue prop into a drawable object', () => {
    for (const prop of listProps()) {
      const { object, variant } = parseProp(prop)
      expect(PROP_DRAWINGS[object], prop).toBeDefined()
      expect(PROP_OBJECTS[object], prop).toContain(variant)
    }
  })

  it('only puts the blue objects in the sky', () => {
    expect([...SKY_OBJECTS].sort()).toEqual(
      ['balloon', 'bird', 'butterfly', 'cloud', 'moon', 'rainbow', 'star', 'sun'],
    )
  })
})

const MODES = ['strip', 'roomy', 'square'] as const
const HERO_TOP_FRACTION = 1.0

describe('layoutProps', () => {
  it('shows exactly as many objects as there are entries, repeats included', () => {
    const props = ['icecream-1', 'icecream-1', 'icecream-3', 'banana-yellow', 'apple-red', 'sun-yellow', 'tree-green', 'heart-pink']
    for (const mode of MODES) {
      const { props: placed } = layoutProps(props, mode)
      expect(placed).toHaveLength(props.length)
      expect(new Set(placed.map((p) => p.key)).size).toBe(props.length)
    }
  })

  it('keeps sky objects above the hero and the ground ones low', () => {
    for (const mode of MODES) {
      const { props: placed, hero } = layoutProps(['sun-yellow', 'cloud-white', 'bird-blue', 'flower-pink', 'apple-red', 'ball-red'], mode)
      for (const p of placed) {
        if (SKY_OBJECTS.has(p.object)) expect(p.y, `${mode} ${p.object}`).toBeLessThan(hero.y + 100 * hero.scale * 0.6)
        else expect(p.y, `${mode} ${p.object}`).toBeGreaterThan(hero.y + 100 * hero.scale * 0.6)
      }
    }
  })

  it('never puts a ground object on the hero feet', () => {
    for (const mode of MODES) {
      for (let n = 1; n <= 8; n++) {
        const { props: placed, hero } = layoutProps(Array.from({ length: n }, () => 'icecream-1'), mode)
        const feet = hero.y + 100 * hero.scale
        for (const p of placed) {
          const [w, h, bottom] = [32, 48, 20]
          const top = p.y + (bottom - h) * p.scale
          const overlapsX = Math.abs(p.x - 200) < (w * p.scale) / 2 + 22 * hero.scale
          expect(!overlapsX || top >= feet - 6, `${mode} n=${n}`).toBe(true)
        }
      }
    }
  })

  it('stays inside the area that is always visible', () => {
    const safe = { strip: [0, 400], roomy: [32, 368], square: [80, 320] } as const
    for (const mode of MODES) {
      for (const list of [['sun-yellow', 'rainbow-1', 'cloud-white'], ['fish-red', 'banana-yellow', 'chocolate-brown', 'shell-pink', 'ball-red', 'apple-red']]) {
        for (const p of layoutProps(list, mode).props) {
          expect(p.x, `${mode} ${p.object}`).toBeGreaterThanOrEqual(safe[mode][0])
          expect(p.x, `${mode} ${p.object}`).toBeLessThanOrEqual(safe[mode][1])
        }
      }
    }
  })

  it('draws a single tree taller than the hero and behind it', () => {
    for (const mode of MODES) {
      const { props: placed, hero } = layoutProps(['tree-green'], mode)
      expect(placed[0].behind).toBe(true)
      expect(46 * placed[0].scale).toBeGreaterThan(100 * hero.scale * HERO_TOP_FRACTION)
      expect(placed[0].y - 25 * placed[0].scale).toBeGreaterThanOrEqual(20)
    }
  })

  it('makes a lone object big and a crowd smaller', () => {
    const one = layoutProps(['ball-red'], 'roomy').props[0].scale
    const six = layoutProps(Array.from({ length: 6 }, () => 'ball-red'), 'roomy').props[0].scale
    expect(one).toBeGreaterThan(six * 1.5)
  })

  it('makes the hero larger when there is room', () => {
    expect(layoutProps([], 'roomy').hero.scale).toBeGreaterThan(layoutProps([], 'strip').hero.scale)
  })

  it('ignores unknown objects instead of crashing', () => {
    expect(layoutProps(['dragon-red', 'apple-red']).props).toHaveLength(1)
  })

  it('puts fish in the sea on the beach, beside the hero, and on the ground elsewhere', () => {
    for (const mode of ['strip', 'roomy', 'square'] as const) {
      for (const count of [1, 2, 3, 4]) {
        const fish = Array.from({ length: count }, () => 'fish-orange')
        const { props: placed, hero } = layoutProps(fish, mode, 'beach')
        const heroLeft = hero.x
        const heroRight = hero.x + 100 * hero.scale
        expect(placed).toHaveLength(count)
        for (const p of placed) {
          expect(p.y, `${mode} ${count}`).toBeGreaterThanOrEqual(108)
          expect(p.y, `${mode} ${count}`).toBeLessThanOrEqual(158)
          expect(p.x < heroLeft || p.x > heroRight, `${mode} ${count} x=${p.x}`).toBe(true)
        }
      }
    }
    expect(layoutProps(['fish-orange'], 'roomy', 'park').props[0].y).toBeGreaterThan(158)
    expect(layoutProps(['fish-orange'], 'roomy').props[0].y).toBeGreaterThan(158)
  })

  it('leaves other objects where they stand on any background', () => {
    expect(layoutProps(['shell-pink'], 'roomy', 'beach').props).toEqual(layoutProps(['shell-pink'], 'roomy').props)
  })
})
