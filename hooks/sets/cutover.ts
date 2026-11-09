import type { Scenery } from '../draw'
import { dropLights, inTurn, kickSpans, sec } from '../draw'
import type { Song } from '../song'
import { partsOf, sectionsOf } from '../song'

// The scenery of «Cutover»: in the window a terminal on the production system
// at three in the morning, transports scrolling past, an import bar filling up
// to the first drop, its return code red in each break (RC 8, errors) and
// green in each drop (RC 0), LIVE in the last; beside the singer the switch to
// production, its lever thrown at the first drop, its lamps red until then and
// green after; a can of energy drink for the singer's hand.

const MONO = "Menlo, 'SF Mono', monospace"
const GREEN = '#39ff88'
const RED = '#ff4d4d'
const PALE = '#cfd3e6'

const DEFS = `<defs>
<clipPath id="cutoverLog"><rect x="610" y="33" width="88" height="36"/></clipPath>
<radialGradient id="cutoverGlow"><stop offset="0" stop-color="${GREEN}" stop-opacity="0.5"/><stop offset="1" stop-color="${GREEN}" stop-opacity="0"/></radialGradient>
</defs>`

const beatOf = (song: Song) => song.pulse ?? song.beat

// ---------- the terminal in the window ----------

function terminal(song: Song) {
  const beat = beatOf(song)
  const drops = partsOf(song, 'drop')
  const live = drops.length > 1 ? drops.at(-1) : undefined
  // The transports, scrolling up for ever: twelve lines, twice over, so the loop has no seam.
  let log = ''
  for (let i = 0; i < 24; i++) {
    log += `<text x="614" y="${40 + i * 7}" font-family="${MONO}" font-size="6" fill="#3fae6a">DEVK9001${String(23 + (i % 12) * 7).padStart(2, '0')}  ${i % 5 === 3 ? 'RC 4' : 'OK'}</text>`
  }
  const scroll = `<g clip-path="url(#cutoverLog)"><g><animateTransform attributeName="transform" type="translate" values="0 0;0 -84" dur="${sec(24 * beat)}" repeatCount="indefinite"/>${log}</g></g>`
  // The import bar, from the first line to the first drop.
  const from = song.lines[0]?.start ?? 0
  const full = drops[0]?.start ?? song.finaleAt
  const bar =
    `<rect x="614" y="73" width="80" height="6" fill="none" stroke="${PALE}" stroke-width="1"/>` +
    `<rect x="615" y="74" width="0" height="4" fill="${GREEN}"><animate attributeName="width" from="0" to="78" begin="${sec(from)}" dur="${sec(full - from)}" fill="freeze"/></rect>`
  // The return code: importing in the verses, errors in the breaks, all green
  // in the drops, live in the last.
  const status: { at: number; text: string; color: string }[] = [{ at: 0, text: 'IMPORT…', color: PALE }]
  for (const section of sectionsOf(song)) {
    if (section.part === 'verse' && section.start > 0) status.push({ at: section.start, text: 'IMPORT…', color: PALE })
    if (section.part === 'break') status.push({ at: section.start, text: 'RC 8', color: RED })
    if (section.part === 'drop') status.push({ at: section.start, text: section === live ? 'LIVE ✓' : 'RC 0 ✓', color: GREEN })
  }
  const codes = inTurn(
    status.map(({ at, text, color }) => ({
      at,
      text,
      attrs: `x="654" y="93" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="10" fill="${color}"`,
    })),
  )
  return (
    `<rect x="606" y="16" width="96" height="86" fill="#22252e"/><rect x="610" y="20" width="88" height="78" fill="#03100a"/>` +
    `<text x="614" y="29" font-family="${MONO}" font-size="7" fill="#7fae8f">PRD · 03:00</text>` +
    scroll +
    bar +
    codes
  )
}

// ---------- the switch to production beside the singer ----------

function lever(song: Song) {
  const beat = beatOf(song)
  const first = partsOf(song, 'drop')[0]?.start ?? song.finaleAt
  const lit = dropLights(song)
  const kick = kickSpans(song)
  const panel =
    `<ellipse cx="300" cy="545" rx="115" ry="6" fill="#000" opacity="0.35"/>` +
    `<rect x="200" y="330" width="200" height="215" rx="8" fill="#2a2d36" stroke="#4a4f5c" stroke-width="4"/>` +
    `<text x="300" y="362" text-anchor="middle" font-family="${MONO}" font-weight="700" font-size="20" fill="${PALE}">PRODUZIONE</text>` +
    `<rect x="288" y="378" width="24" height="104" rx="8" fill="#121318"/>`
  // The lever, up until the first drop, then thrown down.
  const handle =
    `<g transform="rotate(-32 300 470)"><animateTransform attributeName="transform" type="rotate" values="-32 300 470;38 300 470" dur="0.25s" begin="${sec(first)}" fill="freeze"/>` +
    `<line x1="300" y1="470" x2="300" y2="385" stroke="#9aa0ad" stroke-width="10" stroke-linecap="round"/>` +
    `<circle cx="300" cy="380" r="18" fill="#e0312e" stroke="#7a1110" stroke-width="3"/></g>` +
    `<circle cx="300" cy="470" r="10" fill="#5a5f6c"/>`
  // The lamps: red until the lever is thrown, then green, lit in turn on the
  // beat while the kick plays.
  const turns = ['1;0.35;0.35', '0.35;1;0.35', '0.35;0.35;1']
  let lamps = ''
  ;[250, 300, 350].forEach((x, i) => {
    lamps +=
      `<circle cx="${x}" cy="515" r="13" fill="${RED}"><set attributeName="fill" to="${GREEN}" begin="${sec(first)}" fill="freeze"/>` +
      `<animate attributeName="opacity" values="${turns[i]}" calcMode="discrete" dur="${sec(3 * beat)}" begin="${kick.begin}" end="${kick.end}" repeatCount="indefinite"/></circle>`
  })
  const glow =
    `<circle cx="300" cy="420" r="160" fill="url(#cutoverGlow)" opacity="0">` +
    `<set attributeName="opacity" to="0.7" begin="${lit.on}" fill="freeze"/><set attributeName="opacity" to="0" begin="${lit.off}" fill="freeze"/></circle>`
  return glow + panel + handle + lamps
}

// ---------- the can for the singer's hand ----------

const CAN = [
  '.........',
  '.........',
  '.........',
  '.........',
  '..SSSSS..',
  '..BBBBB..',
  '..BBLLB..',
  '..BBLBB..',
  '..BLLLB..',
  '..BBLBB..',
  '..BLBBB..',
  '..BBBBB..',
  '..SSSSS..',
  '.........',
  '.........',
]
const CAN_COLORS: Record<string, string> = { S: PALE, B: '#1f4fff', L: '#c8ff00' }

export const CUTOVER: Scenery = {
  neon: ['CUTOVER', 'TUTTO VERDE ✓'],
  defs: DEFS,
  wall: terminal,
  prop: lever,
  gadget: { pixels: CAN, colors: CAN_COLORS },
}
