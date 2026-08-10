# Memory

Memory-Kartenspiel für zwei Spieler mit vier Themes, drei Spielfeldgrößen und
eigenem Gewinner-Screen. **TypeScript + SCSS, gebaut mit Vite.**

**Spielen:** https://alexander-lindt.developerakademie.net/Memory/

## Entwickeln

```bash
npm install      # einmalig
npm run dev      # Dev-Server mit Hot Reload
npm run build    # Typprüfung + Produktionsbuild nach dist/
npm run preview  # den fertigen Build lokal ansehen
```

`npm run build` führt zuerst `tsc --noEmit` aus: Findet die Typprüfung einen
Fehler, entsteht gar kein Build. Das Ergebnis liegt in `dist/` und wird
unverändert auf den Server geladen.

## Aufbau

```
index.html              Alle fünf Screens + Quit-Dialog, bindet src/main.ts ein
src/main.ts             Einstiegspunkt: Styles, Event-Bindung, Start
src/config.ts           4 Themes, Spieler, Spielfeldgrößen, Timings
src/types.ts            Gemeinsame Typen (Theme, Card, GameState …)
src/state.ts            Zentraler Spielzustand
src/dom.ts              Typsichere DOM-Zugriffe
src/screens.ts          Screen-Routing und Quit-Dialog
src/stage.ts            Skalierung der Design-Bühne
src/settings.ts         Settings-Screen: Auswahl, Vorschau, Summary, Start
src/board.ts            Deck-Erzeugung (Fisher-Yates) und Karten-DOM
src/game.ts             Aufdecken, Paarprüfung, Punkte, Spielerwechsel
src/end.ts              Game-over-Screen, Gewinner-Anzeige, Konfetti
src/styles/style.scss   Haupt-Stylesheet, bindet die Partials ein
src/styles/_*.scss      Ein Partial je Screen + Variablen und Theme-Tokens
public/                 75 Grafiken und Favicon, werden 1:1 übernommen
vite.config.ts          base: '/Memory/' – das Projekt liegt im Unterordner
tsconfig.json           strict: true
```

Die fünf Screens sind Startseite, Settings, Spielfeld, „Game over" und
Gewinner-Screen. Sie liegen alle im selben Dokument und werden über
`hidden` ein- und ausgeblendet – ein Reload gibt es nie.

## User Stories

| # | Anforderung | Umsetzung |
|---|---|---|
| 1 | Startseite nach Vorgabe | `screen--home` mit Watermark und Typo aus dem Entwurf |
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
- **Tastatur-/Fokus-Bedienung**: alle Interaktionen sind echte `<button>`-Elemente.
- **Vollständig responsiv von 320 px bis 2560 px** – siehe unten.

## Code Conventions

HTML, SCSS und TypeScript liegen in getrennten Dateien. Keine Inline-Styles,
keine Inline-Event-Handler. Jede Funktion hat einen JSDoc-Block, bleibt unter
15 Zeilen und hat genau eine Aufgabe. Namen in camelCase, Konstanten in
UPPER_SNAKE_CASE, semantische Elemente und `alt`-Attribute durchgängig.

### TypeScript

`strict: true`, und der Build bricht bei jedem Typfehler ab. Statt loser
Strings beschreiben eigene Typen, was erlaubt ist – `PlayerId` ist
`'blue' | 'orange'`, `BoardSize` ist `16 | 24 | 36`. Ein Tippfehler in einer
Theme-Id fällt dadurch beim Bauen auf und nicht erst im Browser.

Die Module teilen ihren Code über `export` / `import`. Zwei Stellen brauchten
dafür eine eigene Lösung, weil sie sich sonst gegenseitig importiert hätten:
Das Spielfeld reicht Klicks über einen Callback (`FlipHandler`) nach oben
weiter, statt die Rundenlogik zu importieren, und das Screen-Routing liegt in
`screens.ts` statt im Einstiegspunkt.

