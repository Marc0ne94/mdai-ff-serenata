import type { Scenery } from '../draw'
import { dropLights, inTurn, n1, random, sec } from '../draw'
import type { Song } from '../song'

// The scenery of Dimmi cos'è. On the wall a screen where the Claude looks the
// word up, and what comes back as it sings: nothing found, not a number, a
// question, chemistry, a bug; at the last line, you. Beside the singer a heart
// of pixels on a stand, empty, a question mark in it: it fills from its tip
// up while the song goes, a row every three lines, and when the last line
// answers, the question mark goes; it beats in the drops. Over the stage a
// mirror ball, whose specks of light drift across the room in the drops
// (small and slow: nothing flashes). And a heart on a stick for the singer's
// hand.

const MONO = "Menlo, 'SF Mono', monospace"
const PINK = '#ff4f86'

const DEFS = `<defs>
<clipPath id="domandaBall"><circle cx="790" cy="30" r="13"/></clipPath>
<radialGradient id="domandaGlow"><stop offset="0" stop-color="#ff7aa8" stop-opacity="0.8"/><stop offset="1" stop-color="#ff7aa8" stop-opacity="0"/></radialGradient>
</defs>`

// ---------- the screen on the wall ----------

function screen(song: Song) {
  const at = (line: number) => song.lines[Math.min(line, song.lines.length - 1)]?.start ?? 0
  const answer = (color: string) => `x="654" y="74" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="14" fill="${color}"`
  const green = answer('#7dffb0')
  // What the search gives back, each from the line that sings it.
  const found = inTurn([
    { at: 0, text: '…', attrs: green },
    { at: at(1), text: '404', attrs: green },
    { at: at(3), text: 'NaN', attrs: green },
    { at: at(4), text: '???', attrs: answer('#ffd166') },
    { at: at(8), text: 'chimica?', attrs: green },
    { at: at(9), text: 'bug?', attrs: green },
    { at: at(12), text: '…', attrs: green },
    { at: at(14), text: '???', attrs: answer('#ffd166') },
    { at: at(17), text: 'TU ♥', attrs: answer(PINK) },
  ])
  return (
    `<rect x="606" y="16" width="96" height="86" fill="#3a2a55"/><rect x="610" y="20" width="88" height="78" fill="#0d0a1a"/>` +
    `<text x="615" y="35" font-family="${MONO}" font-size="8.5" fill="#a78bfa">&gt; amore =</text>${found}` +
    `<rect x="615" y="86" width="5" height="7" fill="#7dffb0"><animate attributeName="opacity" values="1;0" dur="0.9s" calcMode="discrete" repeatCount="indefinite"/></rect>`
  )
}

// ---------- the heart beside the singer ----------

