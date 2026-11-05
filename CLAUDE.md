# Bajki Martynki

PWA do nauki angielskiego przez czytanie bajek. Jedyna użytkowniczka to 7-letnia Martynka: 1. klasa, czyta po polsku sylabami, angielski na poziomie Pre-A1. Aplikacją zarządza jej wujek, właściciel tego repo, także z telefonu. Nie ma backendu ani logowania: postępy są w `localStorage`, aplikacja działa offline i jest Android-first.

## Źródła prawdy

Przy sprzeczności wygrywa pozycja wyższa na liście:

1. [docs/DECISIONS.md](docs/DECISIONS.md): rozstrzygnięcia sprzeczności i luk specyfikacji (D1, D2…) oraz otwarte pytania (P2).
2. [docs/SPEC.md](docs/SPEC.md): pełna specyfikacja v6.0, zapisana dosłownie. Nie edytuj jej.
3. [docs/PLAN.md](docs/PLAN.md): fazy prac i ich status. Odhaczaj po skończeniu fazy.

Przed pracą nad modułem przeczytaj jego sekcję w SPEC i decyzje, które go dotyczą.

## Komendy

```bash
npm run dev         # serwer deweloperski
npm run dev:phone   # to samo w sieci LAN, do testów na telefonie
npm run build       # tsc -b + vite build
npm run preview     # podgląd builda, tu działa Service Worker
npm run typecheck   # tsc -b
npm run lint        # oxlint
npm test            # vitest run
npm run guardian    # Strażnik Bajek; uruchamia się też przed każdym buildem
```

## Stos

Vite 8, React 19, TypeScript 7, Tailwind CSS 4, vite-plugin-pwa, Vitest, oxlint, Lucide, canvas-confetti, Lexend z `@fontsource-variable/lexend`.

- TypeScript 7 nie działa z `typescript-eslint`, dlatego linter to oxlint (D1).
- Tailwind 4 nie ma `tailwind.config.js`. Motyw jest w `@theme` w [src/index.css](src/index.css).
- Manifest PWA utrzymujemy ręcznie w [public/manifest.json](public/manifest.json). Plugin PWA generuje tylko Service Worker.

## Struktura

```text
src/types/story.ts               kontrakt danych (SPEC §5)
src/data/stories.json            bajki; czysty JSON, czyta go też Node
src/data/propCatalog.mjs         dozwolone props sceny (D12)
src/utils/storyGuardianCore.mjs  logika Strażnika, bez fs i DOM (D15)
src/utils/storyGuardian.ts       typowany eksport Strażnika dla aplikacji
scripts/story-guardian.mjs       CLI Strażnika
src/data/stories.ts              typowane bajki: wbudowane i dodane z telefonu
src/hooks/useSpeech.ts           mowa i karaoke
src/utils/soundEffects.ts        efekty dźwiękowe z Web Audio API
src/utils/storage.ts             jedyny dostęp do localStorage (D24)
src/utils/vocabulary.ts          logika słownika i fiszek
src/utils/storyPrompt.ts         prompt kreatora bajek
src/components/stage/            InteractiveStoryStage i rysunki
src/components/nav/              dolny pasek
src/components/library/          biblioteka bajek
src/components/reader/           czytnik
src/components/treasures/        Skarby i quiz
src/components/uncle/            Strefa Wujka
```

Nawigacja to stan w `App.tsx`, bez routera. Scena wypełnia rodzica i nie gra dźwięków sama: dotknięcie bohatera zgłasza przez `onCharacterTap`.

Kod, nazwy i komentarze techniczne po angielsku, chyba że komentarz tłumaczy decyzję z dokumentów po polsku. Teksty w interfejsie po polsku, proste, pisane do 7-latki. Strefa Wujka może mówić językiem dorosłego.

## Zasady treści bajek

