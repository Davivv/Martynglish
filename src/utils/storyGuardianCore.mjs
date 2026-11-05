// Single source of the Story Guardian rules (docs/DECISIONS.md, D15).
// Plain JS without fs or DOM, so both the Node CLI and the browser can run it.
// Input is untrusted (pasted JSON), so every rule must survive malformed data.

import {
  BACKGROUND_THEMES,
  CHARACTER_MOODS,
  PRIMARY_CHARACTERS,
  isKnownProp,
} from '../data/propCatalog.mjs'

/**
 * @typedef {object} GuardianIssue
 * @property {string} rule
 * @property {string} message
 * @property {string} [storyId]
 * @property {number} [pageNumber]
 * @property {string} [field]
 */

/**
 * @typedef {object} GuardianReport
 * @property {GuardianIssue[]} errors
 * @property {GuardianIssue[]} warnings
 * @property {number} storyCount
 * @property {number} pageCount
 */

/**
 * @typedef {object} GuardianOptions
 * @property {(url: string) => number | null} [getImageSize] byte size of a local image, null if missing
 * @property {boolean} [requireVerified] require `guardianVerified: true` (default true)
 */

/** @typedef {Pick<GuardianIssue, 'storyId' | 'pageNumber' | 'field'>} Place */

/**
 * @typedef {object} Collector
 * @property {GuardianIssue[]} errors
 * @property {GuardianIssue[]} warnings
 * @property {(rule: string, place: Place, message: string) => void} error
 * @property {(rule: string, place: Place, message: string) => void} warn
 */

export const SUCCESS_MESSAGE = '✅ ALL STORIES & VISUALS PASSED GUARDIAN CHECK'

const MIN_PAGES = 5
const MAX_PAGES = 6
const MIN_WORDS = 3
const MAX_WORDS = 9
const TARGET_MIN_WORDS = 4
const TARGET_MAX_WORDS = 8
const MIN_ANCHOR_LENGTH = 30
const MIN_IMAGE_BYTES = 500

const LEVELS = ['Pre-A1', 'A1']
const HEX_COLOR = /^#[0-9a-f]{6}$/i
const STORY_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const IMAGE_FILE = /^[\w-]+\.(?:png|webp|jpe?g|svg)$/

const IPA = /[əθðʃʒŋæʌʊɪɔɜːˈˌ]/i
const NON_POLISH_LATIN = /[qvx]/i
const ENGLISH_CLUSTERS = /th|sh|ee|oo/i
const POLISH_LETTERS = new Set('aąbcćdeęfghijklłmnńoóprsśtuwyzźż')

// Phonetics encode sounds, not meaning: "troop" is written `trup`, which is not a Polish word here.
const PHONETIC_FIELDS = new Set(['phoneticsPl', 'lemmaPhoneticsPl'])

// D17: whole words with their inflections, in both languages.
const UNSAFE_EN = [
  'monsters?',
  'blood(?:y)?',
  'dead',
  'deaths?',
  'kill(?:s|ed|ers?|ing)?',
  'scary',
  'ghosts?',
  'darkness',
  'cry',
  'cries',
  'cried',
  'crying',
  'hate[sd]?',
  'hating',
  'guns?',
  'fights?',
  'fighting',
  'fought',
  'knife',
  'knives',
  'die[sd]?',
  'dying',
]

const UNSAFE_PL = [
  'potw[óo]r\\p{L}*',
  'krew',
  'krwi',
  'krwią',
  'trup\\p{L}*',
  'zabi[ćłjt]\\p{L}*',
  'umrz\\p{L}*',
  'umar\\p{L}*',
  'umier\\p{L}*',
  'śmier[ćc]\\p{L}*',
  'martw(?:y|a|e|ego|ej|ym|ych)',
  'straszn\\p{L}*',
  'duch(?:y|a|u|em|ów|om|ami|ach)?',
  'ciemno[śs][ćc]\\p{L}*',
  'płacz\\p{L}*',
  'płak\\p{L}*',
  'nienawi\\p{L}*',
  'broń',
  'broni',
  'bronią',
  'bronie',
  'walk(?:a|i|ę|ą|ach|ami)',
  'walcz\\p{L}*',
  'nóż',
  'noża',
  'nożem',
  'noże',
  'noży',
  'nożu',
]

