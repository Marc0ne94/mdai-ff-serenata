import type { Scenery } from '../draw'
import { dropLights, n1, sec } from '../draw'
import type { Song } from '../song'

// The scenery of «SAP in ogni casa». On the wall a screen of tiles, the
// house's own apps: SPESA, BUCATO, MUTUO and PAGHETTA, dark until a line sings
// of them (the shopping, the washing machine's workflow, the mortgage, the
// pocket money), then lit for good. Beside the singer a house, «SAP» on its
// roof, lit in the drops while its windows light up on the beat; smoke from
// the chimney all along, and at the door a box of milk, delivered when the
// fridge runs its MRP. A house key for the singer's hand.

const DEFS = `<defs>
<radialGradient id="casaGlow"><stop offset="0" stop-color="#4fa3ff" stop-opacity="0.5"/><stop offset="1" stop-color="#4fa3ff" stop-opacity="0"/></radialGradient>
</defs>`

const MONO = "Menlo, 'SF Mono', monospace"
const GOLD = '#ffd166'

// When a line that holds `word` starts, or undefined.
function sungAt(song: Song, word: string) {
  return song.lines.find(line => line.syls.map(s => s.text).join('').toLowerCase().includes(word))?.start
}

// ---------- the house's apps on the wall ----------

const TILES = [
  { label: 'SPESA', word: 'spesa', x: 612, y: 36 },
  { label: 'BUCATO', word: 'workflow', x: 656, y: 36 },
  { label: 'MUTUO', word: 'mutuo', x: 612, y: 68 },
  { label: 'PAGHETTA', word: 'payroll', x: 656, y: 68 },
] as const

function tiles(song: Song) {
  const drawn = TILES.map(({ label, word, x, y }) => {
    const at = sungAt(song, word)
    const lit = (to: string) => (at === undefined ? '' : `<set attributeName="fill" to="${to}" begin="${sec(at)}" fill="freeze"/>`)
    return (
      `<rect x="${x}" y="${y}" width="40" height="28" rx="2" fill="#1b2b4a" stroke="#3a5a8a" stroke-width="1">${lit('#1e6fd9')}</rect>` +
      `<text x="${x + 20}" y="${y + 17}" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="${label.length > 6 ? 5.5 : 6.5}" fill="#6f86a8">${label}${lit('#ffffff')}</text>`
    )
  }).join('')
  return (
    `<rect x="606" y="16" width="96" height="86" fill="#2a2d36"/><rect x="610" y="20" width="88" height="78" fill="#0e1626"/>` +
    `<rect x="610" y="20" width="88" height="11" fill="#1e6fd9"/><text x="614" y="28.5" font-family="${MONO}" font-weight="700" font-size="7" fill="#ffffff">HOME</text>${drawn}`
  )
}

// ---------- the house ----------

function house(song: Song) {
  const lit = dropLights(song)
  const lights = (on: string, off: string) => `<set attributeName="fill" to="${on}" begin="${lit.on}"/><set attributeName="fill" to="${off}" begin="${lit.off}"/>`
  const glow =
    `<circle cx="300" cy="420" r="160" fill="url(#casaGlow)" opacity="0">` +
    `<set attributeName="opacity" to="0.8" begin="${lit.on}"/><set attributeName="opacity" to="0" begin="${lit.off}"/></circle>`
  // Smoke from the chimney, slow puffs all along.
  const smoke = [0, 1, 2]
    .map(
      k =>
        `<circle cx="383" cy="314" r="9" fill="#d8d0e0" opacity="0">` +
        `<animateTransform attributeName="transform" type="translate" values="0 0;10 -40;22 -80" dur="4.5s" begin="${n1(k * 1.5)}s" repeatCount="indefinite"/>` +
        `<animate attributeName="opacity" values="0;0.6;0" dur="4.5s" begin="${n1(k * 1.5)}s" repeatCount="indefinite"/></circle>`,
    )
    .join('')
  // A window, lit on the beat in the drops.
  const window = (x: number) =>
    `<rect x="${x}" y="425" width="55" height="45" fill="#1b2b4a">` +
    `<animate attributeName="fill" values="#4fa3ff;#1e6fd9" dur="${sec(song.beat)}" begin="${lit.on}" end="${lit.off}" calcMode="discrete" repeatCount="indefinite"/></rect>` +
    `<rect x="${x + 26}" y="425" width="3" height="45" fill="#7a4a30"/><rect x="${x}" y="446" width="55" height="3" fill="#7a4a30"/>` +
    `<rect x="${x - 3}" y="422" width="61" height="51" fill="none" stroke="#7a4a30" stroke-width="4"/>`
  // The box of milk at the door, when the fridge runs its MRP.
  const mrp = sungAt(song, 'mrp')
  const milk =
    mrp === undefined
      ? ''
      : `<g transform="translate(348 545)"><g transform="scale(0)">` +
        `<animateTransform attributeName="transform" type="scale" values="0;1.2;1" dur="0.5s" begin="${sec(mrp + 2 * song.beat)}" fill="freeze"/>` +
        `<rect x="0" y="-32" width="40" height="32" fill="#e8d3a8" stroke="#b89a6a" stroke-width="2"/>` +
        `<text x="20" y="-12" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="9" fill="#5a3a24">LATTE</text></g></g>`
  return (
    `${glow}<ellipse cx="300" cy="545" rx="170" ry="6" fill="#000" opacity="0.3"/>` +
    `${smoke}<rect x="370" y="320" width="26" height="60" fill="#6a3328"/>` +
    `<rect x="180" y="400" width="240" height="145" fill="#c98b5a"/>` +
    `<polygon points="160,402 300,305 440,402" fill="#7a3b2e"/>` +
    `<text x="300" y="388" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="30" fill="#3a1e18">SAP${lights(GOLD, '#3a1e18')}</text>` +
    `${window(205)}${window(340)}` +
    `<rect x="278" y="470" width="44" height="75" fill="#5a3a24"/><circle cx="313" cy="510" r="3" fill="${GOLD}"/>${milk}`
  )
}

// ---------- the house key for the singer's hand ----------

const KEY = [
  '.........',
  '...GGG...',
  '..G...G..',
  '..G...G..',
  '...GGG...',
  '....G....',
  '....G....',
  '....GG...',
  '....G....',
  '....GG...',
  '....G....',
  '....G....',
  '.........',
  '.........',
  '.........',
]
const KEY_COLORS: Record<string, string> = { G: GOLD }

export const CASA: Scenery = {
  neon: ['SAP IN OGNI CASA', 'SAP AT HOME'],
  defs: DEFS,
  wall: tiles,
  prop: house,
  gadget: { pixels: KEY, colors: KEY_COLORS },
}
