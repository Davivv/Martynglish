// Word pictures for the games (D33): the child cannot read English, so a game shows a drawing.
import type { PrimaryCharacter } from '../types/story'

export type PictureSpec =
  | { kind: 'prop'; prop: string } // a value allowed by propCatalog, e.g. 'flower-pink'
  | { kind: 'character'; character: PrimaryCharacter; color: string }
  | { kind: 'color'; color: string }
  | { kind: 'count'; count: number }

export interface PictureWord {
  /** Same normalized key as a flashcard (`flashcardOf`). */
  key: string
  answerPl: string
  phoneticsPl: string
  picture: PictureSpec
}

const prop = (p: string): PictureSpec => ({ kind: 'prop', prop: p })
const character = (c: PrimaryCharacter, color: string): PictureSpec => ({ kind: 'character', character: c, color })
const color = (c: string): PictureSpec => ({ kind: 'color', color: c })
const count = (n: number): PictureSpec => ({ kind: 'count', count: n })
const word = (key: string, answerPl: string, phoneticsPl: string, picture: PictureSpec): PictureWord => ({
  key,
  answerPl,
  phoneticsPl,
  picture,
})

export const PICTURE_WORDS: readonly PictureWord[] = [
  word('cat', 'kotek', 'kat', character('cat', '#9333EA')),
  word('dog', 'piesek', 'dog', character('dog', '#D9A441')),
  word('flower', 'kwiatek', 'fla-łer', prop('flower-pink')),
  word('butterfly', 'motylek', 'ba-ter-flaj', prop('butterfly-blue')),
  word('sun', 'słońce', 'san', prop('sun-yellow')),
  word('ball', 'piłka', 'bol', prop('ball-red')),
  word('tree', 'drzewo', 'tri', prop('tree-green')),
  word('star', 'gwiazdka', 'star', prop('star-yellow')),
  word('apple', 'jabłko', 'a-pl', prop('apple-red')),
  word('banana', 'banan', 'ba-na-na', prop('banana-yellow')),
  word('ice cream', 'lody', 'aj-s krim', prop('icecream-1')),
  word('moon', 'księżyc', 'mun', prop('moon-yellow')),
  word('bird', 'ptak', 'berd', prop('bird-blue')),
  word('fish', 'ryba', 'fisz', prop('fish-orange')),
  word('cloud', 'chmura', 'klaud', prop('cloud-white')),
  word('heart', 'serce', 'hart', prop('heart-red')),
  word('balloon', 'balon', 'be-lun', prop('balloon-red')),
  word('shell', 'muszelka', 'szel', prop('shell-pink')),
  word('rainbow', 'tęcza', 'rejn-bou', prop('rainbow-1')),
  word('chocolate', 'czekolada', 'czo-klet', prop('chocolate-brown')),
  word('panda', 'panda', 'pan-da', character('panda', '#EF4444')),
  word('bunny', 'króliczek', 'ba-ni', character('bunny', '#C4B5FD')),

  word('red', 'czerwony', 'red', color('#EF4444')),
  word('blue', 'niebieski', 'blu', color('#3B82F6')),
  word('green', 'zielony', 'grin', color('#22C55E')),
  word('yellow', 'żółty', 'je-lou', color('#FACC15')),
  word('orange', 'pomarańczowy', 'o-rindż', color('#F97316')),
  word('pink', 'różowy', 'pink', color('#EC4899')),
  word('purple', 'fioletowy', 'per-pl', color('#9333EA')),
  word('white', 'biały', 'łajt', color('#FFFFFF')),

  word('one', 'jeden', 'łan', count(1)),
  word('two', 'dwa', 'tu', count(2)),
  word('three', 'trzy', 'fri', count(3)),
  word('four', 'cztery', 'for', count(4)),
  word('five', 'pięć', 'fajw', count(5)),
]

const BY_KEY = new Map(PICTURE_WORDS.map((w) => [w.key, w]))

export function pictureOf(key: string): PictureSpec | undefined {
  return BY_KEY.get(key)?.picture
}
