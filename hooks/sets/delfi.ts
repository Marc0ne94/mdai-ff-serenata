import type { Scenery } from '../draw'
import { box, grow, n1, random, sec } from '../draw'
import type { Song } from '../song'

// The scenery of Socrates at Delphi: in the window Mount Parnassus at dusk,
// Apollo's temple on its slope and the oracle's vapours rising, golden rays at
// the finale; beside the singer a marble bust of Socrates, bald, snub-nosed and
// bearded, question marks rising from it; an oil lamp for the singer's hand.

const DEFS = `<defs>
<clipPath id="delfiWindow"><rect x="610" y="20" width="88" height="78"/></clipPath>
<linearGradient id="delfiSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1640"/><stop offset="0.6" stop-color="#5a3a6e"/><stop offset="1" stop-color="#c9707a"/></linearGradient>
<radialGradient id="delfiGlow"><stop offset="0" stop-color="#ffe3a0" stop-opacity="0.75"/><stop offset="1" stop-color="#ffe3a0" stop-opacity="0"/></radialGradient>
<linearGradient id="delfiRay" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.8"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></linearGradient>
</defs>`

// ---------- Parnassus in the window ----------

const TEMPLE = { x: 664, y: 74 }

function parnassus(song: Song) {
  const r = random(113)
  let stars = ''
  for (let i = 0; i < 9; i++) {
    stars += `<circle cx="${n1(613 + r() * 82)}" cy="${n1(23 + r() * 28)}" r="${n1(0.5 + r() * 0.5)}" fill="#fff"><animate attributeName="opacity" values="0.3;1;0.3" dur="${n1(2 + r() * 2)}s" repeatCount="indefinite"/></circle>`
  }
  const mountains =
    `<path d="M 610 80 L 632 46 L 646 62 L 668 34 L 698 70 L 698 98 L 610 98 Z" fill="#2a2142"/>` +
    `<path d="M 610 90 L 640 70 L 660 80 L 698 64 L 698 98 L 610 98 Z" fill="#1c1630"/>`
  // The temple of Apollo, small on the slope: steps, six columns, a pediment.
  const columns = [0, 1, 2, 3, 4, 5].map(i => box(TEMPLE.x - 10 + i * 4, TEMPLE.y - 9, 1.6, 9, '#e8dcc8')).join('')
  const temple =
    box(TEMPLE.x - 12, TEMPLE.y, 25, 2, '#e8dcc8') + columns + box(TEMPLE.x - 12, TEMPLE.y - 11, 25, 2, '#e8dcc8') +
    `<path d="M ${TEMPLE.x - 12} ${TEMPLE.y - 11} L ${TEMPLE.x + 0.5} ${TEMPLE.y - 17} L ${TEMPLE.x + 13} ${TEMPLE.y - 11} Z" fill="#e8dcc8"/>`
  // The oracle's vapours, rising from the temple all song long.
  let vapours = ''
  for (let i = 0; i < 4; i++) {
    const begin = n1(i * 1.1)
    vapours +=
      `<path d="M ${TEMPLE.x} ${TEMPLE.y - 14} q -4 -6 0 -12 q 4 -6 0 -12" stroke="#d9cfe8" stroke-width="1.6" fill="none" opacity="0">` +
      `<animateTransform attributeName="transform" type="translate" values="0 0;${i % 2 ? 4 : -4} -14" dur="4.4s" begin="${begin}s" repeatCount="indefinite"/>` +
      `<animate attributeName="opacity" values="0;0.6;0" dur="4.4s" begin="${begin}s" repeatCount="indefinite"/></path>`
  }
  // The answer: golden rays from the temple through the finale.
  const rays = [-50, -25, 0, 25, 50]
    .map(
      (a, i) =>
        `<polygon points="${TEMPLE.x - 2},${TEMPLE.y - 12} ${TEMPLE.x + 2},${TEMPLE.y - 12} ${TEMPLE.x + 7},${TEMPLE.y - 62} ${TEMPLE.x - 7},${TEMPLE.y - 62}" fill="url(#delfiRay)" transform="rotate(${a} ${TEMPLE.x} ${TEMPLE.y - 12})" opacity="0">` +
        `<animate attributeName="opacity" from="0" to="0.8" begin="${sec(song.finaleAt + i * 0.15)}" dur="1.2s" fill="freeze"/>` +
        `<animate attributeName="opacity" values="0.8;0.4;0.8" dur="${sec(2 * song.beat)}" begin="${sec(song.finaleAt + 1.5)}" end="${sec(song.outroAt + 3)}" repeatCount="indefinite"/></polygon>`,
    )
    .join('')
  return (
    `<rect x="606" y="16" width="96" height="86" fill="#3a2a55"/>` +
    `<g clip-path="url(#delfiWindow)"><rect x="610" y="20" width="88" height="78" fill="url(#delfiSky)"/>${stars}${mountains}${rays}${temple}${vapours}</g>`
  )
}

