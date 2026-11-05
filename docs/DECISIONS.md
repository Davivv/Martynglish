# Decyzje projektowe

Rozstrzygnięcia sprzeczności i luk w [SPEC.md](SPEC.md). Przy konflikcie ten plik wygrywa ze specyfikacją. Nowe decyzje dopisuj na końcu właściwej sekcji, z kolejnym numerem.

Oznaczenie **Sprawdzone** znaczy, że decyzja opiera się na teście lub danych z 2026-11-05, a nie na założeniu.

## Otwarte pytania do wujka

**P2. Hosting. Odłożone decyzją wujka z 2026-11-05: na razie tylko lokalnie.** Konfiguracja zostaje bez zmian. Skutek: po `npm run dev:phone` (HTTP w sieci LAN) telefon pokaże aplikację, ale bez Service Workera, instalacji i schowka. Żeby sprawdzić pełne PWA na telefonie bez hostingu, podłącz go przez USB z debugowaniem, uruchom `npm run build`, `npm run preview` i `adb reverse tcp:4173 tcp:4173`, a potem otwórz na telefonie `http://localhost:4173`: `localhost` liczy się jako bezpieczny kontekst. Przy powrocie do tematu: Cloudflare Pages albo Netlify w korzeniu domeny, bez zmian w konfiguracji. GitHub Pages z prywatnego repo wymaga płatnego planu. Adres będzie publiczny, a w treści jest imię dziecka: `noindex` (D7) ogranicza tylko wyszukiwarki.

## Stos i konfiguracja

**D1. Linter to oxlint, nie ESLint.** Sprawdzone: `typescript-eslint` 8.72 wymaga TypeScript `<6.1`, a aktualny TypeScript to 7.0. Oficjalny szablon `create-vite` też używa oxlint.

**D2. Tailwind 4 konfigurujemy w CSS.** Motyw jest w `@theme` w `src/index.css`. Nie ma `tailwind.config.js`.

**D3. Czcionka to Lexend, hostowana lokalnie.** SPEC §2 dopuszcza Comic Neue albo Lexend. Sprawdzone: Comic Neue nie ma `ą ć ę ł ń ś ź ż` ani podzbioru `latin-ext`, więc polska fonetyka mieszałaby kroje. Lexend ma pełny zestaw i rozróżnialne `I`, `l`, `1`. Plan B z pojedynczym, „szkolnym” `a` to Comic Relief (też ma polskie znaki, ale jest spoza listy SPEC). Zamiast Google Fonts używamy `@fontsource-variable/lexend`, bo czcionka z CDN znika offline.

**D4. Offline zapewnia Service Worker.** SPEC obiecuje offline, ale wymienia tylko manifest i `localStorage`, a to nie wystarcza do załadowania strony bez sieci. `vite-plugin-pwa` generuje Service Workera (`manifest: false`, żeby zachować `public/manifest.json` z SPEC). Sprawdzone: po wyłączeniu serwera aplikacja ładuje się w Chrome razem z Lexend.

**D5. Ikony PWA.** SPEC ich nie wymienia, a są potrzebne do instalacji. `public/icons/icon.svg` i PNG 192/512 to wersja robocza do podmiany. Tło sięga krawędzi, a treść mieści się w strefie bezpiecznej ikony maskowalnej. Sprawdzone: Chrome nie zgłasza błędów instalowalności ani manifestu.

**D6. APK powstaje wyłącznie jako TWA (Bubblewrap lub PWABuilder).** Sprawdzone w danych MDN: `speechSynthesis` nie działa w Android WebView, więc opakowanie WebView (w tym domyślny Capacitor) zabrałoby aplikacji cały dźwięk mowy. TWA uruchamia prawdziwego Chrome i wymaga hostingu po HTTPS (P2).

**D7. `noindex`.** Prywatna aplikacja dla dziecka nie ma powodu trafiać do wyszukiwarek.

**D8. Ścieżka bazowa przez `VITE_BASE`.** Domyślnie `/`. Hosting w podkatalogu ustawia `VITE_BASE`. Sprawdzone: manifest, ikona, skrypty i Service Worker dostają poprawny prefiks. W kodzie zasoby z `public/` adresuj przez `import.meta.env.BASE_URL`.

## Dane i kontrakt

**D9. Długość zdania ma dwa progi.** SPEC podaje 4–8 słów (§1, §7B) i 3–9 słów (§7A). 4–8 to norma autorska, a 3–9 to twardy limit Strażnika. Poza normą, ale w limicie, Strażnik wypisuje ostrzeżenie. Słowa liczymy w `sentenceEn` (`trim().split(/\s+/)`), więc `ice cream` to 2 słowa w 1 klocku.

**D10. `imagePrompt` zawiera `characterVisualAnchor` dosłownie.** SPEC §5 mówi „zawierający”, a §7A „nawiązuje”. Strażnik sprawdza `includes`.

