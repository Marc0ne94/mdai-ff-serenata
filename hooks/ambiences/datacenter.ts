import type { Ambience } from '../draw'
import { box, HEIGHT, n1, random, WIDTH } from '../draw'
import type { Song } from '../song'

// The data-center ambience, for the HANA album: a server room at night, racks
// along the walls with their lights blinking, cable trays above, a raised floor
// of tiles; blue and teal light, a teal sign; the Claudes in operator headsets,
// playing the band's own instruments.

const DEFS = `<defs>
<linearGradient id="datacenterWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1220"/><stop offset="1" stop-color="#16213a"/></linearGradient>
<linearGradient id="datacenterFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e2a40"/><stop offset="1" stop-color="#0e1524"/></linearGradient>
<linearGradient id="datacenterBeamTeal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2ee6c0" stop-opacity="0.45"/><stop offset="1" stop-color="#2ee6c0" stop-opacity="0"/></linearGradient>
<linearGradient id="datacenterBeamBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f8dff" stop-opacity="0.45"/><stop offset="1" stop-color="#4f8dff" stop-opacity="0"/></linearGradient>
</defs>`

// Where the racks stand along the wall, clear of the window and the heart.
const RACKS = [130, 330, 470, 610, 760]
const RACK_W = 56

// A rack: a dark cabinet of servers, each with lights blinking at its own pace.
function rack(x: number, r: () => number) {
  let units = ''
  for (let y = 44; y < 140; y += 9) {
    units += box(x + 4, y, RACK_W - 8, 7, '#1c2638') + box(x + 6, y + 2, 20, 1, '#2c3a52')
    for (let i = 0; i < 3; i++) {
      const color = r() < 0.7 ? '#2ee6c0' : r() < 0.5 ? '#ffd166' : '#4f8dff'
      units += `<rect x="${x + RACK_W - 18 + i * 5}" y="${y + 2.5}" width="2" height="2" fill="${color}"><animate attributeName="opacity" values="1;0.2;1" dur="${n1(0.5 + r() * 1.6)}s" begin="${n1(r() * 1.5)}s" repeatCount="indefinite"/></rect>`
    }
  }
  return `<rect x="${x}" y="38" width="${RACK_W}" height="112" rx="2" fill="#111a2b" stroke="#2a3850" stroke-width="2"/>${units}`
}

function room(_: Song, wall: (r: () => number) => string) {
  const r = random(7)
  const window = wall(r)
  // The cable trays along the top, the cables hanging down to the racks.
  let cables = ''
  for (const x of RACKS) {
    for (let i = 0; i < 3; i++) {
      const cx = x + 12 + i * 14
      cables += `<path d="M ${cx} 22 Q ${cx + 4} 30 ${cx} 38" stroke="${['#2ee6c0', '#4f8dff', '#ffd166'][i]}" stroke-width="1.4" fill="none" opacity="0.7"/>`
    }
  }
  const pixelHeart = [
    [1, 0], [2, 0], [4, 0], [5, 0], [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
    [2, 4], [3, 4], [4, 4], [3, 5],
  ]
    .map(([x, y]) => box(52 + (x ?? 0) * 5, 34 + (y ?? 0) * 5, 5, 5, '#d81b4f'))
    .join('')
  // The raised floor: tiles, some of them perforated.
  let tiles = ''
  for (let x = 0; x < WIDTH; x += 60) tiles += box(x, 150, 0.8, HEIGHT - 150, '#4f8dff', ' opacity="0.18"')
  tiles += box(0, 186, WIDTH, 0.8, '#4f8dff', ' opacity="0.18"')
  for (let x = 30; x < WIDTH; x += 240) {
    for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) tiles += box(x + 12 + i * 9, 160 + j * 8, 3, 3, '#000', ' opacity="0.3"')
  }
  return (
    `<rect width="${WIDTH}" height="150" fill="url(#datacenterWall)"/>` +
    `<rect y="14" width="${WIDTH}" height="8" fill="#1a2438"/><rect y="21" width="${WIDTH}" height="1.5" fill="#2a3850"/>${cables}` +
    RACKS.map(x => rack(x, r)).join('') +
    `\n<g transform="translate(${WIDTH - 720} 0)">${window}</g>\n` +
    `<text x="16" y="12" font-family="Menlo, 'SF Mono', monospace" font-weight="700" font-size="11" letter-spacing="1.5" fill="#bff7ea" filter="url(#neon)">M2V-MDO</text>` +
    `<rect x="44" y="26" width="51" height="46" fill="#111a2b" stroke="#2a3850" stroke-width="3"/>${pixelHeart}` +
    `<rect y="150" width="${WIDTH}" height="${HEIGHT - 150}" fill="url(#datacenterFloor)"/>${tiles}<rect y="150" width="${WIDTH}" height="2" fill="#2ee6c0" opacity="0.6"/>`
  )
}

// An operator's headset, in a Claude's own cells: the band over the head, an
// ear cup on each side, a little microphone on the left.
const HEADSET =
  box(0.6, -0.45, 6.8, 0.4, '#2b2f3a') +
  box(-0.5, 0.6, 0.7, 1.8, '#2b2f3a') + box(-0.35, 0.9, 0.4, 1.2, '#2ee6c0') +
  box(7.8, 0.6, 0.7, 1.8, '#2b2f3a') + box(7.95, 0.9, 0.4, 1.2, '#2ee6c0') +
  box(-0.3, 2.4, 0.25, 1.2, '#2b2f3a') + box(-0.3, 3.5, 1.4, 0.3, '#2b2f3a')

export const DATACENTER: Ambience = {
  defs: DEFS,
  room,
  beams: ['datacenterBeamTeal', 'datacenterBeamBlue'],
  sign: { fill: '#d9fff4', stroke: '#2ec4a0' },
  crown: HEADSET,
  instruments: 'band',
  // A steel riser, grey-blue, as the racks around it.
  riser: { fill: '#252e3e', edge: '#4a5a78' },
}
