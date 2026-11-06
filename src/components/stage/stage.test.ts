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

describe('layoutProps with friends and shadows (D38)', () => {
  const GIRL_HALF = 28
  const friendsOf = (count: number) => ['girl-hana', 'girl-sora', 'girl-queen'].slice(0, count)

  it('puts every friend on the same foot line as the hero', () => {
    for (const mode of MODES) {
      for (let n = 1; n <= 3; n++) {
        const { props: placed, hero } = layoutProps(friendsOf(n), mode, 'concert')
        const heroFeet = hero.y + 99 * hero.scale
        for (const p of placed) expect(p.y + 49 * p.scale, `${mode} ${n}`).toBeCloseTo(heroFeet, 5)
        expect(placed).toHaveLength(n)
        expect(placed.every((p) => p.behind)).toBe(true)
      }
    }
  })

  it('keeps one to three friends inside the safe area of every mode, at about 0.92 of the hero', () => {
    const safe = { strip: [10, 390], roomy: [34, 366], square: [82, 318] } as const
    for (const mode of MODES) {
      for (let n = 1; n <= 3; n++) {
        const { props: placed, hero } = layoutProps(friendsOf(n), mode, 'concert')
        for (const p of placed) {
          expect(p.scale / hero.scale).toBeCloseTo(0.92, 2)
          expect(p.x - GIRL_HALF * p.scale, `${mode} ${n}`).toBeGreaterThanOrEqual(safe[mode][0] - 0.01)
          expect(p.x + GIRL_HALF * p.scale, `${mode} ${n}`).toBeLessThanOrEqual(safe[mode][1] + 0.01)
        }
        expect(new Set(placed.map((p) => Math.round(p.x))).size).toBe(n)
      }
    }
  })

  it('keeps the big shadow beside the hero, taller than her and off her middle', () => {
    for (const mode of MODES) {
      for (const list of [['shadow-big'], ['girl-hana', 'girl-sora', 'shadow-big']]) {
        const { props: placed, hero } = layoutProps(list, mode, 'dark-city')
        const shadow = placed.find((p) => p.object === 'shadow')!
        const half = (56 * shadow.scale) / 2
        const inner = shadow.x > 200 ? shadow.x - half : shadow.x + half
        expect(Math.abs(inner - 200), `${mode} ${list.length}`).toBeGreaterThan(14 * hero.scale)
        expect(100 * shadow.scale).toBeGreaterThan(100 * hero.scale)
        expect(shadow.behind).toBe(true)
      }
    }
  })

  it('counts shadow-small objects one by one and hovers them at knee height', () => {
    for (const mode of MODES) {
      const { props: placed, hero } = layoutProps(['shadow-small', 'shadow-small', 'microphone-gold'], mode, 'rooftop')
      const small = placed.filter((p) => p.object === 'shadow')
      expect(small).toHaveLength(2)
      expect(placed).toHaveLength(3)
      for (const s of small) expect(s.y).toBeLessThan(hero.y + 99 * hero.scale)
      expect(small[0].x).not.toBe(small[1].x)
    }
  })

  it('does not put ground objects on friends', () => {
    for (const mode of MODES) {
      const { props: placed, hero } = layoutProps(['girl-lena', 'girl-amy', 'puppy-brown', 'cake-bitten'], mode, 'cafe')
      const feet = hero.y + 99 * hero.scale
      const friends = placed.filter((p) => p.object === 'girl')
      for (const p of placed.filter((q) => q.object !== 'girl')) {
        const box = p.object === 'cake' ? [50, 60, 30] : [42, 46, 23]
        const top = p.y + (box[2] - box[1]) * p.scale
        const left = p.x - (box[0] * p.scale) / 2
        const right = p.x + (box[0] * p.scale) / 2
        const hits = friends.some((f) => right > f.x - GIRL_HALF * f.scale + 6 && left < f.x + GIRL_HALF * f.scale - 6)
        expect(!hits || top >= feet - 4, `${mode} ${p.object}`).toBe(true)
      }
    }
  })

  it('keeps the puppy right next to its food', () => {
    for (const mode of MODES) {
      for (const list of [['puppy-brown', 'milk-white'], ['girl-lena', 'girl-amy', 'puppy-brown', 'cake-bitten']]) {
        const { props: placed } = layoutProps(list, mode, 'cafe')
        const food = placed.find((p) => p.object === 'cake' || p.object === 'milk')!
        const puppy = placed.find((p) => p.object === 'puppy')!
        expect(puppy.x, `${mode} left of the food`).toBeLessThan(food.x)
        expect(food.x - puppy.x, `${mode} gap`).toBeLessThan(70)
      }
    }
  })

  it('keeps an object at full size beside the group when there is room for it', () => {
    const alone = layoutProps(['cake-bitten', 'cake-bitten'], 'roomy', 'cafe').props[1]
    const beside = layoutProps(['girl-lena', 'girl-amy', 'cake-bitten', 'cake-bitten'], 'roomy', 'cafe').props.filter((p) => p.object === 'cake')[1]
    expect(beside.scale).toBe(alone.scale)
  })

  it('stands a tree at the side of a slim hero and draws friends over it', () => {
    for (const mode of MODES) {
      const { props: placed } = layoutProps(['tree-green'], mode, 'park', true)
      expect(placed[0].x, mode).toBeGreaterThan(240)
      expect(placed[0].stretch, mode).toBe(1)
      const withFriend = layoutProps(['girl-lena', 'tree-green'], mode, 'park').props
      expect(withFriend.findIndex((p) => p.object === 'tree')).toBeLessThan(withFriend.findIndex((p) => p.object === 'girl'))
    }
  })

  it('gives wall posters a high place and keeps them out of the ground row', () => {
    const { props: placed, hero } = layoutProps(['poster-blue'], 'roomy', 'town')
    expect(placed[0].y).toBeLessThan(hero.y + 60 * hero.scale)
  })
})
