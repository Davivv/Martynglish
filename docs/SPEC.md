# PROJEKT: „Bajki Martynki” – Specyfikacja, Kontekst i Prompt Wieloagentowy (Gold Master v6.0)

## CZĘŚĆ I: Podsumowanie Koncepcji Aplikacji (Executive Summary)

| Obszar | Rozwiązanie w projekcie | Uzasadnienie edukacyjne i techniczne (dla 7-latki) |
| :--- | :--- | :--- |
| **Użytkowniczka docelowa** | **7-letnia Martynka** (1. klasa szkoły podstawowej). Dopiero ćwiczy płynność czytania po polsku (sylabizuje) i zaczyna naukę angielskiego (**poziom Pre-A1 / wczesne A1**). | Brak ekranu logowania. Aplikacja wita ją od razu po imieniu (*„Cześć Martynka!”*), eliminując bariery wejścia. |
| **Platforma i Ergonomia** | **Mobile-First PWA (Android-ready / APK-ready)** z obsługą offline (`localStorage`). Układ pionowy bez przewijania podczas czytania (dolny pasek nawigacji chowa się w czytniku). | Cała strona bajki mieści się na jednym ekranie telefonu/tabletu. Zablokowane przypadkowe odświeżanie (`overscroll-behavior-y: contain`) i zaznaczanie tekstu (`user-select: none`). |
| **Format Czytnika** | **„Karty z książeczki” (5–6 stron na bajkę)**. 1 ekran = 1 interaktywna ilustracja + 1 krótkie zdanie (4–8 słów). | Krótkie porcje tekstu nie męczą dziecka uczącego się czytać. Przewracanie kart daje poczucie szybkiego sukcesu. |
| **Układ tekstu i wymowy** | **„Klocki Słów” (Interlinear Word Blocks)**. Każde słowo (lub zwrot typu *ice cream*) to osobny, duży kafelek mający na górze wyraz angielski, a **bezpośrednio pod nim polską wymowę podzieloną dywizami na sylaby** (np. `purple` / `per-pl`). | Wzrok pierwszoklasistki nie gubi się między osobnymi linijkami tekstu a wymową. Sylaby zapisane polskimi znakami (zakaz IPA!) pozwalają czytać angielski tak samo jak polski elementarz. |
| **Tłumaczenie kontekstowe** | **1. Stały pasek Mądrej Sówki 🦉** pod ilustracją (wyświetla tłumaczenie klikniętego słowa w kontekście zdania).<br>**2. Zamglona zasłona (`blur`)** na dole karty (pełne polskie zdanie odkrywane przyciskiem 👁️). | Stały pasek Sówki zapobiega ucinaniu dymków (tooltipów) na krawędziach ekranu telefonu. Zamglenie polskiego zdania zachęca do próby samodzielnego zrozumienia tekstu. |
| **Audio, Karaoke i Dźwięki** | Darmowe `Web Speech API` (wymuszony głos angielski) z przyciskami **🔊 Posłuchaj** oraz **🐢 Żółwik** (słowo po słowie). Żółte podświetlanie Karaoke + efekty dźwiękowe z `Web Audio API` (fanfary, dzwoneczki, kliknięcia). | Hybrydowy timer Karaoke gwarantuje działanie podświetlania na Android Chrome (gdzie natywne `onboundary` często nie działa). Efekty dźwiękowe nadają aplikacji charakter gry. |
| **Ilustracje i Scenografia** | **Spójne, interaktywne ilustracje** (`imageUrl` + wielowarstwowy komponent `InteractiveStoryStage`) oparte o stały opis wyglądu bohatera (`characterVisualAnchor`). | Bohater wygląda tak samo na każdej stronie, a dotknięcie go palcem wywołuje podskok, dymek i okrzyk po angielsku. |
| **Słownik i Fiszki („💎 Skarby”)** | Automatyczny zapis klikniętych słów kluczowych (`isKeyword: true` – bez zaśmiecania fiszek słowami typu *a, the, is*). **Quiz z 3 odpowiedziami do wyboru** zamiast zwykłego przycisku „Umiem”. | Chroni przed bezmyślnym klikaniem „Już umiem” dla samego konfetti – Martynka musi rozpoznać polskie znaczenie słowa. |
| **Strefa Wujka i Strażnik** | Chroniona tabliczką mnożenia (`6 × 4 = ?`). Zawiera **statystyki najtrudniejszych słów**, **mobilny kreator bajek** (działający z telefonu) oraz **Strażnika Bajek** + **Skill dla Antigravity**. | Pozwala kontrolować postępy siostrzenicy i dodawać nowe, w 100% zweryfikowane bajki zarówno na czacie w Antigravity, jak i bezpośrednio z telefonu. |

