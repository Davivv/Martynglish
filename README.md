# Bajki Martynki

Aplikacja do nauki angielskiego przez czytanie bajek, dla 7-letniej Martynki. Działa w przeglądarce, offline i bez logowania. Postępy zapisuje na urządzeniu.

## Co jest w aplikacji

- **Bajki:** 13 bajek z lektorem, karaoke i tłumaczeniem słów, w tym dwa seriale po 3 odcinki: Neon Stars i Klub Przyjaciółek. Po bajce można ułożyć jej zdania.
- **Skarby:** fiszki ze słów z bajek. Słowa wracają w odstępach, a dzienna porcja to 8 kart. Odpowiadać można po polsku albo po angielsku.
- **Zabawy:** „Posłuchaj i znajdź”, „Ułóż zdanie” i „Pary”.
- **Dzienna misja:** bajka, fiszki i zabawa. Nagrodą jest naklejka, która po dotknięciu mówi swoją angielską nazwę.
- **Strefa Wujka:** statystyki, kreator bajek i bajki dodane z telefonu.

## Uruchomienie

Potrzebny jest Node.js w wersji 22.12 lub nowszej.

```bash
npm install
npm run dev
```

Aplikacja otworzy się pod adresem pokazanym w terminalu.

## Na telefonie

**Po publikacji** (jeszcze jej nie ma, patrz D41): otwórz w Chrome `https://davivv.github.io/Martynglish/` i wybierz „Dodaj do ekranu głównego”. Potem działa też bez internetu, a nowe wersje pobiera sama. Postępy zostają tylko na tym telefonie.

Do tego czasu zostają dwa sposoby testowe.

**Szybki podgląd**, ten sam Wi-Fi co komputer:

```bash
npm run dev:phone
```

Na telefonie otwórz adres `Network` z terminala. Bajki, mowa i Skarby powinny działać, ale bez instalacji na ekranie głównym, trybu offline i kopiowania promptu do schowka, bo te funkcje wymagają HTTPS.

**Pełna aplikacja**, telefon przez USB z włączonym debugowaniem:

```bash
npm run build
npm run preview
adb reverse tcp:4173 tcp:4173
```

Na telefonie otwórz `http://localhost:4173`. Taki adres przeglądarka traktuje jak bezpieczny, więc działa instalacja i tryb offline.

## Do sprawdzenia na prawdziwym telefonie

Tych rzeczy nie da się sprawdzić na komputerze:

- [ ] Czy aplikacja instaluje się na ekranie głównym i otwiera bez paska przeglądarki.
- [ ] Czy lektor mówi po angielsku. Jeśli pojawi się komunikat o braku głosu, doinstaluj angielski w ustawieniach mowy Androida.
- [ ] Czy lektor działa w trybie samolotowym.
- [ ] Czy karaoke podświetla klocki równo z głosem, a Żółwik czyta słowo po słowie.
- [ ] Czy zapis wymowy pasuje do głosu, np. `per-pl`, `kat`, `ha-pi`, `pou-ni`, `bicz`, `o-rindż`, `be-lun`.
- [ ] Czy lektor dobrze czyta imiona i nazwy z seriali: `Yuna`, `Hana`, `Sora`, `Coco`, `Neon Stars`.
- [ ] Czy animacje w scenach Neon Stars są płynne, a `dark-city` da się odczytać przy słabej jasności ekranu.
- [ ] Czy słowo `a` brzmi dobrze po dotknięciu klocka.
- [ ] Czy w „Posłuchaj i znajdź” słowo słychać od razu po wejściu, bez dodatkowego dotknięcia.
- [ ] Czy w „Parach” słowo słychać przy każdym odkryciu karty, a karty obracają się płynnie.
- [ ] Czy nowa naklejka mówi swoją nazwę od razu po odebraniu.
- [ ] Czy efekty dźwiękowe mają dobrą głośność.
- [ ] Czy pociągnięcie w dół nie odświeża strony.

## Nowe bajki

**Z telefonu:** Strefa Wujka, zakładka Kreator. Wpisz temat, skopiuj prompt do dowolnego czatu z AI i wklej odpowiedź. Strażnik sprawdzi bajkę, a Ty przeczytasz ją przed zapisem. Taka bajka zostaje tylko na tym urządzeniu i znika po wyczyszczeniu danych przeglądarki.

**Z komputera:** napisz w Claude Code lub Antigravity „wygeneruj bajkę dla Martynki o…”. Bajka trafi do `src/data/stories.json`, czyli do wszystkich urządzeń po kolejnym buildzie.

Każdą nową bajkę przeczytaj, zanim pokażesz ją dziecku. Strażnik sprawdza reguły, nie sens.

## Dla programistów

Komendy, zasady i pułapki są w [CLAUDE.md](CLAUDE.md). Specyfikacja jest w [docs/SPEC.md](docs/SPEC.md), a decyzje, które ją zmieniają, w [docs/DECISIONS.md](docs/DECISIONS.md).