**D11. `imageUrl` jest ścieżką lokalną od korzenia serwera.** Format: `/images/stories/<story-id>/<plik>`, bez `/public`, bo Vite serwuje ten katalog z korzenia. Strażnik mapuje ją na `public/...`. Zewnętrzne URL-e są odrzucane: wklejony JSON nie może wprowadzić na ekran dziecka niezweryfikowanego obrazu, a taki obraz i tak nie działałby offline.

**D12. Katalog props.** `props: string[]` w SPEC jest otwarte, a scena musi umieć narysować każdą wartość. Dozwolone wartości są w `src/data/propCatalog.mjs`, wspólnym dla Strażnika, sceny i promptu z kreatora. Format `<obiekt>-<kolor>` (`flower-pink`) albo `<obiekt>-<numer>` (`icecream-1`), więc przykłady z SPEC pozostają ważne. Jeden wpis to jedna sztuka na scenie, a powtórzenia są dozwolone: dwa banany to `banana-yellow` dwa razy. Strażnik odrzuca nieznane props. Prompt z kreatora i SKILL podają pełną listę props oraz wartości `backgroundTheme` i `primaryCharacter`.

**D13. Fonetyka zdania jest sumą klocków.** Dodatkowa reguła Strażnika: `page.phoneticsPl` równa się `words.map(w => w.phoneticsPl).join(' ')`, z dokładnością do interpunkcji.

**D14. `guardianVerified`.** Strażnik CLI wymaga `true` przy każdej bajce w `stories.json`. Kreator w aplikacji ustawia tę wartość sam, dopiero po pozytywnej walidacji. Pole nigdy nie zastępuje uruchomienia Strażnika.

**D27. Forma słownikowa w Fiszkach.** Zatwierdzone przez wujka 2026-11-05. `translationPl` jest kontekstowe, więc bez tego quiz uznałby „dużą” za jedyną poprawną odpowiedź na `big`, a `star` i `stars` byłyby osobnymi kartami. `WordToken` ma trzy opcjonalne pola: `lemmaEn`, `lemmaPl` i `lemmaPhoneticsPl`. Fiszka używa klucza `lemmaEn ?? word` (małymi literami), odpowiedzi `lemmaPl ?? translationPl` i wymowy `lemmaPhoneticsPl ?? phoneticsPl`. Sówka dalej pokazuje `translationPl`. Trzecie pole wynika z dwóch pierwszych: karta `star` nie może pokazywać wymowy `stars`, więc Strażnik wymaga go, gdy `lemmaEn` różni się od `word`. Strażnik sprawdza też, że jeden klucz ma w całym zbiorze jedną odpowiedź i jedną wymowę. Definicja jest w `flashcardOf` w rdzeniu Strażnika i moduł Skarby ma jej używać.

**D28. Konwencja fonetyki.** Przykłady z SPEC to wzorzec, a reszta ma być z nimi spójna:

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

Końcowe `-l` po spółgłosce tworzy własną sylabę (`li-tl`). Zwroty zachowują spację (`aj-s krim`, `gud najt`).

**D29. Zwroty jako jeden klocek.** Klocek obejmuje zwrot, gdy jego słowa osobno dałyby złe tłumaczenie: `ice cream` (lody), `Good night` (dobranoc).

## Strażnik

**D15. Jedna logika, dwa wejścia.** SPEC każe mieć tę samą walidację w `.mjs` i `.ts`, co przy dwóch kopiach skończy się rozjazdem. Logika jest w `src/utils/storyGuardianCore.mjs`: czysty JS z typami w JSDoc, bez `fs` i DOM. `scripts/story-guardian.mjs` (CLI) i `src/utils/storyGuardian.ts` (aplikacja) tylko ją wywołują. Sprawdzanie plików obrazów wchodzi jako wstrzykiwana funkcja.

**D16. Komunikat końcowy.** SPEC §7B i §8 podają różne teksty. Obowiązuje wersja z §8: `✅ ALL STORIES & VISUALS PASSED GUARDIAN CHECK`. SKILL używa tej samej.

**D17. Czarna lista działa na całych słowach, po obu językach.** Sprawdzone: regex z SPEC §7A dopasowuje fragmenty słów i blokuje `crystal`, `candies`, `teddies`, `birdie`, `skill`, `whatever`, `begun`, a jednocześnie przepuszcza `potwór`, `krew`, `nóż`, `zabić`. Reguła dopasowuje całe słowa z odmianami (`die`, `dies`, `died`, `dying`), z granicami świadomymi polskich liter (`\p{L}` z flagą `u`, bo `\b` ich nie rozumie). Dochodzi polska lista: potwór, krew, trup, zabić, straszny, duch, ciemność, płacz, nienawiść, broń, walka, nóż, umrzeć, z odmianami. Testy muszą obejmować powyższe przykłady w obie strony.

**D18. Strażnik powstaje przed bajkami.** W SPEC §1 Agent 5 działa na końcu, więc dane Agenta 1 przez całą budowę nie miałyby kontroli. Kolejność jest w [PLAN.md](PLAN.md).

