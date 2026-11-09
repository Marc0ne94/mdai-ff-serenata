import type { Scenery } from '../draw'
import { dropLights, inTurn, n1, sec } from '../draw'
import type { Song } from '../song'
import { partsOf } from '../song'

// The scenery of «Fable 5.2»: in the window a night sky full of stars and the
// version, 5.1 until the first drop, 5.2 from it; beside the singer a book of
// fables on a lectern, closed until the first drop, then open on «C'era una
// volta…», its pages turning on every bar of the drops, sparkling; a magic
// wand for the singer's hand.

const SERIF = "Georgia, 'Times New Roman', serif"
const GOLD = '#ffd166'
const PAGE = '#f6ecd2'
const INK = '#5a4632'

const DEFS = `<defs>
<radialGradient id="favolaGlow"><stop offset="0" stop-color="${GOLD}" stop-opacity="0.55"/><stop offset="1" stop-color="${GOLD}" stop-opacity="0"/></radialGradient>
</defs>`

const firstDrop = (song: Song) => partsOf(song, 'drop')[0]?.start ?? song.finaleAt

// ---------- the sky and the version in the window ----------

// The stars drawn with the room's random numbers, as every wall is.
function sky(song: Song, r: () => number) {
  const six = firstDrop(song)
  let stars = ''
  for (let i = 0; i < 9; i++) {
    stars +=
      `<circle cx="${n1(614 + r() * 80)}" cy="${n1(22 + r() * 72)}" r="${n1(0.6 + r() * 0.8)}" fill="#fff6d8">` +
      `<animate attributeName="opacity" values="1;0.3;1" dur="${n1(2 + r() * 2)}s" repeatCount="indefinite"/></circle>`
  }
  const version = inTurn(
    [
      { at: 0, text: '5.1', color: '#8a8aa8' },
      { at: six, text: '5.2', color: GOLD },
    ].map(({ at, text, color }) => ({
      at,
      text,
      attrs: `x="654" y="76" text-anchor="middle" font-family="${SERIF}" font-weight="700" font-size="30" fill="${color}" filter="url(#neon)"`,
    })),
  )
  return (
    `<rect x="606" y="16" width="96" height="86" fill="#2a2140"/><rect x="610" y="20" width="88" height="78" fill="#0d0b24"/>` +
    stars +
    `<text x="654" y="38" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="11" fill="#cfc6ea">Fable</text>` +
    version
  )
}

// ---------- the book of fables beside the singer ----------

function book(song: Song) {
  const six = firstDrop(song)
  const lit = dropLights(song)
  const stand =
    `<ellipse cx="300" cy="545" rx="80" ry="6" fill="#000" opacity="0.35"/>` +
    `<polygon points="270,545 330,545 318,440 282,440" fill="#6b4524"/><rect x="180" y="430" width="240" height="14" rx="4" fill="#8a5a2e"/>`
  // Closed: a blue cover with its title in gold, until the first drop.
  const closed =
    `<g><set attributeName="visibility" to="hidden" begin="${sec(six)}" fill="freeze"/>` +
    `<rect x="190" y="330" width="220" height="100" rx="6" fill="#2b3a8f" stroke="${GOLD}" stroke-width="4"/>` +
    `<rect x="202" y="340" width="196" height="80" rx="3" fill="none" stroke="${GOLD}" stroke-width="1.5"/>` +
    `<text x="300" y="384" text-anchor="middle" font-family="${SERIF}" font-weight="700" font-size="34" fill="${GOLD}">Fable</text>` +
    `<text x="300" y="410" text-anchor="middle" font-family="${SERIF}" font-size="18" fill="${GOLD}">5.2</text></g>`
  // Open: two pages, the first words on the left, lines of text on the right,
  // a page turning over on every bar of the drops.
  const lines = (x: number, from: number) =>
    [0, 1, 2, 3, 4].map(i => `<rect x="${x}" y="${from + i * 13}" width="${i === 4 ? 60 : 96}" height="3" fill="${INK}" opacity="0.45"/>`).join('')
  const turning =
    `<g transform="translate(300 0)"><g><animateTransform attributeName="transform" type="scale" values="1 1;1 1;-1 1" keyTimes="0;0.6;1" dur="${sec(song.bar)}" begin="${lit.on}" end="${lit.off}" repeatCount="indefinite"/>` +
    `<rect x="0" y="330" width="122" height="98" fill="#efe2c2" stroke="#c9b48a" stroke-width="1.5"/>${lines(12, 352)}</g></g>`
  const open =
    `<g visibility="hidden"><set attributeName="visibility" to="visible" begin="${sec(six)}" fill="freeze"/>` +
    `<path d="M 300 334 Q 240 318 172 330 L 172 430 Q 240 418 300 432 Q 360 418 428 430 L 428 330 Q 360 318 300 334 Z" fill="${PAGE}" stroke="#c9b48a" stroke-width="2"/>` +
    `<line x1="300" y1="334" x2="300" y2="432" stroke="#c9b48a" stroke-width="2"/>` +
    `<text x="236" y="366" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="22" fill="${INK}">C'era</text>` +
    `<text x="236" y="396" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="22" fill="${INK}">una volta…</text>` +
    lines(312, 352) +
    turning +
    `</g>`
  // Sparkles over the open book through the drops, and a warm glow.
  let sparkles = ''
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * 2 * Math.PI
    sparkles +=
      `<g transform="translate(${n1(300 + 150 * Math.cos(angle))} ${n1(330 + 90 * Math.sin(angle))})"><use href="#sparkle" fill="#fff3b0" transform="scale(0)">` +
      `<animateTransform attributeName="transform" type="scale" values="0;2.2;0" dur="${sec(2 * (song.pulse ?? song.beat))}" begin="${lit.spans.map(([start]) => sec(start + (i * (song.pulse ?? song.beat)) / 3)).join(';')}" end="${lit.off}" repeatCount="indefinite"/></use></g>`
  }
  const glow =
    `<circle cx="300" cy="370" r="170" fill="url(#favolaGlow)" opacity="0">` +
    `<set attributeName="opacity" to="0.8" begin="${lit.on}" fill="freeze"/><set attributeName="opacity" to="0" begin="${lit.off}" fill="freeze"/></circle>`
  return glow + stand + closed + open + sparkles
}

// ---------- the wand for the singer's hand ----------

const WAND = [
  '....Y....',
  '...YWY...',
  '.YYYWYYY.',
  '..YYYYY..',
  '..YY.YY..',
  '....P....',
  '....P....',
  '....P....',
  '....P....',
  '....P....',
  '....P....',
  '....P....',
  '.........',
  '.........',
  '.........',
]
const WAND_COLORS: Record<string, string> = { Y: GOLD, W: '#ffffff', P: '#8a5cf6' }

export const FAVOLA: Scenery = {
  neon: ['FABLE 5.2', 'FELICI E CONTENTI'],
  defs: DEFS,
  wall: sky,
  prop: book,
  gadget: { pixels: WAND, colors: WAND_COLORS },
}
