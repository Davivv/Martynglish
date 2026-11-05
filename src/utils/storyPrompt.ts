// Builds the instruction an adult pastes into any AI chat (Uncle Zone, way 1, D30).
// Pure function: the rules mirror storyGuardianCore.mjs, which stays the single judge (D15).
import {
  BACKGROUND_THEMES,
  CHARACTER_MOODS,
  PRIMARY_CHARACTERS,
  listProps,
} from '../data/propCatalog.mjs'
import type { Story } from '../types/story'
import { flashcardOf } from './storyGuardian'

export interface ExistingFlashcard {
  key: string
  answerPl: string
  phoneticsPl: string
}

/** Distinct flashcard keys of the given stories with their single answer and pronunciation (D27). */
export function collectFlashcards(stories: readonly Story[]): ExistingFlashcard[] {
  const cards = new Map<string, ExistingFlashcard>()
  for (const story of stories) {
    for (const page of story.pages) {
      for (const token of page.words) {
        if (!token.isKeyword) continue
        const card = flashcardOf(token)
        if (!cards.has(card.key)) cards.set(card.key, card)
      }
    }
  }
  return [...cards.values()].sort((a, b) => a.key.localeCompare(b.key))
}

const CONTRACT = `{
  "id": "maly-slug-kebab-case",
  "titleEn": "Title in English",
  "titlePl": "Tytuł po polsku",
  "characterVisualAnchor": "STAŁY opis wyglądu bohatera po angielsku, min. 30 znaków",
  "themeColor": "#RRGGBB",
  "level": "Pre-A1",
  "guardianVerified": false,
  "coverVisualConfig": SceneVisualConfig,
  "pages": [ StoryPage, ... 5 lub 6 stron ]
}

SceneVisualConfig = {
  "backgroundTheme": "<jedna z listy>",
  "primaryCharacter": "<jedna z listy>",
  "primaryColor": "#RRGGBB",
  "secondaryColor": "#RRGGBB",
  "props": ["<wartości z katalogu>", ...],
  "characterMood": "<jeden z listy>"
}

StoryPage = {
  "pageNumber": 1,
  "visualConfig": SceneVisualConfig,
  "imagePrompt": "<characterVisualAnchor dosłownie>. Scene: <opis sceny po angielsku>",
  "imageAltPl": "Opis obrazka po polsku.",
  "interactiveSoundText": "Meow! I see a pink flower!",
  "sentenceEn": "The purple cat sees a pink flower.",
  "phoneticsPl": "de per-pl kat siz e pink fla-łer",
  "sentencePl": "Fioletowy kotek widzi różowy kwiatek.",
  "words": [ WordToken, ... ]
}

WordToken = {
  "word": "sees",
  "punctuation": ".",              // opcjonalne, tuż po słowie
  "translationPl": "widzi",         // pasuje do kontekstu zdania
  "phoneticsPl": "siz",
  "isKeyword": true,                // false dla słów funkcyjnych: a, the, is, I
  "ttsOverride": "uh",              // opcjonalne, np. dla słowa "a"
  "lemmaEn": "see",                 // forma słownikowa, gdy różni się od "word"
  "lemmaPl": "widzieć",             // forma słownikowa po polsku
  "lemmaPhoneticsPl": "si"          // wymagane, gdy lemmaEn różni się od "word"
}`

const EXAMPLE_BLOCKS = `Przykładowe klocki (zdanie "The purple cat sees a pink flower."):
{ "word": "The", "translationPl": "ten", "phoneticsPl": "de", "isKeyword": false }
{ "word": "purple", "translationPl": "fioletowy", "phoneticsPl": "per-pl", "isKeyword": true }
{ "word": "cat", "translationPl": "kotek", "phoneticsPl": "kat", "isKeyword": true }
{ "word": "sees", "translationPl": "widzi", "phoneticsPl": "siz", "isKeyword": true, "lemmaEn": "see", "lemmaPl": "widzieć", "lemmaPhoneticsPl": "si" }
{ "word": "a", "translationPl": "jakiś", "phoneticsPl": "e", "isKeyword": false, "ttsOverride": "uh" }
{ "word": "pink", "translationPl": "różowy", "phoneticsPl": "pink", "isKeyword": true }
{ "word": "flower", "punctuation": ".", "translationPl": "kwiatek", "phoneticsPl": "fla-łer", "isKeyword": true }

Przykład zwrotu jako jeden klocek, z liczbą mnogą:
{ "word": "ice cream", "punctuation": ".", "translationPl": "lody", "phoneticsPl": "aj-s krim", "isKeyword": true }
{ "word": "ice creams", "translationPl": "lody", "phoneticsPl": "aj-s krimz", "isKeyword": true, "lemmaEn": "ice cream", "lemmaPl": "lody", "lemmaPhoneticsPl": "aj-s krim" }
{ "word": "Good night", "punctuation": "!", "translationPl": "dobranoc", "phoneticsPl": "gud najt", "isKeyword": true }`

