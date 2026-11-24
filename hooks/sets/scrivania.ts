import type { Scenery } from '../draw'
import { dropLights, n1, random, sec } from '../draw'
import type { Song } from '../song'

// The scenery of «La mia scrivania ha una scrivania». On the wall a screen
// shows how hard the PC works, a bar for each of its cores: low and restless
// in the verses, all of them full and red in the drops, with 100% over them
// («tutto il mio PC»). Beside the singer a desk with a lamp and a drawer, the
// PC under it, and on it a screen that shows the desk, whose screen shows the
// desk again, smaller each time: the second desk comes up at the first
// «scrivania» of the first refrain, the third at the second, the fourth when
// the last refrain starts; in the drops the screens light up on the beat and
// the PC's light turns red. A small flying-V guitar for the singer's hand.

const DEFS = `<defs>
<clipPath id="scrivaniaWall"><rect x="610" y="20" width="88" height="78"/></clipPath>
<radialGradient id="scrivaniaGlow"><stop offset="0" stop-color="#5ab4ff" stop-opacity="0.55"/><stop offset="1" stop-color="#5ab4ff" stop-opacity="0"/></radialGradient>
</defs>`

const MONO = "Menlo, 'SF Mono', monospace"
const RED = '#ff4f5e'

// ---------- the PC's cores on the wall ----------

const CORES = 8
function cores(song: Song) {
  const r = random(173)
  const lit = dropLights(song)
  const shown = (extra = '') =>
    `<set attributeName="visibility" to="visible" begin="${lit.on}"/><set attributeName="visibility" to="hidden" begin="${lit.off}"/>${extra}`
  let bars = ''
  for (let k = 0; k < CORES; k++) {
    const x = 614 + k * 10.5
    // Restless and low, each its own way.
    const heights = Array.from({ length: 5 }, () => 6 + Math.round(r() * 18))
    const ys = heights.map(h => 92 - h)
    bars +=
      `<rect x="${n1(x)}" y="${ys[0]}" width="8" height="${heights[0]}" fill="#4fd8a0">` +
      `<animate attributeName="height" values="${heights.join(';')}" dur="${n1(1.6 + r())}s" calcMode="discrete" repeatCount="indefinite"/>` +
      `<animate attributeName="y" values="${ys.join(';')}" dur="${n1(1.6 + r())}s" calcMode="discrete" repeatCount="indefinite"/></rect>` +
      // Full and red in the drops.
      `<rect x="${n1(x)}" y="36" width="8" height="56" fill="${RED}" visibility="hidden">${shown()}</rect>`
  }
  return (
    `<rect x="606" y="16" width="96" height="86" fill="#2a2d36"/>` +
    `<g clip-path="url(#scrivaniaWall)"><rect x="610" y="20" width="88" height="78" fill="#0b1020"/>` +
    `<text x="614" y="31" font-family="${MONO}" font-weight="700" font-size="8" fill="#7fd4ff">CPU</text>` +
    `<text x="694" y="31" text-anchor="end" font-family="${MONO}" font-weight="700" font-size="8" fill="${RED}" visibility="hidden">100%${shown()}</text>` +
    `${bars}</g>`
  )
}

// ---------- the desk in the desk ----------

// The desk as drawn at full size: from x 150 to 450, its screen at 200..400 × 290..410.
const SCREEN = { x: 208, y: 298, w: 184, h: 104 }
const SCENE = { x: 150, y: 290, w: 300, h: 255 }
// How much smaller each desk is in the screen of the one before it, and where it stands there.
const S = Math.min(SCREEN.w / SCENE.w, SCREEN.h / SCENE.h)
const INNER = {
  x: SCREEN.x + (SCREEN.w - SCENE.w * S) / 2 - SCENE.x * S,
  y: SCREEN.y + (SCREEN.h - SCENE.h * S) - SCENE.y * S,
}
const DEPTH = 4

// When each smaller desk comes up: at the first refrain's two «scrivania», and as the last refrain starts.
function shownAt(song: Song) {
  const refrain = song.lines.find(line => line.start >= song.finaleAt - 0.01)
  const words = (refrain?.syls ?? []).filter(s => s.text === 'scri').map(s => s.start)
  const last = dropLights(song).spans.at(-1)?.[0] ?? song.finaleAt
  return [words[0] ?? song.finaleAt, words[1] ?? song.finaleAt + 2 * song.beat, Math.max(last, (words[1] ?? 0) + song.beat)]
}

