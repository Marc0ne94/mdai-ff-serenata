import type { Scenery } from '../draw'
import { grow, n1, random, sec } from '../draw'
import type { Song } from '../song'

// The scenery of a go-live: a transport travelling from development to quality
// to production on the wall, a calendar counting down to the day beside the
// singer, and the client's phone ringing in the singer's hand.

const GREEN = '#3fb950'
const RED = '#d81b4f'
const MONO = "Menlo, 'SF Mono', monospace"

const DEFS = `<defs>
<radialGradient id="goliveGlow"><stop offset="0" stop-color="#ffd166" stop-opacity="0.8"/><stop offset="1" stop-color="#ffd166" stop-opacity="0"/></radialGradient>
</defs>`

// The transport leaves for quality during the second line, reaches production
// at the bloom, and production goes live at the finale.
const toQualityAt = (song: Song) => (song.lines[1]?.start ?? 0) + 1
const toProductionAt = (song: Song) => song.bloomAt

// ---------- the landscape on the right-hand wall ----------

const SYSTEMS = ['DEV', 'QAS', 'PRD'] as const
const COLUMN = { x: 613, step: 29, w: 26, top: 31, bottom: 93 }
const columnX = (i: number) => COLUMN.x + i * COLUMN.step

function landscape(song: Song) {
  const quality = toQualityAt(song)
  const production = toProductionAt(song)
  const columns = SYSTEMS.map((name, i) => {
    const x = columnX(i)
    return (
      `<rect x="${x}" y="${COLUMN.top}" width="${COLUMN.w}" height="${COLUMN.bottom - COLUMN.top}" rx="2" fill="#1f2540" stroke="#2f3a5e" stroke-width="1"/>` +
      `<text x="${x + COLUMN.w / 2}" y="28" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="6" fill="#9fb4ff">${name}</text>`
    )
  }).join('')
  const arrows = [0, 1]
    .map(i => `<path d="M ${columnX(i) + COLUMN.w + 0.5} 58 l 2.5 2.5 l -2.5 2.5" stroke="#4a5a8a" stroke-width="1.2" fill="none"/>`)
    .join('')
  // Each system's light: development is green from the start; quality turns
  // green once the transport is there; production amber, then green when live.
  const light = (i: number, steps: [number, string][]) =>
    `<circle cx="${columnX(i) + COLUMN.w / 2}" cy="87" r="3" fill="#4a4f63">` +
    steps.map(([t, color]) => `<set attributeName="fill" to="${color}" begin="${sec(t)}" fill="freeze"/>`).join('') +
    `</circle>`
  const lights =
    light(0, [[0, GREEN]]) +
    light(1, [[quality + 0.6, GREEN]]) +
    light(2, [[production + 0.6, '#ffd166'], [song.finaleAt, GREEN]])
  // The transport request, a card that hops from column to column.
  const hop = (from: number, to: number, t: number) =>
    `<animateTransform attributeName="transform" type="translate" values="${from} 0;${(from + to) / 2} -9;${to} 0" dur="0.6s" begin="${sec(t)}" fill="freeze"/>`
  const card =
    `<g>${hop(0, COLUMN.step, quality)}${hop(COLUMN.step, 2 * COLUMN.step, production)}` +
    `<rect x="${columnX(0) + 4}" y="52" width="18" height="12" rx="1.5" fill="#ffd166"/>` +
    `<text x="${columnX(0) + 13}" y="60.5" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="6" fill="#3a2a55">TR</text></g>`
  // Live: production lights up green, with a tick and the word.
  const prd = columnX(2)
  const live =
    `<g opacity="0"><set attributeName="opacity" to="1" begin="${sec(song.finaleAt)}" fill="freeze"/>` +
    `<rect x="${prd}" y="${COLUMN.top}" width="${COLUMN.w}" height="${COLUMN.bottom - COLUMN.top}" rx="2" fill="${GREEN}" opacity="0.25">` +
    `<animate attributeName="opacity" values="0.15;0.4;0.15" dur="${sec(2 * song.beat)}" begin="${sec(song.finaleAt)}" repeatCount="indefinite"/></rect>` +
    `<path d="M ${prd + 7} 41 l 4 4 l 8 -9" stroke="${GREEN}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<text x="${prd + COLUMN.w / 2}" y="78" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="6" fill="${GREEN}">LIVE</text></g>`
  return (
    `<rect x="606" y="16" width="96" height="86" fill="#3a2a55"/><rect x="610" y="20" width="88" height="78" fill="#161a2e"/>` +
    columns + arrows + lights + card + live
  )
}

// ---------- the calendar beside the singer ----------

const CARD = { x: 210, y: 300, w: 180, h: 170, header: 30 }