// \b only understands ASCII, so word edges are defined through \p{L} instead.
const UNSAFE_WORD = new RegExp(
  `(?<!\\p{L})(?:${[...UNSAFE_EN, ...UNSAFE_PL].join('|')})(?!\\p{L})`,
  'iu',
)

/**
 * @param {unknown} value
 * @returns {value is Record<string, any>}
 */
function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * @param {unknown} value
 * @returns {value is string}
 */
function isText(value) {
  return typeof value === 'string' && value.trim() !== ''
}

/** @returns {Collector} */
function createCollector() {
  /** @type {GuardianIssue[]} */
  const errors = []
  /** @type {GuardianIssue[]} */
  const warnings = []
  return {
    errors,
    warnings,
    error: (rule, place, message) => void errors.push({ rule, message, ...place }),
    warn: (rule, place, message) => void warnings.push({ rule, message, ...place }),
  }
}

/**
 * @param {string} text
 * @returns {string | null} the unsafe word found in the text
 */
export function findUnsafeWord(text) {
  return text.normalize('NFC').match(UNSAFE_WORD)?.[0] ?? null
}

/**
 * @param {string} text
 * @returns {string | null} description of the first phonetics violation
 */
export function findPhoneticProblem(text) {
  const ipa = text.match(IPA)
  if (ipa) return `znak IPA „${ipa[0]}”`
  const latin = text.match(NON_POLISH_LATIN)
  if (latin) return `niepolska litera „${latin[0]}”`
  const cluster = text.match(ENGLISH_CLUSTERS)
  if (cluster) return `angielska zbitka „${cluster[0]}”`
  const foreign = [...text.toLowerCase()].find(
    (char) => /\p{L}/u.test(char) && !POLISH_LETTERS.has(char),
  )
  return foreign ? `obca litera „${foreign}”` : null
}

/**
 * Flashcard identity of a word block (D27). The Treasures module must use this too.
 *
 * @param {import('../types/story.ts').WordToken} token
 */
export function flashcardOf(token) {
  return {
    key: (token.lemmaEn ?? token.word).toLowerCase().trim(),
    answerPl: token.lemmaPl ?? token.translationPl,
    phoneticsPl: token.lemmaPhoneticsPl ?? token.phoneticsPl,
  }
}

/**
 * @param {GuardianIssue} issue
 * @returns {string}
 */
export function formatIssue({ rule, message, storyId, pageNumber, field }) {
  const place = [storyId, pageNumber && `strona ${pageNumber}`, field].filter(Boolean).join(', ')
  return `[${rule}] ${place ? `${place}: ` : ''}${message}`
}

/**
 * @param {string} text
 * @returns {string}
 */
