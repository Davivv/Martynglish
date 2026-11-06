// Shared scene vocabulary (docs/DECISIONS.md, D12): used by the Guardian, the stage and the AI prompt.

export const BACKGROUND_THEMES = /** @type {const} */ ([
  'meadow',
  'park',
  'castle',
  'icecream',
  'beach',
  'night-sky',
  'neon-city',
  'dark-city',
  'concert',
  'rooftop',
  'town',
  'clubhouse',
  'cafe',
])

export const PRIMARY_CHARACTERS = /** @type {const} */ ([
  'cat',
  'dog',
  'princess-pony',
  'dino',
  'panda',
  'bunny',
  'yuna',
  'hana',
  'sora',
  'shadow-queen',
  'ruby',
  'lena',
  'amy',
])

export const CHARACTER_MOODS = /** @type {const} */ (['happy', 'sleepy', 'excited', 'curious', 'brave', 'worried'])

const BRIGHT_COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink']

/**
 * Scene objects and their allowed variants. A variant is a colour, a number when the object has
 * no single colour (`icecream-1` is the first of several differently coloured ones), or a name
 * when colour says nothing (`girl-hana` is a friend standing beside the hero, D38).
 * One `<object>-<variant>` entry in `props` is one item on the stage.
 *
 * @type {Record<string, string[]>}
 */
export const PROP_OBJECTS = {
  apple: ['red', 'green', 'yellow'],
  ball: BRIGHT_COLORS,
  balloon: BRIGHT_COLORS,
  banana: ['yellow'],
  bird: BRIGHT_COLORS,
  box: ['brown'],
  butterfly: BRIGHT_COLORS,
  cake: ['pink', 'bitten'],
  chocolate: ['brown'],
  cloud: ['white'],
  fish: BRIGHT_COLORS,
  flower: [...BRIGHT_COLORS, 'white'],
  girl: ['yuna', 'hana', 'sora', 'queen', 'ruby', 'lena', 'amy'],
  heart: ['red', 'pink'],
  icecream: ['1', '2', '3', '4', '5'],
  microphone: ['gold'],
  milk: ['white'],
  moon: ['yellow', 'white'],
  phone: ['purple'],
  poster: ['blue'],
  puppy: ['brown'],
  rainbow: ['1'],
  shadow: ['big', 'small'],
  shell: ['pink', 'white', 'yellow'],
  skateboard: ['pink'],
  star: ['yellow', 'white', 'pink'],
  sun: ['yellow'],
  table: ['tail'],
  tree: ['green'],
}

/** @returns {string[]} every allowed `props` value */
export function listProps() {
  return Object.entries(PROP_OBJECTS).flatMap(([object, variants]) =>
    variants.map((variant) => `${object}-${variant}`),
  )
}

const KNOWN_PROPS = new Set(listProps())

/**
 * @param {unknown} prop
 * @returns {boolean}
 */
export function isKnownProp(prop) {
  return typeof prop === 'string' && KNOWN_PROPS.has(prop)
}
