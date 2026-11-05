import { describe, expect, it } from 'vitest'
import { ANCHOR, makeValidStory } from './__fixtures__/story.mjs'
import {
  findPhoneticProblem,
  findUnsafeWord,
  flashcardOf,
  formatIssue,
  validateImportedStory,
  validateStories,
  type GuardianOptions,
  type GuardianReport,
} from './storyGuardianCore.mjs'

const rules = (report: GuardianReport) => report.errors.map((issue) => issue.rule)
const check = (story: unknown, options?: GuardianOptions) => validateStories([story], options)

/** Replaces page 1 with the given sentence and blocks, keeping it otherwise valid. */
function withSentence(sentenceEn: string, words: object[], phoneticsPl: string) {
  const story = makeValidStory()
  Object.assign(story.pages[0], { sentenceEn, words, phoneticsPl })
  return story
}

describe('baseline', () => {
  it('passes the fixture with no errors and no warnings', () => {
    const report = check(makeValidStory())
    expect(report.errors).toEqual([])
    expect(report.warnings).toEqual([])
    expect(report.storyCount).toBe(1)
    expect(report.pageCount).toBe(5)
  })
})

describe('structure', () => {
  it.each([[null], [undefined], ['text'], [{}], [[]]])('rejects %j as the story list', (input) => {
    expect(rules(validateStories(input))).toEqual(['structure'])
  })

  it.each([[null], ['text'], [7], [[]]])('rejects %j as a story without crashing', (story) => {
    expect(rules(check(story))).toContain('structure')
  })

  it('survives a story with no fields', () => {
    expect(rules(check({}))).toContain('structure')
  })

  it.each([[null], ['text'], [{}]])('rejects %j as pages', (pages) => {
    const story = makeValidStory()
    story.pages = pages
    expect(rules(check(story))).toContain('structure')
  })

  it('rejects a page that is not an object', () => {
    const story = makeValidStory()
    story.pages[2] = null
    expect(rules(check(story))).toContain('structure')
  })

  it.each([[undefined], [[]], ['text'], [[null]], [[{ word: 'cat' }]]])('rejects %j as words', (words) => {
    const story = makeValidStory()
    story.pages[0].words = words
    expect(rules(check(story))).toContain('structure')
  })

  it('rejects a block with a non-text optional field', () => {
    const story = makeValidStory()
    story.pages[0].words[1].lemmaPl = 7
    expect(rules(check(story))).toContain('structure')
  })

  it('rejects a wrong page number', () => {
    const story = makeValidStory()
    story.pages[1].pageNumber = 9
    expect(rules(check(story))).toContain('structure')
  })

  it('rejects duplicate story ids', () => {
    expect(rules(validateStories([makeValidStory(), makeValidStory()]))).toContain('structure')
  })

  it.each(['Purple Cat', 'purple_cat', '../cat', '-cat'])('rejects the id %s', (id) => {
    const story = makeValidStory()
    story.id = id
    expect(rules(check(story))).toContain('structure')
  })

  it('rejects an unknown level', () => {
    const story = makeValidStory()
    story.level = 'B2'
    expect(rules(check(story))).toContain('structure')
  })
})

describe('sentence-match', () => {
  it('rejects a missing word', () => {
    const story = makeValidStory()
    story.pages[0].sentenceEn = 'The big cat sees a red ball.'
    expect(rules(check(story))).toContain('sentence-match')
  })

  it('rejects changed punctuation', () => {
    const story = makeValidStory()
    story.pages[0].words.at(-1).punctuation = '!'
    expect(rules(check(story))).toContain('sentence-match')
  })

  it('rejects changed letter case', () => {
    const story = makeValidStory()
    story.pages[0].sentenceEn = 'the cat sees a red ball.'
    expect(rules(check(story))).toContain('sentence-match')
  })

  it('accepts a two-word block', () => {
    const story = withSentence(
      'I like ice cream.',
      [
        { word: 'I', translationPl: 'ja', phoneticsPl: 'aj', isKeyword: false },
        { word: 'like', translationPl: 'lubię', phoneticsPl: 'lajk', isKeyword: true },
        {
          word: 'ice cream',
          punctuation: '.',
          translationPl: 'lody',
          phoneticsPl: 'aj-s krim',
          isKeyword: true,
        },
      ],
      'aj lajk aj-s krim',
    )
    expect(check(story).errors).toEqual([])
  })
})

