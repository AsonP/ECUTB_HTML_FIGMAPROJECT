# CSS-struktur — Silicon landningssida

Det här dokumentet förklarar hur `styles.css` och `dark-theme.css` är organiserade, vilka principer de följer, och hur de klurigare bitarna (hero-bilden, hamburgermenyn, Grid-vs-Flexbox-valet, nästlingen) fungerar under huven. Se `HTML-STRUKTUR.md` för hur markupen är uppbyggd och för den fullständiga Figma-namn-tabellen.

## Två CSS-filer, olika ansvar

- **`styles.css`** — all grundlayout, typografi, komponenter och responsiv logik. Fungerar helt på egen hand (ljust läge).
- **`dark-theme.css`** — länkas **efter** `styles.css`. Innehåller bara regler scopade under `body[data-theme="dark"]` och rör **aldrig** `display`, `grid-template-columns`, `flex`, positionering eller mått — bara färger, opacity och filter. Det gör att dark mode kan underhållas helt separat utan att riskera att råka ändra layouten.

## Filens uppbyggnad, i ordning

`styles.css` är skriven **uppifrån och ner i samma ordning som sidan visas**, med korta enradiga kommentarrubriker (`/* ===== NAMN ===== */`). Rubrikerna visar Figmas originalnamn inom parentes där det skiljer sig från vårt klassnamn.

1. Design tokens (`:root`)
2. Reset & bas
3. Knappar
4. Navbar (inkl. hamburgermeny och tema-knapp)
5. Header *(Figma: "Hero")*
6. Logos *(Figma: "Brands")*
7. Features *(ikonrutnät + telefon)*
8. Slider Section *(Figma: "How Does It Work")*
9. App Features *(de två bild+text-sektionerna)*
10. Testimonials Section
11. FAQ (inkl. accordion)
12. Subscribe
13. Footer
14. Responsiv layout (alla `@media`-block, samlade sist)
15. `prefers-reduced-motion` (tillgänglighet)

`dark-theme.css` följer samma sektionsordning, för att vara lätt att jämföra sida vid sida med `styles.css`.

## CSS Grid **och** Flexbox — båda används, medvetet

Till skillnad från en tidigare version (som körde uteslutande Flexbox för konsekvens) använder den nuvarande koden **båda teknikerna**, valda efter vad som faktiskt passar varje layout:

| Teknik | Används för | Exempel |
|---|---|---|
| **CSS Grid** | Äkta rutnät och asymmetriska två-kolumns-layouter | `.header__inner`, `.logos__grid`, `.features__inner`, `.app-features__inner`, `.testimonials-section__inner`, `.testimonial-grid`, `.faq__inner`, `.faq__contact-boxes`, `.feature-grid` |
| **Flexbox** | Enklare rader/kolumner, listor, knapprader | `.navbar__inner`, `.market-btns`, `.carousel`, `.check-list`, `.accordion`, `.subscribe-card__form`, `.testimonial-card__author` |

**Tumregeln:** om layouten behöver kontrollera **rader och kolumner samtidigt** (ett riktigt rutnät, eller en asymmetrisk fast+flytande två-kolumners-uppdelning) → Grid. Om det bara är **en rad eller kolumn** där innehållet ska fördela sig naturligt → Flexbox.

**Exempel, asymmetrisk två-kolumn (Grid):**
```css
.header__inner {
  display: grid;
  grid-template-columns: minmax(0, 526px) minmax(280px, 1fr);
  gap: 48px;
}
```

**Exempel, rutnät med N lika kolumner (Grid):**
```css
.logos__grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}
```

**Exempel, enkel rad (Flexbox):**
```css
.market-btns { display: flex; gap: 24px; flex-wrap: wrap; }
```

## Native CSS-nästling — vad som fungerar och vad som INTE gör det

**Filen använder native CSS-nästling (`&`), men INTE på det sätt Sass gjorde det.** Det här är den viktigaste regeln att förstå innan du redigerar filen:

> **Native CSS-nästling kan inte bygga BEM-klassnamn genom sammanfogning.** `.block { &__element {...} }` blir INTE `.block__element`. Webbläsaren tolkar `&__element` som "`&` + en HTML-tagg som heter `__element`" — vilket aldrig matchar något element. Regeln blir tyst overksam, utan felmeddelande.

Det skiljer sig helt från Sass/SCSS, där `&` är en textsträng som sammanfogas. I native CSS är `&` en riktig selektor-referens, inte en sträng.

**Konsekvensen för vår kod:**