const PHONETICS_TABLE = `| Dźwięk | Zapis | Przykład |
| --- | --- | --- |
| a z "cat" | a | ha-pi, kat |
| e nieakcentowane | e | e (a), de (the) |
| er | er | per-pl |
| długie i | i | sli-pi |
| długie u | u | blu |
| th bezdźwięczne | f | fri |
| th dźwięczne | d | de |
| w | ł | łajt |
| v | w | we-ri |
| sh, ch, j | sz, cz, dż | szop, ma-dżik |
Końcowe "-le" po spółgłosce tworzy własną sylabę (li-tl). Zwroty zachowują spację (aj-s krim, gud najt).`

const UNSAFE_LIST =
  'monster, blood, dead, death, kill, scary, ghost, darkness, cry, hate, gun, fight, knife, die ' +
  '(z odmianami) oraz po polsku: potwór, krew, trup, zabić, straszny, duch, ciemność, płacz, ' +
  'nienawiść, broń, walka, nóż, umrzeć (z odmianami)'

function joinValues(values: readonly string[]): string {
  return values.map((value) => `"${value}"`).join(', ')
}

function flashcardSection(cards: readonly ExistingFlashcard[]): string {
  if (cards.length === 0) return 'Nie ma jeszcze żadnych fiszek, więc nic nie koliduje.'
  const lines = cards.map((c) => `- ${c.key} | ${c.answerPl} | ${c.phoneticsPl}`)
  return [
    'Te klucze fiszek (lemmaEn lub word, małymi literami) już istnieją, w formacie klucz | odpowiedź | wymowa.',
    'Jeśli użyjesz słowa o takim kluczu jako isKeyword: true, ustaw dokładnie taką odpowiedź (lemmaPl albo translationPl)',
    'i taką wymowę (lemmaPhoneticsPl albo phoneticsPl). Inaczej bajka zostanie odrzucona.',
    ...lines,
  ].join('\n')
}

function idSection(ids: readonly string[]): string {
  return ids.length === 0 ? '' : `Zajęte identyfikatory (nie używaj ich w "id"): ${ids.join(', ')}.`
}

/**
 * Full instruction for the AI: topic, data contract, every Guardian rule, scene vocabulary and
 * the flashcards already in the app. The answer must be one JSON object.
 */