// The cells of the heart, seven wide and six high, as on the band's wall.
const HEART: readonly [number, number][] = [
  [1, 0], [2, 0], [4, 0], [5, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
  [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
  [2, 4], [3, 4], [4, 4], [3, 5],
]
const CELL = 24
const LEFT = 300 - 3.5 * CELL
const TOP = 318

// When each row of the heart fills, from the tip (row 5) up: a row every
// three lines, the top one in the last refrain.
export function fills(song: Song) {
  return [5, 4, 3, 2, 1, 0].map((row, i) => ({ row, at: song.lines[Math.min(3 * i, song.lines.length - 1)]?.start ?? 0 }))
}

function heart(song: Song) {
  const lit = dropLights(song)
  const rows = fills(song)
  let cells = ''
  for (const [x, y] of HEART) {
    const place = `x="${LEFT + x * CELL}" y="${TOP + y * CELL}" width="${CELL}" height="${CELL}"`
    cells +=
      `<rect ${place} fill="#2a1438" stroke="${PINK}" stroke-width="2"/>` +
      `<rect ${place} fill="${PINK}" opacity="0"><set attributeName="opacity" to="1" begin="${sec(rows.find(r => r.row === y)?.at ?? 0)}" fill="freeze"/></rect>`
  }
  const answered = song.lines.at(-1)?.start ?? song.outroAt
  const question = `<text x="300" y="414" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="96" fill="#fff" opacity="0.92">?<set attributeName="opacity" to="0" begin="${sec(answered)}" fill="freeze"/></text>`
  const beating = `<animateTransform attributeName="transform" type="scale" values="1;1.07;1" dur="${sec(song.beat)}" begin="${lit.on}" end="${lit.off}" repeatCount="indefinite"/>`
  const glow =
    `<circle cx="300" cy="390" r="150" fill="url(#domandaGlow)" opacity="0">` +
    `<animate attributeName="opacity" values="0.35;0.7;0.35" dur="${sec(2 * song.beat)}" begin="${lit.on}" end="${lit.off}" repeatCount="indefinite"/></circle>`
  const stand =
    `<ellipse cx="300" cy="545" rx="70" ry="6" fill="#000" opacity="0.3"/>` +
    `<rect x="296" y="${TOP + 6 * CELL}" width="8" height="${542 - TOP - 6 * CELL}" fill="#4a4a57"/><ellipse cx="300" cy="542" rx="40" ry="6" fill="#2b2b33"/>`
  return `${glow}${stand}<g transform="translate(300 390)"><g>${beating}<g transform="translate(-300 -390)">${cells}${question}</g></g></g>`
}

// ---------- the mirror ball over the stage ----------

function ball(song: Song) {
  const lit = dropLights(song)
  const r = random(307)
  const x = 790
  const y = 30
  let facets = ''
  for (let i = -2; i <= 2; i++) {
    facets +=
      `<line x1="${x - 13}" y1="${y + i * 5}" x2="${x + 13}" y2="${y + i * 5}" stroke="#7a86a8" stroke-width="0.8"/>` +
      `<line x1="${x + i * 5}" y1="${y - 13}" x2="${x + i * 5}" y2="${y + 13}" stroke="#7a86a8" stroke-width="0.8"/>`
  }
  const mirror =
    `<line x1="${x}" y1="0" x2="${x}" y2="${y - 13}" stroke="#55556a" stroke-width="1.5"/>` +
    `<g clip-path="url(#domandaBall)"><circle cx="${x}" cy="${y}" r="13" fill="#cfd6e6"/>${facets}<circle cx="${x - 4}" cy="${y - 5}" r="4" fill="#fff" opacity="0.7"/></g>`
  const colors = ['#ffffff', '#ff9ad5', '#9ffcff', '#ffd166']
  let specks = ''
  for (let i = 0; i < 16; i++) {
    specks +=
      `<rect x="${n1(40 + r() * 1000)}" y="${n1(20 + r() * 190)}" width="3" height="3" fill="${colors[i % colors.length]}">` +
      `<animateTransform attributeName="transform" type="translate" values="0 0;${n1(30 + r() * 40)} ${n1((r() - 0.5) * 10)};0 0" dur="${sec(8 * song.beat)}" begin="${sec(r() * 2)}" repeatCount="indefinite"/></rect>`
  }
  return `${mirror}<g opacity="0"><set attributeName="opacity" to="0.75" begin="${lit.on}" end="${lit.off}"/>${specks}</g>`
}

// ---------- a heart on a stick for the singer's hand ----------

const LOLLY = [
  '.........',
  '.........',
  '.........',
  '.RH...RR.',
  '.RRR.RRR.',
  '.RRRRRRR.',
  '..RRRRR..',
  '...RRR...',
  '....R....',
  '....S....',
  '....S....',
  '....S....',
  '....S....',
  '.........',
  '.........',
]
const LOLLY_COLORS: Record<string, string> = { R: PINK, H: '#ffb3cd', S: '#f4f1ea' }

export const DOMANDA: Scenery = {
  neon: ["DIMMI COS'È", 'SEI TU ♥'],
  defs: DEFS,
  wall: screen,
  prop: heart,
  overlay: ball,
  gadget: { pixels: LOLLY, colors: LOLLY_COLORS },
}