---

## CZĘŚĆ II: Pełny Prompt Wieloagentowy (Do wykonania przez AI)

## 1. INSTRUKCJA ORKIESTRACJI WIELOAGENTOWEJ (MULTI-AGENT WORKFLOW)
Zrealizuj ten projekt w architekturze wieloagentowej. Jeśli Twoje środowisko wspiera uruchamianie pod-agentów (sub-agents / parallel tasks), powołaj osobnych agentów dla poniższych ról. Jeśli wykonujesz zadania sekwencyjnie, przechodź rygorystycznie przez kolejne role, gdzie każdy kolejny agent weryfikuje i odbiera pracę poprzedniego:

1. 🧠 **AGENT 1: Metodyk Pre-A1 i Architekt Danych (`Curriculum & Data Architect`)**
   - Tworzy interfejsy TypeScript (`src/types/story.ts`) oraz bazę 4 kompletnych, 5-stronicowych bajek w czystym pliku `src/data/stories.json` (aby plik był bezpośrednio czytelny zarówno dla aplikacji React, jak i skryptu Strażnika w czystym Node.js).
   - Pilnuje poziomu 1. klasy SP (Pre-A1/A1, 4–8 słów na stronę, powtarzanie 3–4 słów kluczowych na różnych stronach), czysto polskiej fonetyki sylabicznej (z dywizami, np. `per-pl`, `li-tl`, `ha-pi`, `aj-s krim`) oraz spójności klocków `words`.
2. 🎨 **AGENT 2: Artysta Ilustracji i Scenografii (`Illustration & Stage Agent`)**
   - Jeśli w środowisku dostępne jest narzędzie generowania obrazów AI (Image Generation Tool), generuje spójne ilustracje dziecięce do `/public/images/stories/<story-id>/`.
   - Równolegle buduje bogaty komponent **InteractiveStoryStage**, który renderuje piękną, wielowarstwową, animowaną scenografię (tło nieba, płynące chmurki, krajobraz `meadow/park/castle/icecream/beach/night-sky`, duże, szczegółowe ilustracje wektorowe postaci i przedmiotów zgodnych z liczbą i kolorem w zdaniu!). Zakaz rysowania prymitywnych geometrycznych kółek!
3. 📱 **AGENT 3: Inżynier Mobile UI/UX & Audio (`Mobile Frontend & Audio Engineer`)**
   - Buduje interfejs Mobile-First (React + TypeScript + Vite + Tailwind CSS + Lucide Icons + `canvas-confetti`), manifest PWA (`public/manifest.json`), układ „Klocków Słów”, zintegrowany pasek Mądrej Sówki, Quiz Fiszkowy, syntezator efektów dźwiękowych (`Web Audio API` – dźwięki sukcesu/fanfary/kliknięć) oraz hybrydowy silnik mowy i Karaoke (`useSpeech`).
4. 🛠️ **AGENT 4: Architekt Narzędzi i Skilli (`Skill & Uncle Zone Engineer`)**
   - Tworzy zabezpieczoną „Strefę Wujka” (statystyki kliknięć słów + mobilny kreator nowych bajek działający bezpośrednio z telefonu) ORAZ plik `.agent/skills/martynka-story-generator/SKILL.md`.
5. 🛡️ **AGENT 5: Strażnik Bajek i QA (`Guardian & QA Auditor Agent`)**
   - Tworzy skrypt `scripts/story-guardian.mjs` (czytający bezpośrednio `src/data/stories.json`), podpina go w `package.json` pod `"guardian": "node scripts/story-guardian.mjs"` oraz `"prebuild": "npm run guardian"`.
   - Przeprowadza pełny audyt: sprawdza spójność danych, brak błędów fonetycznych, responsywność na ekranie telefonu i wykonuje `npm run build`.