function normalizePhonetics(text) {
  return text
    .toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * @param {Record<string, any>} object
 * @param {string[]} fields
 * @param {Place} place
 * @param {Collector} c
 */
function requireText(object, fields, place, c) {
  for (const field of fields) {
    if (!isText(object[field])) {
      c.error('structure', { ...place, field }, 'Brakuje tekstu w tym polu.')
    }
  }
}

/**
 * @param {unknown} config
 * @param {Place} place
 * @param {Collector} c
 */
function checkVisualConfig(config, place, c) {
  if (!isObject(config)) {
    c.error('visual', place, 'Brakuje konfiguracji sceny.')
    return
  }
  /** @type {readonly string[]} */
  const themes = BACKGROUND_THEMES
  /** @type {readonly string[]} */
  const characters = PRIMARY_CHARACTERS
  /** @type {readonly string[]} */
  const moods = CHARACTER_MOODS

  if (!themes.includes(config.backgroundTheme)) {
    c.error('visual', place, `Nieznane backgroundTheme: ${String(config.backgroundTheme)}.`)
  }
  if (!characters.includes(config.primaryCharacter)) {
    c.error('visual', place, `Nieznane primaryCharacter: ${String(config.primaryCharacter)}.`)
  }
  if (!moods.includes(config.characterMood)) {
    c.error('visual', place, `Nieznane characterMood: ${String(config.characterMood)}.`)
  }
  if (typeof config.primaryColor !== 'string' || !HEX_COLOR.test(config.primaryColor)) {
    c.error('visual', place, 'primaryColor musi być kolorem w formacie #RRGGBB.')
  }
  if (!Array.isArray(config.props) || config.props.length === 0) {
    c.error('visual', place, 'props musi być niepustą tablicą.')
    return
  }
  for (const prop of config.props) {
    if (!isKnownProp(prop)) {
      c.error('visual', place, `Nieznany obiekt sceny: ${String(prop)}. Dozwolone są w propCatalog.mjs.`)
    }
  }
}

/**
 * @param {unknown} url
 * @param {string} storyId
 * @param {Place} place
 * @param {GuardianOptions} options
 * @param {Collector} c
 */
function checkImageUrl(url, storyId, place, options, c) {
  if (url === undefined) return
  const prefix = `/images/stories/${storyId}/`
  if (typeof url !== 'string' || !url.startsWith(prefix) || !IMAGE_FILE.test(url.slice(prefix.length))) {
    c.error('image', place, `Obraz musi być plikiem lokalnym w ${prefix}.`)
    return
  }
  if (!options.getImageSize) return
  const size = options.getImageSize(url)
  if (size === null) {
    c.error('image', place, `Plik nie istnieje: public${url}.`)
  } else if (size <= MIN_IMAGE_BYTES) {
    c.error('image', place, `Plik ma tylko ${size} B, wymagane ponad ${MIN_IMAGE_BYTES} B.`)
  }
}

/**
 * @param {unknown} token
 * @returns {token is import('../types/story.ts').WordToken}
 */
function isValidToken(token) {
  if (!isObject(token)) return false
  const optional = ['punctuation', 'ttsOverride', 'lemmaEn', 'lemmaPl', 'lemmaPhoneticsPl']
  return (
    isText(token.word) &&
    isText(token.translationPl) &&
    isText(token.phoneticsPl) &&
    typeof token.isKeyword === 'boolean' &&
    optional.every((field) => token[field] === undefined || typeof token[field] === 'string')
  )
}

/**
 * @param {Record<string, any>} page
 * @param {Place} place
 * @param {Collector} c
 */
function checkWords(page, place, c) {
  if (!Array.isArray(page.words) || page.words.length === 0) {
    c.error('structure', { ...place, field: 'words' }, 'Strona musi mieć niepustą tablicę klocków.')
    return
  }
  if (!page.words.every(isValidToken)) {
    c.error('structure', { ...place, field: 'words' }, 'Co najmniej jeden klocek ma złe lub puste pola.')
    return
  }

  /** @type {import('../types/story.ts').WordToken[]} */
  const words = page.words

  for (const token of words) {
    for (const field of /** @type {const} */ (['phoneticsPl', 'lemmaPhoneticsPl'])) {
      const text = token[field]
      const problem = text === undefined ? null : findPhoneticProblem(text)
      if (problem) c.error('phonetics', { ...place, field }, `„${token.word}”: ${problem}.`)
    }
    const differs =
      token.lemmaEn !== undefined && token.lemmaEn.toLowerCase() !== token.word.toLowerCase()
    if (differs && !isText(token.lemmaPhoneticsPl)) {
      c.error('lemma', place, `„${token.word}”: lemmaEn wymaga lemmaPhoneticsPl.`)
    }
  }

  if (!words.some((token) => token.isKeyword)) {
    c.error('pedagogy', place, 'Strona musi mieć co najmniej jedno słowo z isKeyword: true.')
  }

  if (typeof page.sentenceEn === 'string') {
    const reconstructed = words
      .map((token) => token.word + (token.punctuation || ''))
      .join(' ')
      .trim()
    if (reconstructed !== page.sentenceEn.trim()) {
      c.error(
        'sentence-match',
        place,
        `Klocki nie dają zdania. Zdanie: „${page.sentenceEn}”, klocki: „${reconstructed}”.`,
      )
    }
  }

  if (typeof page.phoneticsPl === 'string') {
    const joined = words.map((token) => token.phoneticsPl).join(' ')
    if (normalizePhonetics(joined) !== normalizePhonetics(page.phoneticsPl)) {
      c.error(
        'phonetics-sum',
        { ...place, field: 'phoneticsPl' },
        `Fonetyka zdania różni się od klocków. Zdanie: „${page.phoneticsPl}”, klocki: „${joined}”.`,
      )
    }
  }
}

/**
 * @param {unknown} page
 * @param {number} index
 * @param {Record<string, any>} story
 * @param {string} storyId
 * @param {GuardianOptions} options
 * @param {Collector} c
 */
function checkPage(page, index, story, storyId, options, c) {
  const expectedNumber = index + 1
  if (!isObject(page)) {
    c.error('structure', { storyId, pageNumber: expectedNumber }, 'Strona musi być obiektem.')
    return
  }
  const place = { storyId, pageNumber: expectedNumber }

  if (page.pageNumber !== expectedNumber) {
    c.error('structure', { ...place, field: 'pageNumber' }, `Oczekiwany numer strony: ${expectedNumber}.`)
  }
  requireText(
    page,
    ['imagePrompt', 'imageAltPl', 'interactiveSoundText', 'sentenceEn', 'phoneticsPl', 'sentencePl'],
    place,
    c,
  )
  checkVisualConfig(page.visualConfig, { ...place, field: 'visualConfig' }, c)
  checkImageUrl(page.imageUrl, storyId, { ...place, field: 'imageUrl' }, options, c)

  const anchor = story.characterVisualAnchor
  if (isText(anchor) && isText(page.imagePrompt) && !page.imagePrompt.includes(anchor)) {
    c.error('visual', { ...place, field: 'imagePrompt' }, 'imagePrompt musi zawierać characterVisualAnchor.')
  }

  if (isText(page.phoneticsPl)) {
    const problem = findPhoneticProblem(page.phoneticsPl)
    if (problem) c.error('phonetics', { ...place, field: 'phoneticsPl' }, `${problem}.`)
  }

  if (isText(page.sentenceEn)) {
    const count = page.sentenceEn.trim().split(/\s+/).length
    if (count < MIN_WORDS || count > MAX_WORDS) {
      c.error('pedagogy', { ...place, field: 'sentenceEn' }, `Zdanie ma ${count} słów, limit to ${MIN_WORDS}–${MAX_WORDS}.`)
    } else if (count < TARGET_MIN_WORDS || count > TARGET_MAX_WORDS) {
      c.warn('pedagogy', { ...place, field: 'sentenceEn' }, `Zdanie ma ${count} słów, norma to ${TARGET_MIN_WORDS}–${TARGET_MAX_WORDS}.`)
    }
  }

  checkWords(page, place, c)
}

/**
 * @param {unknown} value
 * @param {string} path
 * @param {string} storyId
 * @param {Collector} c
 */
function checkSafety(value, path, storyId, c) {
  if (typeof value === 'string') {
    const word = findUnsafeWord(value)
    if (word) c.error('safety', { storyId, field: path }, `Słowo nieodpowiednie dla dziecka: „${word}”.`)
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => checkSafety(item, `${path}[${index}]`, storyId, c))
  } else if (isObject(value)) {
    for (const [key, item] of Object.entries(value)) {
      if (!PHONETIC_FIELDS.has(key)) checkSafety(item, path ? `${path}.${key}` : key, storyId, c)
    }
  }
}

