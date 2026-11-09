import type { Scenery } from '../draw'
import { box, n1, random, sec } from '../draw'
import type { Song } from '../song'

// The scenery of «In principio fu il MAV», the Serenata's sequel: in the window
// a night sky where three bright stars light up one after the other, MAV, M2V
// and M4V, and at the finale a constellation draws a heart through them; beside
// the singer three candles on a table, each taller than the one before, lit as
// their names are sung, the Serenata's flower in a vase beside them, two hearts
// at the bloom and hearts rising from the last flame; a sealed letter for the
// singer's hand.

const DEFS = `<defs>
<clipPath id="principioWindow"><rect x="610" y="20" width="88" height="78"/></clipPath>
<radialGradient id="principioGlow"><stop offset="0" stop-color="#ff8fb8" stop-opacity="0.7"/><stop offset="1" stop-color="#ff8fb8" stop-opacity="0"/></radialGradient>
<radialGradient id="principioFlameGlow"><stop offset="0" stop-color="#ffcf7a" stop-opacity="0.55"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>
<radialGradient id="principioStar"><stop offset="0" stop-color="#fff"/><stop offset="0.4" stop-color="#ffe3f0"/><stop offset="1" stop-color="#ff8fb8" stop-opacity="0"/></radialGradient>
</defs>`

// When each name is sung: MAV in the first line, M2V in the third, M4V in the
// chorus (each a few beats in, on the name itself).
function namedAt(song: Song) {
  const at = (line: number, beats: number) => (song.lines[line]?.start ?? 0) + beats * song.beat
  return [at(0, 2), at(2, 2), at(4, 5)] as const
}

// ---------- the sky in the window ----------

// The heart the constellation draws, twelve stars around it.
const HEART = Array.from({ length: 12 }, (_, k) => {
  const t = (2 * Math.PI * k) / 12
  const x = 654 + 1.05 * 16 * Math.sin(t) ** 3
  const y = 54 - 1.05 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
  return [x, y] as const
})
// The three bright stars, among the heart's.
const NAMED = [0, 4, 8] as const

function sky(song: Song) {
  const r = random(149)
  let stars = ''
  for (let i = 0; i < 12; i++) {
    stars += `<circle cx="${n1(613 + r() * 82)}" cy="${n1(23 + r() * 70)}" r="${n1(0.4 + r() * 0.5)}" fill="#fff"><animate attributeName="opacity" values="0.3;1;0.3" dur="${n1(2 + r() * 2)}s" repeatCount="indefinite"/></circle>`
  }
  // The heart's own stars, faint from the start.
  const faint = HEART.map(([x, y], k) => (NAMED.includes(k as 0 | 4 | 8) ? '' : `<circle cx="${n1(x)}" cy="${n1(y)}" r="0.7" fill="#ffe3f0" opacity="0.55"/>`)).join('')
  // The three bright ones, each lit when its name is sung.
  const bright = namedAt(song)
    .map((t, i) => {
      const [x, y] = HEART[NAMED[i] ?? 0] ?? [654, 54]
      return (
        `<g transform="translate(${n1(x)} ${n1(y)})"><g transform="scale(0)">` +
        `<animateTransform attributeName="transform" type="scale" values="0;1.6;1" dur="0.8s" begin="${sec(t)}" fill="freeze"/>` +
        `<circle r="4" fill="url(#principioStar)"/><circle r="1.3" fill="#fff"/></g></g>`
      )
    })
    .join('')
  // The constellation drawn through all of them at the finale, then glowing.
  const points = [...HEART, HEART[0] ?? [654, 54]]
  const length = points.slice(1).reduce((sum, [x, y], i) => sum + Math.hypot(x - (points[i]?.[0] ?? x), y - (points[i]?.[1] ?? y)), 0)
  const line =
    `<polyline points="${points.map(([x, y]) => `${n1(x)},${n1(y)}`).join(' ')}" fill="none" stroke="#ffb3cf" stroke-width="0.9" stroke-linejoin="round" stroke-dasharray="${n1(length)}" stroke-dashoffset="${n1(length)}">` +
    `<animate attributeName="stroke-dashoffset" from="${n1(length)}" to="0" begin="${sec(song.finaleAt)}" dur="3s" fill="freeze"/>` +
    `<animate attributeName="opacity" values="1;0.5;1" dur="${sec(2 * song.beat)}" begin="${sec(song.finaleAt + 3)}" end="${sec(song.outroAt + 3)}" repeatCount="indefinite"/></polyline>`
  const blush =
    `<rect x="610" y="20" width="88" height="78" fill="#ff8fb8" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="0.18" begin="${sec(song.finaleAt + 2)}" dur="3s" fill="freeze"/></rect>`
  return (
    `<rect x="606" y="16" width="96" height="86" fill="#3a2a55"/>` +
    `<g clip-path="url(#principioWindow)"><rect x="610" y="20" width="88" height="78" fill="url(#night)"/>${stars}${blush}${faint}${line}${bright}</g>`
  )
}

