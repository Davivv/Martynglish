---
name: martynka-story-generator
description: Generuje nową bajkę angielską dla Martynki (7 lat, Pre-A1) w formacie projektu Bajki Martynki i dopisuje ją do src/data/stories.json po przejściu Strażnika. Użyj, gdy ktoś prosi o "wygeneruj bajkę dla Martynki", "nowa bajka o ...", "dopisz bajkę" albo chce dodać treść do aplikacji.
---

# Generator bajek dla Martynki

Odbiorca to 7-letnia Polka: 1. klasa, czyta po polsku sylabami, angielski na poziomie Pre-A1. Dorosły (wujek) czyta każdą bajkę przed pokazaniem jej dziecku. Strażnik sprawdza reguły, nie sens.

Źródła prawdy: `docs/DECISIONS.md` wygrywa ze `docs/SPEC.md`. Kontrakt danych jest w `src/types/story.ts`, wartości sceny i props w `src/data/propCatalog.mjs`, reguły w `src/utils/storyGuardianCore.mjs`. Nie osłabiaj Strażnika, żeby przepuścić bajkę: popraw bajkę.

Protokół ma 5 kroków i wszystkie są obowiązkowe. Krok 5 kończy się dopiero po komunikacie `✅ ALL STORIES & VISUALS PASSED GUARDIAN CHECK` (D16).

## Krok 0: Przygotowanie

1. Przeczytaj temat od wujka. Gdy go nie ma, zapytaj.
2. Wypisz zajęte identyfikatory i istniejące fiszki, żeby nowa bajka z nimi nie kolidowała (D27):

```bash
node --input-type=module -e "
import fs from 'node:fs';
import { flashcardOf } from './src/utils/storyGuardianCore.mjs';
const stories = JSON.parse(fs.readFileSync('src/data/stories.json', 'utf8'));
console.log('ids:', stories.map((s) => s.id).join(', '));
const cards = new Map();
for (const s of stories) for (const p of s.pages) for (const w of p.words) if (w.isKeyword) { const c = flashcardOf(w); cards.set(c.key, c); }
for (const c of [...cards.values()].sort((a, b) => a.key.localeCompare(b.key))) console.log(c.key, '|', c.answerPl, '|', c.phoneticsPl);
"
```

Jeden klucz fiszki (`lemmaEn ?? word`, małymi literami) ma w całym zbiorze jedną odpowiedź (`lemmaPl ?? translationPl`) i jedną wymowę (`lemmaPhoneticsPl ?? phoneticsPl`). Używając istniejącego słowa kluczowego, skopiuj jego odpowiedź i wymowę z tej listy.

3. Wypisz dozwolone wartości sceny: `BACKGROUND_THEMES`, `PRIMARY_CHARACTERS`, `CHARACTER_MOODS` i `listProps()` z `src/data/propCatalog.mjs`.

## Krok 1: Projekt fabuły i kotwicy wizualnej

- Fabuła ma 5 albo 6 stron (twardy limit Strażnika), jedna prosta myśl na stronę, ciepły i spokojny ton.
- Wybierz 3-4 słowa kluczowe Pre-A1/A1, które powtórzą się na co najmniej 3 stronach. Oznaczają je flagi `isKeyword: true`.
- Zdefiniuj `characterVisualAnchor`: stały opis wyglądu bohatera po angielsku, co najmniej 30 znaków (imię, kolor, charakterystyczny szczegół, styl ilustracji). Będzie wklejony dosłownie w `imagePrompt` każdej strony (D10).
- Wybierz `id` (małe litery, cyfry, dywizy; unikalne), `themeColor` (`#RRGGBB`), `level` (`Pre-A1` albo `A1`) i `guardianVerified: true` (CLI Strażnika wymaga tej wartości, D14).
- Bezpieczeństwo (D17): w żadnym polu poza fonetyką nie używaj słów z czarnej listy, w obu językach: monster, blood, dead, death, kill, scary, ghost, darkness, cry, hate, gun, fight, knife, die (z odmianami) oraz potwór, krew, trup, zabić, straszny, duch, ciemność, płacz, nienawiść, broń, walka, nóż, umrzeć. Dotyczy też `imagePrompt`, `imageAltPl` i `interactiveSoundText`.