| Mönster | Fungerar med `&`-nästling? | Var det används |
|---|---|---|
| `&__element` (BEM-element) | ❌ Nej | — används INTE, alla BEM-element står platta |
| `&--modifier` (BEM-modifierare) | ❌ Nej | — används INTE, alla BEM-modifierare står platta |
| `&:hover`, `&:focus`, `&:active` | ✅ Ja | `.btn`, `.testimonial-card`, `.contact-box` |
| `&[open]` (attributselektor) | ✅ Ja | `.accordion__item` |
| Bar tagg (`img`, `h2`, `p`, `span`) som barn | ✅ Ja | de flesta sektioner |
| `> *`, `> p` (kombinator + tagg) | ✅ Ja | `.app-features__inner`, `.features__content` |

```css
/* BEM-klasser är ALLA egna, platta toppnivå-selektorer: */
.testimonial-card { ... }
.testimonial-card__quote { ... }

/* Men VARJE sådan platt selektor är sin egen nästlings-"värd" för
   sina egna pseudo-klasser och riktiga HTML-tagg-barn: */
.testimonial-card {
  display: flex;
  &:hover { box-shadow: var(--shadow-m); }   /* pseudo-klass — OK */
}
.testimonial-card__author {
  img { width: 48px; }      /* riktig tagg — OK */
}
```

**Om du är osäker på om något går att nästla:** fråga dig om `&` skulle behöva sammanfoga text för att bilda rätt klassnamn. Om ja — nästla inte, skriv en egen platt selektor.

## Namnkonvention (BEM-liknande)

```
.block               → t.ex. .header, .app-features
.block__element      → t.ex. .header__image, .app-features__content
.block--modifier      → t.ex. .app-features--reverse
```

**Fristående komponent-block** (inte kopplade till en specifik sektions namnrymd) döps som egna block istället för att nästlas under sektionens BEM-namn — t.ex. `.testimonial-card` (inte `.testimonials-section__card`), `.subscribe-card` (inte `.subscribe__card`), `.logo-card`, `.contact-box`. Anledningen: `.subscribe` är redan sektionens eget namn, så "kortet" inuti den fick bli ett eget block (`.subscribe-card`) istället för ett understruket barn, för att undvika namnkrock.

## Design tokens (`:root`)

| Kategori | Variabler | Exempel |
|---|---|---|
| Grå-skala | `--gray-100` till `--gray-900` | Text, bakgrunder, kantlinjer |
| Märkesfärg | `--brand-primary`, `--brand-soft` | Knappar, ikonbakgrunder |
| Statusfärger | `--success`, `--warning`, `--error` | Stjärnbetyg, badges |
| Typografi | `--font` | Manrope överallt |
| Skuggor | `--shadow-s`, `--shadow-m`, `--shadow-brand` | Kort, knappar |
| Layout | `--container-width`, `--radius-s/m/l` | Maxbredd, hörnradier |
| Övergång | `--transition` | Hover-effekter, dark mode-växling |

Alla dessa tokens är definierade i `styles.css` och återanvänds fritt i `dark-theme.css` (CSS-variabler är globalt tillgängliga oavsett vilken fil som deklarerar dem, så länge den filen laddas först).

## Flytande typografi med `clamp()`

```css
h1 { font-size: clamp(32px, 4.5vw, 56px); }
section { padding: clamp(48px, 8vw, 100px) 0; }
```

Skalar mjukt mellan mobil och desktop, istället för att hoppa mellan fasta värden vid varje brytpunkt.

## De tre knepigaste teknikerna

### 1. Header-bilden — `aspect-ratio` istället för gissad höjd

```css
.header__image {
  position: relative;
  aspect-ratio: 746 / 936; /* exakt Figma-proportion */
}
.header__phone--back { top: 14.5%; left: 15.4%; width: 53.1%; }
.header__phone--front { top: 0; left: 46.1%; width: 53.9%; }
```

`aspect-ratio: 746 / 936` är den exakta bredd/höjd-proportionen från Figma-filens originaldata. Webbläsaren räknar automatiskt ut rätt höjd utifrån bredden. De två telefonbilderna placeras med `top`/`left`/`width` i **procent av den boxen**.

**Not:** Header-telefonerna kommer från kollegans egna Figma-export och har en annan bildproportion än de allra första originalfilerna — men eftersom Figma-filens Mobile-variant döljer telefonerna helt (`.header__image { display: none; }` vid ≤480px, se responsiv-tabellen nedan) spelar den skillnaden ingen roll på mobil.

### 2. Hamburgermenyn och tema-knappen — JS-drivna knappar

```css
.nav-toggle-btn { display: none; }             /* dold på desktop */
.nav-toggle-btn.is-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }

.theme-switch__toggle { background: var(--gray-300); }
.theme-switch__toggle::after { transform: translateX(0); }
```