---

## 2. PROFIL UŻYTKOWNICZKI I ERGONOMIA MOBILNA (ANDROID-FIRST)
- **Użytkowniczka:** 7-letnia Martynka (1. klasa SP, czyta powoli po polsku sylabami, poziom angielskiego Pre-A1/A1: kolory, zwierzęta, liczby 1–5, proste czasowniki i przymiotniki, konstrukcje *to be*, *have got*, *can*, *I see*, *I like*).
- **Brak ekranu logowania:** Aplikacja wita ją po imieniu: *„Cześć Martynka! Jaką bajkę dzisiaj czytamy?”*.
- **Ergonomia ekranu telefonu (Ochrona przed ucinaniem ekranu!):**
  - Zaimportuj z Google Fonts czcionkę elementarzową **Comic Neue** lub **Lexend** (gdzie małe `a`, małe `l` oraz wielkie `I` są jednoznacznie rozróżnialne).
  - Ciepłe, pastelowe tło przypominające papier książki (`#FFFDF7`), zaokrąglone karty (`rounded-3xl`), miękkie cienie.
  - Wyłącz zaznaczanie tekstu (`user-select: none`) i przypadkowe odświeżanie strony gestem w dół (`overscroll-behavior-y: contain`).
  - Pełny `public/manifest.json` (`display: "standalone"`, `orientation: "portrait"`, `theme_color: "#FFFDF7"`) gotowy do instalacji na ekranie głównym Androida lub konwersji do `.apk`.
  - Dolny pasek nawigacji (📚 **Bajki** | 💎 **Skarby** | 🔐 **Strefa Wujka**) jest widoczny na ekranach głównych, ale **automatycznie ukrywa się wewnątrz Czytnika Bajek**, aby cała strona bajki mieściła się wygodnie na jednym ekranie telefonu bez ucinania dolnych przycisków!

---

## 3. SPECYFIKACJA WIDOKÓW I MECHANIK EDUKACYJNYCH

### A. Biblioteka Bajek (Ekran Startowy)
- Powitanie Martynki + licznik zdobytych Gwiazdek (⭐ przeczytane bajki) i Słownych Skarbów (💎 odkryte słowa).
- Duże, kolorowe karty bajek z ilustracją okładkową, tytułem EN i PL oraz odznaką ukończenia (wraz z licznikiem przeczytań).

### B. Czytnik Bajek („Karty z Książeczki” – Kompaktowy układ mobilny)
Każda bajka ma 5–6 stron. Układ pojedynczej strony od góry do dołu:

1. **Górny mikro-pasek:** Przycisk `🏠 Wyjdź`, pasek postępu (gwiazdki/kropeczki `Strona 2 z 5`).
2. **Interaktywna Scena Ilustracyjna (`InteractiveStoryStage`):**
   - Proporcje dopasowane do telefonu (`h-44 sm:h-56`), zaokrąglona ramka. Wyświetla dedykowany plik ilustracji z `/public/images/...` lub bogatą, wielowarstwową, animowaną scenę wektorową dopasowaną dokładnie do obiektów i kolorów w zdaniu (np. jeśli w zdaniu są 3 lody, na scenie widać dinozaura i 3 kolorowe lody!).
   - **Interakcja:** Dotknięcie bohatera na ilustracji wywołuje animację podskoku, efekt dźwiękowy, dymek komiksowy i głos bohatera po angielsku (`interactiveSoundText`, np. *"Meow! I am a purple cat!"*).
3. **Zintegrowany Pasek „Mądrej Sówki 🦉 + Lektor”:**
   - Połączony, kompaktowy pasek pod ilustracją:
     - Po lewej: Mądra Sówka, która domyślnie zachęca do klikania w słowa, a po dotknięciu dowolnego klocka pokazuje tłumaczenie kontekstowe: **`purple [per-pl] = fioletowy 💎`**.
     - Po prawej: Dwa wyraźne przyciski audio dla całego zdania: 🔊 **„Posłuchaj”** (płynnie `0.8x`) oraz 🐢 **„Żółwik”** (bardzo wolno, słowo po słowie z pauzą `400ms`).
