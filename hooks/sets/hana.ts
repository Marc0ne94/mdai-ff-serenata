import type { Scenery } from '../draw'
import { box, n1, random, sec } from '../draw'
import type { Song } from '../song'

// The scenery of HANA di notte: the city at night through the window, one
// office still lit, turning to dawn as the song ends; beside the singer a
// database server whose columns of memory pulse with the band and turn green;
// an alarm clock for the singer's hand.

const DEFS = `<defs>
<clipPath id="hanaWindow"><rect x="610" y="20" width="88" height="78"/></clipPath>
<linearGradient id="hanaDawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b7fd0"/><stop offset="0.7" stop-color="#e98f86"/><stop offset="1" stop-color="#ffc56b"/></linearGradient>
<radialGradient id="hanaGlow"><stop offset="0" stop-color="#58d6b0" stop-opacity="0.7"/><stop offset="1" stop-color="#58d6b0" stop-opacity="0"/></radialGradient>
</defs>`

// ---------- the city in the window ----------

function city(song: Song) {
  const r = random(97)
  const dawn = song.finaleAt
  const morning = song.outroAt
  let stars = ''
  for (let i = 0; i < 10; i++) {
    stars += `<circle cx="${n1(613 + r() * 82)}" cy="${n1(23 + r() * 36)}" r="${n1(0.5 + r() * 0.5)}" fill="#fff"><animate attributeName="opacity" values="0.3;1;0.3" dur="${n1(2 + r() * 2)}s" repeatCount="indefinite"/></circle>`
  }
  const starsFade = `<g>${stars}<animate attributeName="opacity" from="1" to="0" begin="${sec(dawn)}" dur="${sec(morning - dawn)}" fill="freeze"/></g>`
  // The moon goes down through the night; the sun comes up in the morning.
  const moon =
    `<g><animateTransform attributeName="transform" type="translate" from="0 0" to="14 70" dur="${sec(morning)}" fill="freeze"/>` +
    `<circle cx="628" cy="34" r="6" fill="#f3ecd0"/><circle cx="630.5" cy="32.5" r="5.2" fill="#1d1846"/></g>`
  const dawnSky =
    `<rect x="610" y="20" width="88" height="78" fill="url(#hanaDawn)" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="1" begin="${sec(dawn)}" dur="${sec(morning + 2 - dawn)}" fill="freeze"/></rect>`
  const sun =
    // Over the lowest tower (640-656, its top at 66), so the rising sun is seen.
    `<g><animateTransform attributeName="transform" type="translate" from="0 0" to="0 -54" begin="${sec(morning)}" dur="4s" fill="freeze"/>` +
    `<circle cx="648" cy="100" r="8" fill="#ffd27a"/></g>`
  // The towers, a few windows lit, and one office lit all night: the one that works.
  let towers = ''
  const shapes: [number, number, number][] = [[610, 60, 14], [626, 48, 12], [640, 66, 16], [658, 54, 13], [673, 62, 25]]
  for (const [x, top, w] of shapes) {
    towers += box(x, top, w, 98 - top, '#120c26')
    for (let wy = top + 4; wy < 94; wy += 7) {
      for (let wx = x + 3; wx < x + w - 2; wx += 5) if (r() < 0.25) towers += box(wx, wy, 2, 3, '#f7c96b', ' opacity="0.7"')
    }
  }
  const office =
    `<rect x="661" y="70" width="2.4" height="3.4" fill="#9ff0d4"><animate attributeName="opacity" values="1;0.6;1" dur="${sec(2 * song.beat)}" repeatCount="indefinite"/></rect>`
  return (
    `<rect x="606" y="16" width="96" height="86" fill="#3a2a55"/>` +
    `<g clip-path="url(#hanaWindow)"><rect x="610" y="20" width="88" height="78" fill="url(#night)"/>${starsFade}${moon}${dawnSky}${sun}${towers}${office}</g>` +
    `<rect x="653" y="20" width="2" height="78" fill="#3a2a55"/>`
  )
}

// ---------- the server beside the singer ----------

const BARS = 6