Till skillnad från en tidigare CSS-only checkbox-hack-lösning styrs båda knapparna nu av `hamburger.js`/`toggle.js`, som sätter klassen `.is-open` respektive attributet `data-theme` — CSS:en reagerar bara på dessa, ingen `:checked`-selektor längre. Se `HTML-STRUKTUR.md` för varför bytet gjordes (ordningsberoende i checkbox-hacket).

### 3. Ljus/mörk bildväxling utan JavaScript (loggor)

```css
.navbar__logo-img {
  position: absolute;
  transition: opacity var(--transition);
}
.navbar__logo-img--dark { opacity: 0; }
```
```css
/* dark-theme.css */
body[data-theme="dark"] .navbar__logo-img--light { opacity: 0; }
body[data-theme="dark"] .navbar__logo-img--dark { opacity: 1; }
```

Två `<img>`-taggar läggs ovanpå varandra (`position: absolute` i en fast storlekssatt förälder) och tonas mjukt in/ut med `opacity` istället för ett tvärt `display: none`/`block`-byte — det senare gav upphov till ett synligt "hopp" i loggans storlek tidigare (se historiken om ni är nyfikna). Samma mönster används för de 6 partnerloggorna (`.logo-card__img`).

## Karusellen (`.carousel`) — scroll istället för JS-slider

```css
.carousel { display: flex; overflow-x: auto; scroll-snap-type: x proximity; }
.carousel__phone { scroll-snap-align: center; width: min(328px, 60vw); }
```

Webbläsarens inbyggda horisontella scroll med `scroll-snap` istället för en JavaScript-driven karusell.

## Tillgänglighet

```css
a:focus-visible, button:focus-visible, ... { outline: 3px solid var(--brand-primary); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; ... }
}
```

- **`:focus-visible`** ger en tydlig ram vid tangentbordsnavigering.
- **`prefers-reduced-motion`** stänger av animationer för användare som valt "minska rörelse" i sitt OS.
- Alla interaktiva knappar (`.theme-switch__toggle`, `.nav-toggle-btn`) har egna `:focus-visible`-regler.

## Den responsiva strategin

Alla `@media`-block ligger samlade **sist i `styles.css`** (inte inne i respektive sektions eget block), i fallande bredd-ordning: `1024px → 768px → 640px → 480px`.

| Brytpunkt | Vad händer | Varför |
|---|---|---|
| **≤1024px** | Grid-layouter blir en kolumn (`grid-template-columns: 1fr`) för Header, Features, App Features, FAQ, Testimonials. Logos: 3 per rad. | Matchar ungefär Figma-filens Tablet-bredd (768px) med marginal |
| **≤768px** | Hamburgermeny aktiveras (`.nav-toggle-btn` visas, `.navbar__right` döljs som standard). `.app-features` och `.testimonials-section` döljs helt. Features tappar telefonmockupen. FAQ:s kontaktrutor byts mot en knapp. | Figma-filens **Tablet Pages** innehåller inte dessa sektioner/element alls |
| **≤640px** | Rutnät blir en kolumn (Logos: 2 per rad, Feature-grid: 1 kolumn). Subscribe-formuläret staplas. Container-padding minskar. | Ren layout-anpassning för smala skärmar |
| **≤480px** | `.logos` döljs helt. **`.header__image` döljs helt** (telefonerna i Header-sektionen). Knapptext krymper till ikon. Loggan i navbaren krymper proportionerligt. | Figma-filens **Mobile Pages** har varken Logos-sektion eller telefonbilder i Header |

**Viktigt att komma ihåg:** flera `display: none`-regler här är **medvetna designval från Figma-filen**, bekräftade en och en mot de faktiska Tablet/Mobile-sidorna under utveckling — inte genvägar vi tog. Ta upp det med teamet innan ni återinför något som är dolt.

## Att lägga till en ny komponent

1. Hitta rätt plats i filen (sektionerna ligger i sidordning).
2. Skriv en ny kommentarrubrik: `/* ===== Komponentnamn (Figma: "...") ===== */`
3. Använd befintliga design tokens istället för nya hårdkodade värden.
4. **Välj Grid för äkta rutnät/asymmetriska två-kolumner, Flexbox för enklare rader** — se tabellen ovan.
5. **BEM-element/-modifierare (`__x`, `--x`) blir ALLTID egna platta selektorer** — nästla dem aldrig under sin förälder. Nästla bara pseudo-klasser, attributselektorer och riktiga HTML-taggar.
6. Om komponenten behöver anpassas på mindre skärmar, lägg reglerna i rätt `@media`-block längst ner i `styles.css`.
7. Om komponenten behöver egna färger i mörkt läge, lägg de reglerna i `dark-theme.css` under motsvarande sektionsrubrik — rör aldrig layout där.
8. Undvik namnkrockar: om din nya komponent riskerar att dela namn med sin förälder-sektion (som Subscribe-fallet), gör den till ett eget fristående block.
