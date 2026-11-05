# Plan prac

Kolejność różni się od SPEC §1 (D18). Odhaczaj pozycje po ich skończeniu i weryfikacji.

## Jak wznowić pracę

Praca jest prowadzona autonomicznie na zlecenie wujka: Opus zarządza i odbiera fazy, Sonnet implementuje (`.claude/agents/`). Commity lokalne po każdej odebranej fazie, bez `push`, na gałęzi `build/app`.

Po przerwie: sprawdź `git log`, `git status` i poniższe listy, a potem kontynuuj od pierwszej nieodhaczonej pozycji. Niezacommitowane zmiany to praca przerwanego agenta: przejrzyj je, zanim zdecydujesz, czy je dokończyć.

Kryterium końca: wszystkie widoki ze SPEC działają lokalnie, testy i build są zielone, offline działa w Chrome. Hosting i APK są poza zakresem (P2).

## Faza 0: Szkielet projektu

- [x] Konfiguracja Vite, TypeScript, Tailwind, PWA, oxlint, Vitest
- [x] `CLAUDE.md`, `docs/`, agenci, hook Strażnika
- [x] Weryfikacja: build, instalowalność, ładowanie offline w Chrome

## Faza 1: Kontrakt i Strażnik

Agenci: `curriculum-architect`, potem `guardian-qa`.

- [x] `src/types/story.ts` według SPEC §5 i D27
- [x] `src/data/propCatalog.mjs` (D12)
- [x] `src/utils/storyGuardianCore.mjs`, `src/utils/storyGuardian.ts`, `scripts/story-guardian.mjs` (D15)
- [x] Testy każdej reguły, w tym przykłady z D17 w obie strony
- [x] Skrypty `guardian` i `prebuild` w `package.json`

## Faza 2: Bajki

Agent: `curriculum-architect`.

- [x] `purple-cat`, napisana w Fazie 1 jako pierwszy test Strażnika na prawdziwej treści
- [x] `happy-dog`, `magic-pony`, `dino-ice-cream` (SPEC §6 i uwagi z końca DECISIONS)
- [x] `npm run guardian` przechodzi: 4 bajki, 20 stron

## Faza 3: Czytnik i scena

Agenci mogą pracować równolegle: `stage-artist`, `mobile-audio-engineer`.

- [x] `InteractiveStoryStage`: 6 teł, 6 postaci, wszystkie props z katalogu
- [x] `useSpeech` i `soundEffects`
- [x] Biblioteka, czytnik, Klocki Słów, Mądra Sówka, zasłona, karaoke
- [x] Najdłuższa strona na 360×640 bez przewijania (D20)

## Faza 4: Skarby

Agent: `mobile-audio-engineer`.

- [x] Zapis słów, `clickCount`, powrót do „Uczę się”
- [x] Cold-start i quiz z 3 odpowiedziami
- [x] Kierunek fiszek: odpowiedź po polsku albo po angielsku (D31)

## Faza 5: Strefa Wujka

Agent: `uncle-zone-engineer`.

- [x] Bramka mnożenia i statystyki
- [x] Kreator: generator promptu, import JSON, Strażnik w aplikacji (Sposób 2 pominięty, D30)
- [x] `.agent/skills/martynka-story-generator/SKILL.md` i wskaźnik w `.claude/skills/` (D25)

## Faza 6: Audyt

Agent: `guardian-qa`.

- [x] SPEC §8: `npm run guardian`, `npm run build`, kompletny SKILL
- [x] `npm run lint` i `npm test`
- [x] Wszystkie widoki na 360×640, ładowanie offline
- [ ] Na prawdziwym Androidzie: lista w README.md, do wykonania przez wujka
- [ ] Odłożone do decyzji o hostingu (P2): wdrożenie na HTTPS i opcjonalne APK jako TWA (D6)

## Faza 7: Rozszerzenia do nauki

Praca autonomiczna zlecona przez wujka 2026-11-05: „wzbogacić aplikację o funkcje, które pomogą Martynce w nauce angielskiego”. Kolejność to priorytet, każdy punkt to osobny commit, a przerwanie po dowolnym punkcie zostawia działającą aplikację.

Dziecko nie czyta jeszcze po angielsku, więc pierwszeństwo mają: powroty do słów, osłuchanie i obrazki zamiast tekstu.

- [x] Powtórki: słowa wracają w odstępach (pudełka Leitnera) i dzienna porcja fiszek
- [x] Zabawy: obrazki słów i nowa zakładka 🎮
- [x] Zabawa „Posłuchaj i znajdź”: słowo ze słuchu, odpowiedź obrazkiem
- [x] Zabawa „Ułóż zdanie”: klocki w dobrej kolejności
- [x] Zabawa „Pary”: memory ze słowem i obrazkiem
- [x] Po bajce: zabawa ze słówkami z tej bajki
- [x] Dzienna misja i album naklejek, w którym naklejka uczy słowa
- [ ] Nowe bajki z rysunków, które już istnieją (`panda`, `bunny`, `beach`)
- [ ] Audyt całości na 360×640 i aktualizacja strony testowej
