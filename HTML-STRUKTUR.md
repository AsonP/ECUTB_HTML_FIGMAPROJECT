# HTML-struktur — Silicon landningssida

Det här dokumentet förklarar hur `index.html` är uppbyggd: vilka sektioner som finns, varför de är kodade som de är, och hur du lägger till eller ändrar innehåll utan att förvirra dig i strukturen.

Filen är en **enda sida** (`index.html`) med sektioner i den ordning de visas, uppifrån och ner. Se `CSS-STRUKTUR.md` för hur allt stylas och hur det responsiva beteendet fungerar.

## Filerna som länkas in

```html
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="dark-theme.css">
...
<script src="hamburger.js"></script>
<script src="toggle.js"></script>
```

- **`styles.css`** — all grundläggande styling och responsiv layout (ljust läge, alltid aktivt).
- **`dark-theme.css`** — länkas **efter** `styles.css` och lägger bara till/ändrar färger när `<body data-theme="dark">`. Rör aldrig layout, bara utseende.
- **`hamburger.js`** — mobilmenyns logik, helt fristående.
- **`toggle.js`** — dark/light mode-logiken, helt fristående.

De två JS-filerna delades medvetet upp i separata filer (tidigare låg båda i en enda `toggle.js`) för att göra det enklare för flera personer att jobba i var sin fil utan att krocka i Git.

## Namngivning — vi följer Figma-filen

Klassnamnen på sektionsnivå är medvetet valda för att matcha namnen i Figma-filens sidopanel. Anledningen: när flera personer jobbar mot samma Figma-fil och samma kod ska det aldrig vara tvetydigt vilken sektion i koden som hör ihop med vilket lager i Figma.

**Viktigt specialfall:** Figma har två liknande men olika sektioner: **"Features"** (ikonrutnät + telefonmockup, klass `.features`) och **"App Features"** (de två bild+text-sektionerna längre ner, klass `.app-features`). De är lätta att blanda ihop eftersom orden är så lika — och rubriktexten på skärmen i `.features`-sektionen råkar dessutom bokstavligen lyda **"App Features"**, vilket gjort att vi själva blandat ihop dem under utveckling. Dubbelkolla alltid mot **klassnamnet** i koden, inte den synliga rubriktexten.

| # | Figmas namn | Vår klass | Innehåll |
|---|---|---|---|
| 1 | Header *(Figma kallar navbaren detta)* | `.navbar` | Logga, hamburgermeny, Dark Mode-switch, Sign in/up |
| 2 | Hero | `.header` | Rubrik, ingress, appstore-badges, två telefonbilder (döljs på mobil) |
| 3 | Brands | `.logos` | 6 partnerloggor i rutor (döljs på mobil) |
| 4 | **Features** | `.features` | Telefonmockup + 6 ikonrutor i grid |
| 5 | How Does It Work | `.slider-section` | 3 telefonskärmar i en scrollbar karusell |
| 6 | **App Features** (A) | `.app-features.app-features--reverse` | Text + checklista + knapp + bild |
| 7 | **App Features** (B) | `.app-features` | Bild + text + 2 ikonrutor + knapp |
| 8 | Testimonials | `.testimonials-section` | Rubrik till vänster + 2 kundomdömen till höger |
| 9 | FAQ | `.faq` | Rubrik + kontaktrutor + accordion med 6 frågor |
| 10 | Subscribe | `.subscribe` | Nyhetsbrevs-formulär |
| 11 | Footer | `.footer` | Copyright-text |

**Notera namnkrocken vi löste:** sektion 2 använder klassen `.header`, men navbaren (sektion 1) ligger i en semantisk `<header>`-**tagg** (med klassen `.navbar`). Det är ingen bugg — HTML-taggnamn och CSS-klassnamn krockar aldrig med varandra — men var uppmärksam när du läser koden: `<header class="navbar">` är navigationen, `<section class="header">` är hero-banderollen.

Varje sektion är kodad med en kommentar som visar båda namnen (`<!-- ============ HEADER (Figma: "Hero") ============ -->`), så det går snabbt att hitta rätt ställe med sök (Ctrl+F) oavsett vilket namn du kommer ihåg.

## Navbaren — två knappar, båda JS-drivna

```html
<nav class="navbar__right" id="navbarMenu">
  <div class="theme-switch">
    <span class="theme-switch__label">Dark Mode</span>
    <button type="button" class="theme-switch__toggle" id="themeToggle"
            aria-pressed="false" aria-label="Växla mellan ljust och mörkt läge"></button>
  </div>
  <a href="#" class="btn btn--primary btn--sm">Sign in / up</a>
</nav>

<button type="button" class="nav-toggle-btn" id="navToggleBtn"
        aria-expanded="false" aria-controls="navbarMenu" aria-label="Öppna meny">
  <span></span><span></span><span></span>
</button>
```

Båda är riktiga `<button>`-element (inte `<div>` eller checkbox-hack) som styrs via `id` av respektive JS-fil:

