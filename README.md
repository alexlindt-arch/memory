# Memory

Ein Memory-Kartenspiel für zwei Spieler am selben Rechner. Vier Themes, drei
Spielfeldgrößen, Punktezählung mit Spielerwechsel und ein eigener
Gewinner-Screen. Geschrieben in TypeScript und SCSS, gebaut mit Vite – ohne
Framework und ohne Laufzeit-Abhängigkeiten.

**[▶ Jetzt spielen](https://alexander-lindt.developerakademie.net/Memory/)**

![Spielfeld im Theme „Code vibes“](docs/screenshot-game.png)

## Wie es sich spielt

Zwei Spieler decken abwechselnd je zwei Karten auf. Ein Paar gibt einen Punkt,
und derselbe Spieler ist erneut am Zug. Passt es nicht, drehen sich die Karten
nach 1,4 Sekunden wieder um und der andere Spieler kommt dran. Sind alle Paare
gefunden, erscheint der Endstand und danach der Gewinner.

## Vier Themes

Jedes Theme bringt seine eigene Schrift, sein Farbschema, seine
Kartenrückseite und einen eigenen Satz von 18 Motiven mit – die Auswahl ändert
also nicht nur das Aussehen, sondern auch, worum es auf den Karten geht.

![Die vier Themes: Code vibes, Gaming, DA Projects, Foods](docs/screenshot-themes.png)

Von oben links: **Code vibes** (Entwickler-Werkzeuge), **Gaming**
(Spieleklassiker), **DA Projects** (Projekte der Developer Akademie), **Foods**
(Essen).

## Vor dem Start

Auf dem Einstellungs-Screen werden Theme, Spielerfarbe und Spielfeldgröße
gewählt. Die Vorschau rechts zeigt dabei sofort, wie das gewählte Theme
aussieht – wer mit der Maus über eine Theme-Zeile fährt, sieht dessen
Gestaltung schon, bevor er klickt.

![Startseite und Einstellungen](docs/screenshot-start.png)

## Am Ende

![Gewinner-Screen mit Konfetti](docs/screenshot-winner.png)

Erst der Endstand als eigener „Game over"-Screen, dann der Gewinner mit Namen
und Spielfigur in seiner Farbe. Ein Klick überspringt die Wartezeit dazwischen.
Ein Unentschieden wird eigens behandelt und bekommt statt der Spielfigur eine
Waage.

## Funktionen im Überblick

| | |
|---|---|
| **Spieler** | Zwei – Blau und Orange; die Wahl bestimmt, wer beginnt |
| **Spielfeldgrößen** | 16 (4×4), 24 (6×4) und 36 (6×6) Karten |
| **Themes** | Vier, je mit eigener Schrift, Farbwelt und Motivsatz |
| **Kartenanimation** | 3D-Flip über 0,55 s |
| **Rundenende** | Endstand, danach Gewinner-Screen mit Konfetti |
| **Neue Runde** | „Play again" startet sofort neu, „Back to start" führt zurück |
| **Abbrechen** | „Exit game" fragt in einem Dialog nach, bevor es die Runde verwirft |
| **Bedienung** | Alles sind echte `<button>`-Elemente, also auch per Tastatur bedienbar |
| **Bildschirmgrößen** | Von 320 px bis 2560 px vollständig bedienbar |

## Loslegen

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
src/settings.ts         Einstellungen: Auswahl, Vorschau, Zusammenfassung
src/board.ts            Deck-Erzeugung (Fisher-Yates) und Karten-DOM
src/game.ts             Aufdecken, Paarprüfung, Punkte, Spielerwechsel
src/end.ts              Game-over-Screen, Gewinner-Anzeige, Konfetti
src/styles/style.scss   Haupt-Stylesheet, bindet die Partials ein
src/styles/_*.scss      Ein Partial je Screen + Variablen und Theme-Tokens
public/                 75 Grafiken und Favicon, werden 1:1 übernommen
vite.config.ts          base: '/Memory/' – das Projekt liegt im Unterordner
tsconfig.json           strict: true
```

Die fünf Screens – Startseite, Einstellungen, Spielfeld, „Game over" und
Gewinner – liegen alle im selben Dokument und werden über `hidden` ein- und
ausgeblendet. Einen Reload gibt es nie.

## Technische Entscheidungen

### TypeScript

`strict: true`, und der Build bricht bei jedem Typfehler ab. Statt loser
Strings beschreiben eigene Typen, was erlaubt ist – `PlayerId` ist
`'blue' | 'orange'`, `BoardSize` ist `16 | 24 | 36`. Ein Tippfehler in einer
Theme-Id fällt dadurch beim Bauen auf und nicht erst im Browser.

Zwei Stellen brauchten eine eigene Lösung, weil sich die Module sonst
gegenseitig importiert hätten: Das Spielfeld reicht Klicks über einen Callback
(`FlipHandler`) nach oben weiter, statt die Rundenlogik zu importieren, und das
Screen-Routing liegt in `screens.ts` statt im Einstiegspunkt.

`document.getElementById` liefert `HTMLElement | null`. Unter `strict` bräuchte
jeder einzelne Zugriff eine Null-Prüfung, deshalb übernimmt `byId()` aus
`dom.ts` das einmal zentral und wirft bei einer fehlenden Id einen Fehler – ein
Tippfehler im Markup soll auffallen, nicht stillschweigend übergangen werden.

### SCSS

`style.scss` bindet je ein Partial pro Screen ein (`_home`, `_settings`,
`_board` …), dazu `_themes` mit den Farb-Tokens und `_responsive` mit den Media
Queries. Maße und Breakpoints stehen einmal in `_variables.scss`, statt eine
Breakpoint-Zahl über neun Media Queries zu verstreuen.

Die Themes sind reine CSS-Variablen an `body[data-theme]`. Ein Theme zu
wechseln heißt also, ein Attribut zu setzen – kein Neuaufbau, kein Nachladen.
Die Vorschau auf dem Einstellungs-Screen trägt ihr Theme aus demselben Grund
selbst, damit sie ein Theme zeigen kann, das noch gar nicht gewählt ist.

### Grafiken

Alle 75 Bilder liegen unverändert in `public/` und werden beim Build 1:1 nach
`dist/` übernommen. Fehlt eine Datei, zeigt die Karte automatisch ein passendes
Symbol als Fallback – das Spiel bleibt in jedem Fall spielbar.

## Verhalten auf verschiedenen Bildschirmen

Das Spiel ist auf jeder Breite von 320 px bis 2560 px vollständig bedienbar.
Von unten nach oben greifen diese Bereiche ineinander:

| Bereich | Verhalten |
|---|---|
| **bis 400 px** | Engere Abstände überall, und die Spielleiste rückt dicht an den oberen Rand, damit das Spielfeld so viel Platz wie möglich bekommt. |
| **bis 560 px** | Die Zusammenfassung im Einstellungs-Screen passt nicht mehr auf eine Zeile: Theme, Spieler und Größe behalten ihre gemeinsame Zeile, „Start" rückt zentriert darunter. |
| **bis 768 px** | Echtes Flow-Layout: Die Bühne wird statisch, jeder Screen ist ein Flex-Container über `min-height: 100vh`. Schriftgrößen und Abstände skalieren über `clamp()`, das Spielfeld läuft als `repeat(var(--cols), 1fr)` mit `aspect-ratio`-Karten. Das Spielfeld ist doppelt begrenzt – durch die Bildschirmbreite und durch die Höhe, die unter der Leiste übrig bleibt –, damit es nie unten aus dem Bild läuft; das 24er-Feld steht hochkant als 4 × 6 statt als 6 × 4. Die Spielleiste wird zweizeilig und läuft als Fläche über die volle Breite, ihr Inhalt bleibt auf der Breite des Spielfelds. |
| **769 – 1439 px** | Die feste Design-Bühne 1440 × 1024 wird per `transform: scale()` heruntergerechnet – alle Abstände bleiben pixelgenau wie im Entwurf. Skaliert wird in der Breite auf 1260 px, also auf die Fläche, die das Design wirklich füllt; nur die leeren Seitenränder laufen über den Bildschirmrand hinaus. In der Höhe bleiben die vollen 1024 px stehen, sonst würde der obere Rand mit kürzer werdendem Fenster immer knapper und der Inhalt schiene nach oben zu wandern. |
| **ab 1440 px** | Die Inhaltsfläche behält ihre Breite und wird zentriert, der Hintergrund läuft über die gesamte Bildschirmbreite – in jedem Theme mit seiner eigenen Farbe. Der Gewinner-Screen verwendet ab hier den langen Konfettistreifen (3216 px, 22 Elemente) statt der kürzeren Variante. |

Geprüft wurde jeder Screen (Startseite, Einstellungen, Spielfeld in allen drei
Größen, Quit-Dialog, Game over, Gewinner, Unentschieden) in allen vier Themes
bei 320, 375, 480, 560, 760, 768, 900, 1024, 1440, 2560 und 3440 px.

## Code-Konventionen

HTML, SCSS und TypeScript liegen in getrennten Dateien. Keine Inline-Styles,
keine Inline-Event-Handler. Jede Funktion hat einen JSDoc-Block, bleibt unter
15 Zeilen und hat genau eine Aufgabe. Namen in camelCase, Konstanten in
UPPER_SNAKE_CASE, semantische Elemente und `alt`-Attribute durchgängig.
