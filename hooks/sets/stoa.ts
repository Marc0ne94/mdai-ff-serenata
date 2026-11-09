import type { Scenery } from '../draw'
import { box, grow, n1, random, sec } from '../draw'
import type { Song } from '../song'

// The scenery of the stoics' porch, for Epictetus: in the window a storm, what
// is not up to us, that passes by itself; beside the singer a marble column
// with an owl, Athena's bird of wisdom, watching it calmly; a scroll, the
// Manual, for the singer's hand.

const DEFS = `<defs>
<clipPath id="stoaWindow"><rect x="610" y="20" width="88" height="78"/></clipPath>
<linearGradient id="stoaStorm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#252b3b"/><stop offset="1" stop-color="#4a5468"/></linearGradient>
<linearGradient id="stoaClear" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f93d8"/><stop offset="1" stop-color="#bfe0fb"/></linearGradient>
<linearGradient id="stoaMarble" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfc8b6"/><stop offset="0.5" stop-color="#f2ede0"/><stop offset="1" stop-color="#bdb5a2"/></linearGradient>
<radialGradient id="stoaGlow"><stop offset="0" stop-color="#ffe9a8" stop-opacity="0.8"/><stop offset="1" stop-color="#ffe9a8" stop-opacity="0"/></radialGradient>
</defs>`

// ---------- the sky in the window ----------

const HILLS = 88

function sky(song: Song) {
  const clearing = song.lines[2]?.start ?? song.bloomAt - 6
  // Clear sky from the bloom; evening after the close.
  const clear =
    `<rect x="610" y="20" width="88" height="78" fill="url(#stoaClear)" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="1" begin="${sec(song.bloomAt - 1)}" dur="3s" fill="freeze"/></rect>`
  // Rain, until the storm clears.
  const r = random(71)
  let drops = ''
  for (let i = 0; i < 22; i++) {
    const x = 612 + r() * 90
    const dur = 0.55 + r() * 0.35
    drops += `<line x1="${n1(x)}" y1="0" x2="${n1(x - 2)}" y2="6" stroke="#a9bcd8" stroke-width="0.8" opacity="0.8"><animateTransform attributeName="transform" type="translate" from="0 ${n1(10 + r() * 10)}" to="-8 100" dur="${n1(dur)}s" begin="${n1(r() * dur)}s" repeatCount="indefinite"/></line>`
  }
  const rain = `<g><animate attributeName="opacity" from="1" to="0" begin="${sec(song.bloomAt - 2)}" dur="2s" fill="freeze"/>${drops}</g>`
  // Dark clouds drifting, which thin out and leave as the song goes on.
  const cloud = (x: number, y: number, s: number, drift: number) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><g><animateTransform attributeName="transform" type="translate" from="0 0" to="${drift} 0" dur="${sec(song.bloomAt + 2)}" fill="freeze"/>` +
    `<ellipse cx="0" cy="0" rx="14" ry="6" fill="#3a4152"/><ellipse cx="-8" cy="-3" rx="8" ry="6" fill="#434b5e"/><ellipse cx="7" cy="-4" rx="9" ry="7" fill="#3d4456"/></g></g>`
  const clouds =
    `<g><animate attributeName="opacity" from="1" to="0" begin="${sec(clearing)}" dur="${sec(song.bloomAt - clearing)}" fill="freeze"/>` +
    cloud(628, 30, 1, 30) + cloud(668, 38, 1.2, 40) + cloud(646, 50, 0.9, 50) + `</g>`
  // Two lightnings while the storm lasts, the window flashing with them.
  const lightning = [song.lines[0]?.start ?? 6, (song.lines[1]?.start ?? 12) + 2.5]
    .map(
      t =>
        `<rect x="610" y="20" width="88" height="78" fill="#fff" opacity="0"><animate attributeName="opacity" values="0;0.7;0;0.4;0" dur="0.5s" begin="${sec(t)}"/></rect>` +
        `<path d="M 672 24 L 664 40 L 671 40 L 661 60" stroke="#fff6c8" stroke-width="1.6" fill="none" opacity="0"><animate attributeName="opacity" values="0;1;0;1;0" dur="0.5s" begin="${sec(t)}"/></path>`,
    )
    .join('')
  // The rainbow at the finale, drawn arc by arc.
  const colors = ['#e0245e', '#ff9a3c', '#ffd166', '#7ee787', '#7dd3fc', '#a78bfa']
  const rainbow = colors
    .map((c, i) => {
      const rr = 40 - i * 2.4
      return (
        `<path d="M ${n1(654 - rr)} ${HILLS} A ${n1(rr)} ${n1(rr)} 0 0 1 ${n1(654 + rr)} ${HILLS}" stroke="${c}" stroke-width="2.4" fill="none" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" opacity="0.85">` +
        `<animate attributeName="stroke-dashoffset" from="1" to="0" begin="${sec(song.finaleAt + i * 0.12)}" dur="1.6s" fill="freeze"/></path>`
      )
    })
    .join('')
  // The hills, with an olive tree, and the evening after the close.
  const hills =
    `<path d="M 610 ${HILLS} Q 630 ${HILLS - 6} 650 ${HILLS - 2} Q 672 ${HILLS - 8} 698 ${HILLS - 3} L 698 98 L 610 98 Z" fill="#2f5a3a"/>` +
    `<rect x="684" y="${HILLS - 12}" width="1.6" height="8" fill="#4a3424"/><ellipse cx="685" cy="${HILLS - 13}" rx="5" ry="3.5" fill="#5f7a4a"/>`
  const evening =
    `<rect x="610" y="20" width="88" height="78" fill="#16173a" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="0.75" begin="${sec(song.outroAt)}" dur="3s" fill="freeze"/></rect>`
  let stars = ''
  for (let i = 0; i < 9; i++) {
    stars += `<circle cx="${n1(613 + r() * 82)}" cy="${n1(23 + r() * 40)}" r="${n1(0.5 + r() * 0.5)}" fill="#fff" opacity="0"><animate attributeName="opacity" values="0;1;0.3;1" dur="${n1(2 + r() * 2)}s" begin="${sec(song.outroAt + 2 + r() * 2)}" fill="freeze"/></circle>`
  }
  return (
    `<rect x="606" y="16" width="96" height="86" fill="#3a2a55"/>` +
    `<g clip-path="url(#stoaWindow)">` +
    `<rect x="610" y="20" width="88" height="78" fill="url(#stoaStorm)"/>${clear}${clouds}${lightning}${rainbow}${hills}${rain}${evening}${stars}` +
    `</g>`
  )
}