4. **Warstwa Główna: „Klocki Słów” (Interlinear Word Blocks):**
   - Zdanie ułożone z dużych, klikalnych kafelków (`flex-wrap gap-2.5 justify-center`).
   - **Wewnątrz każdego klocka znajdują się 2 wiersze (jeden pod drugim):**
     - **Góra klocka:** Duży, pogrubiony wyraz (lub zwrot dwuwyrazowy typu `ice cream`) po angielsku wraz z przypisaną interpunkcją.
     - **Dół klocka:** Mniejszy zapis fonetyczny po polsku podzielony myślnikami na proste sylaby w kolorze indygo/fioletowym (np. `per-pl`, `aj-s krim`).
   - **Efekt Karaoke:** Podczas czytania zdania przez lektora aktualnie wymawiany klocek podświetla się na żółto i lekko powiększa (`bg-yellow-200 scale-105 ring-2 ring-amber-400`).
5. **Warstwa Dolna: Polskie tłumaczenie za „Zamgloną Zasłoną” + Nawigacja:**
   - Kompaktowa ramka z pełnym polskim tłumaczeniem zdania (`sentencePl`), domyślnie zamglona (`blur-md select-none`) i przykryta przyciskiem 👁️ **„Sprawdź całe zdanie po polsku”** (kliknięcie odsłania/zakrywa tekst; zmiana strony zawsze zamyka zasłonę).
   - Pod spodem duże przyciski nawigacji: **„⬅️ Wstecz”** oraz **„Dalej ➡️”** (na ostatniej stronie: **„🎉 Koniec bajki! Odbierz gwiazdkę!”** z fanfarą audio i konfetti).

### C. Mechanika Słownika i Moduł „💎 Skarby” (Quiz Fiszkowy)
- Dotknięcie klocka w bajce odtwarza wymowę słowa, pokazuje tłumaczenie u Sówki i zapisuje słowo w `localStorage` (klucz znormalizowany `word.toLowerCase().trim()`, licznik `clickCount += 1`). Jeśli słowo było wcześniej w „Już umiem!”, po ponownym kliknięciu w bajce wraca do „Uczę się”.
- Do Fiszek automatycznie trafiają słowa z `isKeyword: true` (rzeczowniki, kolory, przymiotniki, główne czasowniki, liczby). Dla słów funkcyjnych (`a`, `the`, `is` -> `isKeyword: false`) u Sówki pojawia się mały przycisk *„+ Dodaj do fiszek”*.
- **Zabezpieczenie Cold-Start:** Gdy słownik jest pusty, wyświetl przyjazny ekran z przyciskiem *„Załaduj 6 pierwszych słówek z bajek do zabawy!”*.
- **Quiz „Zgadnij co to!” (z podziałem na zakładki 🌱 „Uczę się” oraz 🏆 „Już umiem!”):**
  - Fiszka pokazuje scenkę/ilustrację z bajki, duże słowo EN, polską wymowę `[per-pl]`, przycisk 🔊 oraz zdanie przykładowe z bajki.
  - Pod spodem znajdują się **3 duże przyciski z polskimi tłumaczeniami** (1 poprawne + 2 losowe z innych słów lub z wbudowanej puli zapasowej `fallbackDistractors`, gdy w słowniku jest mniej niż 3 słowa).
  - Po kliknięciu błędnej odpowiedzi: przycisk delikatnie drży, słychać delikatny sygnał błędu i lektor ponownie czyta słowo.
  - Po kliknięciu poprawnej odpowiedzi: odtwarzany jest dźwięk sukcesu (`Web Audio API`), karta się obraca, wybucha konfetti, a Martynka wybiera: 🔄 **„Jeszcze poćwiczę”** lub ✅ **„Już umiem na pamięć!”**.

