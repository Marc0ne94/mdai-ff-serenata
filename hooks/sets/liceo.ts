import type { Scenery } from '../draw'
import { box, n1, random, sec } from '../draw'
import type { Song } from '../song'

// The scenery of Aristotle's Lyceum, where they talked philosophy walking: in
// the window an olive grove in the afternoon, two small Claudes walking
// together along its path, a heart above them at the finale; beside the singer
// two cups on a stone table that toast at the bloom and the finale; and a
// little Claude, a friend, another self, for the singer's hand.

const DEFS = `<defs>
<clipPath id="liceoWindow"><rect x="610" y="20" width="88" height="78"/></clipPath>
<linearGradient id="liceoSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fb8e0"/><stop offset="1" stop-color="#f3d79a"/></linearGradient>
<linearGradient id="liceoSunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4a8a"/><stop offset="1" stop-color="#f29a6a"/></linearGradient>
<radialGradient id="liceoGlow"><stop offset="0" stop-color="#ffd9a0" stop-opacity="0.75"/><stop offset="1" stop-color="#ffd9a0" stop-opacity="0"/></radialGradient>
</defs>`

// ---------- the grove in the window ----------

const PATH_Y = 88

// A small Claude in pixels, walking: its cells of 2, its legs taking steps.
function walker(x: number, beat: number) {
  const o = '#cf7b5c'
  return (
    `<g transform="translate(${x} ${PATH_Y - 10})">` +
    box(0, 0, 8, 5, o) + box(-1.5, 2, 1.5, 1.5, o) + box(8, 2, 1.5, 1.5, o) + box(2, 1.2, 1, 1, '#000') + box(5, 1.2, 1, 1, '#000') +
    `<g>${`<animateTransform attributeName="transform" type="translate" values="0 0;0 -0.8" dur="${sec(beat)}" calcMode="discrete" repeatCount="indefinite"/>`}` +
    box(0.5, 5, 1.5, 3, o) + box(6, 5, 1.5, 3, o) + `</g>` +
    `<g><animateTransform attributeName="transform" type="translate" values="0 -0.8;0 0" dur="${sec(beat)}" calcMode="discrete" repeatCount="indefinite"/>` +
    box(2.5, 5, 1.5, 3, o) + box(4.5, 5, 1.5, 3, o) + `</g></g>`
  )
}

function grove(song: Song) {
  const r = random(127)
  const hills = `<path d="M 610 74 Q 634 62 656 70 Q 678 58 698 66 L 698 98 L 610 98 Z" fill="#8aa05a"/><rect x="610" y="${PATH_Y - 1}" width="88" height="11" fill="#d8c08a"/>`
  let olives = ''
  for (const [x, y] of [[620, 70], [662, 66], [690, 70]] as const) {
    olives += box(x - 1, y, 2, 14, '#6b4a2a') + `<ellipse cx="${x}" cy="${y - 2}" rx="${n1(7 + r() * 2)}" ry="5" fill="#7a8f50"/><ellipse cx="${x + 3}" cy="${y - 4}" rx="4" ry="3" fill="#90a868"/>`
  }
  // The two friends walk across the grove from the first line to the close.
  const walk =
    `<g><animateTransform attributeName="transform" type="translate" from="-30 0" to="70 0" begin="${sec(song.lines[0]?.start ?? 0)}" dur="${sec(song.outroAt - (song.lines[0]?.start ?? 0))}" fill="freeze"/>` +
    walker(616, song.beat) + walker(630, song.beat) +
    // From the bloom they walk hand in hand.
    `<rect x="624" y="${PATH_Y - 8}" width="7" height="1.5" fill="#cf7b5c" opacity="0"><set attributeName="opacity" to="1" begin="${sec(song.bloomAt)}" fill="freeze"/></rect>` +
    `<g transform="translate(627 ${PATH_Y - 20})"><g opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="3s" begin="${sec(song.finaleAt)};${sec(song.finaleAt + 5)}"/>` +
    `<use href="#heart" transform="scale(0.7)" fill="#ff6f91"/></g></g></g>`
  const sunset =
    `<rect x="610" y="20" width="88" height="78" fill="url(#liceoSunset)" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="0.55" begin="${sec(song.outroAt - 2)}" dur="4s" fill="freeze"/></rect>`
  return (
    `<rect x="606" y="16" width="96" height="86" fill="#3a2a55"/>` +
    `<g clip-path="url(#liceoWindow)"><rect x="610" y="20" width="88" height="78" fill="url(#liceoSky)"/>${hills}${olives}${walk}${sunset}</g>`
  )
}

