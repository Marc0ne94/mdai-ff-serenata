import type { Scenery } from '../draw'
import { dropLights, n1, random, sec } from '../draw'
import type { Song } from '../song'
import { partsOf } from '../song'

// The scenery of Carpe diem. In the window the winter sea of the ode, the
// Tyrrhenian wearing itself out on the rocks: under a grey sky the waves roll
// in and break in spray every other beat; in the drops the sun comes out and
// gilds it all, and stays out at the close. Beside the singer a sundial of
// marble, a hollow half bowl with its hour lines: its shadow crosses the hours
// while the song lasts, and jumps ahead in the break, where the words say
// that time has fled while we were talking («DUM LOQUIMUR», carved under the
// bowl); it glows in the drops. And a cup of wine for the singer's hand.

const DEFS = `<defs>
<clipPath id="meridianaWindow"><rect x="610" y="20" width="88" height="78"/></clipPath>
<linearGradient id="meridianaSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d6b80"/><stop offset="1" stop-color="#aab4bd"/></linearGradient>
<linearGradient id="meridianaSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#47657c"/><stop offset="1" stop-color="#1b3044"/></linearGradient>
<linearGradient id="meridianaGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcf7a"/><stop offset="1" stop-color="#ff9a5c"/></linearGradient>
<radialGradient id="meridianaSun"><stop offset="0" stop-color="#fff4c8" stop-opacity="0.95"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
<radialGradient id="meridianaGlow"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.8"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient>
<linearGradient id="meridianaMarble" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b3aa9c"/><stop offset="0.5" stop-color="#efe8da"/><stop offset="1" stop-color="#a39a8c"/></linearGradient>
</defs>`

// An opacity that follows points in time, [seconds, value], from the start of
// the song to its end.
function fade(points: [number, number][], song: Song) {
  let last = -1
  const steps = [...points, [song.duration, points.at(-1)?.[1] ?? 0] as [number, number]].map(([t, v]) => {
    last = Math.min(song.duration, Math.max(t, last + 0.01))
    return [last, v] as const
  })
  const keyTimes = steps.map(([t], i) => (i === 0 ? '0' : i === steps.length - 1 ? '1' : (t / song.duration).toFixed(5))).join(';')
  return `<animate attributeName="opacity" values="${steps.map(([, v]) => v).join(';')}" keyTimes="${keyTimes}" dur="${sec(song.duration)}" fill="freeze"/>`
}

// What is lit in the drops: up as each starts, down to `rest` as it ends, and
// left up by the one that runs into the outro.
function inDrops(song: Song, up: number, rest: number) {
  const points: [number, number][] = [[0, 0]]
  let now = 0
  for (const [start, end] of dropLights(song).spans) {
    points.push([start, now], [start + 1.2, up])
    now = up
    if (end < song.outroAt - 0.01) {
      points.push([end, up], [end + 1.5, rest])
      now = rest
    }
  }
  return fade(points, song)
}

// ---------- the winter sea in the window ----------

const HORIZON = 60