### D. Moduł „🔐 Strefa Wujka” (Statystyki + Mobilny Kreator i Strażnik)
Chroniony bramką matematyczną z tabliczki mnożenia (np. `6 × 4 = ?`):
1. **Tabela Statystyk Trudnych Słów:** Wszystkie kliknięte przez Martynkę słowa posortowane malejąco po `clickCount` (od razu widać, które słowa sprawiają jej największą trudność), z informacją z której bajki pochodzą, statusem (*Uczę się / Już umiem*) oraz opcją ręcznej zmiany statusu lub zresetowania postępów.
2. **Mobilny Kreator Nowych Bajek (zarządzanie z telefonu bez laptopa):**
   - **Sposób 1 (Generator Promptu i Import JSON na telefonie):** Wpisuję temat bajki (np. *„Mała panda liczy gwiazdki”*), klikam *„Kopiuj Prompt dla AI”* (kopiuje do schowka telefonu pełną instrukcję generowania JSON-a zgodnego ze Strażnikiem), a poniżej mam pole tekstowe do wklejenia wygenerowanego JSON-a z nową bajką.
   - **Sposób 2 (Generator AI na żywo – opcjonalny klucz API):** Pole na wpisanie klucza Gemini API / OpenAI API, które jednym kliknięciem generuje nową bajkę bezpośrednio w telefonie.
   - **Wbudowany Strażnik (In-App Guardian):** Zanim wklejona lub wygenerowana bajka zostanie dopisana do `localStorage`, przechodzi pełną walidację Strażnika w aplikacji (wyświetla Zielony Certyfikat ✅ lub listę błędów ❌).

---

## 4. NIEZAWODNE AUDIO (`useSpeech.ts` + Efekty `soundEffects.ts`)
1. **`Web Speech API` (`src/hooks/useSpeech.ts`):**
   - Pobieraj głosy przez `getVoices()` oraz `onvoiceschanged`. Filtruj wyłącznie głosy angielskie (`lang.startsWith('en')`, priorytetyzując *Google UK English Female*, *Samantha*, *Daniel*, *Microsoft Aria*). Nigdy nie dopuść do przeczytania angielskiego tekstu polskim syntezatorem!
   - Zawsze wywołuj `window.speechSynthesis.cancel()` przed nowym odtwarzaniem.
   - Pojedyncze słowa wysyłaj jako `.toLowerCase()` lub z pola `ttsOverride` bez znaków interpunkcyjnych (aby słowo `"A"` nie było czytane jako `"Capital A"`).
   - **Hybrydowe Karaoke (Android Chrome fix):** Zaimplementuj podświetlanie klocków oparte na zdarzeniu `onboundary` ORAZ równoległym inteligentnym timerze zapasowym wyliczanym z długości poszczególnych słów (ponieważ Chrome na Androidzie często nie wysyła `onboundary`). W trybie „Żółwika” odtwarzaj słowa sekwencyjnie jedno po drugim z przerwą `400ms`.
2. **Syntezator Efektów Dźwiękowych (`src/utils/soundEffects.ts` – `Web Audio API`):**
   - Zbuduj bezplikowy generator dźwięków oparty na oscylatorach `AudioContext`: przyjemny `playPop()` przy kliknięciu klocka, radosny trójdźwięk `playSuccess()` przy odgadnięciu fiszki, niski `playError()` przy pomyłce oraz fanfara `playFanfare()` na ukończenie bajki.

---

## 5. KONTRAKT DANYCH (`src/types/story.ts` oraz `src/data/stories.json`)