// ---------- the two cups beside the singer ----------

// A kylix, the wide drinking cup, black with a red band.
const kylix = (side: -1 | 1) =>
  `<path d="M -26 0 Q 0 22 26 0 Z" fill="#1f1a18"/><rect x="-26" y="-3" width="52" height="4" rx="2" fill="#1f1a18"/>` +
  `<path d="M -18 6 Q 0 14 18 6" stroke="#c4603a" stroke-width="2.4" fill="none"/>` +
  `<rect x="-3" y="12" width="6" height="12" fill="#1f1a18"/><rect x="-12" y="24" width="24" height="4" rx="2" fill="#1f1a18"/>` +
  `<path d="M ${side * 26} 2 q ${side * 9} 2 ${side * 6} 9" stroke="#1f1a18" stroke-width="3" fill="none"/>`

function cups(song: Song) {
  const table =
    `<ellipse cx="300" cy="545" rx="110" ry="6" fill="#000" opacity="0.3"/>` +
    `<rect x="190" y="470" width="220" height="14" rx="3" fill="#e2dccd"/>` +
    `<rect x="214" y="484" width="18" height="61" fill="#d4cdbd"/><rect x="368" y="484" width="18" height="61" fill="#d4cdbd"/>`
  // They lean in and touch at the bloom and twice in the finale, then sit back.
  const toast = (side: -1 | 1) =>
    [song.bloomAt, song.finaleAt, song.finaleAt + 6]
      .map(t => `<animateTransform attributeName="transform" type="rotate" values="0;${side * -28};${side * -28};0" keyTimes="0;0.3;0.6;1" dur="1.6s" begin="${sec(t)}"/>`)
      .join('')
  const cup = (x: number, side: -1 | 1) =>
    `<g transform="translate(${x} 442)"><g>${toast(side)}${kylix(side)}</g></g>`
  const r = random(131)
  let sparkles = ''
  for (let i = 0; i < 6; i++) {
    const t = [song.bloomAt, song.finaleAt, song.finaleAt + 6][i % 3] ?? song.finaleAt
    sparkles += `<g transform="translate(${n1(300 + (r() - 0.5) * 70)} ${n1(400 + (r() - 0.5) * 50)})"><use href="#sparkle" fill="#fff3b0" transform="scale(0)"><animateTransform attributeName="transform" type="scale" values="0;1.6;0" dur="0.9s" begin="${sec(t + 0.5)}"/></use></g>`
  }
  const glow =
    `<circle cx="300" cy="420" r="120" fill="url(#liceoGlow)" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="0.6" begin="${sec(song.finaleAt)}" dur="1.5s" fill="freeze"/>` +
    `<animate attributeName="opacity" values="0.45;0.8;0.45" dur="${sec(2 * song.beat)}" begin="${sec(song.finaleAt + 1.5)}" end="${sec(song.outroAt + 2)}" repeatCount="indefinite"/></circle>`
  return `${glow}${table}${cup(262, -1)}${cup(338, 1)}${sparkles}`
}

// ---------- a little friend for the singer's hand ----------

const FRIEND = [
  '.........',
  '.........',
  '.........',
  '.........',
  '.........',
  '.........',
  '..OOOOO..',
  '..OKOKO..',
  '.OOOOOOO.',
  '..OOOOO..',
  '..O.O.O..',
  '..O.O.O..',
  '.........',
  '.........',
  '.........',
]
const FRIEND_COLORS: Record<string, string> = { O: '#cf7b5c', K: '#000' }

export const LICEO: Scenery = {
  neon: ['UN ALTRO ME STESSO', 'AMICO ♥'],
  defs: DEFS,
  wall: grove,
  prop: cups,
  gadget: { pixels: FRIEND, colors: FRIEND_COLORS },
}