export function buildStoryPrompt(topic: string, existingStories: readonly Story[] = []): string {
  const theme = topic.trim() || '(wpisz temat bajki)'
  return `Jesteś autorem bajek angielskich dla 7-letniej Polki (1. klasa, czyta po polsku sylabami, angielski Pre-A1). Napisz jedną bajkę na temat: "${theme}".

ODPOWIEDŹ: wyłącznie jeden obiekt JSON jednej bajki. Bez komentarzy w JSON-ie, bez tekstu przed i po, bez markdownu. Aplikacja sprawdzi bajkę Strażnikiem; każde naruszenie reguł poniżej ją odrzuci.

## Kontrakt danych (TypeScript, "//" to objaśnienie, nie wpisuj komentarzy do JSON-a)
${CONTRACT}

Nie dodawaj pól "imageUrl" ani "coverImageUrl": bajka z telefonu ma tylko visualConfig, a obrazy zewnętrzne są zakazane.
Pola z "lemma" opisują formę słownikową fiszki: "stars" -> lemmaEn "star", lemmaPl "gwiazdka", lemmaPhoneticsPl "star".

## Reguły Strażnika
1. Bajka ma 5 albo 6 stron, numerowanych od 1 bez przerw (pageNumber).
2. Zdanie sentenceEn ma 4-8 słów (twardy limit Strażnika to 3-9). Liczy się je po spacjach, więc "ice cream" to 2 słowa.
3. Klocki words po złączeniu dają sentenceEn co do znaku: każdy klocek to word + punctuation, klocki łączone spacją. Żadne słowo ani znak nie może zginąć. Przykład: "Dino likes ice cream." to klocki Dino, likes, ice cream (z punctuation ".").
4. phoneticsPl zdania to fonetyki klocków połączone spacjami, w tej samej kolejności. Interpunkcja i wielkość liter nie mają znaczenia.
5. Fonetyka jest po polsku, sylabami z dywizami (per-pl, li-tl, ha-pi). Zabronione: znaki IPA, litery q, v, x, zbitki th, sh, ee, oo oraz litery spoza polskiego alfabetu. Dotyczy phoneticsPl i lemmaPhoneticsPl.
6. Tabela fonetyki:
${PHONETICS_TABLE}
7. Zwrot jest jednym klockiem, gdy osobne słowa dałyby złe tłumaczenie: "ice cream" (lody), "Good night" (dobranoc). Inne słowa to osobne klocki.
8. Każda strona ma co najmniej jedno słowo z isKeyword: true. isKeyword: true dostają WSZYSTKIE rzeczowniki, kolory, przymiotniki, główne czasowniki i liczby (np. pink, white, beach, happy, has, likes, two). isKeyword: false tylko przedimki (a, the), zaimki, is/are, przyimki i spójniki. Nie ustawiaj false po to, żeby uniknąć konfliktu fiszek: konflikt rozwiązuje się przez wpisanie w lemmaPl odpowiedzi z listy istniejących fiszek. Powtórz 3-4 słowa kluczowe na co najmniej 3 stronach.
9. translationPl to dokładnie ta forma, która stoi w sentencePl, a nie forma ze słownika. Dla zdania "The cat sees a pink shell." / sentencePl "Kotek widzi różową muszelkę." poprawnie: pink -> translationPl "różową", shell -> translationPl "muszelkę". Błędnie: pink -> "różowy", shell -> "muszelka". Forma słownikowa idzie do lemmaEn, lemmaPl i lemmaPhoneticsPl (np. lemmaPl "różowy"). lemmaPhoneticsPl jest wymagane, gdy lemmaEn różni się od word.
9a. Każdy klocek "a" musi mieć "ttsOverride": "uh". Bez tego lektor czyta nazwę litery.
10. Jeden klucz fiszki (lemmaEn albo word, małymi literami) ma w całym zbiorze jedną odpowiedź (lemmaPl albo translationPl) i jedną wymowę. Patrz sekcja o istniejących fiszkach.
11. characterVisualAnchor ma co najmniej 30 znaków i opisuje stały wygląd bohatera po angielsku. imagePrompt każdej strony zawiera ten opis DOSŁOWNIE (identyczny ciąg znaków), po nim zdanie "Scene: ...".
12. Każda strona i okładka (coverVisualConfig) mają pełne visualConfig: backgroundTheme, primaryCharacter, characterMood, primaryColor (#RRGGBB) i niepustą tablicę props. Liczba i kolory props zgadzają się ze zdaniem: 3 lody w tekście to 3 wpisy icecream-N, dwa żółte banany to "banana-yellow" dwa razy. Jeden wpis to jedna sztuka na scenie.
13. level to "Pre-A1" albo "A1". guardianVerified wpisz jako false (aplikacja ustawi je sama po sprawdzeniu). id to małe litery, cyfry i dywizy, np. "little-panda-stars".
14. Bezpieczeństwo: w żadnym polu tekstowym (poza fonetyką) nie wolno użyć słów: ${UNSAFE_LIST}. Bajka ma być ciepła i spokojna.
15. Wszystkie pola tekstowe z kontraktu są obowiązkowe i niepuste, poza oznaczonymi jako opcjonalne.

## Wartości sceny
backgroundTheme: ${joinValues(BACKGROUND_THEMES)}
primaryCharacter: ${joinValues(PRIMARY_CHARACTERS)}
characterMood: ${joinValues(CHARACTER_MOODS)}
Dozwolone props (tylko te, każda wartość to jedna sztuka): ${listProps().join(', ')}

## Przykłady klocków
${EXAMPLE_BLOCKS}

## Istniejące fiszki
${flashcardSection(collectFlashcards(existingStories))}
${idSection(existingStories.map((s) => s.id))}

Odpowiedz teraz samym obiektem JSON bajki.`
}