function sea(song: Song) {
  const r = random(211)
  let clouds = ''
  for (let i = 0; i < 4; i++) {
    const x = 612 + r() * 70
    clouds +=
      `<ellipse cx="${n1(x)}" cy="${n1(26 + r() * 22)}" rx="${n1(14 + r() * 12)}" ry="${n1(3 + r() * 2)}" fill="#d5dbe0" opacity="0.7">` +
      `<animate attributeName="cx" values="${n1(x)};${n1(x + 10)};${n1(x)}" dur="${n1(14 + r() * 8)}s" repeatCount="indefinite"/></ellipse>`
  }
  // The sun of the drops: its gold over the sky and the sea, then its disc.
  const sun =
    `<g opacity="0">${inDrops(song, 1, 0.15)}` +
    `<rect x="610" y="20" width="88" height="78" fill="url(#meridianaGold)" opacity="0.42"/>` +
    `<circle cx="634" cy="38" r="16" fill="url(#meridianaSun)"/><circle cx="634" cy="38" r="6" fill="#fff1b8"/>` +
    `<rect x="624" y="${HORIZON + 3}" width="20" height="1" fill="#ffe7a8" opacity="0.8"/><rect x="628" y="${HORIZON + 8}" width="12" height="1" fill="#ffe7a8" opacity="0.6"/></g>`
  // Waves rolling in to the rocks, one after the other, a bar each.
  let waves = ''
  for (let i = 0; i < 3; i++) {
    const y = HORIZON + 8 + i * 9
    waves +=
      `<path d="M 0 0 q 3 -2.4 6 0 q 3 2.4 6 0 q 3 -2.4 6 0 q 3 2.4 6 0" fill="none" stroke="#e8eef2" stroke-width="${n1(0.9 + i * 0.3)}" opacity="0.75">` +
      `<animateTransform attributeName="transform" type="translate" values="${604 - i * 8} ${y};${648 + i * 4} ${y}" dur="${sec(song.bar)}" begin="${sec((i * song.bar) / 3)}" repeatCount="indefinite"/></path>`
  }
  // The rocks, pumice, on the right, and one out in the water.
  const rocks =
    `<path d="M 664 98 L 668 78 L 675 70 L 681 74 L 686 60 L 694 56 L 698 62 L 698 98 Z" fill="#5a534d"/>` +
    `<path d="M 668 78 L 675 70 L 681 74 L 679 84 Z" fill="#7a726a"/><path d="M 686 60 L 694 56 L 692 70 Z" fill="#7a726a"/>` +
    `<path d="M 636 98 L 640 91 L 647 93 L 650 98 Z" fill="#4e4842"/>`
  // The spray where the sea breaks on them, every other beat.
  let spray = ''
  const dur = sec(2 * song.beat)
  for (let i = 0; i < 7; i++) {
    const dx = -8 + r() * 14
    const dy = -(8 + r() * 16)
    spray +=
      `<circle cx="666" cy="84" r="${n1(0.8 + r() * 0.9)}" fill="#fff" opacity="0">` +
      `<animate attributeName="cx" values="666;${n1(666 + dx)}" dur="${dur}" repeatCount="indefinite"/>` +
      `<animate attributeName="cy" values="84;${n1(84 + dy)};${n1(84 + dy * 0.6)}" dur="${dur}" repeatCount="indefinite"/>` +
      `<animate attributeName="opacity" values="0;0.95;0" keyTimes="0;0.25;1" dur="${dur}" repeatCount="indefinite"/></circle>`
  }
  return (
    `<rect x="606" y="16" width="96" height="86" fill="#bfb5a2"/>` +
    `<g clip-path="url(#meridianaWindow)">` +
    `<rect x="610" y="20" width="88" height="${HORIZON - 20}" fill="url(#meridianaSky)"/>${clouds}` +
    `<rect x="610" y="${HORIZON}" width="88" height="${98 - HORIZON}" fill="url(#meridianaSea)"/>${sun}${waves}${rocks}${spray}` +
    `</g>`
  )
}

// ---------- the sundial beside the singer ----------

// Where the shadow points, in degrees from the right, clockwise: from the
// first hour to the last, and how far it jumps in a break.
const FIRST_HOUR = 160
const LAST_HOUR = 20
const JUMP = 40

// The shadow's way across the hours: still until the first word, then steady
// to the outro; through the last break it jumps ahead instead.
export function shadow(song: Song) {
  const start = song.lines[0]?.start ?? 0
  const gap = partsOf(song, 'break').at(-1)
  const sweep = FIRST_HOUR - LAST_HOUR - (gap ? JUMP : 0)
  const steady = song.outroAt - start - (gap ? gap.end - gap.start : 0)
  const points: [number, number][] = [[0, FIRST_HOUR], [start, FIRST_HOUR]]
  if (gap) {
    const before = FIRST_HOUR - (sweep * (gap.start - start)) / steady
    points.push([gap.start, before], [gap.end, before - JUMP])
  }
  points.push([song.outroAt, LAST_HOUR])
  return points
}