- **`#themeToggle`** → `toggle.js` växlar `data-theme="light"`/`"dark"` på `<body>`.
- **`#navToggleBtn`** → `hamburger.js` växlar klassen `.is-open` på sig själv och på `#navbarMenu`.

**Varför JS istället för CSS-only checkbox-hack:** ett tidigare försök med en dold `<input type="checkbox">` + `:checked`-selektor krävde att kryssrutan låg *före* menyn i HTML-koden (på grund av CSS:ens syskonselektor `~`). Flyttade någon om markupen slutade menyn fungera **tyst**, utan felmeddelande. Med JS (`document.getElementById`) spelar HTML-ordningen ingen roll — elementen hittas via `id` oavsett var de ligger. Som bonus fick vi då även gratis: stäng vid klick utanför menyn, stäng med Escape-tangenten, och korrekt `aria-expanded`/`aria-pressed` för skärmläsare. Se `dark-mode-test/README.md` för en fullständig jämförelse mellan de två teknikerna.

## FAQ-accordionen — ingen JavaScript här

```html
<details class="accordion__item">
  <summary>Frågan här <img ... class="chevron"></summary>
  <p class="body-m muted">Svaret här...</p>
</details>
```

`<details>`/`<summary>` är inbyggda HTML-element som kan fällas ut/ihop helt utan JavaScript. Pilikonen (`.chevron`) roterar automatiskt via CSS när `<details>` öppnas — samma bildfil används för alla sex frågor. Lägg till attributet `open` på en `<details>` om den ska vara utfälld som standard.

**Att lägga till en ny FAQ-fråga:** kopiera ett helt `<details class="accordion__item">...</details>`-block, byt ut frågetexten, och lägg svaret i en `<p class="body-m muted">`.

## Bilder och `images/`-mappen

```html
<img src="images/logo.svg" alt="Silicon logo" class="navbar__logo-img navbar__logo-img--light">
<img src="images/logo-dark.svg" alt="Silicon logo" class="navbar__logo-img navbar__logo-img--dark">
```

Mappen heter **`images/`** (tidigare `bilder/`, tidigare `pictures/` — bytt tre gånger, håll fast vid det här namnet). Se `MANIFEST.md` för en fullständig, maskingenererad lista över exakt vilka bildfiler koden refererar till, och varifrån varje fil kom (Figma-export, handbyggd ersättning, eller kollegans export).

**Mönster för ljus/mörk bildväxling** (loggan och de 6 partnerloggorna): två `<img>`-taggar staplade på varandra med `navbar__logo-img--light`/`--dark` respektive `logo-card__img--light`/`--dark`, tonade mjukt mellan varandra med CSS `opacity` (se `CSS-STRUKTUR.md`). Ingen JavaScript behövs för själva växlingen — bara `dark-theme.css` som sätter opacity beroende på `data-theme`.

**Alt-text-principen** som följs genomgående:

| Typ av bild | Alt-text |
|---|---|
| Ikoner bredvid beskrivande text (t.ex. bredvid rubriken "Easy Payments") | `alt=""` (tom, medvetet) — skärmläsare hoppar över den |
| Pilar/checkmarks i listor och knappar | `alt=""` — rent dekorativa |
| Meningsbärande foton/skärmbilder utan egen textbeskrivning intill | Beskrivande `alt="..."` |
| Loggor | Beskrivande `alt="..."` |

Tom `alt=""` är alltså **inte** ett misstag där den förekommer — det är korrekt WCAG-praxis för rent dekorativa bilder.

## Responsivt beteende (kort sammanfattning)

Det mesta av det responsiva beteendet sköts av CSS (se `CSS-STRUKTUR.md`), men värt att veta när du läser HTML:en — allt nedan är medvetna designval från Figma-filens Tablet/Mobile-sidor, inte genvägar:

- **`.app-features`** (sektion 6 och 7) och **`.testimonials-section`** (sektion 8) **döljs helt** under 768px.
- **`.logos`** (sektion 3) döljs helt under 480px.
- **Header-telefonerna** (`.header__image`) döljs helt under 480px — Figmas Mobile-variant visar bara text och badges i Header, inga telefonbilder.
- **`.faq__mobile-contact`**-knappen är dold på desktop och visas bara under 768px, som ersättning för de två kontaktrutorna.

## Att lägga till en helt ny sektion

1. Kopiera mönstret: `<section class="ditt-namn"><div class="container ...">...</div></section>`
2. Lägg till en kommentar `<!-- ============ NAMN (Figma: "...") ============ -->` ovanför, för sökbarhet.
3. Skriv motsvarande CSS-block i `styles.css` (se `CSS-STRUKTUR.md` för var det ska placeras, Grid-vs-Flexbox-valet, och nästlingsreglerna).
4. Om sektionen har bilder, lägg dem i `images/`-mappen och referera med relativ sökväg.
5. Kolla mot Figmas sidopanel att du använder exakt samma namn som Figma-filen.

## Team

Leo och Peter delar upp arbetet sektion för sektion (se tabellen ovan för de exakta gränserna).
