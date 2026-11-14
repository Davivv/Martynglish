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
  // Twinkle Hollow (D43): a glowing valley at dusk and the hollow tree inside it.
  'dusk-valley',
  'hollow-tree',
  // Friends (D44): the crew's bright recording-studio headquarters, inside and outside.
  'studio',
  // Friends (D45): the crew's kitchen corner for the fruit-pizza challenge.
  'kitchen',
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
  // Twinkle Hollow (D43): the four forest friends.
  'nova',
  'juniper',
  'pepper',
  'willow',
  // Friends (D44): the seven-member creator crew.
  'marti',
  'promyk',
  'figiel',
  'skrzat',
  'rozyczka',
  'kredka',
  'iskierka',
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
  // Friends (D44): boy companions, variant = name, same scale as `girl`, so several can
  // stand together in one scene (D38's `girl-hana` pattern, extended to boys).
  boy: ['promyk', 'figiel', 'skrzat'],
  box: ['brown'],
  butterfly: BRIGHT_COLORS,
  cake: ['pink', 'bitten'],
  // Friends (D44): the studio's camera, used whenever the crew films together.
  camera: ['black'],
  chocolate: ['brown'],
  cloud: ['white'],
  fish: BRIGHT_COLORS,
  flower: [...BRIGHT_COLORS, 'white'],
  girl: ['yuna', 'hana', 'sora', 'queen', 'ruby', 'lena', 'amy', 'marti', 'rozyczka', 'kredka', 'iskierka'],
  // Friends (D44): the Friends hoodie Marti receives, and the studio's stage lights.
  hoodie: ['orange'],
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
  // Twinkle Hollow (D43): the glowing valley needs its own little lights, and each
  // forest friend needs to be able to stand beside another one as a named companion
  // in the same scale, the same way `girl-hana` works for Klub Przyjaciółek (D38).
  firefly: ['gold'],
  fox: ['nova'],
  owl: ['juniper'],
  hedgehog: ['pepper'],
  bat: ['willow'],
  // Friends (D44): the studio's stage light and Marti's small suitcase on her first day.
  light: ['white'],
  suitcase: ['blue'],
  // Friends (D45): the fruit pizza from the kitchen challenge (episode 2), Iskierka's
  // sun hat and the picnic blanket from the park day (episode 3), and the friendship
  // bracelets made in the art corner (episode 4).
  pizza: ['1'],
  hat: ['yellow'],
  blanket: ['red'],
  bracelet: BRIGHT_COLORS,
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