function server(song: Song) {
  const top = 290
  const r = random(101)
  // Its columns of memory: blue while the night's work runs, green from the
  // bloom, each pulsing on its own beat from the bass's entry.
  let columns = ''
  for (let i = 0; i < BARS; i++) {
    const x = 232 + i * 24
    const levels = Array.from({ length: 4 }, () => n1(0.35 + r() * 0.65)).join(';')
    columns +=
      `<rect x="${x}" y="350" width="16" height="118" fill="#1a1e28"/>` +
      `<g transform="translate(${x} 468)"><g transform="scale(1 0.3)">` +
      `<animateTransform attributeName="transform" type="scale" values="${levels
        .split(';')
        .map(v => `1 ${v}`)
        .join(';')}" dur="${sec(2 * song.beat)}" begin="${sec(2 * song.bar + i * 0.1)}" end="${sec(song.outroAt + 2)}" repeatCount="indefinite"/>` +
      `<rect x="0" y="-118" width="16" height="118" fill="#3b82f6"><set attributeName="fill" to="#3fb950" begin="${sec(song.bloomAt + i * 0.15)}" fill="freeze"/></rect></g></g>`
  }
  let leds = ''
  for (let i = 0; i < 8; i++) {
    leds += `<circle cx="${236 + i * 18}" cy="490" r="3" fill="${i % 3 ? '#7ee787' : '#ffd166'}"><animate attributeName="opacity" values="1;0.2;1" dur="${n1(0.4 + r() * 0.9)}s" repeatCount="indefinite"/></circle>`
  }
  const display =
    `<rect x="228" y="${top + 12}" width="144" height="30" rx="3" fill="#0b0f16"/>` +
    `<text x="240" y="${top + 34}" font-family="Menlo, 'SF Mono', monospace" font-weight="700" font-size="18" letter-spacing="3" fill="#7ee787">HANA</text>` +
    `<rect x="318" y="${top + 20}" width="9" height="15" fill="#7ee787"><animate attributeName="opacity" values="1;0" dur="0.8s" calcMode="discrete" repeatCount="indefinite"/></rect>`
  const body =
    `<ellipse cx="300" cy="545" rx="100" ry="6" fill="#000" opacity="0.3"/>` +
    `<rect x="214" y="${top}" width="172" height="245" rx="6" fill="#262c3a" stroke="#3d4558" stroke-width="3"/>` +
    `<rect x="226" y="508" width="148" height="4" fill="#3d4558"/><rect x="226" y="518" width="148" height="4" fill="#3d4558"/>`
  const glow =
    `<circle cx="300" cy="400" r="130" fill="url(#hanaGlow)" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="0.6" begin="${sec(song.finaleAt)}" dur="1.5s" fill="freeze"/>` +
    `<animate attributeName="opacity" values="0.45;0.8;0.45" dur="${sec(2 * song.beat)}" begin="${sec(song.finaleAt + 1.5)}" end="${sec(song.outroAt + 2)}" repeatCount="indefinite"/></circle>`
  // Bits of data rising from the server through the finale, gone before the close.
  let data = ''
  for (let i = 0; i < 12; i++) {
    const begin = [0, 1, 2]
      .map(k => song.finaleAt + i * 0.4 + k * 3.6)
      .filter(t => t + 2.6 <= song.outroAt + 0.5)
      .map(sec)
      .join(';')
    if (!begin) continue
    const dx = Math.round((r() - 0.5) * 140)
    data +=
      `<g transform="translate(${n1(250 + r() * 100)} 300)"><rect x="-4" y="-4" width="8" height="8" fill="${i % 2 ? '#7ee787' : '#7dd3fc'}" opacity="0">` +
      `<animateTransform attributeName="transform" type="translate" values="0 0;${dx / 2} -90;${dx} -180" dur="2.6s" begin="${begin}"/>` +
      `<animate attributeName="opacity" values="0;1;0.8;0" keyTimes="0;0.1;0.6;1" dur="2.6s" begin="${begin}"/></rect></g>`
  }
  return `${glow}${body}${display}${columns}${leds}${data}`
}

// ---------- the alarm clock for the singer's hand ----------

const CLOCK = [
  '.........',
  '.........',
  '.........',
  '.........',
  '.B.....B.',
  '.BB...BB.',
  '..CCCCC..',
  '.CWWWWWC.',
  '.CWWKWWC.',
  '.CWWKKWC.',
  '.CWWWWWC.',
  '..CCCCC..',
  '..L...L..',
  '.........',
  '.........',
]
const CLOCK_COLORS: Record<string, string> = { B: '#ffd166', C: '#d8402f', W: '#f4f1ea', K: '#1a1410', L: '#8a2a1f' }

export const HANA: Scenery = {
  neon: ['HANA DI NOTTE', 'PER TE ♥'],
  defs: DEFS,
  wall: city,
  prop: server,
  gadget: { pixels: CLOCK, colors: CLOCK_COLORS },
}
