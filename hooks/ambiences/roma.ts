import type { Ambience } from '../draw'
import { box, HEIGHT, n1, random, WIDTH } from '../draw'
import type { Song } from '../song'

// The Roman ambience, for the Roma album: the dining room of a house in
// Pompeii, at night. Walls in Pompeian red over a black dado, panels framed in
// ochre, garlands of leaves hung in swags, pilasters of white marble and
// bronze oil lamps on chains; a stone floor with a black and white mosaic
// along its edge; gold and red light, a red sign; the Claudes in a legionary's
// helmet with a red crest, playing the cornu, the tympanum and the hydraulis.

const OCHRE = '#c9973f'

const DEFS = `<defs>
<linearGradient id="romaWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b0f0d"/><stop offset="1" stop-color="#6b1d17"/></linearGradient>
<linearGradient id="romaFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3a33"/><stop offset="1" stop-color="#1e1513"/></linearGradient>
<linearGradient id="romaMarble" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a59c90"/><stop offset="0.5" stop-color="#e8e0d2"/><stop offset="1" stop-color="#958c80"/></linearGradient>
<radialGradient id="romaLamp"><stop offset="0" stop-color="#ffc06a" stop-opacity="0.55"/><stop offset="1" stop-color="#ffc06a" stop-opacity="0"/></radialGradient>
<linearGradient id="romaBeamGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.5"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></linearGradient>
<linearGradient id="romaBeamRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7a55" stop-opacity="0.5"/><stop offset="1" stop-color="#ff7a55" stop-opacity="0"/></linearGradient>
<pattern id="romaTeeth" width="10" height="10" patternUnits="userSpaceOnUse"><rect y="3" width="6" height="6" fill="${OCHRE}"/></pattern>
<pattern id="romaMosaic" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#e8e0d2"/><rect width="4" height="4" fill="#1a1412"/><rect x="4" y="4" width="4" height="4" fill="#1a1412"/></pattern>
</defs>`

// Where the pilasters stand and the lamps hang along the wall, clear of the
// window; the panels painted between the pilasters, and the garlands hung
// from pilaster to lamp to pilaster.
const PILASTERS = [150, 470, 620, 930]
const LAMPS = [330, 800]
const PANELS: [number, number][] = [[168, 452], [488, 602], [638, 912]]
const SWAGS: [number, number][] = [[162, 328], [332, 458], [482, 608], [632, 798], [802, 918]]

// A pilaster of marble: a slab, a capital with a scroll at each side, a
// fluted shaft, a base.
function pilaster(x: number) {
  const w = 22
  let flutes = ''
  for (let i = 1; i < 4; i++) flutes += box(x - w / 2 + i * (w / 4), 30, 0.8, 112, '#8a8176', ' opacity="0.6"')
  return (
    `<rect x="${x - w / 2 - 5}" y="16" width="${w + 10}" height="5" fill="#d8d0c2"/>` +
    `<rect x="${x - w / 2 - 2}" y="21" width="${w + 4}" height="7" fill="#c5bcae"/>` +
    `<circle cx="${x - w / 2 - 1}" cy="25" r="3.2" fill="#e8e0d2"/><circle cx="${x + w / 2 + 1}" cy="25" r="3.2" fill="#e8e0d2"/>` +
    `<rect x="${x - w / 2}" y="28" width="${w}" height="116" fill="url(#romaMarble)"/>${flutes}` +
    `<rect x="${x - w / 2 - 4}" y="144" width="${w + 8}" height="6" fill="#c5bcae"/>`
  )
}

// An oil lamp of bronze on its chain: a ring to hold it, a spout where the
// flame flickers, its glow.
function lamp(x: number, r: () => number) {
  const y = 58
  const flicker = `<animateTransform attributeName="transform" type="scale" values="1 1;1.1 0.88;0.92 1.12;1 1" dur="${n1(0.5 + r() * 0.3)}s" repeatCount="indefinite"/>`
  return (
    `<circle cx="${x + 9}" cy="${y - 8}" r="36" fill="url(#romaLamp)"><animate attributeName="opacity" values="0.8;1;0.7;0.9" dur="${n1(1.4 + r() * 0.6)}s" repeatCount="indefinite"/></circle>` +
    `<line x1="${x}" y1="14" x2="${x}" y2="${y - 4}" stroke="#8a6a2a" stroke-width="1" stroke-dasharray="2 1.5"/>` +
    `<path d="M ${x - 9} ${y} Q ${x - 9} ${y - 5} ${x - 2} ${y - 5} L ${x + 5} ${y - 5} L ${x + 12} ${y - 2} L ${x + 12} ${y} Q ${x + 2} ${y + 6} ${x - 9} ${y} Z" fill="#b8893a"/>` +
    `<circle cx="${x - 10}" cy="${y - 3}" r="2.6" fill="none" stroke="#b8893a" stroke-width="1.4"/>` +
    `<g transform="translate(${x + 11} ${y - 2})"><g>${flicker}` +
    `<path d="M 0 0 C -4 -3 -2.5 -8 0 -12 C 2.5 -8 4 -3 0 0 Z" fill="#ff8a3c"/><path d="M 0 0 C -2 -2 -1.2 -5 0 -7.5 C 1.2 -5 2 -2 0 0 Z" fill="#ffe08a"/></g></g>`
  )
}