function desk(song: Song, depth: number): string {
  const lit = dropLights(song)
  const top = 440
  // The screen, lit up on the beat in the drops.
  const screen =
    `<rect x="200" y="290" width="200" height="120" rx="6" fill="#1b1e26"/>` +
    `<rect x="${SCREEN.x}" y="${SCREEN.y}" width="${SCREEN.w}" height="${SCREEN.h}" fill="#0b1020">` +
    `<animate attributeName="fill" values="#24407a;#0b1020" dur="${sec(song.beat)}" begin="${lit.on}" end="${lit.off}" calcMode="discrete" repeatCount="indefinite"/></rect>` +
    `<rect x="292" y="410" width="16" height="26" fill="#2a2d36"/><rect x="262" y="434" width="76" height="6" rx="2" fill="#2a2d36"/>`
  // The desk: its top, its legs, a drawer, a lamp.
  const table =
    `<rect x="150" y="${top}" width="300" height="12" rx="2" fill="#8a5a3a"/>` +
    `<rect x="160" y="${top + 12}" width="14" height="93" fill="#6e4630"/><rect x="426" y="${top + 12}" width="14" height="93" fill="#6e4630"/>` +
    `<rect x="178" y="${top + 12}" width="92" height="30" fill="#7a4e34"/><rect x="214" y="${top + 24}" width="20" height="5" rx="2" fill="#d9b26a"/>` +
    `<rect x="160" y="${top - 6}" width="34" height="6" rx="2" fill="#3a3f4a"/><path d="M 177 ${top - 6} L 168 ${top - 60} L 196 ${top - 84}" stroke="#3a3f4a" stroke-width="5" fill="none"/>` +
    `<path d="M 186 ${top - 96} L 214 ${top - 78} L 200 ${top - 66} Z" fill="#ffd166"/>`
  // The PC under the desk, its light green, red in the drops.
  const pc =
    `<rect x="340" y="465" width="60" height="80" rx="3" fill="#23262e"/><circle cx="370" cy="500" r="16" fill="#15171c" stroke="#3a3f4a" stroke-width="2"/>` +
    `<circle cx="352" cy="476" r="3" fill="#4fd8a0"><set attributeName="fill" to="${RED}" begin="${lit.on}"/><set attributeName="fill" to="#4fd8a0" begin="${lit.off}"/></circle>`
  // The next desk, inside the screen.
  const at = shownAt(song)[depth - 1]
  const cx = SCREEN.x + SCREEN.w / 2
  const cy = SCREEN.y + SCREEN.h / 2
  const inner =
    depth < DEPTH && at !== undefined
      ? `<g transform="translate(${n1(cx)} ${n1(cy)})"><g transform="scale(0)">` +
        `<animateTransform attributeName="transform" type="scale" values="0;1.15;1" dur="0.5s" begin="${sec(at)}" fill="freeze"/>` +
        `<g transform="translate(${n1(INNER.x - cx)} ${n1(INNER.y - cy)}) scale(${S.toFixed(4)})">${desk(song, depth + 1)}</g></g></g>`
      : ''
  return `${table}${pc}${screen}${inner}`
}

function scene(song: Song) {
  const lit = dropLights(song)
  const glow =
    `<circle cx="300" cy="350" r="150" fill="url(#scrivaniaGlow)" opacity="0">` +
    `<set attributeName="opacity" to="0.7" begin="${lit.on}"/><set attributeName="opacity" to="0" begin="${lit.off}"/></circle>`
  return `${glow}<ellipse cx="300" cy="545" rx="160" ry="6" fill="#000" opacity="0.3"/>${desk(song, 1)}`
}

// ---------- a flying-V guitar for the singer's hand ----------

const FLYING_V = [
  'R.......R',
  'RR.....RR',
  '.RR...RR.',
  '..RRWRR..',
  '...RWR...',
  '....N....',
  '....N....',
  '....N....',
  '....N....',
  '....N....',
  '....N....',
  '....N....',
  '....H....',
  '.........',
  '.........',
]
const FLYING_V_COLORS: Record<string, string> = { R: '#d81b4f', W: '#f4f1ea', N: '#8a5a3a', H: '#2a2a2a' }

export const SCRIVANIA: Scenery = {
  neon: ['LA MIA SCRIVANIA', 'HA UNA SCRIVANIA'],
  defs: DEFS,
  wall: cores,
  prop: scene,
  gadget: { pixels: FLYING_V, colors: FLYING_V_COLORS },
}