## Krok 2: Zdania, fonetyka sylabiczna i klocki

**Zdania.** `sentenceEn` ma 4-8 słów (norma). Strażnik toleruje 3-9 i przy wyjściu poza normę wypisuje ostrzeżenie (D9). Słowa liczy się po spacjach, więc `ice cream` to 2 słowa w 1 klocku.

**Klocki `words`.** Po złączeniu `words.map(w => w.word + (w.punctuation || '')).join(' ').trim()` daje dokładnie `sentenceEn`. Interpunkcja idzie do pola `punctuation` klocka, który kończy zdanie lub fragment.

**Zwroty (D29).** Klocek obejmuje zwrot, gdy jego słowa osobno dałyby złe tłumaczenie: `ice cream` (lody), `Good night` (dobranoc). Liczba mnoga to też jeden klocek (`ice creams`, z `lemmaEn: "ice cream"`).

**Tłumaczenie.** `translationPl` to dokładnie ta forma, która stoi w `sentencePl`, a forma słownikowa idzie do `lemmaPl`. Przykład: "Kotek widzi różową muszelkę." daje `pink` -> `różową`, `shell` -> `muszelkę` (błędnie: `różowy`, `muszelka`).

**Forma słownikowa (D27).** Gdy słowo kluczowe jest odmienione (`sees`, `stars`, `bananas`), ustaw `lemmaEn` (`see`), `lemmaPl` (forma słownikowa, `widzieć`) i `lemmaPhoneticsPl` (wymowa formy słownikowej). `lemmaPhoneticsPl` jest wymagane, gdy `lemmaEn` różni się od `word`. `isKeyword: true` dostają wszystkie rzeczowniki, kolory, przymiotniki, główne czasowniki i liczby; `false` tylko przedimki, zaimki, `is`/`are`, przyimki i spójniki. Nigdy nie ustawiaj `false`, żeby uniknąć konfliktu fiszek: użyj odpowiedzi z listy w `lemmaPl`. Każdy klocek `a` ma `"ttsOverride": "uh"`, inaczej lektor czyta nazwę litery.

**Fonetyka (D28).** Polskie sylaby z dywizami, np. `per-pl`, `li-tl`, `ha-pi`, `aj-s krim`. Zero IPA, zero liter `q`, `v`, `x`, zero zbitek `th`, `sh`, `ee`, `oo`. Tabela:

| Dźwięk | Zapis | Przykład |
| :--- | :--- | :--- |
| æ | `a` | `ha-pi`, `kat` |
| ə | `e` | `e` (a), `de` (the) |
| ɜː | `er` | `per-pl` |
| iː | `i` | `sli-pi` |
| uː | `u` | `blu` |
| θ | `f` | `fri` |
| ð | `d` | `de` |
| w | `ł` | `łajt` |
| v | `w` | `we-ri` |
| ʃ, tʃ, dʒ | `sz`, `cz`, `dż` | `szop`, `ma-dżik` |

Końcowe `-l` po spółgłosce tworzy własną sylabę (`li-tl`). Zwroty zachowują spację. `phoneticsPl` zdania to `phoneticsPl` klocków połączone spacjami (D13).

Wzorzec klocków dla zdania "The purple cat sees a pink flower.":

```json
{ "word": "sees", "translationPl": "widzi", "phoneticsPl": "siz", "isKeyword": true, "lemmaEn": "see", "lemmaPl": "widzieć", "lemmaPhoneticsPl": "si" }
```

## Krok 3: Scenografia i ilustracje