```typescript
export interface WordToken {
  word: string;           // Słowo lub krótki zwrot (np. "purple" lub "ice cream")
  punctuation?: string;   // Interpunkcja wyświetlana tuż po słowie, np. ".", "!", ","
  translationPl: string;  // Tłumaczenie dopasowane ściśle do kontekstu zdania
  phoneticsPl: string;    // Polska wymowa sylabiczna z myślnikami, np. "per-pl", "aj-s krim"
  isKeyword: boolean;     // true = trafia do Fiszek; false = słowo funkcyjne ("a", "the", "is")
  ttsOverride?: string;   // Opcjonalna korekta dla syntezatora mowy (np. dla słowa "a")
}

export interface SceneVisualConfig {
  backgroundTheme: "meadow" | "park" | "castle" | "icecream" | "beach" | "night-sky";
  primaryCharacter: "cat" | "dog" | "princess-pony" | "dino" | "panda" | "bunny";
  primaryColor: string;         // Kolor bohatera/elementu zgodny z tekstem (np. "#9333EA" dla purple)
  secondaryColor?: string;
  props: string[];              // Obiekty na scenie zgodne z tekstem, np. ["flower-pink", "butterfly-blue"] lub ["icecream-1", "icecream-2", "icecream-3"]
  characterMood: "happy" | "sleepy" | "excited" | "curious";
}

export interface StoryPage {
  pageNumber: number;
  imageUrl?: string;               // Opcjonalna ścieżka do wygenerowanego pliku graficznego w /public/images/stories/...
  visualConfig: SceneVisualConfig; // Obowiązkowa konfiguracja dla komponentu InteractiveStoryStage
  imagePrompt: string;             // Dokładny prompt sceny zawierający characterVisualAnchor
  imageAltPl: string;              // Opis obrazka po polsku
  interactiveSoundText: string;    // Co mówi bohater po dotknięciu ilustracji, np. "Meow! I am a purple cat!"
  sentenceEn: string;              // Pełne zdanie po angielsku (4–8 słów)
  phoneticsPl: string;             // Pełny zapis fonetyczny zdania z sylabami po polsku
  sentencePl: string;              // Pełne tłumaczenie po polsku (za zamgloną zasłoną)
  words: WordToken[];              // Tablica klocków (po złączeniu daje dokładnie sentenceEn!)
}

export interface Story {
  id: string;
  titleEn: string;
  titlePl: string;
  coverImageUrl?: string;
  coverVisualConfig: SceneVisualConfig;
  characterVisualAnchor: string;   // STAŁY opis wyglądu bohatera (min. 30 znaków) gwarantujący spójność
  themeColor: string;
  level: "Pre-A1" | "A1";
  guardianVerified: boolean;
  pages: StoryPage[];
}
```

---

## 6. PAKIET STARTOWY: 4 KOMPLETNE BAJKI W `src/data/stories.json`
Zaimplementuj w `src/data/stories.json` **4 kompletne, 5-stronicowe bajki** (zakaz używania skrótów, komentarzy czy ucinania stron!). Każda bajka musi celowo powtarzać 3–4 kluczowe słówka na różnych stronach, posiadać bogaty `visualConfig` odzwierciedlający dokładnie kolory i liczby w zdaniu oraz bezbłędną polską fonetykę sylabiczną:

1. **`purple-cat` – "The Purple Cat" (Fioletowy Kotek)**
   - **Słownictwo kluczowe:** kolory (*purple, pink, blue, yellow*), rzeczowniki (*cat, flower, butterfly, sun*), przymiotniki (*little, happy, sleepy*).
   - **Kotwica wizualna (`characterVisualAnchor`):** *"Cute little purple kitten named Mia with big green eyes and a small yellow star collar, soft children's book watercolor style"*.
   - **Fabuła (5 stron):** Strona 1: Przedstawienie małego fioletowego kotka. Strona 2: Kotek widzi różowy kwiatek. Strona 3: Kotek widzi niebieskiego motylka. Strona 4: Żółte słońce jest ciepłe, a kotek jest wesoły. Strona 5: Fioletowy kotek jest śpiący i mówi dobranoc.

2. **`happy-dog` – "Bella the Happy Dog" (Bella, Wesoły Piesek)**
   - **Słownictwo kluczowe:** czasowniki ruchu (*run, jump, play, look*), przymiotniki (*big, small, red, green*), rzeczowniki (*dog, park, ball, tree*).
   - **Kotwica wizualna (`characterVisualAnchor`):** *"Friendly small golden puppy named Bella with floppy ears and a red collar in a sunny green park, children's book illustration"*.
   - **Fabuła (5 stron):** Strona 1: Bella to mały, wesoły piesek. Strona 2: Bella jest w zielonym parku. Strona 3: Bella widzi dużą czerwoną piłkę. Strona 4: Piesek biega i skacze wysoko. Strona 5: Bella bawi się pod dużym drzewem.