/**
 * @param {unknown} story
 * @param {number} index
 * @param {Set<string>} seenIds
 * @param {GuardianOptions} options
 * @param {Collector} c
 * @returns {number} number of pages found
 */
function checkStory(story, index, seenIds, options, c) {
  if (!isObject(story)) {
    c.error('structure', { storyId: `#${index + 1}` }, 'Bajka musi być obiektem.')
    return 0
  }
  const storyId = isText(story.id) ? story.id : `#${index + 1}`
  const place = { storyId }

  requireText(story, ['id', 'titleEn', 'titlePl', 'characterVisualAnchor', 'themeColor'], place, c)
  if (isText(story.id) && !STORY_ID.test(story.id)) {
    c.error('structure', { ...place, field: 'id' }, 'id może mieć tylko małe litery, cyfry i dywizy.')
  }
  if (seenIds.has(storyId)) {
    c.error('structure', { ...place, field: 'id' }, 'Bajka o tym id już istnieje.')
  }
  seenIds.add(storyId)

  if (!LEVELS.includes(story.level)) {
    c.error('structure', { ...place, field: 'level' }, 'level musi być równe Pre-A1 albo A1.')
  }
  if (options.requireVerified !== false && story.guardianVerified !== true) {
    c.error('verified', { ...place, field: 'guardianVerified' }, 'Bajka w stories.json musi mieć guardianVerified: true.')
  }
  if (isText(story.characterVisualAnchor) && story.characterVisualAnchor.length < MIN_ANCHOR_LENGTH) {
    c.error('visual', { ...place, field: 'characterVisualAnchor' }, `Kotwica wizualna musi mieć co najmniej ${MIN_ANCHOR_LENGTH} znaków.`)
  }
  checkVisualConfig(story.coverVisualConfig, { ...place, field: 'coverVisualConfig' }, c)
  checkImageUrl(story.coverImageUrl, storyId, { ...place, field: 'coverImageUrl' }, options, c)
  checkSafety(story, '', storyId, c)

  if (!Array.isArray(story.pages)) {
    c.error('structure', { ...place, field: 'pages' }, 'pages musi być tablicą.')
    return 0
  }
  if (story.pages.length < MIN_PAGES || story.pages.length > MAX_PAGES) {
    c.error('pedagogy', { ...place, field: 'pages' }, `Bajka ma ${story.pages.length} stron, wymagane ${MIN_PAGES}–${MAX_PAGES}.`)
  }
  story.pages.forEach((page, pageIndex) => checkPage(page, pageIndex, story, storyId, options, c))
  return story.pages.length
}

