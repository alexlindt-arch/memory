# Memory

Ein spielbares **Memory-Kartenspiel** für zwei Spieler – umgesetzt aus dem Figma-Design „Memory (Kopie)". Vanilla HTML/CSS/JS, kein Framework, kein Build.

**▶︎ Spielen:** `index.html` im Browser öffnen.

## Features

- **2‑Spieler-Modus** mit Zugwechsel: Treffer = Punkt + nochmal ziehen, Fehlversuch = Gegner ist dran.
- **4 Themes** – jeweils mit eigener Schrift, Farbwelt, Kartenrückseite und Dialog-Stil (pixelgenau aus Figma):
  - Code vibes (dunkel, Teal-Verlauf, *Red Rose*)
  - Gaming (dunkel, Magenta-Verlauf, *Orbitron*)
  - DA Projects (hell, Teal, *Figtree*)
  - Foods (hell, Orange, *Delius Unicase / Klee One*)
- **3 Boardgrößen:** 16 · 24 · 36 Karten.
- **Screens:** Home → Settings (Live-Vorschau) → Board → Winner / Draw – inkl. Punktestand, Pokal & Konfetti.
- **Quit-Dialog**, Tastatur-/Screenreader-freundlich, vollständig **responsiv** (skaliert von Desktop bis Mobile).

## Projektstruktur

```
index.html        – alle Screens (Home, Settings, Game, End) + Quit-Dialog
css/style.css     – Basis + Theme-Tokens (per [data-theme]) + Layout
js/app.js         – Spielstand, Board-Generierung, Flip-/Match-Logik, End-Screens
assets/<theme>/   – Kartenmotive (PNG) – siehe Hinweis unten
```

## Kartenmotive

Die Themen-Farben, Rückseiten, HUD, Dialoge und End-Screens sind **1:1 aus Figma**
übernommen. Die **Kartenvorderseiten** nutzen aktuell ein konsistentes, themenpassendes
Icon-Set. Die 72 Original-Motive aus Figma lassen sich per Flag einschalten:

- in `js/app.js`: `USE_IMAGE_FRONTS = true`
- Bilder unter `assets/<theme>/front-1.png … front-18.png`

*(Grund: Die Figma-MCP-Schnittstelle hat auf dem Starter-Plan ein Tool-Call-Limit;
bislang sind Code vibes 1–6 und Gaming 1–6 exportiert. Sobald das Kontingent
zurückgesetzt ist, werden die restlichen Motive ergänzt und das Flag aktiviert.)*

## Fonts

Almarai · Red Rose · Orbitron · Figtree · Delius Unicase · Klee One (Google Fonts).