function sundial(song: Song) {
  const lit = dropLights(song)
  const points = shadow(song)
  const turn =
    `<animateTransform attributeName="transform" type="rotate" values="${points.map(([, a]) => n1(a)).join(';')}" ` +
    `keyTimes="${points.map(([t], i) => (i === points.length - 1 ? '1' : (t / song.outroAt).toFixed(5))).join(';')}" dur="${sec(song.outroAt)}" fill="freeze"/>`
  let hours = ''
  for (let a = 15; a <= 165; a += 15) {
    const rad = (a * Math.PI) / 180
    hours += `<line x1="300" y1="330" x2="${n1(300 + 64 * Math.cos(rad))}" y2="${n1(330 + 64 * Math.sin(rad))}" stroke="#8f8678" stroke-width="1.6"/>`
  }
  const glow =
    `<circle cx="300" cy="372" r="130" fill="url(#meridianaGlow)" opacity="0">${inDrops(song, 0.55, 0)}` +
    `<animate attributeName="opacity" values="0.45;0.8;0.45" dur="${sec(2 * song.beat)}" begin="${lit.on}" end="${lit.off}" repeatCount="indefinite"/></circle>`
  const pedestal =
    `<ellipse cx="300" cy="545" rx="92" ry="6" fill="#000" opacity="0.3"/>` +
    `<rect x="246" y="527" width="108" height="18" fill="#cfc6b6"/>` +
    `<rect x="266" y="432" width="68" height="95" fill="url(#meridianaMarble)"/>` +
    [283, 300, 317].map(x => `<rect x="${x - 1}" y="436" width="2" height="87" fill="#9a9184" opacity="0.6"/>`).join('') +
    `<rect x="254" y="420" width="92" height="12" fill="#dcd4c4"/>`
  const dial =
    `<rect x="218" y="318" width="164" height="102" rx="4" fill="url(#meridianaMarble)"/><rect x="212" y="310" width="176" height="10" rx="2" fill="#e6dece"/>` +
    `<path d="M 232 330 A 68 68 0 0 0 368 330 Z" fill="#bdb4a4"/>${hours}` +
    `<g transform="translate(300 330)"><g transform="rotate(${FIRST_HOUR})">${turn}<line x1="0" y1="0" x2="60" y2="0" stroke="#4a3c33" stroke-width="5" stroke-linecap="round" opacity="0.85"/></g></g>` +
    `<rect x="295" y="318" width="10" height="14" fill="#c9a24a"/><circle cx="300" cy="330" r="5" fill="#8a6a2a"/>` +
    `<text x="300" y="414" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="13" letter-spacing="2.5" fill="#857b6d">DUM LOQUIMUR</text>`
  // Sparkles over the dial as each drop starts.
  const r = random(223)
  let sparkles = ''
  for (let i = 0; i < 6; i++) {
    const begin = lit.spans.map(([start]) => sec(start + 0.3 + (i % 3) * 0.5)).join(';')
    sparkles += `<g transform="translate(${n1(300 + (r() - 0.5) * 150)} ${n1(300 + (r() - 0.5) * 70)})"><use href="#sparkle" fill="#fff3b0" transform="scale(0)"><animateTransform attributeName="transform" type="scale" values="0;1.8;0" dur="0.9s" begin="${begin}"/></use></g>`
  }
  return `${glow}${pedestal}${dial}${sparkles}`
}

// ---------- a cup of wine for the singer's hand ----------

const CUP = [
  '.........',
  '.........',
  '.........',
  '.........',
  '.HWWWWWH.',
  '.BWWWWWB.',
  '.BBBBBBB.',
  '..BBBBB..',
  '...BBB...',
  '....B....',
  '....B....',
  '....B....',
  '..BBBBB..',
  '.........',
  '.........',
]
const CUP_COLORS: Record<string, string> = { B: '#c9a24a', H: '#f0d48a', W: '#8f1d3a' }

export const MERIDIANA: Scenery = {
  neon: ['CARPE DIEM', 'OGGI ♥'],
  defs: DEFS,
  wall: sea,
  prop: sundial,
  gadget: { pixels: CUP, colors: CUP_COLORS },
}