`document.getElementById` liefert `HTMLElement | null`. Unter `strict` bräuchte
jeder einzelne Zugriff eine Null-Prüfung, deshalb übernimmt `byId()` aus
`dom.ts` das einmal zentral und wirft bei einer fehlenden Id einen Fehler – ein
Tippfehler im Markup soll auffallen, nicht stillschweigend übergangen werden.

### SCSS

`style.scss` bindet je ein Partial pro Screen ein (`_home`, `_settings`,
`_board` …), dazu `_themes` mit den Farb-Tokens und `_responsive` mit den
Media Queries. Maße und Breakpoints stehen einmal in `_variables.scss`, so
steht die Breakpoint-Zahl nicht mehr in neun Media Queries verstreut.

## Grafiken

Alle 75 Bilder liegen unverändert in `public/` (`card-<theme>-<motiv>.png`,
`card-frame-foods.png`, `confetti.png`, `trophy-gaming.png`). Vite übernimmt
diesen Ordner beim Build unverändert nach `dist/`. Fehlt eine Datei, zeigt die
Karte automatisch ein passendes Symbol als Fallback – das Spiel bleibt in jedem
Fall spielbar.

## Responsives Verhalten (320 px – 2560 px)

Das Spiel ist auf jeder Breite von 320 px bis 2560 px vollständig bedienbar.
Von unten nach oben greifen diese Bereiche ineinander:

| Bereich | Verhalten |
|---|---|
| **bis 400 px** | engere Abstände überall, und die Spielleiste rückt dicht an den oberen Rand, damit das Spielfeld so weit wie möglich nach oben wandert. |
| **bis 560 px** | die Summary-Leiste im Settings-Screen passt nicht mehr auf eine Zeile: Theme, Spieler und Größe behalten ihre gemeinsame Zeile, „Start" rückt zentriert darunter. |
| **bis 768 px** | echtes Flow-Layout: die Bühne wird statisch, jeder Screen ist ein Flex-Container über `min-height: 100vh`. Schriftgrößen und Abstände skalieren über `clamp()`, das Spielfeld läuft als `repeat(var(--cols), 1fr)` mit `aspect-ratio`-Karten, Leisten und Button-Reihen brechen um. Das Spielfeld ist doppelt begrenzt – durch die Bildschirmbreite und durch die Höhe, die unter der Leiste übrig bleibt –, damit es nie unten aus dem Bild läuft; das 24er-Feld steht hochkant als 4 × 6 statt als 6 × 4. Die Spielleiste wird zweizeilig: oben der aktuelle Spieler links und „Exit game" rechts, darunter zentriert der Punktestand. Sie bleibt dabei eine getönte Fläche wie im Desktop-Design und ist genau so breit wie das Spielfeld, damit „Exit game" bündig mit dem rechten Rand der Karten sitzt. |
| **769 – 1439 px** | ab hier greift die Laptop-Ansicht: die feste Design-Bühne 1440 × 1024 wird per `transform: scale()` heruntergerechnet – alle Abstände bleiben pixelgenau wie im Entwurf. Skaliert wird dabei in der Breite auf 1260 px, also auf die Fläche, die das Design wirklich füllt, statt auf die 1440 px der Bühne. Nur deren leere Seitenränder laufen dadurch über den Bildschirmrand hinaus. In der Höhe bleiben die vollen 1024 px stehen – ein Beschnitt würde zwar noch etwas Größe bringen, aber der obere Rand würde mit kürzer werdendem Fenster immer knapper, und der Inhalt schiene nach oben zu wandern. |
| **ab 1440 px** | Widescreen-Breakpoint: die Inhaltsfläche behält ihre Breite und wird zentriert, der Hintergrund läuft über die gesamte Bildschirmbreite – in jedem Theme mit seiner eigenen Farbe. Der Gewinner-Screen verwendet ab hier den langen Konfettistreifen (3216 px, 22 Elemente) statt der Desktop-Variante. |

Geprüft wurde jeder Screen (Startseite, Settings, Spielfeld in allen drei
Größen, Quit-Dialog, Game over, Gewinner, Unentschieden) in allen vier Themes
bei 320, 375, 480, 560, 760, 768, 900, 1024, 1440, 2560 und 3440 px.