// One page torn off at the start of each of the first five lines: 5, 4, 3, 2,
// 1, and under the last one the day itself.
function calendar(song: Song) {
  const pageY = CARD.y + CARD.header
  const pageH = CARD.h - CARD.header
  const page = (content: string) =>
    `<rect x="${CARD.x}" y="${pageY}" width="${CARD.w}" height="${pageH}" fill="#f4f1ea" stroke="#d8d2c4" stroke-width="1"/>${content}`
  const number = (text: string, fill: string, size: number) =>
    `<text x="300" y="${pageY + pageH / 2 + size * 0.35}" text-anchor="middle" font-family="'Avenir Next Condensed', Futura, 'Helvetica Neue', sans-serif" font-weight="800" font-size="${size}" fill="${fill}">${text}</text>`
  // The day: GO!, circled in red as the finale starts, beating with the band.
  const circle =
    `<circle cx="300" cy="${pageY + pageH / 2}" r="58" fill="none" stroke="${RED}" stroke-width="6" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" transform="rotate(-90 300 ${pageY + pageH / 2})">` +
    `<animate attributeName="stroke-dashoffset" from="1" to="0" begin="${sec(song.finaleAt + 0.2)}" dur="0.8s" fill="freeze"/></circle>`
  // It beats around its own centre: moved there, scaled, moved back.
  const cy = pageY + pageH / 2
  const go =
    `<g transform="translate(300 ${cy})"><g>` +
    `<animateTransform attributeName="transform" type="scale" values="1;1.04;1" dur="${sec(song.beat)}" begin="${sec(song.finaleAt + 1)}" end="${sec(song.outroAt)}" repeatCount="indefinite"/>` +
    `<g transform="translate(-300 ${-cy})">${page(number('GO!', RED, 64) + circle)}</g></g></g>`
  // The pages above it, the topmost torn first.
  const tear = (t: number) =>
    `<animateTransform attributeName="transform" type="translate" values="0 0;24 40;40 170" keyTimes="0;0.3;1" dur="0.8s" begin="${sec(t)}" fill="freeze"/>` +
    `<animate attributeName="opacity" values="1;1;0" keyTimes="0;0.5;1" dur="0.8s" begin="${sec(t)}" fill="freeze"/>`
  let pages = ''
  for (let k = 4; k >= 0; k--) {
    const t = song.lines[k]?.start ?? song.finaleAt
    pages += `<g>${tear(t)}${page(number(String(5 - k), '#2b2b38', 96))}</g>`
  }
  const header =
    `<rect x="${CARD.x}" y="${CARD.y}" width="${CARD.w}" height="${CARD.header}" rx="4" fill="${RED}"/>` +
    `<text x="300" y="${CARD.y + 21}" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="16" letter-spacing="3" fill="#fff">GO-LIVE</text>` +
    [240, 280, 320, 360].map(x => `<circle cx="${x}" cy="${CARD.y}" r="5" fill="#8d8d9a"/>`).join('')
  const easel =
    `<ellipse cx="300" cy="545" rx="110" ry="7" fill="#000" opacity="0.3"/>` +
    `<line x1="300" y1="${CARD.y + CARD.h - 10}" x2="300" y2="540" stroke="#5a3d30" stroke-width="8"/>` +
    `<line x1="240" y1="${CARD.y + CARD.h - 10}" x2="214" y2="545" stroke="#7a5442" stroke-width="9" stroke-linecap="round"/>` +
    `<line x1="360" y1="${CARD.y + CARD.h - 10}" x2="386" y2="545" stroke="#7a5442" stroke-width="9" stroke-linecap="round"/>` +
    `<rect x="${CARD.x - 8}" y="${CARD.y + CARD.h - 6}" width="${CARD.w + 16}" height="10" rx="3" fill="#7a5442"/>`
  const glow =
    `<circle cx="300" cy="${pageY + pageH / 2}" r="130" fill="url(#goliveGlow)" opacity="0">` +
    `<animate attributeName="opacity" from="0" to="0.6" begin="${sec(song.finaleAt)}" dur="1.2s" fill="freeze"/>` +
    `<animate attributeName="opacity" values="0.45;0.8;0.45" dur="${sec(2 * song.beat)}" begin="${sec(song.finaleAt + 1.2)}" end="${sec(song.outroAt + 2)}" repeatCount="indefinite"/></circle>`
  const r = random(17)
  let sparkles = ''
  for (let i = 0; i < 8; i++) {
    const x = 300 + (r() - 0.5) * 240
    const y = 380 + (r() - 0.5) * 200
    sparkles += `<g transform="translate(${n1(x)} ${n1(y)})"><use href="#sparkle" fill="#fff3b0" transform="scale(0)"><animateTransform attributeName="transform" type="scale" values="0;1.4;0" dur="1.4s" begin="${sec(song.finaleAt + r() * 2)}" repeatCount="indefinite"/></use></g>`
  }
  // The calendar comes onto the stage at the start.
  // (The scale animates a group of its own: an animated transform replaces the
  // element's whole transform, so the position stays on the group around it.)
  return `${glow}${easel}<g transform="translate(300 ${CARD.y + CARD.h})"><g transform="scale(0)">${grow(0.6, 1)}<g transform="translate(-300 ${-(CARD.y + CARD.h)})">${header}${go}${pages}</g></g></g>${sparkles}`
}

// ---------- the client's phone for the singer's hand ----------

const PHONE = [
  '.........',
  '.........',
  '.........',
  '.R......R',
  '..RPPPPR.',
  '...PSSP..',
  '...PSSP..',
  '...PSSP..',
  '...PSSP..',
  '...PSSP..',
  '...PSSP..',
  '...PPPP..',
  '...PPBP..',
  '...PPPP..',
  '.........',
]
const PHONE_COLORS: Record<string, string> = { P: '#2b2b38', S: '#7dd3fc', B: '#8d8d9a', R: '#ffd166' }

export const GOLIVE: Scenery = {
  neon: ['GO-LIVE', 'PER TE ♥'],
  defs: DEFS,
  wall: landscape,
  prop: calendar,
  gadget: { pixels: PHONE, colors: PHONE_COLORS },
}
