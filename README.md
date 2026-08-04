# Memory

Memory-Kartenspiel für zwei Spieler – umgesetzt nach den Claude-Design-Screens
(Home, Settings, Board, Quit-Dialog, Game over). Vanilla HTML/CSS/JavaScript,
kein Build-Schritt, keine Abhängigkeiten.

## Starten

`index.html` im Browser öffnen.

## Aufbau

```
index.html          Alle vier Screens + Quit-Dialog
css/style.css       Layout und Theme-Tokens (CSS Custom Properties)
js/themes.js        Konfiguration: 4 Themes, Spieler, Spielfeldgrößen
js/state.js         Zentraler Spielzustand
js/settings.js      Settings-Screen: Auswahl, Vorschau, Start-Button
js/board.js         Deck-Erzeugung (Fisher-Yates) und Karten-DOM
js/game.js          Aufdecken, Paarprüfung, Punkte, Spielerwechsel
js/end.js           Gewinner-Anzeige, Endpunktestand, Konfetti
js/app.js           Screen-Routing, Stage-Skalierung, Event-Bindung
assets/             Kartenmotive
```

Die Bühne ist auf die Design-Größe 1440 × 1024 fixiert und wird per
`transform: scale()` auf jede Fenstergröße skaliert – dadurch bleiben alle
Abstände exakt wie im Design und die Seite funktioniert trotzdem auf jedem
Bildschirm.

## User Stories

| # | Anforderung | Umsetzung |
|---|---|---|
| 1 | Startseite + Weiterleitung zu den Settings | `screen--home`, Button „Play" |
| 1 | Controller-Icon mit Animation | Icon rotiert beim Hover um −14°, Button skaliert auf 1.08 |
| 2 | Zwei Spieler | Blue / Orange, bestimmt den Startspieler |
| 2 | Drei Spielfeldgrößen | 16 (4×4), 24 (6×4), 36 (6×6) Karten |
| 2/3 | Mehrere Themes | 4 Themes: Code vibes, Gaming, DA Projects, Foods |
| 3 | Theme ändert Farbschema | eigenes Set an CSS-Variablen je `body[data-theme]` |
| 3 | Theme ändert Motiv-Themengebiet | jedes Theme hat eigene 18 Motive |
| 4 | Spielfeld in gewählter Größe | Grid über `--cols` / `--fit` |
| 4 | Punktestand, aktueller Spieler, Exit-Button über dem Feld | `.topbar` |
| 4 | Flüssige Umdreh-Animation | 3D-Flip, 0,55 s `cubic-bezier(.2,.8,.2,1)` |
| 5 | „Game over" mit Punktestand | End-Screen mit Endpunktestand |
| 5 | Spieler mit den meisten Punkten wird als Gewinner angezeigt | Pokal + Name in Spielerfarbe, Unentschieden abgefangen |

## Spielregeln

Zwei gleiche Motive = ein Punkt und der Spieler ist erneut am Zug.
Bei einem Fehlversuch werden die Karten nach 1,4 s wieder verdeckt und der
andere Spieler ist dran. Sind alle Paare gefunden, erscheint der End-Screen.

## Extras (über die Checkliste hinaus)

- **4 Themes** statt der geforderten 2, jeweils mit eigener Schrift,
  eigenem Farbschema, eigener Kartenrückseite und eigenem Motiv-Set.
- **Quit-Dialog**: „Exit game" fragt vor dem Verlassen nach.
- **Konfetti** auf dem End-Screen, Unentschieden wird eigens behandelt.
- **„Play again"** startet direkt eine neue Runde mit denselben Einstellungen.
- **Live-Vorschau** im Settings-Screen zeigt Karten und Farben des Themes.
- **Stage-Skalierung** hält das Design auf jeder Auflösung pixelgenau.
- **Tastatur-/Fokus-Bedienung**: alle Interaktionen sind echte `<button>`-Elemente.

## Kartenmotive

Die Motive liegen als PNG unter `assets/card-<prefix>-<motiv>.png`
(`code`, `game`, `da`, `food`). Fehlt eine Datei, zeigt die Karte automatisch
ein passendes Symbol als Fallback – das Spiel bleibt also in jedem Fall
vollständig spielbar.