describe('phonetics', () => {
  it.each([
    ['znak IPA „ə”', 'pəpl'],
    ['znak IPA „ɜ”', 'pɜpl'],
    ['znak IPA „θ”', 'θri'],
    ['znak IPA „ʃ”', 'ʃop'],
    ['znak IPA „ˈ”', 'ˈhapi'],
    ['niepolska litera „q”', 'quin'],
    ['niepolska litera „v”', 'veri'],
    ['niepolska litera „x”', 'siks-x'],
    ['angielska zbitka „th”', 'the'],
    ['angielska zbitka „sh”', 'shop'],
    ['angielska zbitka „ee”', 'green'],
    ['angielska zbitka „oo”', 'look'],
    ['obca litera „ü”', 'grün'],
  ])('reports %s', (problem, text) => {
    expect(findPhoneticProblem(text)).toBe(problem)
  })

  it.each(['per-pl', 'li-tl', 'ha-pi', 'aj-s krim', 'fri', 'de', 'we-ri', 'szop', 'luk', 'łajt', 'ma-dżik', 'ąćęłńóśźż'])(
    'accepts %s',
    (text) => {
      expect(findPhoneticProblem(text)).toBeNull()
    },
  )

  it('rejects bad phonetics on a block', () => {
    const story = makeValidStory()
    story.pages[0].words[1].phoneticsPl = 'kæt'
    expect(rules(check(story))).toContain('phonetics')
  })

  it('rejects bad phonetics on a sentence', () => {
    const story = makeValidStory()
    story.pages[0].phoneticsPl = 'the kat siz e red bol'
    expect(rules(check(story))).toContain('phonetics')
  })

  it('rejects bad phonetics on a lemma', () => {
    const story = makeValidStory()
    story.pages[0].words[2].lemmaPhoneticsPl = 'see'
    expect(rules(check(story))).toContain('phonetics')
  })
})

describe('phonetics-sum (D13)', () => {
  it('rejects sentence phonetics that differ from the blocks', () => {
    const story = makeValidStory()
    story.pages[0].phoneticsPl = 'de kat siz e bol'
    expect(rules(check(story))).toContain('phonetics-sum')
  })

  it('ignores punctuation, case and spacing', () => {
    const story = makeValidStory()
    story.pages[0].phoneticsPl = 'De  kat siz e red bol.'
    expect(check(story).errors).toEqual([])
  })
})

describe('visual', () => {
  it('rejects a short anchor', () => {
    const story = makeValidStory()
    story.characterVisualAnchor = 'Short cat'
    for (const page of story.pages) page.imagePrompt = 'Short cat on a meadow'
    expect(rules(check(story))).toContain('visual')
  })

  it('rejects an imagePrompt that does not contain the anchor (D10)', () => {
    const story = makeValidStory()
    story.pages[3].imagePrompt = 'A kitten on a meadow'
    expect(rules(check(story))).toContain('visual')
  })

  it('accepts the anchor inside a longer imagePrompt', () => {
    const story = makeValidStory()
    story.pages[3].imagePrompt = `Watercolor. ${ANCHOR}. Sunny day.`
    expect(check(story).errors).toEqual([])
  })

  it.each(['backgroundTheme', 'primaryCharacter', 'primaryColor', 'props', 'characterMood'])(
    'rejects a visualConfig without %s',
    (field) => {
      const story = makeValidStory()
      delete story.pages[0].visualConfig[field]
      expect(rules(check(story))).toContain('visual')
    },
  )

  it('rejects a page without visualConfig', () => {
    const story = makeValidStory()
    delete story.pages[0].visualConfig
    expect(rules(check(story))).toContain('visual')
  })

  it('rejects a story without coverVisualConfig', () => {
    const story = makeValidStory()
    delete story.coverVisualConfig
    expect(rules(check(story))).toContain('visual')
  })

  it('rejects empty props', () => {
    const story = makeValidStory()
    story.pages[0].visualConfig.props = []
    expect(rules(check(story))).toContain('visual')
  })

  it('rejects an unknown prop (D12)', () => {
    const story = makeValidStory()
    story.pages[0].visualConfig.props = ['dragon-red']
    expect(rules(check(story))).toContain('visual')
  })

  it('accepts repeated props', () => {
    const story = makeValidStory()
    story.pages[0].visualConfig.props = ['banana-yellow', 'banana-yellow']
    expect(check(story).errors).toEqual([])
  })

  it.each([['backgroundTheme', 'space'], ['primaryCharacter', 'fox'], ['characterMood', 'angry'], ['primaryColor', 'purple']])(
    'rejects %s = %s',
    (field, value) => {
      const story = makeValidStory()
      story.pages[0].visualConfig[field] = value
      expect(rules(check(story))).toContain('visual')
    },
  )
})

