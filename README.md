# 🏦 Silicon — Bank App Landningssida

En responsiv, en-sidig landningssida för en mobil bank-app, byggd i HTML, CSS och lättviktig JavaScript utifrån en Figma-designmall.

---

## 📖 Om projektet

Det här projektet bygger en komplett, responsiv landningssida med stöd för ljust och mörkt läge.

Projektet demonstrerar ett komplett arbetsflöde från design till kod:
- Design hämtad från en Figma-mall och omsatt till semantisk HTML/CSS
- Responsiv layout i tre steg (desktop, tablet, mobil), byggd efter tre separata breakpoint-varianter i källdesignen
- Dark/light mode-växling och hamburgermeny, båda JS-drivna för robusthet oberoende av kodordning
- Layouttekniken väljs efter vad som passar bäst för varje sektion — CSS Grid för äkta rutnät, Flexbox för enklare rader/kolumner
- Design tokens (färger, typografi, skuggor) som CSS-variabler, hämtade direkt från källdesignens designsystem
- Sektionsnamn i koden som medvetet speglar Figma-filens egen namngivning, för att hålla flera utvecklares arbete entydigt

---

## 🚀 Kom igång

Inga installationssteg eller beroenden behövs.

### 1. Klona projektet
```bash
git clone https://github.com/<ditt-användarnamn>/silicon-landningssida.git
cd silicon-landningssida
```

### 2. Öppna sidan
```bash
open index.html
```
Eller dubbelklicka på `index.html` i valfri webbläsare.

---

## 📁 Projektstruktur

```
silicon-landningssida/
├── index.html              Sidans HTML-struktur
├── styles.css               All styling, design tokens och responsiv layout
├── dark-theme.css            Färgöverlagring för mörkt läge
├── hamburger.js               Mobilmenyns logik
├── toggle.js                  Dark/light mode-logik
├── images/                   Alla bilder och ikoner
├── README.md                 Dokumentation (den här filen)
├── HTML-STRUKTUR.md          Genomgång av HTML:en, sektion för sektion
└── CSS-STRUKTUR.md           Genomgång av CSS:en: namngivning, nästling, responsiv strategi
```

Se `HTML-STRUKTUR.md` och `CSS-STRUKTUR.md` för en fullständig genomgång av koden.

---

## ✨ Egenskaper

| Egenskap | Beskrivning |
|---|---|
| Responsiv | Tre steg: desktop, tablet (≤768px), mobil (≤480px) |
| Dark/light mode | Full täckning, växlas med en knapp i navbaren |
| Hamburgermeny | JS-driven, ordningsoberoende, stänger vid klick utanför och Escape |
| CSS Grid + Flexbox | Grid för rutnät och två-kolumns-layouter, Flexbox för enklare rader |
| Native CSS-nästling | Används där det faktiskt fungerar korrekt — se `CSS-STRUKTUR.md` |
| Tillgänglighet | Synlig fokusmarkering, beskrivande alt-texter, stöd för `prefers-reduced-motion` |
| Design tokens | Färg-, typografi- och skuggskala som CSS-variabler |

---

## 🎨 Källa

Designen är byggd utifrån Figma-mallen **"Silicon Design Template"**.

## ⚠️ Kända begränsningar

Källdesignen innehåller inte alla sektioner i alla skärmstorlekar — medvetna designval, inte buggar:

| Sektion | Döljs vid |
|---|---|
| App Features | ≤768px |
| Testimonials Section | ≤768px |
| Logos / Brands | ≤480px |
| Header-telefonerna | ≤480px |

---

## 🛠️ Teknikstack

| Komponent | Beskrivning |
|---|---|
| HTML5 | Semantisk markup |
| CSS3 | Grid, Flexbox, native nästling, `clamp()`, `aspect-ratio`, CSS custom properties |
| JavaScript | Vanilla JS, inga beroenden — hamburgermeny och dark mode |
| Manrope (Google Fonts) | Typsnitt |

---

## 👥 Team

- Leo
- Peter

Arbetet har jämlikt delats upp sektion för sektion