// ---------- the column and the owl beside the singer ----------

const OWL = [
  '.B........B.',
  '.BB......BB.',
  '.BBBBBBBBBB.',
  'BBWWWBBWWWBB',
  'BBWKWOOWKWBB',
  'BBWWWOOWWWBB',
  '.BBBBOOBBBB.',
  '.BLLLLLLLLB.',
  '.BLDLLLLDLB.',
  '.BLLLDDLLLB.',
  '.BLDLLLLDLB.',
  '..BLLLLLLB..',
  '..BBBBBBBB..',
  '...F....F...',
]
const OWL_COLORS: Record<string, string> = { B: '#8a6a4a', W: '#f4ecd8', K: '#1a1410', O: '#e0a040', L: '#d9c4a0', D: '#a08060', F: '#e0a040' }
// Each pixel of the owl, and where it sits: its feet on the column's top (333).
const P = 7.5
const OWL_X = 300 - 6 * P
const OWL_Y = 333 - 14 * P

const owlPixels = (rows: readonly string[], colors: Record<string, string>, x0: number, y0: number) =>
  rows
    .flatMap((row, y) => [...row].map((c, x) => (colors[c] ? box(x0 + x * P, y0 + y * P, P, P, colors[c] ?? '') : '')))
    .join('')

function column(song: Song) {
  const top = 333
  const flutes = [262, 276, 290, 304, 318, 332].map(x => `<rect x="${x}" y="${top + 28}" width="2" height="${528 - top - 28}" fill="#d6cfbd"/>`).join('')
  const marble =
    `<ellipse cx="300" cy="545" rx="90" ry="6" fill="#000" opacity="0.3"/>` +
    `<rect x="228" y="528" width="144" height="17" fill="#ddd6c6"/><rect x="238" y="520" width="124" height="9" fill="#e8e2d3"/>` +
    `<rect x="252" y="${top + 26}" width="96" height="${520 - top - 26}" fill="url(#stoaMarble)"/>${flutes}` +
    `<path d="M 244 ${top + 12} L 356 ${top + 12} L 346 ${top + 26} L 254 ${top + 26} Z" fill="#e6dfcf"/>` +
    `<rect x="236" y="${top}" width="128" height="12" fill="#f0eadc"/>`
  // The owl: it blinks, bobs to the beat from the first line, holds an olive
  // sprig from the bloom, opens its wings in the finale.
  const eyelids =
    `<g opacity="0"><animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.93;0.96;1" dur="4.3s" repeatCount="indefinite"/>` +
    box(OWL_X + 2 * P, OWL_Y + 3 * P, 3 * P, 3 * P, '#8a6a4a') + box(OWL_X + 7 * P, OWL_Y + 3 * P, 3 * P, 3 * P, '#8a6a4a') + `</g>`
  const wing = (side: -1 | 1) => {
    const x = side < 0 ? OWL_X - 2 * P : OWL_X + 12 * P
    const pivotX = side < 0 ? OWL_X : OWL_X + 12 * P
    return (
      `<g transform="translate(${pivotX} ${OWL_Y + 7 * P})"><g transform="scale(0)">${grow(song.finaleAt, 0.5)}<g>` +
      `<animateTransform attributeName="transform" type="rotate" values="0;${side * -25};0" dur="${sec(song.beat)}" begin="${sec(song.finaleAt + 0.5)}" end="${sec(song.outroAt)}" repeatCount="indefinite"/>` +
      `<g transform="translate(${-pivotX} ${-(OWL_Y + 7 * P)})">${box(x, OWL_Y + 7 * P, 2 * P, 5 * P, '#6e5238')}${box(x + (side < 0 ? 0 : P), OWL_Y + 8 * P, P, 3 * P, '#5a422c')}</g></g></g></g>`
    )
  }
  const sprig =
    `<g transform="translate(${OWL_X + 7 * P} ${OWL_Y + 6 * P}) scale(1.5)"><g transform="scale(0)">${grow(song.bloomAt, 0.8)}` +
    `<line x1="0" y1="0" x2="26" y2="4" stroke="#5a4a2a" stroke-width="2"/>` +
    [[8, 0, -20], [15, 3, 25], [21, 1, -15]].map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="5" ry="2.2" fill="#6f8f4a" transform="rotate(${a} ${x} ${y})"/>`).join('') +
    `<circle cx="26" cy="5" r="2.4" fill="#3d4a2a"/></g></g>`
  const bob = `<animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="${sec(2 * song.beat)}" begin="${sec(song.lines[0]?.start ?? 0)}" end="${sec(song.outroAt + 1)}" repeatCount="indefinite"/>`
  const owl = `<g>${bob}${wing(-1)}${wing(1)}${owlPixels(OWL, OWL_COLORS, OWL_X, OWL_Y)}${eyelids}${sprig}</g>`
  const glow =
    `<circle cx="300" cy="300" r="120" fill="url(#stoaGlow)" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="0.6" begin="${sec(song.finaleAt)}" dur="1.5s" fill="freeze"/>` +
    `<animate attributeName="opacity" values="0.45;0.75;0.45" dur="${sec(2 * song.beat)}" begin="${sec(song.finaleAt + 1.5)}" end="${sec(song.outroAt + 2)}" repeatCount="indefinite"/></circle>`
  const r = random(83)
  let sparkles = ''
  for (let i = 0; i < 7; i++) {
    sparkles += `<g transform="translate(${n1(300 + (r() - 0.5) * 200)} ${n1(300 + (r() - 0.5) * 150)})"><use href="#sparkle" fill="#fff3b0" transform="scale(0)"><animateTransform attributeName="transform" type="scale" values="0;1.3;0" dur="1.5s" begin="${sec(song.finaleAt + r() * 2)}" repeatCount="indefinite"/></use></g>`
  }
  return `${glow}${marble}${owl}${sparkles}`
}

// ---------- the scroll for the singer's hand ----------

const SCROLL = [
  '.........',
  '.........',
  '.........',
  '.KRRRRRK.',
  '..PPPPP..',
  '..PTTTP..',
  '..PPPPP..',
  '..PTTPP..',
  '..PPPPP..',
  '..PTTTP..',
  '..PPPPP..',
  '.KRRRRRK.',
  '....R....',
  '.........',
  '.........',
]
const SCROLL_COLORS: Record<string, string> = { K: '#5a3418', R: '#8a5a2b', P: '#f2e6c4', T: '#8a7a60' }

export const STOA: Scenery = {
  neon: ['DIPENDE DA ME', 'LASCIA ANDARE ♥'],
  defs: DEFS,
  wall: sky,
  prop: column,
  gadget: { pixels: SCROLL, colors: SCROLL_COLORS },
}
