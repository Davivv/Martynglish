import type {
  BACKGROUND_THEMES,
  CHARACTER_MOODS,
  PRIMARY_CHARACTERS,
} from '../data/propCatalog.mjs'

export type BackgroundTheme = (typeof BACKGROUND_THEMES)[number]
export type PrimaryCharacter = (typeof PRIMARY_CHARACTERS)[number]
export type CharacterMood = (typeof CHARACTER_MOODS)[number]

export interface WordToken {
  /** Słowo lub krótki zwrot (np. "purple" lub "ice cream"). */
  word: string
  /** Interpunkcja wyświetlana tuż po słowie, np. ".", "!", ",". */
  punctuation?: string
  /** Tłumaczenie dopasowane ściśle do kontekstu zdania. */
  translationPl: string
  /** Polska wymowa sylabiczna z myślnikami, np. "per-pl", "aj-s krim". */
  phoneticsPl: string
  /** true = trafia do Fiszek; false = słowo funkcyjne ("a", "the", "is"). */
  isKeyword: boolean
  /** Opcjonalna korekta dla syntezatora mowy (np. dla słowa "a"). */
  ttsOverride?: string
  /** Forma słownikowa, klucz fiszki, gdy różni się od `word` (np. "stars" -> "star"). D27. */
  lemmaEn?: string
  /** Forma słownikowa po polsku, odpowiedź w quizie (np. "dużą" -> "duży"). D27. */
  lemmaPl?: string
  /** Wymowa formy słownikowej. Wymagana, gdy `lemmaEn` różni się od `word`. D27. */
  lemmaPhoneticsPl?: string
}

export interface SceneVisualConfig {
  backgroundTheme: BackgroundTheme
  primaryCharacter: PrimaryCharacter
  /** Kolor bohatera/elementu zgodny z tekstem (np. "#9333EA" dla purple). */
  primaryColor: string
  secondaryColor?: string
  /** Obiekty na scenie zgodne z tekstem, wartości z `propCatalog.mjs`. D12. */
  props: string[]
  characterMood: CharacterMood
}

export interface StoryPage {
  pageNumber: number
  /** Opcjonalna ścieżka `/images/stories/<story-id>/<plik>`. D11. */
  imageUrl?: string
  /** Obowiązkowa konfiguracja dla komponentu InteractiveStoryStage. */
  visualConfig: SceneVisualConfig
  /** Dokładny prompt sceny zawierający characterVisualAnchor. */
  imagePrompt: string
  /** Opis obrazka po polsku. */
  imageAltPl: string
  /** Co mówi bohater po dotknięciu ilustracji, np. "Meow! I am a purple cat!". */
  interactiveSoundText: string
  /** Pełne zdanie po angielsku (4–8 słów). */
  sentenceEn: string
  /** Pełny zapis fonetyczny zdania z sylabami po polsku. */
  phoneticsPl: string
  /** Pełne tłumaczenie po polsku (za zamgloną zasłoną). */
  sentencePl: string
  /** Tablica klocków (po złączeniu daje dokładnie sentenceEn!). */
  words: WordToken[]
}

export interface Story {
  id: string
  titleEn: string
  titlePl: string
  coverImageUrl?: string
  coverVisualConfig: SceneVisualConfig
  /** STAŁY opis wyglądu bohatera (min. 30 znaków) gwarantujący spójność. */
  characterVisualAnchor: string
  themeColor: string
  level: 'Pre-A1' | 'A1'
  guardianVerified: boolean
  pages: StoryPage[]
}
