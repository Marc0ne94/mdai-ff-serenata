import type { Ambience } from '../draw'
import { box, HEIGHT, n1, random, WIDTH } from '../draw'
import type { Song } from '../song'

// The ancient ambience, for the Odissea album: a stone temple at night, with
// a meander frieze, Doric columns and torches; golden light and a golden sign;
// the Claudes crowned with laurel, playing kithara, frame drum and aulos.

const DEFS = `<defs>
<linearGradient id="anticoWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#17121d"/><stop offset="1" stop-color="#2c2131"/></linearGradient>
<linearGradient id="anticoFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d3242"/><stop offset="1" stop-color="#1c1621"/></linearGradient>
<linearGradient id="anticoColumn" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6e6474"/><stop offset="0.5" stop-color="#9a8f9e"/><stop offset="1" stop-color="#5d5462"/></linearGradient>
<radialGradient id="anticoTorch"><stop offset="0" stop-color="#ffb35c" stop-opacity="0.55"/><stop offset="1" stop-color="#ffb35c" stop-opacity="0"/></radialGradient>
<linearGradient id="anticoBeamGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.5"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></linearGradient>
<linearGradient id="anticoBeamAmber" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a3c" stop-opacity="0.5"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></linearGradient>
<pattern id="anticoKey" width="20" height="10" patternUnits="userSpaceOnUse"><path d="M 0 9 H 8 V 1 H 2 V 6 H 5 V 4 M 10 9 H 18 V 1 H 12 V 6 H 15 V 4" stroke="#b8893a" stroke-width="1.2" fill="none"/></pattern>
</defs>`

// Where the columns and the torches stand along the wall, clear of the window.
const COLUMNS = [150, 470, 620, 930]
const TORCHES = [330, 800]

function column(x: number) {
  const w = 26
  let flutes = ''
  for (let i = 1; i < 5; i++) flutes += box(x - w / 2 + i * (w / 5), 34, 0.8, 110, '#4d4552', ' opacity="0.6"')
  return (
    `<rect x="${x - w / 2 - 6}" y="18" width="${w + 12}" height="6" fill="#8a8090"/>` +
    `<path d="M ${x - w / 2 - 3} 24 L ${x + w / 2 + 3} 24 L ${x + w / 2} 32 L ${x - w / 2} 32 Z" fill="#7b7180"/>` +
    `<rect x="${x - w / 2}" y="32" width="${w}" height="112" fill="url(#anticoColumn)"/>${flutes}` +
    `<rect x="${x - w / 2 - 4}" y="144" width="${w + 8}" height="6" fill="#7b7180"/>`
  )
}

// A torch on the wall: a bracket, a bowl, a flame that flickers, its glow.
function torch(x: number, r: () => number) {
  const y = 62
  const flicker = (dur: number, values: string) =>
    `<animateTransform attributeName="transform" type="scale" values="${values}" dur="${n1(dur)}s" repeatCount="indefinite"/>`
  return (
    `<circle cx="${x}" cy="${y - 8}" r="38" fill="url(#anticoTorch)"><animate attributeName="opacity" values="0.8;1;0.7;0.9" dur="${n1(1.4 + r() * 0.6)}s" repeatCount="indefinite"/></circle>` +
    `<rect x="${x - 1.5}" y="${y + 4}" width="3" height="16" fill="#4a3424"/><path d="M ${x - 8} ${y} L ${x + 8} ${y} L ${x + 5} ${y + 6} L ${x - 5} ${y + 6} Z" fill="#8a5a2b"/>` +
    `<g transform="translate(${x} ${y})"><g>${flicker(0.5 + r() * 0.3, '1 1;1.1 0.88;0.92 1.12;1 1')}` +
    `<path d="M 0 0 C -7 -4 -4 -12 0 -20 C 4 -12 7 -4 0 0 Z" fill="#ff7b39"/><path d="M 0 0 C -4 -3 -2 -8 0 -13 C 2 -8 4 -3 0 0 Z" fill="#ffd166"/></g></g>`
  )
}

function room(_: Song, wall: (r: () => number) => string) {
  const r = random(7)
  const window = wall(r)
  let blocks = ''
  for (let row = 0; row < 6; row++) {
    const y = 24 + row * 21
    blocks += box(0, y, WIDTH, 0.8, '#000', ' opacity="0.25"')
    for (let x = row % 2 ? 30 : 0; x < WIDTH; x += 60) blocks += box(x, y, 0.8, 21, '#000', ' opacity="0.2"')
  }
  const pixelHeart = [
    [1, 0], [2, 0], [4, 0], [5, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
    [2, 4], [3, 4], [4, 4], [3, 5],
  ]
    .map(([x, y]) => box(52 + (x ?? 0) * 5, 34 + (y ?? 0) * 5, 5, 5, '#d8693a'))
    .join('')
  let tiles = ''
  for (let x = 0; x < WIDTH; x += 80) tiles += box(x, 150, 0.8, HEIGHT - 150, '#000', ' opacity="0.18"')
  return (
    `<rect width="${WIDTH}" height="150" fill="url(#anticoWall)"/>${blocks}` +
    `<rect y="2" width="${WIDTH}" height="10" fill="url(#anticoKey)" opacity="0.8"/><rect y="13" width="${WIDTH}" height="1.5" fill="#b8893a" opacity="0.6"/>` +
    COLUMNS.map(column).join('') +
    `\n<g transform="translate(${WIDTH - 720} 0)">${window}</g>\n` +
    TORCHES.map(x => torch(x, r)).join('') +
    `<text x="16" y="24.5" font-family="Menlo, 'SF Mono', monospace" font-weight="700" font-size="11" letter-spacing="1.5" fill="#ffe2b0" filter="url(#neon)">M2V-MDO</text>` +
    `<rect x="44" y="26" width="51" height="46" fill="#2a2030" stroke="#b8893a" stroke-width="3"/>${pixelHeart}` +
    `<rect y="150" width="${WIDTH}" height="${HEIGHT - 150}" fill="url(#anticoFloor)"/>${tiles}<rect y="150" width="${WIDTH}" height="2" fill="#7b6a80"/>`
  )
}

// A laurel crown, in a Claude's own cells: leaves rising to the front on each
// side of a golden band.
const LEAF = ['#6f9a3f', '#8fbf55']
const CROWN =
  box(0, -0.25, 8, 0.25, '#c9a24a') +
  [[-0.2, -0.55], [0.9, -0.85], [2.0, -1.1]]
    .map(([x, y], i) => box(x ?? 0, y ?? 0, 1.2, 0.6, LEAF[i % 2] ?? '') + box(8 - (x ?? 0) - 1.2, y ?? 0, 1.2, 0.6, LEAF[i % 2] ?? ''))
    .join('')

export const ANTICO: Ambience = {
  defs: DEFS,
  room,
  beams: ['anticoBeamGold', 'anticoBeamAmber'],
  sign: { fill: '#ffeec2', stroke: '#d4a24c' },
  crown: CROWN,
  instruments: 'antica',
}
