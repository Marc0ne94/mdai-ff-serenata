<p align="center">
  <img src="assets/mascotte-pixel-4x.png" alt="Claude in pixel art che canta al microfono" width="327">
</p>

# serenata 🌹

Una mod per Claude Code: sopra la casella del prompt si accende un piccolo palco
in pixel art. Una band di Claude suona basso, batteria e tastiera, il Claude
cantante canta e, mentre la canzone va, una rosa cresce e sboccia.

Musica, voce e grafica sono generate dal codice di questo repository: la voce è
costruita da zero con la sintesi a formanti, senza voci di sistema.

## Installazione

Da una shell (Terminale su Mac, PowerShell su Windows):

```bash
claude plugin marketplace add Marc0ne94/mdai-serenata
```

```bash
claude plugin install serenata@serenata
```

Nell'app desktop: clicca **+** accanto alla casella del prompt, poi **Plugins**,
**Add marketplace** con `Marc0ne94/mdai-serenata`, poi **Add plugin**.

Poi chiudi e riapri Claude Code (su Mac con ⌘Q).

Finché il repository è privato, l'installazione funziona solo per chi può
leggerlo su GitHub e ha già le credenziali git per github.com su quel computer
(per esempio `gh auth login` e poi `gh auth setup-git`).

## Aggiornamento

Claude Code non riscarica il catalogo da solo: per avere l'ultima versione,

```bash
claude plugin marketplace update serenata
```

```bash
claude plugin update serenata@serenata
```

poi chiudi e riapri Claude Code.

## Come si usa

- `/serenata on` accende la band sopra il prompt, `/serenata off` la spegne (la scelta resta per le sessioni successive)
- `/canta` fa partire la canzone, e accende la band se era spenta
- nella band: **▶ Canta**, **▶ Ancora**, **■ Stop**

Il palco disegnato si vede nell'app desktop di Claude Code; nel terminale la band
è una riga con i pulsanti. L'audio usa il lettore di macOS e, su Windows, quello di sistema tramite PowerShell.

## Disinstallazione

```bash
claude plugin uninstall serenata@serenata
```

```bash
claude plugin marketplace remove serenata
```

## Com'è fatta

- `hooks/register.tsx`: la band, i comandi `/serenata` e `/canta`, la riproduzione
- `hooks/scene.ts`: il palco animato (SVG), a tempo con la canzone
- `hooks/song.ts`: i tempi di ogni sillaba, scritti da `tools/synth.mjs`
- `tools/synth.mjs`: compone e registra `audio/canzone.m4a` (Node.js, nessuna dipendenza)
- `tests/`: i test, con `claude plugin test .`

---

Progetto personale, non ufficiale e non affiliato ad Anthropic.