- Każda zmiana `src/data/stories.json` musi przejść Strażnika. Nigdy nie osłabiaj jego reguły, żeby przepuścić bajkę: popraw bajkę. Regułę zmieniasz tylko, gdy jest błędna, i wtedy dopisujesz decyzję do DECISIONS.
- Fonetyka to polskie sylaby z dywizami (`per-pl`, `aj-s krim`) według konwencji z D28. Zakazane są IPA, litery `q v x` oraz zbitki `th sh ee oo`.
- Klocki `words` po złączeniu dają `sentenceEn` co do znaku. Zwroty `ice cream` i `Good night` to jeden klocek (D29).
- `translationPl` pasuje do kontekstu zdania, nie do słownika. Gdy słowo kluczowe jest odmienione, forma słownikowa idzie do `lemmaEn`, `lemmaPl`, `lemmaPhoneticsPl` (D27).
- Liczba i kolory w `visualConfig.props` zgadzają się ze zdaniem: 3 lody w tekście to 3 lody na scenie.
- Dorosły czyta każdą nową bajkę przed pokazaniem jej dziecku. Strażnik sprawdza reguły, nie sens.

## Zasady interfejsu

- Strona bajki mieści się na ekranie 360×640 bez przewijania i bez ucinania przycisków (D20). Układ opieraj na `dvh`, nie `vh`.
- Dolna nawigacja znika w czytniku.
- Cele dotykowe mają co najmniej 48 px, bo obsługują je palce dziecka.
- Reguł `user-select` i `overscroll-behavior` z `src/index.css` nie przenoś niżej niż `html`/`body`. Pola `input` i `textarea` muszą pozostać zaznaczalne (D21).
- Zasoby z `public/` adresuj przez `import.meta.env.BASE_URL`, nie przez sztywne `/` (D8).

## Pułapki platformy

- `speechSynthesis` nie istnieje w Android WebView. APK powstaje wyłącznie jako TWA (D6).
- `getVoices()` bywa puste do zdarzenia `voiceschanged`.
- `speak()` tuż po `cancel()` potrafi w Chrome zgubić wypowiedź. Daj krótką przerwę.
- Trzymaj referencję do `SpeechSynthesisUtterance`, inaczej `onend` może nie przyjść.
- `cancel()` wywołuje `onend`/`onerror`, więc pętla Żółwika potrzebuje tokenu przebiegu, żeby nie grać dalej po przerwaniu.
- `AudioContext` wznawiaj (`resume()`) w obsłudze dotknięcia.
- `npm run dev:phone` działa po HTTP, a tam nie ma Service Workera ani `navigator.clipboard`. Offline i kopiowanie testuj na `localhost` albo po HTTPS.
- Git Bash przerabia ścieżki w zmiennych: `MSYS_NO_PATHCONV=1 VITE_BASE=/Martynglish/ npm run build`.

## Praca wieloagentowa

Role z SPEC §1 są w [.claude/agents/](.claude/agents/). Kolejność prac różni się od SPEC (D18): Strażnik powstaje przed bajkami.

| Agent | Rola | Fazy |
| :--- | :--- | :--- |
| `curriculum-architect` | kontrakt danych i bajki | 1, 2 |
| `guardian-qa` | Strażnik i audyt końcowy | 1, 6 |
| `stage-artist` | `InteractiveStoryStage` | 3 |
| `mobile-audio-engineer` | interfejs, audio, Skarby | 3, 4 |
| `uncle-zone-engineer` | Strefa Wujka, kreator, SKILL | 5 |

Hook w [.claude/settings.json](.claude/settings.json) uruchamia Strażnika po każdej zmianie `src/data/stories.json` i odsyła raport błędów.

## Definicja ukończenia

Faza jest skończona, gdy `npm run lint`, `npm test` i `npm run build` przechodzą, a zmiana UI została obejrzana w przeglądarce w rozmiarze 360×640. Kryterium końcowe projektu to SPEC §8 oraz lista w Fazie 6 w [docs/PLAN.md](docs/PLAN.md).