- Każda strona i `coverVisualConfig` mają pełne `visualConfig`: `backgroundTheme`, `primaryCharacter`, `characterMood`, `primaryColor` (`#RRGGBB`), opcjonalnie `secondaryColor` i niepustą tablicę `props` z katalogu (D12).
- Liczba i kolory w `props` zgadzają się ze zdaniem. Jeden wpis to jedna sztuka na scenie: "three stars" to `star-yellow` trzy razy, dwa żółte banany to `banana-yellow` dwa razy. Użyj tylko wartości z `listProps()`.
- `girl-<imię>` to koleżanka stojąca obok bohaterki, więc nie dodawaj koleżanki o imieniu bohaterki z tej strony.
- Martynka ma 7 lat i woli historie dla starszych dzieci. Kolejne odcinki seriali `neon-stars-*` i `friends-club-*` (D38) dopisuj na początku `stories.json`, tuż za poprzednim odcinkiem tego serialu, z numerem w tytule i haczykiem na końcu. Starsza jest fabuła, nie język. Nie używaj nazw ani postaci z prawdziwych seriali.
- `imagePrompt` zawiera `characterVisualAnchor` dosłownie, a po nim `Scene: ...` z opisem sceny po angielsku.
- `imageAltPl` opisuje scenę po polsku, `interactiveSoundText` to krótka angielska kwestia bohatera po dotknięciu.
- Nie generuj plików obrazów i nie wpisuj `imageUrl` ani `coverImageUrl` (D26): ilustracją jest `InteractiveStoryStage`, a `imagePrompt` zostaje do ewentualnego dorobienia obrazów później. Gdyby jednak powstały pliki, mają leżeć w `public/images/stories/<id>/` i mieć ponad 500 B.

## Krok 4: Audyt okiem Strażnika

Przed zapisem przejdź po bajce jak recenzent i popraw każdą usterkę:

1. Każda strona: klocki po złączeniu to `sentenceEn` co do znaku; `phoneticsPl` zdania to suma klocków.
2. Fonetyka bez IPA, `q`, `v`, `x`, `th`, `sh`, `ee`, `oo`; zgodna z tabelą D28.
3. Obrazek zgadza się z tekstem: liczba, kolor i rodzaj obiektów w `props`, tło, nastrój.
4. `translationPl` pasuje do kontekstu; odmienione słowa mają `lemma*`.
5. Klucze fiszek nie kolidują z istniejącymi (lista z kroku 0).
6. Każda strona ma słowo kluczowe, a 3-4 słowa kluczowe wracają na co najmniej 3 stronach.
7. Brak słów z czarnej listy, brak `imageUrl`.
8. Bajka jest ciepła, spójna i zrozumiała dla 7-latki. To ocena sensu, której Strażnik nie zrobi.

## Krok 5: Integracja i twardy test Strażnika

1. Dopisz obiekt bajki na koniec tablicy w `src/data/stories.json` (czysty JSON, bez komentarzy, bez przecinka na końcu).
2. Uruchom `npm run guardian`. Przy błędach popraw bajkę (nie Strażnika) i uruchom ponownie. Hook w `.claude/settings.json` odpala Strażnika po każdej zmianie pliku.
3. Uruchom `npm run build` (tsc + Vite) i `npm test`.
4. Zadanie jest skończone wyłącznie po komunikacie:

```text
✅ ALL STORIES & VISUALS PASSED GUARDIAN CHECK
```

5. Powiedz wujkowi, że bajkę trzeba przeczytać przed pokazaniem dziecku, i podaj jej tytuł, `id` oraz zdania EN/PL do przeczytania.

## Bajka z telefonu (bez dostępu do repo)

Gdy wujek nie ma laptopa, kreator w Strefie Wujka ("Kopiuj Prompt dla AI") buduje prompt z tymi samymi regułami. Odpowiedź AI to wtedy jeden obiekt JSON bez `imageUrl`, który aplikacja sprawdza Strażnikiem i zapisuje tylko w `localStorage` telefonu (D22, D30). Ten skill dotyczy bajek wbudowanych w repo.