// ---------- the bust of Socrates beside the singer ----------

const BUST = [
  '...HHHHHH...',
  '..HHHHHHHH..',
  '.HHHHHHHHHH.',
  '.HHKHHHHKHH.',
  '.HHHHNNHHHH.',
  'BHHHHNNHHHHB',
  'BBHHHHHHHHBB',
  'BBBHMMMMHBBB',
  'BBBBBBBBBBBB',
  '.BBBBBBBBBB.',
  '..BBBBBBBB..',
  '...BBBBBB...',
  '....TTTT....',
  '..TTTTTTTT..',
  '.TTTTTTTTTT.',
  'TTTTTTTTTTTT',
]
const BUST_COLORS: Record<string, string> = { H: '#ebe5d8', K: '#5a5048', N: '#d6cebf', B: '#cfc7b6', M: '#9a9080', T: '#ddd6c6' }
const P = 7
const BUST_X = 300 - 6 * P
const BUST_Y = 420 - 16 * P

function bust(song: Song) {
  const pixels = BUST.flatMap((row, y) => [...row].map((c, x) => (BUST_COLORS[c] ? box(BUST_X + x * P, BUST_Y + y * P, P, P, BUST_COLORS[c] ?? '') : ''))).join('')
  // The bust blinks, as a marble that is listening.
  const eyelids =
    `<g opacity="0"><animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.93;0.96;1" dur="5.1s" repeatCount="indefinite"/>` +
    box(BUST_X + 3 * P, BUST_Y + 3 * P, P, P, '#ebe5d8') + box(BUST_X + 8 * P, BUST_Y + 3 * P, P, P, '#ebe5d8') + `</g>`
  const pedestal =
    `<ellipse cx="300" cy="545" rx="80" ry="6" fill="#000" opacity="0.3"/>` +
    `<rect x="240" y="420" width="120" height="12" fill="#e2dccd"/><rect x="250" y="432" width="100" height="98" fill="#d4cdbd"/>` +
    `<rect x="240" y="530" width="120" height="15" fill="#e2dccd"/>`
  // A question rises from it in every line; in the finale, light all around.
  const questions = song.lines
    .slice(0, 4)
    .flatMap(line => [line.start + 0.6, line.start + (line.end - line.start) / 2 + 0.6])
    .map((t, i) => {
      const dx = (i % 2 ? 1 : -1) * (20 + (i % 3) * 10)
      return (
        `<text x="0" y="0" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="44" fill="#ffd27a" opacity="0">?` +
        `<animateTransform attributeName="transform" type="translate" values="300 ${BUST_Y - 10};${300 + dx / 2} ${BUST_Y - 70};${300 + dx} ${BUST_Y - 130}" dur="2.6s" begin="${sec(t)}" fill="freeze"/>` +
        `<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.6;1" dur="2.6s" begin="${sec(t)}" fill="freeze"/></text>`
      )
    })
    .join('')
  const glow =
    `<circle cx="300" cy="${BUST_Y + 50}" r="120" fill="url(#delfiGlow)" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="0.6" begin="${sec(song.finaleAt)}" dur="1.5s" fill="freeze"/>` +
    `<animate attributeName="opacity" values="0.45;0.8;0.45" dur="${sec(2 * song.beat)}" begin="${sec(song.finaleAt + 1.5)}" end="${sec(song.outroAt + 2)}" repeatCount="indefinite"/></circle>`
  // A laurel crown appears on the marble at the finale: the oracle's answer.
  const laurel =
    `<g transform="translate(300 ${BUST_Y + 2})"><g transform="scale(0)">${grow(song.finaleAt + 0.4, 0.8)}` +
    [-34, -22, -10, 10, 22, 34].map((x, i) => `<ellipse cx="${x}" cy="${Math.abs(x) * 0.25 - 4}" rx="7" ry="3.5" fill="${i % 2 ? '#8fbf55' : '#6f9a3f'}" transform="rotate(${x > 0 ? 25 : -25} ${x} ${Math.abs(x) * 0.25 - 4})"/>`).join('') +
    `</g></g>`
  return `${glow}${pedestal}${pixels}${eyelids}${laurel}${questions}`
}

// ---------- the oil lamp for the singer's hand ----------

const LAMP = [
  '.........',
  '.........',
  '.........',
  '.........',
  '......F..',
  '.....FF..',
  '......Y..',
  '..CCCCCN.',
  '.CCCCCCC.',
  '..CCCCC..',
  '...CCC...',
  '....C....',
  '.........',
  '.........',
  '.........',
]
const LAMP_COLORS: Record<string, string> = { F: '#ff7b39', Y: '#ffd166', C: '#b5653a', N: '#8a4a2a' }

export const DELFI: Scenery = {
  neon: ['SO DI NON SAPERE', 'CERCA ANCORA ♥'],
  defs: DEFS,
  wall: parnassus,
  prop: bust,
  gadget: { pixels: LAMP, colors: LAMP_COLORS },
}
