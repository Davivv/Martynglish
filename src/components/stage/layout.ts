import type { BackgroundTheme } from '../../types/story'
import { PROP_DRAWINGS, SKY_OBJECTS, parseProp } from './props'

/**
 * Scene geometry, all in viewBox units (400 x 240). The stage is cropped with "slice", so what
 * stays visible depends on the proportions of the parent. Three modes cover the cases:
 *  - strip:  very wide (about 328x112), only y 52..188 is certain, the full width is visible
 *  - roomy:  the reader scene (about 328x176..224), x 32..368 and y 30..210 are certain
 *  - square: covers, only x 80..320 is certain, the full height is visible
 * Everything the child must see or count is placed inside the certain area of its mode.
 */
export type StageMode = 'strip' | 'roomy' | 'square'

export const HERO_CENTER_X = 200
/** Middle of the sea band in the beach background (y 108..158). */
export const SEA_Y = 134
/** The hero is drawn in a 100 x 100 box (feet at the bottom) and scaled by `heroScale`. */
export const HERO_DRAWING = 100

interface ModeConfig {
  heroScale: number
  /** y of the hero's feet. */
  feetY: number
  safeX: readonly [number, number]
  /** Sky slots in fill order, centres. */
  skySlots: ReadonlyArray<readonly [number, number]>
  /** Target size of a sky object for 1, 2, ... objects. */
  skySize: readonly number[]
}

const MODES: Record<StageMode, ModeConfig> = {
  strip: {
    heroScale: 1,
    feetY: 157,
    safeX: [10, 390],
    skySlots: [[100, 86], [300, 86], [46, 92], [354, 92], [72, 62], [328, 62]],
    skySize: [58, 54, 46, 42, 36, 34],
  },
  roomy: {
    heroScale: 1.32,
    feetY: 162,
    safeX: [34, 366],
    skySlots: [[92, 100], [308, 100], [66, 48], [334, 48], [126, 44], [274, 44]],
    skySize: [64, 58, 50, 46, 40, 38],
  },
  square: {
    heroScale: 1.15,
    feetY: 168,
    safeX: [82, 318],
    skySlots: [[112, 62], [288, 62], [112, 112], [288, 112], [165, 28], [235, 28]],
    skySize: [56, 52, 46, 44, 38, 36],
  },
}

/** Natural size [width, height, distance from centre to the base] of each drawing, in drawing units. */
const OBJECT_BOX: Record<string, readonly [number, number, number]> = {
  apple: [36, 38, 18],
  ball: [33, 35, 17.5],
  balloon: [24, 48, 24],
  banana: [38, 33, 16],
  bird: [46, 40, 21],
  butterfly: [42, 34, 18],
  chocolate: [38, 40, 21],
  cloud: [48, 28, 14],
  fish: [50, 32, 15],
  flower: [30, 46, 21],
  heart: [38, 35, 17],
  icecream: [32, 48, 20],
  moon: [36, 40, 20],
  rainbow: [52, 32, 15],
  shell: [40, 37, 20],
  star: [38, 36, 17],
  sun: [44, 44, 22],
  tree: [46, 46, 21],
}

export interface PlacedProp {
  key: string
  object: string
  variant: string
  x: number
  y: number
  scale: number
  /** Extra horizontal stretch, used for the wide crown of a tree. */
  stretch?: number
  /** True when the object is drawn behind the hero (sky, trees). */
  behind: boolean
}

export interface StageLayout {
  hero: { scale: number; x: number; y: number }
  props: PlacedProp[]
}

/** Hero position: `x` and `y` are where the 100 x 100 drawing is anchored (top left). */
function heroPlacement(mode: ModeConfig) {
  const scale = mode.heroScale
  return { scale, x: HERO_CENTER_X - 50 * scale, y: mode.feetY - HERO_DRAWING * scale }
}

/** Scale that fits the longest visual side of `object` to `target` scene units. */
function scaleFor(object: string, target: number): number {
  const [w, h] = OBJECT_BOX[object] ?? [40, 40, 20]
  return target / Math.max(w * 0.8, h)
}

function clampX(x: number, object: string, scale: number, safe: readonly [number, number], stretch = 1): number {
  const half = ((OBJECT_BOX[object] ?? [40, 40, 20])[0] * scale * stretch) / 2
  return Math.min(Math.max(x, safe[0] + half), safe[1] - half)
}

/** Evenly spaced x positions between `from` and `to`. */
function spread(count: number, from: number, to: number): number[] {
  if (count === 1) return [(from + to) / 2]
  return Array.from({ length: count }, (_, i) => from + ((to - from) * i) / (count - 1))
}

interface Item {
  object: string
  variant: string
  key: string
}