function room(_: Song, wall: (r: () => number) => string) {
  const r = random(17)
  // The scenery's wall draws first, as in the club.
  const window = wall(r)
  const panels = PANELS.map(([a, b]) => `<rect x="${a}" y="36" width="${b - a}" height="74" fill="#000" fill-opacity="0.14" stroke="${OCHRE}" stroke-width="1.2" stroke-opacity="0.55"/>`).join('')
  const swags = SWAGS.map(([a, b]) => {
    const curve = `M ${a} 16 Q ${(a + b) / 2} ${n1(26 + (b - a) / 14)} ${b} 16`
    return (
      `<path d="${curve}" fill="none" stroke="#4f7a34" stroke-width="3.4"/><path d="${curve}" fill="none" stroke="#86b05a" stroke-width="1.2" stroke-dasharray="3 4"/>` +
      box(a - 1.5, 14, 3, 5, '#c8372d') + box(b - 1.5, 14, 3, 5, '#c8372d')
    )
  }).join('')
  const pixelHeart = [
    [1, 0], [2, 0], [4, 0], [5, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
    [2, 4], [3, 4], [4, 4], [3, 5],
  ]
    .map(([x, y]) => box(52 + (x ?? 0) * 5, 34 + (y ?? 0) * 5, 5, 5, '#e0452f'))
    .join('')
  return (
    `<rect width="${WIDTH}" height="150" fill="url(#romaWall)"/>${panels}` +
    `<rect y="120" width="${WIDTH}" height="30" fill="#160b0a" opacity="0.85"/><rect y="119" width="${WIDTH}" height="1.2" fill="${OCHRE}" opacity="0.6"/>` +
    `<rect y="2" width="${WIDTH}" height="10" fill="url(#romaTeeth)" opacity="0.8"/><rect y="13" width="${WIDTH}" height="1.5" fill="${OCHRE}" opacity="0.6"/>` +
    PILASTERS.map(pilaster).join('') +
    `\n<g transform="translate(${WIDTH - 720} 0)">${window}</g>\n` +
    swags +
    LAMPS.map(x => lamp(x, r)).join('') +
    `<text x="16" y="24.5" font-family="Menlo, 'SF Mono', monospace" font-weight="700" font-size="11" letter-spacing="1.5" fill="#ffe2b0" filter="url(#neon)">M2V-MDO</text>` +
    `<rect x="44" y="26" width="51" height="46" fill="#2a100e" stroke="${OCHRE}" stroke-width="3"/>${pixelHeart}` +
    `<rect y="150" width="${WIDTH}" height="${HEIGHT - 150}" fill="url(#romaFloor)"/><rect y="153" width="${WIDTH}" height="8" fill="url(#romaMosaic)" opacity="0.5"/><rect y="150" width="${WIDTH}" height="2" fill="#8a6a4a"/>`
  )
}

// A legionary's helmet, in a Claude's own cells: a bronze cap over the brow,
// a guard at each cheek, and across it a centurion's crest, a red fan higher
// in the middle, lighter at its tips.
const BRONZE = '#c9a24a'
const CROWN =
  box(-0.3, -0.7, 8.6, 0.9, BRONZE) + box(-0.3, 0.2, 0.8, 1.6, BRONZE) + box(7.5, 0.2, 0.8, 1.6, BRONZE) +
  box(0.4, -1.7, 7.2, 1, '#c8372d') + box(1.4, -2.3, 5.2, 0.6, '#c8372d') +
  box(0.4, -2, 1, 0.3, '#ff6a55') + box(6.6, -2, 1, 0.3, '#ff6a55') + box(1.4, -2.6, 5.2, 0.3, '#ff6a55')

export const ROMA: Ambience = {
  defs: DEFS,
  room,
  beams: ['romaBeamGold', 'romaBeamRed'],
  sign: { fill: '#fff0d8', stroke: '#d8452f' },
  crown: CROWN,
  instruments: 'romana',
  // The drummer's platform in the red of the walls, edged in ochre.
  riser: { fill: '#4a1c18', edge: OCHRE },
}