3. **`magic-pony` – "The Princess and the Magic Pony" (Księżniczka i Magiczny Kucyk)**
   - **Słownictwo kluczowe:** *princess, pony, castle, star, magic, white, fast, fly*, konstrukcje *I see... / It is...*.
   - **Kotwica wizualna (`characterVisualAnchor`):** *"Little smiling princess in a pink dress with a golden crown next to a small white magic pony with a rainbow mane, fairytale illustration"*.
   - **Fabuła (5 stron):** Strona 1: Mała księżniczka mieszka w dużym zamku. Strona 2: Księżniczka ma białego, magicznego kucyka. Strona 3: Magiczny kucyk jest bardzo szybki. Strona 4: Lecą wysoko na nocnym niebie i widzą żółte gwiazdki. Strona 5: Księżniczka kocha swojego magicznego kucyka.

4. **`dino-ice-cream` – "Three Ice Creams for Dino" (Trzy Lody dla Dinozaura)**
   - **Słownictwo kluczowe:** liczby (*one, two, three*), jedzenie (*ice cream, apple, banana, chocolate*), konstrukcja *I like...*.
   - **WAŻNA REGUŁA TOKENIZACJI:** Zwrot `"ice cream"` (oraz `"Ice cream"`) zapisz jako jeden wspólny klocek `WordToken` (`"word": "ice cream"`, `"phoneticsPl": "aj-s krim"`, `"translationPl": "lody"`), aby dziecko po kliknięciu zobaczyło tłumaczenie „lody”, a nie osobno „lód” i „śmietana”!
   - **Kotwica wizualna (`characterVisualAnchor`):** *"Cute little friendly green baby dinosaur wearing a blue bow tie in a pastel ice cream shop, children's book style"*.
   - **Fabuła (5 stron):** Strona 1: Mały zielony dinozaur jest głodny. Strona 2: Dinozaur widzi jedno czerwone jabłko i dwa żółte banany. Strona 3: Ale dinozaur najbardziej lubi zimne lody! Strona 4: Proszę: jeden, dwa, trzy kolorowe lody dla dinozaura. Strona 5: Dinozaur je lody i jest bardzo szczęśliwy.

---

## 7. STRAŻNIK BAJEK I ILUSTRACJI (`scripts/story-guardian.mjs`) + SKILL (`.agent/skills/martynka-story-generator/SKILL.md`)

### A. Skrypt Strażnika (`scripts/story-guardian.mjs`)
Stwórz skrypt w czystym Node.js wczytujący `src/data/stories.json`, uruchamiany komendą `npm run guardian` oraz automatycznie przed budowaniem (`"prebuild": "npm run guardian"`). Dodatkowo wyeksportuj tę samą logikę walidacji w `src/utils/storyGuardian.ts` dla kreatora w „Strefie Wujka”.

**Strażnik musi sprawdzać każdą bajkę i zatrzymywać proces błędem (`process.exit(1)` z dokładnym raportem), jeśli wykryje którekolwiek z poniższych naruszeń:**
1. **Spójność rekonstrukcji zdania (100% Match Check):**
   - Dla każdej strony złącz klocki: `const reconstructed = page.words.map(w => w.word + (w.punctuation || '')).join(' ').trim()`.
   - Jeśli `reconstructed !== page.sentenceEn.trim()`, Strażnik odrzuca bajkę! (Gwarantuje to, że żadne słowo ani znak interpunkcyjny nie zostały pominięte, a jednocześnie pozwala na klocki dwuwyrazowe jak `"ice cream"`).
2. **Czystość Polskiej Fonetyki Sylabicznej (Anti-IPA & Anti-English-Spelling Check):**
   - Zakaz jakichkolwiek znaków IPA w `page.phoneticsPl` oraz `word.phoneticsPl` (regex blokujący: `/[əθðʃʒŋæʌʊɪɔɜːˈˌ]/i`).
   - Zakaz niepolskich liter i surowych angielskich zbitek w polach `phoneticsPl`: zablokuj litery `q`, `v`, `x` oraz angielskie zbitki `th`, `sh`, `ee`, `oo` (wymowa musi być zapisana wyłącznie po polsku, np. `fri`, `de`, `we-ri`, `szop`, `luk`, `per-pl`).