// ---------- the three candles beside the singer ----------

const TABLE = 470
// Each candle: where it stands, how tall, its name.
const CANDLES = [
  { x: 240, height: 42, name: 'MAV' },
  { x: 300, height: 66, name: 'M2V' },
  { x: 360, height: 92, name: 'M4V' },
] as const
const W = 22

function candles(song: Song) {
  const r = random(151)
  const on = namedAt(song)
  const table =
    `<ellipse cx="300" cy="545" rx="120" ry="6" fill="#000" opacity="0.3"/>` +
    `<rect x="190" y="${TABLE}" width="220" height="14" rx="3" fill="#5a2a3a"/>` +
    `<rect x="214" y="${TABLE + 14}" width="18" height="61" fill="#4a2030"/><rect x="368" y="${TABLE + 14}" width="18" height="61" fill="#4a2030"/>`
  let drawn = ''
  CANDLES.forEach(({ x, height, name }, i) => {
    const top = TABLE - height
    const t = on[i] ?? 0
    // Each candle's name on the table's edge, golden once its flame is lit.
    const label =
      `<text x="${x}" y="${TABLE + 11}" text-anchor="middle" font-family="Menlo, 'SF Mono', monospace" font-weight="700" font-size="10" letter-spacing="1" fill="#8a4a5a">${name}` +
      `<set attributeName="fill" to="#ffd38a" begin="${sec(t)}" fill="freeze"/></text>`
    // The flame, unlit until its name is sung; then it catches and flickers.
    const flame =
      `<g transform="translate(${x} ${top - 2})"><g transform="scale(0)">` +
      `<animateTransform attributeName="transform" type="scale" values="0;1.3;1" dur="0.6s" begin="${sec(t)}" fill="freeze"/>` +
      `<circle r="22" fill="url(#principioFlameGlow)"/>` +
      `<g><animateTransform attributeName="transform" type="scale" values="1 1;0.92 1.12;1.05 0.95;1 1" dur="${n1(0.7 + r() * 0.5)}s" begin="${sec(t + 0.6)}" repeatCount="indefinite"/>` +
      `<path d="M 0 0 C -6 -4 -5 -12 0 -20 C 5 -12 6 -4 0 0 Z" fill="#ffb347"/><path d="M 0 -1 C -3 -4 -2 -9 0 -13 C 2 -9 3 -4 0 -1 Z" fill="#fff3c4"/></g></g></g>`
    drawn +=
      `<rect x="${x - W / 2 - 6}" y="${TABLE - 6}" width="${W + 12}" height="6" rx="2" fill="#c9a24a"/>` +
      `<rect x="${x - W / 2}" y="${top}" width="${W}" height="${height - 6}" rx="2" fill="#f6ecd9"/>` +
      `<path d="M ${x - W / 2} ${top + 4} q 4 0 4 8 q 0 6 3 6 q 3 0 3 -10 L ${x - W / 2 + 10} ${top} Z" fill="#fff8ec"/>` +
      `<rect x="${x - 0.8}" y="${top - 5}" width="1.6" height="5" fill="#3a2a20"/>${flame}${label}`
  })
  // The Serenata's flower, in a little vase at the end of the table.
  const fx = 206
  const fy = TABLE
  const flower =
    `<rect x="${fx - 8}" y="${fy - 20}" width="16" height="20" rx="3" fill="#b5653a"/>` +
    `<path d="M ${fx} ${fy - 20} q -3 -14 0 -28" stroke="#4f9a4a" stroke-width="3" fill="none"/>` +
    `<ellipse cx="${fx - 7}" cy="${fy - 36}" rx="5" ry="3" fill="#4f9a4a" transform="rotate(-30 ${fx - 7} ${fy - 36})"/>` +
    [-6, 0, 6].map(dx => `<ellipse cx="${fx + dx}" cy="${fy - 52}" rx="6" ry="9" fill="#e0315e" transform="rotate(${dx * 4} ${fx} ${fy - 46})"/>`).join('') +
    `<circle cx="${fx}" cy="${fy - 48}" r="3" fill="#ffd166"/>`
  // «e il cuore raddoppiò»: at the bloom a heart above the second flame, then two.
  const second = CANDLES[1]
  const pop = (dx: number, delay: number) =>
    `<g transform="translate(${second.x + dx} ${TABLE - second.height - 44})"><g transform="scale(0)">` +
    `<animateTransform attributeName="transform" type="scale" values="0;2.4;1.8" dur="0.7s" begin="${sec(song.bloomAt + delay)}" fill="freeze"/>` +
    `<use href="#heart" fill="#ff6f91"/></g></g>`
  const hearts = pop(-14, 0.4) + pop(14, 0.4 + 2 * song.beat)
  // Hearts rising from the last flame through the finale, gone before the close.
  const last = CANDLES[2]
  let rising = ''
  for (let i = 0; i < 8; i++) {
    const begin = [0, 1, 2]
      .map(k => song.finaleAt + 1 + i * 0.5 + k * 4)
      .filter(t => t + 2.6 <= song.outroAt + 0.5)
      .map(sec)
      .join(';')
    if (!begin) continue
    const dx = Math.round((r() - 0.5) * 120)
    rising +=
      `<g transform="translate(${last.x} ${TABLE - last.height - 20})"><g opacity="0">` +
      `<animateTransform attributeName="transform" type="translate" values="0 0;${dx / 2} -60;${dx} -120" dur="2.6s" begin="${begin}"/>` +
      `<animate attributeName="opacity" values="0;1;0.8;0" keyTimes="0;0.1;0.6;1" dur="2.6s" begin="${begin}"/>` +
      `<use href="#heart" fill="${i % 2 ? '#ff6f91' : '#ffb3cf'}" transform="scale(1.3)"/></g></g>`
  }
  const glow =
    `<circle cx="300" cy="400" r="130" fill="url(#principioGlow)" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="0.6" begin="${sec(song.finaleAt)}" dur="1.5s" fill="freeze"/>` +
    `<animate attributeName="opacity" values="0.45;0.8;0.45" dur="${sec(2 * song.beat)}" begin="${sec(song.finaleAt + 1.5)}" end="${sec(song.outroAt + 2)}" repeatCount="indefinite"/></circle>`
  return `${glow}${table}${drawn}${flower}${hearts}${rising}`
}

// ---------- the sealed letter for the singer's hand ----------

const LETTER = [
  '.........',
  '.........',
  '.........',
  '.........',
  '.........',
  '.........',
  '.EEEEEEE.',
  '.WEWWWEW.',
  '.WWRWRWW.',
  '.WWRRRWW.',
  '.WWWRWWW.',
  '.EEEEEEE.',
  '.........',
  '.........',
  '.........',
]
const LETTER_COLORS: Record<string, string> = { E: '#c9b8a6', W: '#f4f1ea', R: '#d81b4f' }

export const PRINCIPIO: Scenery = {
  neon: ['IN PRINCIPIO FU IL MAV', 'MAV › M2V › M4V ♥'],
  defs: DEFS,
  wall: sky,
  prop: candles,
  gadget: { pixels: LETTER, colors: LETTER_COLORS },
}
