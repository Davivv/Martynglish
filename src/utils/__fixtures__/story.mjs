// A minimal story that passes every Guardian rule. Each test breaks one thing in a fresh copy.

export const ANCHOR = 'Cute little test kitten with big green eyes and a small yellow collar'

function makePage(/** @type {number} */ pageNumber) {
  return {
    pageNumber,
    visualConfig: {
      backgroundTheme: 'meadow',
      primaryCharacter: 'cat',
      primaryColor: '#9333EA',
      props: ['ball-red'],
      characterMood: 'happy',
    },
    imagePrompt: `${ANCHOR}. Scene: the kitten looks at one red ball.`,
    imageAltPl: 'Kotek patrzy na czerwoną piłkę.',
    interactiveSoundText: 'Meow! I see a red ball!',
    sentenceEn: 'The cat sees a red ball.',
    phoneticsPl: 'de kat siz e red bol',
    sentencePl: 'Kotek widzi czerwoną piłkę.',
    words: [
      { word: 'The', translationPl: 'ten', phoneticsPl: 'de', isKeyword: false },
      { word: 'cat', translationPl: 'kotek', phoneticsPl: 'kat', isKeyword: true },
      {
        word: 'sees',
        translationPl: 'widzi',
        phoneticsPl: 'siz',
        isKeyword: true,
        lemmaEn: 'see',
        lemmaPl: 'widzieć',
        lemmaPhoneticsPl: 'si',
      },
      { word: 'a', translationPl: 'jakąś', phoneticsPl: 'e', isKeyword: false },
      {
        word: 'red',
        translationPl: 'czerwoną',
        phoneticsPl: 'red',
        isKeyword: true,
        lemmaPl: 'czerwony',
      },
      {
        word: 'ball',
        punctuation: '.',
        translationPl: 'piłkę',
        phoneticsPl: 'bol',
        isKeyword: true,
        lemmaPl: 'piłka',
      },
    ],
  }
}

/** @returns {any} loosely typed on purpose, so tests can break it in any way */
export function makeValidStory() {
  return {
    id: 'test-story',
    titleEn: 'The Test Cat',
    titlePl: 'Testowy Kotek',
    coverVisualConfig: {
      backgroundTheme: 'meadow',
      primaryCharacter: 'cat',
      primaryColor: '#9333EA',
      props: ['ball-red'],
      characterMood: 'happy',
    },
    characterVisualAnchor: ANCHOR,
    themeColor: '#9333EA',
    level: 'Pre-A1',
    guardianVerified: true,
    pages: [1, 2, 3, 4, 5].map(makePage),
  }
}