## Audio

**D19. Wybór głosu.** Założenie, jeszcze nie sprawdzone na telefonie: nazwy z SPEC §4 (Google UK English Female, Samantha, Daniel, Microsoft Aria) to głosy desktopowe i Apple, a na Androidzie lista pochodzi z systemowego silnika mowy, więc mogą nie wystąpić. Kolejność: nazwy z SPEC, potem `en-GB`, `en-US`, dowolne `en*`. Ustawiaj `utterance.voice` i `utterance.lang`. Gdy nie ma głosu angielskiego, nie czytaj wcale (SPEC §4 zakazuje polskiego syntezatora) i pokaż podpowiedź dla dorosłego. Czytanie offline wymaga głosu zainstalowanego w telefonie. Do sprawdzenia na prawdziwym urządzeniu w Fazie 6.

## Interfejs

**D20. Układ czytnika jest elastyczny.** Szacunek przed budową UI: przy 8 słowach na 360×640 stała scena `h-44` daje około 680 px treści (pasek 36, scena 176, Sówka 52, klocki 270, zasłona 52, nawigacja 56, odstępy 40). Dlatego całość ma `h-dvh`, klocki i nawigacja mają pierwszeństwo, a scena się kurczy (`flex-1 min-h-28 max-h-56`). Test: najdłuższa strona bajki bez przewijania i bez ucinania przycisków.

**D21. `user-select` i `overscroll-behavior`.** `overscroll-behavior-y` jest na `html` i `body`, bo gest odświeżania dotyczy korzenia dokumentu. `input` i `textarea` są wyłączone z `user-select: none`, inaczej wklejanie JSON-a w Strefie Wujka byłoby utrudnione. Sprawdzone w Chrome: style obowiązują w emulacji telefonu. Sam gest odświeżania trzeba jeszcze sprawdzić na urządzeniu w Fazie 6.

## Strefa Wujka

**D22. Bajki z telefonu.** Nie mają `imageUrl`, tylko `visualConfig`: przeglądarka nie widzi dysku, a zewnętrzne URL-e są zakazane (D11). Walidator w aplikacji odrzuca to pole. Bajki te żyją wyłącznie w `localStorage` tego telefonu. Identyfikator nie może kolidować z bajką wbudowaną.

**D23. Klucz API, jeśli Sposób 2 kiedyś wróci (D30).** Klucz jest trzymany osobno od postępów, ma przycisk usunięcia i nigdy nie trafia do repo ani do eksportu. Bramka z mnożeniem chroni przed dzieckiem, nie przed kimś z dostępem do telefonu, więc używamy klucza z limitem wydatków. Nazwa modelu jest edytowalnym polem, bo identyfikatory się starzeją.

**D24. `localStorage`.** Klucze `martynka:v1:*`, dostęp tylko przez jeden moduł z obsługą błędów. Pusty lub uszkodzony stan nie może wysypać aplikacji. Poza zakresem SPEC: eksport i import kopii zapasowej. Wyczyszczenie danych przeglądarki kasuje postępy i bajki dodane z telefonu, więc warto wrócić do tego po Fazie 5.

**D30. Sposób 2 kreatora pominięty w pierwszej wersji.** Decyzję przekazał wujek 2026-11-05. Kreator działa przez „kopiuj prompt, wklej JSON”, co daje ten sam efekt bez klucza API na urządzeniu dziecka.

## Narzędzia agentowe

**D25. Skill w dwóch miejscach.** `.agent/skills/` to format Antigravity, a Claude Code czyta `.claude/skills/`. Pełna treść jest w `.agent/skills/martynka-story-generator/SKILL.md` (wymóg SPEC §8). `.claude/skills/martynka-story-generator/SKILL.md` to krótki wskaźnik z frontmatterem, który każe przeczytać i wykonać plik z `.agent`. Bez kopiowania treści i bez symlinków, zawodnych na Windows.

**D26. Ilustracje.** Claude Code nie ma narzędzia do generowania obrazów, więc `InteractiveStoryStage` jest ilustracją główną, a `imageUrl` zostaje puste. `imagePrompt` i tak wypełniamy, żeby obrazy dało się dorobić później innym narzędziem.

## Uwagi do bajek startowych

- `dino-ice-cream`, strona 2: „Dino sees one red apple and two yellow bananas.” ma 9 słów, czyli dostanie ostrzeżenie (D9). Krótsza wersja: „One red apple, two yellow bananas.”
- Liczba mnoga `ice creams` też jest jednym klockiem (`aj-s krims`), z `lemmaEn: "ice cream"`, `lemmaPl: "lody"` i `lemmaPhoneticsPl: "aj-s krim"`.
- Fonetyka z SPEC ma wymawiane `r` (`per-pl`), a priorytet głosów jest brytyjski. Dziecko może usłyszeć co innego, niż czyta. Zostawiamy jak w SPEC i oceniamy na słuch w Fazie 6.