describe('image (D11)', () => {
  const valid = '/images/stories/test-story/page-1.webp'

  it.each([
    'https://example.com/cat.png',
    '//example.com/cat.png',
    // Same length before the file name as the local prefix, so only the prefix check can stop it
    'https://evil.example.com/abcat.png',
    '/public/images/stories/test-story/page-1.webp',
    '/images/stories/other-story/page-1.webp',
    '/images/stories/test-story/../secret.png',
    '/images/stories/test-story/page-1.gif',
    'data:image/png;base64,AAAA',
  ])('rejects %s', (url) => {
    const story = makeValidStory()
    story.pages[0].imageUrl = url
    expect(rules(check(story))).toContain('image')
  })

  it('checks coverImageUrl too', () => {
    const story = makeValidStory()
    story.coverImageUrl = 'https://example.com/cat.png'
    expect(rules(check(story))).toContain('image')
  })

  it('accepts a local path when no file check is available', () => {
    const story = makeValidStory()
    story.pages[0].imageUrl = valid
    expect(check(story).errors).toEqual([])
  })

  it.each([
    ['a missing file', null, true],
    ['a 500 B file', 500, true],
    ['a 501 B file', 501, false],
  ])('handles %s', (_name, size, rejected) => {
    const story = makeValidStory()
    story.pages[0].imageUrl = valid
    const report = check(story, { getImageSize: () => size })
    expect(rules(report).includes('image')).toBe(rejected)
  })

  it('says that a missing file does not exist', () => {
    const story = makeValidStory()
    story.pages[0].imageUrl = valid
    const [issue] = check(story, { getImageSize: () => null }).errors
    expect(issue?.message).toBe(`Plik nie istnieje: public${valid}.`)
  })
})

describe('pedagogy', () => {
  it.each([[4, true], [5, false], [6, false], [7, true]])('with %i pages rejected: %s', (count, rejected) => {
    const story = makeValidStory()
    const page = story.pages[0]
    story.pages = Array.from({ length: count }, (_, index) => ({ ...page, pageNumber: index + 1 }))
    expect(rules(check(story)).includes('pedagogy')).toBe(rejected)
  })

  const sentence = (count: number) => {
    const list = Array.from({ length: count }, () => 'cat')
    return withSentence(
      list.join(' '),
      list.map((word) => ({ word, translationPl: 'kotek', phoneticsPl: 'kat', isKeyword: true })),
      list.map(() => 'kat').join(' '),
    )
  }

  it.each([
    [2, true, false],
    [3, false, true],
    [4, false, false],
    [8, false, false],
    [9, false, true],
    [10, true, false],
  ])('a sentence of %i words: error %s, warning %s (D9)', (count, error, warning) => {
    const report = check(sentence(count))
    expect(rules(report).includes('pedagogy')).toBe(error)
    expect(report.warnings.some((issue) => issue.rule === 'pedagogy')).toBe(warning)
  })

  it('counts a two-word block as two words', () => {
    const list = ['cat', 'cat', 'cat', 'cat', 'cat', 'cat', 'cat', 'cat']
    const words = [
      ...list.map((word) => ({ word, translationPl: 'kotek', phoneticsPl: 'kat', isKeyword: true })),
      { word: 'ice cream', translationPl: 'lody', phoneticsPl: 'aj-s krim', isKeyword: true },
    ]
    const story = withSentence(`${list.join(' ')} ice cream`, words, `${list.map(() => 'kat').join(' ')} aj-s krim`)
    expect(rules(check(story))).toContain('pedagogy')
  })

  it('rejects a page with no keyword', () => {
    const story = makeValidStory()
    for (const token of story.pages[0].words) token.isKeyword = false
    expect(rules(check(story))).toContain('pedagogy')
  })
})