/**
 * One flashcard key must mean one thing across all stories, or the quiz has no single answer.
 *
 * @param {unknown[]} stories
 * @param {Collector} c
 */
function checkFlashcards(stories, c) {
  /** @type {Map<string, { answers: Set<string>, phonetics: Set<string> }>} */
  const cards = new Map()

  for (const story of stories) {
    if (!isObject(story) || !Array.isArray(story.pages)) continue
    for (const page of story.pages) {
      if (!isObject(page) || !Array.isArray(page.words)) continue
      for (const token of page.words) {
        if (!isValidToken(token) || !token.isKeyword) continue
        const { key, answerPl, phoneticsPl } = flashcardOf(token)
        const card = cards.get(key) ?? { answers: new Set(), phonetics: new Set() }
        card.answers.add(answerPl.toLowerCase())
        card.phonetics.add(phoneticsPl.toLowerCase())
        cards.set(key, card)
      }
    }
  }

  for (const [key, { answers, phonetics }] of cards) {
    if (answers.size > 1) {
      c.error('lemma', {}, `Fiszka „${key}” ma kilka odpowiedzi: ${[...answers].join(', ')}. Ustaw lemmaPl.`)
    }
    if (phonetics.size > 1) {
      c.error('lemma', {}, `Fiszka „${key}” ma kilka wymów: ${[...phonetics].join(', ')}. Ustaw lemmaPhoneticsPl.`)
    }
  }
}

/**
 * @param {unknown} stories
 * @param {GuardianOptions} [options]
 * @returns {GuardianReport}
 */
export function validateStories(stories, options = {}) {
  const c = createCollector()
  if (!Array.isArray(stories) || stories.length === 0) {
    c.error('structure', {}, 'Oczekiwana niepusta tablica bajek.')
    return { errors: c.errors, warnings: c.warnings, storyCount: 0, pageCount: 0 }
  }

  /** @type {Set<string>} */
  const seenIds = new Set()
  const pageCount = stories.reduce(
    (total, story, index) => total + checkStory(story, index, seenIds, options, c),
    0,
  )
  checkFlashcards(stories, c)

  return { errors: c.errors, warnings: c.warnings, storyCount: stories.length, pageCount }
}

/**
 * Validates a story pasted or generated on the phone against the stories already in the app (D22).
 *
 * @param {unknown} candidate
 * @param {unknown[]} [existingStories]
 * @returns {GuardianReport}
 */
export function validateImportedStory(candidate, existingStories = []) {
  const report = validateStories([...existingStories, candidate], { requireVerified: false })

  if (isObject(candidate)) {
    const pages = Array.isArray(candidate.pages) ? candidate.pages : []
    const urls = [candidate.coverImageUrl, ...pages.map((page) => (isObject(page) ? page.imageUrl : undefined))]
    if (urls.some((url) => url !== undefined)) {
      report.errors.push({
        rule: 'image',
        message: 'Bajka dodana z telefonu nie może mieć obrazów, tylko visualConfig.',
        storyId: isText(candidate.id) ? candidate.id : undefined,
      })
    }
  }
  return report
}
