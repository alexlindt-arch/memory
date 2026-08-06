# Memory

Memory-Kartenspiel für zwei Spieler, umgesetzt nach den Claude-Design-Screens
(Home, Settings, Board, Quit-Dialog, Game over). Vanilla HTML/CSS/JavaScript –
kein Build-Schritt, keine Abhängigkeiten.

**Spielen:** https://alexlindt-arch.github.io/memory/
Oder `index.html` lokal im Browser öffnen.

## Aufbau

```
index.html          Alle vier Screens + Quit-Dialog
css/style.css       Layout und Theme-Tokens (CSS Custom Properties)
js/themes.js        Konfiguration: 4 Themes, Spieler, Spielfeldgrößen
js/state.js         Zentraler Spielzustand
js/settings.js      Settings-Screen: Auswahl, Vorschau, Summary, Start-Button
js/board.js         Deck-Erzeugung (Fisher-Yates) und Karten-DOM
js/game.js          Aufdecken, Paarprüfung, Punkte, Spielerwechsel
js/end.js           Game-over-Screen, Gewinner-Anzeige, Konfetti
js/app.js           Screen-Routing, Stage-Skalierung, Event-Bindung
assets/             74 Originalgrafiken aus dem Design-Projekt
```

## Responsives Verhalten (320 px – 2560 px)

Das Spiel ist auf jeder Breite von 320 px bis 2560 px vollständig bedienbar.
Drei Bereiche greifen ineinander:

| Bereich | Verhalten |
|---|---|
| **bis 768 px** | zusätzlich zum Flow-Layout wird die Spielleiste aufgelöst: „Exit game" steht oben links, Punktestand und aktueller Spieler folgen als eigene, button-artige Karten mit Radius, Rahmen in der Theme-Farbe und Schatten. |
| **bis 1023 px** | echtes Flow-Layout: die Bühne wird statisch, jeder Screen ist ein Flex-Container über `min-height: 100vh`. Schriftgrößen und Abstände skalieren über `clamp()`, das Spielfeld läuft als `repeat(var(--cols), 1fr)` mit `aspect-ratio`-Karten, die Topbar und die Button-Reihen brechen um. Unter 400 px greifen zusätzlich engere Abstände. |
| **1024 – 1439 px** | die feste Design-Bühne 1440 × 1024 wird per `transform: scale()` heruntergerechnet – alle Abstände bleiben pixelgenau wie im Design. |
| **ab 1440 px** | Widescreen-Breakpoint: die Inhaltsfläche behält ihre Breite und wird zentriert, der Hintergrund läuft über die gesamte Bildschirmbreite – in jedem Theme mit seiner eigenen Farbe. Der Gewinner-Screen verwendet ab hier den langen Konfettistreifen (3216 px, 22 Elemente) statt der Desktop-Variante. |

Geprüft wurde jeder Screen (Home, Settings, Spielfeld in allen drei Größen,
Quit-Dialog, Game over, Gewinner, Unentschieden) bei 320, 375, 480, 768, 1024,
1440, 2560 und 3440 px.

## User Stories

| # | Anforderung | Umsetzung |
|---|---|---|
| 1 | Startseite nach Vorgabe | `screen--home` mit Watermark und Typo aus dem Design |
| 1 | Button leitet zu den Settings weiter | „Play" |
| 1 | Controller-Icon mit Animation | Icon rotiert beim Hover um −14°, Button skaliert auf 1.08 |
| 2 | Zwei Spieler | Blue / Orange – bestimmt den Startspieler |
| 2 | Drei Spielfeldgrößen | 16 (4×4), 24 (6×4), 36 (6×6) Karten |
| 2/3 | Mehrere Themes | 4 Themes: Code vibes, Gaming, DA Projects, Foods |
| 3 | Theme ändert Farbschema | eigener Satz CSS-Variablen je `body[data-theme]` |
| 3 | Theme ändert Motiv-Themengebiet | jedes Theme hat eigene 18 Motive |
| 4 | Spielfeld in gewählter Größe | Grid über `--cols` / `--fit` |
| 4 | Punktestand, aktueller Spieler, Exit-Button über dem Feld | `.topbar` |
| 4 | Flüssige Umdreh-Animation | 3D-Flip, 0,55 s `cubic-bezier(.2,.8,.2,1)` |
| 5 | „Game over" mit Punktestand | eigener Game-over-Screen mit Endstand |
| 5 | Spieler mit den meisten Punkten als Gewinner | anschließender Gewinner-Screen, Name + Figur in Spielerfarbe, Unentschieden abgefangen |
| 5 | Möglichkeit, eine neue Runde zu beginnen | „Play again" startet sofort neu, „Back to start" führt zum Homescreen |

## Spielregeln

Zwei gleiche Motive geben einen Punkt, und der Spieler ist erneut am Zug.
Bei einem Fehlversuch werden die Karten nach 1,4 s wieder verdeckt und der
andere Spieler ist dran. Sind alle Paare gefunden, erscheint der End-Screen.

## Extras (über die Checkliste hinaus)

- **4 Themes** statt der geforderten 2 – je eigene Schrift, Farbschema,
  Kartenrückseite und Motiv-Set.
- **Quit-Dialog**: „Exit game" fragt vor dem Verlassen nach.
- **„Play again"** startet sofort eine neue Runde mit denselben Einstellungen.
- **Zweistufiges Ende**: erst „Game over" mit Endstand, dann der Gewinner-Screen –
  jeweils im eigenen Design pro Theme. Ein Klick überspringt die Wartezeit.
- **Konfetti** auf dem Gewinner-Screen; Unentschieden wird eigens behandelt.
- **Live-Vorschau** im Settings-Screen zeigt Karten und Farben des Themes.
- **Summary-Leiste** spiegelt die Auswahl wider („Code vibes / Orange / 36 cards").
- **Vollständig responsiv von 320 px bis 2560 px**: Flow-Layout für Handys,
  pixelgenaue Stage-Skalierung für Desktop, eigenes Widescreen-Layout ab 1440 px.
- **Tastatur-/Fokus-Bedienung**: alle Interaktionen sind echte `<button>`-Elemente.

## Code Conventions

HTML, CSS und JavaScript liegen in getrennten Dateien. Keine Inline-Styles,
keine Inline-Event-Handler. Jede Funktion hat einen JSDoc-Block, bleibt unter
15 Zeilen und hat genau eine Aufgabe. Namen in camelCase, Konstanten in
UPPER_SNAKE_CASE, semantische Elemente und `alt`-Attribute durchgängig.

## Grafiken

Alle 74 Bilder stammen unverändert aus dem Claude-Design-Projekt
(`card-<theme>-<motiv>.png`, `card-frame-foods.png`, `confetti.png`).
Fehlt eine Datei, zeigt die Karte automatisch ein passendes Symbol als
Fallback – das Spiel bleibt in jedem Fall spielbar.