describe('safety (D17)', () => {
  it.each(['crystal', 'candies', 'teddies', 'birdie', 'skill', 'skillful', 'whatever', 'begun', 'deadline', 'audience', 'diet'])(
    'lets through the innocent word %s',
    (word) => {
      expect(findUnsafeWord(`The cat has a ${word}.`)).toBeNull()
    },
  )

  it.each(['monster', 'monsters', 'blood', 'dead', 'kill', 'killed', 'scary', 'ghost', 'darkness', 'cry', 'crying', 'hate', 'gun', 'fight', 'knife', 'knives', 'die', 'dies', 'died', 'dying'])(
    'blocks the English word %s',
    (word) => {
      expect(findUnsafeWord(`The cat and the ${word} here.`)).toBe(word)
    },
  )

  it.each(['potwór', 'potwora', 'potwor', 'krew', 'krwi', 'nóż', 'noża', 'zabić', 'zabił', 'straszny', 'duch', 'duchy', 'ciemność', 'płacz', 'płakać', 'nienawiść', 'broń', 'walka', 'umrzeć', 'śmierć', 'martwy', 'trup'])(
    'blocks the Polish word %s',
    (word) => {
      expect(findUnsafeWord(`Kotek i ${word} tutaj.`)).toBe(word)
    },
  )

  it.each(['Martynka', 'nożyczki', 'zabiera', 'martwi', 'umiem', 'walk', 'ciemny', 'duchowy', 'Indie'])(
    'lets through the innocent word %s',
    (word) => {
      expect(findUnsafeWord(`Kotek ${word} tutaj.`)).toBeNull()
    },
  )

  it('ignores letter case', () => {
    expect(findUnsafeWord('A SCARY cat')).toBe('SCARY')
    expect(findUnsafeWord('POTWÓR')).toBe('POTWÓR')
  })

  it('handles decomposed Polish letters from pasted text', () => {
    expect(findUnsafeWord('nóż')).not.toBeNull()
  })

  it.each([
    ['titleEn', (s: any) => (s.titleEn = 'The Ghost Cat')],
    ['titlePl', (s: any) => (s.titlePl = 'Straszny kotek')],
    ['id', (s: any) => (s.id = 'ghost-cat')],
    ['anchor', (s: any) => (s.characterVisualAnchor += ' with a knife')],
    ['imagePrompt', (s: any) => (s.pages[1].imagePrompt += ' no scary elements')],
    ['imageAltPl', (s: any) => (s.pages[1].imageAltPl = 'Kotek i potwór')],
    ['interactiveSoundText', (s: any) => (s.pages[1].interactiveSoundText = 'I hate you!')],
    ['sentencePl', (s: any) => (s.pages[1].sentencePl = 'Kotek ma nóż.')],
    ['translationPl', (s: any) => (s.pages[1].words[1].translationPl = 'duch')],
    ['ttsOverride', (s: any) => (s.pages[1].words[1].ttsOverride = 'die')],
  ])('checks the field %s', (_name, breakStory) => {
    const story = makeValidStory()
    breakStory(story)
    expect(rules(check(story))).toContain('safety')
  })

  it('does not read phonetics as words', () => {
    const story = makeValidStory()
    story.pages[0].words[1].phoneticsPl = 'trup'
    story.pages[0].phoneticsPl = 'de trup siz e red bol'
    expect(rules(check(story))).not.toContain('safety')
  })
})

describe('verified (D14)', () => {
  it.each([[false], [undefined], ['true']])('rejects guardianVerified = %j', (value) => {
    const story = makeValidStory()
    story.guardianVerified = value
    expect(rules(check(story))).toContain('verified')
  })
})