3. **Weryfikacja Ilustracji i Scenografii (`Visual & Consistency Check`):**
   - Sprawdza, czy bajka posiada `characterVisualAnchor` (min. 30 znaków) i czy `imagePrompt` na każdej stronie do niego nawiązuje.
   - Sprawdza, czy każda strona posiada kompletny obiekt `visualConfig` (`backgroundTheme`, `primaryCharacter`, `primaryColor`, niepustą tablicę `props`).
   - Jeśli na stronie podano ścieżkę `imageUrl` do lokalnego pliku w `/public/...`, Strażnik sprawdza przez `fs.existsSync`, czy plik fizycznie istnieje na dysku i ma rozmiar `> 500 B`.
4. **Poziom Pedagogiczny 7-latki (Pre-A1 Limits):**
   - Każda bajka musi mieć od 5 do 6 stron.
   - Każde zdanie (`sentenceEn`) musi mieć od 3 do maksymalnie 9 słów.
   - Każda strona musi mieć min. 1 słowo z flagą `isKeyword: true`.
5. **Bezpieczeństwo Dziecka (Child Safety Blacklist):**
   - Blokuje bajkę, jeśli w jakimkolwiek polu tekstowym wystąpią słowa nieodpowiednie lub straszne dla 7-latki (`/monster|blood|dead|kill|scary|ghost|darkness|cry|hate|gun|fight|knife|die/i`).

### B. Skill dla Antigravity (`.agent/skills/martynka-story-generator/SKILL.md`)
Utwórz kompletny plik `.agent/skills/martynka-story-generator/SKILL.md`, który pozwoli mi w przyszłości generować nowe bajki dla Martynki prostym poleceniem na czacie (np. *„Wygeneruj bajkę dla Martynki o małej pandzie na plaży”*).

**Plik `SKILL.md` musi definiować obowiązkowy 5-krokowy protokół:**
- **Krok 1 (Projekt Fabuły i Kotwicy Wizualnej):** Wybór 3–4 słów kluczowych Pre-A1/A1, które powtórzą się na min. 3 z 5 stron. Zdefiniowanie `characterVisualAnchor`.
- **Krok 2 (Generowanie Zdań, Fonetyki Sylabicznej i Klocków):** Napisanie prostych zdań (4–8 słów), polskiej fonetyki sylabicznej z dywizami (zero IPA, zero liter `q, v, x` i zbitek `th, sh, ee, oo`) oraz rozbicie na tablicę `words` tak, aby po złączeniu dawała 1:1 `sentenceEn`.
- **Krok 3 (Konfiguracja Scenografii i Ilustracji):** Dobór `visualConfig` (kolory i liczba elementów w `props` muszą zgadzać się z treścią zdania na danej stronie!) oraz wygenerowanie plików ilustracji (jeśli narzędzie obrazów jest dostępne).
- **Krok 4 (Audyt Okiem Strażnika):** Samokontrola zgodności obrazka z tekstem i poprawności tłumaczeń kontekstowych.
- **Krok 5 (Integracja i Twardy Test Strażnika):** Dopisanie bajki do `src/data/stories.json` i obowiązkowe uruchomienie w terminalu `npm run guardian` oraz `npm run build`. Zadanie uznaje się za wykonane wyłącznie po uzyskaniu komunikatu `✅ ALL STORIES PASSED GUARDIAN CHECK`.

---

## 8. KRYTERIUM UKOŃCZENIA (DEFINITION OF DONE DLA AGENTA 5)
Przed zgłoszeniem zakończenia prac wykonaj w terminalu następujące kroki weryfikacyjne:
1. Uruchom `npm run guardian` – upewnij się, że skrypt sprawdza wszystkie 4 bajki startowe (20 stron) i wypisuje szczegółowy raport zakończony statusem `✅ ALL STORIES & VISUALS PASSED GUARDIAN CHECK`.
2. Uruchom `npm run build` – upewnij się, że kompilator TypeScript (`tsc`) oraz bundler Vite budują aplikację produkcyjną w folderze `dist/` bez ani jednego błędu.
3. Sprawdź, czy plik `.agent/skills/martynka-story-generator/SKILL.md` istnieje i zawiera kompletny, 5-krokowy protokół.