/** Ground slots (centre x, baseline y, target size), left to right, for `count` objects. */
function groundSlots(mode: StageMode, count: number): Array<{ x: number; base: number; size: number }> {
  if (mode === 'strip') {
    if (count <= 4) {
      const xs = [[300], [100, 300], [100, 300, 352], [48, 100, 300, 352]][count - 1]
      const size = [58, 54, 46, 42][count - 1]
      return xs.map((x) => ({ x, base: 186, size }))
    }
    return spread(count, 100, 300).map((x) => ({ x, base: 186, size: Math.max(22, 150 / count) }))
  }
  if (mode === 'roomy') {
    if (count === 1) return [{ x: 306, base: 192, size: 66 }]
    if (count === 2) return [{ x: 92, base: 192, size: 60 }, { x: 308, base: 192, size: 60 }]
    if (count === 3) {
      return [
        { x: 106, base: 194, size: 50 },
        { x: 200, base: 212, size: 50 },
        { x: 294, base: 194, size: 50 },
      ]
    }
    return spread(count, 96, 304).map((x) => ({ x, base: 212, size: Math.max(26, Math.min(46, 190 / count)) }))
  }
  const sizes = [58, 54, 48, 44, 38, 34]
  const size = sizes[Math.min(count, sizes.length) - 1]
  const span: [number, number] = count === 1 ? [200, 200] : count === 2 ? [150, 250] : [112, 288]
  return spread(count, span[0], span[1]).map((x) => ({ x, base: 228, size }))
}

/** Sea slots (centre x, target size) on both sides of the hero, so every fish can be counted. */
function seaSlots(mode: ModeConfig, count: number): Array<{ x: number; size: number }> {
  const heroEdge = 50 * mode.heroScale
  const left = Math.ceil(count / 2)
  const right = count - left
  const size = Math.min(60, (HERO_CENTER_X - heroEdge - mode.safeX[0]) / left)
  const lane = (n: number, from: number, to: number) => (n === 0 ? [] : spread(n, from, to))
  return [
    ...lane(left, mode.safeX[0] + size / 2, HERO_CENTER_X - heroEdge - size / 2),
    ...lane(right, HERO_CENTER_X + heroEdge + size / 2, mode.safeX[1] - size / 2),
  ].map((x) => ({ x, size }))
}

/**
 * Turns the `props` list into positions. One entry is one object on the stage, so the child can
 * count them. Sky objects hang high beside the hero, trees stand behind it, everything else
 * stands beside or below the hero, never on its feet. On the beach fish swim in the sea, not on
 * the sand. Sizes shrink as the count grows.
 */
export function layoutProps(
  props: readonly string[],
  modeName: StageMode = 'roomy',
  theme?: BackgroundTheme,
): StageLayout {
  const mode = MODES[modeName]
  const hero = heroPlacement(mode)
  const heroHeight = HERO_DRAWING * hero.scale
  const items: Item[] = props
    .map((prop, index) => ({ ...parseProp(prop), key: `${index}-${prop}` }))
    .filter(({ object }) => object in PROP_DRAWINGS)

  const sky = items.filter(({ object }) => SKY_OBJECTS.has(object))
  const trees = items.filter(({ object }) => object === 'tree')
  const inSea = ({ object }: Item) => theme === 'beach' && object === 'fish'
  const sea = items.filter(inSea)
  const ground = items.filter((item) => !SKY_OBJECTS.has(item.object) && item.object !== 'tree' && !inSea(item))
  const placed: PlacedProp[] = []

  sky.forEach((item, i) => {
    const [sx, sy] = mode.skySlots[i % mode.skySlots.length]
    const target = mode.skySize[Math.min(sky.length, mode.skySize.length) - 1]
    const scale = scaleFor(item.object, target)
    placed.push({
      ...item,
      x: clampX(sx + Math.floor(i / mode.skySlots.length) * 12, item.object, scale, mode.safeX),
      y: sy + Math.floor(i / mode.skySlots.length) * 14,
      scale,
      behind: true,
    })
  })

  // Trees are bigger than the hero and stand behind it with a wide crown above its head.
  // The top is kept inside the area that is always visible.
  const treeBase = mode.feetY + 2
  const treeHeight = Math.min(heroHeight * (trees.length === 1 ? 1.15 : 0.92), treeBase - 22)
  const stretch = trees.length === 1 ? 1.75 : 1.2
  // A single tree leans to the right so its trunk shows beside the hero.
  const treeXs = trees.length === 1 ? [HERO_CENTER_X + 30] : spread(trees.length, 130, 270)
  trees.forEach((item, i) => {
    const scale = treeHeight / OBJECT_BOX.tree[1]
    placed.push({
      ...item,
      x: clampX(treeXs[i], 'tree', scale, mode.safeX, stretch),
      y: treeBase - OBJECT_BOX.tree[2] * scale,
      scale,
      stretch,
      behind: true,
    })
  })

  const swimming = seaSlots(mode, Math.max(sea.length, 1))
  sea.forEach((item, i) => {
    const slot = swimming[i]
    const scale = scaleFor(item.object, slot.size)
    placed.push({ ...item, x: clampX(slot.x, item.object, scale, mode.safeX), y: SEA_Y, scale, behind: true })
  })

  const slots = groundSlots(modeName, Math.max(ground.length, 1))
  ground.forEach((item, i) => {
    const slot = slots[i]
    const scale = scaleFor(item.object, slot.size)
    const bottom = OBJECT_BOX[item.object]?.[2] ?? 20
    placed.push({
      ...item,
      x: clampX(slot.x, item.object, scale, mode.safeX),
      y: slot.base - bottom * scale,
      scale,
      behind: false,
    })
  })

  return { hero, props: placed }
}