describe('flashcards (D27)', () => {
  it('uses the lemma when present', () => {
    expect(
      flashcardOf({
        word: 'Stars',
        translationPl: 'gwiazdki',
        phoneticsPl: 'stars',
        isKeyword: true,
        lemmaEn: 'star',
        lemmaPl: 'gwiazdka',
        lemmaPhoneticsPl: 'star',
      }),
    ).toEqual({ key: 'star', answerPl: 'gwiazdka', phoneticsPl: 'star' })
  })

  it('falls back to the word in context', () => {
    expect(
      flashcardOf({ word: 'Cat', translationPl: 'kotek', phoneticsPl: 'kat', isKeyword: true }),
    ).toEqual({ key: 'cat', answerPl: 'kotek', phoneticsPl: 'kat' })
  })

  it('requires lemmaPhoneticsPl when the lemma differs from the word', () => {
    const story = makeValidStory()
    for (const page of story.pages) delete page.words[2].lemmaPhoneticsPl
    expect(rules(check(story))).toContain('lemma')
  })

  it('does not require lemmaPhoneticsPl when only the case differs', () => {
    const story = makeValidStory()
    for (const page of story.pages) page.words[1].lemmaEn = 'Cat'
    expect(check(story).errors).toEqual([])
  })

  it('rejects one word with two different answers', () => {
    const story = makeValidStory()
    delete story.pages[0].words[4].lemmaPl
    story.pages[1].words[4].lemmaPl = 'czerwona'
    expect(rules(check(story))).toContain('lemma')
  })

  it('rejects one word with two different pronunciations', () => {
    const story = makeValidStory()
    story.pages[0].words[1].phoneticsPl = 'ket'
    story.pages[0].phoneticsPl = 'de ket siz e red bol'
    expect(rules(check(story))).toContain('lemma')
  })

  it('compares answers across stories', () => {
    const other = makeValidStory()
    other.id = 'other-story'
    for (const page of other.pages) page.words[1].translationPl = 'kot'
    expect(rules(validateStories([makeValidStory(), other]))).toContain('lemma')
  })

  it('lets a function word change its translation with context', () => {
    const story = makeValidStory()
    story.pages[0].words[0].translationPl = 'ta'
    expect(check(story).errors).toEqual([])
  })
})

describe('validateImportedStory (D22)', () => {
  it('accepts a new story and does not require guardianVerified', () => {
    const candidate = makeValidStory()
    candidate.id = 'new-story'
    delete candidate.guardianVerified
    expect(validateImportedStory(candidate, [makeValidStory()]).errors).toEqual([])
  })

  it('rejects an id that already exists', () => {
    expect(rules(validateImportedStory(makeValidStory(), [makeValidStory()]))).toContain('structure')
  })

  it('rejects a local image, which only the repo can provide', () => {
    const candidate = makeValidStory()
    candidate.pages[0].imageUrl = '/images/stories/test-story/page-1.webp'
    expect(rules(validateImportedStory(candidate))).toContain('image')
  })

  it('rejects a cover image', () => {
    const candidate = makeValidStory()
    candidate.coverImageUrl = '/images/stories/test-story/cover.webp'
    expect(rules(validateImportedStory(candidate))).toContain('image')
  })

  it('rejects a flashcard conflict with an existing story', () => {
    const candidate = makeValidStory()
    candidate.id = 'new-story'
    for (const page of candidate.pages) page.words[1].translationPl = 'kot'
    expect(rules(validateImportedStory(candidate, [makeValidStory()]))).toContain('lemma')
  })

  it.each([[null], ['text'], [{}]])('survives %j', (candidate) => {
    expect(rules(validateImportedStory(candidate))).toContain('structure')
  })
})

describe('formatIssue', () => {
  it('names the rule and the place', () => {
    expect(
      formatIssue({ rule: 'phonetics', message: 'Zły zapis.', storyId: 'cat', pageNumber: 2, field: 'phoneticsPl' }),
    ).toBe('[phonetics] cat, strona 2, phoneticsPl: Zły zapis.')
  })

  it('works without a place', () => {
    expect(formatIssue({ rule: 'lemma', message: 'Konflikt.' })).toBe('[lemma] Konflikt.')
  })
})
