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

Die Bühne ist auf die Design-Größe 1440 × 1024 fixiert. Unterhalb von 1440 px
wird sie per `transform: scale()` heruntergerechnet, sodass alle Abstände exakt
wie im Design bleiben.

**Ab 1440 px (Widescreen)** greift der Breakpoint: die Inhaltsfläche behält ihre
Breite und wird zentriert, während der Hintergrund über die gesamte
Bildschirmbreite läuft – in jedem Theme mit seiner eigenen Farbe. Der
Gewinner-Screen verwendet ab dieser Breite den langen Konfettistreifen
(3216 px, 22 Elemente) statt der Desktop-Variante.

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

## Spielregeln

Zwei gleiche Motive geben einen Punkt, und der Spieler ist erneut am Zug.
Bei einem Fehlversuch werden die Karten nach 1,4 s wieder verdeckt und der
andere Spieler ist dran. Sind alle Paare gefunden, erscheint der End-Screen.

## Extras (über die Checkliste hinaus)

- **4 Themes** statt der geforderten 2 – je eigene Schrift, Farbschema,
  Kartenrückseite und Motiv-Set.
- **Quit-Dialog**: „Exit game" fragt vor dem Verlassen nach.
- **Zweistufiges Ende**: erst „Game over" mit Endstand, dann der Gewinner-Screen –
  jeweils im eigenen Design pro Theme. Ein Klick überspringt die Wartezeit.
- **Konfetti** auf dem Gewinner-Screen; Unentschieden wird eigens behandelt.
- **Live-Vorschau** im Settings-Screen zeigt Karten und Farben des Themes.
- **Summary-Leiste** spiegelt die Auswahl wider („Code vibes / Orange / 36 cards").
- **Stage-Skalierung** hält das Design auf jeder Auflösung pixelgenau,
  mit eigenem Widescreen-Layout ab 1440 px.
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
