# Memory – Settings (Code vibes)

1:1-Umsetzung des Claude-Design-Screens **`Memory Settings Code Vibes.dc.html`**
als eigenstaendige HTML-Seite.

## Inhalt

```
index.html                 Der Screen (Canvas 1440 × 1024, Inline-Styles wie im Design)
js/settings.js             Zustandslogik: Spieler-/Board-Auswahl + Start-Button-Zustaende
assets/card-code-git.png   Karten-Motiv aus dem Design-Projekt (unveraendert)
```

## Interaktion

| Element | Verhalten |
|---|---|
| Choose player – Blue / Orange | Radio-Punkt faerbt sich `#097FC5` bzw. `#EA6900` |
| Board size – 16 / 24 / 36 cards | Radio-Punkt faerbt sich `#303131` |
| Start | Inaktiv (`#D9D9D9` / `#AFAFAF`, `not-allowed`), bis Spieler **und** Groesse gewaehlt sind. Danach `#F0EA6E` / `#303131`, beim Hover `scale(1.06)` und Icon-Rotation `-10deg` |

## Design-Referenz

- Fonts: Almarai (400/700), Red Rose (400/700) via Google Fonts
- Farben: `#303131`, `#F0EA6E`, `#DA1EBA`, `#1AE5BE`, `#0635C9`, Karten-Verlauf `#4DD5BC → #286F62`
- Board-Preview: Gradient-Rueckseite (`-6deg`) + Git-Karte (`9deg`)

Die Links zu den anderen Themes und zu den Board-Screens sind inert (`href="#"`),
da nur dieser eine Screen zum Repo gehoert.

## Lokal oeffnen

`index.html` im Browser oeffnen – keine Build-Schritte, keine Abhaengigkeiten.
